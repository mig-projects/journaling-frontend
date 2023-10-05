import React from "react";
import "./SidePanel.css";
import { CircularProgress } from "@mui/material";
import FullView from "./components/FullView/FullView";
import NodeView from "./components/NodeView/NodeView";
import { useGraph } from "../../../../contexts/graph";

const SidePanel = () => {
  const { loading, currentNode } = useGraph();
  return (
    <div className="sidePanelContainer">
      {loading ? (
        <CircularProgress />
      ) : Object.keys(currentNode).length === 0 ? (
        <FullView />
      ) : currentNode.id ? (
        <NodeView />
      ) : (
        <div>
          The data couldn't be loaded. Please try refreshing the page or contact
          your administrator.
        </div>
      )}
    </div>
  );
};

export default SidePanel;
