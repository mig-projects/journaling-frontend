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

export const TextForm = ({ memoryState, setMemoryState }) => {
  const [highlighter, setHighlighter] = React.useState(false);
  const [highlights, setHighlights] = React.useState([]);

  // Removing a user tag from the list, and corresponding highlight in the text.
  const removeUserTag = (deletedWord) => {
    setMemoryState((prevState) => ({
      ...prevState,
      userTags: [...prevState.userTags.filter((word) => word != deletedWord)],
    }));
    setHighlights([
      ...highlights.filter((highlight) => highlight.word != deletedWord),
    ]);
  };

  // Changing `selected` state of an individual tag.
  const toggleTag = (tagId) => {
    setMemoryState((prevState) => ({
      ...prevState,
      tagStates: prevState.tagStates.map((tag) =>
        tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
      ),
    }));
  };

  const selectionHandler = (selected, startIndex, numChars) => {
    setMemoryState((prevState) => ({
      ...prevState,
      userTags: [...prevState.userTags, selected],
    }));
    setHighlights([
      ...highlights,
      { word: selected, startIndex: startIndex, numChars: numChars },
    ]);
  };

  const enableHighlighter = useCallback(() => {
    setHighlighter(true);
  }, []);

  const onMemoryChange = useCallback((event) => {
    setMemoryState((prevState) => ({
      ...prevState,
      textMemory: event.target.value,
    }));
  }, []);

  return (
    <div>
      <div>
        {highlighter ? (
          <div>
            <Typography>Highlight the words with your cursor.</Typography>
            <div className="highlighterContainer">
              <InteractiveHighlighter
                text={memoryState.textMemory}
                highlights={highlights}
                selectionHandler={selectionHandler}
                customClass="highlighterColor"
              />
            </div>
            <div className="tagContainer">
              {memoryState.userTags.map((word, index) => (
                <Chip
                  avatar={
                    <Avatar className="avatarStyle">
                      <b>#</b>
                    </Avatar>
                  }
                  className="tagsChip userChipStyle"
                  key={`user-tag-${index}`}
                  label={word}
                  onDelete={() => removeUserTag(word)}
                  variant="filled"
                />
              ))}
              {memoryState.tagStates.map(
                (tag, index) =>
                  tag.selected && (
                    <Chip
                      avatar={
                        <Avatar className="avatarStyle">
                          <b>#</b>
                        </Avatar>
                      }
                      key={`selected-tag-${index}`}
                      className="tagsChip userChipStyle"
                      label={tag.name}
                      onDelete={() => toggleTag(tag.id)}
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
              {memoryState.tagStates.map(
                (tag, index) =>
                  !tag.selected && (
                    <Chip
                      className="suggestedChipStyle"
                      label={tag.name}
                      key={`suggested-tag-${index}`}
                      variant="filled"
                      onClick={() => toggleTag(tag.id)}
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
                disabled={memoryState.textMemory === null}
                label="Highlight the text"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextForm;
