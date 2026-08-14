"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        localStorage.setItem("auraMax_logged_in", "true");
      } else {
        localStorage.removeItem("auraMax_logged_in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      setUser({ ...userCredential.user, displayName });
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up with Email", error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with Email", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("auraMax_logged_in");
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  const linkGoogle = async () => {
    if (!auth.currentUser) throw new Error("No user currently logged in.");
    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Error linking Google provider", error);
      throw error;
    }
  };

  const linkEmail = async (password) => {
    if (!auth.currentUser) throw new Error("No user currently logged in.");
    if (!auth.currentUser.email) throw new Error("Current user does not have an email address associated.");
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      const result = await linkWithCredential(auth.currentUser, credential);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Error linking Email provider", error);
      throw error;
    }
  };

  const changePassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error("No user currently logged in.");
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error("Error updating password", error);
      throw error;
    }
  };

  const reauthenticateUser = async (currentPassword) => {
    if (!auth.currentUser) throw new Error("No user currently logged in.");
    if (!auth.currentUser.email) throw new Error("Current user does not have an email address associated.");
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      const result = await reauthenticateWithCredential(auth.currentUser, credential);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Error reauthenticating user", error);
      throw error;
    }
  };

  const sendResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email", error);
      throw error;
    }
  };

  const linkPendingCredential = async (email, password, pendingCredential) => {
    try {
      // 1. Sign in with email and password first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 2. Link Google credential
      const result = await linkWithCredential(userCredential.user, pendingCredential);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Error linking pending credential", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signUpWithEmail, 
      signInWithEmail, 
      signOut,
      linkGoogle,
      linkEmail,
      changePassword,
      reauthenticateUser,
      sendResetPassword,
      linkPendingCredential
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


