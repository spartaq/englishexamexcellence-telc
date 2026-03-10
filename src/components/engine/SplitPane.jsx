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
    <div className={`desktop-split-pane ${className}`}>
      <div className="content-pane">
        {content}
      </div>
      <div className="exercise-pane">
        {exercise}
      </div>
    </div>
  );
};

export default SplitPane;
