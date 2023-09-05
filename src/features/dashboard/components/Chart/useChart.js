import React, { useEffect, useState } from "react";

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

  const createDataSpec = (nodes, limitResults = false) => {
    const isUserTag = (n) => {
      return n.tagType === "highlight";
    };

    let newNodes = nodes.map((n) => ({
      ...n,
      symbolSize: isUserTag(n) ? 15 : n.size,
      itemStyle: isUserTag(n)
        ? { color: "#a280df", borderWidth: 1, borderColor: "#f0eded" }
        : {
            color: "#7438e2",
            borderWidth: 2,
            borderColor: "#f0eded",
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
              scale: true,
              label: { show: true },
            },
          },
      label: { show: !isUserTag(n) },
    }));
    if (limitResults) {
      newNodes = newNodes.filter((n) => parseInt(n.id) < 10);
    }

    // console.log("New nodes:", newNodes);
    return newNodes;
  };

  const createLinkSpec = (links, limitResults = false) => {
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

    // console.log("New links: ", newLinks);

    return newLinks;
  };

  const createOptionSpec = (graph, limitResults) => {
    let option = {};
    if (Object.keys(graph).length > 0) {
      option = {
        // title: {
        //   text: "",
        // },
        backgroundColor: "#f7f7f7",
        tooltip: {},
        series: [
          {
            type: "graph",
            layout: "force",
            nodes: createDataSpec(graph.nodes, limitResults),
            links: createLinkSpec(graph.links, limitResults),
            roam: true,
            label: {
              show: true,
              position: "right",
            },
            force: {
              initLayout: null,
              repulsion: 300,
              edgeLength: [50, 100],
              friction: 0.5,
              gravity: 0.1,
            },
            selectedMode: "single",
          },
        ],
      };
    }
    console.log("New option: ", option);
    return option;
  };

  return { option };
};

export default useChart;
