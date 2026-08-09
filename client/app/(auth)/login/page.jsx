"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResultStore } from "@/store/useResultStore";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import GlobalLoader from "@/components/shared/GlobalLoader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);
  const [error, setError] = useState("");
  
  const login = useResultStore((state) => state.login);
  const router = useRouter();

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
      await new Promise(r => setTimeout(r, 5000));
      await login(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalLoader isVisible={showGlobalLoader} message="Authenticating" subMessage="Verifying credentials..." />
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
              <a href="#" className="text-xs text-amber-700 hover:underline">Forgot password?</a>
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
            className="w-full py-3 bg-[#8C5E3C] hover:bg-[#704A2E] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 active:scale-[0.98] mt-2"
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
    </>
  );
}
