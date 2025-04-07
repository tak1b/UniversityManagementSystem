// SingleCohort.jsx
// This component displays details for a specific cohort along with a list of students in that cohort.
// It fetches cohort data and student data concurrently from the API, then renders the information in a styled layout.

import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

// Helper function: Extracts the last segment of a URL
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleCohort() {
  // Extract 'cohortId' from URL parameters.
  const { cohortId } = useParams();
  const navigate = useNavigate();
  
  // Local state for cohort details.
  const [cohort, setCohort] = useState(null);
  // Local state for storing the list of students in the cohort.
  const [students, setStudents] = useState([]);
  // State for handling loading and potential errors.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook: fetch cohort details and its students when the component mounts or when 'cohortId' changes.
  useEffect(() => {
    // Fetch both the list of cohorts and the students for the given cohort concurrently.
    Promise.all([
      fetch(`${API_BASE}/cohort/`).then(res => res.json()),
      fetch(`${API_BASE}/student/?cohort=${cohortId}`).then(res => res.json())
    ])
      .then(([cohortsData, studentsData]) => {
        // Find the specific cohort using the 'cohortId' parameter.
        const foundCohort = cohortsData.find(c => c.id === cohortId);
        setCohort(foundCohort);
        // Save the students data.
        setStudents(studentsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading cohort details:", err);
        setError("Error loading cohort details.");
        setLoading(false);
      });
  }, [cohortId]);

  // If still loading, display a loading message.
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Loading cohort details...</Typography>
      </Box>
    );
  }
  // If an error occurred, display the error.
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }
  // If no cohort data is found, notify the user.
  if (!cohort) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Cohort not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      {/* Card container for a polished look */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Cohort Details */}
          <Typography variant="h4" align="center" gutterBottom>
            Cohort: {cohort.id}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Year: {cohort.year}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Degree: {cohort.degree ? parseHyperlink(cohort.degree) : "N/A"}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            {/* Button to navigate back to the list of all cohorts */}
            <Button variant="contained" onClick={() => navigate("/cohorts")} sx={{ mr: 1 }}>
              Back to All Cohorts
            </Button>
            {/* Button to view modules delivered to this cohort */}
            <Button variant="outlined" component={Link} to={`/modulesDelivered/${cohort.id}`}>
              View Modules Delivered
            </Button>
          </Box>

          {/* Students Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Students in this Cohort
            </Typography>
            {students.length === 0 ? (
              <Typography variant="body1">No students found for this cohort.</Typography>
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="students table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.student_id}>
                      <TableCell>{student.student_id}</TableCell>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                      <TableCell>
                        <Button variant="contained" component={Link} to={`/student/${student.student_id}`}>
                          View Student
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SingleCohort;
