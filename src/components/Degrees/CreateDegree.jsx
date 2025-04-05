// src/components/Degrees/CreateDegree.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent
} from "@mui/material";

const API_BASE = "http://127.0.0.1:8000/api";

function CreateDegree() {
  const [fullName, setFullName] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !shortcode.trim()) {
      setError("Both Full Name and Shortcode are required.");
      return;
    }

    fetch(`${API_BASE}/degree/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName.trim(),
        shortcode: shortcode.trim()
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to create degree: ${res.status} ${res.statusText} ${JSON.stringify(errorData)}`
          );
        }
        return res.json();
      })
      .then(() => {
        alert("Degree created successfully.");
        navigate("/degrees");
      })
      .catch((err) => {
        console.error("Error creating degree:", err);
        setError("Error creating degree. Please try again.");
      });
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 2
      }}
    >
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Create New Degree
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
              mt: 2
            }}
          >
            <TextField
              label="Full Name"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <TextField
              label="Shortcode"
              variant="outlined"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ alignSelf: "center", mt: 2 }}
            >
              Create Degree
            </Button>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate("/degrees")}
            sx={{ display: "block", mt: 2, mx: "auto" }}
          >
            Back to All Degrees
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateDegree;
