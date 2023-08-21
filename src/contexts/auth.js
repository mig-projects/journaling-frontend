import React, { useState, createContext, useContext, useEffect } from "react";
import { supaClient } from "../services/supabase";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from local storage, if already logged in.
    let gotSession = localStorage.getItem("authSession");
    if (gotSession) {
      gotSession = JSON.parse(gotSession);
      setAuthSession(gotSession);
      setUser(gotSession?.user);
    }
    // Sign in or sign out according to Supabase event.
    const { subscription } = supaClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!session && event === "SIGNED_OUT") {
          localStorage.removeItem("authSession");
          setAuthSession(null);
          setUser(null);
        } else if (session) {
          setAuthSession(session);
          setUser(session?.user);
          localStorage.setItem("authSession", JSON.stringify(session));
        }
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const value = {
    // signUp: (data) => supaClient.auth.signUp(data),
    signOut: () => supaClient.auth.signOut(),
    user: user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
