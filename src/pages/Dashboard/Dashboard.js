import "./Dashboard.css";
import Chart from "../../features/dashboard/components/Chart/Chart";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import SidePanel from "../../features/dashboard/components/SidePanel/SidePanel";
import useChart from "../../features/dashboard/components/Chart/useChart";
import usePreprocessing from "../../features/dashboard/hooks/usePreprocessing";

const MOCK = false;
const LIMIT = false;

const Dashboard = () => {
  // Get user and registration status from authentication context
  const { isRegisteredUser, user } = useAuth();
  // Use custom hook to preprocess data
  const { loading, graph } = usePreprocessing({
    MOCK,
    user,
  });

  // Use custom hook to configure chart
  const { option } = useChart({ loading, graph, LIMIT });

  const navigate = useNavigate();

  // Effect hook to redirect unregistered users to home page
  useEffect(() => {
    if (!isRegisteredUser) {
      navigate("/", {
        state: {
          message: {
            type: "info",
            message:
              "Please login with an approved account to access this page.",
          },
        },
      });
    }
  }, [isRegisteredUser, navigate]);

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
        <SidePanel graph={graph} />
        <div className="chart">
          <Chart option={option} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
