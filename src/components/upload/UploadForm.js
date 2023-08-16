import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import CanvasII from "./CanvasII";
import TextForm from "./TextForm";
import Login from "../../pages/auth/Login";


// NEW:
import { ThemeProvider, useTheme, Grid, Stack, Button, Typography, CircularProgress } from '@mui/material';


export default function UploadForm() {
    const { session, supabase } = useContext(AuthContext);
    const [post, setPost] = useState(false);
    const [tags, setTags] = useState([]);
    const [text, setText] = useState(null);
    const [src, setSrc] = useState(null);
    const [progress, setProgress] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [loginView, setLoginView] = useState(false);



    // const [src, setSrc] = React.useState(null);
    // const [returnTags, setReturnTags] = React.useState([]);
    // const [returnCaption, setReturnCaption] = React.useState(null);
    // const [returnAITags, setReturnAITags] = React.useState([]);

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
        display: "flex",
        justifyContent: "center",
    }

    const theme = useTheme({
        palette: {
            primary: {
                main: "#B272CE",
            },
        }
    });

    useEffect(() => {
        if (trigger === true) {
            setTrigger(false);
        }

        if (loginView) {
            setLoginView(session[0] ? false : true)
            console.log(session);
        }
        // if (!session) {
        //     return (<Login />);
        //     supabase.auth
        //         .getSession()
        //         .then(({ data, error }) => {
        //             if (error) {
        //                 // Handle the error, e.g., display an error message or take appropriate action
        //                 console.error('Error fetching session:', error);
        //             } else {
        //                 setSession(data.session);
        //             }
        //         })
        //         .catch((error) => {
        //             // Handle any other errors that may occur
        //             console.error('Error fetching session:', error);
        //         });


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
                owner: session[0].user.id, //insertParams
                name: "some name",
                description: "text"
            });
    }

    const insertTags = () => {

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
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "File name", { type: "image/png" })
                const path = `${subFolder}/${session[0].user.id}-${Date.now()}-${photoName}.png`;
                supabase[0].storage
                    .from('images')
                    .upload(path, file)
                    .then((result) => {
                        if (result.error) {
                            console.log(result.error)
                        }
                    })
            })
    }

    const readiedFiles = (photoData, annotationData) => {
        if (session[0]) {
            // console.log(session);
            uploadToStorage(photoData, "photos", "photo");
            uploadToStorage(annotationData, "drawings", "drawing");
            insertImage();
            insertTags();
        } else {
            setLoginView(true);
            console.log("session not established yet")
        }
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