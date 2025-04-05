import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000/api";

function parseHyperlink(url) {
  if (!url) return "";
  return url.replace(/\/$/, "").split("/").pop();
}

function SingleModule() {
  const { moduleCode } = useParams();
  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/module/${moduleCode}/`)
      .then(res => res.json())
      .then(data => setModuleData(data))
      .catch(err => console.error("Error fetching module details:", err));
  }, [moduleCode]);

  if (!moduleData) {
    return <p>Loading module details...</p>;
  }

  return (
    <div>
      <h2>Module: {moduleData.full_name} ({moduleData.code})</h2>
      <p>CA Split: {moduleData.ca_split}</p>
      <p>Delivered To: {moduleData.delivered_to.map(url => parseHyperlink(url)).join(", ")}</p>
      <p>
        <Link to="/modules">Back to All Modules</Link>
      </p>
      <p>
        <Link to={`/studentsInModule/${moduleData.code}`}>View Students in this Module</Link>
      </p>
    </div>
  );
}

export default SingleModule;
