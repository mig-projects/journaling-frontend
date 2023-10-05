import "./Dashboard.css";
import Chart from "../../features/dashboard/components/Chart/Chart";
import { Typography, Select, MenuItem, Button } from "@mui/material";
import SidePanel from "../../features/dashboard/components/SidePanel/SidePanel";
import MapInfoButton from "../../features/dashboard/components/MapInfoButton/MapInfoButton";
import { useGraph } from "../../contexts/graph";

const Dashboard = () => {
  // Get user and registration status from authentication context

  // Use custom hook to preprocess data
  const {
    expandGraph,
    communities,
    currentCommunities,
    setCurrentCommunities,
  } = useGraph();

  const handleCommunityChange = (event) => {
    setCurrentCommunities(event.target.value);
  };

  return (
    <div className="dashboardMain">
      <br />

      <div className="chartContainer">
        <SidePanel />
        <div className="chart">
          <Select
            className="communitySelect overlayButton"
            value={currentCommunities}
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
            {communities &&
              communities.map((community, index) => (
                <MenuItem key={index} value={community}>
                  {community}
                </MenuItem>
              ))}
          </Select>

          <Chart />
          <div className="buttonContainer">
            <Button className="backButton overlayButton" onClick={expandGraph}>
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
