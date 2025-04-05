// src/components/Degrees/CreateDegree.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function CreateDegree() {
  const [fullName, setFullName] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/degree/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName.trim(),
        shortcode: shortcode.trim()
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create degree");
        }
        return response.json();
      })
      .then(() => {
        navigate("/degrees");
      })
      .catch(err => {
        console.error(err);
        setError("Error creating degree. Please try again.");
      });
  };

  return (
    <div>
      <h2>Create New Degree</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name: </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Shortcode: </label>
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Degree</button>
      </form>
      <p>
        <button onClick={() => navigate("/degrees")}>Back to All Degrees</button>
      </p>
    </div>
  );
}

export default CreateDegree;
