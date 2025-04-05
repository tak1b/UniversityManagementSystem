// src/components/Students/SingleStudent.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '../../api';

// Helper: Extract the last segment from a URL.
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleStudent() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Ensure gradesData is an array; otherwise, fallback to empty array.
        setGrades(Array.isArray(gradesData) ? gradesData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!student) return <p>Student not found.</p>;

  // Extract unique module codes from the grades.
  const uniqueModules = Array.from(new Set(grades.map(grade => parseHyperlink(grade.module))));

  return (
    <div>
      <h2>
        Student: {student.first_name} {student.last_name} (ID: {student.student_id})
      </h2>
      <p>Email: {student.email}</p>
      <h3>Modules Registered</h3>
      {uniqueModules.length === 0 ? (
        <p>No modules registered.</p>
      ) : (
        <ul>
          {uniqueModules.map(modCode => (
            <li key={modCode}>
              <Link to={`/module/${modCode}`}>{modCode}</Link>
            </li>
          ))}
        </ul>
      )}
      <h3>Grades</h3>
      {grades.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>CA Mark</th>
              <th>Exam Mark</th>
              <th>Total Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>{parseHyperlink(grade.module)}</td>
                <td>{grade.ca_mark}</td>
                <td>{grade.exam_mark}</td>
                <td>{grade.total_grade}</td>
                <td>
                  <Link
                    to={`/setgrade/student/${student.student_id}/module/${parseHyperlink(grade.module)}`}
                  >
                    Set Grade
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>
        <Link to="/students">Back to Students</Link>
      </p>
    </div>
  );
}

export default SingleStudent;
