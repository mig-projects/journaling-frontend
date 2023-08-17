import React, { useState, createContext } from "react";

export const AuthContext = createContext({
  authSession: null,
  setAuthSession: () => {},
  supaClient: null,
  setSupaClient: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState(null);
  const [supaClient, setSupaClient] = useState(null);

  return (
    <AuthContext.Provider
      value={{ authSession, setAuthSession, supaClient, setSupaClient }}
    >
      {children}
    </AuthContext.Provider>
  );
};
