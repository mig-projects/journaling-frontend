import {
  Table,
  Typography,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback } from "react";

const NodeView = ({ nodes, topics }) => {
  const centerNode = nodes.find((n) => n.tagType.startsWith("center")); // Retrieve central node for nodeView.
  console.log(topics);
  const tagType = centerNode.tagType.split("-")[1];

  const retrieveColor = useCallback(
    (clusterId) => {
      console.log(clusterId);
      return (
        topics.find((topic) => topic.cluster === clusterId)?.color ||
        "#a280df80" // topic color, or unclassified
      );
    },
    [topics]
  );

  return (
    <div>
      <Box className="titleContainer">
        <Typography className="sidePanelTitle">
          Relationships to{" "}
          <span className="boldTitle">{centerNode?.name || "Unknown"}</span>
        </Typography>
        <Typography>
          {tagType === "category" &&
            "One to two sentences manually written for this category."}
          {tagType === "highlight" &&
            `${centerNode.count} participants mentioned this finding.`}
        </Typography>
      </Box>
      <Box>
        <TableContainer>
          {tagType === "category" && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>FINDINGS</TableCell>
                  <TableCell>AI GROUPING</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes
                  .filter((node) => node.tagType === "highlight")
                  .map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>{node.name}</TableCell>
                      <TableCell className="AIGrouping">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            fill={retrieveColor(node.cluster)}
                          />
                        </svg>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          {tagType === "highlight" && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>CATEGORIES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes
                  .filter((node) => node.tagType === "category")
                  .map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>{node.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default NodeView;
