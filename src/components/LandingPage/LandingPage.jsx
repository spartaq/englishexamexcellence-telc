import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Clock, Brain, Atom, Quote, Menu } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartTraining = (level) => {
    navigate(`/telc/${level}`);
  };

  const handleStartFreeMock = (level) => {
    navigate(`/free-mock/${level}`);
  };

  const handleTelcInfo = () => {
    navigate(`/telc-info`);
  };

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="lp-navbar">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <GraduationCap size={24} color="white" />
            <span>ENGLISH EXAM EXERCISES</span>
          </div>
          <div className="lp-nav-desktop">
            <div className="lp-nav-links">
              <button className="lp-nav-link lp-nav-link--active">TELC Levels</button>
              <button className="lp-nav-link">Methodology</button>
              <button className="lp-nav-link" onClick={() => navigate('/pricing')}>
                Pricing
              </button>
              <button className="lp-nav-link" onClick={() => handleTelcInfo()}>
                Telc Info
              </button>
            </div>
            <div className="lp-nav-actions">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="lp-btn-ghost">Sign In</button>
                </SignInButton>
              )}
              <button
                className="lp-btn-primary"
                onClick={() => navigate('/telc/b1')}
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="lp-nav-mobile">
            <button className="lp-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} color="white" />
            </button>
          </div>
        </div>
        <div className={`lp-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="lp-mobile-menu-links">
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/telc/b1');
            }}>
              TELC Levels
            </button>
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/methodology');
            }}>
              Methodology
            </button>
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/pricing');
            }}>
              Pricing
            </button>
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              handleTelcInfo();
            }}>
              Telc Info
            </button>
          </div>
          <div className="lp-mobile-menu-actions">
            {isSignedIn ? (
              <UserButton className="lp-mobile-user-button" />
            ) : (
              <SignInButton mode="modal">
                <button className="lp-btn-ghost lp-mobile-btn-ghost">Sign In</button>
              </SignInButton>
            )}
            <button
              className="lp-btn-primary lp-mobile-btn-primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/telc/b1');
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="lp-main">
        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            {/* Left Column */}
            <div className="lp-hero-left">
              <h1 className="lp-hero-title">
                TELC Exam Lab.
                <br />
                <span className="lp-hero-title-accent">Really get prepared.</span>
              </h1>
              <p className="lp-hero-subtext">
                Serious preparation means building deep vocabulary and solid grammar.
                We don't just teach you how to pass; we teach you how to master the
                language until success is inevitable.
              </p>

              {/* Level Selection Cards */}
              <div className="lp-level-cards">
                <div className="lp-level-card" onClick={() => handleStartTraining('b1')}>
                  <div className="lp-level-card-tag">TELC B1</div>
                  <div className="lp-level-card-label">Foundation</div>
                  <button className="lp-btn-level">START</button>
                </div>
                <div className="lp-level-card" onClick={() => handleStartTraining('b2')}>
                  <div className="lp-level-card-tag">TELC B2</div>
                  <div className="lp-level-card-label">Upper Intermediate</div>
                  <button className="lp-btn-level">START</button>
                </div>
                <div className="lp-level-card" onClick={() => handleStartTraining('c1')}>
                  <div className="lp-level-card-tag">TELC C1</div>
                  <div className="lp-level-card-label">Advanced</div>
                  <button className="lp-btn-level">START</button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lp-hero-right">
              <div className="lp-cta-box">
                <h3 className="lp-cta-title">Ready to test your skills?</h3>
                <p className="lp-cta-subtext">
                  Access our full-length mock examinations.
                  Precise scoring, realistic timing.
                </p>
                <div className="lp-mock-buttons">
                  <button
                    className="lp-mock-btn"
                    onClick={() => handleStartFreeMock('b1')}
                  >
                    <span>B1 Free Mock Test</span>
                    <span className="lp-mock-btn-arrow">&#8594;</span>
                  </button>
                  <button
                    className="lp-mock-btn"
                    onClick={() => handleStartFreeMock('b2')}
                  >
                    <span>B2 Free Mock Test</span>
                    <span className="lp-mock-btn-arrow">&#8594;</span>
                  </button>
                  <button
                    className="lp-mock-btn"
                    onClick={() => handleStartFreeMock('c1')}
                  >
                    <span>C1 Free Mock Test</span>
                    <span className="lp-mock-btn-arrow">&#8594;</span>
                  </button>
                </div>
              </div>

              
            </div>
          </div>
        </section>

        {/* ── Feature Grid ── */}
        <section className="lp-features">
          <div className="lp-features-inner">
            <div className="lp-section-header">
              <span className="lp-section-eyebrow">The Methodology</span>
              <h2 className="lp-section-title">Engineered for Results</h2>
            </div>
            <div className="lp-feature-grid">
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--rose">
                  <Clock size={28} color="var(--primary)" />
                </div>
                <h4 className="lp-feature-title">Focus That Counts</h4>
                <p className="lp-feature-desc">
                  Highly targeted exercises designed to bridge the gap between intermediate
                  and advanced mastery. We prioritise high-yield vocabulary and nuanced
                  exam skills.
                </p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--teal">
                  <Brain size={28} color="var(--tertiary)" />
                </div>
                <h4 className="lp-feature-title">AI Assessments</h4>
                <p className="lp-feature-desc">
                  Our gold-tier AI feedback engine provides granular, authoritative critiques
                  for Writing and Speaking modules, mimicking actual examiner benchmarks.
                </p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--rose">
                  <Atom size={28} color="var(--primary)" />
                </div>
                <h4 className="lp-feature-title">Exam Atoms</h4>
                <p className="lp-feature-desc">
                  Short, 15-minute intensive drills designed to isolate and strengthen your
                  weakest areas. Maximum efficiency for the time-constrained student.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Teacher's Note ── */}
        <section className="lp-teacher-note">
          <div className="lp-teacher-inner">
            <div className="lp-teacher-quote-mark">
              <Quote size={48} color="var(--primary-pale)" />
            </div>
            <blockquote className="lp-teacher-quote">
              "Preparation should be a marathon, not a sprint. We focus on the precision
              of language — the atoms of academic success — to ensure that when you sit
              for the exam, you aren't just guessing. You are asserting your knowledge."
            </blockquote>
            <div className="lp-teacher-attribution">
              <span className="lp-teacher-rule" />
              <span>Senior Academic Director, Invictus Lab</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
