import React from 'react';
import { Zap, Clock, BookOpen, Mic, Headset, PenTool, Info } from 'lucide-react';
import './ExamStrategy.css'; // Import the stylesheet

const ExamStrategy = ({ activeTest, onSelectPath }) => {
  return (
    <div className="strategy-container">
      
      <header className="strategy-header">
        <h1>Mastering the {activeTest.title}</h1>
        <p>
          It’s not just a test of your English; it’s a test of your strategy and stamina. 
          Here is how we are going to beat it.
        </p>
      </header>

      <div className="path-grid">
        <div className="strategy-card highlight">
          <Zap size={40} color="#2563eb" />
          <h3>Daily Skill Training</h3>
          <p>
            <strong>The "Atom" Method.</strong> Perfect for your 15-minute daily session. 
            We isolate specific question types so you can build muscle memory without the burnout.
          </p>
          <button className="btn-base btn-primary" onClick={() => onSelectPath('atoms')}>
            Train Atoms
          </button>
        </div>

        <div className="strategy-card standard">
          <Clock size={40} color="#64748b" />
          <h3>Full Mock Exams</h3>
          <p>
            <strong>The Marathon.</strong> Sit for a full-length section. 
            Use this once a week to test your stamina and see where your Band Score currently stands.
          </p>
          <button className="btn-base btn-outline" onClick={() => onSelectPath('mocks')}>
            Take Full Mock
          </button>
        </div>
      </div>

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
                It’s not a reading test; it’s a <strong>hunting test</strong>. You have 3 long texts and 40 questions. 
              </p>
            </div>
          </div>

          {/* LISTENING */}
          <div className="pillar-item">
            <div className="icon-wrapper" style={{ background: '#f0fdf4' }}>
              <Headset color="#16a34a" />
            </div>
            <div className="pillar-content">
              <h4>Listening (30 Mins)</h4>
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
              <h4>Speaking (11-14 Mins)</h4>
              <p>
                Focus on <strong>fluency and range</strong>. Practice "The Long Turn" to speak for 2 minutes straight.
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

export default ExamStrategy;