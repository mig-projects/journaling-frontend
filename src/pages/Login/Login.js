import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { supaClient } from "../../services/supabase";

import { CircularProgress } from "@mui/material";
import "../StaticLayout.css";

const Login = () => {
  const { user, loading, isRegisteredUser } = useAuth();
  const navigate = useNavigate();

  // Navigate back to home page.
  useEffect(() => {
    if (isRegisteredUser) {
      navigate("/", {
        state: {
          message: {
            type: "info",
            message: "You're logged in!",
          },
        },
      });
    } else if (user && !isRegisteredUser) {
      navigate("/", {
        state: {
          message: {
            type: "info",
            message:
              "You're account is pending approval. Reach out to the website's administrator for more details.",
          },
        },
      });
    }
  }, [user, isRegisteredUser, navigate]);

  return (
    <div className="formContainer">
      {loading && <CircularProgress />}
      {!user && (
        <Auth
          supabaseClient={supaClient}
          providers={[]}
          className="loginForm"
          redirectTo={"https://app.migr-ai-tion.com/reset-password"}
        />
      )}
    </div>
  );
};
export default Login;
