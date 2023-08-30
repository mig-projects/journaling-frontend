import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/auth";
import { supaClient } from "../../services/supabase";

// import "./RecoverPassword.css";

const RecoverPassword = () => {
  const { user, loading, setPasswordRecoveryMode } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  console.log(user);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const { error } = await supaClient.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.log(error.message);
    } else {
      console.log("Password updated successfully.");
      setPasswordRecoveryMode(false);
    }
  };

  useEffect(() => {
    // Enable the submit button only if both passwords match and are not empty
    setDisableButton(
      newPassword !== confirmPassword || newPassword.length === 0
    );
  }, [newPassword, confirmPassword]);

  return (
    <div className="loginContainer">
      {loading ? (
        <CircularProgress />
      ) : !user ? (
        <span>
          You're not logged in. Contact your administrator to renew your
          password.
        </span>
      ) : (
        <div>
          <Typography variant="h5">Update Password</Typography>
          <form onSubmit={handleUpdatePassword}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={disableButton}
            >
              Update Password
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
export default RecoverPassword;
