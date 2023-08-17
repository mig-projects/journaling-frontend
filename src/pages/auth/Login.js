import React, { useContext, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { AuthContext } from "../../contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export default function Login() {
  const { authSession, setAuthSession, supaClient, setSupaClient } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize client
  useEffect(() => {
    if (!supaClient) {
      setSupaClient(createClient(supabaseURL, supabaseKey));
    }
  }, [supaClient]);

  // Listen to change on Auth State
  useEffect(() => {
    if (!supaClient) return;

    const {
      data: { subscription },
    } = supaClient.auth.onAuthStateChange((_event, newSession) => {
      setAuthSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [supaClient]);

  // Navigate back to home page.
  useEffect(() => {
    if (authSession) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [authSession, navigate]);

  if (!supaClient) {
    return <div>Connecting...</div>;
  } else {
    if (!authSession) {
      return (
        <Auth supabaseClient={supaClient} providers={["google", "facebook"]} />
      );
    } else {
      return <div>Logged in!</div>;
    }
  }
}
