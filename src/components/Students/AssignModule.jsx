import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

function AssignModule() {
  const { studentId } = useParams();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all modules (each with a code).
  useEffect(() => {
    fetch(`${API_BASE}/module/`)
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => console.error("Error fetching modules:", err));
  }, []);

  // Fetch student details (to get the full student URL).
  useEffect(() => {
    // We'll build the student's full URL manually, or fetch the single student endpoint to see how it's represented.
    // If your Grade serializer expects "student" to be a hyperlink, you must pass something like:
    // "http://127.0.0.1:8000/api/student/12345678/"
    // We'll build that ourselves once we confirm the student's ID actually exists.
    fetch(`${API_BASE}/student/${studentId}/`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.error("Error fetching student details:", err));
  }, [studentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (selectedModule === "") {
      setError("Please select a module.");
      return;
    }
    if (!student) {
      setError("Student details not loaded yet.");
      return;
    }

    // Build the full hyperlinks for the student and module:
    const studentUrl = `${API_BASE}/student/${student.student_id}/`; 
    const moduleUrl = `${API_BASE}/module/${selectedModule}/`; // e.g. "http://127.0.0.1:8000/api/module/CA298/"

    // The Grade endpoint expects hyperlinked references if your serializer is HyperlinkedModelSerializer.
    const payload = {
      student: studentUrl,
      module: moduleUrl,
      cohort: student.cohort, // assuming 'cohort' is already a full URL in student.cohort
      ca_mark: 0,
      exam_mark: 0,
    };

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
        navigate(`/student/${student.student_id}`);
      })
      .catch((err) => {
        console.error("Error assigning module:", err);
        setError(err.message);
      });
  };

  return (
    <div>
      <h2>Assign Module to Student {studentId}</h2>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
    </div>
  );
}

export default AssignModule;
