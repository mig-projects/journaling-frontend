import React from "react";
import CanvasII from "./components/Canvas/CanvasII";
import TextForm from "./components/TextForm/TextForm";
import "./UploadForm.css";

// NEW:
import {
  ThemeProvider,
  useTheme,
  Grid,
  Stack,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useUploadForm } from "./useUploadForm";

const UploadForm = () => {
  const {
    // Manage state of the upload form
    uploadState,
    // Manage state of the memory
    memoryState,
    setMemoryState,
    // Manage state of the canvas
    setCanvasState,
    // data submit handler
    submitData,
    validateData,
  } = useUploadForm();

  const theme = useTheme({
    palette: {
      primary: {
        main: "#B272CE",
      },
    },
  });

  if (uploadState.published) {
    return (
      <div className="successMessage">
        <Typography> Success!</Typography>
        <Button href="/" variant="contained" className="homeButton">
          Back to Home
        </Button>
        {/* TODO: Integrate image loading.
        <div className="returnImgContainer">
          <img src={src} alt="" className="returnImg" />
        </div> */}
        {/* <Stack spacing={2} direction="column" className="submitStack">
          <Button variant="contained" className="homeButton">
            Back to Home
          </Button>
          <Button variant="contained">
            Go to the Gallery
          </Button>
        </Stack> */}
      </div>
    );
  } else if (
    uploadState.dataFetchInProgress ||
    uploadState.submissionInProgress
  ) {
    return (
      <div className="mainContainer">
        <ThemeProvider theme={theme}>
          <CircularProgress />
        </ThemeProvider>
      </div>
    );
  } else {
    console.log("Validate: ", validateData());
    return (
      <div className="mainContainer">
        <div>
          <Grid container spacing={9}>
            <Grid item xs={12} md={6}>
              <CanvasII setCanvasState={setCanvasState} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextForm
                memoryState={memoryState}
                setMemoryState={setMemoryState}
              />
            </Grid>
          </Grid>
        </div>

        <div className="submitContainer">
          <Stack spacing={2} direction="row" className="submitStack">
            <Button
              variant="contained"
              className="submitButton"
              onClick={submitData}
              disabled={!validateData()}
            >
              Submit
            </Button>
          </Stack>
        </div>
      </div>
    );
  }
};
export default UploadForm;
