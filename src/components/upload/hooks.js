import { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router";
import { supaClient } from "../../services/supabase";

export const useUploadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memoryState, setMemoryState] = useState({
    tagStates: [],
    userTags: [],
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
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // Fetch suggested tags and initialize tagStates on component mount
  useEffect(() => {
    const fetchSuggestedTags = async () => {
      setUploadState((prevState) => ({
        ...prevState,
        dataFetchInProgress: true,
      }));
      let { data, error } = await supaClient.from("suggested_tags").select("*");

      if (error) {
        console.error("Error fetching suggested tags:", error);
        // Data fetching complete
        setUploadState((prevState) => ({
          ...prevState,
          dataFetchInProgress: false,
          error: error,
        }));
        return;
      }

      let initialTagStates = [];
      for (let tag of data) {
        initialTagStates.push({
          id: tag.id,
          name: tag.name,
          selected: false,
        }); // Initialize each tag's state to false
      }

      // Pass to memory state as initial list of states
      setMemoryState((prevState) => ({
        ...prevState,
        tagStates: initialTagStates,
      }));

      // Data fetching complete
      setUploadState((prevState) => ({
        ...prevState,
        dataFetchInProgress: false,
      }));
    };

    fetchSuggestedTags();
  }, []);

  const insertImage = async (userId, memoryKey, imagePath) => {
    const { error: imageError } = await supaClient.from("user_images").insert({
      user_id: userId,
      memory_id: memoryKey,
      img_path: imagePath,
    });
    if (imageError) {
      throw new UploadError(
        "Error inserting image reference",
        "insertImage",
        {
          userId,
          memoryKey,
          imagePath,
        },
        imageError
      );
    }
  };

  const uploadAndInsertImage = async (userId, memoryKey, imgData, imgDir) => {
    fetch(imgData)
      .then((res) => res.blob())
      .then(async (blob) => {
        const file = new File([blob], "File name", { type: "image/png" });

        const date = new Date();
        const path = imgDir.concat(
          "/",
          ["photos", "drawings"].includes(imgDir) ? imgDir.slice(0, -1) : "img", // either "photo", "drawing" or default "img"
          "-",
          date.toISOString().slice(0, 10), // YYYY-MM-DD
          "-",
          memoryKey,
          ".png"
        );

        const result = await supaClient.storage
          .from("images")
          .upload(path, file)
          .then((result) => {
            if (result.error) {
              throw new UploadError(
                `Error uploading image: ${result.error}`,
                "uploadImage",
                {
                  path,
                  memoryKey,
                }
              );
            } else {
              insertImage(userId, memoryKey, path);
            }
          });
      });
  };

  const addCanvasEntry = async (userId, canvasState, memoryKey) => {
    try {
      await Promise.all([
        uploadAndInsertImage(userId, memoryKey, canvasState.photo, "photos"),
        uploadAndInsertImage(
          userId,
          memoryKey,
          canvasState.drawing,
          "drawings"
        ),
      ]);
    } catch (error) {
      console.error(
        "An error occurred during image upload and insertion:",
        error
      );
    }
  };

  // addEntry writes the memory and its associated tags in Supabase.
  // Note: This is not a transaction, which means data might be uploaded partially if error happens during execution.
  // Making this a transaction would require moving the logic to a SQL function in Supabase and using RPC.
  // Guarantees data integrity but more complex and harder to troubleshoot errors.
  class UploadError extends Error {
    constructor(message, operation, data, originalError) {
      super(message);
      this.name = "UploadError";
      this.operation = operation;
      this.data = data;
      this.originalError = originalError;
    }
  }

  const addEntry = async (userId, memoryState, canvasState) => {
    const { textMemory, tagStates, userTags } = memoryState;

    if (user) {
      // create memory
      let { data: memory, error: memoryError } = await supaClient
        .from("text_memories")
        .insert([{ user_id: userId, memory: textMemory }])
        .select();

      if (memoryError) {
        throw new UploadError(
          "Error inserting memory",
          "insertMemory",
          { userId, textMemory },
          memoryError
        );
      }

      const memoryKey = memory[0].id;

      // insert user tags
      const newUserTags = userTags.map((tagName) => ({
        memory_id: memoryKey,
        tag_name: tagName,
      }));
      let { error: tagError } = await supaClient
        .from("user_tags")
        .insert(newUserTags);

      if (tagError) {
        throw new UploadError(
          "Error inserting user tag",
          "insertUserTag",
          { newUserTags },
          tagError
        );
      }

      // associate entry with suggested tags
      let selectedTags = tagStates
        .filter((tag) => tag.selected)
        .map((tag) => ({
          suggested_tag_id: tag.id,
          text_memory_id: memoryKey,
        }));
      let { error } = await supaClient
        .from("suggested_tag_memories")
        .insert(selectedTags);

      if (error) {
        throw new UploadError(
          "Error associating entry with suggested tag",
          "associateEntryWithSuggestedTag",
          { selectedTags },
          error
        );
      }

      await addCanvasEntry(userId, canvasState, memoryKey);
    }

    return true;
  };

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
  }, [user.id, memoryState, canvasState]);

  return {
    memoryState,
    uploadState,
    setMemoryState,
    setCanvasState,
    setUploadState,
    submitData,
  };
};
