import "./Dashboard.css";
import Chart from "../../features/dashboard/components/Chart/Chart";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const Dashboard = () => {
  // Get user and registration status from authentication context
  const { isRegisteredUser } = useAuth();

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
    <div className="chartContainer">
      <Typography>
        MIGR-AI-TION is conducting EU research on the relationships between
        between workplace discrimination and algorithmic hiring bias. We are
        working closely with a core group of eight intersectional migrant tech
        workers based in Berlin, and a wider group of pre-selected participants
        via Discord. The visualization maps the main themes emerging from our
        collaborative research from September to November 2023.
      </Typography>
      <br />
      <Chart />
    </div>
  );
};

export default Dashboard;
