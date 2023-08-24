import { useState, useEffect, useCallback } from "react";
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

  // Frame supabase call with error handling
  const writeOrThrowError = async (table, operation, data) => {
    let error;
    if (operation === "insert") {
      ({ error } = await supaClient.from(table).insert(data));
    } else if (operation === "upload") {
      const { path, file } = data;
      ({ error } = await supaClient.from(table).upload(path, file));
    }
    if (error) {
      throw new UploadError(
        `Error during ${operation} operation on table ${table}`,
        operation,
        data,
        error
      );
    }
  };

  const uploadAndInsertImage = async (userId, memoryKey, imgCanvas, imgDir) => {
    fetch(imgCanvas)
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

        await writeOrThrowError("upload", "images", { path: path, file: file });
        await writeOrThrowError("insert", "user_images", {
          user_id: userId,
          memory_id: memoryKey,
          img_path: path,
        });
      }, "image/png")
      .catch((error) => {
        throw new UploadError(
          `Error during conversion to blob`,
          "CanvasUpload",
          { imgCanvas, imgDir },
          error
        );
      });
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
    const { photo, drawing } = canvasState;

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
      await writeOrThrowError("insert", "user_tags", newUserTags);

      // associate entry with suggested tags
      let selectedTags = tagStates
        .filter((tag) => tag.selected)
        .map((tag) => ({
          suggested_tag_id: tag.id,
          text_memory_id: memoryKey,
        }));
      await writeOrThrowError("insert", "suggested_tag_memories", selectedTags);

      await Promise.all([
        uploadAndInsertImage(userId, memoryKey, photo, "photos"),
        uploadAndInsertImage(userId, memoryKey, drawing, "drawings"),
      ]).catch((error) => {
        throw new UploadError(
          "An error occurred during image upload and insertion:",
          "uploadAndInsertImage",
          { photo, drawing, memoryKey },
          error
        );
      });
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
