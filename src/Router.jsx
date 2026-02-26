import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './components/LandingPage/LandingPage';
import TestPage from './components/TestPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/test" element={<TestPage />} />
      
       {/* Mini test routes */}
       <Route path="/dashboard/mini-test" element={<App initialView="mini-test" />} />
       <Route path="/dashboard/academic-flow" element={<App initialView="academic-flow" />} />
       <Route path="/dashboard/reading-ac" element={<App initialView="reading-ac" />} />
       <Route path="/dashboard/reading-gt" element={<App initialView="reading-gt" />} />
       <Route path="/dashboard/writing-ac" element={<App initialView="writing-ac" />} />
       <Route path="/dashboard/writing-gt" element={<App initialView="writing-gt" />} />
       <Route path="/dashboard/listening" element={<App initialView="listening" />} />
       <Route path="/dashboard/speaking" element={<App initialView="speaking" />} />
       
       {/* Hub routes */}
       <Route path="/dashboard/reading-academic" element={<App initialView="reading_academic" />} />
       <Route path="/dashboard/reading-general" element={<App initialView="reading_general" />} />
       <Route path="/dashboard/writing-academic" element={<App initialView="writing_academic" />} />
       <Route path="/dashboard/writing-general" element={<App initialView="writing_general" />} />
       <Route path="/dashboard/ielts-atoms" element={<App initialView="ielts_atoms" />} />
       <Route path="/dashboard/general-drills" element={<App initialView="general_drills" />} />
       <Route path="/dashboard/vocabulary" element={<App initialView="vocabulary" />} />
       
        {/* Strategy view routes */}
        <Route path="/dashboard/ielts-strategy" element={<App initialView="ielts-strategy" />} />
        <Route path="/dashboard/langcert-strategy" element={<App initialView="langcert-strategy" />} />
        <Route path="/dashboard/toefl-strategy" element={<App initialView="toefl-strategy" />} />
        
        {/* Test hub routes */}
        <Route path="/dashboard/ielts-test-hub" element={<App initialView="ielts-test-hub" />} />
        <Route path="/dashboard/langcert-test-hub" element={<App initialView="langcert-test-hub" />} />
       <Route path="/dashboard/langcert-reading" element={<App initialView="langcert_reading" />} />
        <Route path="/dashboard/toefl-test-hub" element={<App initialView="toefl-test-hub" />} />
    </Routes>
  );
};

export default Router;