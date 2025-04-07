// SearchStudent.jsx
// This component renders a styled search form for finding a student by their student number.
// It uses Material‑UI components (Card, Box, Typography, TextField, Button) to create a lively, modern UI.
// When the user enters a student number and submits the form, it navigates to that student's detail page.

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SearchStudent() {
  // State to store the entered student number.
  const [studentNumber, setStudentNumber] = useState('');
  // State for storing any validation error messages.
  const [error, setError] = useState('');
  // useNavigate hook to programmatically navigate to a student's detail page.
  const navigate = useNavigate();

  // Function to handle the form submission.
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    if (studentNumber.trim() === '') {
      // If the input is empty, set an error message.
      setError("Please enter a student number");
      return;
    }
    // Clear any existing error.
    setError('');
    // Navigate to the student detail page using the entered student number.
    navigate(`/student/${studentNumber.trim()}`);
  };

  return (
    // Use a Box container to center the Card on the page.
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      {/* Card provides an elevated container for the search form */}
      <Card sx={{ width: 400, boxShadow: 3 }}>
        <CardContent>
          {/* Header text for the search form */}
          <Typography variant="h5" align="center" gutterBottom>
            Search for a Student
          </Typography>
          {/* The form is wrapped in a Box with vertical spacing between fields */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Input field for student number */}
            <TextField
              label="Student Number"
              variant="outlined"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
              error={Boolean(error)}
              helperText={error}
            />
            {/* Submit button to perform the search */}
            <Button type="submit" variant="contained">
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SearchStudent;
