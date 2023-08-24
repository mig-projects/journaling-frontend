import React from "react";

import UploadForm from "../components/upload/UploadForm";
// import Gallery from "../components/discovery/Gallery";

import upload from "../pics/upload.png";
import discovery from "../pics/discovery.png";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

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
          <div className="mainBox">
            <Typography variant="h7" className="introText">
              This is demo of a Computer Vision machine teaching UI, that
              members from diverse communities can use to co-create synthetic
              data in order to represent themselves in datasets. The UI was
              designed with art therapists to promote reflective thinking and
              knowledge-building in users. In conjunction with aligning
              regulatory and institutional stakeholders on adaptive frameworks
              for different sensitive/protected categories, this tool can be
              used to democratize datasets to build inclusive and ethical AI.
            </Typography>

            <hr />
          </div>
          {user && (
            <div>
              <Grid container spacing={0}>
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
            <Stack spacing={2} direction="column" className="footerGrid">
              <Button variant="contained" className="newsletterButton">
                Sign Up For Our Newsletter!
              </Button>

              {user && (
                <Button variant="contained" className="githubSignup">
                  Join Our Open Source Community!
                </Button>
              )}
            </Stack>
          </div>
        </div>
      );
    }
  }
}
