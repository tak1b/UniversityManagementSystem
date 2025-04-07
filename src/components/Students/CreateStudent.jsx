// CreateStudent.jsx
// This component renders a form to create a new student.
// The styling has been updated to match the look of CreateDegree.jsx.
// It uses Material-UI components such as Card, CardContent, Box, and Typography
// to create a clean and modern form layout.

import React, { useEffect, useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  FormHelperText, 
  Typography, 
  Card, 
  CardContent 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api";

function CreateStudent() {
  // State for form input values.
  const [inputs, setInputs] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
  });
  // State for tracking errors in each field.
  const [errors, setErrors] = useState({
    student_id: false,
    first_name: false,
    last_name: false,
    cohort: false,
  });
  // State to store the list of cohorts fetched from the API.
  const [cohorts, setCohorts] = useState([]);
  // State for the selected cohort's value (the full URL).
  const [selectedOption, setSelectedOption] = useState("");
  // Additional error message specifically for cohort selection.
  const [listErrors, setListErrors] = useState("");
  // API error message for any errors coming from the backend.
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  // Fetch available cohorts from the API when the component mounts.
  useEffect(() => {
    fetch(`${API_BASE}/cohort/`)
      .then(response => response.json())
      .then(data => setCohorts(data))
      .catch(error => console.error("Error loading cohorts:", error));
  }, []);

  // Handle changes for text fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
    // Remove error flag if input is non-empty.
    if (errors[name] && value.trim() !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Handle changes for the dropdown selection.
  const handleForm = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value !== "") {
      setListErrors("");
    }
  };

  // Validate that all required fields are filled.
  const validateInput = () => {
    const newErrors = {
      student_id: inputs.student_id.trim() === "",
      first_name: inputs.first_name.trim() === "",
      last_name: inputs.last_name.trim() === "",
      cohort: selectedOption === "",
    };

    if (selectedOption === "") {
      setListErrors("Please select a cohort.");
    }

    setErrors(newErrors);
    // Return true if there are no errors.
    return !Object.values(newErrors).includes(true);
  };

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    if (validateInput()) {
      // Build the payload to send to the API.
      const toPost = {
        student_id: inputs.student_id.trim(),
        first_name: inputs.first_name.trim(),
        last_name: inputs.last_name.trim(),
        cohort: selectedOption, // This value is the full URL for the cohort.
      };

      // POST the new student data to the API.
      fetch(`${API_BASE}/student/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPost),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `Failed to create student: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
            );
          }
          return response.json();
        })
        .then(newStudent => {
          console.log("Student creation successful:", newStudent);
          alert("Student created successfully.");
          // Redirect to the newly created student's detail page.
          navigate(`/student/${newStudent.student_id}`);
        })
        .catch(err => {
          console.error("Error creating student:", err);
          setApiError(err.message);
        });
    }
  };

  return (
    // Outer Box to center the form and apply padding/margins.
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 2 }}>
      {/* Card container for a polished look */}
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Page Title */}
          <Typography variant="h4" align="center" gutterBottom>
            Create Student
          </Typography>
          {/* Display any API error messages */}
          {apiError && (
            <Typography variant="body1" color="error" align="center">
              {apiError}
            </Typography>
          )}
          {/* Form fields wrapped in a Box */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* Student ID Field */}
            <TextField
              required
              error={errors.student_id}
              id="student-id"
              name="student_id"
              label="Student ID"
              value={inputs.student_id}
              onChange={handleChange}
              helperText={errors.student_id && "Student ID is required"}
            />
            {/* First Name Field */}
            <TextField
              required
              error={errors.first_name}
              id="first-name"
              name="first_name"
              label="First Name"
              value={inputs.first_name}
              onChange={handleChange}
              helperText={errors.first_name && "First Name is required"}
            />
            {/* Last Name Field */}
            <TextField
              required
              error={errors.last_name}
              id="last-name"
              name="last_name"
              label="Last Name"
              value={inputs.last_name}
              onChange={handleChange}
              helperText={errors.last_name && "Last Name is required"}
            />
            {/* Dropdown for selecting a cohort */}
            <FormControl fullWidth error={Boolean(listErrors)}>
              <InputLabel id="cohortLabelID">Cohort</InputLabel>
              <Select
                required
                labelId="cohortLabelID"
                id="cohortID"
                label="Cohort"
                value={selectedOption}
                onChange={handleForm}
              >
                {cohorts.map(cohort => (
                  // Each MenuItem's value is set as the full URL for the cohort.
                  <MenuItem
                    key={cohort.id}
                    value={`http://127.0.0.1:8000/api/cohort/${cohort.id}/`}
                  >
                    {cohort.name || cohort.id}
                  </MenuItem>
                ))}
              </Select>
              {listErrors && <FormHelperText>Cohort selection is required</FormHelperText>}
            </FormControl>
            {/* Submit button */}
            <Button type="submit" variant="contained" sx={{ alignSelf: "center", mt: 2 }}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateStudent;
