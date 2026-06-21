"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext(undefined);

const DEMO_EMAIL = "demo@naxusai.app";
const DEMO_PASSWORD = "Demo@12345";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function registerWithEmail(name, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
  }

  async function loginWithEmail(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithDemo() {
    await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerWithEmail,
        loginWithEmail,
        loginWithDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
