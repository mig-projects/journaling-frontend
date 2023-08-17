import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export const useAuth = () => {
  const { authSession, setAuthSession, supaClient, setSupaClient } =
    useContext(AuthContext);

  const handleLogout = async () => {
    const { error } = await supaClient.auth.signOut();
    if (error) {
      return <div>Sign out failed. Contact your administrator.</div>;
    } else {
      setAuthSession(null);
    }
  };

  return {
    authSession,
    handleLogout,
  };
};

export default useAuth;
