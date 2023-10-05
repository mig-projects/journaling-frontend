import React from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";
import useChart from "./useChart";
import { useGraph } from "../../../../contexts/graph";

const Chart = () => {
  const { loading, graph, reduceGraph } = useGraph();
  // Use custom hook to configure chart
  const { option } = useChart({
    loading,
    graph,
  });

  const clickHandler = (params) => {
    if (params.componentType === "series" && params?.dataType === "node") {
      reduceGraph(params.data);
    }
  };

  if (loading) {
    return <CircularProgress />;
  } else {
    if (Object.keys(option).length > 0) {
      return (
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={option}
          lazyUpdate={true}
          notMerge={true}
          className="chartDiv"
          onEvents={{
            click: clickHandler,
          }}
        />
      );
    }
  }
};
export default Chart;
