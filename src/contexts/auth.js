import React, { useState, createContext, useContext, useEffect } from "react";
import { supaClient } from "../services/supabase";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);

  const fetchRegistrationStatus = async (userId) => {
    const { data, error } = await supaClient
      .from("user_metadata")
      .select("validated")
      .eq("id", userId)
      .single();

    if (data) {
      setIsRegisteredUser(data.validated);
    } else {
      console.error("Error fetching user metadata:", error);
    }
  };

  useEffect(() => {
    // Sign in or sign out according to Supabase event.
    const getUser = async () => {
      const { data } = await supaClient.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setLoading(false);
    };

    getUser();

    const { subscription } = supaClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!session && event === "SIGNED_OUT") {
          setUser(null);
          setIsRegisteredUser(null);
        } else if (session) {
          if (event === "PASSWORD_RECOVERY") {
            setPasswordRecoveryMode(true);
          }
          setUser(session.user);
          await fetchRegistrationStatus(session.user.id);
        }
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signOut: () => supaClient.auth.signOut(),
    isRegisteredUser,
    user,
    passwordRecoveryMode,
    setPasswordRecoveryMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
