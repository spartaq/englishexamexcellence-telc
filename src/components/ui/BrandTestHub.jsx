import React from 'react';
import {
  BookOpen, Search, Mic, Headset, PenTool, FileText
} from 'lucide-react';

import { telcMocks } from '../../data/TELC/mocks';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';
import { useLanguage } from '../../contexts/LanguageContext';

import './BrandTestHub.css';

const SITE_URL = 'https://telc.englishexamexercises.com';

const BrandTestHub = ({
  onSelectPath,
  onSelectModule,
  onStartSkill,
  EXTRA_TOOLS,
  level = null,
}) => {
  const { t } = useLanguage();

  // Filter mocks by level if specified
  const filteredMocks = level
    ? Object.values(telcMocks).filter(m => m.level === level)
    : Object.values(telcMocks);

  // Level-specific title and badge
  const levelTitle = level ? `TELC ${level.toUpperCase()}` : 'TELC';
  const levelBadge = level ? `TELC ${level.toUpperCase()}` : 'TELC';
  const singleExercisePath = level ? `telc-${level}-single-exercise` : 'telc-b2-single-exercise';

  const hubMeta = routeMeta(`/telc/${level || 'b2'}`);

  return (
    <>
      <SEO
        title={hubMeta.title}
        description={hubMeta.description}
        schemaBlock={{
          course: {
            level: level ? level.toUpperCase() : 'B2',
            title: `${levelTitle} Exam Hub`,
            description: hubMeta.description,
            url: `${SITE_URL}/telc/${level || 'b2'}`,
          },
        }}
      />
      <div className="hub-container">

        {/* --- 1. WELCOME HERO SECTION --- */}
        <header className="hero-banner">
          <div>
            <span className="hero-badge">{levelBadge}</span>
            <h2 className="hero-title">{`${levelTitle} Exam`}</h2>
            <p className="hero-subtitle">{t('hub.welcome')}</p>
          </div>
          <div className="hero-content">
            {/* TEACHER'S MESSAGE */}
            <div className="header-note">
              <h2>{t('hub.welcome')}</h2>
              <p>{t('hub.exams')}</p>
              <p>{t('hub.skills')}</p>
              <div className="hero-actions">
                <button className="btn-white" onClick={() => onSelectPath(singleExercisePath)}>
                  {t('hub.jump.in')}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- 2. TRAINING VS TESTING SECTION --- */}
        <div className="section-header">
          <h2 className="section-title">{t('hub.real.solution')}</h2>
          <p style={{ color: 'var(--text-primary)', fontSize: '15px', marginTop: '4px' }}>
            {t('hub.real.solution.desc')}
          </p>
        </div>

        <div className="precision-grid">
          {EXTRA_TOOLS && EXTRA_TOOLS.map(tool => {
            const hubKey = tool && typeof tool.hubKey === 'string' && tool.hubKey.trim() ? tool.hubKey : null;
            const validHex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(tool?.color);
            const background = validHex ? `${tool.color}15` : 'rgba(15, 23, 42, 0.08)';
            const iconContent = React.isValidElement(tool.icon) ? React.cloneElement(tool.icon, { size: 24 }) : null;
            const titleKey = tool.hubKey === 'vocabulary' ? 'tool.vocab.title' : 'tool.drillshub.title';
            const descKey = tool.hubKey === 'vocabulary' ? 'tool.vocab.desc' : 'tool.drillshub.desc';

            return (
              <div
                key={tool.id}
                className="quick-card"
                onClick={() => {
                  if (hubKey && typeof onSelectModule === 'function') {
                    const levelToPass = ['vocabulary', 'drillshub'].includes(hubKey) ? level : null;
                    onSelectModule(hubKey, levelToPass);
                  } else {
                    console.warn('[BrandTestHub] onSelectModule called with invalid tool.hubKey', tool);
                  }
                }}
              >
                <div className="quick-icon-box" style={{ background, color: validHex ? tool.color : '#0f172a' }}>
                  {iconContent}
                </div>
                <h3 className="skills-title">{t(titleKey)}</h3>
                <p className="skills-meta">{t('hub.skill.building')}</p>
                <p className="skills-description">{t(descKey)}</p>
              </div>
            );
          })}
        </div>

        {/* --- 3. CHECK PROGRESS & SKILL PRACTICE (SIDE BY SIDE) --- */}
        <div className="dual-section-container">
          <div className="dual-section-box">
            <div className="section-header">
              <h2 className="section-title">{t('dual.take.exam')}</h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>{t('dual.take.test')}</p>
            </div>

            <div className="archive-controls">
              <div className="search-input-wrapper">
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '18px', color: '#94a3b8' }} />
                <input type="text" placeholder={t('controls.search.mocks')} aria-label="Search mocks by number or title" />
              </div>
              <div className="filter-tabs">
                <button className="filter-tab active">{t('controls.all.mocks')}</button>
                <button className="filter-tab">{t('controls.bronze')}</button>
                <button className="filter-tab">{t('controls.gold')}</button>
              </div>
            </div>

            <div className="exam-list-scroll">
              {filteredMocks.map(mock => (
                <div key={mock.id} className="exam-list-item">
                  <div className="exam-info">
                    <div className="exam-title">{mock.title}</div>
                    <div className="exam-meta">
                      <span className={`tier-text ${mock.tier}`}>{mock.tier.toUpperCase()} TIER</span>
                    </div>
                  </div>

                  <button
                    className="btn-start-exam"
                    onClick={() => {
                      console.log('[BrandTestHub] Calling onSelectPath with path:', mock.id);
                      onSelectPath(mock.id);
                    }}
                  >
                    {t('controls.start.mock')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="dual-section-box">
            <div className="section-header">
              <h2 className="section-title">{t('dual.practice.skills')}</h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>
                {t('dual.practice.part')}
              </p>
            </div>

            <div className="inline-skill-grid">
              <button
                className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
                onClick={() => onStartSkill && onStartSkill('reading', level)}
                disabled={!onStartSkill}
                aria-disabled={!onStartSkill}
              >
                <BookOpen size={20} />
                <span>{t('skill.reading')}</span>
              </button>
              <button
                className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
                onClick={() => onStartSkill && onStartSkill('language-elements', level)}
                disabled={!onStartSkill}
                aria-disabled={!onStartSkill}
              >
                <FileText size={20} />
                <span>{t('skill.lang.elem')}</span>
              </button>
              <button
                className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
                onClick={() => onStartSkill && onStartSkill('listening', level)}
                disabled={!onStartSkill}
                aria-disabled={!onStartSkill}
              >
                <Headset size={20} />
                <span>{t('skill.listening')}</span>
              </button>
              <button
                className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
                onClick={() => onStartSkill && onStartSkill('speaking', level)}
                disabled={!onStartSkill}
                aria-disabled={!onStartSkill}
              >
                <Mic size={20} />
                <span>{t('skill.speaking')}</span>
              </button>
              <button
                className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
                onClick={() => onStartSkill && onStartSkill('writing', level)}
                disabled={!onStartSkill}
                aria-disabled={!onStartSkill}
              >
                <PenTool size={20} />
                <span>{t('skill.writing')}</span>
              </button>
            </div>

            <p className="exam-description">
              {t('desc.target.skills')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandTestHub;