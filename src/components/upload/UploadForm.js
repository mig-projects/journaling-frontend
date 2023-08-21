import React, { useEffect, useState, useCallback } from "react";
import CanvasII from "./CanvasII";
import TextForm from "./TextForm";
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
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router";
import { supaClient } from "../../services/supabase";
const SUGGESTED_TAGS = ["home", "well-being", "solidarity"];

export default function UploadForm() {
  const { user } = useAuth();
  const [published, setPublished] = useState(false);
  const [tagStates, setTagStates] = React.useState(
    SUGGESTED_TAGS.reduce((obj, tag) => ({ ...obj, [tag]: false }), {})
  );
  const [userTags, setUserTags] = React.useState([]);
  const [memory, setMemory] = useState(null);
  const [src, setSrc] = useState(null);
  const [progress, setProgress] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme({
    palette: {
      primary: {
        main: "#B272CE",
      },
    },
  });

  // send back to login page if session doesn't exist or disappears.
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // Pass to the post handler
  const onMemoryChange = useCallback((event) => {
    setMemory(event.target.value);
  }, []);

  const insert = async (tableName, insertParams) => {
    // send to supaClient
    const { error } = await supaClient[0].from(tableName).insert(insertParams);
    if (error) {
      console.log(error);
    }
  };

  const upsert = async (tableName, insertParams) => {
    const { data, error } = await supaClient[0]
      .from(tableName)
      .upsert(insertParams, { onConflict: "name", ignoreDuplicates: true })
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };

  const insertImage = () => {
    insert(
      "users_images", // tableName
      {
        owner: user.id, //insertParams
        name: "some name",
        description: "text",
      }
    );
  };

  //   const arr = [];
  //   tags.forEach((tag) => {
  //     arr.push({ name: tag });
  //   });
  //   console.log(arr);
  //   upsert("tags", arr);
  // }

  const uploadToStorage = (imageData, subFolder, photoName) => {
    fetch(imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "File name", { type: "image/png" });
        const path = `${subFolder}/${user.id}-${Date.now()}-${photoName}.png`;
        supaClient.storage
          .from("images")
          .upload(path, file)
          .then((result) => {
            if (result.error) {
              console.log(result.error);
            }
          });
      });
  };

  const readiedFiles = (photoData, annotationData) => {
    if (user) {
      // console.log(session);
      uploadToStorage(photoData, "photos", "photo");
      uploadToStorage(annotationData, "drawings", "drawing");
      insertImage();
      // insertTags();
    } else {
      console.log("session not established yet");
    }
  };

  const postData = () => {
    console.log(tagStates, userTags, memory);
    setPublished(!published);
  };

  if (published) {
    return (
      <div>
        <Typography> Success!</Typography>
        <div className="returnImgContainer">
          <img src={src} alt="" className="returnImg" />
        </div>
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
                tagStates={tagStates}
                setTagStates={setTagStates}
                userTags={userTags}
                setUserTags={setUserTags}
                memory={memory}
                onMemoryChange={onMemoryChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className="submitContainer">
          <Stack spacing={2} direction="row" className="submitStack">
            <Button
              variant="contained"
              className="submitButton"
              onClick={postData}
            >
              Submit
            </Button>
            <ThemeProvider theme={theme}>
              {progress && <CircularProgress />}
            </ThemeProvider>
          </Stack>
        </div>
      </div>
    );
  }
}
