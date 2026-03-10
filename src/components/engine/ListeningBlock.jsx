import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Info, Headphones } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import './engine.css';

// Import the interactive blocks for different question types
import NotesCompletionBlock from './InteractiveBlocks/NotesCompletionBlock';
import TableCompletionBlock from './InteractiveBlocks/TableCompletionBlock';
import ShortAnswerBlock from './InteractiveBlocks/ShortAnswerBlock';
import DiagramLabelBlock from './InteractiveBlocks/DiagramLabelBlock';
import MCQBlock from './InteractiveBlocks/MCQBlock';
import MatchingChoiceBlock from './InteractiveBlocks/MatchingChoiceBlock';

const ListeningBlock = ({ data, onComplete, isMiniTest = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const audioRef = useRef(null);
  const carouselRef = useRef(null);

  // Flatten all questions - expand blocks into individual questions
  const getAllQs = () => {
    if (data.sections) {
      const qs = [];
      data.sections.forEach(s => {
        if (s.questions) {
          s.questions.forEach(t => {
            // Check if it's nested (has t.questions) or flat (t is directly a question)
            if (t.questions && Array.isArray(t.questions)) {
              // Nested structure: expand each question
              t.questions.forEach(q => qs.push({...q, parentType: t.type}));
            } else if (t.type === 'diagram-label' && t.labels && Array.isArray(t.labels)) {
              // Expand diagram-label: each label becomes a separate question
              t.labels.forEach(label => qs.push({
                id: label.id,
                type: 'diagram-label',
                parentType: 'diagram-label',
                text: label.text,
                answer: label.answer,
                instruction: t.instruction,
                options: t.options,
                diagram: t.diagram
              }));
            } else if (t.type === 'short-answer' && t.questions && Array.isArray(t.questions)) {
              // Expand short-answer: each question becomes a separate slide
              t.questions.forEach(q => qs.push({
                ...q,
                type: 'short-answer',
                parentType: 'short-answer',
                instruction: t.instruction,
                wordLimit: t.wordLimit || q.wordLimit,
                allowNumber: t.allowNumber !== undefined ? t.allowNumber : q.allowNumber
              }));
            } else if (t.type === 'notes-completion' && t.notes && Array.isArray(t.notes)) {
              // Expand notes-completion: each note with type='gap' becomes a separate question
              t.notes.forEach(note => {
                if (note.type === 'gap') {
                  qs.push({
                    id: note.id,
                    type: 'notes-completion',
                    parentType: 'notes-completion',
                    text: note.label, // Use 'label' not 'text'
                    answer: note.answer,
                    instruction: t.instruction || `Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.`,
                    wordLimit: t.wordLimit || 2
                  });
                }
              });
            } else if (t.type) {
              // Flat structure: t is directly a question with its own type
              qs.push({...t});
            }
          });
        }
      });
      return qs;
    } else if (data.questions) {
      const qs = [];
      data.questions.forEach(t => {
        // Check if it's nested (has t.questions) or flat (t is directly a question)
        if (t.questions && Array.isArray(t.questions)) {
          // Nested structure: expand each question
          t.questions.forEach(q => qs.push({...q, parentType: t.type}));
        } else if (t.type === 'diagram-label' && t.labels && Array.isArray(t.labels)) {
          // Expand diagram-label: each label becomes a separate question
          t.labels.forEach(label => qs.push({
            id: label.id,
            type: 'diagram-label',
            parentType: 'diagram-label',
            text: label.text,
            answer: label.answer,
            instruction: t.instruction,
            options: t.options,
            diagram: t.diagram
          }));
        } else if (t.type === 'short-answer' && t.questions && Array.isArray(t.questions)) {
          // Expand short-answer: each question becomes a separate slide
          t.questions.forEach(q => qs.push({
            ...q,
            type: 'short-answer',
            parentType: 'short-answer',
            instruction: t.instruction,
            wordLimit: t.wordLimit || q.wordLimit,
            allowNumber: t.allowNumber !== undefined ? t.allowNumber : q.allowNumber
          }));
        } else if (t.type === 'notes-completion' && t.notes && Array.isArray(t.notes)) {
          // Expand notes-completion: each note with type='gap' becomes a separate question
          t.notes.forEach(note => {
            if (note.type === 'gap') {
              qs.push({
                id: note.id,
                type: 'notes-completion',
                parentType: 'notes-completion',
                text: note.label, // Use 'label' not 'text'
                answer: note.answer,
                instruction: t.instruction || `Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.`,
                wordLimit: t.wordLimit || 2
              });
            }
          });
        } else if (t.type) {
          // Flat structure
          qs.push({...t});
        }
      });
      return qs;
    }
    return [];
  };
  const allQs = getAllQs();
  const totalQs = allQs.length;
  
  // Anti-Gaming: Track focus state from global store
  const isActive = useExamStore(state => state.isActive);

  // Auto-pause if the user leaves the tab
  useEffect(() => {
    if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current?.duration) return;
    const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(p);
  };

  const updateAnswer = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  // Render the appropriate block based on question type
  const renderQuestionBlock = (q) => {
    const qt = q.type || q.parentType;
    switch (qt) {
      case 'notes-completion':
        // Check if it's an expanded single question (has text but no notes array)
        if (q.text && !q.notes) {
          // Single note - render inline input
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction" style={{ marginBottom: '10px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', fontSize: '13px' }}>
                {q.instruction || `Complete the notes. Write NO MORE THAN ${q.wordLimit || 2} WORDS AND/OR A NUMBER.`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, minWidth: '30px' }}>{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <input
                type="text"
                className="answer-input"
                placeholder={q.placeholder || "Type answer here..."}
                value={answers[q.id] || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                disabled={false}
              />
            </div>
          );
        }
        // Original block with notes array
        return (
          <NotesCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      
      case 'table-completion':
        // Keep table-completion as a single block (not expanded)
        return (
          <TableCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      
      case 'short-answer':
        // Check if it's an expanded single question (has text but no questions array)
        if (q.text && !q.questions) {
          // Single question - render inline
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction" style={{ marginBottom: '10px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', fontSize: '13px' }}>
                {q.instruction || (q.wordLimit ? `Write NO MORE THAN ${q.wordLimit} WORDS${q.allowNumber ? ' AND/OR A NUMBER' : ''}` : 'Answer the question.')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, minWidth: '30px' }}>{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <input
                type="text"
                className="answer-input"
                placeholder={q.placeholder || "Type answer here..."}
                value={answers[q.id] || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                disabled={false}
              />
            </div>
          );
        }
        // Original block with questions array
        return (
          <ShortAnswerBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
            wordLimit={q.wordLimit}
            allowNumber={q.allowNumber}
            hideInstruction={true}
          />
        );
      
      case 'diagram-label':
        // Check if it's an expanded single label (has text but no labels array)
        if (q.text && !q.labels) {
          // Single label - render inline
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction" style={{ marginBottom: '10px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', fontSize: '13px' }}>
                {q.instruction || 'Label the diagram. Write NO MORE THAN TWO WORDS for each answer.'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, minWidth: '30px' }}>{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(q.options || []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`option-button ${answers[q.id] === opt ? 'selected' : ''}`}
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        // Original block with labels array
        return (
          <DiagramLabelBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={false}
            hideInstruction={true}
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
            hideInstruction={true}
          />
        );
      
      case 'mcq':
        return (
          <div key={q.id} className="question-card">
            <p className="question-text">{q.question}</p>
            <div className="options-list">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => updateAnswer(q.id, opt)}
                  className={`option-button ${answers[q.id] === opt ? 'selected' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'gap-fill':
        return (
          <div key={q.id} className="question-card">
            <label className="question-label">{q.label}</label>
            <input 
              type="text" 
              className="answer-input"
              placeholder={q.placeholder || "Your answer..."}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            />
          </div>
        );
      
      default:
        return (
          <div key={q.id} className="question-card" style={{ 
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
      {/* 1. STICKY AUDIO PLAYER - Full width on both desktop and mobile */}
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

      {/* 2. SPLIT PANE CONTENT AREA */}
      <SplitPane
        content={
          <div className="listening-content">
            {/* Skill Label */}
            <div className="vocab-top-section" style={{ marginBottom: '16px' }}>
              <span className="task-label">
                🎧 Listening
              </span>
            </div>

            {/* Part Title and Description */}
            {!isMiniTest && (
              <div className="test-block-header" style={{ marginBottom: '24px' }}>
                <h2 className="test-block-title">
                  {data.title || data.mockTitle || `Part ${data.part || 1}`}
                </h2>
                {data.subtitle && (
                  <p className="test-block-subtitle">{data.subtitle}</p>
                )}
                {data.description && (
                  <p className="test-block-description">{data.description}</p>
                )}
              </div>
            )}

            {/* Support for Map/Diagram Labelling */}
            {data.imageUrl && (
              <div className="listening-diagram">
                <img src={data.imageUrl} alt="Exam Visual" />
              </div>
            )}
          </div>
        }
        exercise={
          <QuestionCarousel 
            questions={allQs} 
            renderQuestion={(q) => renderQuestionBlock(q)}
          />
        }
      />

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
