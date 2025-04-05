import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AllDegrees from './components/Degrees/AllDegrees';
import SingleDegree from './components/Degrees/SingleDegree';
import CreateDegree from './components/Degrees/CreateDegree';
import AllCohorts from './components/Cohorts/AllCohorts';
import SingleCohort from './components/Cohorts/SingleCohort';
import CreateCohort from './components/Cohorts/CreateCohort';
import AllModules from './components/Modules/AllModules';
import SingleModule from './components/Modules/SingleModule';
import CreateModule from './components/Modules/CreateModule';
import SingleStudent from './components/Students/SingleStudent';
import CreateStudent from './components/Students/CreateStudent';
import SetGrade from './components/Students/SetGrade';
import SearchStudent from './components/Students/SearchStudent';
import AssignModule from './components/Students/AssignModule';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header style={{ textAlign: "center" }}>
          <h1>University Management System</h1>
        </header>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/degrees" element={<AllDegrees />} />
          <Route path="/degree/create" element={<CreateDegree />} />
          <Route path="/degree/:shortcode" element={<SingleDegree />} />
          <Route path="/cohorts" element={<AllCohorts />} />
          <Route path="/cohort/create" element={<CreateCohort />} />
          <Route path="/cohort/:cohortId" element={<SingleCohort />} />
          <Route path="/modules" element={<AllModules />} />
          <Route path="/module/create" element={<CreateModule />} />
          <Route path="/module/:moduleCode" element={<SingleModule />} />
          <Route path="/student/:studentId" element={<SingleStudent />} />
          <Route path="/student/create" element={<CreateStudent />} />
          <Route path="/student/search" element={<SearchStudent />} />
          <Route path="/setgrade/student/:studentId/module/:moduleCode" element={<SetGrade />} />
          <Route path="/assignmodule/:studentId" element={<AssignModule />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
