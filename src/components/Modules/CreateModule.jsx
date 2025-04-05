// src/components/Modules/CreateModule.jsx
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
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
    setError(null);
    // Split the input and convert each cohort ID into a full URL.
    const deliveredToArr = deliveredTo
      .split(",")
      .map(s => s.trim())
      .filter(id => id !== "")
      .map(cohortId => `${API_BASE}/cohort/${cohortId}/`);

    fetch(`${API_BASE}/module/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        full_name: fullName.trim(),
        ca_split: parseInt(caSplit, 10),
        delivered_to: deliveredToArr,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to create module: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return response.json();
      })
      .then(() => {
        alert("Module created successfully.");
        navigate("/modules");
      })
      .catch(err => {
        console.error("Error creating module:", err);
        setError(err.message);
      });
  };

  return (
    <div>
      <h2>Create New Module</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          required
          label="Module Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          required
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          required
          label="CA Split"
          type="number"
          value={caSplit}
          onChange={(e) => setCaSplit(e.target.value)}
        />
        <TextField
          required
          label="Delivered To (Comma-separated Cohort IDs)"
          value={deliveredTo}
          onChange={(e) => setDeliveredTo(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Create Module
        </Button>
      </Box>
      <Button variant="outlined" onClick={() => navigate("/modules")}>
        Back to Modules
      </Button>
    </div>
  );
}

export default CreateModule;
