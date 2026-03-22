import React from 'react';
import './engine.css';

/**
 * SplitPane - Unified layout component for desktop exercises
 * 
 * Implements the split-pane layout from LAYOUT README:
 * - Desktop (>768px): Content on left, Exercise carousel on right
 * - Mobile (≤768px): Stacked vertically
 * 
 * @param {React.ReactNode} content - Left pane content (reading text, prompts, etc.)
 * @param {React.ReactNode} exercise - Right pane content (questions, editor, recording)
 * @param {string} className - Optional additional classes
 */
const SplitPane = ({ content, exercise, className = '' }) => {
  return (
    <div className={`invictus-split-pane-layout ${className}`}>
      <div className="invictus-passage-column">
        {content}
      </div>
      <div className="invictus-question-column">
        {exercise}
      </div>
    </div>
  );
};

export default SplitPane;
