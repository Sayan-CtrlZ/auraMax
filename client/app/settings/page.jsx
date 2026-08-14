"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield, Key, CheckCircle, AlertTriangle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GlobalLoader from "@/components/shared/GlobalLoader";

export default function SettingsPage() {
  const { 
    user, 
    loading, 
    linkGoogle, 
    linkEmail, 
    changePassword, 
    reauthenticateUser 
  } = useAuth();
  const router = useRouter();

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);
  const [globalLoaderMessage, setGlobalLoaderMessage] = useState("");
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Set Password States (Google User adding Password login)
  const [showSetPasswordForm, setShowSetPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Change Password States (Email/Password User modifying Password)
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [changePasswordVal, setChangePasswordVal] = useState("");
  const [confirmChangePasswordVal, setConfirmChangePasswordVal] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <Loader2 className="animate-spin text-[#8C5E3C]" size={40} />
      </div>
    );
  }

  // Parse linked providers
  const providers = user.providerData.map((p) => p.providerId);
  const isGoogleConnected = providers.includes("google.com");
  const isEmailConnected = providers.includes("password");

  const handleConnectGoogle = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setGlobalLoaderMessage("Connecting your Google Account...");
    setShowGlobalLoader(true);
    try {
      await linkGoogle();
      setSuccessMessage("Google account connected successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/credential-already-in-use") {
        setErrorMessage("This Google account is already linked to another user profile.");
      } else {
        setErrorMessage(err.message || "Failed to link Google account.");
      }
    } finally {
      setShowGlobalLoader(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setGlobalLoaderMessage("Configuring Password login...");
    setShowGlobalLoader(true);
    try {
      await linkEmail(newPassword);
      setSuccessMessage("Password configuration complete! You can now log in using either method.");
      setShowSetPasswordForm(false);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to set password.");
    } finally {
      setShowGlobalLoader(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }
    if (!changePasswordVal || changePasswordVal.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }
    if (changePasswordVal !== confirmChangePasswordVal) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setGlobalLoaderMessage("Updating security settings...");
    setShowGlobalLoader(true);
    try {
      // 1. Reauthenticate first to satisfy security constraints
      await reauthenticateUser(currentPassword);
      // 2. Perform the password change
      await changePassword(changePasswordVal);
      
      setSuccessMessage("Password updated successfully!");
      setShowChangePasswordForm(false);
      setCurrentPassword("");
      setChangePasswordVal("");
      setConfirmChangePasswordVal("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setErrorMessage("Invalid current password. Please verify and try again.");
      } else {
        setErrorMessage(err.message || "Failed to change password.");
      }
    } finally {
      setShowGlobalLoader(false);
    }
  };

  return (
    <>
      <GlobalLoader isVisible={showGlobalLoader} message={globalLoaderMessage} subMessage="Synchronizing credentials with Firebase security..." />

      <div className="min-h-screen bg-[#FAF6F0] px-6 py-28 relative overflow-hidden">
        {/* Decorative backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-100/30 blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-stone-200/30 blur-3xl -z-10" />

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/" className="inline-flex items-center space-x-1.5 text-stone-500 hover:text-stone-800 text-sm font-medium mb-3 transition-colors">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl font-serif font-bold text-stone-850">Account & Security</h1>
              <p className="text-stone-550 text-sm mt-1">Manage your active login methods and authentication settings</p>
            </div>
            <Shield className="text-[#8C5E3C]/20 hidden md:block" size={64} />
          </div>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-150 text-green-700 text-sm flex items-center space-x-2">
              <CheckCircle size={18} className="flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-150 text-red-700 text-sm flex items-center space-x-2">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* User Details */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-stone-200/40 mb-6">
            <h2 className="text-lg font-serif font-semibold text-stone-800 border-b border-stone-100 pb-3 mb-4">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-stone-700 font-medium block mt-0.5">{user.displayName || "AuraMax User"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-stone-700 font-medium block mt-0.5">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Provider Settings */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-stone-200/40 space-y-6">
            <h2 className="text-lg font-serif font-semibold text-stone-800 border-b border-stone-100 pb-3 mb-2">Login Methods</h2>

            {/* Google Provider Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-stone-100/60">
              <div className="flex items-start space-x-3 mb-3 md:mb-0">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-stone-850 text-sm">Google Authentication</h3>
                  <p className="text-xs text-stone-500">Sign in securely with your verified Google credentials</p>
                </div>
              </div>
              <div>
                {isGoogleConnected ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={handleConnectGoogle}
                    className="px-4 py-2 border border-stone-250 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-750 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Connect Google
                  </button>
                )}
              </div>
            </div>

            {/* Email & Password Info */}
            <div className="flex flex-col py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-start space-x-3 mb-3 md:mb-0">
                  <Key className="text-stone-450 mt-0.5 flex-shrink-0" size={22} />
                  <div>
                    <h3 className="font-semibold text-stone-850 text-sm">Email & Password</h3>
                    <p className="text-xs text-stone-500">Sign in with standard email and secure password credentials</p>
                  </div>
                </div>
                <div>
                  {isEmailConnected ? (
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        Connected
                      </span>
                      <button
                        onClick={() => {
                          setShowChangePasswordForm(!showChangePasswordForm);
                          setShowSetPasswordForm(false);
                        }}
                        className="px-4 py-2 border border-stone-250 hover:border-stone-450 bg-white hover:bg-stone-50 text-[#8C5E3C] text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowSetPasswordForm(!showSetPasswordForm);
                        setShowChangePasswordForm(false);
                      }}
                      className="px-4 py-2 bg-[#8C5E3C] hover:bg-[#704A2E] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Set Password
                    </button>
                  )}
                </div>
              </div>

              {/* Set Password Form */}
              {showSetPasswordForm && (
                <form onSubmit={handleSetPassword} className="bg-stone-50/70 border border-stone-200/50 rounded-xl p-5 mt-2 space-y-4 animate-slide-down">
                  <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Set Account Password</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-2 text-stone-400 hover:text-stone-600"
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSetPasswordForm(false);
                        setNewPassword("");
                        setConfirmNewPassword("");
                      }}
                      className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#8C5E3C] hover:bg-[#704A2E] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Save Password
                    </button>
                  </div>
                </form>
              )}

              {/* Change Password Form */}
              {showChangePasswordForm && (
                <form onSubmit={handleChangePassword} className="bg-stone-50/70 border border-stone-200/50 rounded-xl p-5 mt-2 space-y-4 animate-slide-down">
                  <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Update Account Password</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-2 text-stone-400 hover:text-stone-600"
                        >
                          {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showChangePassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={changePasswordVal}
                          onChange={(e) => setChangePasswordVal(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowChangePassword(!showChangePassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-2 text-stone-400 hover:text-stone-600"
                        >
                          {showChangePassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmChangePasswordVal}
                        onChange={(e) => setConfirmChangePasswordVal(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePasswordForm(false);
                        setCurrentPassword("");
                        setChangePasswordVal("");
                        setConfirmChangePasswordVal("");
                      }}
                      className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#8C5E3C] hover:bg-[#704A2E] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
