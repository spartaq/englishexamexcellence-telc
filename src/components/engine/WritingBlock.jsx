import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import SplitPane from './SplitPane';
import './WritingBlock.css';
import './engine.css';

const WritingBlock = ({ 
  data, 
  onComplete, 
  isMiniTest = false,
  // Parts tabs props
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fontSize, setFontSize] = useState(18);

  const isActive = useExamStore((state) => state.isActive);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleCheckWriting = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('https://examsuccess.englishexamexercises.com/api/writing-review.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          essay: text,
          prompt: data.prompt,
          taskType: data.taskType 
        }),
      });

      const result = await response.json();
      const dataObj = Array.isArray(result) ? result[0] : result;
      setFeedback(dataObj);
    } catch (err) {
      console.error("Check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const progressPercentage = Math.min((wordCount / (data.targetWords || 150)) * 100, 100);
  const isMinimumMet = wordCount >= (data.targetWords || 150);

  // Calculate parts tabs visibility - use current section's skill
  const currentSkill = data?.skill || availableSkills[activeSkillTab];
  const skillSections = sections.filter(s => s.skill === currentSkill);
  const showPartsTabs = skillSections.length > 1;

  return (
    <div className="writing-container">
      <SplitPane
        content={
          <>
            {/* Task Header - Inside SplitPane like ReadingBlock */}
           {data.title && (
              <div className="invictus-content-header">
                <p className="invictus-content-subtitle">{data.subtitle}</p>
                <h2 className="invictus-content-title">{data.title}</h2>
                {data.description && <p className="invictus-content-description">{data.description}</p>}
              </div>
            )}

            <div className="writing-header">
              <div className="header-meta">
                <span className="task-label">IELTS Writing Task {data.taskType}</span>
                <span className={`word-count ${isMinimumMet ? 'goal-reached' : ''}`}>
                  {wordCount} / {data.targetWords || 150} Words
                </span>
              </div>
              <div className="momentum-track">
                <div className="momentum-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <div className="prompt-section">
              <div className="prompt-text">{data.prompt}</div>
              {data.bullets && (
                <ul className="prompt-bullets">
                  {data.bullets?.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        }
        exercise={
          <div className="writing-exercise-panel">
          <div className="invictus-question-column">
            {/* Rich Text Editor Toolbar */}
            <div className="editor-toolbar">
              <button className="toolbar-btn" title="Bold">
                <span className="material-symbols-outlined">format_bold</span>
              </button>
              <button className="toolbar-btn" title="Italic">
                <span className="material-symbols-outlined">format_italic</span>
              </button>
              <button className="toolbar-btn" title="Underline">
                <span className="material-symbols-outlined">format_underlined</span>
              </button>
              <div className="toolbar-divider"></div>
              <button className="toolbar-btn" title="Bullet List">
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </button>
              <button className="toolbar-btn" title="Undo">
                <span className="material-symbols-outlined">undo</span>
              </button>
              <div className="toolbar-spacer"></div>
              <button className="toolbar-btn" onClick={() => setFontSize(prev => Math.min(prev + 2, 28))} title="Increase Font Size">
                <span className="material-symbols-outlined">text_increase</span>
              </button>
              <button className="toolbar-btn" onClick={() => setFontSize(prev => Math.max(prev - 2, 14))} title="Decrease Font Size">
                <span className="material-symbols-outlined">text_decrease</span>
              </button>
            </div>

            {/* Text Area */}
            <textarea
              className="writing-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isChecking}
              placeholder="Start typing your response here..."
              spellCheck="false"
              style={{ fontSize: `${fontSize}px` }}
            />
            
            {/* Editor Footer */}
            <div className="editor-footer">
              <div className="word-count-indicator">
                <span className={`status-dot ${isMinimumMet ? 'status-good' : 'status-warning'}`}></span>
                <span className="word-count-label">Word Count: {wordCount}</span>
              </div>
              <span className="minimum-label">Minimum {data.targetWords || 150} Words</span>
              {!feedback ? (
          <button 
            className="submit-btn"
            disabled={wordCount < 10 || isChecking}
            onClick={handleCheckWriting}
          >
            {isChecking ? 'Checking...' : 'Get AI to Check My Writing'}
          </button>
        ) : (
          <button className="submit-btn primary" onClick={() => onComplete(text)}>
            Submit Response
          </button>
        )}
            </div>

            {/* Parts tabs */}
            {showPartsTabs && (
              <div className="carousel-parts-tabs">
                {skillSections.map((s, idx) => {
                  const partTitle = `Part ${idx + 1}`;
                  const sidx = sections.findIndex(sec => sec === s);
                  return (
                    <button 
                      key={idx} 
                      onClick={() => { 
                        if (setActiveSectionIndex) setActiveSectionIndex(sidx); 
                        if (setActivePassageIndex) setActivePassageIndex(0); 
                        if (setIsReviewMode) setIsReviewMode(false); 
                      }} 
                      className={`carousel-part-tab ${activeSectionIndex === sidx ? 'active' : ''}`}>
                      {partTitle}
                    </button>
                  );
                })}
              </div>
            )}

            {isChecking && (
              <div className="loading-overlay">
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>Analyzing your writing...</span>
                </div>
              </div>
            )}
          </div></div>

          
        }
      />

      {/* Feedback Display Area */}
      {feedback && (
        <div className="feedback-display">
          <div className="feedback-header">
            <h4>Examiner Review</h4>
            <div className="band-score">Band Score: {feedback.score}</div>
          </div>
          
          <div className="feedback-body">
            <p><strong>Comments:</strong> {feedback.comments}</p>
            
            {feedback?.corrections && typeof feedback.corrections === 'string' && (
              <div className="improvement-advice">
                <strong>Advice:</strong>
                <p>{feedback.corrections}</p>
              </div>
            )}

            {feedback?.corrections && Array.isArray(feedback.corrections) && feedback.corrections.length > 0 && (
              <div className="corrections-table-wrap">
                <h4>Specific Improvements:</h4>
                <table className="corrections-table">
                  <thead>
                    <tr>
                      <th>Original</th>
                      <th>Suggested</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.corrections.map((item, index) => (
                      <tr key={index}>
                        <td className="text-red">"{item.original}"</td>
                        <td className="text-green">"{item.suggested}"</td>
                        <td>{item.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      

    </div>
  );
};

export default WritingBlock;
