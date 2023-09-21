import { useParams } from "react-router-dom";
import "../StaticLayout.css";
import { Box, Button, Typography } from "@mui/material";

const ConfirmEmail = ({ match }) => {
  const { userType } = useParams();

  return (
    <div className="formContainer">
      <Typography>
        Thank you for signing up to the Migr-ai-tion newsletter!
      </Typography>
      <Typography>Your email is now verified.</Typography>
      <br />
      {userType === "discord" ? (
        <Box>
          <Typography mb={2}>
            Have you booked your call to join the Discord yet? If not, please
            use the link below.
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
  );
};

export default ConfirmEmail;
