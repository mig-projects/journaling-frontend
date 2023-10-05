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
    communities: [],
  });
  const [currentNode, setCurrentNode] = useState({}); // Node used for node-centered view
  const [currentCommunities, setCurrentCommunities] = useState({}); // Community filter
  const [graph, setGraph] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-process the nodes for dashboard display.
  // So far just normalize node size to the desired range.
  const transformNodes = (nodes, min = 15, max = 50) => {
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
      highlightCount: node.highlight_count,
      communityTags: capitalizeFirstLetters(node.community_tags),
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

  const transformTopics = (topics) => {
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
  const reduceGraph = useCallback(
    (node, selectedCommunity) => {
      const newLinks = initialGraph.links.filter(
        (link) => link.source === node.id || link.target === node.id
      );
      const newNodes = initialGraph.nodes
        .filter(
          (n) =>
            newLinks.map((link) => link.source).includes(n.id) ||
            newLinks.map((link) => link.target).includes(n.id)
        )
        .map((n) =>
          n.id === node.id ? { ...n, tagType: "center-" + n.tagType } : n
        );

      // if (selectedCommunity.length > 0) {
      // }
      setGraph((prevState) => ({
        links: newLinks,
        nodes: newNodes,
        topics: prevState.topics,
        communities: prevState.communities,
        state: "nodeView",
      }));
    },
    [initialGraph]
  );

  // Returning the subset of nodes who have been connected to a given community tag.
  const filterGraphByCommunity = (graph, selectedTags) => {
    // Limit to nodes including this community
    let newNodes = initialGraph.nodes.filter((node) => {
      return node.communityTags.some((tag) => selectedTags.includes(tag));
    });

    // Remove links not connected to any of the given nodes
    const newLinks = initialGraph.links.filter(
      (link) =>
        newNodes.map((node) => node.id).includes(link.source) ||
        newNodes.map((node) => node.id).includes(link.target)
    );

    // New category counts
    newNodes = newNodes.map((node) => ({
      ...node,
      highlightCount: newLinks.filter((link) =>
        [link.source, link.target].includes(node.id)
      ).length,
    }));

    setGraph({
      ...graph,
      links: newLinks,
      nodes: newNodes,
      state: "communityView",
    });
  };

  // Return to view on the full dataset
  const expandGraph = useCallback(() => {
    setCurrentNode({});
    setCurrentCommunities({});
    setGraph(initialGraph);
  }, [initialGraph]);

  useEffect(() => {
    const initializeGraph = async () => {
      let nodes = await fetchData("rpc", "get_nodes");
      let links = await fetchData("rpc", "get_links");
      let topics = await fetchData("rpc", "get_topics");

      nodes = transformNodes(nodes);
      links = transformLinks(links);
      topics = transformTopics(topics);
      const communities = getCommunities(nodes);

      setGraph({
        nodes: nodes,
        links: links,
        topics: topics,
        communities: communities,
        state: "fullView",
      });

      setInitialGraph({
        nodes: nodes,
        links: links,
        topics: topics,
        communities: communities,
        state: "fullView",
      });
    };

    // Execute async initialization
    setLoading(true);
    initializeGraph().finally(() => setLoading(false));
  }, [fetchData]);

  return (
    <GraphContext.Provider
      value={{
        loading,
        graph,
        reduceGraph,
        expandGraph,
        filterGraphByCommunity,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
