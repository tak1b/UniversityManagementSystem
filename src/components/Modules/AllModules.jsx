import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

// Helper: Renders a table
const renderTable = (headers, rows) => (
  <table>
    <thead>
      <tr>
        {headers.map(header => <th key={header}>{header}</th>)}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, idx) => (
        <tr key={idx}>
          {row.map((cell, i) => <td key={i}>{cell}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

// Helper: Extract last segment of a URL
function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function AllModules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/module/`)
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(err => console.error("Error fetching modules:", err));
  }, []);

  const headers = ["Code", "Full Name", "Delivered To", "CA Split", "Action"];
  const rows = modules.map(mod => [
    mod.code,
    mod.full_name,
    mod.delivered_to.map(url => parseHyperlink(url)).join(", "),
    mod.ca_split,
    <Link to={`/module/${mod.code}`}>View Details</Link>
  ]);

  return (
    <div>
      <h2>All Modules</h2>
      {renderTable(headers, rows)}
      <p>
        <Link to="/module/create">
          <button>Create New Module</button>
        </Link>
      </p>
    </div>
  );
}

export default AllModules;
