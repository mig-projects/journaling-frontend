import React, { useState, useRef, useEffect } from "react";
import upload from "../../../../pics/upload.png";
import Typography from "@mui/material/Typography";
import "./FileInput.css";

const style1 = {
  width: "200px",
  height: "200px",
  color: "black",
  borderRadius: "3px",
  margin: "0 auto",
  marginTop: "90px",
  backgroundImage: `url(${upload})`,
  backgroundSize: "cover",
};

const FileInput = ({ src, setSrc }) => {
  const fileInput = useRef(null);

  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      setSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const openFileInput = () => {
    fileInput.current.click();
  };

  return (
    <div>
      <Typography>
        Upload a photo of a memory.{" "}
        <span className="textOptional">(optional)</span>
      </Typography>
      <div className="imageInput" onClick={openFileInput} style={style1}>
        <img
          style={{ height: "100%" }}
          className="loadedImage"
          src={src}
          alt=""
        />

        <label>
          <input
            ref={fileInput}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleImageSelection}
          />
        </label>
      </div>
    </div>
  );
};
export default FileInput;
