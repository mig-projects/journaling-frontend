import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import { useNavigate } from "react-router-dom";
import "./Chart.css";
import usePreprocessing from "../../hooks/usePreprocessing";

const MOCK = true;
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
        : { color: "#7438e2", borderWidth: 2, borderColor: "#f0eded" },
      label: { show: !isUserTag(n) },
    }));
    if (limit) {
      newNodes = newNodes.filter((n) => parseInt(n.id) < 10);
    }

    console.log("New nodes:", newNodes);
    return newNodes;
  };

  const createLinkSpec = (links, graphType = "listTags", limit = false) => {
    console.log(limit);
    let newLinks = links.map((l) => ({
      ...l,
      value: l.value * 10,
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

    console.log("New links: ", newLinks);

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
      graph = graphs.find((graph) => graph.type === "starShaped");
      console.log(graph);
    }
    if (graph) {
      option = {
        backgroundColor: "#f7f7f7",
        tooltip: createListingTooltip(graph.nodes, graphType),
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
              repulsion: 500,
              edgeLength: [5, 50],
              gravity: 0.1,
            },
          },
        ],
      };
    }
    console.log("New option: ", option);
    return option;
  };

  if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <div className="chartContainer">
        <Typography>Listing tags on click</Typography>
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={createOptionSpec(graphs, "listTags", MOCK, LIMIT)}
          className="chartDiv"
        />
        <Typography>Showing user tags</Typography>
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={createOptionSpec(graphs, "starShaped", MOCK, LIMIT)}
          className="chartDiv"
        />
        <Typography>Removing sugggested tag links</Typography>
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={createOptionSpec(graphs, "userLinksOnly", MOCK, LIMIT)}
          className="chartDiv"
        />
      </div>
    );
  }
};
export default Chart;
