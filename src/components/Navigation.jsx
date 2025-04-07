// Navigation.jsx
// This component defines the navigation bar for the application.
// It uses React Router's Link component to create navigable links without reloading the page.
// The navigation bar is styled inline to appear centered with some spacing.

import React from 'react';
// Import Link from react-router-dom to enable client-side navigation.
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    // The nav element acts as a container for our navigation links.
    // Inline styling centers the text and adds bottom margin.
    <nav style={{ textAlign: "center", marginBottom: "1rem" }}>
      {/* Each Link component renders an anchor (<a>) tag that navigates to a different route.
          The 'to' prop specifies the target route.
          We separate the links with a vertical bar and spaces for readability. */}
      <Link to="/">Home</Link> |{" "}
      <Link to="/degrees">Degrees</Link> |{" "}
      <Link to="/cohorts">Cohorts</Link> |{" "}
      <Link to="/modules">Modules</Link> |{" "}
      <Link to="/student/search">Search Student</Link> |{" "}
      <Link to="/student/create">Create Student</Link> |{" "}
    </nav>
  );
}

// Export the Navigation component so it can be used throughout the application.
export default Navigation;
