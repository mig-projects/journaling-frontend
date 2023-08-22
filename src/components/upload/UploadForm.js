import React, { useEffect, useState, useCallback } from "react";
import CanvasII from "./components/CanvasII";
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
import { useUploadForm } from "./hooks";

const UploadForm = () => {
  const {
    trigger,
    memoryState,
    setTrigger,
    uploadState,
    setMemoryState,
    submitData,
    readiedFiles,
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
      <div>
        <Typography> Success!</Typography>

        {/* TODO: Integrate image loading.
        <div className="returnImgContainer">
          <img src={src} alt="" className="returnImg" />
        </div> */}
        <Stack spacing={2} direction="column" className="submitStack">
          <Button variant="contained" className="submitButton">
            Back to Home
          </Button>
          <Button variant="contained" className="submitButton">
            Go to the Gallery
          </Button>
        </Stack>
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
    return (
      <div className="mainContainer">
        <div>
          <Grid container spacing={9}>
            <Grid item xs={12} md={6}>
              <CanvasII trigger={trigger} imgFiles={readiedFiles} />
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
