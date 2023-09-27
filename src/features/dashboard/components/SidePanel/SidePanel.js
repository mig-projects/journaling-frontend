import React from "react";
import "./SidePanel.css";
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

const SidePanel = ({ graph }) => {
  console.log(graph);
  return (
    <div className="sidePanelContainer">
      <Box className="titleContainer">
        <Typography className="sidePanelTitle">
          Mapping Employment Discrimination with Intersectional Migrants in the
          Tech Sector
        </Typography>
      </Box>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CATEGORIES</TableCell>
                <TableCell className="findingColumn">BASED ON</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {graph.nodes
                .filter((node) => node.tagType === "category")
                .map((node) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.name}</TableCell>
                    <TableCell className="findingColumn">
                      {node.count} findings
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default SidePanel;
