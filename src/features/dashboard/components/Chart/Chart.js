import React from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import usePreprocessing from "../../hooks/usePreprocessing";
import useChart from "./useChart";

const MOCK = false;
const LIMIT = false;

const Chart = () => {
  // Use custom hook to preprocess data
  const { user } = useAuth();
  const { loading, graph } = usePreprocessing({
    MOCK,
    user,
  });

  // Use custom hook to configure chart
  const { option } = useChart({ loading, graph, LIMIT });

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
