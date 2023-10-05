import { Button, Collapse, Typography } from "@mui/material";
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
          <Typography className="explanation">
            The map visualizes central themes and key words from a growing
            qualitative dataset that is being created by research participants
            from September to November 2023. <br />
            <br />
            To pilot the research, eight Berlin-based intersectional migrant
            tech workers are contributing personal narratives on discriminatory
            experiences via journal submissions, Discord chat and
            semi-structured interviews. <br />
            <br />
            Central themes in the research are called ‘Categories’ and have been
            designated alongside participants and experts. Other nodes, called
            ‘Findings’, are annotations made by participants that capture the
            nature of their experiences within a longer text. Participants are
            also contributing ‘Community Tags’ in order to trace patterns of
            discriminatory behavior based on intersectional identities. <br />
            <br />
            Check back at a later date to see updates in the visualization.
          </Typography>
        </Collapse>
      )}
    </div>
  );
};

export default MapInfoButton;
