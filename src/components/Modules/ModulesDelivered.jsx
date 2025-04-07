// ModulesDelivered.jsx
// This component displays a list of modules delivered to a specific cohort.
// It fetches modules from the API using a query parameter for the cohort ID.
// The data is rendered inside a Material-UI Card and Table for a clean, modern look.

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { API_BASE } from "../../api";

// Helper function to extract the final segment from a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function ModulesDelivered() {
  // Extract the cohortId parameter from the URL.
  const { cohortId } = useParams();
  const navigate = useNavigate();
  
  // State to store the list of modules delivered to this cohort.
  const [modules, setModules] = useState([]);
  // State to track loading status.
  const [loading, setLoading] = useState(true);
  // State for any error messages.
  const [error, setError] = useState(null);

  // useEffect hook: Fetch modules delivered to the specified cohort when the component mounts.
  useEffect(() => {
    // The API endpoint is queried with the cohortId as a parameter.
    fetch(`${API_BASE}/module/?delivered_to=${cohortId}`)
      .then(res => res.json())
      .then(data => {
        setModules(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching modules delivered to this cohort:", err);
        setError("Error fetching modules delivered to this cohort.");
        setLoading(false);
      });
  }, [cohortId]);

  // If the data is still loading, display a loading message.
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Loading modules...</Typography>
      </Box>
    );
  }

  // If an error occurred, display the error message.
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      {/* Card container for a polished look */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Page heading */}
          <Typography variant="h4" align="center" gutterBottom>
            Modules Delivered to Cohort {cohortId}
          </Typography>
          {modules.length === 0 ? (
            // If no modules are found, display a friendly message.
            <Typography variant="body1" align="center">
              No modules found for this cohort.
            </Typography>
          ) : (
            // If modules are found, display them in a table.
            <Table sx={{ minWidth: 650 }} aria-label="modules delivered table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Full Name</strong></TableCell>
                  <TableCell><strong>CA Split</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map(mod => (
                  <TableRow key={mod.code}>
                    <TableCell>{mod.code}</TableCell>
                    <TableCell>{mod.full_name}</TableCell>
                    <TableCell>{mod.ca_split}</TableCell>
                    <TableCell>
                      {/* Button to navigate to the module detail page */}
                      <Button variant="contained" component={Link} to={`/module/${mod.code}`}>
                        View Module
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* Button to navigate back; using navigate(-1) takes you to the previous page */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ModulesDelivered;
