// Mock dataset for nodes
const mockNodes = [
  { id: "1", value: 20, name: "Apple", tags: ["red", "green", "yellow"] },
  { id: "2", value: 10, name: "Banana", tags: ["ripe"] },
  { id: "3", value: 30, name: "Orange", tags: ["citrus", "orange color"] },
  { id: "4", value: 5, name: "Grapes", tags: ["small", "seedless"] },
  {
    id: "5",
    value: 15,
    name: "Strawberry",
    tags: ["sweet", "red color", "berry"],
  },
  { id: "6", value: 25, name: "Pineapple", tags: ["yellow", "spiky"] },
  { id: "7", value: 18, name: "Mango", tags: ["sweet", "round"] },
  {
    id: "8",
    value: 12,
    name: "Watermelon",
    tags: ["large", "sweet", "refreshing"],
  },
  { id: "9", value: 28, name: "Lemon", tags: ["sour", "yellow color"] },
  { id: "10", value: 7, name: "Blueberry", tags: ["small", "blue color"] },
  { id: "11", value: 16, name: "Raspberry", tags: ["small", "red color"] },
  { id: "12", value: 30, name: "Kiwi", tags: ["green"] },
  { id: "13", value: 14, name: "Peach", tags: ["fuzzy", "orange color"] },
  { id: "14", value: 9, name: "Plum", tags: ["fuzzy", "sweet"] },
];

// Mock dataset for links
const mockLinks = [
  { source: "1", target: "2", value: 15 },
  { source: "1", target: "14", value: 8 },
  { source: "1", target: "4", value: 5 },
  { source: "2", target: "3", value: 12 },
  { source: "2", target: "13", value: 6 },
  { source: "3", target: "4", value: 10 },
  { source: "4", target: "5", value: 3 },
  { source: "5", target: "11", value: 9 },
  { source: "5", target: "7", value: 7 },
  { source: "6", target: "7", value: 11 },
  { source: "6", target: "8", value: 4 },
  { source: "7", target: "8", value: 13 },
  { source: "8", target: "16", value: 18 },
  { source: "9", target: "10", value: 18 },
  { source: "9", target: "12", value: 11 },
  { source: "10", target: "13", value: 7 },
  { source: "11", target: "14", value: 9 },
  { source: "11", target: "5", value: 12 },
  { source: "12", target: "16", value: 15 },
  { source: "14", target: "7", value: 5 },
  { source: "13", target: "4", value: 18 },
  { source: "15", target: "14", value: 0 },
  { source: "15", target: "11", value: 17 },
  { source: "16", target: "1", value: 12 },
];

function restructureDataset(nodes, links) {
  const newNodes = [...nodes];
  const newLinks = [...links];

  let counter = newNodes.length + 1;
  for (const node of nodes) {
    if (node.tags) {
      for (const tag of node.tags) {
        const tagNode = {
          id: String(counter),
          value: 1,
          name: tag,
          tagType: "highlight",
        };
        newNodes.push(tagNode);

        const tagLink = {
          source: tagNode.id,
          target: node.id,
          value: 1,
        };

        newLinks.push(tagLink);
        counter += 1;
      }
    }
  }

  return { nodes: newNodes, links: newLinks };
}

export const mockGraphs = [
  { nodes: mockNodes, links: mockLinks, type: "mockGraph" },
  { ...restructureDataset(mockNodes, mockLinks), type: "starShaped" },
];
