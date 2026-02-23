import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage/LandingPage';

const DashboardWrapper = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('landing');
  
  const handleGetStarted = () => {
    setView('dashboard');
  };

  return (
    <div className="app-wrapper">
      {view === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      {view === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default DashboardWrapper;