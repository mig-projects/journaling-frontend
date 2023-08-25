import { supaClient } from "../services/supabase";

export class UploadError extends Error {
  constructor(message, operation, data, originalError) {
    super(message);
    this.name = "UploadError";
    this.operation = operation;
    this.data = data;
    this.originalError = originalError;
  }
}

export const useApi = ({ user }) => {
  // Frame supabase call with error handling
  const writeOrThrowError = async (operation, table, data) => {
    let error;
    if (operation === "insert") {
      ({ error } = await supaClient.from(table).insert(data));
    } else if (operation === "upload") {
      const { path, file } = data;
      ({ error } = await supaClient.storage.from(table).upload(path, file));
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

  const fetchData = async (table, query = "*") => {
    let { data, error } = await supaClient.from(table).select(query);

    if (error) {
      throw new UploadError(
        `Error during fetching operation on table ${table}`,
        "FetchData",
        query,
        error
      );
    }
    return data;
  };

  const uploadAndInsertImage = async (userId, memoryKey, imgData, imgDir) => {
    try {
      console.log(imgData);
      const result = await fetch(imgData);
      const blob = await result.blob();
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
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      } else {
        throw new UploadError(
          `Error during conversion to blob`,
          "CanvasUpload",
          { imgData, imgDir },
          error
        );
      }
    }
  };

  // addEntry writes the memory and its associated tags in Supabase.
  // Note: This is not a transaction, which means data might be uploaded partially if error happens during execution.
  // Making this a transaction would require moving the logic to a SQL function in Supabase and using RPC.
  // Guarantees data integrity but more complex and harder to troubleshoot errors.

  const addEntry = async (userId, memoryState, canvasState) => {
    const { textMemory, tagStates, userTags, communityTags } = memoryState;
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
      const newUserTags = userTags
        .map((tagName) => ({
          memory_id: memoryKey,
          user_id: userId,
          tag_name: tagName,
          category: "highlight",
        }))
        .concat(
          communityTags.map((tagName) => ({
            memory_id: memoryKey,
            user_id: userId,
            tag_name: tagName,
            category: "community",
          }))
        );
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

  return {
    fetchData,
    addEntry,
  };
};
