import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import { useApi } from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { mockGraph } from "../../mockGraph";
import "./Chart.css";

const MOCK = true;

const Chart = () => {
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { fetchData } = useApi({ user });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("login/");
    }
  }, [user]);

  const getRandomColor = () => {
    var value = (Math.random() * 0xff) | 0;
    var grayscale = (value << 16) | (value << 8) | value;
    var color = "#" + grayscale.toString(16);
    return color;
  };

  const initializeNodes = (data, tags) => {
    const nodeCounts = data.reduce((acc, item) => {
      acc[item.suggested_tag_id] = (acc[item.suggested_tag_id] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(nodeCounts).map((id) => ({
      id,
      value: nodeCounts[id],
      name: tags.find((tag) => tag.id === id).name || "Unknown",
    }));
  };

  // Initialize links function to count co-occurences
  const initializeLinks = (data) => {
    const textMemoryMap = data.reduce((acc, item) => {
      acc[item.text_memory_id] = (acc[item.text_memory_id] || []).concat(
        item.suggested_tag_id
      );
      return acc;
    }, {});

    const linkCounts = Object.values(textMemoryMap).reduce((acc, tags) => {
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          const linkKey =
            tags[i] < tags[j]
              ? `${tags[i]}|${tags[j]}`
              : `${tags[j]}|${tags[i]}`;
          acc[linkKey] = (acc[linkKey] || 0) + 1;
        }
      }
      return acc;
    }, {});

    return Object.keys(linkCounts).map((link) => ({
      source: link.split("|")[0],
      target: link.split("|")[1],
      value: linkCounts[link],
    }));
  };

  // Log-transform and project to desired min-max interval
  const transformNodes = (nodes, min = 5, max = 50) => {
    const logNodes = nodes.map((node) => ({
      ...node,
      logSize: Math.log10(node.value + 1),
    }));

    const maxLogSize = Math.max(...logNodes.map((node) => node.logSize));
    const minLogSize = Math.min(...logNodes.map((node) => node.logSize));

    const normalizedNodes = logNodes.map((node) => ({
      id: node.id,
      name: node.name,
      value: node.value,
      size:
        ((node.logSize - minLogSize) / (maxLogSize - minLogSize)) *
          (max - min) +
        min,
      tags: node.tags,
    }));
    console.log(normalizedNodes);

    return normalizedNodes;
  };

  useEffect(() => {
    const initializeGraph = async () => {
      setLoading(true);
      const data = await fetchData("suggested_tag_memories");
      const tags = await fetchData("suggested_tags");
      console.log(tags);
      setGraph({
        links: initializeLinks(data),
        nodes: initializeNodes(data, tags),
      });
      setLoading(false);
      console.log(graph);
    };
    if (MOCK) {
      setGraph(mockGraph);
    } else {
      initializeGraph();
    }
    setGraph((prevState) => ({
      ...prevState,
      nodes: transformNodes(prevState.nodes),
    }));
  }, []);

  if (loading) {
    <CircularProgress />;
  } else {
    let option = {
      backgroundColor: "rgba(171, 136, 191, 0.4)",
      tooltip: {
        triggerOn: "click",
        formatter: (params) => {
          if (params.dataType === "node") {
            const node = graph.nodes.find((n) => n.id === params.data.id);
            const tags = node.tags
              ? node.tags.join("</li><li>")
              : "No tags available";
            return `Category: ${node.name}<br>User tags: <ul><li>${tags}</li></ul>`;
          }
        },
      },
      legend: {
        data: graph.nodes.value,
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: graph.nodes.map((n) => ({
            ...n,
            symbolSize: n.size,
            itemStyle: { color: getRandomColor() },
          })),
          links: graph.links.map((l) => ({
            ...l,
            value: l.value * 10,
            lineStyle: { color: "#24e1ea", curveness: 0.1 },
            label: { show: false },
          })),
          roam: true,
          label: {
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
    return (
      <div className="chartContainer">
        <Typography>Intro Paragraph</Typography>
        <ReactEcharts
          style={{ width: "100%", height: "100vh" }}
          option={option}
          className="chartDiv"
        />
      </div>
    );
  }
};
export default Chart;
