import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import { useNavigate } from "react-router-dom";
import "./Chart.css";
import usePreprocessing from "../../hooks/usePreprocessing";
import useChart from "./useChart";

const MOCK = false;
const LIMIT = false;

const Chart = () => {
  // Get user and registration status from authentication context
  const { user, isRegisteredUser } = useAuth();

  // Use custom hook to preprocess data
  const { loading, graph, tagClusters, AITopics } = usePreprocessing({
    MOCK,
    user,
  });

  // Use custom hook to configure chart
  const { option } = useChart({ loading, graph, tagClusters, AITopics, LIMIT });

  const navigate = useNavigate();

  // Effect hook to redirect unregistered users to login page
  useEffect(() => {
    if (!isRegisteredUser) {
      navigate("/login");
    }
  }, [isRegisteredUser]);

  if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <div className="chartContainer">
        <Typography>
          MIGR-AI-TION is conducting EU research on the relationships between
          between workplace discrimination and algorithmic hiring bias. We are
          working closely with a core group of eight intersectional migrant tech
          workers based in Berlin, and a wider group of pre-selected
          participants via Discord. The visualization maps the main themes
          emerging from our collaborative research from September to November
          2023.
        </Typography>
        <br />
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={option}
          lazyUpdate={true}
          notMerge={true}
          className="chartDiv"
        />
      </div>
    );
  }
};
export default Chart;
