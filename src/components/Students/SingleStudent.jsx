// SingleStudent.jsx
// This component displays detailed information about a single student,
// including personal details, a table of registered modules, and a table of grades.
// It fetches both the student details and the grade records from the API.
// The "Modules Registered" section is now rendered as a table for a more structured layout.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { API_BASE } from '../../api';

// Helper: Extract the last segment from a URL (i.e. the ID part)
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleStudent() {
  // Extract the studentId from the URL parameters.
  const { studentId } = useParams();
  
  // State to store the student details.
  const [student, setStudent] = useState(null);
  // State to store grade records.
  const [grades, setGrades] = useState([]);
  // Loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch student details and grades concurrently.
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/student/${studentId}/`).then(res => {
        if (!res.ok) throw new Error("Student not found.");
        return res.json();
      }),
      fetch(`${API_BASE}/grade/?student=${studentId}`).then(res => {
        if (!res.ok) throw new Error("Error fetching grades.");
        return res.json();
      })
    ])
      .then(([studentData, gradesData]) => {
        setStudent(studentData);
        // Ensure that gradesData is an array.
        setGrades(Array.isArray(gradesData) ? gradesData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  // If still loading data, display a loading message.
  if (loading) return <p>Loading student details...</p>;
  // If an error occurred, display the error message.
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  // If no student data is available, indicate that the student was not found.
  if (!student) return <p>Student not found.</p>;

  // Extract unique module codes from the grade records.
  const uniqueModules = Array.from(new Set(grades.map(grade => parseHyperlink(grade.module))));

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Display student personal details */}
          <Typography variant="h4" gutterBottom>
            Student: {student.first_name} {student.last_name} (ID: {student.student_id})
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: {student.email}
          </Typography>

          {/* Modules Registered Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Modules Registered
            </Typography>
            {uniqueModules.length === 0 ? (
              <Typography variant="body1">No modules registered.</Typography>
            ) : (
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Module Code</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniqueModules.map(modCode => (
                    <TableRow key={modCode}>
                      <TableCell>{modCode}</TableCell>
                      <TableCell>
                        {/* Button to navigate to the module details page */}
                        <Button variant="text" component={Link} to={`/module/${modCode}`}>
                          View Module
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* Button to navigate to the module assignment page */}
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              component={Link}
              to={`/assignmodule/${student.student_id}`}
            >
              Assign Module
            </Button>
          </Box>

          {/* Grades Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Grades
            </Typography>
            {grades.length === 0 ? (
              <Typography variant="body1">No grades available.</Typography>
            ) : (
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell>CA Mark</TableCell>
                    <TableCell>Exam Mark</TableCell>
                    <TableCell>Total Grade</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map((grade, index) => {
                    const moduleCode = parseHyperlink(grade.module);
                    return (
                      <TableRow key={index}>
                        <TableCell>{moduleCode}</TableCell>
                        <TableCell>{grade.ca_mark}</TableCell>
                        <TableCell>{grade.exam_mark}</TableCell>
                        <TableCell>{grade.total_grade}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            component={Link}
                            to={`/setgrade/student/${student.student_id}/module/${moduleCode}`}
                          >
                            Set Grade
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SingleStudent;
