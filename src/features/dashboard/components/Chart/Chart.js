import React from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";

const Chart = ({ loading, option }) => {
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
      />
    );
  }
};
export default Chart;
