import { useCallback, useEffect, useState } from "react";

const LIMIT = false;

// This hook is reponsible for generating the option spec required by the chart,
// as well as any interaction handlers needed for the data visualization.
// Expects graph object containing nodes, links, clusters (assignments) and topics (as described in legend).
const useChart = ({ loading, graph }) => {
  const [option, setOption] = useState({});

  // Function to create legend specification for the chart, including the related description to display in tooltip.
  // Inputs: topics (array), numTopics (number - optional, default is 7)
  // Output: Array of legend data specifications
  const createLegendSpec = useCallback((topics) => {
    const legend = topics.map((cur) => ({
      name: cur.ai_topic,
      description: [`<b>${cur.ai_topic}</b>`, cur.ai_description].join(": "),
      clusterId: cur.cluster,
      itemStyle: { color: cur?.color },
    }));

    legend.push({
      name: "Main Category",
      description: "This represents the primary categories assigned by users.",
      itemStyle: {
        borderColor: "#7438E2",
        borderWidth: 2,
        color: "#c3c3c3",
      },
    });
    legend.push({
      name: "Unclassified",
      description: "Unclassified nodes.",
      itemStyle: { color: "#a280df80" },
    });
    return legend;
  }, []);

  // Function to create node specification for the chart.
  // This includes categories, as well as highlights, with different color and style.
  // Inputs: nodes (array), categories (array), limitResults (boolean - optional, default is false)
  // Output: Array of node specifications
  const createDataSpec = useCallback(
    (graph, categories, limitResults = false) => {
      const { nodes } = graph;

      const isUserTag = (n) => {
        return n.tagType.endsWith("highlight");
      };

      // Function to retrieve category for a given name
      // Inputs: name (string), categories (array)
      // Output: Category name (string)
      const retrieveCategory = (clusterId, categories) => {
        return (
          categories.find((cat) => cat.clusterId === clusterId)?.name ||
          "Unclassified"
        );
      };

      let newNodes = nodes.map((n) => ({
        ...n,
        symbolSize: n.size,
        category: isUserTag(n)
          ? retrieveCategory(n.cluster, categories)
          : "Main Category",
        itemStyle:
          n.tagType === "center-category"
            ? {
                borderColor: "#c3c3c3",
                borderWidth: 1,
                color: "#7438E2",
              }
            : {},
        label: { show: graph.state === "nodeView" || !isUserTag(n) },
      }));
      if (limitResults) {
        newNodes = newNodes.slice(0, 10);
      }

      // console.log("New nodes:", newNodes);
      return newNodes;
    },
    []
  );

  // Function to create link specification for the chart.
  // This includes visible links (co-occurrence) as well as non-visible ones (assignment to same cluster) for spatial proximity of cluster.
  // Inputs: links (array), nodes (array), limitResults (boolean - optional, default is false)
  // Output: Array of link specifications
  const createLinkSpec = useCallback((links, nodes, limitResults = false) => {
    let newLinks = links.map((l) => ({
      ...l,
      value: l.value,
      lineStyle: { color: "#8CD1CA", opacity: 0.2, curveness: 0.1 },
      label: { show: false },
    }));

    if (limitResults) {
      newLinks = newLinks.filter(
        (link) =>
          nodes.map((node) => node.id).includes(link.source) &&
          nodes.map((node) => node.id).includes(link.target)
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
  }, []);

  // Function to create the overall option specification for the chart, as will be consumed by e-charts API.
  // Inputs: graph (object), limitResults (boolean)
  // Output: Option specification object
  const createOptionSpec = useCallback(
    (graph, limitResults) => {
      let option = {};

      if (Object.keys(graph).length > 0) {
        // Create array of categories that will be used as legend.
        const categories = createLegendSpec(graph.topics);
        // console.log("Categories:", categories);

        // Create the nodes to be plotted.
        const plottedNodes = createDataSpec(graph, categories, limitResults);
        // console.log("Nodes:", plottedNodes);

        // Create the links connecting nodes to one another.
        const plottedLinks = createLinkSpec(
          graph.links,
          plottedNodes,
          limitResults
        );
        // console.log("Links:", plottedLinks);

        option = {
          // title: {
          //   text: "",
          // },
          backgroundColor: "#fff",
          tooltip: { show: false },
          graphic: [
            {
              type: "text",
              left: 10,
              bottom: "17%",
              style: {
                text: "AI TOPICS",
                textAlign: "center",
                fontStyle: "bold",

                fill: "#333",
                fontSize: 16,
              },
            },
            {
              type: "group",
              right: 20,
              top: 20,
              children: [
                {
                  type: "rect",
                  shape: {
                    width: 182,
                    height: 50,
                    r: 8,
                  },
                  style: {
                    fill: "#fff",
                    stroke: "#d9d9d9",
                    lineWidth: 2,
                  },
                },
                {
                  type: "text",
                  left: 32.5,
                  top: 17.5,
                  style: {
                    text: "What's this map?",
                    textAlign: "center",
                    textBaseline: "middle",
                    fontSize: 16,
                    fontWeight: 500,
                  },
                  tooltip: {
                    show: true,
                    renderMode: "html",
                    formatter: (params) => {
                      return "Explaining what this map is.";
                    },
                  },
                },
              ],
            },
            {
              type: "group",
              left: 20,
              top: 20,
              children: [
                {
                  type: "rect",
                  name: "fullView",
                  shape: {
                    width: 182,
                    height: 50,
                    r: 8,
                  },
                  style: {
                    fill: "rgba(217, 217, 217, 0.6)",
                    stroke: "#d9d9d9",
                    lineWidth: 2,
                  },
                },
                {
                  type: "text",
                  name: "fullView",
                  left: 32.5,
                  top: 17.5,
                  style: {
                    text: "Back to full view",
                    textAlign: "center",
                    textBaseline: "middle",
                    fontSize: 16,
                    fontWeight: 500,
                  },
                },
              ],
            },
          ],

          legend: [
            {
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
              bottom: "12%",
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
              legendHoverLink: false,
              layout: "force",
              nodes: plottedNodes,
              links: plottedLinks,
              categories: categories,
              roam: true,
              label: {
                show: true,
                position: "right",
              },
              labelLayout: {
                hideOverlap: true,
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
    },
    [createDataSpec, createLegendSpec, createLinkSpec]
  );

  useEffect(() => {
    if (!loading && Object.keys(graph).length > 0) {
      const newOption = createOptionSpec(graph, LIMIT);
      setOption(newOption);
    }
  }, [loading, graph, createOptionSpec]);

  return { option };
};

export default useChart;
