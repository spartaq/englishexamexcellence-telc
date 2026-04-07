import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * NotesCompletionBlock - IELTS Type 9: Notes Completion
 * 
 * Complete a set of notes using words from text or from a word list.
 * Word limit applies (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER")
 */
const NotesCompletionBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false,
  hideInstruction = false
}) => {
  const { 
    title,
    notes = [], 
    questions = [], // Support questions array directly for listening format
    wordLimit = 2,
    wordList = null, // If provided, uses dropdown instead of text input
    instruction = `Complete the notes below. Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`
  } = data;

  // Support questions array - convert to notes format for compatibility
  const normalizedNotes = questions.length > 0 && notes.length === 0
    ? questions.map((q, idx) => ({
        id: String(q.id || idx + 1),
        type: 'gap',
        label: q.text,
        answer: q.answer,
        wordLimit: q.wordLimit || wordLimit,
        allowNumber: q.allowNumber !== undefined ? q.allowNumber : true
      }))
    : notes;

  // Word count validation
  const countWords = (text) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };

  const isOverLimit = (text, limit = wordLimit) => {
    return countWords(text) > limit;
  };

  // Normalize answer for comparison
  const normalizeAnswer = (text) => {
    if (!text) return '';
    return text.trim().toLowerCase();
  };

  const handleInputChange = (noteId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(noteId, value);
  };

  // Render a single note item
  const renderNoteItem = (note, depth = 0) => {
    const isGap = note.type === 'gap';
    const userAnswer = userAnswers[note.id] || '';
    const correctAnswer = note.answer || '';
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    const isWrong = userAnswer && !isCorrect;
    const isMissing = isReviewMode && !userAnswer;
    const noteWordLimit = note.wordLimit || wordLimit;
    const overLimit = isOverLimit(userAnswer, noteWordLimit);

    // Indentation for nested items
    const indentStyle = {
      marginLeft: `${depth * 24}px`
    };

    // Bullet style based on depth
    const getBullet = () => {
      if (note.bullet) return note.bullet;
      if (depth === 0) return '●';
      if (depth === 1) return '○';
      return '▪';
    };

    return (
      <div 
        key={note.id}
        className={`note-item ${isGap && isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
        style={{
          ...indentStyle,
          marginBottom: '12px',
          padding: isGap ? '12px 16px' : '4px 0',
          borderRadius: isGap ? '10px' : '0',
          border: isGap ? '2px solid' : 'none',
          borderColor: isGap 
            ? (isReviewMode 
                ? (isCorrect ? '#10b981' : '#ef4444')
                : overLimit ? '#f59e0b' : '#e2e8f0')
            : 'transparent',
          background: isGap 
            ? (isReviewMode 
                ? (isCorrect ? '#f0fdf4' : '#fef2f2')
                : overLimit ? '#fffbeb' : '#fafafa')
            : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Bullet point */}
          {!isGap && (
            <span style={{
              color: '#94a3b8',
              fontSize: '12px',
              marginTop: '4px'
            }}>
              {getBullet()}
            </span>
          )}

          {/* Note ID badge for gaps */}
          {isGap && (
            <div style={{
              minWidth: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isReviewMode 
                ? (isCorrect ? '#10b981' : '#ef4444')
                : 'var(--lab-indigo)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
              flexShrink: 0
            }}>
              {isReviewMode ? (
                isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />
              ) : note.id}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1 }}>
            {/* Label/text before gap */}
            {note.label && (
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                marginRight: '8px'
              }}>
                {note.label}
              </span>
            )}

            {/* Gap input */}
            {isGap ? (
              <div style={{ marginTop: note.label ? '8px' : '0' }}>
                {wordList ? (
                  /* Dropdown mode */
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={userAnswer}
                      onChange={(e) => handleInputChange(note.id, e.target.value)}
                      disabled={isReviewMode}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: isReviewMode 
                          ? (isCorrect ? '#10b981' : '#ef4444')
                          : '#cbd5e1',
                        background: 'white',
                        fontWeight: 600,
                        cursor: isReviewMode ? 'default' : 'pointer'
                      }}
                    >
                      <option value="">Select...</option>
                      {wordList.map((word, idx) => (
                        <option key={idx} value={word}>{word}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* Text input mode */
                  <div>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => handleInputChange(note.id, e.target.value)}
                      disabled={isReviewMode}
                      placeholder={isReviewMode ? '' : `${wordLimit} words max`}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: '6px',
                        background: isReviewMode ? 'transparent' : 'white',
                        fontWeight: isReviewMode ? 700 : 500,
                        color: isReviewMode 
                          ? (isCorrect ? '#065f46' : '#991b1b')
                          : '#1e293b',
                        outline: 'none'
                      }}
                    />
                    {/* Word count */}
                    {!isReviewMode && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: overLimit ? '#f59e0b' : '#94a3b8',
                        marginTop: '4px',
                        textAlign: 'right'
                      }}>
                        {countWords(userAnswer)}/{noteWordLimit} words
                      </div>
                    )}
                  </div>
                )}

                {/* Correct answer hint */}
                {isReviewMode && (isWrong || isMissing) && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#059669',
                    fontWeight: 600,
                    background: '#ecfdf5',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                  </div>
                )}
              </div>
            ) : (
              /* Static text */
              <span style={{
                fontSize: '14px',
                fontWeight: note.bold ? 700 : 500,
                color: note.bold ? '#1e293b' : '#475569'
              }}>
                {note.text}
              </span>
            )}
          </div>
        </div>

        {/* Render nested children */}
        {note.children && note.children.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {note.children.map(child => renderNoteItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render section with heading
  const renderSection = (section, index) => {
    // Handle both section format {heading, items} and direct note format {id, type, label}
    const isSectionFormat = section.items !== undefined;
    
    // If it's a direct note item (not a section), render it as a note
    if (!isSectionFormat) {
      return renderNoteItem(section);
    }
    
    return (
      <div 
        key={index}
        className="notes-section"
        style={{
          marginBottom: '24px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Section heading */}
        {section.heading && (
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '15px',
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            {section.heading}
          </h4>
        )}

        {/* Section notes */}
        <div className="notes-list">
          {section.items.map(note => renderNoteItem(note))}
        </div>
      </div>
    );
  };

  // Check if notes is a flat array of items or array of sections
  const isFlatArray = normalizedNotes.length > 0 && normalizedNotes[0].type !== undefined && normalizedNotes[0].items === undefined;

  return (
    <div className="notes-completion-block" style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 800,
          color: '#0f172a',
          margin: 0
        }}>
          {title || 'Notes Completion'}
        </h3>
        {isReviewMode && (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--lab-indigo)',
            textTransform: 'uppercase',
            background: '#eef2ff',
            padding: '4px 10px',
            borderRadius: '100px'
          }}>
            Review Mode
          </span>
        )}
      </div>

      {/* Instruction */}
      {!hideInstruction && (
      <div className="question-instruction">
        {instruction}
      </div>
      )}

      {/* Word List (if provided) */}
      {wordList && (
        <div style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ 
            margin: '0 0 10px 0', 
            fontSize: '12px', 
            fontWeight: 700, 
            color: '#64748b',
            textTransform: 'uppercase'
          }}>
            Word List
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {wordList.map((word, idx) => (
              <span 
                key={idx}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes sections */}
      <div className="notes-container">
        {isFlatArray 
          ? normalizedNotes.map((note, index) => renderSection(note, index))
          : normalizedNotes.map((section, index) => renderSection(section, index))
        }
      </div>
    </div>
  );
};

export default NotesCompletionBlock;

