import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import './engine.css';

const WritingBlock = ({ data, onComplete }) => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState(null); // To store the result

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
    
    // Since Gemini returned an array [ {...} ], we take the first item
    const dataObj = Array.isArray(result) ? result[0] : result;
    setFeedback(dataObj);

  } catch (err) {
    console.error("Check failed:", err);
  } finally {
    setIsChecking(false);
  }
};



  const progressPercentage = Math.min((wordCount / (data.targetWords || 150)) * 100, 100);

  return (
    <div className="writing-container">
      <div className="writing-header">
        <div className="header-meta">
          <span className="task-label">IELTS Writing Task {data.taskType}</span>
          <span className={`word-count ${wordCount >= data.targetWords ? 'goal-reached' : ''}`}>
            {wordCount} / {data.targetWords} Words
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

      <div className="editor-wrap">
        <textarea
          className="writing-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isChecking}
          placeholder="Type your response here..."
          spellCheck="false"
        />
        {isChecking && <div className="loading-spinner">Analyzing your writing...</div>}
												
					   
										 
																			   
				
		  
      </div>

{/* Feedback Display Area */}
{feedback && (
  <div className="feedback-display">
    <div className="feedback-header">
      <h4>Examiner Review</h4>
      <div className="band-score">Band Score: {feedback.score}</div>
    </div>
    
    <div className="feedback-body">
      <p><strong>Comments:</strong> {feedback.comments}</p>
      
      {/* 1. Show corrections if they are a simple string */}
      {feedback?.corrections && typeof feedback.corrections === 'string' && (
        <div className="improvement-advice">
          <strong>Advice:</strong>
          <p>{feedback.corrections}</p>
        </div>
      )}

      {/* 2. Show corrections if they are the detailed array (Table) */}
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

      <div className="writing-footer">
        {!feedback ? (
          <button 
            className="submit-btn"
            disabled={wordCount < 10 || isChecking}
            onClick={handleCheckWriting}
          >
            {isChecking ? 'Checking...' : 'Check My Grammar'}
          </button>
        ) : (
          <button className="submit-btn" onClick={() => onComplete(text)}>
            Finalize Submission
							   
          </button>
        )}
      </div>
    </div>
  );
};

export default WritingBlock;