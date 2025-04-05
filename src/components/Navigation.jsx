import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ textAlign: "center", marginBottom: "1rem" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/degrees">Degrees</Link> |{" "}
      <Link to="/cohorts">Cohorts</Link> |{" "}
      <Link to="/modules">Modules</Link> |{" "}
      <Link to="/student/search">Search Student</Link> |{" "}
      <Link to="/student/create">Create Student</Link> |{" "}
    </nav>
  );
}

export default Navigation;
