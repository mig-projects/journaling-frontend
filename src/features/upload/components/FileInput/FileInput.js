import React, { useState, useRef, useEffect } from "react";
import upload from "../../../../pics/upload-white.png";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import "./FileInput.css";

const style1 = {
  width: "200px",
  height: "200px",
  color: "black",
  borderRadius: "15px",
  margin: "0 auto",
  marginTop: "90px",
  backgroundColor: "#7438E2",
  backgroundImage: `url(${upload})`,
  backgroundSize: "cover",
  boxShadow: ""
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
        <li>
          Would it help to make some art about your thoughts? <span className="important-words">Click</span> to upload a picture.{" "}
        </li>
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
