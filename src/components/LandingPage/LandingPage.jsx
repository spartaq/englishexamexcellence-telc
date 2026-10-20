import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, BookOpen, Clock, Check, Target, Languages, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import './LandingPage.css';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';

const LEVELS = [
  {
    id: 'b1',
    tag: 'TELC B1',
    icon: BookOpen,
    image: '/images/1person2.webp',
    labelKey: 'hero.foundation',
    descKey: 'lp.level.b1.desc',
  },
  {
    id: 'b2',
    tag: 'TELC B2',
    icon: Target,
    image: '/images/1person3.webp',
    labelKey: 'hero.upper.intermediate',
    descKey: 'lp.level.b2.desc',
  },
  {
    id: 'c1',
    tag: 'TELC C1',
    icon: Check,
    image: '/images/1person4.webp',
    labelKey: 'hero.advanced',
    descKey: 'lp.level.c1.desc',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

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
              <GraduationCap size={24} />
              <span className="lp-logo-wordmark">{t('nav.site-title')}</span>
            </div>
            <div className="lp-nav-desktop">
              <div className="lp-nav-links">
                <button className="lp-nav-link lp-nav-link--active" onClick={() => navigate('/telc/b2')}>
                  {t('nav.telc.levels')}
                </button>
                <button className="lp-nav-link" onClick={() => navigate('/telc-info')}>
                  {t('nav.methodology')}
                </button>
                <button className="lp-nav-link" onClick={() => handleTelcInfo()}>
                  {t('nav.telc.info')}
                </button>
              </div>
              <div className="lp-nav-actions">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="lp-nav-mobile">
              <button className="lp-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>
          </div>
          <div className={`lp-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="lp-mobile-menu-links">
              <button className="lp-mobile-nav-link" onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/telc/b2');
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
                handleTelcInfo();
              }}>
                {t('nav.telc.info')}
              </button>
            </div>
            <div className="lp-mobile-menu-actions">
              <LanguageSwitcher className="lp-mobile-lang-switcher" />
            </div>
          </div>
        </nav>

        <main className="lp-main">
          {/* Hero — welcome, level cards are the crux */}
          <section className="lp-hero">
            <div className="lp-hero-inner">
              <div className="lp-hero-content">

<div className="lp-hero-top">
                <div className="lp-hero-eyebrow">{t('lp.hero.eyebrow')}</div>
                <h1 className="lp-hero-title">
                  {t('hero.title')}
                </h1>
                <p className="lp-hero-subtext">
                  {t('hero.subtitle')}
                </p>
</div>
               

                
              </div>
            </div>
          </section>

          <section className="lp-cards">
            <div className="lp-cards-inner">
              


                <div className="lp-level-cards">
                  {LEVELS.map((level) => (
                    <div
                      key={level.id}
                      className="lp-level-card"
                      onClick={() => handleStartTraining(level.id)}
                    >
                      <div className="lp-level-card-media">
                        <img
                          className="lp-level-card-img"
                          src={level.image}
                          alt={`${level.tag} — ${t(level.labelKey)}`}
                          decoding="async"
                        />
                        <div className="lp-level-card-icon">
                          <level.icon size={22} />
                        </div>
                      </div>
                      <div className="lp-level-card-body">
                        <div className="lp-level-card-tag">{level.tag}</div>
                        <div className="lp-level-card-label">{t(level.labelKey)}</div>
                        <p className="lp-level-card-desc">{t(level.descKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              
            </div>
          </section>

          {/* What this site does for you — exam practice vs general learning */}
          <section className="lp-practice">
            <div className="lp-practice-inner">
              <div className="lp-practice-grid">
                <div className="lp-practice-col lp-practice-col--left">
                  <h2 className="lp-practice-heading">{t('lp.practice.heading')}</h2>
                  <p className="lp-practice-lead">
                    {t('lp.practice.lead')}
                  </p>
                  <div className="lp-practice-list">
                    <div className="lp-practice-item">
                      <div className="lp-practice-item-icon">
                        <Clock size={18} />
                      </div>
                      <div>
                        <span className="lp-practice-item-title">{t('lp.practice.item.timed.title')}</span>
                        <span className="lp-practice-item-desc">{t('lp.practice.item.timed.desc')}</span>
                      </div>
                    </div>
                    <div className="lp-practice-item">
                      <div className="lp-practice-item-icon">
                        <Target size={18} />
                      </div>
                      <div>
                        <span className="lp-practice-item-title">{t('lp.practice.item.format.title')}</span>
                        <span className="lp-practice-item-desc">{t('lp.practice.item.format.desc')}</span>
                      </div>
                    </div>
                    <div className="lp-practice-item">
                    <div className="lp-practice-item-icon">
                      <Languages size={18} />
                    </div>
                    <div>
                      <span className="lp-practice-item-title">{t('lp.practice.item.skills.title')}</span>
                      <span className="lp-practice-item-desc">{t('lp.practice.item.skills.desc')}</span>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="lp-practice-col lp-practice-col--right">
                  <img
                    src="/images/online-testing.webp"
                    alt="TELC exam practice"
                    className="lp-practice-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Simple CTA — just enter */}
          <section className="lp-enter">
            <div className="lp-enter-inner">
              <h2 className="lp-enter-heading">{t('lp.enter.heading')}</h2>
              <p className="lp-enter-desc">{t('lp.enter.desc')}</p>
              <div className="lp-enter-buttons">
                <button className="lp-btn-primary" onClick={() => navigate('/telc/b2')}>{t('nav.get.started')}</button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="lp-footer">
            <div className="lp-footer-inner">
              <div className="lp-footer-brand">
                <div className="lp-logo">
                  <GraduationCap size={22} />
                  <span className="lp-logo-wordmark">{t('nav.site-title')}</span>
                </div>
                <p className="lp-footer-tagline">{t('lp.footer.tagline')}</p>
              </div>
              <nav className="lp-footer-nav">
                <h4 className="lp-footer-section-title">{t('lp.footer.levels')}</h4>
                <button className="lp-footer-link" onClick={() => navigate('/telc/b1')}>{'>'} TELC B1</button>
                <button className="lp-footer-link" onClick={() => navigate('/telc/b2')}>{'>'} TELC B2</button>
                <button className="lp-footer-link" onClick={() => navigate('/telc/c1')}>{'>'} TELC C1</button>
                <h4 className="lp-footer-section-title">{t('lp.footer.telc.info')}</h4>
                <button className="lp-footer-link" onClick={() => navigate('/telc-info')}>{'>'} {t('lp.footer.telc.info')}</button>
                <button className="lp-footer-link" onClick={() => navigate('/privacy')}>{'>'} {t('lp.footer.privacy')}</button>
                <button className="lp-footer-link" onClick={() => navigate('/contact')}>{'>'} {t('lp.footer.contact')}</button>
              </nav>
              <div className="lp-footer-lang">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="lp-footer-bottom">
              <p className="lp-footer-copyright">{t('lp.footer.copyright')}</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
