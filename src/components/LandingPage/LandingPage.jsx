import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Play, Clock, Brain, Atom } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  // Navigate to TELC level hub
  const handleStartTraining = (level) => {
    navigate(`/telc/${level}`);
  };

  // Navigate to free mock (no authentication required) - let user pick level
  const handleStartFreeMock = (level) => {
    navigate(`/free-mock/${level}`);
  };

  return (
    <>
      <title>The Exam Lab - Stop Practicing, Start Training</title>
      <meta name="description" content="Prepare for TELC B1, B2, and C1 exams with 15-minute training sessions. Build real skills daily instead of just taking practice tests." />
      
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
            <div className="hero-badge">TELC</div>
            <h1>
              English Exam Lab <br />
              <span className="text-gradient">Really learn.</span>
            </h1>
            <p className="hero-subtext">
              If you are serious about passing an English exam, you need to do some work. Usually 3months before the test, if you do somework everyday, you will definitely improve your passive vocabulary and grammar use. 
            </p><p className="hero-subtext">
             But just taking practice tests won't help you much if you are not learning. The best way to pass the test is to speak English fluently of course. Barring that, you should build your vocabulary and practice the grammar that is likely to be on the test.
            </p>

            {/* THE FORK IN THE ROAD - TELC Level Selection */}
            <div className="hero-selection-cards">
              <div className="selection-card" onClick={() => handleStartTraining('b1')}>
                <h3>TELC B1</h3>
                <p>Foundation Level</p>
                <button className="btn-primary full-width">
                  START B1
                </button>
              </div>
              
              <div className="selection-card" onClick={() => handleStartTraining('b2')}>
                <h3>TELC B2</h3>
                <p>Upper Intermediate</p>
                <button className="btn-primary full-width">
                  START B2
                </button>
              </div>
              
              <div className="selection-card" onClick={() => handleStartTraining('c1')}>
                <h3>TELC C1</h3>
                <p>Advanced</p>
                <button className="btn-secondary full-width">
                  START C1
                </button>
              </div>
            </div>
            
            
          </div>

          <div className="hero-visual">
            <div className="hero-cta-box">
              <h3>Ready to test your skills?</h3>
              <p>Take a free TELC Mini Mock and see where you stand.</p>
              <div className="free-mock-levels">
                <button className="btn-level" onClick={() => handleStartFreeMock('b1')}>
                  B1
                </button>
                <button className="btn-level" onClick={() => handleStartFreeMock('b2')}>
                  B2
                </button>
                <button className="btn-level" onClick={() => handleStartFreeMock('c1')}>
                  C1
                </button>
              </div>
            </div>
          </div>
        </header>

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
              and I'll give you the confidence to walk into that exam room and win."
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;