import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../../contexts/auth";
import { useApi } from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

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
      size: nodeCounts[id],
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
    initializeGraph();
  }, []);

  if (loading) {
    <CircularProgress />;
  } else {
    let option = {
      tooltip: {
        alwaysShowContent: true,
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: graph.nodes.map((n) => ({
            ...n,
            symbolSize: n.size * 10,
            name: n.name,
            itemStyle: { color: getRandomColor() },
          })),
          links: graph.links.map((l) => ({
            ...l,
            lineStyle: { color: "#24e1ea" },
          })),
          roam: true,
          label: {
            position: "right",
          },
          force: {
            repulsion: 100,
          },
        },
      ],
    };
    return (
      <ReactEcharts
        style={{ width: "100%", height: "100vh" }}
        option={option}
      />
    );
  }
};
export default Chart;
