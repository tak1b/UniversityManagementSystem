// SingleModule.jsx
// This component displays detailed information about a specific module,
// including its full name, code, CA split, and which cohorts it is delivered to.
// Additionally, it fetches and displays a table of students enrolled in this module
// by fetching grade records and then retrieving full student details.

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { API_BASE } from "../../api";

// Helper function to extract the final segment from a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleModule() {
  // Extract moduleCode from URL parameters.
  const { moduleCode } = useParams();
  // Local state to hold the module's details.
  const [moduleData, setModuleData] = useState(null);
  // Local state to hold the list of students in the module.
  const [students, setStudents] = useState([]);
  // Loading states for module details and student details.
  const [loadingModule, setLoadingModule] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  // Error state to capture any errors.
  const [error, setError] = useState("");

  // Fetch module details when the component mounts or when moduleCode changes.
  useEffect(() => {
    fetch(`${API_BASE}/module/${moduleCode}/`)
      .then((res) => res.json())
      .then((data) => {
        setModuleData(data);
        setLoadingModule(false);
      })
      .catch((err) => {
        console.error("Error fetching module details:", err);
        setError("Error fetching module details.");
        setLoadingModule(false);
      });
  }, [moduleCode]);

  // Fetch grade records for this module, extract unique student IDs, and then fetch details for each student.
  useEffect(() => {
    fetch(`${API_BASE}/grade/?module=${moduleCode}`)
      .then((res) => res.json())
      .then((gradesData) => {
        // Create a set of unique student IDs by parsing the 'student' field from each grade.
        const uniqueStudentIds = Array.from(new Set(gradesData.map((grade) => parseHyperlink(grade.student))));
        // For each student ID, fetch the student's details concurrently.
        Promise.all(
          uniqueStudentIds.map((id) =>
            fetch(`${API_BASE}/student/${id}/`)
              .then((res) => res.json())
              .catch((err) => {
                console.error(`Error fetching student ${id}:`, err);
                return null;
              })
          )
        ).then((studentDetails) => {
          // Filter out any null responses (if a fetch failed).
          setStudents(studentDetails.filter((s) => s !== null));
          setLoadingStudents(false);
        });
      })
      .catch((err) => {
        console.error("Error fetching grade records:", err);
        setError("Error fetching students for this module.");
        setLoadingStudents(false);
      });
  }, [moduleCode]);

  // If module details are still loading, show a loading message.
  if (loadingModule) return <p>Loading module details...</p>;
  // If an error occurred, display the error message.
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  // If no module data is found, display a "not found" message.
  if (!moduleData) return <p>Module not found.</p>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      {/* Display module details */}
      <Typography variant="h4" gutterBottom>
        Module: {moduleData.full_name} ({moduleData.code})
      </Typography>
      <Typography variant="body1" gutterBottom>
        CA Split: {moduleData.ca_split}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Delivered To: {moduleData.delivered_to.map((url) => parseHyperlink(url)).join(", ")}
      </Typography>
      {/* Button to navigate back to the list of modules */}
      <Button variant="outlined" component={Link} to="/modules" sx={{ mt: 2 }}>
        Back to All Modules
      </Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Students in this Module
        </Typography>
        {loadingStudents ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found for this module.</p>
        ) : (
          <Table sx={{ minWidth: 300 }} aria-label="students table">
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {/* Button linking to the SingleStudent page for this student */}
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
    </Box>
  );
}

export default SingleModule;
