import React from 'react';
import {
  BookOpen, Search, Mic, Headset, PenTool, FileText, Target, Languages, Clock
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

  const skillSections = [
    { id: 'reading', icon: BookOpen, key: 'hub.skill.reading', color: 'var(--lp-primary)' },
    { id: 'listening', icon: Headset, key: 'hub.skill.listening', color: 'var(--lp-primary)' },
    { id: 'writing', icon: PenTool, key: 'hub.skill.writing', color: 'var(--lp-primary)' },
    { id: 'speaking', icon: Mic, key: 'hub.skill.speaking', color: 'var(--lp-primary)' },
    { id: 'language-elements', icon: FileText, key: 'hub.skill.lang.elem', color: 'var(--lp-accent)' },
    { id: 'vocabulary', icon: Languages, key: 'hub.skill.vocabulary', color: 'var(--lp-accent)' },
  ];

  const levelDesc = level === 'b1' ? t('lp.level.b1.desc')
    : level === 'c1' ? t('lp.level.c1.desc')
    : t('lp.level.b2.desc');

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
        {/* Hero — single column, welcome not pitch */}
        <header className="hub-hero">
          <div className="hub-hero-inner">
            <div className="hub-hero-eyebrow">{levelBadge}</div>
            <h1 className="hub-hero-title">
              {levelTitle}
            </h1>
            <p className="hub-hero-subtext">
              {levelDesc || t('hero.subtitle')}
            </p>
            <div className="hub-hero-actions">
              <button className="hub-btn-primary" onClick={() => onSelectPath(singleExercisePath)}>
                {t('hub.jump.in')}
              </button>
            </div>
          </div>
        </header>

        {/* Practice tools — Vocabulary + Drills */}
        <section className="hub-tools">
          <div className="hub-tools-inner">
            <h2 className="hub-tools-heading">{t('hub.real.solution')}</h2>
            <p className="hub-tools-lead">{t('hub.real.solution.desc')}</p>
            <div className="hub-tools-grid">
              {EXTRA_TOOLS && EXTRA_TOOLS.map(tool => {
                const hubKey = tool && typeof tool.hubKey === 'string' && tool.hubKey.trim() ? tool.hubKey : null;
                const titleKey = tool.hubKey === 'vocabulary' ? 'tool.vocab.title' : 'tool.drillshub.title';
                const descKey = tool.hubKey === 'vocabulary' ? 'tool.vocab.desc' : 'tool.drillshub.desc';
                return (
                  <div
                    key={tool.id}
                    className="hub-tool-card"
                    onClick={() => {
                      if (hubKey && typeof onSelectModule === 'function') {
                        const levelToPass = ['vocabulary', 'drillshub'].includes(hubKey) ? level : null;
                        onSelectModule(hubKey, levelToPass);
                      } else {
                        console.warn('[BrandTestHub] onSelectModule called with invalid tool.hubKey', tool);
                      }
                    }}
                  >
                    <div className="hub-tool-image">
                      <img
                        className="hub-tool-image-img"
                        src={tool.image}
                        alt={t(titleKey)}
                        decoding="async"
                      />
                    </div>
                    <div className="hub-tool-icon">{React.cloneElement(tool.icon, { size: 24 })}</div>
                    <h3 className="hub-tool-title">{t(titleKey)}</h3>
                    <p className="hub-tool-desc">{t(descKey)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Skills practice — six skills */}
        <section className="hub-skills">
          <div className="hub-skills-inner">
            <h2 className="hub-skills-heading">{t('hub.practice.skills')}</h2>
            <p className="hub-skills-lead">{t('hub.practice.part')}</p>
            <div className="hub-skills-grid">
              {skillSections.map((skill) => (
                <button
                  key={skill.id}
                  className="hub-skill-btn"
                  onClick={() => onStartSkill && onStartSkill(skill.id, level)}
                  disabled={!onStartSkill}
                  aria-disabled={!onStartSkill}
                >
                  <div className="hub-skill-icon">{React.createElement(skill.icon, { size: 20 })}</div>
                  <span className="hub-skill-label">{t(skill.key)}</span>
                </button>
              ))}
            </div>
            <p className="hub-skills-note">{t('desc.target.skills')}</p>
          </div>
        </section>

        {/* Mock tests list */}
        <section className="hub-mocks">
          <div className="hub-mocks-inner">
            <div className="hub-mocks-header">
              <h2 className="hub-mocks-heading">{t('dual.take.exam')}</h2>
              <div className="hub-mocks-actions">
                <div className="hub-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder={t('controls.search.mocks')}
                    aria-label="Search mocks by number or title"
                  />
                </div>
              </div>
            </div>
            <div className="hub-mock-list">
              {filteredMocks.map(mock => (
                <div
                  key={mock.id}
                  className="hub-mock-item"
                  onClick={() => onSelectPath(mock.id)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPath(mock.id);
                    }
                  }}
                >
                  <div className="hub-mock-header-band">
                    <span className="hub-mock-header-title">{mock.title}</span>
                  </div>
                  <div className="hub-mock-info">
                    <div className="hub-mock-meta">
                      <span>{mock.description}</span>
                    </div>
                  </div>
                  <span className="hub-mock-link">{t('controls.start.mock')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="hub-enter">
          <div className="hub-enter-inner">
            <h2 className="hub-enter-heading">{t('lp.enter.heading')}</h2>
            <p className="hub-enter-desc">{t('lp.enter.desc')}</p>
            <button className="hub-btn-primary" onClick={() => onSelectPath(singleExercisePath)}>
              {t('hub.jump.in')}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BrandTestHub;
