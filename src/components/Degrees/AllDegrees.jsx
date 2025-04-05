// src/components/Degrees/AllDegrees.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Adjust this to point to your local Django server
const API_BASE = "http://127.0.0.1:8000/api";

function AllDegrees() {
  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/degree/`)
      .then(response => response.json())
      .then(data => setDegrees(data))
      .catch(error => console.error("Error fetching degrees:", error));
  }, []);

  return (
    <div>
      <h2>All Degrees</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Shortcode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {degrees.map(degree => (
            <tr key={degree.shortcode}>
              <td>{degree.full_name}</td>
              <td>{degree.shortcode}</td>
              <td>
                <Link to={`/degree/${degree.shortcode}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link to="/degree/create">
          <button>Create New Degree</button>
        </Link>
      </p>
    </div>
  );
}

export default AllDegrees;
