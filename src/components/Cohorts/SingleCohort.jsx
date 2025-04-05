import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleCohort() {
  const { cohortId } = useParams();
  const [cohort, setCohort] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the cohort details and its students concurrently.
    Promise.all([
      fetch(`${API_BASE}/cohort/`).then(res => res.json()),
      fetch(`${API_BASE}/student/?cohort=${cohortId}`).then(res => res.json())
    ])
      .then(([cohortsData, studentsData]) => {
        const foundCohort = cohortsData.find(c => c.id === cohortId);
        setCohort(foundCohort);
        setStudents(studentsData);
      })
      .catch(error => console.error("Error loading cohort details:", error));
  }, [cohortId]);

  if (!cohort) {
    return <p>Loading cohort details...</p>;
  }

  return (
    <div>
      <h2>Cohort: {cohort.id} (Year: {cohort.year})</h2>
      <p>Degree: {cohort.degree ? parseHyperlink(cohort.degree) : ""}</p>
      <p>
        <Link to="/cohorts">Back to All Cohorts</Link>
      </p>
      <p>
        <Link to={`/modulesDelivered/${cohort.id}`}>
          View Modules Delivered to This Cohort
        </Link>
      </p>
      <h3>Students in this Cohort</h3>
      {students.length === 0 ? (
        <p>No students found for this cohort.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.first_name} {student.last_name}</td>
                <td>
                  <Link to={`/student/${student.student_id}`}>View Student</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SingleCohort;
