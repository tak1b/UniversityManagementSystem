// SetGrade.jsx
// This component allows an admin or teacher to set a student's grade for a specific module.
// It fetches the student's details (to retrieve necessary fields like the cohort) and then sends a POST request 
// to the API with full URL references for the student and module. This is important if the backend uses a HyperlinkedModelSerializer.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { API_BASE } from '../../api';

// Helper function to extract the final segment from a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SetGrade() {
  // Extract the studentId and moduleCode from the URL parameters.
  const { studentId, moduleCode } = useParams();
  const navigate = useNavigate();

  // State variable to store the student details fetched from the API.
  const [student, setStudent] = useState(null);
  // Local state variables for the CA mark and exam mark inputs.
  const [caMark, setCaMark] = useState("");
  const [examMark, setExamMark] = useState("");
  // State variable to store any error messages during fetching or submission.
  const [error, setError] = useState(null);

  // useEffect hook to fetch student details once the component mounts or when studentId changes.
  useEffect(() => {
    fetch(`${API_BASE}/student/${studentId}/`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => {
        console.error("Error fetching student details:", err);
        setError("Error fetching student details.");
      });
  }, [studentId]);

  // Handler for form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if student details are loaded before proceeding.
    if (!student) {
      setError("Student data not loaded yet.");
      return;
    }
    
    // Extract the student's cohort from the student details.
    // The backend might require a full URL; if not, adjust accordingly.
    const studentCohort = student.cohort ? parseHyperlink(student.cohort) : "";
    
    // Construct full URL references for student and module.
    const studentUrl = `${API_BASE}/student/${student.student_id}/`;
    const moduleUrl = `${API_BASE}/module/${moduleCode}/`;
    
    // Build the payload for the POST request.
    // We send full URL references for the student and module to match backend expectations.
    const payload = {
      student: studentUrl,
      module: moduleUrl,
      ca_mark: parseInt(caMark, 10),
      exam_mark: parseInt(examMark, 10),
      cohort: student.cohort  // Assuming this is already the full URL for the cohort.
    };

    // Send a POST request to the /grade/ endpoint with the constructed payload.
    fetch(`${API_BASE}/grade/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to set grade");
        }
        return response.json();
      })
      .then(() => {
        // On success, navigate back to the student's detail page.
        navigate(`/student/${student.student_id}`);
      })
      .catch(err => {
        console.error("Error setting grade:", err);
        setError("Error setting grade. Please try again.");
      });
  };

  // If student data is not yet loaded, show a loading message.
  if (!student) return <Typography variant="h6" align="center">Loading student details...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Set Grade
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Student: {student.first_name} {student.last_name} (ID: {student.student_id})
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Module: {moduleCode}
          </Typography>
          {error && (
            <Typography variant="body1" color="error" align="center">
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              label="CA Mark"
              type="number"
              value={caMark}
              onChange={(e) => setCaMark(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
              required
            />
            <TextField
              label="Exam Mark"
              type="number"
              value={examMark}
              onChange={(e) => setExamMark(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
              required
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "center", mt: 2 }}>
              Set Grade
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button variant="outlined" onClick={() => navigate(`/student/${studentId}`)}>
              Back to Student
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SetGrade;
