// src/components/Degrees/SingleDegree.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

// Helper to parse the last segment from a URL
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleDegree() {
  const { shortcode } = useParams();
  const [degree, setDegree] = useState(null);
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    // Fetch all degrees to find the matching one
    fetch(`${API_BASE}/degree/`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(deg => deg.shortcode === shortcode);
        setDegree(found);
      })
      .catch(err => console.error("Error fetching degrees:", err));

    // Fetch cohorts for this degree
    fetch(`${API_BASE}/cohort/?degree=${shortcode}`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(err => console.error("Error fetching cohorts:", err));
  }, [shortcode]);

  if (!degree) return <p>Loading degree details...</p>;

  return (
    <div>
      <h2>Degree: {degree.full_name} ({degree.shortcode})</h2>
      <p>
        <Link to="/degrees">Back to All Degrees</Link>
      </p>
      <h3>Cohorts in this Degree</h3>
      {cohorts.length === 0 ? (
        <p>No cohorts found for this degree.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cohort ID</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map(cohort => (
              <tr key={cohort.id}>
                <td>{cohort.id}</td>
                <td>{cohort.year}</td>
                <td>
                  <Link to={`/cohort/${cohort.id}`}>View Cohort</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SingleDegree;
