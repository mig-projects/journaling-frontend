import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from "@mui/material/Chip";
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { InteractiveHighlighter } from 'react-interactive-highlighter';
import './TextForm.css';


export default function TextForm(props) {
    const [text, setText] = React.useState(null);
    const [highlighter, setHighlighter] = React.useState(false);
    const [highlights, setHighlights] = React.useState([]);
    const [tags, setTags] = React.useState([]);
    const [home, setHome] = React.useState(true);
    const [solidarity, setSolidarity] = React.useState(true);
    const [wellbeing, setWellbeing] = React.useState(true);


    var style1 = {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
    }
    var style2 = {
        backgroundColor: "rgba( 255, 255, 255, 0.5)",
        fontSize: "16px",
        color: "#B272CE",
        padding: "25px 10px 25px 10px",
        margin: "10px"
    }

    var style3 = {
        marginTop: "10px",
        backgroundColor: "#D9CDBC",
        borderRadius: "5px",
        padding: "10px 10px 10px 10px"
    }

    var style4 = {
        marginTop: "10px",
    }
    //user chip 
    var style5 = {
        fontSize: '16px',
        color: "#B272CE",
        border: "2px solid #B272CE",
        backgroundColor: "#e6dac8",
        marginTop: "10px",
        marginRight: "10px",
    }

    //avatar styling
    var style6 = {
        backgroundColor: "#B272CE",
        color: "White",
        paddingTop: "3px",
        paddingBottom: "3px",
        // fontStyle: "bold"
    }

    var style7 = {
        fontSize: '16px',
        // border: "2px solid white",
        marginTop: "10px",
        marginRight: "10px",
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#B272CE',
            },
        },
    });

    const enteredText = (event) => {
        setText(event.target.value);
        // console.log(event.target.value);
    }

    const removeTags = (index) => {
        setTags([...tags.filter((word) => tags.indexOf(word) !== index)]);
    };

    const selectionHandler = (selected, startIndex, numChars) => {
        console.log(selected);
        setTags([...tags, selected]);
        highlights.push({ startIndex: startIndex, numChars: numChars });
        setHighlights(highlights);
        console.log(...tags)
        //send tags to UploadForm
        props.selectedTags([...tags, selected]);
    }

    const enableHighlighter = () => {
        setHighlighter(true);
    }

    const addHomeTag = () => {
        setHome(false);
        tags.push("home");
        setTags(tags);
        props.selectedTags(tags);
    };

    const addSolidarityTag = () => {
        setSolidarity(false);
        tags.push("solidarity");
        setTags(tags);
        props.selectedTags(tags);
    };

    const addWellbeingTag = () => {
        setWellbeing(false);
        tags.push("well-being");
        setTags(tags);
        props.selectedTags(tags);
    };

    return (
        <div>
            <div>
                {highlighter ?
                    <div>
                        <Typography>Highlight the words with your cursor.</Typography>
                        <div style={style3}>
                            <InteractiveHighlighter
                                text={text}
                                highlights={highlights}
                                selectionHandler={selectionHandler}
                                customClass="highlighter-color"
                            />
                        </div>
                        <div style={style4}>
                            {tags.map((word, index) => (
                                <Chip
                                    avatar={<Avatar style={style6}><b>#</b></Avatar>}
                                    className="tags-chip"
                                    style={style5}
                                    key={index}
                                    label={word}
                                    onDelete={() => removeTags(index)}
                                    variant="filled"
                                />
                            ))}
                        </div>
                        <br />
                        <br />
                        <Typography style={style4}>Are any of these themes related to your memory? Click and add.</Typography>
                        <div style={style4}>
                            {home &&
                                <Chip

                                    className="tags-chip"
                                    label="home"
                                    style={style7}
                                    variant="filled"
                                    onClick={addHomeTag}
                                />}

                            {solidarity &&
                                <Chip
                                    className="tags-chip"
                                    label="solidarity"
                                    style={style7}
                                    variant="filled"
                                    onClick={addSolidarityTag}
                                />}

                            {wellbeing &&
                                <Chip
                                    className="tags-chip"
                                    label="well-being"
                                    style={style7}
                                    variant="filled"
                                    onClick={addWellbeingTag}
                                />}
                        </div>
                    </div>
                    :
                    <div>
                        <Typography>Write about your memory. Then, highlight the important words.</Typography>
                        <ThemeProvider theme={theme}>
                            <TextField
                                id="filled-multiline-static"
                                label="My Memory"
                                multiline={true}
                                rows={18}
                                variant="filled"
                                margin="normal"
                                fullWidth={true}
                                onChange={enteredText}
                            />
                        </ThemeProvider>
                        <div style={style1}>
                            <Chip variant="contained" style={style2} onClick={enableHighlighter} disabled={text === null} label="Highlight the text" />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}