import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { supaClient } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const CommunitySignup = () => {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (prop) => (event) => {
    setNewUser({ ...newUser, [prop]: event.target.value });
  };

  useEffect(() => {
    if (newUser.fullName && newUser.email) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [newUser]);

  const handleNewsletterSignup = async (event) => {
    event.preventDefault();

    // Insert the new user
    const { data, error } = await supaClient.from("community_users").insert([
      {
        full_name: newUser.fullName,
        email: newUser.email,
        has_newsletter: true,
      },
    ]);

    if (error) {
      // Check if the error is due to a unique violation
      if (error.code === "23505") {
        setMessage("This email is already in use. Please use another one.");
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage(
        "You've signed up for our newsletter! We will now need to confirm your email address. Please check your inbox for a verification email."
      );
      setNewUser({ fullName: "", email: "" });
    }
  };

  return (
    <div className="formContainer">
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Typography variant="h5">Sign-up to our newsletter</Typography>
          <form onSubmit={handleNewsletterSignup}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Your Full Name"
              value={newUser.fullName}
              onChange={handleChange("fullName")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Your Email"
              type="email"
              value={newUser.email}
              onChange={handleChange("email")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={disableButton}
            >
              Join the community
            </Button>
            {message && <p>{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default CommunitySignup;
