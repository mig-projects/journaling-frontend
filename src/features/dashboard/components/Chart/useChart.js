import { useCallback, useEffect, useState, useMemo } from "react";

// const COLOR_PALETTE = [
//   "#FFADAD",
//   "#CAFFBF",
//   "#FFD6A5",
//   "#A0C4FF",
//   "#FFC6FF",
//   "#FDFFB6",
//   "#9BF6FF",
//   "#a280df",
// ];

// This hook is reponsible for generating the option spec required by the chart,
// as well as any interaction handlers needed for the data visualization.
// Expects graph object containing nodes, links, clusters (assignments) and topics (as described in legend).
const useChart = ({ loading, graph, LIMIT }) => {
  const [option, setOption] = useState({});

  useEffect(() => {
    if (!loading && Object.keys(graph).length > 0) {
      const newOption = createOptionSpec(graph, LIMIT);
      setOption(newOption);
    }
  }, [loading, graph]);

  const createListingTooltip = (nodes) => {
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
  };

  // Function to create legend specification for the chart, including the related description to display in tooltip.
  // Inputs: topics (array), numTopics (number - optional, default is 7)
  // Output: Array of legend data specifications
  const createLegendSpec = (topics, numTopics = 7) => {
    const defaultObject = { name: "", description: "", cluster_id: 0 };
    const maxClusterId = Math.max(...topics.map((topic) => topic.cluster_id));

    const legend = Array(numTopics).fill(defaultObject);

    topics.forEach((cur) => {
      // Projecting the latest clusters in range [0, 6]
      const legendIndex = cur.cluster_id + numTopics - (maxClusterId + 1);

      if (legend[legendIndex] === defaultObject) {
        legend[legendIndex] = {
          name: cur.topic,
          description: [`<b>${cur.topic}</b>`, cur.description].join(": "),
          cluster_id: cur.cluster_id,
        };
      } else if (legendIndex >= 0) {
        legend[legendIndex].name += `, ${cur.topic}`;
        legend[
          legendIndex
        ].description += `<br/><b>${cur.topic}</b>: ${cur.description}`;
      }
    });

    legend.push({
      name: "Main Category",
      description: "This represents the primary categories assigned by users.",
    });
    legend.push({ name: "Unclassified", description: "Unclassified nodes." });
    return legend;
  };

  // Function to get cluster ID for a given name
  // Input: name (string)
  // Output: Cluster ID (number)
  const getClusterId = (name) => {
    const matchingClusters = graph.clusters.filter((n) => n.tag_name === name);

    if (matchingClusters.length > 0) {
      return matchingClusters.reduce(
        (maxId, cluster) => Math.max(maxId, cluster.cluster_id),
        -1
      );
    } else {
      return -1;
    }
  };

  // Function to retrieve category for a given name
  // Inputs: name (string), categories (array)
  // Output: Category name (string)
  const retrieveCategory = (name, categories) => {
    const clusterId = getClusterId(name);
    return (
      categories.find((cat) => cat.cluster_id === clusterId)?.name ||
      "Unclassified"
    );
  };

  // Function to create node specification for the chart.
  // This includes categories, as well as highlights, with different color and style.
  // Inputs: nodes (array), categories (array), limitResults (boolean - optional, default is false)
  // Output: Array of node specifications
  const createDataSpec = (nodes, categories, limitResults = false) => {
    const isUserTag = (n) => {
      return n.tagType === "highlight";
    };

    let newNodes = nodes.map((n) => ({
      ...n,
      symbolSize: isUserTag(n) ? 15 : n.size,
      category: isUserTag(n)
        ? retrieveCategory(n.name, categories)
        : "Main Category",
      itemStyle: isUserTag(n)
        ? {
            // color: COLOR_PALETTE[getClusterId(n.name)],
            borderWidth: 1,
            borderColor: "#f0eded",
          }
        : {
            // color: "#7438e2",
            borderWidth: 2,
            borderColor: "#f0eded",
          },
      emphasis: {
        focus: "adjacency",
        scale: true,
        label: { show: true },
      },
      label: { show: !isUserTag(n) },
    }));
    if (limitResults) {
      newNodes = newNodes.filter((n) => parseInt(n.id) < 10);
    }

    // console.log("New nodes:", newNodes);
    return newNodes;
  };

  // Function to create link specification for the chart.
  // This includes visible links (co-occurrence) as well as non-visible ones (assignment to same cluster) for spatial proximity of cluster.
  // Inputs: links (array), nodes (array), limitResults (boolean - optional, default is false)
  // Output: Array of link specifications
  const createLinkSpec = (links, nodes, limitResults = false) => {
    let newLinks = links.map((l) => ({
      ...l,
      value: l.value,
      lineStyle: { color: "#8CD1CA", curveness: 0.1 },
      label: { show: false },
    }));

    if (limitResults) {
      newLinks = newLinks.filter(
        (link) => parseInt(link.source) < 10 && parseInt(link.target) < 10
      );
    }

    if (nodes) {
      // Loop through each pair of nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          // If nodes belong to the same cluster, add a link between them
          if (
            nodes[i].category === nodes[j].category &&
            nodes[i].category !== -1
          ) {
            newLinks.push({
              source: nodes[i].id,
              target: nodes[j].id,
              value: 1,
              lineStyle: { opacity: 0 },
              label: {
                show: false, // Hides the label
              },
              emphasis: {
                label: {
                  show: false, // Hides the label on hover
                },
              },
            });
          }
        }
      }
    }

    return newLinks;
  };

  // Function to create the overall option specification for the chart, as will be consumed by e-charts API.
  // Inputs: graph (object), limitResults (boolean)
  // Output: Option specification object
  const createOptionSpec = (graph, limitResults) => {
    let option = {};

    if (Object.keys(graph).length > 0) {
      // Create array of categories that will be used as legend.
      const categories = createLegendSpec(graph.topics);
      // console.log(categories);

      // Create the nodes to be plotted.
      const plottedNodes = createDataSpec(
        graph.nodes,
        categories,
        limitResults
      );

      // Create the links connecting nodes to one another.
      const plottedLinks = createLinkSpec(
        graph.links,
        plottedNodes,
        limitResults
      );
      const uniqueClusters = Array.from(
        new Set(plottedNodes.map((node) => "" + node.category))
      ).sort((a, b) => a - b);

      option = {
        // title: {
        //   text: "",
        // },
        backgroundColor: "#f7f7f7",
        tooltip: {},
        graphic: [
          {
            type: "text",
            left: 10,
            bottom: 65,
            style: {
              text: "What the AI says:",
              textAlign: "center",
              fontStyle: "bold italic",
              fill: "#333",
              fontSize: 14,
            },
          },
        ],
        legend: [
          {
            // color: COLOR_PALETTE,
            data: categories,
            orient: "horizontal",

            tooltip: {
              show: true,
              renderMode: "html",
              extraCssText: "max-width: 50%; white-space: normal;",
              formatter: (params) => {
                return categories.find((cat) => cat.name === params.name)
                  .description;
              },
              textStyle: {
                width: 50,
              },
            },
            bottom: 10,
            left: "center",
            textStyle: {
              fontStyle: "italic",
              color: "#333", // Text color for the legend
            },
          },
        ],
        series: [
          {
            type: "graph",
            layout: "force",
            nodes: plottedNodes,
            links: plottedLinks,
            categories: categories,
            roam: true,
            label: {
              show: true,
              position: "right",
            },
            force: {
              initLayout: null,
              repulsion: 500,
              edgeLength: [50, 100],
              friction: 0.1,
              gravity: 0.2,
            },
            selectedMode: "single",
          },
        ],
      };
    }
    // console.log("New option: ", option);
    return option;
  };

  // Function to handle click events on the chart
  // Input: params (object)
  // Output: None
  const clickHandler = (params) => {
    // console.log(params);
    // if (Object.keys(option).length > 0 && params.dataType === "node") {
    //   const clickedNodeId = params.data.id;
    //   const neighborNodeIds = option.series[0].links
    //     .filter(
    //       (link) =>
    //         link.source === clickedNodeId || link.target === clickedNodeId
    //     )
    //     .map((link) =>
    //       link.source === clickedNodeId ? link.target : link.source
    //     );
    //   console.log("Neighbor node ids:", neighborNodeIds);
    //   const newNodes = option.series[0].nodes.map((node) => ({
    //     ...node,
    //     label: { show: neighborNodeIds.includes(node.id) },
    //   }));
    //   setOption((prevState) => {
    //     const newOption = { ...prevState };
    //     newOption.series[0].nodes = newNodes;
    //     newOption.series[0].animation = false;
    //     return newOption;
    //   });
    // }
  };

  return { option, clickHandler };
};

export default useChart;
