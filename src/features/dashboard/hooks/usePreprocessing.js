import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { mockGraphs } from "../mockGraph";

const usePreprocessing = ({ MOCK, user }) => {
  const { fetchData } = useApi({ user });
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Log-transform and project to desired min-max interval
  const transformNodes = (nodes, min = 5, max = 50) => {
    const logNodes = nodes.map((node) => ({
      ...node,
      size: Math.log10(node.count + 1),
    }));

    const maxLogSize = Math.max(...logNodes.map((node) => node.count));
    const minLogSize = Math.min(...logNodes.map((node) => node.count));

    const normalizedNodes = logNodes.map((node) => ({
      id: node.tag_category + "||" + node.name,
      name: node.name,
      size:
        ((node.count - minLogSize) / (maxLogSize - minLogSize)) * (max - min) +
        min,
      tagType: node.tag_category,
    }));

    return normalizedNodes;
  };

  useEffect(() => {
    setLoading(true);
    const initializeGraph = async () => {
      const nodes = await fetchData("rpc", "get_nodes");
      const links = await fetchData("rpc", "get_links");

      setGraphs([
        {
          links: links.map((link) => ({
            source: link.source_category + "||" + link.source_name,
            target: link.target_category + "||" + link.target_name,
            value: link.count,
          })),
          nodes: transformNodes(nodes),
          type: "userData",
        },
      ]);
    };
    if (MOCK) {
      setGraphs(mockGraphs);
    } else {
      initializeGraph();
    }
    setLoading(false);
  }, []);

  return { loading, graphs };
};

export default usePreprocessing;
