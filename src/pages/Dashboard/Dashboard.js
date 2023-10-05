import "./Dashboard.css";
import Chart from "../../features/dashboard/components/Chart/Chart";
import { useState } from "react";
import { Typography, Select, MenuItem, Button } from "@mui/material";
import SidePanel from "../../features/dashboard/components/SidePanel/SidePanel";
import MapInfoButton from "../../features/dashboard/components/MapInfoButton/MapInfoButton";
import { useGraph } from "../../contexts/graph";

const Dashboard = () => {
  // Get user and registration status from authentication context
  const [selectedCommunity, setSelectedCommunity] = useState([]);

  // Use custom hook to preprocess data
  const { graph, expandGraph, filterGraphByCommunity } = useGraph();

  const handleCommunityChange = (event) => {
    setSelectedCommunity(event.target.value);
    filterGraphByCommunity(graph, event.target.value);
  };

  const expandAndReset = () => {
    expandGraph();
    setSelectedCommunity([]);
  };

  // const reduceAndReset = (node) => {
  //   reduceGraph(node, selectedCommunity);
  // };

  return (
    <div className="dashboardMain">
      <Typography>
        MIGR-AI-TION is conducting EU research on the relationships between
        between workplace discrimination and algorithmic hiring bias. We are
        working closely with a core group of eight intersectional migrant tech
        workers based in Berlin, and a wider group of pre-selected participants
        via Discord. The visualization maps the main themes emerging from our
        collaborative research from September to November 2023.
      </Typography>
      <br />

      <div className="chartContainer">
        <SidePanel />
        <div className="chart">
          <Select
            className="communitySelect overlayButton"
            value={selectedCommunity}
            onChange={handleCommunityChange}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return "Community Tags";
              }

              return selected.join(", ");
            }}
            displayEmpty
            multiple
            inputProps={{ "aria-label": "Without label" }}
          >
            {graph?.communities &&
              graph.communities.map((community, index) => (
                <MenuItem key={index} value={community}>
                  {community}
                </MenuItem>
              ))}
          </Select>

          <Chart />
          <div className="buttonContainer">
            <Button
              className="backButton overlayButton"
              onClick={expandAndReset}
            >
              Back to full view
            </Button>
            <MapInfoButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
