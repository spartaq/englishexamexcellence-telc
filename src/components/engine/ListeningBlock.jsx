import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Info, Headphones } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import './engine.css';

// Import the interactive blocks for different question types
import NotesCompletionBlock from './InteractiveBlocks/NotesCompletionBlock';
import TableCompletionBlock from './InteractiveBlocks/TableCompletionBlock';
import ShortAnswerBlock from './InteractiveBlocks/ShortAnswerBlock';
import DiagramLabelBlock from './InteractiveBlocks/DiagramLabelBlock';
import MCQBlock from './InteractiveBlocks/MCQBlock';
import MatchingChoiceBlock from './InteractiveBlocks/MatchingChoiceBlock';

const ListeningBlock = ({ data, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const audioRef = useRef(null);
  
  // Anti-Gaming: Track focus state from global store
  const isActive = useExamStore(state => state.isActive);

  // Auto-pause if the user leaves the tab
  useEffect(() => {
    if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive]);

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(p);
  };

  const updateAnswer = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  // Render the appropriate block based on question type
  const renderQuestionBlock = (q) => {
    switch (q.type) {
      case 'notes-completion':
        return (
          <NotesCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
          />
        );
      
      case 'table-completion':
        return (
          <TableCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
          />
        );
      
      case 'short-answer':
        return (
          <ShortAnswerBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
            wordLimit={q.wordLimit}
            allowNumber={q.allowNumber}
          />
        );
      
      case 'diagram-label':
        return (
          <DiagramLabelBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
          />
        );
      
      case 'matching-choice':
        return (
          <MatchingChoiceBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
          />
        );
      
      case 'mcq':
        return (
          <div key={q.id} className="listening-q-card">
            <p className="listening-q-question">{q.question}</p>
            <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => updateAnswer(q.id, opt)}
                  className={`listening-q-option ${answers[q.id] === opt ? 'selected' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'gap-fill':
        return (
          <div key={q.id} className="listening-q-card">
            <label className="listening-q-label">{q.label}</label>
            <input 
              type="text" 
              className="standard-input"
              placeholder={q.placeholder || "Your answer..."}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #f1f5f9', outline: 'none' }}
            />
          </div>
        );
      
      default:
        return (
          <div key={q.id} className="listening-q-card" style={{ 
            background: '#fff7ed', 
            border: '1px solid #fed7aa'
          }}>
            <p style={{ fontSize: '14px', color: '#9a3412' }}>
              Unknown question type: {q.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="listening-container">
      {/* 1. STICKY AUDIO PLAYER */}
      <div className="audio-sticky-bar">
        <div className="player-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="play-btn" 
            onClick={isPlaying ? handlePause : handlePlay}
            style={{ 
              width: '40px', height: '40px', borderRadius: '50%', border: 'none', 
              background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{marginLeft: '2px'}} />}
          </button>
          
          <div className="progress-container" style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
            <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.1s linear' }} />
          </div>
          
          <Headphones size={18} color="#94a3b8" />
        </div>
        <audio 
          ref={audioRef} 
          src={data.audioUrl} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* 2. CONTENT AREA */}
      <div className="listening-content">
        {/* Skill Label */}
        <div className="vocab-top-section" style={{ marginBottom: '16px' }}>
          <span className="task-label">
            🎧 Listening Practice
          </span>
        </div>

        {/* Part Title and Description */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="listening-title">
            {data.title || data.mockTitle || `Part ${data.part}` || 'Listening Practice'}
          </h2>
          {data.subtitle && (
            <p className="listening-subtitle">{data.subtitle}</p>
          )}
          {data.description && (
            <p className="listening-description">{data.description}</p>
          )}
        </div>

        {/* Support for Map/Diagram Labelling */}
        {data.imageUrl && (
          <div className="listening-diagram">
            <img src={data.imageUrl} alt="Exam Visual" />
          </div>
        )}

        {/* QUESTIONS LIST - Now renders appropriate blocks */}
        <div className="questions-list">
          {data.sections ? (
            // Full listening mock with multiple sections
            data.sections.map((section) => (
              <div key={section.id} className="listening-section">
                {section.questions?.map((q) => renderQuestionBlock(q))}
              </div>
            ))
          ) : (
            // Single listening section
            data.questions?.map((q) => renderQuestionBlock(q))
          )}
        </div>
      </div>

      {/* 3. ACTION FOOTER */}
      <div className="listening-footer">
        <button 
          className="btn-primary" 
          onClick={() => onComplete(answers)}
          style={{ width: '100%' }}
        >
          Submit All Answers
        </button>
      </div>
    </div>
  );
};

export default ListeningBlock;
