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
  const [userType, setUserType] = useState("");

  const fetchRegistrationStatus = async (userId) => {
    const { data, error } = await supaClient
      .from("user_metadata")
      .select(`validated, has_newsletter, requests_discord`)
      .eq("id", userId)
      .single();

    if (data) {
      setIsRegisteredUser(data.validated);
      setUserType(
        data.validated
          ? "app-user"
          : data.requests_discord
          ? "discord"
          : data.has_newsletter
          ? "newsletter"
          : ""
      );
    } else {
      console.error("Error fetching user metadata:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = supaClient.auth.getSession();

        if (session) {
          const { data, error } = await supaClient.auth.getUser();

          if (error) {
            console.error("Error fetching user:", error);
            setLoading(false);
            return;
          }

          const { user: currentUser } = data;
          setUser(currentUser ?? null);
          setLoading(false);
        } else {
          // Session has expired, sign out the user
          supaClient.auth.signOut();
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setLoading(false);
      }
    };

    getUser();

    // Handle sign in, sign out, and password recovery with event listening.
    const { subscription } = supaClient.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (!session && event === "SIGNED_OUT") {
            setUser(null);
            setIsRegisteredUser(null);
          } else if (session) {
            if (event === "PASSWORD_RECOVERY") {
              setPasswordRecoveryMode(true);
            }
            setLoading(true);
            setUser(session.user);
            await fetchRegistrationStatus(session.user.id);
            setLoading(false);
          }
        } catch (err) {
          console.error("An error occurred during auth state change:", err);
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
    userType,
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
