import { createContext, useContext } from "react";

import { useState, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { chartColorPalette } from "../themes/theme";

// Context for providing graph for dashboard visualization
// - Pulling data from Supabase
// - Transforming data on init
// - Event handlers
// Returns:
// - loading (boolean)
// - graph (nodes: Array<any>, links: Array<any>, topics: Array<{cluster: int, ai_topic: str, ai_description: str}>)
// - Functions

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const { fetchData } = useApi();

  const [initialGraph, setInitialGraph] = useState({
    nodes: [],
    links: [],
    topics: [],
  });

  const [communities, setCommunities] = useState([]);
  const [currentCommunities, setCurrentCommunities] = useState([]);

  const [currentNode, setCurrentNode] = useState({});

  const [renderGraph, setRenderGraph] = useState({
    nodes: [],
    links: [],
    topics: [],
  });
  const [loading, setLoading] = useState(false);

  // Pre-process the nodes for dashboard display.
  // So far just normalize node size to the desired range.
  const preprocessNodes = (nodes, min = 15, max = 50) => {
    // Transform function for community tags

    const capitalizeFirstLetters = (arr) => {
      return arr
        .filter((str) => str)
        .map((str) => {
          return str.charAt(0).toUpperCase() + str.slice(1);
        });
    };

    // Log transform for node size
    const logNodes = nodes.map((node) => ({
      ...node,
      size: Math.log10(node.count + 1),
    }));

    const maxLogSize = Math.max(...logNodes.map((node) => node.size));
    const minLogSize = Math.min(...logNodes.map((node) => node.size));

    // Normalizing sizes to provided min-max + other transforms.
    const normalizedNodes = logNodes.map((node) => ({
      id: node.node_type + "||" + node.name,
      name: node.name,
      count: node.count,
      cluster: node.cluster,
      description: node.cat_description,
      communityTags: capitalizeFirstLetters(node.community_tags),
      size:
        ((node.size - minLogSize) / (maxLogSize - minLogSize)) * (max - min) +
          min || min,
      tagType: node.node_type,
    }));

    return normalizedNodes;
  };

  const preprocessLinks = (links) => {
    return links.map((link) => ({
      source: link.source_type + "||" + link.source_name,
      target: link.target_type + "||" + link.target_name,
      value: link.count,
    }));
  };

  const preprocessTopics = (topics) => {
    return topics.map((topic, index) => ({
      ...topic,
      color: chartColorPalette.clusters[index],
    }));
  };

  const getCommunities = (nodes) => {
    const allTags = nodes.reduce((acc, cur) => {
      return acc.concat(cur.communityTags);
    }, []);

    return [...new Set(allTags)].sort();
  };

  // This function takes a node in input, and returns the graph adjacent to this node.
  const filterGraphByNode = useCallback(
    (graph) => {
      if (Object.keys(currentNode).length === 0) {
        return graph;
      }
      const newLinks = graph.links.filter(
        (link) =>
          link.source === currentNode.id || link.target === currentNode.id
      );
      const newNodes = graph.nodes.filter(
        (n) =>
          newLinks.map((link) => link.source).includes(n.id) ||
          newLinks.map((link) => link.target).includes(n.id)
      );

      return {
        ...graph,
        links: newLinks,
        nodes: newNodes,
      };
    },
    [currentNode]
  );

  // Returning the subset of nodes who have been connected to a given community tag.
  const filterGraphByCommunity = useCallback(
    (graph) => {
      if (currentCommunities.length === 0) {
        return graph;
      }
      // Limit to nodes including this community
      let newNodes = initialGraph.nodes.filter((node) => {
        return node.communityTags.some((tag) =>
          currentCommunities.includes(tag)
        );
      });

      // Remove links not connected to any of the given nodes
      const newLinks = initialGraph.links.filter(
        (link) =>
          newNodes.map((node) => node.id).includes(link.source) &&
          newNodes.map((node) => node.id).includes(link.target)
      );

      return {
        ...graph,
        links: newLinks,
        nodes: newNodes,
      };
    },
    [initialGraph, currentCommunities]
  );

  const countFindings = useCallback((graph) => {
    // New category counts
    const newNodes = graph.nodes.map((node) => ({
      ...node,
      findingCount: graph.links.filter((link) =>
        [link.source, link.target].includes(node.id)
      ).length,
    }));
    return {
      ...graph,
      nodes: newNodes,
    };
  }, []);

  // Return to view on the full dataset
  const expandGraph = useCallback(() => {
    setCurrentNode({});
    setCurrentCommunities([]);
  }, []);

  useEffect(() => {
    const computeGraph = () => {
      let newGraph = { ...initialGraph };
      newGraph = filterGraphByCommunity(newGraph);
      newGraph = filterGraphByNode(newGraph);
      newGraph = countFindings(newGraph);
      return newGraph;
    };

    const newGraph = computeGraph();
    if (newGraph.nodes.length === 0) {
      setCurrentNode({});
    }
    setRenderGraph(newGraph);
  }, [
    currentNode,
    communities,
    currentCommunities,
    initialGraph,
    filterGraphByCommunity,
    filterGraphByNode,
  ]);

  useEffect(() => {
    const initializeGraph = async () => {
      let nodes = await fetchData("rpc", "get_nodes");
      let links = await fetchData("rpc", "get_links");
      let topics = await fetchData("rpc", "get_topics");

      const newGraph = {
        nodes: preprocessNodes(nodes),
        links: preprocessLinks(links),
        topics: preprocessTopics(topics),
      };

      setInitialGraph(newGraph);
      setCommunities(getCommunities(newGraph.nodes));
    };

    // Execute async initialization
    setLoading(true);
    initializeGraph().finally(() => setLoading(false));
  }, []);

  return (
    <GraphContext.Provider
      value={{
        loading,
        renderGraph,
        currentNode,
        communities,
        currentCommunities,
        setCurrentNode,
        setCurrentCommunities,
        expandGraph,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
