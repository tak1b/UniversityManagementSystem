// Home.jsx
// This is the Home component that serves as the landing page for the application.
// It provides a welcome message and a brief instruction to the user.
// The styling is applied inline for simplicity.

import React from 'react';

// The Home functional component simply returns some JSX to display a welcome message.
function Home() {
  return (
    // The outer div centers the content and adds top margin.
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {/* Main heading for the home page */}
      <h2>Welcome to the Management System</h2>
      {/* Paragraph providing a brief instruction */}
      <p>Use the navigation bar above to access different sections.</p>
    </div>
  );
}

// Export the Home component so it can be imported and used in other parts of the app.
export default Home;
