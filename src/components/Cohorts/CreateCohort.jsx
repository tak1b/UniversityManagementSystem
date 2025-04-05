import React, { useEffect, useState } from "react";
import { Box, TextField, Button, FormControl, Select, InputLabel, MenuItem, FormHelperText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

function CreateCohort() {
  const [cohortId, setCohortId] = useState("");
  const [year, setYear] = useState("");
  const [selectedDegree, setSelectedDegree] = useState(""); // This will hold the plain degree ID (e.g., "TST10")
  const [error, setError] = useState(null);
  const [degrees, setDegrees] = useState([]);
  const navigate = useNavigate();

  // Fetch available degrees for the dropdown.
  useEffect(() => {
    fetch(`${API_BASE}/degree/`)
      .then((res) => res.json())
      .then((data) => setDegrees(data))
      .catch((err) => console.error("Error loading degrees:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate input fields.
    if (!cohortId.trim() || !year.trim() || !selectedDegree) {
      setError("All fields are required.");
      return;
    }

    // Convert the plain degree ID into a full hyperlink.
    const degreeUrl = `${API_BASE}/degree/${selectedDegree}/`;

    // Build the payload.
    const payload = {
      id: cohortId.trim(),
      year: parseInt(year, 10),
      degree: degreeUrl,
    };

    fetch(`${API_BASE}/cohort/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to create cohort: ${res.status} ${res.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return res.json();
      })
      .then(() => {
        alert("Cohort created successfully.");
        // Optionally navigate back to the degree details page.
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
        <TextField
          label="Cohort ID"
          variant="outlined"
          required
          value={cohortId}
          onChange={(e) => setCohortId(e.target.value)}
        />
        <TextField
          label="Year"
          variant="outlined"
          type="number"
          required
          inputProps={{ min: 1, max: 4 }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
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
        <Button variant="outlined" onClick={() => navigate(`/degree/${selectedDegree}`)}>
          Back to Degree
        </Button>
      </Box>
    </Box>
  );
}

export default CreateCohort;
