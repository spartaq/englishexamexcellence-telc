import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Headset, PenTool, Mic, Info, GraduationCap, Briefcase, Landmark } from 'lucide-react';
import './TELCExamDescription.css';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';

const ExamDescription = ({ onBack }) => {
  const hasBackHandler = typeof onBack === 'function';

  return (
    <>
      <SEO {...routeMeta('/telc-info')} />
    <div className="telc-hub-container">
      <header className="telc-hub-header">
        {hasBackHandler ? (
          <button 
            type="button"
            onClick={onBack} 
            className="btn-back-link" 
            style={{ marginBottom: '16px', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} /> Back
          </button>
        ) : (
          <Link 
            to="/telc/b2" 
            className="btn-back-link" 
            style={{ marginBottom: '16px', cursor: 'pointer', textDecoration: 'none', color: '#2563eb' }}
          >
            <ArrowLeft size={24} /> Back to TELC Hub
          </Link>
        )}
        <h2>About the TELC</h2>
      </header>

      <section className="intel-section">
        <div className="intel-header">
          <Info size={28} color="#2563eb" />
          <h2>The European Language Certificates (TELC)</h2>
        </div>
        
        <div className="info-content">
          <p>
            The European Language Certificates (TELC) represent a system of internationally recognised language examinations developed by telc gGmbH, a non-profit subsidiary of the German Adult Education Association (DVV). These certificates provide credible and objective proof of your language proficiency across various European languages, including English.
          </p>
          
          <h3>Alignment with the Common European Framework of Reference (CEFR)</h3>
          <p>
            All TELC exams are meticulously aligned with the Common European Framework of Reference for Languages (CEFR), established by the Council of Europe. This ensures that a TELC certificate accurately reflects your language skills at specific levels, from A1 (Beginner) to C2 (Proficient). The CEFR is a widely accepted international standard for describing language ability, making TELC certificates understandable and valued worldwide.
          </p>
          
          <h3>Practical, Communicative Approach</h3>
          <p>
            TELC exams are renowned for their practical and communicative approach. Rather than focusing on abstract grammatical knowledge, the tests assess your ability to use the language effectively in real-life situations. The examination tasks simulate authentic scenarios you might encounter in everyday life, work, or study, ensuring that your certified skills are genuinely applicable.
          </p>
        </div>
      </section>

      <section className="four-pillars-section">
        <div className="pillars-header">
          <h2>Comprehensive Skill Assessment</h2>
          <p>Each TELC exam rigorously evaluates all four core language competencies:</p>
        </div>

        <div className="pillar-grid">
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#fef2f2' }}>
              <BookOpen color="#e11d48" />
            </div>
            <h4>Reading</h4>
            <p>Your ability to understand written texts, from simple notices to complex articles.</p>
          </div>

          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#f0fdf4' }}>
              <Headset color="#16a34a" />
            </div>
            <h4>Listening</h4>
            <p>Your comprehension of spoken language in various contexts, such as conversations, announcements, and radio broadcasts.</p>
          </div>

          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#eff6ff' }}>
              <PenTool color="#2563eb" />
            </div>
            <h4>Writing</h4>
            <p>Your capacity to produce clear and coherent written texts, including emails, letters, and short essays.</p>
          </div>

          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#faf5ff' }}>
              <Mic color="#9333ea" />
            </div>
            <h4>Speaking</h4>
            <p>Your oral communication skills, including your ability to interact, express opinions, and describe experiences in a structured interview.</p>
          </div>
        </div>
      </section>

      <section className="recognition-section">
        <h2>International Recognition and Value</h2>
        <p>TELC certificates are widely recognised and respected by employers, educational institutions, and government bodies across Europe and beyond. They serve as official proof of language proficiency for a multitude of purposes:</p>
        
        <div className="recognition-grid">
          <div className="recognition-item">
            <GraduationCap size={24} color="#B71C1C" style={{ marginBottom: '0.5rem' }} />
            <h4>Academic Applications</h4>
            <p>For university admissions and study programs.</p>
          </div>

          <div className="recognition-item">
            <Briefcase size={24} color="#B71C1C" style={{ marginBottom: '0.5rem' }} />
            <h4>Professional Opportunities</h4>
            <p>For job applications and career advancement in international environments.</p>
          </div>

          <div className="recognition-item">
            <Landmark size={24} color="#B71C1C" style={{ marginBottom: '0.5rem' }} />
            <h4>Immigration and Citizenship</h4>
            <p>For official language requirements in various countries.</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ExamDescription;