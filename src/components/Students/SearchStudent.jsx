import { useEffect, useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";

// Define your API base URL
const API_BASE = "http://127.0.0.1:8000/api";

function NewStudent() {
  const [inputs, setInputs] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    cohort: "",
  });

  const [errors, setErrors] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    cohort: "",
  });

  const [cohorts, setCohorts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [listErrors, setListErrors] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/cohort/`)
      .then((response) => response.json())
      .then((data) => {
        setCohorts(data);
      })
      .catch((error) => console.error("Error loading cohorts:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleForm = (e) => {
    // When a new option is selected, update the selected option
    setSelectedOption(e.target.value);
    if (e.target.value !== "") {
      setListErrors("");
    }
  };

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

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateInput()) {
      const toPost = {
        student_id: inputs.student_id.trim(),
        first_name: inputs.first_name.trim(),
        last_name: inputs.last_name.trim(),
        cohort: selectedOption, // This should be a full URL, e.g., "http://127.0.0.1:8000/api/cohort/COMSCI1/"
      };

      fetch(`${API_BASE}/student/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        .then(() => {
          console.log("Student creation successful.");
          alert("Student created successfully.");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error creating student:", error);
          alert("Error creating student.");
        });
    }
  };

  const studentForm = () => {
    return (
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          "& .MuiFormControl-root": { m: 1, minWidth: 120 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <TextField
            required
            error={Boolean(errors.student_id)}
            id="student-id"
            name="student_id"
            label="Student ID"
            value={inputs.student_id}
            onChange={handleChange}
            helperText={errors.student_id && "Student ID is required"}
          />
          <TextField
            required
            error={Boolean(errors.first_name)}
            id="first-name"
            name="first_name"
            label="First Name"
            value={inputs.first_name}
            onChange={handleChange}
            helperText={errors.first_name && "First Name is required"}
          />
          <TextField
            required
            error={Boolean(errors.last_name)}
            id="last-name"
            name="last_name"
            label="Last Name"
            value={inputs.last_name}
            onChange={handleChange}
            helperText={errors.last_name && "Last Name is required"}
          />
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
              {cohorts.map((cohort) => (
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
        </div>
        <Button type="submit" variant="contained" sx={{ m: 1 }}>
          Submit
        </Button>
      </Box>
    );
  };

  return (
    <div>
      <h1
        style={{
          border: "5px solid turquoise",
          borderRadius: "50px",
          padding: "10px",
          margin: "5vh auto",
          maxWidth: "75vw",
          textAlign: "center",
        }}
      >
        Create Student
      </h1>
      {studentForm()}
    </div>
  );
}

export default NewStudent;
