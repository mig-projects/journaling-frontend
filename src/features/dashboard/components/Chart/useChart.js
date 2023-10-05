import { useCallback, useEffect, useState } from "react";
import { chartColorPalette } from "../../../../themes/theme";
import { useGraph } from "../../../../contexts/graph";

const LIMIT = false;

// This hook is reponsible for generating the option spec required by the chart,
// as well as any interaction handlers needed for the data visualization.
// Expects renderGraph object containing nodes, links, clusters (assignments) and topics (as described in legend).
const useChart = () => {
  const { loading, renderGraph, currentNode, currentCommunities } = useGraph();
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
        borderColor: chartColorPalette.category.secondary,
        borderWidth: 2,
        color: chartColorPalette.category.primary,
      },
    });
    legend.push({
      name: "Unclassified",
      description: "Unclassified nodes.",
      itemStyle: { color: chartColorPalette.finding },
    });
    return legend;
  }, []);

  // Function to create node specification for the chart.
  // This includes categories, as well as findings, with different color and style.
  // Inputs: nodes (array), categories (array), limitResults (boolean - optional, default is false)
  // Output: Array of node specifications
  const createDataSpec = useCallback(
    (renderGraph, categories, limitResults = false) => {
      const { nodes } = renderGraph;
      console.log(currentNode);

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
          n.id === currentNode.id && n.tagType === "category"
            ? {
                // inverting colors for current node
                color: chartColorPalette.category.secondary,
                borderColor: chartColorPalette.category.primary,
                borderWidth: 1,
              }
            : {},
        label: {
          show:
            Object.keys(currentNode).length + currentCommunities.length > 0 ||
            !isUserTag(n),
        },
      }));
      if (limitResults) {
        newNodes = newNodes.slice(0, 10);
      }
      console.log(newNodes);

      // console.log("New nodes:", newNodes);
      return newNodes;
    },
    [currentNode, currentCommunities]
  );

  // Function to create link specification for the chart.
  // This includes visible links (co-occurrence) as well as non-visible ones (assignment to same cluster) for spatial proximity of cluster.
  // Inputs: links (array), nodes (array), limitResults (boolean - optional, default is false)
  // Output: Array of link specifications
  const createLinkSpec = useCallback((links, nodes, limitResults = false) => {
    let newLinks = links.map((l) => ({
      ...l,
      value: l.value,
      lineStyle: { color: "#CECECE", opacity: 0.3, curveness: 0.1 },
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
  // Inputs: renderGraph (object), limitResults (boolean)
  // Output: Option specification object
  const createOptionSpec = useCallback(
    (renderGraph, limitResults) => {
      let option = {};

      if (Object.keys(renderGraph).length > 0) {
        // Create array of categories that will be used as legend.
        const categories = createLegendSpec(renderGraph.topics);
        // console.log("Categories:", categories);

        // Create the nodes to be plotted.
        const plottedNodes = createDataSpec(
          renderGraph,
          categories,
          limitResults
        );
        // console.log("Nodes:", plottedNodes);

        // Create the links connecting nodes to one another.
        const plottedLinks = createLinkSpec(
          renderGraph.links,
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
                fontFamily: "Inter",
                fontWeight: 500,
                fill: "#333",
                fontSize: 14,
              },
            },
          ],

          legend: [
            {
              data: categories,
              orient: "horizontal",
              backgroundColor: "#fff",
              textStyle: {
                fontFamily: "Inter",
                fontWeight: 400,
                color: "#333", // Text color for the legend
                fontSize: 14,
              },

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
    if (!loading && Object.keys(renderGraph).length > 0) {
      const newOption = createOptionSpec(renderGraph, LIMIT);
      setOption(newOption);
    }
  }, [loading, renderGraph, createOptionSpec]);

  return { option };
};

export default useChart;
