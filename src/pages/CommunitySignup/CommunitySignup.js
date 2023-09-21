import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Box,
} from "@mui/material";
import { supaClient } from "../../services/supabase";
import "../StaticLayout.css";

const CommunitySignup = () => {
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    has_newsletter: false,
    requests_discord: false,
  });
  const [message, setMessage] = useState({ type: "", message: "" });
  const [disableButton, setDisableButton] = useState(true);

  const handleChange = (prop) => (event) => {
    setMessage({ type: "", message: "" });
    setNewUser({
      ...newUser,
      [prop]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  };

  useEffect(() => {
    if (
      newUser.fullName &&
      newUser.email &&
      (newUser.has_newsletter || newUser.requests_discord)
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [newUser]);

  const handleNewsletterSignup = async (event) => {
    event.preventDefault();

    const tempPassword = Math.random().toString(36).slice(-8);
    // Sign up the new user
    const { data, error } = await supaClient.auth.signUp({
      email: newUser.email,
      password: tempPassword,
      options: {
        data: {
          full_name: newUser.fullName,
          has_newsletter: newUser.has_newsletter,
          requests_discord: newUser.requests_discord,
        },
      },
    });

    if (error) {
      setMessage({ type: "error", message: `${error.message}` });
    } else if (data?.user?.identities?.length === 0) {
      setMessage({
        type: "error",
        message: "This email is already in use. Please use another one.",
      });
    } else {
      let successMessage = "Thank you for signing up to our ";

      if (newUser.has_newsletter && newUser.requests_discord) {
        successMessage += "newsletter and Discord community";
      } else if (newUser.has_newsletter) {
        successMessage += "newsletter";
      } else if (newUser.requests_discord) {
        successMessage += "Discord community";
      }
      successMessage += `, ${newUser.fullName}.`;
      setMessage({
        type: "success",
        message: successMessage,
      });
    }
  };

  return (
    <div className="formContainer">
      {message.type === "success" ? (
        <div>
          <Typography>{message.message}</Typography>
          {newUser && newUser.requests_discord ? (
            <Box>
              <Typography mb={2} mt={2}>
                Creating a safe space for our community members is our top
                priority. Book a screening call with our founder Jie Liang Lin
                below.
              </Typography>
              <Button
                href="https://calendly.com/jielianglin/findhr-discord-intro-call"
                variant="contained"
                className="homeButton"
              >
                Book a call
              </Button>
            </Box>
          ) : (
            <Button href="/" variant="contained" className="homeButton">
              Back to Home
            </Button>
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h5">
            Become part of the MIGR-AI-TION community
          </Typography>
          <Typography mb={1} mt={1}>
            We bring together diverse perspectives to widen our research on
            intersectional discrimination. Join MIGR-AI-TION to share your
            experience, connect with experts and be part of the change.
          </Typography>
          {message.type === "error" && (
            <Alert severity="warning">{message.message}</Alert>
          )}
          <form onSubmit={handleNewsletterSignup}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Enter your name"
              value={newUser.fullName}
              onChange={handleChange("fullName")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Enter your email"
              type="email"
              value={newUser.email}
              onChange={handleChange("email")}
            />
            <Box display="flex" flexDirection="column" mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    onChange={handleChange("has_newsletter")}
                  />
                }
                label="I agree to receiving the Migr-ai-tion newsletter."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    onChange={handleChange("requests_discord")}
                  />
                }
                label="I would like to request access to the Discord community."
              />
              {newUser.requests_discord && (
                <Alert severity="info">
                  Great! You'll be invited to book a short call with our founder
                  before joining Discord.
                </Alert>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={disableButton}
            >
              Join now
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommunitySignup;
