import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

const API_BASE = "http://127.0.0.1:8000/api";

// Helper to extract the last segment of a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleModule() {
  const { moduleCode } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingModule, setLoadingModule] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState("");

  // Fetch module details
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

  // Fetch grade records for the module, then fetch details for each unique student.
  useEffect(() => {
    fetch(`${API_BASE}/grade/?module=${moduleCode}`)
      .then((res) => res.json())
      .then((gradesData) => {
        // Extract unique student IDs from grade records.
        const uniqueStudentIds = Array.from(new Set(gradesData.map((grade) => parseHyperlink(grade.student))));
        // Fetch each student's details concurrently.
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
          // Filter out any null responses.
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

  if (loadingModule) return <p>Loading module details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!moduleData) return <p>Module not found.</p>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Module: {moduleData.full_name} ({moduleData.code})
      </Typography>
      <Typography variant="body1" gutterBottom>
        CA Split: {moduleData.ca_split}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Delivered To: {moduleData.delivered_to.map((url) => parseHyperlink(url)).join(", ")}
      </Typography>
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
