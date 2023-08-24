import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { supaClient } from "../../services/supabase";

import { CircularProgress } from "@mui/material";
import "./Login.css";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Navigate back to home page.
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [user]);

  return (
    <div className="loginContainer">
      {loading && <CircularProgress />}
      {!user && (
        <Auth
          supabaseClient={supaClient}
          providers={[]}
          className="loginForm"
        />
      )}
      {user && <span>You're logged in!</span>}
    </div>
  );
};
export default Login;
