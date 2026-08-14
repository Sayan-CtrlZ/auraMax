"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowRight, Eye, EyeOff, X, HelpCircle, Lock } from "lucide-react";
import GlobalLoader from "@/components/shared/GlobalLoader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);
  const [error, setError] = useState("");

  // Provider conflict resolution state
  const [pendingCred, setPendingCred] = useState(null);
  const [conflictEmail, setConflictEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [showLinkPassword, setShowLinkPassword] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const { signInWithEmail, signInWithGoogle, linkPendingCredential, sendResetPassword } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setPendingCred(null);
    setConflictEmail("");
    try {
      setIsLoading(true);
      setShowGlobalLoader(true);
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/account-exists-with-different-credential") {
        setConflictEmail(err.customData?.email || "");
        setPendingCred(err.customData?.credential || null);
        setError("An account already exists with this email address using Email & Password. Please verify your password below to link Google.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
      setShowGlobalLoader(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!linkPassword) {
      setError("Please enter your password to link your Google account.");
      return;
    }

    try {
      setIsLoading(true);
      setShowGlobalLoader(true);
      await linkPendingCredential(conflictEmail, linkPassword, pendingCred);
      router.push("/");
    } catch (err) {
      console.error("Linking error:", err);
      setError("Invalid password for this account. Please check your credentials and try again.");
      setShowGlobalLoader(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please fill in your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      setShowGlobalLoader(true);
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
      setShowGlobalLoader(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotSuccess("");
    setForgotError("");
    
    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      return;
    }

    try {
      setIsForgotLoading(true);
      await sendResetPassword(forgotEmail);
      setForgotSuccess("A password reset email has been sent! Check your inbox.");
    } catch (err) {
      console.error("Reset password error:", err);
      setForgotError(err.message || "Could not send password reset email.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      <GlobalLoader isVisible={showGlobalLoader} message="Authenticating" subMessage="Verifying credentials with Firebase..." />
      
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-6 py-24 relative overflow-hidden">
        {/* Dynamic ambient shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-100/40 blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-stone-200/40 blur-3xl -z-10" />

        <div className="w-full max-w-md rounded-2xl bg-white p-8 md:p-10 shadow-xl border border-stone-200/40 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="font-serif text-3xl font-bold tracking-widest text-[#8C5E3C] inline-block mb-3">
              AuraMax
            </Link>
            <h2 className="text-xl md:text-2xl font-serif font-medium text-stone-800">Welcome Back</h2>
            <p className="mt-1.5 text-stone-500 text-sm">Step back into your personalized beauty profile</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Conflict linking flow */}
          {pendingCred ? (
            <form onSubmit={handleLinkSubmit} className="space-y-5">
              <div className="p-4 bg-amber-50/75 border border-amber-200 rounded-xl mb-4 text-stone-700 text-sm flex items-start space-x-2">
                <HelpCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                <span>
                  To complete linking Google authentication, confirm the password for <strong>{conflictEmail}</strong>.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showLinkPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={linkPassword}
                    onChange={(e) => setLinkPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/40 bg-stone-50/50 focus:bg-white transition-all pr-10 disabled:opacity-70" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowLinkPassword(!showLinkPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-600"
                  >
                    {showLinkPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setPendingCred(null);
                    setConflictEmail("");
                    setError("");
                    setLinkPassword("");
                  }}
                  className="w-1/3 py-3 border border-stone-200 text-stone-750 font-medium rounded-xl text-sm hover:bg-stone-50 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 bg-[#8C5E3C] hover:bg-[#704A2E] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <span>Link Google</span>
                      <Lock size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Social Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 mb-6 border border-stone-300 hover:border-stone-400 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm disabled:opacity-70 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative mb-6 flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-xs text-stone-400 uppercase tracking-wider absolute">Or sign in with email</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/40 bg-stone-50/50 focus:bg-white transition-all disabled:opacity-70" 
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-amber-705 hover:underline cursor-pointer bg-transparent border-0 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/40 bg-stone-50/50 focus:bg-white transition-all pr-10 disabled:opacity-70" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#8C5E3C] hover:bg-[#704A2E] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 active:scale-[0.98] mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              New to AuraMax?{" "}
              <Link href="/signup" className="text-amber-700 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 border border-stone-250 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess("");
                setForgotError("");
                setForgotEmail("");
              }}
              className="absolute top-4 right-4 p-1.5 text-stone-450 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-serif font-medium text-stone-850 mb-2">Reset Password</h3>
            <p className="text-stone-500 text-sm mb-6">
              Enter your email address below, and we'll send you instructions to reset your password.
            </p>

            {forgotError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs">
                  {forgotSuccess}
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess("");
                    setForgotEmail("");
                  }}
                  className="w-full py-2.5 bg-[#8C5E3C] text-white text-sm font-medium rounded-xl hover:bg-[#704A2E] transition-all cursor-pointer text-center block"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={isForgotLoading}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/40 bg-stone-50/50 focus:bg-white transition-all disabled:opacity-70"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-[#8C5E3C] hover:bg-[#704A2E] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 active:scale-[0.98] cursor-pointer"
                >
                  {isForgotLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
