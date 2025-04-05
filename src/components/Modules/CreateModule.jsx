import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function CreateModule() {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [caSplit, setCaSplit] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Split deliveredTo input by commas to form an array.
    const deliveredToArr = deliveredTo.split(",").map(item => item.trim());
    fetch(`${API_BASE}/module/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        full_name: fullName.trim(),
        ca_split: parseInt(caSplit, 10),
        delivered_to: deliveredToArr
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create module");
        }
        return response.json();
      })
      .then(() => {
        navigate("/modules");
      })
      .catch(err => {
        console.error(err);
        setError("Error creating module. Please try again.");
      });
  };

  return (
    <div>
      <h2>Create New Module</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Module Code: </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
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
          <label>CA Split: </label>
          <input
            type="number"
            value={caSplit}
            onChange={(e) => setCaSplit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Delivered To (Comma-separated Cohort IDs): </label>
          <input
            type="text"
            value={deliveredTo}
            onChange={(e) => setDeliveredTo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Module</button>
      </form>
      <p>
        <button onClick={() => navigate("/modules")}>Back to All Modules</button>
      </p>
    </div>
  );
}

export default CreateModule;
