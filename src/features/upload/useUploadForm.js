import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router";
import { UploadError, useApi } from "../../hooks/useApi";

export const useUploadForm = () => {
  const { user, isRegisteredUser } = useAuth();
  const navigate = useNavigate();
  const { fetchData, addEntry } = useApi({ user });

  const [memoryState, setMemoryState] = useState({
    tagStates: [],
    userTags: [],
    communityTags: [],
    textMemory: "",
  });

  const [uploadState, setUploadState] = useState({
    published: false,
    submissionInProgress: false,
    dataFetchInProgress: false,
  });

  const [canvasState, setCanvasState] = useState({
    photo: null,
    drawing: null,
  });

  // send back to login page if session doesn't exist or disappears.
  useEffect(() => {
    if (!isRegisteredUser) {
      navigate("/login");
    }
  }, [isRegisteredUser]);

  // Fetch suggested tags and initialize tagStates on component mount
  useEffect(() => {
    const initializeTagStates = async () => {
      setUploadState((prevState) => ({
        ...prevState,
        dataFetchInProgress: true,
      }));

      const data = await fetchData("select", "suggested_tags");

      // Pass to memory state as initial list of states
      if (data) {
        setMemoryState((prevState) => ({
          ...prevState,
          tagStates: data.map((tag) => ({
            id: tag.id,
            name: tag.name,
            selected: false,
          })),
        }));
      }

      // Data fetching complete
      setUploadState((prevState) => ({
        ...prevState,
        dataFetchInProgress: false,
      }));
    };

    initializeTagStates();
  }, []);

  // Asynchronous handler for submit button.
  const submitData = useCallback(async () => {
    setUploadState((prevState) => ({
      ...prevState,
      submissionInProgress: true,
    }));
    try {
      const isPublished = await addEntry(user.id, memoryState, canvasState);
      setUploadState((prevState) => ({
        ...prevState,
        published: isPublished,
        submissionInProgress: false,
      }));
    } catch (error) {
      // error handling across the entry pipeline
      if (error instanceof UploadError) {
        console.error(
          `An error occurred during ${error.operation}:`,
          error.message
        );
        console.error("Data:", error.data);
        console.error("Original error:", error.originalError);
      } else {
        console.error(error);
      }

      setUploadState((prevState) => ({
        ...prevState,
        error: error,
      }));
      return;
    }
  }, [user, memoryState, canvasState]);

  // Make sure data contains all the required fields before enabling submit.
  const validateData = useCallback(() => {
    if (memoryState.textMemory === "") {
      return false;
    }
    if (memoryState.userTags.length === 0) {
      return false;
    }
    if (!memoryState.tagStates.some((tag) => tag.selected)) {
      return false;
    }
    return true;
  }, [memoryState]);

  return {
    memoryState,
    uploadState,
    setMemoryState,
    setCanvasState,
    setUploadState,
    submitData,
    validateData,
  };
};
