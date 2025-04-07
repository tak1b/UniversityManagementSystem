// AllDegrees.jsx
// This component fetches and displays all degrees in a styled table format,
// similar to how AllCohorts.jsx is styled. Each degree is shown with its full name,
// shortcode, and an action button that navigates to the detailed view for that degree.

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

function AllDegrees() {
  // Local state to hold the list of degrees.
  const [degrees, setDegrees] = useState([]);

  // useEffect to fetch degrees from the API when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/degree/`)
      .then(response => response.json())
      .then(data => setDegrees(data))
      .catch(error => console.error("Error fetching degrees:", error));
  }, []);

  return (
    // Box container centers the content and adds margins/padding.
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      {/* Card provides a modern elevated container */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Heading for the page */}
          <Typography variant="h4" align="center" gutterBottom>
            All Degrees
          </Typography>
          {/* Table to display degrees */}
          <Table sx={{ minWidth: 650 }} aria-label="degrees table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Shortcode</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {degrees.map(degree => (
                <TableRow key={degree.shortcode}>
                  <TableCell>{degree.full_name}</TableCell>
                  <TableCell>{degree.shortcode}</TableCell>
                  <TableCell>
                    {/* Button to navigate to the detailed view of the degree */}
                    <Button variant="contained" component={Link} to={`/degree/${degree.shortcode}`}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Centered button to navigate to the Create Degree form */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" component={Link} to="/degree/create">
              Create New Degree
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AllDegrees;
