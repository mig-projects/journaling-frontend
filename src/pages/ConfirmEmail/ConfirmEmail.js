import { useLocation } from "react-router-dom";
import "../StaticLayout.css";
import { Button, Typography } from "@mui/material";

const ConfirmEmail = () => {
  const location = useLocation();
  const userType = location.state.type;

  if (userType === "newsletter") {
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
  } else if (userType === "discord") {
    return (
      <div>
        <Typography>
          We've started a Discord to widen our research on intersectional
          perspectives. Join our MIGR-AI-TION to share your perspectives,
          connect with experts and be part of the change!
        </Typography>
        <Typography>
          Creating a safe space for our community members is our top priority.
          Book a screening call with our founder Jie Liang Lin below.
        </Typography>
        <Button href="/" variant="contained" className="homeButton">
          Book a call
        </Button>
      </div>
    );
  }
};

export default ConfirmEmail;
