import React from "react";
import "./SidePanel.css";
import { CircularProgress } from "@mui/material";
import FullView from "./components/FullView/FullView";
import NodeView from "./components/NodeView/NodeView";
import { useGraph } from "../../../../contexts/graph";

const SidePanel = () => {
  const { loading, graph, reduceGraph } = useGraph();
  return (
    <div className="sidePanelContainer">
      {loading ? (
        <CircularProgress />
      ) : ["fullView", "communityView"].includes(graph.state) ? (
        <FullView nodes={graph.nodes} reduceGraph={reduceGraph} />
      ) : graph.state === "nodeView" ? (
        <NodeView nodes={graph.nodes} topics={graph.topics} />
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
