import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { supaClient } from "../../services/supabase";

import { CircularProgress } from "@mui/material";
import "../StaticLayout.css";

const Signup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Navigate back to home page after successful sign-up.
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/"); // redirect to home page
      }, 1500);
    }
  }, [user]);

  return (
    <div className="formContainer">
      {loading && <CircularProgress />}
      {!user && (
        <Auth
          supabaseClient={supaClient}
          view="sign_up"
          providers={[]}
          className="signupForm"
        />
      )}
      {user && <span>Congratulations! You're a signed up user.</span>}
    </div>
  );
};

export default Signup;
