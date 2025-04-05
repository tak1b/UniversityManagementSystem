import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function CreateCohort() {
  const [degrees, setDegrees] = useState([]);
  const [cohortId, setCohortId] = useState("");
  const [year, setYear] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/degree/`)
      .then(res => res.json())
      .then(data => setDegrees(data))
      .catch(err => console.error("Error loading degrees for form:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/cohort/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cohortId.trim(),
        year: parseInt(year, 10),
        degree: selectedDegree
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create cohort");
        }
        return response.json();
      })
      .then(() => {
        navigate("/cohorts");
      })
      .catch(err => {
        console.error(err);
        setError("Error creating cohort. Please try again.");
      });
  };

  return (
    <div>
      <h2>Create New Cohort</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cohort ID: </label>
          <input
            type="text"
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year: </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1"
            max="4"
            required
          />
        </div>
        <div>
          <label>Degree: </label>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            required
          >
            <option value="">Select Degree</option>
            {degrees.map(degree => (
              <option key={degree.shortcode} value={degree.shortcode}>
                {degree.full_name} ({degree.shortcode})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Cohort</button>
      </form>
      <p>
        <button onClick={() => navigate("/cohorts")}>Back to All Cohorts</button>
      </p>
    </div>
  );
}

export default CreateCohort;
