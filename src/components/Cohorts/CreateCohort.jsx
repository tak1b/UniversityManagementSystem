// CreateCohort.jsx
// This component provides a form to add a new cohort to a specific degree.
// It fetches a list of available degrees so the user can select the one to which the cohort belongs.
// Before sending the POST request, the plain degree ID is converted into a full URL, as required by the API.

import React, { useEffect, useState } from "react";
import { Box, TextField, Button, FormControl, Select, InputLabel, MenuItem, FormHelperText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// API_BASE is the common URL prefix for all API requests.
const API_BASE = "http://127.0.0.1:8000/api";

function CreateCohort() {
  // Local state to hold form inputs.
  const [cohortId, setCohortId] = useState("");
  const [year, setYear] = useState("");
  // selectedDegree stores the plain degree ID selected from the dropdown.
  const [selectedDegree, setSelectedDegree] = useState("");
  // Error state for form validation or API errors.
  const [error, setError] = useState(null);
  // State to hold the list of degrees fetched from the API.
  const [degrees, setDegrees] = useState([]);
  const navigate = useNavigate();

  // Fetch available degrees when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/degree/`)
      .then((res) => res.json())
      .then((data) => setDegrees(data))
      .catch((err) => console.error("Error loading degrees:", err));
  }, []);

  // Handler for form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation: all fields must be filled.
    if (!cohortId.trim() || !year.trim() || !selectedDegree) {
      setError("All fields are required.");
      return;
    }

    // Convert the plain degree ID (e.g., "TST10") to a full hyperlink.
    const degreeUrl = `${API_BASE}/degree/${selectedDegree}/`;

    // Build the payload to send to the API.
    const payload = {
      id: cohortId.trim(),
      year: parseInt(year, 10),
      degree: degreeUrl,
    };

    // Send a POST request to create the cohort.
    fetch(`${API_BASE}/cohort/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          // If the response is not OK, parse the error details.
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to create cohort: ${res.status} ${res.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return res.json();
      })
      .then(() => {
        alert("Cohort created successfully.");
        // Navigate back to the degree's details page after success.
        navigate(`/degree/${selectedDegree}`);
      })
      .catch((err) => {
        console.error("Error creating cohort:", err);
        setError(err.message);
      });
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: 2,
        maxWidth: "500px",
        mx: "auto",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Add Cohort to Degree
      </Typography>
      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        {/* Input field for Cohort ID */}
        <TextField
          label="Cohort ID"
          variant="outlined"
          required
          value={cohortId}
          onChange={(e) => setCohortId(e.target.value)}
        />
        {/* Input field for Year */}
        <TextField
          label="Year"
          variant="outlined"
          type="number"
          required
          inputProps={{ min: 1, max: 4 }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {/* Dropdown to select the degree */}
        <FormControl fullWidth required error={!selectedDegree && Boolean(error)}>
          <InputLabel id="degree-select-label">Degree</InputLabel>
          <Select
            labelId="degree-select-label"
            id="degree-select"
            value={selectedDegree}
            label="Degree"
            onChange={(e) => setSelectedDegree(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Degree</em>
            </MenuItem>
            {degrees.map((degree) => (
              <MenuItem key={degree.shortcode} value={degree.shortcode}>
                {degree.full_name} ({degree.shortcode})
              </MenuItem>
            ))}
          </Select>
          {!selectedDegree && <FormHelperText>Degree selection is required</FormHelperText>}
        </FormControl>
        <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
          Add Cohort
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        {/* Button to navigate back to the degree details page */}
        <Button variant="outlined" onClick={() => navigate(`/degree/${selectedDegree}`)}>
          Back to Degree
        </Button>
      </Box>
    </Box>
  );
}

export default CreateCohort;
