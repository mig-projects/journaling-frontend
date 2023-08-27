import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InteractiveHighlighter } from "react-interactive-highlighter";
import "./TextForm.css";
import useTextForm from "./useTextForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a280df",
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
      <div>
        {highlighter ? (
          <div>
            <Typography>
              <li>
                <span className="important-words">Highlight</span> the words with your cursor.
                <span className="textMandatory">*</span>
              </li>
            </Typography>
            <div className="highlighterContainer">
              <InteractiveHighlighter
                text={memoryState.textMemory}
                highlights={highlights}
                selectionHandler={selectionHandler}
                customClass="highlighterColor"
              />
            </div>

            <br />
            <br />
            <Typography className="tagContainer">
              <li>
                Which <span className="important-words">communities</span> is this experience most relevant to?

                <span className="textMandatory">*</span>
              </li>
            </Typography>
            <ThemeProvider theme={theme}>
              <TextField
                id="community-tag-input"
                label="Enter community tags"
                variant="filled"
                margin="normal"
                fullWidth="true"
                value={tagInput} // this state will be added in the next step
                onChange={onTagInputChange} // this handler will be added in the next step
                onKeyDown={onKeyDown} // for adding tags on pressing 'Enter'
              />
            </ThemeProvider>
            <br />
            <br />
            <Typography className="tagContainer">
              <li>
                Are any of these <span className="important-words">themes</span> related to your memory? Click and add.

                <span className="textMandatory">*</span>
              </li>
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
              <li>
                Have you faced any <span className="important-words">discrimination</span> working in <span className="important-words">tech</span>?

              </li>
              <li>
                Are you wondering what counts as discrimination?

              </li>
              <li>
                Do you have some thoughts on <span className="important-words">fairness</span> in hiring and AI?
              </li>
              <li>
                Have you reflected the group discussions and others' inputs?
              </li>
              <li>
                Record your thoughts below.<span className="textMandatory">*</span>
              </li>
            </Typography>
            <br />
            <ThemeProvider theme={theme}>
              <TextField
                id="filled-multiline-static"
                label="My Thoughts"
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
                className="highlightButton"
                onClick={enableHighlighter}
                disabled={memoryState.textMemory === ""}
                label="CLICK TO HIGHLIGHT"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextForm;
