import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../api';

function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SetGrade() {
  // Expecting URL parameters: studentId and moduleCode
  const { studentId, moduleCode } = useParams();
  const [student, setStudent] = useState(null);
  const [caMark, setCaMark] = useState("");
  const [examMark, setExamMark] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student details to get their cohort
    fetch(`${API_BASE}/student/${studentId}/`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.error("Error fetching student details:", err));
  }, [studentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student) {
      setError("Student data not loaded yet.");
      return;
    }
    const studentCohort = student.cohort ? parseHyperlink(student.cohort) : "";
    fetch(`${API_BASE}/grade/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student: studentId,
        module: moduleCode,
        ca_mark: parseInt(caMark, 10),
        exam_mark: parseInt(examMark, 10),
        cohort: studentCohort
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to set grade");
        }
        return response.json();
      })
      .then(() => {
        navigate(`/student/${studentId}`);
      })
      .catch(err => {
        console.error(err);
        setError("Error setting grade. Please try again.");
      });
  };

  if (!student) return <p>Loading student details...</p>;

  return (
    <div>
      <h2>Set Grade for Student {studentId} in Module {moduleCode}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>CA Mark: </label>
          <input
            type="number"
            value={caMark}
            onChange={(e) => setCaMark(e.target.value)}
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <label>Exam Mark: </label>
          <input
            type="number"
            value={examMark}
            onChange={(e) => setExamMark(e.target.value)}
            min="0"
            max="100"
            required
          />
        </div>
        <button type="submit">Set Grade</button>
      </form>
      <p>
        <button onClick={() => navigate(`/student/${studentId}`)}>Back to Student</button>
      </p>
    </div>
  );
}

export default SetGrade;
