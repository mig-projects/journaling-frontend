import React, { useState, createContext, useContext, useEffect } from "react";
import { supaClient } from "../services/supabase";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    // Sign in or sign out according to Supabase event.
    setLoading(true);
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
        } else if (session) {
          setUser(session.user);
        }
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    // signUp: (data) => supaClient.auth.signUp(data),
    signOut: () => supaClient.auth.signOut(),
    user: user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
