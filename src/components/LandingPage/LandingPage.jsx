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
            You can find mock tests everywhere and you can do them. But just doing mock tests 
            just measures your level — it doesn't improve it. What we have here are exercises to help you practice the key skills you need to be successful on the exam. There are full mocks here, but we also give you short "Atom" exercises which break down into 15-minute practice sessions so you can build real skills, every single day.
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
            Not just mock exams, but exercises to expand your vocabulary and practice the skills you need to get successful results on the exam.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>The "Secret Sauce"</h3>
          <p>
            You won't just see a score. For speaking and writing, you can assess yourself with AI.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚛️</div>
          <h3>Exam Atoms</h3>
          <p>
            You're probably not going to do a 3-hour exam everyday to practice. That's why we've got "Atoms", bite-sized exam exercises. 
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