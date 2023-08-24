import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InteractiveHighlighter } from "react-interactive-highlighter";
import "./TextForm.css";
import useTextForm from "./hooks";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B272CE",
    },
  },
});

export const TextForm = ({ memoryState, setMemoryState }) => {
  const {
    highlighter,
    highlights,
    selectionHandler,
    removeTag,
    toggleTag,
    onMemoryChange,
    enableHighlighter,
    tagInput,
    onTagInputChange,
    onKeyDown,
  } = useTextForm({ memoryState, setMemoryState });

  return (
    <div>
      <div>
        {highlighter ? (
          <div>
            <Typography>
              Highlight the words with your cursor.
              <span className="textMandatory">*</span>
            </Typography>
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
                  onDelete={() => removeTag(word, "user")}
                  variant="filled"
                />
              ))}
              {memoryState.communityTags.map((word, index) => (
                <Chip
                  avatar={
                    <Avatar className="avatarStyle">
                      <b>#</b>
                    </Avatar>
                  }
                  className="tagsChip communityChipStyle"
                  key={`community-tag-${index}`}
                  label={word}
                  onDelete={() => removeTag(word, "community")}
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
                      className="tagsChip selectedChipStyle"
                      label={tag.name}
                      onDelete={() => removeTag(tag.id, "selected")}
                      variant="filled"
                    />
                  )
              )}
            </div>
            <br />
            <br />
            <Typography className="tagContainer">
              Which communities is this experience most relevant to?
              <span className="textMandatory">*</span>
            </Typography>
            <TextField
              id="tag-input"
              label="Enter community tags"
              variant="filled"
              margin="normal"
              fullWidth="true"
              value={tagInput} // this state will be added in the next step
              onChange={onTagInputChange} // this handler will be added in the next step
              onKeyDown={onKeyDown} // for adding tags on pressing 'Enter'
            />
            <br />
            <br />
            <Typography className="tagContainer">
              Are any of these themes related to your memory? Click and add.
              <span className="textMandatory">*</span>
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
              Write about your memory.<span className="textMandatory">*</span>
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
                disabled={memoryState.textMemory === ""}
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
