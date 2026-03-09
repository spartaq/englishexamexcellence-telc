import React from 'react';
import { useNavigate } from 'react-router-dom';
import XPDemo from './XPDemo';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    console.log('handleClick called');
    navigate('/dashboard');
  };

  return (
    <>
      <title>English Exam Excellence - Stop Practicing, Start Training</title>
      <meta name="description" content="Prepare for IELTS, TOEFL, PTE, and DET exams with 15-minute 'atom' training sessions. Build real skills daily instead of just taking practice tests." />
      <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-box">L</span> THE EXAM LAB
        </div>
        <div className="nav-actions">
          <button className="btn-text">The Methodology</button>
          <button className="btn-outline">Sign In</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">IELTS • TOEFL • LangCert</div>
          <h1>
            Stop practicing. <br />
            <span className="text-gradient">Start training.</span>
          </h1>
          <p className="hero-subtext">
            If you can speak English fluently, you will pass. Doing mock tests 
            just measures your level—it doesn't improve it. I’ve broken the exams 
            down into 15-minute "atoms" so you can build real skills, every single day.
          </p>
          <div className="hero-ctas">
            <button 
              className="btn-primary"
              onClick={handleClick}
            >
              GO TO TESTS
            </button>
            <p className="cta-hint">No credit cards. Just hard work.</p>
          </div>
        </div>

        <div className="hero-visual">
          <XPDemo />
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Focus That Counts</h3>
          <p>
            In my lab, we don't track "study time"—we track <strong>effort</strong>. 
            The timer stops if you get distracted. You earn your rank through 
            pure, focused work.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>The "Secret Sauce"</h3>
          <p>
            You won't just see a score. You'll compare your work against 
            Gold-standard answers. If you can spot your own mistakes, 
            you're already halfway to a Band 9.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚛️</div>
          <h3>Exam Atoms</h3>
          <p>
            Don't sit through a 3-hour mock test. Master the "First Sentence Rule" 
            in reading or rhetorical logic in writing through bite-sized 
            daily exercises.
          </p>
        </div>
      </section>

      <section className="teacher-note">
        <div className="note-content">
          <h4>A quick word from the teacher:</h4>
          <p>
            "I built this because I’m tired of seeing students burn out on boring practice tests. 
            Preparation should be a marathon, not a sprint. Give me 15 minutes a day for three months, 
            and I’ll give you the confidence to walk into that exam room and win."
          </p>
        </div>
      </section>
    </div>
    </>
  );
};

export default LandingPage;