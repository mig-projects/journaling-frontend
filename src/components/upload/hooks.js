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

  const [trigger, setTrigger] = useState(false);

  // send back to login page if session doesn't exist or disappears.
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // Fetch suggested tags and initialize tagStates on component mount
  useEffect(() => {
    const fetchSuggestedTags = async () => {
      setUploadState({
        ...uploadState,
        dataFetchInProgress: true,
      });
      let { data, error } = await supaClient.from("suggested_tags").select("*");

      if (error) {
        console.error("Error fetching suggested tags:", error);
        // Data fetching complete
        setUploadState({
          ...uploadState,
          dataFetchInProgress: false,
          error: error,
        });
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
      setMemoryState({ ...memoryState, tagStates: initialTagStates });

      // Data fetching complete
      setUploadState({
        ...uploadState,
        dataFetchInProgress: false,
      });
    };

    fetchSuggestedTags();
  }, []);

  const insert = async (tableName, insertParams) => {
    // send to supaClient
    const { error } = await supaClient.from(tableName).insert(insertParams);
    if (error) {
      console.log(error);
    }
  };

  const insertImage = () => {
    insert(
      "users_images", // tableName
      {
        owner: user.id, //insertParams
        name: "some name",
        description: "text",
      }
    );
  };

  const uploadToStorage = (imageData, subFolder, photoName) => {
    fetch(imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "File name", { type: "image/png" });
        const path = `${subFolder}/${user.id}-${Date.now()}-${photoName}.png`;
        supaClient.storage
          .from("images")
          .upload(path, file)
          .then((result) => {
            if (result.error) {
              console.log(result.error);
            }
          });
      });
  };

  const readiedFiles = (photoData, annotationData) => {
    if (user) {
      // console.log(session);
      uploadToStorage(photoData, "photos", "photo");
      uploadToStorage(annotationData, "drawings", "drawing");
      insertImage();
      // insertTags();
    } else {
      console.log("session not established yet");
    }
  };

  // addEntry writes the memory and its associated tags in Supabase.
  // Note: This is not a transaction, which means data might be uploaded partially if error happens during execution.
  // Making this a transaction would require moving the logic to a SQL function in Supabase and using RPC.
  // Guarantees data integrity but more complex and harder to troubleshoot errors.
  const addEntry = async (userId, memoryState) => {
    const { textMemory, tagStates, userTags } = memoryState;

    // create memory
    let { data: memory, error: memoryError } = await supaClient
      .from("text_memories")
      .insert([{ user_id: userId, memory: textMemory }])
      .select();

    if (memoryError) {
      console.error("Error inserting memory:", memoryError);
      setUploadState({
        ...uploadState,
        error: memoryError,
      });
      return;
    }

    // insert user tags
    const newUserTags = userTags.map((tagName) => ({
      memory_id: memory[0]?.id,
      tag_name: tagName,
    }));
    let { error: tagError } = await supaClient
      .from("user_tags")
      .insert(newUserTags);

    if (tagError) {
      console.error("Error inserting user tag:", tagError);
      setUploadState({
        ...uploadState,
        error: tagError,
      });
      return;
    }

    // associate entry with suggested tags
    let selectedTags = tagStates
      .filter((tag) => tag.selected)
      .map((tag) => ({
        suggested_tag_id: tag.id,
        text_memory_id: memory[0]?.id,
      }));
    let { error } = await supaClient
      .from("suggested_tag_memories")
      .insert(selectedTags);

    if (error) {
      console.error("Error associating entry with suggested tag:", error);
      setUploadState({
        ...uploadState,
        error: error,
      });
      return;
    }

    return true;
  };

  // Asynchronous handler for submit button.
  const submitData = async () => {
    setUploadState({ ...uploadState, submissionInProgress: true });
    const isPublished = await addEntry(user.id, memoryState);
    setUploadState({
      ...uploadState,
      published: isPublished,
      submissionInProgress: false,
    });
  };

  return {
    memoryState,
    trigger,
    uploadState,
    setMemoryState,
    setTrigger,
    setUploadState,
    submitData,
  };
};
