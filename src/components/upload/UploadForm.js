import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import CanvasII from "./CanvasII";
import TextForm from "./TextForm";
import Login from "../../pages/auth/Login";


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
        }
    });

  // send back to login page if session doesn't exist or disappears.
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);


    }, [trigger]);

    const insert = async (tableName, insertParams) => {
        // send to supabase
        const { error } = await supabase[0]
            .from(tableName)
            .insert(insertParams);
        if (error) {
            console.log(error);
        }
    }

    const upsert = async (tableName, insertParams) => {
        const { data, error } = await supabase[0]
            .from(tableName)
            .upsert(insertParams, { onConflict: "name", ignoreDuplicates: true })
            .select()

        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }

    }

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

        const arr = [];
        tags.forEach((tag) => {
            arr.push({ name: tag });
        });
        console.log(arr);
        upsert("tags",
            arr
        )
    }

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



    const enteredText = (text) => {
        setText(text);
    };

    const selectedTags = (tags) => {

        setTags(tags);
    };

    const postData = () => {
        setTrigger(!trigger);
    }

    if (post) {
        return (
            <div>
                <Typography> Success!</Typography>
                <div style={style5}>
                    <img src={src} alt="" className="returnImg" />
                </div>
                <Stack spacing={2} direction="column" style={style3}>
                    <Button variant="contained" style={style4}>  Back to Home </Button>
                    <Button variant="contained" style={style4}>  Go to the Gallery  </Button>
                </Stack>

            </div>
        );
    } else {
        if (loginView) {
            return (<Login />)
        } else {
            return (
                <div style={style1}>
                    <div>
                        <Grid container spacing={9}>
                            <Grid item xs={12} md={6}>
                                <CanvasII trigger={trigger} imgFiles={readiedFiles} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextForm enteredText={enteredText} selectedTags={selectedTags} trigger={trigger} />
                            </Grid>
                        </Grid>
                    </div>

                    <div style={style2}>
                        <Stack spacing={2} direction="row" style={style3}>
                            <Button variant="contained" style={style4} onClick={postData}>  Submit  </Button>
                            <ThemeProvider theme={theme}>
                                {progress && <CircularProgress />}
                            </ThemeProvider>
                        </Stack>
                    </div>
                </div >
            );
        }
    }
}