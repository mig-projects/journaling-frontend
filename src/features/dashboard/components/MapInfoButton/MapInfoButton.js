import { Button, Collapse } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

const MapInfoButton = () => {
  const [showMapInfo, setShowMapInfo] = useState(false);
  const handleExplanationToggle = () => {
    setShowMapInfo((prevShowExplanation) => !prevShowExplanation);
  };

  return (
    <div className={`infoButtonContainer ${showMapInfo && "expanded"}`}>
      <Button onClick={handleExplanationToggle} className="infoButton">
        <InfoOutlinedIcon mr={1} /> What's this map?
      </Button>

      {showMapInfo && (
        <Collapse in={showMapInfo}>
          <div className="explanation">More information about the chart.</div>
        </Collapse>
      )}
    </div>
  );
};

export default MapInfoButton;
