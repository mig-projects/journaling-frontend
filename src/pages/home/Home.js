import React, { useEffect, useState } from "react";

import UploadForm from "../../features/upload/UploadForm";

import upload from "../../pics/upload-white.png";
import discovery from "../../pics/discovery-white.png";
import findhrPic from "../../pics/FINDHR.png";
import EU from "../../pics/EU-logo.jpg";
import BMBF from "../../pics/BMBF-logo.png";
import PTF from "../../pics/PTF-logo.png";
import HTW from "../../pics/HTW-logo.jpg";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

import Chip from "@mui/material/Chip";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PeopleIcon from "@mui/icons-material/People";

import "./Home.css";
import { useAuth } from "../../contexts/auth";
import { Alert, CircularProgress, Link } from "@mui/material";
import RecoverPassword from "../RecoverPassword/RecoverPassword";
import { supaClient } from "../../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const [uploadMode, setUploadMode] = useState(false);
  const [anchorElUpload, setAnchorElUpload] = useState(null);
  const [anchorElDiscover, setAnchorElDiscover] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const { isRegisteredUser, loading, passwordRecoveryMode, userType } =
    useAuth();

  const location = useLocation();

  useEffect(() => {
    // This handles the case where a non-registered user gets signed in by confirmation URL.
    const signOutAndRedirect = async (userType) => {
      await supaClient.auth.signOut();
      navigate(`/confirm-email/${userType}`);
    };

    if (userType === "newsletter") {
      signOutAndRedirect(userType);
    }
  }, [isRegisteredUser, userType, navigate]);

  useEffect(() => {
    if (location.state && location.state.message) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location, setShowAlert]);

  const showUpload = () => {
    setUploadMode(true);
  };

  const showDiscover = () => {
    navigate("/dashboard");
  };

  const showUploadPopover = (event) => {
    setAnchorElUpload(event.currentTarget);
  };

  const hideUploadPopover = () => {
    setAnchorElUpload(null);
  };

  const showDiscoverPopover = (event) => {
    setAnchorElDiscover(event.currentTarget);
  };

  const hideDiscoverPopover = () => {
    setAnchorElDiscover(null);
  };

  const openUploadPopover = Boolean(anchorElUpload);
  const openDiscoverPopover = Boolean(anchorElDiscover);

  if (loading) {
    return <CircularProgress />;
  } else if (passwordRecoveryMode) {
    return <RecoverPassword />;
  } else if (uploadMode) {
    return <UploadForm />;
  } else {
    return (
      <>
        <div className="mainContainer">
          {showAlert && (
            <Alert
              severity={location.state.message.type}
              className="alertMessage"
            >
              {location.state.message.message}
            </Alert>
          )}
          <div className="coverPicDiv">
            <img src={findhrPic} alt="findhr-logo" className="coverImg" />
          </div>

          <div className="mainBox">
            <Typography className="introText">
              Welcome to{" "}
              <span className="important-words">
                MIGR-AI-TION's Research App
              </span>
              . We're investigating connections between organizational and
              hiring AI discrimination for the{" "}
              <span className="important-words">FINDHR project</span>. Start by{" "}
              <span className="highlight">journaling</span> your personal
              experiences. Your insights shape a live dashboard{" "}
              <span className="highlight">visualization</span> shared with other
              participants. Contribute to constructing a fairness ontology,
              qualitative dataset, and identifying intersectional challenges.
              Our <span className="highlight">LLM-powered tool</span>{" "}
              illustrates collective experiences, guiding intersectional
              fairness recommendations. This research empowers developers,
              researchers, and EU policy makers to create ethical, inclusive{" "}
              <span className="important-words">hiring AI</span>.
            </Typography>

            <hr />
          </div>
          {isRegisteredUser && (
            <div className="gridDiv">
              <Grid container spacing={0} className="gridContainer">
                {isRegisteredUser && (
                  <Grid item xs={12} sm={5} className="uploadGrid">
                    <button className="button" onClick={showUpload}>
                      <img
                        src={upload}
                        alt="upload"
                        className="uploadIcon"
                        onMouseEnter={showUploadPopover}
                        onMouseLeave={hideUploadPopover}
                      />
                    </button>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: "none",
                      }}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          backgroundColor: "transparent",
                        },
                      }}
                      open={openUploadPopover}
                      anchorEl={anchorElUpload}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      onClose={hideUploadPopover}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }} className="uploadPopOver">
                        <b>Upload</b>
                      </Typography>
                    </Popover>
                  </Grid>
                )}
                <Grid item xs={12} sm={5} className="discoverGrid">
                  <button className="button" onClick={showDiscover}>
                    <img
                      src={discovery}
                      alt="discovery"
                      className="discoveryIcon"
                      onMouseEnter={showDiscoverPopover}
                      onMouseLeave={hideDiscoverPopover}
                    />
                  </button>
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: "none",
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        backgroundColor: "transparent",
                      },
                    }}
                    open={openDiscoverPopover}
                    anchorEl={anchorElDiscover}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                    onClose={hideDiscoverPopover}
                    disableRestoreFocus
                  >
                    <Typography sx={{ p: 1 }} className="discoverPopoverText">
                      <b>Discover</b>
                    </Typography>
                  </Popover>
                </Grid>
              </Grid>
            </Grid>
          </div>
            </div>
          )}
          <br />

          <div className="buttonContainer">
            <Stack spacing={8} direction="row" className="footerGrid">
              {!isRegisteredUser && (
                <Chip
                  variant="contained"
                  component="a"
                  href="/join-community"
                  className="newsletterButton"
                  label="Newsletter Sign-up"
                  icon={
                    <MailOutlineIcon color="white" className="newsletterIcon" />
                  }
                />
              )}
              <Chip
                variant="contained"
                className="discordSignupButton"
                component="a"
                href="https://discord.gg/7sz8DHpbTG"
                label="Join Discord"
                icon={
                  <PeopleIcon color="primary" className="discordSignupIcon" />
                }
              />
            </Stack>
          </div>
        </div>
        <hr className="horizontal" />
        <div className="logosGridContainer">
          <div className="fundedLogosDiv">
            <br />
            {/* <Stack spacing={8} direction="row" className="fundedGrid"> */}
            <Grid container spacing={1} className="logosGridContainer">
              <Grid item xs={12} md={3} className="logosGridItem">
                <img src={EU} alt="EU-logo" className="fundedLogo-EU" />
              </Grid>
              <Grid item xs={12} md={3} className="logosGridItem">
                <img src={BMBF} alt="BMBF-logo" className="fundedLogo-BMBF" />
              </Grid>
              <Grid item xs={12} md={3} className="logosGridItem">
                <img src={PTF} alt="PTF-logo" className="fundedLogo-PTF" />
              </Grid>
              <Grid item xs={12} md={3} className="logosGridItem">
                <img src={HTW} alt="HTW-logo" className="fundedLogo-HTW" />
              </Grid>
            </Grid>
            {/* </Stack> */}
          </div>

          <br />

          <div className="legalDiv">
            <Stack spacing={2} direction="row" className="legalGrid">
              <Typography>
                <Link color="inherit" href="/privacy">
                  Data Privacy
                </Link>
              </Typography>
              <Typography>
                <Link color="inherit" href="/impressum">
                  Impressum
                </Link>
              </Typography>
            </Stack>
          </div>
        </div>
      </>
    );
  }
}
