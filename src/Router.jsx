import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import App from './App';
import LandingPage from './components/LandingPage/LandingPage';
import ExamDescription from './components/ui/TELCExamDescription';

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
      
      {/* Public route for SEO - TELC Info page */}
      <Route path="/telc-info" element={<ExamDescription activeTest={{ title: 'TELC' }} />} />
      
      {/* Public route - Free mock without login (level selection) */}
      <Route path="/free-mock" element={<App initialView="telc-b2-mini-test" />} />
      <Route path="/free-mock/b1" element={<App initialView="telc-b1-mini-test" />} />
      <Route path="/free-mock/b2" element={<App initialView="telc-b2-mini-test" />} />
      <Route path="/free-mock/c1" element={<App initialView="telc-c1-mini-test" />} />
      
      {/* TELC B1 routes */}
      <Route path="/telc/b1" element={
        <ProtectedRoute>
          <App initialView="telc-b1-hub" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b1/mini-test" element={
        <ProtectedRoute>
          <App initialView="telc-b1-mini-test" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b1/reading" element={
        <ProtectedRoute>
          <App initialView="telc_b1_reading" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b1/writing" element={
        <ProtectedRoute>
          <App initialView="telc_b1_writing" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b1/speaking" element={
        <ProtectedRoute>
          <App initialView="telc_b1_speaking" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b1/listening" element={
        <ProtectedRoute>
          <App initialView="telc_b1_listening" />
        </ProtectedRoute>
      } />
      
      {/* TELC B2 routes */}
      <Route path="/telc/b2" element={
        <ProtectedRoute>
          <App initialView="telc-b2-hub" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b2/mini-test" element={
        <ProtectedRoute>
          <App initialView="telc-b2-mini-test" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b2/reading" element={
        <ProtectedRoute>
          <App initialView="telc_b2_reading" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b2/writing" element={
        <ProtectedRoute>
          <App initialView="telc_b2_writing" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b2/speaking" element={
        <ProtectedRoute>
          <App initialView="telc_b2_speaking" />
        </ProtectedRoute>
      } />
      <Route path="/telc/b2/listening" element={
        <ProtectedRoute>
          <App initialView="telc_b2_listening" />
        </ProtectedRoute>
      } />
      
      {/* TELC C1 routes */}
      <Route path="/telc/c1" element={
        <ProtectedRoute>
          <App initialView="telc-c1-hub" />
        </ProtectedRoute>
      } />
      <Route path="/telc/c1/mini-test" element={
        <ProtectedRoute>
          <App initialView="telc-c1-mini-test" />
        </ProtectedRoute>
      } />
      <Route path="/telc/c1/reading" element={
        <ProtectedRoute>
          <App initialView="telc_c1_reading" />
        </ProtectedRoute>
      } />
      <Route path="/telc/c1/writing" element={
        <ProtectedRoute>
          <App initialView="telc_c1_writing" />
        </ProtectedRoute>
      } />
      <Route path="/telc/c1/speaking" element={
        <ProtectedRoute>
          <App initialView="telc_c1_speaking" />
        </ProtectedRoute>
      } />
      <Route path="/telc/c1/listening" element={
        <ProtectedRoute>
          <App initialView="telc_c1_listening" />
        </ProtectedRoute>
      } />
      
      {/* Shared routes (vocab, drills, my words) */}
      <Route path="/telc/vocabulary" element={
        <ProtectedRoute>
          <App initialView="vocabulary" />
        </ProtectedRoute>
      } />
      <Route path="/telc/mywords" element={
        <ProtectedRoute>
          <App initialView="mywords" />
        </ProtectedRoute>
      } />
      <Route path="/telc/drillshub" element={
        <ProtectedRoute>
          <App initialView="drillshub" />
        </ProtectedRoute>
      } />
      
      {/* LangCert routes */}
      <Route path="/langcert" element={
        <ProtectedRoute>
          <App initialView="langcert-hub" />
        </ProtectedRoute>
      } />
      
    </Routes>
  );
};

export default Router;