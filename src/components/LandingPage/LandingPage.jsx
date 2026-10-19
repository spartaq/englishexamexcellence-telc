import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Clock, Brain, Atom, Quote, Menu } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import './LandingPage.css';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleStartTraining = (level) => {
    navigate(`/telc/${level}`);
  };

  const handleTelcInfo = () => {
    navigate(`/telc-info`);
  };

  return (
    <>
      <SEO {...routeMeta('/')} schemaBlock={{ website: true }} />
    <div className="landing-page">
      {/* Navbar */}
      <nav className="lp-navbar">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <GraduationCap size={24} color="white" />
            <span>{t('nav.site-title')}</span>
          </div>
          <div className="lp-nav-desktop">
            <div className="lp-nav-links">
              <button className="lp-nav-link lp-nav-link--active">{t('nav.telc.levels')}</button>
              <button className="lp-nav-link" onClick={() => navigate('/telc-info')}>
                {t('nav.methodology')}
              </button>
              <button className="lp-nav-link" onClick={() => navigate('/pricing')}>
                {t('nav.pricing')}
              </button>
              <button className="lp-nav-link" onClick={() => handleTelcInfo()}>
                {t('nav.telc.info')}
              </button>
            </div>
            <div className="lp-nav-actions">
              <button
                className="lp-btn-primary"
                onClick={() => navigate('/telc/b1')}
              >
                {t('nav.get.started')}
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
              {t('nav.telc.levels')}
            </button>
              <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/telc-info');
            }}>
                {t('nav.methodology')}
              </button>
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/pricing');
            }}>
              {t('nav.pricing')}
            </button>
            <button className="lp-mobile-nav-link" onClick={() => {
              setIsMobileMenuOpen(false);
              handleTelcInfo();
            }}>
              {t('nav.telc.info')}
            </button>
          </div>
          <div className="lp-mobile-menu-actions">
            <button
              className="lp-btn-primary lp-mobile-btn-primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/telc/b1');
              }}
            >
              {t('nav.get.started')}
            </button>
          </div>
        </div>
      </nav>

      <main className="lp-main">
        {/* â”€â”€ Hero â”€â”€ */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            {/* Left Column */}
            <div className="lp-hero-left">
              <LanguageSwitcher />
              <h1 className="lp-hero-title">
                {t('hero.title')}
                <br />
                <span className="lp-hero-title-accent">{t('hero.start')}</span>
              </h1>
              <p className="lp-hero-subtext">
                {t('hero.subtitle')}
              </p>

              {/* Level Selection Cards */}
              <div className="lp-level-cards">
                <div className="lp-level-card" onClick={() => handleStartTraining('b1')}>
                  <div className="lp-level-card-tag">TELC B1</div>
                  <div className="lp-level-card-label">{t('hero.foundation')}</div>
                  <button className="lp-btn-level">{t('hero.start')}</button>
                </div>
                <div className="lp-level-card" onClick={() => handleStartTraining('b2')}>
                  <div className="lp-level-card-tag">TELC B2</div>
                  <div className="lp-level-card-label">{t('hero.upper.intermediate')}</div>
                  <button className="lp-btn-level">{t('hero.start')}</button>
                </div>
                <div className="lp-level-card" onClick={() => handleStartTraining('c1')}>
                  <div className="lp-level-card-tag">TELC C1</div>
                  <div className="lp-level-card-label">{t('hero.advanced')}</div>
                  <button className="lp-btn-level">{t('hero.start')}</button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lp-hero-right">
            </div>
          </div>
        </section>

        {/* â”€â”€ Feature Grid â”€â”€ */}
        <section className="lp-features">
          <div className="lp-features-inner">
            <div className="lp-section-header">
              <span className="lp-section-eyebrow">{t('features.methodology')}</span>
              <h2 className="lp-section-title">{t('features.results')}</h2>
            </div>
            <div className="lp-feature-grid">
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--rose">
                  <Clock size={28} color="var(--primary)" />
                </div>
                <h4 className="lp-feature-title">{t('features.focus')}</h4>
                <p className="lp-feature-desc">
                  {t('features.focus.desc')}
                </p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--teal">
                  <Brain size={28} color="var(--tertiary)" />
                </div>
                <h4 className="lp-feature-title">{t('features.ai')}</h4>
                <p className="lp-feature-desc">
                  {t('features.ai.desc')}
                </p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon lp-feature-icon--rose">
                  <Atom size={28} color="var(--primary)" />
                </div>
                <h4 className="lp-feature-title">{t('features.atoms')}</h4>
                <p className="lp-feature-desc">
                  {t('features.atoms.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ Teacher's Note â”€â”€ */}
        <section className="lp-teacher-note">
          <div className="lp-teacher-inner">
            <div className="lp-teacher-quote-mark">
              <Quote size={48} color="var(--primary-pale)" />
            </div>
            <blockquote className="lp-teacher-quote">
              "{t('teacher.note')}"
            </blockquote>
            <div className="lp-teacher-attribution">
              <span className="lp-teacher-rule" />
              <span>{t('teacher.title')}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  );
};

export default LandingPage;
