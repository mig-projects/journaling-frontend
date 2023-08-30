import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { supaClient } from "../../services/supabase";

import { CircularProgress } from "@mui/material";
import "./Login.css";

const Login = () => {
  const { user, loading, isRegisteredUser } = useAuth();
  const navigate = useNavigate();

  // Navigate back to home page.
  useEffect(() => {
    if (isRegisteredUser) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [isRegisteredUser]);

  return (
    <div className="loginContainer">
      {loading ? (
        <CircularProgress />
      ) : !user ? (
        <Auth
          supabaseClient={supaClient}
          providers={[]}
          className="loginForm"
          redirectTo={
            "https://https://quiet-kelpie-4caf69.netlify.app/reset-password"
          }
        />
      ) : isRegisteredUser ? (
        <span>You're logged in!</span>
      ) : (
        <span>
          You're account is pending approval. Reach out to the website's
          administrator for more details.
        </span>
      )}
    </div>
  );
};
export default Login;
