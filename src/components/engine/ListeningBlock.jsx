import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Info, Headphones } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import './ListeningBlock.css';
import './engine.css';

// Import the interactive blocks for different question types
import NotesCompletionBlock from './InteractiveBlocks/NotesCompletionBlock';
import TableCompletionBlock from './InteractiveBlocks/TableCompletionBlock';
import ShortAnswerBlock from './InteractiveBlocks/ShortAnswerBlock';
import DiagramLabelBlock from './InteractiveBlocks/DiagramLabelBlock';
import MCQBlock from './InteractiveBlocks/MCQBlock';
import MatchingChoiceBlock from './InteractiveBlocks/MatchingChoiceBlock';

const ListeningBlock = ({ 
  data, 
  isMiniTest = false, 
  onQuestionIndexChange, 
  showCheckAnswers = false, 
  onCheckAnswers, 
  userAnswers = {}, 
  onUpdate = () => {}, 
  isReviewMode = false,
  // Parts tabs props
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const audioRef = useRef(null);
  const carouselRef = useRef(null);

  // Helper to get answer from either parent state (userAnswers) or local state (answers)
  const getAnswer = (qId) => {
    return userAnswers[qId] !== undefined ? userAnswers[qId] : answers[qId];
  };

  // Flatten all questions - expand blocks into individual questions
  const getAllQs = () => {
    if (data.sections) {
      const qs = [];
      data.sections.forEach(s => {
        if (s.questions) {
          s.questions.forEach(t => {
            if (t.questions && Array.isArray(t.questions)) {
              t.questions.forEach(q => qs.push({...q, parentType: t.type}));
            } else if (t.type === 'diagram-label' && t.labels && Array.isArray(t.labels)) {
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
              t.questions.forEach(q => qs.push({
                ...q,
                type: 'short-answer',
                parentType: 'short-answer',
                instruction: t.instruction,
                wordLimit: t.wordLimit || q.wordLimit,
                allowNumber: t.allowNumber !== undefined ? t.allowNumber : q.allowNumber
              }));
            } else if (t.type === 'notes-completion' && t.notes && Array.isArray(t.notes)) {
              t.notes.forEach(note => {
                if (note.type === 'gap') {
                  qs.push({
                    id: note.id,
                    type: 'notes-completion',
                    parentType: 'notes-completion',
                    text: note.label,
                    answer: note.answer,
                    instruction: t.instruction || `Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.`,
                    wordLimit: t.wordLimit || 2
                  });
                }
              });
            } else if (t.type) {
              qs.push({...t});
            }
          });
        }
      });
      return qs;
    } else if (data.questions) {
      const qs = [];
      data.questions.forEach(t => {
        if (t.questions && Array.isArray(t.questions)) {
          t.questions.forEach(q => qs.push({...q, parentType: t.type}));
        } else if (t.type === 'diagram-label' && t.labels && Array.isArray(t.labels)) {
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
          t.questions.forEach(q => qs.push({
            ...q,
            type: 'short-answer',
            parentType: 'short-answer',
            instruction: t.instruction,
            wordLimit: t.wordLimit || q.wordLimit,
            allowNumber: t.allowNumber !== undefined ? t.allowNumber : q.allowNumber
          }));
        } else if (t.type === 'notes-completion' && t.notes && Array.isArray(t.notes)) {
          t.notes.forEach(note => {
            if (note.type === 'gap') {
              qs.push({
                id: note.id,
                type: 'notes-completion',
                parentType: 'notes-completion',
                text: note.label,
                answer: note.answer,
                instruction: t.instruction || `Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.`,
                wordLimit: t.wordLimit || 2
              });
            }
          });
        } else if (t.type) {
          qs.push({...t});
        }
      });
      return qs;
    }
    return [];
  };
  const allQs = getAllQs();
  const totalQs = allQs.length;
  
  const isActive = useExamStore(state => state.isActive);

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
    // Update local state
    setAnswers({ ...answers, [qId]: value });
    // Also sync with parent state
    if (onUpdate) {
      onUpdate(qId, value);
    }
  };

  const renderQuestionBlock = (q) => {
    const qt = q.type || q.parentType;
    switch (qt) {
      case 'notes-completion':
        if (q.text && !q.notes) {
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction listening-instruction">
                {q.instruction || `Complete the notes. Write NO MORE THAN ${q.wordLimit || 2} WORDS AND/OR A NUMBER.`}
              </div>
              <div className="question-row">
                <span className="question-number">{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <input
                type="text"
                className="answer-input"
                placeholder={q.placeholder || "Type answer here..."}
                value={getAnswer(q.id) || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                disabled={false}
              />
            </div>
          );
        }
        return (
          <NotesCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={isReviewMode}
            hideInstruction={true}
          />
        );
      
      case 'table-completion':
        return (
          <TableCompletionBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={isReviewMode}
            hideInstruction={true}
          />
        );
      
      case 'short-answer':
        if (q.text && !q.questions) {
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction listening-instruction">
                {q.instruction || (q.wordLimit ? `Write NO MORE THAN ${q.wordLimit} WORDS${q.allowNumber ? ' AND/OR A NUMBER' : ''}` : 'Answer the question.')}
              </div>
              <div className="question-row">
                <span className="question-number">{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <input
                type="text"
                className="answer-input"
                placeholder={q.placeholder || "Type answer here..."}
                value={getAnswer(q.id) || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                disabled={false}
              />
            </div>
          );
        }
        return (
          <ShortAnswerBlock
            key={q.id}
            data={q}
            userAnswers={userAnswers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={isReviewMode}
            wordLimit={q.wordLimit}
            allowNumber={q.allowNumber}
            hideInstruction={true}
          />
        );
      
      case 'diagram-label':
        if (q.text && !q.labels) {
          return (
            <div key={q.id} className="question-card">
              <div className="question-instruction listening-instruction">
                {q.instruction || 'Label the diagram. Write NO MORE THAN TWO WORDS for each answer.'}
              </div>
              <div className="question-row">
                <span className="question-number">{q.id}.</span>
                <span>{q.text}</span>
              </div>
              <div className="options-flex">
                {(q.options || []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`option-button ${getAnswer(q.id) === opt ? 'selected' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <DiagramLabelBlock
            key={q.id}
            data={q}
            userAnswers={answers}
            onUpdate={(id, value) => updateAnswer(id, value)}
            isReviewMode={isReviewMode}
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
            isReviewMode={isReviewMode}
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
                  className={`option-button ${getAnswer(q.id) === opt ? 'selected' : ''}`}
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
          <div key={q.id} className="question-card unknown-type">
            <p>Unknown question type: {q.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="listening-container">
      <SplitPane
        content={
          <>
            {/* Part Title and Description - First */}
            {data.title && (
               <div className="invictus-content-header">
                {data.subtitle && (
                  <p className="invictus-content-subtitle">{data.subtitle}</p>
                )}
                <h2 className="invictus-content-title">{data.title}</h2>
                
                {data.description && (
                  <p className="listening-description">{data.description}</p>
                )}
              </div>
            )}


                

            {/* Audio Player Sticky Bar - After title */}
            <div className="audio-sticky-bar">
              <div className="player-controls">
                <button 
                  className="play-btn"
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{marginLeft: '2px'}} />}
                </button>
                
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                
                <Headphones size={18} className="headphones-icon" />
                <audio 
                  ref={audioRef} 
                  src={data.audioUrl} 
                  onTimeUpdate={handleTimeUpdate} 
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>

            {/* Support for Map/Diagram Labelling */}
            {data.imageUrl && (
              <div className="listening-diagram">
                <img src={data.imageUrl} alt="Exam Visual" />
              </div>
            )}

            {/* Pro-tip Box */}
            <div className="protip-box">
              <div className="protip-icon">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div className="protip-content">
                <h4 className="protip-title">Pro-tip for Listening</h4>
                <p className="protip-text">
                  Listen carefully to the entire recording. Answers often come in the order of questions.
                </p>
              </div>
            </div>
          </>
        }
        exercise={
          <div className="listening-exercise-panel">
            <div className="exercise-header">
              <h2 className="exercise-title">Questions {data.questionStart || 1}–{data.questionStart ? data.questionStart + totalQs - 1 : totalQs}</h2>
            </div>

            {/* Pink Instruction Box */}
            <div className="instruction-box">
              <div className="instruction-icon">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div className="instruction-content">
                <h3 className="instruction-title">Instructions</h3>
                <p className="instruction-text">
                  Listen to the audio and answer the questions. Write your answers as you listen.
                </p>
              </div>
            </div>

            {/* Question Carousel */}
            <QuestionCarousel 
              key={allQs.map(q => q.id).join('-')}
              questions={allQs} 
              renderQuestion={(q) => renderQuestionBlock(q)}
              onIndexChange={onQuestionIndexChange}
              showCheckAnswers={showCheckAnswers}
              onCheckAnswers={onCheckAnswers}
              isReviewMode={isReviewMode}
              sections={sections}
              activeSkillTab={activeSkillTab}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              setActivePassageIndex={setActivePassageIndex}
              setIsReviewMode={setIsReviewMode}
              availableSkills={availableSkills}
            />
          </div>
        }
      />
    </div>
  );
};

export default ListeningBlock;
