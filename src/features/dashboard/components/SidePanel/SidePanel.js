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
  CircularProgress,
} from "@mui/material";

const SidePanel = ({ graph, loading }) => {
  return (
    <div className="sidePanelContainer">
      {loading ? (
        <CircularProgress />
      ) : graph.nodes ? (
        <>
          <Box className="titleContainer">
            <Typography className="sidePanelTitle">
              Mapping Employment Discrimination with Intersectional Migrants in
              the Tech Sector
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
        </>
      ) : (
        <div>
          The data couldn't be loaded. Please try refreshing the page or contact
          your administrator.
        </div>
      )}
    </div>
  );
};

export default SidePanel;
