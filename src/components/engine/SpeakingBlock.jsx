import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RefreshCw, Info, Sparkles } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import './engine.css';

const SpeakingBlock = ({ data, onComplete }) => {
  // Log data for debugging
  console.log('SpeakingBlock received data:', typeof data, data);
  if (data && typeof data === 'object') {
    console.log('Data keys:', Object.keys(data));
    if (data.parts) {
      console.log('Parts type:', typeof data.parts);
      console.log('Parts value:', data.parts);
      console.log('Parts length:', data.parts.length);
      if (Array.isArray(data.parts)) {
        data.parts.forEach((part, index) => {
          console.log(`Part ${index + 1} in SpeakingBlock:`, part.title);
          console.log('  Has topics:', !!part.topics);
          if (part.topics) {
            console.log('  Number of topics:', part.topics.length);
          }
        });
      }
    }
  }
  
  // --- NEW STATES FOR AI ANALYSIS ---
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Handle IELTS speaking mock structure with 'parts' array
  const hasParts = data.parts && data.parts.length > 0;
  
  // Use state for active part index - THIS IS THE FIX!
  const [activePartIndex, setActivePartIndex] = useState(0);
  
  // Get current part based on active part index
  const currentPart = React.useMemo(() => {
    if (hasParts && data.parts[activePartIndex]) {
      return data.parts[activePartIndex];
    }
    return data;
  }, [hasParts, data, activePartIndex]);
  
  // Debug: Show current part details
  console.log('Data.parts:', data.parts);
  console.log('Active part index:', activePartIndex);
  console.log('Current part:', currentPart);
  if (currentPart) {
    console.log('Current part id:', currentPart.id);
    console.log('Current part title:', currentPart.title);
    console.log('Current part topics:', currentPart.topics);
    if (currentPart.topics) {
      console.log('Current part topics length:', currentPart.topics.length);
      console.log('Current part topics:', JSON.stringify(currentPart.topics));
    }
  }
  
  // Determine if this is a topicCard exercise (Part 2 style) - check for topicCard or part4 ID
  const isTopicCardExercise = currentPart.topicCard || currentPart.id === 'part4' || currentPart.type === 'long-turn';
  
  // Existing states
  const [mode, setMode] = useState(isTopicCardExercise ? 'prep' : 'recording'); 
  const [timeLeft, setTimeLeft] = useState(isTopicCardExercise ? 60 : 120);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPreviewRef = useRef(null);

  const isActive = useExamStore(state => state.isActive);

  // Reset state when data changes (switching between parts)
  useEffect(() => {
    const isTopicCard = currentPart.topicCard || currentPart.id === 'part4' || currentPart.type === 'long-turn';
    setMode(isTopicCard ? 'prep' : 'recording');
    setTimeLeft(isTopicCard ? 60 : 120);
    setIsRecording(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setFeedback(null);
    audioChunks.current = [];
  }, [currentPart.id, activePartIndex]);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0 && mode === 'prep') {
      handleStartRecording();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, mode, isActive]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use webm for better compatibility with Gemini API
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob); // Save the raw file for AI upload
        setAudioUrl(URL.createObjectURL(blob)); // Save the URL for playback
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setMode('recording');
      setTimeLeft(120); 
    } catch (err) {
      alert("Microphone access required.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setMode('review');
    }
  };

  // --- NEW FUNCTION: SEND TO PHP API ---
  const handleAnalyzeSpeaking = async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    // Provide context to the AI so it knows what the student is supposed to talk about
    const context = currentPart.topicCard?.topic || 
                    (currentPart.prompts?.[0]?.topic || (typeof currentPart.prompts?.[0] === 'string' ? currentPart.prompts[0] : null)) ||
                    currentPart.candidateInfo?.theme || 
                    currentPart.topics?.[0]?.topic ||
                    "General Task";
    formData.append('prompt', context);

    try {
      const response = await fetch('https://examsuccess.englishexamexercises.com/api/speaking-review.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setFeedback(result);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      alert("Analysis failed. Check your PHP script or Gemini API limits.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="speaking-container speaking-block-wrapper">
      
      <div className="speaking-content" style={{ padding: '30px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Part tabs for IELTS speaking mock structure */}
        {hasParts && (
          <div className="section-tabs" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
            {data.parts.map((part, idx) => (
              <button 
                key={idx} 
                onClick={() => { 
                  console.log(`Clicked on part index: ${idx}, part id: ${part.id}`);
                  setActivePartIndex(idx); 
                  setMode(part.topicCard || part.type === 'long-turn' ? 'prep' : 'recording'); 
                }} 
                className={`section-tab ${activePartIndex === idx ? 'active' : ''}`}
                style={{ 
                  fontSize: '13px', 
                  padding: '15px 20px', 
                  minWidth: '100px',
                  zIndex: 10,
                  position: 'relative'
                }}
              >
                {part.title || `Part ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

         {/* Show instruction for current part */}
        {currentPart.instruction && mode !== 'review' && (
          <div className="speaking-instruction">
            {currentPart.instruction}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* UI for PART 1: General Questions (IELTS format with topics) */}
          {currentPart.prompts && mode !== 'review' && (
            <motion.div key="prompts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prompts-list">
              {currentPart.prompts.map((p, i) => (
                <div key={i} className="speaking-prompt-item">
                  {typeof p === 'string' ? `"${p}"` : p.topic ? (
                    <div>
                      <div className="speaking-prompt-topic">{p.topic}</div>
                      {p.questions?.map((q, qi) => (
                        <div key={qi} className="speaking-prompt-question">
                          {q.text}
                        </div>
                      ))}
                    </div>
                  ) : `"${p}"`}
                </div>
              ))}
            </motion.div>
          )}

          {/* UI for IELTS Part 3: Discussion topics */}
          {currentPart.topics && mode !== 'review' && (
            <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="topics-list">
              {currentPart.topics.map((t, i) => (
                <div key={i} className="speaking-topic-item">
                  <span className="speaking-topic-label">TOPIC {i+1}</span>
                  <p className="speaking-topic-title">{t.topic}</p>
                  {t.questions?.map((q, qi) => (
                    <div key={qi} className="speaking-topic-question">
                      {q.text}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}

          {/* UI for PART 2: Situations/Scenarios */}
          {currentPart.scenarios && mode !== 'review' && (
            <motion.div key="scenarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="scenarios-list">
              {currentPart.scenarios.map((s, i) => (
                <div key={i} className="speaking-scenario-item">
                  <span className="speaking-scenario-label">SITUATION {i+1}</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Context:</strong> {s.context}</p>
                  <p style={{ margin: '5px 0', color: '#4f46e5' }}><strong>They say:</strong> "{s.interlocutorLine}"</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* UI for PART 3: Candidate Info (Info Gap) */}
          {currentPart.candidateInfo && mode !== 'review' && (
            <motion.div key="candidateInfo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="candidate-info-display">
              <div className="speaking-candidate-info">
                <h4 className="speaking-candidate-title">Your Information</h4>
                <p className="speaking-candidate-theme">{currentPart.candidateInfo.theme}</p>
                <div style={{ marginBottom: '15px' }}>
                  <p className="speaking-candidate-label">OPTIONS:</p>
                  {currentPart.candidateInfo.options.map((opt, i) => (
                    <div key={i} className="speaking-candidate-option">
                      {opt}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="speaking-candidate-label">DISCUSS:</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {currentPart.candidateInfo.discussionPoints.map((point, i) => (
                      <span key={i} className="speaking-candidate-point">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* UI for PART 4: Topic Card */}
          {currentPart.topicCard && mode !== 'review' && (
            <motion.div key="topicCard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="topic-card-display">
              <div className="speaking-topic-card">
                <h4 className="speaking-topic-card-title">{currentPart.topicCard.topic}</h4>
                {currentPart.topicCard.description && (
                  <p className="speaking-topic-card-desc">{currentPart.topicCard.description}</p>
                )}
                <ul className="speaking-topic-card-bullets">
                  {currentPart.topicCard.bulletPoints.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                {currentPart.topicCard.roundingQuestions && (
                  <div className="speaking-topic-card-followup">
                    <p className="speaking-topic-card-followup-label">FOLLOW-UP QUESTIONS:</p>
                    {currentPart.topicCard.roundingQuestions.map((rq, i) => (
                      <div key={i} className="speaking-topic-card-followup-q">
                        {rq.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Common Recording UI */}
          {mode === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'auto', textAlign: 'center' }}>
                <div className="mic-shell" style={{ margin: '20px auto' }}>
                    <button className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={isRecording ? handleStopRecording : handleStartRecording}>
                        {isRecording ? <Square fill="white" size={24} /> : <Mic size={32} />}
                    </button>
                </div>
                <p className="speaking-recording-status">{isRecording ? "Recording Answer..." : "Click Mic to Begin"}</p>
            </motion.div>
          )}

          {/* Review Mode + AI Results */}
          {mode === 'review' && (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%' }}>
                <button className="review-circle" onClick={() => audioPreviewRef.current.play()} style={{ width: '80px', height: '80px', borderRadius: '50%', border: 'none', background: 'var(--lab-indigo)', color: 'white', cursor: 'pointer', marginBottom: '15px' }}>
                    <Play fill="white" size={32} />
                </button>
                <h3>Review Recording</h3>
                <audio ref={audioPreviewRef} src={audioUrl} />

                {/* AI FEEDBACK SECTION */}
                <div className="speaking-ai-feedback">
                   {isAnalyzing ? (
                      <div className="speaking-ai-loading">
                        <RefreshCw className="spinner" style={{ margin: '0 auto 10px' }} />
                        <p>AI Examiner is listening and grading your response...</p>
                      </div>
                   ) : feedback ? (
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="feedback-result">
                        <div className="speaking-feedback-header">
                          <h4>AI Performance Analysis</h4>
                          <span className="speaking-band-badge">Band {feedback.score}</span>
                        </div>
                        <div className="speaking-feedback-details">
                           <p><strong>Fluency:</strong> {feedback.fluency}</p>
                           <p><strong>Pronunciation:</strong> {feedback.pronunciation}</p>
                           <p><strong>Grammar/Vocab:</strong> {feedback.grammar}</p>
                        </div>
                      </motion.div>
                   ) : (
                      <button className="btn-ai-analyze" onClick={handleAnalyzeSpeaking} style={{ width: '100%', padding: '15px', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Sparkles size={18} /> Analyze with AI Examiner
                      </button>
                   )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Display */}
        {mode !== 'review' && (
          <div className="speaking-timer-display">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="speaking-footer-buttons">
        {mode === 'review' ? (
          <>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setMode('recording'); setFeedback(null); }}><RefreshCw size={16} /> Retry</button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={onComplete}>Save Response</button>
          </>
        ) : (
          <button className="btn-primary" style={{ width: '100%' }} disabled={mode === 'prep'} onClick={handleStopRecording}>
            {mode === 'prep' ? 'Preparation Time...' : 'Stop Recording'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SpeakingBlock;