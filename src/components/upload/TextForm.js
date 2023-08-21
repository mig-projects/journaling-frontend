import React, { useCallback } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InteractiveHighlighter } from "react-interactive-highlighter";
import "./TextForm.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B272CE",
    },
  },
});

export default function TextForm(props) {
  const [highlighter, setHighlighter] = React.useState(false);
  const [highlights, setHighlights] = React.useState([]);

  const {
    tagStates,
    setTagStates,
    userTags,
    setUserTags,
    memory,
    onMemoryChange,
  } = props;

  const removeUserTag = (deletedWord) => {
    setUserTags([...userTags.filter((word) => word != deletedWord)]);
    setHighlights([
      ...highlights.filter((highlight) => highlight.word != deletedWord),
    ]);
  };

  const toggleTag = (tag) => {
    setTagStates((prevState) => ({
      ...prevState,
      [tag]: !prevState[tag],
    }));
  };

  const selectionHandler = (selected, startIndex, numChars) => {
    setUserTags([...userTags, selected]);
    setHighlights([
      ...highlights,
      { word: selected, startIndex: startIndex, numChars: numChars },
    ]);
  };

  const enableHighlighter = useCallback(() => {
    setHighlighter(true);
  }, []);

  return (
    <div>
      <div>
        {highlighter ? (
          <div>
            <Typography>Highlight the words with your cursor.</Typography>
            <div className="highlighterContainer">
              <InteractiveHighlighter
                text={memory}
                highlights={highlights}
                selectionHandler={selectionHandler}
                customClass="highlighterColor"
              />
            </div>
            <div className="tagContainer">
              {userTags.map((word) => (
                <Chip
                  avatar={
                    <Avatar className="avatarStyle">
                      <b>#</b>
                    </Avatar>
                  }
                  className="tagsChip userChipStyle"
                  label={word}
                  onDelete={() => removeUserTag(word)}
                  variant="filled"
                />
              ))}
              {Object.keys(tagStates).map(
                (tag) =>
                  tagStates[tag] && (
                    <Chip
                      avatar={
                        <Avatar className="avatarStyle">
                          <b>#</b>
                        </Avatar>
                      }
                      className="tagsChip userChipStyle"
                      label={tag}
                      onDelete={() => toggleTag(tag)}
                      variant="filled"
                    />
                  )
              )}
            </div>
            <br />
            <br />
            <Typography className="tagContainer">
              Are any of these themes related to your memory? Click and add.
            </Typography>
            <div className="tagContainer">
              {Object.keys(tagStates).map(
                (tag) =>
                  !tagStates[tag] && (
                    <Chip
                      className="suggestedChipStyle"
                      label={tag}
                      variant="filled"
                      onClick={() => toggleTag(tag)}
                    />
                  )
              )}
            </div>
          </div>
        ) : (
          <div>
            <Typography>
              Write about your memory. Then, highlight the important words.
            </Typography>
            <ThemeProvider theme={theme}>
              <TextField
                id="filled-multiline-static"
                label="My Memory"
                multiline={true}
                rows={18}
                variant="filled"
                margin="normal"
                fullWidth={true}
                onChange={onMemoryChange}
              />
            </ThemeProvider>
            <div className="HighlightChipContainer">
              <Chip
                variant="contained"
                className="textFieldStyle"
                onClick={enableHighlighter}
                disabled={memory === null}
                label="Highlight the text"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
