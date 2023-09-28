import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import { mockGraph } from "../mockGraph";

// Hook for dashboard preprocessing logic
// - Pulling data from Supabase
// - Transforming data
// Returns:
// - loading (boolean)
// - graph (nodes: Array<any>, links: Array<any>, topics: Array<{cluster: int, ai_topic: str, ai_description: str}>)

const usePreprocessing = ({ user }) => {
  const { fetchData } = useApi({ user });
  const [fullNodes, setFullNodes] = useState([]);
  const [fullLinks, setFullLinks] = useState([]);
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
      cluster: node.cluster,
      size:
        ((node.size - minLogSize) / (maxLogSize - minLogSize)) * (max - min) +
          min || min,
      tagType: node.node_type,
    }));

    return normalizedNodes;
  };

  const transformLinks = (links) => {
    return links.map((link) => ({
      source: link.source_type + "||" + link.source_name,
      target: link.target_type + "||" + link.target_name,
      value: link.count,
    }));
  };

  // This function takes a node in input, and returns the graph adjacent to this node.
  const reduceGraph = useCallback(
    (node) => {
      const newLinks = fullLinks.filter(
        (link) => link.source === node.id || link.target === node.id
      );
      const newNodes = fullNodes.filter(
        (node) =>
          newLinks.map((link) => link.source).includes(node.id) ||
          newLinks.map((link) => link.target).includes(node.id)
      );
      setGraph((prevState) => ({
        links: newLinks,
        nodes: newNodes,
        topics: prevState.topics,
        state: "nodeView",
      }));
    },
    [fullLinks, fullNodes]
  );

  // Return to view on the full dataset
  const expandGraph = useCallback(() => {
    setGraph((prevState) => ({
      nodes: fullNodes,
      links: fullLinks,
      topics: prevState.topics,
      state: "fullView",
    }));
  }, [fullLinks, fullNodes]);

  useEffect(() => {
    const initializeGraph = async () => {
      let nodes = await fetchData("rpc", "get_nodes");
      let links = await fetchData("rpc", "get_links");
      const topics = await fetchData("rpc", "get_topics");

      nodes = transformNodes(nodes);
      links = transformLinks(links);

      setGraph({
        nodes: nodes,
        links: links,
        topics: topics,
        state: "fullView",
      });

      setFullLinks(links);
      setFullNodes(nodes);
    };

    // Execute async initialization
    setLoading(true);
    initializeGraph();
    setLoading(false);
  }, [fetchData]);

  return { loading, graph, reduceGraph, expandGraph };
};

export default usePreprocessing;
