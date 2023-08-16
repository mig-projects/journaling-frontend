import React, { useState, useRef, useEffect } from 'react';
import upload from "../../pics/upload.png";
import Typography from '@mui/material/Typography';


export default function FileInput(props) {

    const [src, setSrc] = useState(null);
    const fileInput = useRef(null);

    var style1 = {
        width: "200px",
        height: "200px",
        color: "black",
        // border: "#B272CE solid 8px",
        borderRadius: "3px",
        // boxShadow: "3px 3px 3px #b4beb7",
        margin: "0 auto",
        marginTop: "90px",
        // backgroundColor: "rgba(255,255,255,0.5)",
        backgroundImage: `url(${upload})`,
        backgroundSize: "cover",
    }

    const handleImageSelection = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            setSrc(e.target.result);
            console.log('loadfilereader');
        };
        reader.readAsDataURL(file);
    };

    useEffect((event) => {
        if (src) {
            props.selectImage(src);
        }
    }, [src, props]);

    const openFileInput = () => {
        fileInput.current.click();
        console.log('fileinput');
    };

    return (
        <div>
            <Typography>Upload a photo of a memory.</Typography>
            <div
                className="image-input"
                onClick={openFileInput}
                style={style1}
            >

                <img
                    style={{ height: "100%" }}
                    className="loaded-image"
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
}