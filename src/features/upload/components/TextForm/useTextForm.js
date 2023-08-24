import { useState, useCallback } from "react";

const useTextForm = ({ memoryState, setMemoryState }) => {
  const [highlighter, setHighlighter] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Removing a user tag from the list, and corresponding highlight in the text.
  const removeTag = (deletedWord, fromList) => {
    if (fromList === "user") {
      setMemoryState((prevState) => ({
        ...prevState,
        userTags: [...prevState.userTags.filter((word) => word != deletedWord)],
      }));
      setHighlights([
        ...highlights.filter((highlight) => highlight.word != deletedWord),
      ]);
    } else if (fromList === "community") {
      setMemoryState((prevState) => ({
        ...prevState,
        communityTags: [
          ...prevState.communityTags.filter((word) => word != deletedWord),
        ],
      }));
    } else if (fromList === "selected") {
      toggleTag(deletedWord);
    }
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

  const onTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddTag();
    }
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

  const handleAddTag = () => {
    const parsedTags = tagInput
      .split(/\s+/) // Split by whitespace
      .map((word) => (word.startsWith("#") ? word.slice(1) : word)) // Remove starting hash
      .filter(
        (word, index, self) =>
          word &&
          !memoryState.communityTags.includes(word) &&
          self.indexOf(word) === index
      );

    if (parsedTags.length > 0) {
      setMemoryState((prevState) => ({
        ...prevState,
        communityTags: [...prevState.communityTags, ...parsedTags],
      }));
      setTagInput(""); // Clear the input
    }
  };

  return {
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
  };
};
export default useTextForm;
