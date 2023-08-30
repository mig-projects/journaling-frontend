import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/auth";
import { supaClient } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const RecoverPassword = () => {
  const { user, loading, passwordRecoveryMode, setPasswordRecoveryMode } =
    useAuth();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    if (!user) {
      setPasswordRecoveryMode(false);
      navigate("/");
    }
  }, [user]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const { error } = await supaClient.auth.updateUser({
      password: passwords.newPassword,
    });

    if (!error) {
      setPasswordRecoveryMode(false);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  useEffect(() => {
    const { newPassword, confirmPassword } = passwords;
    setDisableButton(
      newPassword !== confirmPassword || newPassword.length === 0
    );
  }, [passwords]);

  const handleChange = (prop) => (event) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  return (
    <div className="loginContainer">
      {loading ? (
        <CircularProgress />
      ) : !passwordRecoveryMode ? (
        <Typography>Your password has been updated.</Typography>
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
              value={passwords.newPassword}
              onChange={handleChange("newPassword")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm password"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange("confirmPassword")}
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
