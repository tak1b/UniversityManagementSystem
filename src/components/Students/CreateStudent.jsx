import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../api';

function CreateStudent() {
  const [cohorts, setCohorts] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/cohort/`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(err => console.error("Error loading cohorts:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/student/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        cohort: selectedCohort
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create student");
        }
        return response.json();
      })
      .then(newStudent => {
        // Navigate to the single student page for the newly created student.
        navigate(`/student/${newStudent.student_id}`);
      })
      .catch(err => {
        console.error(err);
        setError("Error creating student. Please try again.");
      });
  };

  return (
    <div>
      <h2>Create New Student</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Number: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cohort: </label>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            required
          >
            <option value="">Select Cohort</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.id} (Year: {cohort.year})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Student</button>
      </form>
    </div>
  );
}

export default CreateStudent;
