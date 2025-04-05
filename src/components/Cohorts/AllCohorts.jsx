import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function AllCohorts() {
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/cohort/`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(error => console.error("Error fetching cohorts:", error));
  }, []);

  // Inline helper to extract the last segment of a URL.
  const parseHyperlink = (url) => {
    if (!url) return "";
    return url.replace(/\/$/, "").split("/").pop();
  };

  return (
    <div>
      <h2>All Cohorts</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Year</th>
            <th>Degree</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map(cohort => (
            <tr key={cohort.id}>
              <td>{cohort.id}</td>
              <td>{cohort.name || "-"}</td>
              <td>{cohort.year}</td>
              <td>{cohort.degree ? parseHyperlink(cohort.degree) : ""}</td>
              <td>
                <Link to={`/cohort/${cohort.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link to="/cohort/create">
          <button>Create New Cohort</button>
        </Link>
      </p>
    </div>
  );
}

export default AllCohorts;
