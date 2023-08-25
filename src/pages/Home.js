import React from "react";

import UploadForm from "../components/upload/UploadForm";
// import Gallery from "../components/discovery/Gallery";

import upload from "../pics/upload-white.png";
import discovery from "../pics/discovery-white.png";
import findhrPic from "../pics/FINDHR.png";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Chip from '@mui/material/Chip';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LanguageIcon from '@mui/icons-material/Language';

import "./Home.css";
import { useAuth } from "../contexts/auth";

export default function Home() {
  const [discoveryMode, setDiscoveryMode] = React.useState(false);
  const [uploadMode, setUploadMode] = React.useState(false);
  const [anchorElUpload, setAnchorElUpload] = React.useState(null);
  const [anchorElDiscover, setAnchorElDiscover] = React.useState(null);
  const { user } = useAuth();

  const showUpload = () => {
    setUploadMode(true);
  };

  const showDiscover = () => {
    setDiscoveryMode(true);
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

  if (uploadMode) {
    return <UploadForm />;
  } else {
    if (discoveryMode) {
      return null;
      //<Gallery />
    } else {
      return (
        <div className="mainContainer">
          <div className="coverPicDiv">
            <img src={findhrPic} alt="findhr-logo" className="coverImg" />
          </div>
          <div className="mainBox">
            <Typography variant="h7" className="introText">
              Welcome to <span className="bold">MIGR-AI-TION's Research App</span>. We're investigating connections between organizational and hiring AI discrimination for the <span className="bold">FINDHR project</span>. Start by <span className="highlight">journaling</span> your personal experiences. Your insights shape a live dashboard <span className="highlight">visualization</span> shared with other participants. Contribute to constructing a fairness ontology, qualitative dataset, and identifying intersectional challenges. Our <span className="highlight">LLM-powered tool</span> illustrates collective experiences, guiding intersectional fairness recommendations. This research empowers developers, researchers, and EU policy makers to create ethical, inclusive <span className="bold">hiring AI</span>.
            </Typography>

            <hr />
          </div>
          {user && (
            <div className="gridDiv">
              <Grid container spacing={0} className="gridContainer">
                <Grid item xs={12} md={6} className="uploadGrid">
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

                <Grid item xs={12} md={6} className="discoverGrid">
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
            </div>
          )}
          <br />

          <div className="footerContainer">
            <Stack spacing={8} direction="row" className="footerGrid">
              {user && (
                <Chip variant="contained" className="githubSignupButton" label="Join Our Open-source Community!" icon={<LanguageIcon className="gitHubSignUpIcon" />} />
              )}
              <Chip variant="contained" className="newsletterButton" label="Sign-up to Our Newsletter!" icon={<MailOutlineIcon className="newsletterIcon" />} />
            </Stack>
          </div>

          <div className="legal">
            <Stack spacing={8} direction="row" className="legalGrid">
              <Typography />
              Data Privacy
              <Typography />
              <Typography />
              Impressum
              <Typography />
            </Stack>
          </div>
        </div >
      );
    }
  }
}
