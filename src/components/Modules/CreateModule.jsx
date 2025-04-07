// CreateModule.jsx
// This component provides a form for creating a new module.
// It uses Material-UI components for styling and sends a POST request to create the module.
// For the "delivered_to" field, the user enters a comma-separated list of cohort IDs,
// which are then converted to full URLs required by the API.

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// API_BASE is the common URL prefix for all API requests.
const API_BASE = "http://127.0.0.1:8000/api";

function CreateModule() {
  // Local state for the form fields.
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [caSplit, setCaSplit] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");
  // State to store any error message from the API.
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // handleSubmit is called when the form is submitted.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    // Process the deliveredTo input:
    // 1. Split the string on commas.
    // 2. Trim each resulting ID.
    // 3. Filter out any empty strings.
    // 4. Convert each plain ID into the full URL required by the API.
    const deliveredToArr = deliveredTo
      .split(",")
      .map(s => s.trim())
      .filter(id => id !== "")
      .map(cohortId => `${API_BASE}/cohort/${cohortId}/`);

    // Send a POST request to create a module.
    fetch(`${API_BASE}/module/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Build the JSON payload.
      body: JSON.stringify({
        code: code.trim(),
        full_name: fullName.trim(),
        ca_split: parseInt(caSplit, 10),
        delivered_to: deliveredToArr,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          // If the response is not OK, parse the error message.
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to create module: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return response.json();
      })
      .then(() => {
        alert("Module created successfully.");
        // Navigate back to the list of modules.
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
      {/* Display any API error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Box
        component="form"
        sx={{
          // Apply spacing and width to TextFields.
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
        {/* Input for Module Code */}
        <TextField
          required
          label="Module Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {/* Input for Full Name */}
        <TextField
          required
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {/* Input for CA Split (as a number) */}
        <TextField
          required
          label="CA Split"
          type="number"
          value={caSplit}
          onChange={(e) => setCaSplit(e.target.value)}
        />
        {/* Input for Delivered To: a comma-separated list of cohort IDs */}
        <TextField
          required
          label="Delivered To (Comma-separated Cohort IDs)"
          value={deliveredTo}
          onChange={(e) => setDeliveredTo(e.target.value)}
        />
        {/* Submit button */}
        <Button type="submit" variant="contained">
          Create Module
        </Button>
      </Box>
      {/* Navigation button to go back to the Modules list */}
      <Button variant="outlined" onClick={() => navigate("/modules")}>
        Back to Modules
      </Button>
    </div>
  );
}

export default CreateModule;
