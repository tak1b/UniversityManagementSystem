import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SearchStudent() {
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (studentNumber.trim() === '') {
      setError("Please enter a student number");
      return;
    }
    // Clear any error and navigate to the student's page.
    setError('');
    navigate(`/student/${studentNumber.trim()}`);
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        marginTop: '2rem'
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSearch}
    >
      <TextField 
        label="Student Number" 
        value={studentNumber} 
        onChange={(e) => setStudentNumber(e.target.value)} 
        required 
        error={Boolean(error)}
        helperText={error}
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
}

export default SearchStudent;
