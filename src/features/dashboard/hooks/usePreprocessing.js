import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { mockGraphs } from "../mockGraph";

const usePreprocessing = ({ MOCK, user }) => {
  const { fetchData } = useApi({ user });
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize links function to count co-occurences
  const initializeLinks = (suggestedTags, userTags) => {
    const textMemoryMap = suggestedTags.reduce((acc, item) => {
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
      size: Math.log10(node.value + 1),
    }));

    const maxLogSize = Math.max(...logNodes.map((node) => node.size));
    const minLogSize = Math.min(...logNodes.map((node) => node.size));

    const normalizedNodes = logNodes.map((node) => ({
      ...node,
      size:
        ((node.size - minLogSize) / (maxLogSize - minLogSize)) * (max - min) +
        min,
    }));

    return normalizedNodes;
  };

  // Aggregate counts from fetched data
  // Transform nodes to fit the graph
  const initializeNodes = (suggestedTags, userTags, tags) => {
    const nodeCounts = suggestedTags.reduce((acc, item) => {
      acc[item.suggested_tag_id] = (acc[item.suggested_tag_id] || 0) + 1;
      return acc;
    }, {});

    const nodes = Object.keys(nodeCounts).map((id) => ({
      id,
      value: nodeCounts[id],
      name: tags.find((tag) => tag.id === id).name || "Unknown",
    }));

    return transformNodes(nodes);
  };

  useEffect(() => {
    setLoading(true);
    const initializeGraph = async () => {
      const suggestedTags = await fetchData("suggested_tag_memories");
      const tags = await fetchData("suggested_tags");
      const userTags = await fetchData("user_tags");

      setGraphs([
        {
          links: initializeLinks(suggestedTags, userTags),
          nodes: initializeNodes(suggestedTags, userTags, tags),
          type: "userData",
        },
      ]);
    };
    if (MOCK) {
      setGraphs(mockGraphs);
    } else {
      initializeGraph();
    }
    setGraphs((prevState) =>
      prevState.map((graph) => ({
        ...graph,
        nodes: transformNodes(graph.nodes),
      }))
    );
    setLoading(false);
  }, []);

  return { loading, graphs };
};

export default usePreprocessing;
