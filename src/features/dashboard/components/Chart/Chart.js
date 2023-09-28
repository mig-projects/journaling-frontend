import React from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";
import useChart from "./useChart";

const Chart = ({ loading, graph, expandGraph, reduceGraph }) => {
  // Use custom hook to configure chart
  const { option } = useChart({
    loading,
    graph,
    expandGraph,
  });

  const nodeClickHandler = (params) => {
    if (params?.dataType === "node") {
      reduceGraph(params.data);
    }
  };

  if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <ReactEcharts
        style={{ width: "100%", height: "100vh" }}
        option={option}
        lazyUpdate={true}
        notMerge={true}
        className="chartDiv"
        onEvents={{
          click: nodeClickHandler,
        }}
      />
    );
  }
};
export default Chart;
