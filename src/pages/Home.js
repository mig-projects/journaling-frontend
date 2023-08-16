import React from "react";

import UploadForm from "../components/upload/UploadForm";
// import Gallery from "../components/discovery/Gallery";

import upload from "../pics/upload.png";
import discovery from "../pics/discovery.png";

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';

import "./Home.css";

var style1 = {
    margin: "50px",
}

var style2 = {
    marginTop: "30px",
    margin: "0auto",
    display: "flex",
    justifyContent: "center",
}

var style3 = {
    display: "flex",
    justifyContent: "center",
    margin: "50px",
}

var style4 = {
    backgroundColor: "#B272CE",
    borderRadius: '15px',
}

var style5 = {
    maxWidth: '250px',
}

var style6 = {
    display: "flex",
    justifyContent: "right",
}

var style7 = {
    display: "flex",
    justifyContent: "left",
}

var style8 = {
    backgroundColor: "transparent",
    border: "none",
}

var style10 = {
    fontSize: '60px',
    color: "#535252",
}

// intro text div
var style16 = {
    padding: "20px",
}

// 'join open source' 
var style17 = {
    background: "white",
    color: "#B272CE",
    borderRadius: '15px',
}

export default function Home() {
    const [discoveryMode, setDiscoveryMode] = React.useState(false);
    const [uploadMode, setUploadMode] = React.useState(false);
    const [anchorElUpload, setAnchorElUpload] = React.useState(null);
    const [anchorElDiscover, setAnchorElDiscover] = React.useState(null);


    const showUpload = () => {
        setUploadMode(true);
    }

    const showDiscover = () => {
        setDiscoveryMode(true);
    }

    const showUploadPopover = (event) => {
        setAnchorElUpload(event.currentTarget);
    }

    const hideUploadPopover = () => {
        setAnchorElUpload(null);
    };

    const showDiscoverPopover = (event) => {
        setAnchorElDiscover(event.currentTarget);
    }

    const hideDiscoverPopover = () => {
        setAnchorElDiscover(null);
    };

    const openUploadPopover = Boolean(anchorElUpload);
    const openDiscoverPopover = Boolean(anchorElDiscover);




    if (uploadMode) {
        return <UploadForm />
    } else {
        if (discoveryMode) {

            return null
            //<Gallery />

        } else {
            return (
                <div style={style1}>
                    <div style={style16}>
                        <Typography variant="h7" className="introText">
                            This is demo of a Computer Vision machine teaching UI, that members from diverse communities
                            can use to co-create synthetic data in order to represent themselves in datasets.
                            The UI was designed with art therapists to promote reflective thinking and knowledge-building in users.
                            In conjunction with aligning regulatory and institutional stakeholders on adaptive
                            frameworks for different sensitive/protected categories,
                            this tool can be used to democratize datasets to build inclusive and ethical AI.
                        </Typography>

                        <hr />
                    </div>
                    <div>
                        <Grid container spacing={0}>
                            <Grid item xs={12} md={6} style={style6} >
                                <button style={style8} onClick={showUpload}><img src={upload} alt="upload" style={style5} className="uploadIcon" onMouseEnter={showUploadPopover} onMouseLeave={hideUploadPopover} /></button>
                                <Popover
                                    id="mouse-over-popover"
                                    sx={{
                                        pointerEvents: 'none',
                                    }}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            backgroundColor:
                                                'transparent'
                                        }
                                    }}
                                    open={openUploadPopover}
                                    anchorEl={anchorElUpload}

                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'center',
                                    }}
                                    onClose={hideUploadPopover}
                                    disableRestoreFocus
                                >
                                    <Typography sx={{ p: 1 }} style={style10} className="uploadPopOver"><b>Upload</b></Typography>
                                </Popover>
                            </Grid>
                            <Grid item xs={12} md={6} style={style7}>
                                <button style={style8} onClick={showDiscover}><img src={discovery} alt="discovery" style={style5} className="discoveryIcon" onMouseEnter={showDiscoverPopover} onMouseLeave={hideDiscoverPopover} /></button>
                                <Popover
                                    id="mouse-over-popover"
                                    sx={{
                                        pointerEvents: 'none',

                                    }}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            backgroundColor:
                                                'transparent'
                                        }
                                    }}
                                    open={openDiscoverPopover}
                                    anchorEl={anchorElDiscover}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'center',
                                    }}

                                    onClose={hideDiscoverPopover}
                                    disableRestoreFocus
                                >
                                    <Typography sx={{ p: 1 }} style={style10} className="discoverPopoverText"><b>Discover</b></Typography>
                                </Popover>
                            </Grid>
                        </Grid>
                    </div>
                    <br />

                    <div style={style2}>
                        <Stack spacing={2} direction="column" style={style3}>
                            <Button variant="contained" style={style4}>  Sign Up For Our Newsletter!  </Button>
                            <Button variant="contained" style={style17}>  Join Our Open Source Community!  </Button>
                        </Stack>
                    </div>
                </div >

            );
        }
    }

}


