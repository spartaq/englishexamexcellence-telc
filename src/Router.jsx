import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import App from './App';
import LandingPage from './components/LandingPage/LandingPage';
import ExamDescription from './components/ui/IELTSExamDescription';

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
      
      {/* Public route for SEO - IELTS Info page with "Four Pillars" content */}
      <Route path="/ielts-info" element={<ExamDescription activeTest={{ title: 'IELTS' }} />} />
      
      {/* Public route - Free mock without login */}
      <Route path="/free-mock" element={<App initialView="ielts-general-mini-test" />} />
      
      {/* IELTS routes - exam-based routing */}
      <Route path="/ielts" element={
        <ProtectedRoute>
          <App initialView="ieltsHub" />
        </ProtectedRoute>
      } />
      <Route path="/ielts/general-mini-test" element={
        <ProtectedRoute>
          <App initialView="ielts-general-mini-test" />
        </ProtectedRoute>
      } />
      <Route path="/ielts/academic-mini-test" element={
        <ProtectedRoute>
          <App initialView="ielts-academic-mini-test" />
        </ProtectedRoute>
      } />
      <Route path="/ielts/vocabulary" element={
        <ProtectedRoute>
          <App initialView="vocabulary" />
        </ProtectedRoute>
      } />
      <Route path="/ielts/mywords" element={
        <ProtectedRoute>
          <App initialView="mywords" />
        </ProtectedRoute>
      } />
      <Route path="/ielts/drillshub" element={
        <ProtectedRoute>
          <App initialView="drillshub" />
        </ProtectedRoute>
      } />
      
      {/* LangCert routes - exam-based routing */}
      <Route path="/langcert" element={
        <ProtectedRoute>
          <App initialView="langcert-hub" />
        </ProtectedRoute>
      } />
      
      {/* TOEFL routes - exam-based routing */}
      <Route path="/toefl" element={
        <ProtectedRoute>
          <App initialView="toefl-hub" />
        </ProtectedRoute>
      } />
      
    </Routes>
  );
};

export default Router;
