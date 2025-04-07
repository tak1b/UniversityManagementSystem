import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importing components for different sections of the application
import Navigation from './components/Navigation';
import Home from './components/Home';

// Degrees Section
import AllDegrees from './components/Degrees/AllDegrees';
import SingleDegree from './components/Degrees/SingleDegree';
import CreateDegree from './components/Degrees/CreateDegree';

// Cohorts Section
import AllCohorts from './components/Cohorts/AllCohorts';
import SingleCohort from './components/Cohorts/SingleCohort';
import CreateCohort from './components/Cohorts/CreateCohort';

// Modules Section
import AllModules from './components/Modules/AllModules';
import SingleModule from './components/Modules/SingleModule';
import CreateModule from './components/Modules/CreateModule';
import ModulesDelivered from './components/Modules/ModulesDelivered'; // New route for modules delivered

// Students Section
import SingleStudent from './components/Students/SingleStudent';
import CreateStudent from './components/Students/CreateStudent';
import SearchStudent from './components/Students/SearchStudent';
import SetGrade from './components/Students/SetGrade';
import AssignModule from './components/Students/AssignModule';

function App() {
  return (
    // BrowserRouter wraps the entire app to enable client-side routing.
    <BrowserRouter>
      <div>
        {/* Header Section */}
        <header style={{ textAlign: "center" }}>
          <h1>University Management System</h1>
        </header>
        {/* Navigation appears on every page */}
        <Navigation />
        {/* Routes Section */}
        <Routes>
          {/* Home Section */}
          <Route path="/" element={<Home />} />

          {/* Degrees Section */}
          <Route path="/degrees" element={<AllDegrees />} />
          <Route path="/degree/create" element={<CreateDegree />} />
          <Route path="/degree/:shortcode" element={<SingleDegree />} />

          {/* Cohorts Section */}
          <Route path="/cohorts" element={<AllCohorts />} />
          <Route path="/cohort/create" element={<CreateCohort />} />
          <Route path="/cohort/:cohortId" element={<SingleCohort />} />

          {/* Modules Section */}
          <Route path="/modules" element={<AllModules />} />
          <Route path="/module/create" element={<CreateModule />} />
          <Route path="/module/:moduleCode" element={<SingleModule />} />
          {/* New route for viewing modules delivered to a cohort */}
          <Route path="/modulesDelivered/:cohortId" element={<ModulesDelivered />} />

          {/* Students Section */}
          <Route path="/student/create" element={<CreateStudent />} />
          <Route path="/student/search" element={<SearchStudent />} />
          <Route path="/student/:studentId" element={<SingleStudent />} />

          {/* Grade and Module Assignment Section */}
          <Route path="/setgrade/student/:studentId/module/:moduleCode" element={<SetGrade />} />
          <Route path="/assignmodule/:studentId" element={<AssignModule />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
