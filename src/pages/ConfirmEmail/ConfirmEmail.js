import "../StaticLayout.css";
import { Button, Typography } from "@mui/material";

const ConfirmEmail = () => {
  return (
    <div className="formContainer">
      <Typography>
        Thank you for signing up to the Migr-ai-tion newsletter!
      </Typography>
      <Typography>Your email is now verified.</Typography>
      <br />
      <Button href="/" variant="contained" className="homeButton">
        Back to Home
      </Button>
    </div>
  );
};

export default ConfirmEmail;
