// SingleDegree.jsx
// This component displays details for a specific degree, including its full name and shortcode.
// It also fetches and displays a table of cohorts associated with the degree.
// Navigation buttons allow users to go back to the degrees list or view details for a specific cohort.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { API_BASE } from '../../api';

// Helper function to extract the last segment of a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleDegree() {
  // Extract the degree's shortcode from the URL.
  const { shortcode } = useParams();
  // State to hold the degree's details.
  const [degree, setDegree] = useState(null);
  // State to hold the list of cohorts associated with the degree.
  const [cohorts, setCohorts] = useState([]);
  const navigate = useNavigate();

  // Fetch degree details and cohorts when the component mounts or when the shortcode changes.
  useEffect(() => {
    // Fetch all degrees and then find the degree with the matching shortcode.
    fetch(`${API_BASE}/degree/`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(deg => deg.shortcode === shortcode);
        setDegree(found);
      })
      .catch(err => console.error("Error fetching degrees:", err));

    // Fetch cohorts for the given degree using a query parameter.
    fetch(`${API_BASE}/cohort/?degree=${shortcode}`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(err => console.error("Error fetching cohorts:", err));
  }, [shortcode]);

  if (!degree) {
    return <p>Loading degree details...</p>;
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
      {/* Display degree details */}
      <Typography variant="h4" gutterBottom>
        Degree: {degree.full_name} ({degree.shortcode})
      </Typography>
      {/* Back button that uses Material-UI and useNavigate */}
      <Button variant="contained" onClick={() => navigate("/degrees")} sx={{ mb: 2 }}>
        Back to All Degrees
      </Button>
      <Typography variant="h5" gutterBottom>
        Cohorts in this Degree
      </Typography>
      {cohorts.length === 0 ? (
        <Typography variant="body1">No cohorts found for this degree.</Typography>
      ) : (
        <Table sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Cohort ID</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cohorts.map(cohort => (
              <TableRow key={cohort.id}>
                <TableCell>{cohort.id}</TableCell>
                <TableCell>{cohort.year}</TableCell>
                <TableCell>
                  {/* Button to navigate to the SingleCohort page */}
                  <Button variant="outlined" onClick={() => navigate(`/cohort/${cohort.id}`)}>
                    View Cohort
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default SingleDegree;
