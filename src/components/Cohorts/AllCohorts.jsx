// AllCohorts.jsx
// This component fetches and displays a list of all cohorts from the API.
// It uses Material‑UI components to display the cohorts in a styled table within a Card.
// Each row includes details like the cohort's ID, name, year, and degree (parsed from a full URL),
// along with a button to view more details about that cohort.

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

// Define the base URL for API requests.
const API_BASE = "http://127.0.0.1:8000/api";

// Helper function to extract the last segment of a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function AllCohorts() {
  // State to hold the list of cohorts fetched from the API.
  const [cohorts, setCohorts] = useState([]);

  // useEffect to fetch the cohorts when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/cohort/`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(error => console.error("Error fetching cohorts:", error));
  }, []);

  return (
    // Box component used to center the content and add spacing.
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      {/* Card provides a modern container with a subtle shadow. */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Title for the page */}
          <Typography variant="h4" align="center" gutterBottom>
            All Cohorts
          </Typography>
          {/* Material-UI Table to display cohort data */}
          <Table sx={{ minWidth: 650 }} aria-label="cohorts table">
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Year</strong></TableCell>
                <TableCell><strong>Degree</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cohorts.map(cohort => (
                <TableRow key={cohort.id}>
                  {/* Display the cohort ID */}
                  <TableCell>{cohort.id}</TableCell>
                  {/* If the cohort has a name, display it; otherwise, show a dash */}
                  <TableCell>{cohort.name || "-"}</TableCell>
                  {/* Display the cohort year */}
                  <TableCell>{cohort.year}</TableCell>
                  {/* Display the degree by parsing the full URL to get just the ID */}
                  <TableCell>{cohort.degree ? parseHyperlink(cohort.degree) : ""}</TableCell>
                  <TableCell>
                    {/* Button that navigates to the detailed page for this cohort */}
                    <Button variant="contained" component={Link} to={`/cohort/${cohort.id}`}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Centered button to create a new cohort */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" component={Link} to="/cohort/create">
              Create New Cohort
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AllCohorts;
