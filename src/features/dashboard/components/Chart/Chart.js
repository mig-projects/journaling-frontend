import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import { useNavigate } from "react-router-dom";
import "./Chart.css";
import usePreprocessing from "../../hooks/usePreprocessing";

const MOCK = false;
const LIMIT = false;

const Chart = () => {
  const { user, isRegisteredUser } = useAuth();
  const { loading, graphs } = usePreprocessing({ MOCK, user });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegisteredUser) {
      navigate("/login");
    }
  }, [isRegisteredUser]);

  const createListingTooltip = (nodes, graphType = "listTags") => {
    if (graphType === "listTags") {
      const listFormatter = (params) => {
        if (params.dataType === "node") {
          const node = nodes.find((n) => n.id === params.data.id);
          const tags = node.tags
            ? node.tags.join("</li><li>")
            : "No tags available";
          return `Category: ${node.name}<br>User tags: <ul><li>${tags}</li></ul>`;
        }
      };

      return {
        triggerOn: "click",
        formatter: listFormatter,
      };
    } else {
      return {};
    }
  };

  const createDataSpec = (nodes, graphType = "listTags", limit = false) => {
    const isUserTag = (n) => {
      return graphType === "starShaped" && n.tagType === "highlight";
    };

    let newNodes = nodes.map((n) => ({
      ...n,
      symbolSize: isUserTag(n) ? 15 : n.size,
      itemStyle: isUserTag(n)
        ? { color: "#a280df", borderWidth: 1, borderColor: "#f0eded" }
        : {
            color: "#7438e2",
            borderWidth: 2,
            borderColor: "#f0eded",
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
              scale: true,
              label: { show: true },
            },
          },
      label: { show: !isUserTag(n) },
    }));
    if (limit) {
      newNodes = newNodes.filter((n) => parseInt(n.id) < 10);
    }

    // console.log("New nodes:", newNodes);
    return newNodes;
  };

  const createLinkSpec = (links, graphType = "listTags", limit = false) => {
    let newLinks = links.map((l) => ({
      ...l,
      value: l.value,
      lineStyle: { color: "#8CD1CA", curveness: 0.1 },
      label: { show: false },
    }));
    if (limit) {
      newLinks = newLinks.filter(
        (link) => parseInt(link.source) < 10 && parseInt(link.target) < 10
      );
    }

    if (graphType === "userLinksOnly") {
      newLinks = newLinks.filter((link) => link.value === 10);
    }

    // console.log("New links: ", newLinks);

    return newLinks;
  };

  const createOptionSpec = (graphs, graphType, MOCK, LIMIT) => {
    let option = {};
    let graph = {};
    if (graphType === "listTags") {
      graph = graphs.find((graph) =>
        graph.type === MOCK ? "mockGraph" : "userData"
      );
    } else if (graphType === "starShaped" || graphType === "userLinksOnly") {
      graph = graphs.find((graph) =>
        graph.type === MOCK ? "starShaped" : "userData"
      );
      // console.log(graph);
    }
    if (graph) {
      option = {
        // title: {
        //   text: "",
        // },
        backgroundColor: "#f7f7f7",
        tooltip: {},
        series: [
          {
            type: "graph",
            layout: "force",
            nodes: createDataSpec(graph.nodes, graphType, LIMIT),
            links: createLinkSpec(graph.links, graphType, LIMIT),
            roam: true,
            label: {
              show: true,
              position: "right",
            },
            force: {
              initLayout: null,
              repulsion: 300,
              edgeLength: [50, 100],
              friction: 0.5,
              gravity: 0.1,
            },
            selectedMode: "single",
          },
        ],
      };
    }
    // console.log("New option: ", option);
    return option;
  };

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
          option={createOptionSpec(graphs, "starShaped", MOCK, LIMIT)}
          className="chartDiv"
        />
      </div>
    );
  }
};
export default Chart;
