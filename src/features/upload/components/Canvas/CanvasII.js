import React, { useEffect, useRef, useCallback, useState } from "react";
import "./Canvas.css";

import {
  createTheme,
  Grid,
  Typography,
  ThemeProvider,
  Button,
  ButtonGroup,
  Slider,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import RubberIcon from "../../../../pics/RubberIcon.jpg";
import Palette from "./Palette";
import FileInput from "../FileInput/FileInput";

const transparencyStops = [
  { value: 10, hexValue: "1A" },
  { value: 20, hexValue: "33" },
  { value: 30, hexValue: "33" },
  { value: 40, hexValue: "1A" },
  { value: 50, hexValue: "33" },
  { value: 60, hexValue: "33" },
  { value: 70, hexValue: "33" },
  { value: 80, hexValue: "33" },
  { value: 90, hexValue: "1A" },
  { value: 100, hexValue: "FF" },
];

// var paths = [];
// var lastpath = [];
// var points = [];

// var lastX;
// var lastY;

export default function CanvasII({ setCanvasState }) {
  const canvasBackground = useRef(null);
  const canvasDrawing = useRef(null);
  const imageContext = useRef(null);
  const drawingContext = useRef(null);
  const [color, setColor] = useState("FF");
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPosition, setLastPosition] = useState({
    x: 0,
    y: 0,
  });
  const [brushSize, setBrushSize] = useState(25);
  const [transparency, setTransparency] = useState("FF");
  const [value, setValue] = useState(100);
  const [imgState, setImgState] = useState({
    image: null,
    height: null,
  });
  const [src, setSrc] = useState("");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#B272CE",
      },
    },
  });

  useEffect(
    (event) => {
      if (src) {
        handleImageUpload(src);
      }
    },
    [src]
  );

  // resize image
  useEffect(() => {
    const checkSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // define canvas size
  var canvasWidth = size.width / 2.25;
  if (size.width < 600) {
    canvasWidth = size.width - 90;
  }

  const handleImageUpload = (uploadedImage) => {
    const image = new Image();
    image.src = `${uploadedImage}`;
    image.onload = () => {
      const ratio = image.naturalWidth / image.naturalHeight;
      const imageHeight = canvasWidth / ratio;

      setImgState((prevState) => ({
        ...prevState,
        image: image,
        height: imageHeight,
        width: canvasWidth,
      }));
    };
  };

  // render canvases
  useEffect(() => {
    if (canvasBackground.current && canvasDrawing.current) {
      imageContext.current = canvasBackground.current.getContext("2d");
      drawingContext.current = canvasDrawing.current.getContext("2d");
      imageContext.current.drawImage(
        imgState.image,
        0,
        0,
        imgState.width,
        imgState.height
      );
      setCanvasState((prevState) => ({
        ...prevState,
        photo: canvasBackground.current.toDataURL("image/png"),
      }));
    }
  }, [imgState]);

  const draw = useCallback(
    (x, y, mode, color, size) => {
      if (mouseDown) {
        drawingContext.current.beginPath();
        drawingContext.current.globalCompositeOperation = mode;
        drawingContext.current.strokeStyle = color + transparency;
        drawingContext.current.lineWidth = size;
        drawingContext.current.lineJoin = "round";
        drawingContext.current.moveTo(lastPosition.x, lastPosition.y);
        drawingContext.current.lineTo(x, y);
        drawingContext.current.closePath();
        drawingContext.current.stroke();

        setLastPosition({
          x,
          y,
        });
      }
    },
    [lastPosition, mouseDown, setLastPosition, transparency]
  );

  const paint = useCallback(
    (x, y) => {
      draw(x, y, "source-over", color, brushSize);
    },
    [draw, color, brushSize]
  );

  const erase = useCallback(
    (x, y) => {
      draw(x, y, "destination-out", "#0000FF", brushSize);
    },
    [draw, brushSize]
  );

  //clear function
  const clear = () => {
    drawingContext.current.clearRect(
      0,
      0,
      drawingContext.current.canvas.width,
      drawingContext.current.canvas.height
    );
  };
  //draw functions
  const onMouseDown = (e) => {
    setLastPosition({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    setMouseDown(true);
  };

  const onMouseUp = () => {
    setMouseDown(false);
    if (canvasDrawing.current) {
      setCanvasState((prevState) => ({
        ...prevState,
        drawing: canvasDrawing.current.toDataURL("image/png"),
      }));
    }
  };

  const onMouseMove = (e) => {
    paint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  // brush settings
  const setBrushSmall = () => {
    setBrushSize(12);
  };

  const setBrushMedium = () => {
    setBrushSize(25);
  };

  const setBrushLarge = () => {
    setBrushSize(50);
  };
  //transparency settings
  const selectTransparency = (event, newValue) => {
    setValue(newValue);
    let i = transparencyStops.findIndex((t) => t.value === newValue);
    setTransparency(transparencyStops[i].hexValue);
  };
  if (imgState.image) {
    return (
      <div>
        <Typography>
          Upload a picture and make a <b>collage</b> using your photograph and
          our painting tool!
          <br />
          <br />
        </Typography>
        <div className="canvasDiv">
          <canvas
            className="canvas"
            width={imgState.width}
            height={imgState.height}
            ref={canvasBackground}
          />
          <canvas
            className="canvasDivTwo"
            width={imgState.width}
            height={imgState.height}
            ref={canvasDrawing}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
          />
        </div>
        <br />
        <Grid
          container
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          spacing={0}
        >
          <Grid item xs={11}>
            <div className="paletteDiv">
              <Palette selectColor={(color) => setColor(color)} paint={paint} />
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className="columnTwo">
              <div className="brushSize">
                <ThemeProvider theme={theme}>
                  <Typography className="brushSizeText">Brush size:</Typography>
                  <ButtonGroup
                    variant="text"
                    aria-label="text button group"
                    className="brushSizeButtons"
                  >
                    <Button onClick={setBrushSmall}>s</Button>
                    <Button onClick={setBrushMedium}>m</Button>
                    <Button onClick={setBrushLarge}>l</Button>
                  </ButtonGroup>
                </ThemeProvider>
              </div>
              <div className="opacityDiv">
                <ThemeProvider theme={theme}>
                  <Typography className="opacity">Transparency:</Typography>
                  <Box width={100} className="slider">
                    <Slider
                      size="Small steps"
                      min={10}
                      max={100}
                      step={10}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      onChange={selectTransparency}
                      value={value}
                    />
                  </Box>
                </ThemeProvider>
              </div>
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className="columnThree">
              <div className="erase">
                <ThemeProvider theme={theme}>
                  <Chip
                    className="eraseAndUndo"
                    avatar={<Avatar alt="erase" src={RubberIcon} />}
                    label="Erase"
                    onClick={erase}
                  />
                </ThemeProvider>
              </div>
            </div>
          </Grid>
          <Grid item xs={11} md={4}>
            <div className="clearCanvas">
              <Chip
                variant="contained"
                className="eraseAndUndo"
                onClick={clear}
                label="Clear Canvas"
                icon={<DeleteIcon />}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <FileInput src={src} setSrc={setSrc} />
      </div>
    );
  }
}
