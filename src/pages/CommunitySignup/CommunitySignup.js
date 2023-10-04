import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Box,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import { supaClient } from "../../services/supabase";
import "../StaticLayout.css";
import { textFormTheme } from "../../themes/theme";

const CommunitySignup = () => {
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    has_newsletter: false,
  });
  const [loading, setLoading] = useState(false);
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
    if (newUser.fullName && newUser.email && newUser.has_newsletter) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [newUser]);

  const handleNewsletterSignup = async (event) => {
    event.preventDefault();
    setLoading(true);

    const tempPassword = Math.random().toString(36).slice(-8);
    // Sign up the new user
    const { data, error } = await supaClient.auth.signUp({
      email: newUser.email,
      password: tempPassword,
      options: {
        data: {
          full_name: newUser.fullName,
          has_newsletter: newUser.has_newsletter,
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
      let successMessage = `Thank you for signing up to our newsletter, ${newUser.fullName}.`;
      setMessage({
        type: "success",
        message: successMessage,
      });
    }
    setLoading(false);
  };

  return (
    <div className="formContainer">
      {loading && <CircularProgress />}
      {message.type === "success" ? (
        <div>
          <ThemeProvider theme={textFormTheme}>
            <Typography mb={2}>{message.message}</Typography>

            <Button href="/" variant="contained" className="homeButton">
              Back to Home
            </Button>
          </ThemeProvider>
        </div>
      ) : (
        <div>
          <ThemeProvider theme={textFormTheme}>
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
          </ThemeProvider>
        </div>
      )}
    </div>
  );
};

export default CommunitySignup;
