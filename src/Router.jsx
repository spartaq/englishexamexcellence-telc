import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import App from './App';
import LandingPage from './components/LandingPage/LandingPage';
import TestPage from './components/TestPage';
import ExamDescription from './components/ui/ExamDescription';

// Protected route wrapper - requires authentication
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Public route for SEO - IELTS Info page with "Four Pillars" content */}
      <Route path="/ielts-info" element={<ExamDescription activeTest={{ title: 'IELTS' }} />} />
      
      {/* Public route - Free mock without login */}
      <Route path="/free-mock" element={<App initialView="ielts-general-mini-test" />} />
      
      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      } />
      
        {/* Mini test routes */}
        <Route path="/dashboard/ielts-general-mini-test" element={
          <ProtectedRoute>
            <App initialView="ielts-general-mini-test" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/ielts-academic-mini-test" element={
          <ProtectedRoute>
            <App initialView="ielts-academic-mini-test" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/ielts-general-full-test" element={
          <ProtectedRoute>
            <App initialView="ielts-general-full-test" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/ielts-academic-full-test" element={
          <ProtectedRoute>
            <App initialView="ielts-academic-full-test" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reading-ac" element={
          <ProtectedRoute>
            <App initialView="reading-ac" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reading-gt" element={
          <ProtectedRoute>
            <App initialView="reading-gt" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/writing-ac" element={
          <ProtectedRoute>
            <App initialView="writing-ac" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/writing-gt" element={
          <ProtectedRoute>
            <App initialView="writing-gt" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/listening" element={
          <ProtectedRoute>
            <App initialView="listening" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/speaking" element={
          <ProtectedRoute>
            <App initialView="speaking" />
          </ProtectedRoute>
        } />
        
        {/* IELTS Hub routes - new URL structure */}
        <Route path="/ielts-hub" element={
          <ProtectedRoute>
            <App initialView="ielts-hub" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-general-mini-test" element={
          <ProtectedRoute>
            <App initialView="ielts-general-mini-test" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-academic-mini-test" element={
          <ProtectedRoute>
            <App initialView="ielts-academic-mini-test" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-general-full-test" element={
          <ProtectedRoute>
            <App initialView="ielts-general-full-test" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-academic-full-test" element={
          <ProtectedRoute>
            <App initialView="ielts-academic-full-test" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-general-full-individual" element={
          <ProtectedRoute>
            <App initialView="ielts-general-full-individual" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/ielts-academic-full-individual" element={
          <ProtectedRoute>
            <App initialView="ielts-academic-full-individual" />
          </ProtectedRoute>
        } />
        
        {/* Vocab and Drills Hub routes under IELTS Hub */}
        <Route path="/ielts-hub/vocabulary" element={
          <ProtectedRoute>
            <App initialView="vocabulary" />
          </ProtectedRoute>
        } />
        <Route path="/ielts-hub/drillshub" element={
          <ProtectedRoute>
            <App initialView="drillshub" />
          </ProtectedRoute>
        } />
        
        {/* Hub routes */}
        <Route path="/dashboard/reading-academic" element={
          <ProtectedRoute>
            <App initialView="reading_academic" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reading-general" element={
          <ProtectedRoute>
            <App initialView="reading_general" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/writing-academic" element={
          <ProtectedRoute>
            <App initialView="writing_academic" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/writing-general" element={
          <ProtectedRoute>
            <App initialView="writing_general" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/drillshub" element={
          <ProtectedRoute>
            <App initialView="drillshub" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/vocabulary" element={
          <ProtectedRoute>
            <App initialView="vocabulary" />
          </ProtectedRoute>
        } />
        
         {/* Strategy view routes */}
         <Route path="/dashboard/ielts-hub" element={
           <ProtectedRoute>
             <App initialView="ielts-hub" />
           </ProtectedRoute>
         } />
         <Route path="/dashboard/langcert-hub" element={
           <ProtectedRoute>
             <App initialView="langcert-hub" />
           </ProtectedRoute>
         } />
         <Route path="/dashboard/toefl-hub" element={
           <ProtectedRoute>
             <App initialView="toefl-hub" />
           </ProtectedRoute>
         } />
         
          {/* Mini individual hub route */}
          <Route path="/dashboard/ielts-mini-individual" element={
            <ProtectedRoute>
              <App initialView="ielts-mini-individual" />
            </ProtectedRoute>
          } />
         
        {/* Test hub routes */}
        <Route path="/dashboard/ielts-full-individual" element={
          <ProtectedRoute>
            <App initialView="ielts-full-individual" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/langcert-test-hub" element={
          <ProtectedRoute>
            <App initialView="langcert-test-hub" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/langcert-reading" element={
          <ProtectedRoute>
            <App initialView="langcert_reading" />
          </ProtectedRoute>
        } />
         <Route path="/dashboard/toefl-test-hub" element={
           <ProtectedRoute>
             <App initialView="toefl-test-hub" />
           </ProtectedRoute>
         } />
    </Routes>
  );
};

export default Router;