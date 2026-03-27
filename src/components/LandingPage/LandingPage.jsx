import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Play, Clock, Brain, Atom } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  // Navigate to brand hub
  const handleStartTraining = (testType) => {
    if (testType === 'toefl') {
      // TOEFL hub requires authentication, redirect to sign in first
      navigate('/dashboard/toefl-hub');
    } else {
      // IELTS hub requires authentication, redirect to sign in first
      navigate('/ielts-hub');
    }
  };

  // Navigate to free mock (no authentication required)
  const handleStartFreeMock = () => {
    navigate('/free-mock');
  };

  return (
    <>
      <title>The Exam Lab - Stop Practicing, Start Training</title>
      <meta name="description" content="Prepare for IELTS and TOEFL with 15-minute 'atom' training sessions. Build real skills daily instead of just taking practice tests." />
      
      <div className="landing-container">
        <nav className="navbar">
          <div className="logo">
            <GraduationCap size={24} color="var(--invictus-red)" />
            <span>INVICTUS</span>
          </div>
          <div className="nav-actions">
            <button className="btn-text">The Methodology</button>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="btn-outline">Sign In</button>
              </SignInButton>
            )}
          </div>
        </nav>

        <header className="hero">
          <div className="hero-content">
            <div className="hero-badge">IELTS • TOEFL • TELC</div>
            <h1>
              Stop practicing. <br />
              <span className="text-gradient">Start training.</span>
            </h1>
            <p className="hero-subtext">
              Most students just measure their level with mock tests. We help you <strong>improve</strong> it. 
              Break your preparation into 15-minute "Atoms" to build real skills daily, 
              or dive into full-length simulated exams.
            </p>

            {/* THE FORK IN THE ROAD */}
            <div className="hero-selection-cards">
              <div className="selection-card">
                <h3>IELTS</h3>
                <p>General & Academic</p>
                <button 
                  className="btn-primary full-width"
                  onClick={() => handleStartFreeMock()}
                >
                  START IELTS MOCK
                </button>
              </div>
              
              <div className="selection-card">
                <h3>TOEFL</h3>
                <p>iBT Preparation</p>
                <button 
                  className="btn-secondary full-width"
                  onClick={() => handleStartFreeMock()}
                >
                  START TOEFL MOCK
                </button>
              </div>
            </div>
            
            <p className="cta-hint">Free "Bronze" atoms available for everyone. No credit card required.</p>
          </div>

          <div className="hero-visual">
            <div className="hero-cta-box">
              <h3>Ready to test your skills?</h3>
              <p>Take our free IELTS General Mini Mock and see where you stand.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/free-mock')}
              >
                <Play size={20} fill="white" />
                Try a Free Mock
              </button>
            </div>
          </div>
        </header>

        <section className="tiers-overview">
            <div className="tier-info">
                <span className="tier-tag bronze">BRONZE</span>
                <p><strong>Free forever.</strong> Access to daily Atom exercises and Mock Test #1.</p>
            </div>
            <div className="tier-info">
                <span className="tier-tag silver">SILVER</span>
                <p><strong>Registered.</strong> Save your progress, track your XP, and see detailed analytics.</p>
            </div>
            <div className="tier-info">
                <span className="tier-tag gold">GOLD</span>
                <p><strong>Premium.</strong> Unlock all 30+ Mocks, AI Writing assessment, and Speaking labs.</p>
            </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Clock size={32} color="var(--invictus-red)" /></div>
            <h3>Focus That Counts</h3>
            <p>
              Exercises designed to expand your vocabulary and practice specific exam skills in short bursts.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Brain size={32} color="var(--invictus-red)" /></div>
            <h3>AI Assessments</h3>
            <p>
              Don't just guess your score. Use our Gold-tier AI tools to get instant feedback on your Writing and Speaking.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Atom size={32} color="var(--invictus-red)" /></div>
            <h3>Exam Atoms</h3>
            <p>
              Can't fit a 3-hour exam into your day? Our "Atoms" are 15-minute drills that target your weakest areas.
            </p>
          </div>
        </section>

        <section className="teacher-note">
          <div className="note-content">
            <h4>A quick word from the teacher:</h4>
            <p>
              "Preparation should be a marathon, not a sprint. Give me 15 minutes a day, 
              and I’ll give you the confidence to walk into that exam room and win."
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;