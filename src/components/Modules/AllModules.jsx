// AllModules.jsx
// This component fetches all modules from the API and displays them in a Material‑UI styled table.
// The module details are wrapped in a Card for a modern look, and each module includes a "View Details" button.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@mui/material';

const API_BASE = "http://127.0.0.1:8000/api";

// Helper: Extract the last segment from a URL.
// This is used to display concise IDs (e.g., cohort IDs) from full hyperlinks.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function AllModules() {
  // State to hold the fetched modules.
  const [modules, setModules] = useState([]);

  // Fetch modules from the API when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/module/`)
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(err => console.error("Error fetching modules:", err));
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      {/* Card container for a modern, elevated look */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Heading for the Modules page */}
          <Typography variant="h4" gutterBottom align="center">
            All Modules
          </Typography>
          {/* Material-UI Table for displaying module data */}
          <Table sx={{ minWidth: 650 }} aria-label="modules table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Delivered To</strong></TableCell>
                <TableCell><strong>CA Split</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modules.map(mod => (
                <TableRow key={mod.code}>
                  <TableCell>{mod.code}</TableCell>
                  <TableCell>{mod.full_name}</TableCell>
                  <TableCell>
                    {mod.delivered_to.map(url => parseHyperlink(url)).join(", ")}
                  </TableCell>
                  <TableCell>{mod.ca_split}</TableCell>
                  <TableCell>
                    {/* Button that navigates to the single module details page */}
                    <Button variant="contained" component={Link} to={`/module/${mod.code}`}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Button to create a new module */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" component={Link} to="/module/create">
              Create New Module
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AllModules;
