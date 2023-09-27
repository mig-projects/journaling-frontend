import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { mockGraph } from "../mockGraph";

// Hook for dashboard preprocessing logic
// - Pulling data from Supabase
// - Transforming data
// Returns:
// - loading (boolean)
// - graph (nodes: Array<any>, links: Array<any>, type: string, clusters: Array<{tag_name: str, cluster_id: int}>, topics: Array<{cluster_id: int, topic: str, description: str}>)

const usePreprocessing = ({ MOCK, user }) => {
  const { fetchData } = useApi({ user });
  const [graph, setGraph] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-process the nodes for dashboard display.
  // So far just normalize node size to the desired range.
  const transformNodes = (nodes, min = 15, max = 50) => {
    const logNodes = nodes.map((node) => ({
      ...node,
      size: Math.log10(node.count + 1),
    }));

    const maxLogSize = Math.max(...logNodes.map((node) => node.size));
    const minLogSize = Math.min(...logNodes.map((node) => node.size));

    const normalizedNodes = logNodes.map((node) => ({
      id: node.node_type + "||" + node.name,
      name: node.name,
      count: node.count,
      size:
        ((node.size - minLogSize) / (maxLogSize - minLogSize)) * (max - min) +
          min || min,
      tagType: node.node_type,
    }));

    return normalizedNodes;
  };

  useEffect(() => {
    setLoading(true);
    const initializeGraph = async () => {
      const nodes = await fetchData("rpc", "get_nodes");
      const links = await fetchData("rpc", "get_links");
      const clusters = await fetchData("select", "cluster_assignments");
      const topics = await fetchData("select", "cluster_descriptions");

      setGraph({
        links: links.map((link) => ({
          source: link.source_type + "||" + link.source_name,
          target: link.target_type + "||" + link.target_name,
          value: link.count,
        })),
        nodes: transformNodes(nodes),
        type: "userData",
        clusters: clusters,
        topics: topics,
      });
    };

    if (MOCK) {
      setGraph(mockGraph);
    } else {
      initializeGraph();
    }
    setLoading(false);
  }, [MOCK, fetchData]);

  return { loading, graph };
};

export default usePreprocessing;
