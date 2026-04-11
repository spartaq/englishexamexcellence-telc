import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Headset, PenTool, Mic, Info } from 'lucide-react';
import './BrandTestHub.css';

const ExamDescription = ({ activeTest, onBack }) => {
  const hasBackHandler = typeof onBack === 'function';
  
  return (
    <div className="ielts-hub-container">
      
      <header className="ielts-hub-header">
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
        <h1>About the {activeTest?.title || 'TELC'}</h1>
        <p>
          Understanding the exam structure is the first step to mastering it.
          Here's what you need to know about each section.
        </p>
      </header>

      <section className="intel-section">
        <div className="intel-header">
          <Info size={28} color="#2563eb" />
          <h2>Exam Intel: The Four Pillars</h2>
        </div>

        <div className="pillar-grid">
          {/* READING */}
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#fef2f2' }}>
              <BookOpen color="#e11d48" />
            </div>
            <div className="pillar-content">
              <h4>Reading (60 Mins)</h4>
              <p>
                It's not a reading test; it's a <strong>hunting test</strong>. You have 3 long texts and 40 questions. 
              </p>
            </div>
          </div>

          {/* LISTENING */}
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#f0fdf4' }}>
              <Headset color="#16a34a" />
            </div>
            <div className="pillar-content">
              <h4>Listening (40 Mins)</h4>
              <p>
                The audio only plays <strong>once</strong>. You need to write while you listen. 
              </p>
            </div>
          </div>

          {/* WRITING */}
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#eff6ff' }}>
              <PenTool color="#2563eb" />
            </div>
            <div className="pillar-content">
              <h4>Writing (60 Mins)</h4>
              <p>
                Task 2 is worth double points. We teach <strong>rhetorical structure</strong> to guide the examiner.
              </p>
            </div>
          </div>

          {/* SPEAKING */}
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#faf5ff' }}>
              <Mic color="#9333ea" />
            </div>
            <div className="pillar-content">
              <h4>Speaking (15 Mins)</h4>
              <p>
                Focus on <strong>fluency and range</strong>. Practice to speak for 2 minutes straight.
              </p>
            </div>
          </div>
        </div>

        <div className="teacher-note">
          <h4>Teacher's Strategy Note:</h4>
          <p>
            "Most students fail because they try to do a full mock exam every day and get exhausted. 
            <strong>Don't do that.</strong> Spend 4 days a week on 'Atoms' and only 1 day on a 'Mock.'"
          </p>
        </div>
      </section>
    </div>
  );
};

export default ExamDescription;