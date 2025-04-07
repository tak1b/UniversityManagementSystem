// AssignModule.jsx
// This component allows the user to assign a module to a student by creating a new Grade record.
// It fetches available modules and the student's details, then submits a POST request to assign the selected module.

import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, FormHelperText, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

function AssignModule() {
  // Extract studentId from the URL.
  const { studentId } = useParams();
  // State to store the list of modules.
  const [modules, setModules] = useState([]);
  // State to store the selected module code.
  const [selectedModule, setSelectedModule] = useState("");
  // State to store fetched student details.
  const [student, setStudent] = useState(null);
  // State for any error messages.
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all available modules when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/module/`)
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => console.error("Error fetching modules:", err));
  }, []);

  // Fetch student details to get the full URL and the cohort.
  useEffect(() => {
    fetch(`${API_BASE}/student/${studentId}/`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.error("Error fetching student details:", err));
  }, [studentId]);

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate that a module is selected and student details are loaded.
    if (selectedModule === "") {
      setError("Please select a module.");
      return;
    }
    if (!student) {
      setError("Student details not loaded yet.");
      return;
    }

    // Build full URLs for the student and module.
    const studentUrl = `${API_BASE}/student/${student.student_id}/`;
    const moduleUrl = `${API_BASE}/module/${selectedModule}/`;

    // Build the payload for the Grade record.
    const payload = {
      student: studentUrl,    // Full URL for student.
      module: moduleUrl,      // Full URL for module.
      cohort: student.cohort, // The cohort is expected to already be a full URL.
      ca_mark: 0,             // Default CA mark.
      exam_mark: 0,           // Default Exam mark.
    };

    // Send a POST request to create the Grade record.
    fetch(`${API_BASE}/grade/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to assign module: ${res.status} ${res.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return res.json();
      })
      .then(() => {
        alert("Module assigned successfully.");
        // Navigate back to the student's detail page.
        navigate(`/student/${student.student_id}`);
      })
      .catch((err) => {
        console.error("Error assigning module:", err);
        setError(err.message);
      });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Assign Module to Student {studentId}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <FormControl fullWidth error={Boolean(error)}>
          <InputLabel id="module-select-label">Module</InputLabel>
          <Select
            labelId="module-select-label"
            id="module-select"
            value={selectedModule}
            label="Module"
            onChange={(e) => setSelectedModule(e.target.value)}
            required
          >
            {modules.map((mod) => (
              <MenuItem key={mod.code} value={mod.code}>
                {mod.full_name} ({mod.code})
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
        <Button type="submit" variant="contained">
          Assign Module
        </Button>
      </Box>
      <Button variant="outlined" onClick={() => navigate(`/student/${studentId}`)} sx={{ mt: 2 }}>
        Back to Student
      </Button>
    </Box>
  );
}

export default AssignModule;
