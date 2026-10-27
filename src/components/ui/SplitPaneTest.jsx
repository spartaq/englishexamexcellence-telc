import React, { useMemo, useState, useRef, useEffect } from 'react';
import QuestionDispatcher from '../engine/QuestionDispatcher';
import FlashcardBlock from '../engine/FlashcardBlock';
import { flattenQuestions } from '../../utils/questionFlattener';

const SplitPaneTest = ({
  activeLesson,
  activeSectionIndex = 0,
  activePassageIndex = 0,
  userAnswers = {},
  onUpdateAnswers = () => {},
  onCheckAnswers = () => {},
  isReviewMode = false,
  sections = [],
  setActiveSectionIndex = () => {},
  setActivePassageIndex = () => {},
  onClose = () => {},
}) => {
  const allSections = sections.length > 0 ? sections : (activeLesson?.sections || []);
  const currentSection = allSections[activeSectionIndex] || activeLesson;
  const skill = currentSection?.skill || 'reading';
  const mockNumber = activeLesson?.mockNumber || 1;
  const level = activeLesson?.level || 'b2';

  // Unique main sections (each skill shown once) for the toolbar
  const uniqueSkills = useMemo(() => {
    const seen = new Set();
    return allSections.filter(s => {
      if (seen.has(s.skill)) return false;
      seen.add(s.skill);
      return true;
    });
  }, [allSections]);

  // Parts within the current skill for the parts nav bar
  const currentSkillSections = allSections.filter(s => s.skill === skill);

  const passages = currentSection?.passages || [];
  const currentPassage = passages[activePassageIndex] || currentSection;
  const content = currentPassage?.content || currentSection?.content || currentSection?.text;
  const title = currentSection?.title || currentPassage?.title || activeLesson?.title || 'Test';
  const subtitle = currentSection?.subtitle || currentPassage?.subtitle;

  // Extract flat questions per skill type based on their data structure
  const flatQuestions = useMemo(() => {
    switch (skill) {
      case 'reading':
      case 'listening':
        return flattenQuestions(currentSection?.subTasks || []);
      case 'language-elements': {
        // Language elements: subTasks live inside passages[]
        const passageSubTasks = currentSection?.passages?.flatMap(p => p.subTasks || []) || [];
        return flattenQuestions(passageSubTasks);
      }
      case 'speaking': {
        // Speaking: questions live inside topics[].questions
        const speakingQs = currentSection?.topics?.flatMap(t => t.questions || []) || [];
        return speakingQs.map(q => ({ ...q, type: 'speaking' }));
      }
      case 'writing':
      case 'vocab':
      default:
        return [];
    }
  }, [currentSection, skill]);

  // Listening audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current?.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // Speaking recording state
  const [speakingMode, setSpeakingMode] = useState('recording');
  const [speakingTimeLeft, setSpeakingTimeLeft] = useState(120);
  const [isSpeakingRecording, setIsSpeakingRecording] = useState(false);
  const [speakingAudioUrl, setSpeakingAudioUrl] = useState(null);
  const [speakingAudioBlob, setSpeakingAudioBlob] = useState(null);
  const speakingMediaRecorder = useRef(null);
  const speakingAudioChunks = useRef([]);
  const speakingAudioRef = useRef(null);
  const [speakingFeedback, setSpeakingFeedback] = useState(null);
  const [isAnalyzingSpeaking, setIsAnalyzingSpeaking] = useState(false);

  // Gap-fill-tokens active gap state
  const [activeGap, setActiveGap] = useState(null);

  const handleStartSpeakingRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      speakingMediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      speakingAudioChunks.current = [];

      speakingMediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) speakingAudioChunks.current.push(e.data);
      };

      speakingMediaRecorder.current.onstop = () => {
        const blob = new Blob(speakingAudioChunks.current, { type: 'audio/webm' });
        setSpeakingAudioBlob(blob);
        setSpeakingAudioUrl(URL.createObjectURL(blob));
      };

      speakingMediaRecorder.current.start();
      setIsSpeakingRecording(true);
      setSpeakingMode('recording');
      setSpeakingTimeLeft(120);
    } catch (err) {
      alert("Microphone access required.");
    }
  };

  const handleStopSpeakingRecording = () => {
    if (speakingMediaRecorder.current && isSpeakingRecording) {
      speakingMediaRecorder.current.stop();
      setIsSpeakingRecording(false);
      setSpeakingMode('review');
    }
  };

  const handleRetrySpeaking = () => {
    setSpeakingMode('recording');
    setSpeakingFeedback(null);
    setSpeakingAudioUrl(null);
    setSpeakingAudioBlob(null);
    speakingAudioChunks.current = [];
  };

  const handleAnalyzeSpeaking = async () => {
    if (!speakingAudioBlob) return;
    setIsAnalyzingSpeaking(true);
    setSpeakingFeedback(null);

    const formData = new FormData();
    formData.append('audio', speakingAudioBlob, 'recording.webm');

    const context = currentSection?.topicCard?.topic ||
      currentSection?.instruction ||
      'General Speaking Task';
    formData.append('prompt', context);

    try {
      const response = await fetch('https://examsuccess.englishexamexercises.com/api/speaking-review.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setSpeakingFeedback(result);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      alert("Analysis failed.");
    } finally {
      setIsAnalyzingSpeaking(false);
    }
  };

  const getQuestionRange = () => {
    if (flatQuestions.length === 0) return 'Questions';
    const ids = [];
    flatQuestions.forEach(q => {
      if (q.id) {
        const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
        if (!isNaN(numId)) ids.push(numId);
      }
    });
    if (ids.length === 0) return 'Questions';
    ids.sort((a, b) => a - b);
    return ids.length > 1 ? `Questions ${ids[0]}–${ids[ids.length - 1]}` : `Question ${ids[0]}`;
  };

  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
      setActivePassageIndex(0);
    }
  };

  const handleNextSection = () => {
    if (activeSectionIndex < allSections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
      setActivePassageIndex(0);
    }
  };

  const handleJumpToSection = (index) => {
    setActiveSectionIndex(index);
    setActivePassageIndex(0);
  };

  const renderPassageContent = () => {
    if (!content) return null;

    // Detect gap-fill-tokens and render interactive clickable gaps
    const gapTask = currentSection?.passages?.flatMap(p => p.subTasks || []).find(st => st.type === 'gap-fill-tokens');
    if (gapTask) {
      if (Array.isArray(content)) {
        return content.map((item, index) => {
          const pText = typeof item === 'object' ? item.text : item;
          return (
            <div key={index} className="spt-para">
              {renderInteractiveGaps(pText)}
            </div>
          );
        });
      }
      return renderInteractiveGaps(content);
    }

    if (Array.isArray(content)) {
      return content.map((item, index) => {
        const pId = typeof item === 'object' ? item.id : null;
        const pText = typeof item === 'object' ? item.text : item;
        return (
          <div key={index} className="spt-para">
            {pId && <span className="spt-para-id">{pId}.</span>}
            <span dangerouslySetInnerHTML={{ __html: pText }} />
          </div>
        );
      });
    }
    return <div className="spt-para"><span dangerouslySetInnerHTML={{ __html: content }} /></div>;
  };

  const renderWritingPassage = () => {
    return (
      <div className="spt-writing">
        <div className="spt-header">
          <div className="spt-header-top">
            <span className="spt-badge">{String(level).toUpperCase()}</span>
            <div className="spt-eyebrow">
              <span className="spt-eyebrow-location">Mock {mockNumber} · Writing</span>
            </div>
          </div>
          <h2 className="spt-title-main">{title}</h2>
          {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
        </div>
        <div className="spt-passage">
          {currentSection?.instruction && <p className="spt-para">{currentSection.instruction}</p>}
          {currentSection?.context && <p className="spt-para">{currentSection.context}</p>}
          {currentSection?.prompt && <p className="spt-para">{currentSection.prompt}</p>}
          {currentSection?.targetWords && (
            <p className="spt-para" style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Target: {currentSection.targetWords} words
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderWritingResponse = () => {
    return (
      <div className="spt-writing-editor">
        <textarea
          className="spt-writing-textarea"
          value={userAnswers[currentSection?.id || 'writing'] || ''}
          onChange={(e) => onUpdateAnswers(currentSection?.id || 'writing', e.target.value)}
          rows={12}
          placeholder="Write your answer here..."
        />
        {currentSection?.bullets && currentSection.bullets.length > 0 && (
          <div className="spt-writing-bullets">
            <strong>Include:</strong>
            <ul>
              {currentSection.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderSpeakingContent = () => {
    return (
      <div className="spt-speaking">
        <div className="spt-header">
          <div className="spt-header-top">
            <span className="spt-badge">{String(level).toUpperCase()}</span>
            <div className="spt-eyebrow">
              <span className="spt-eyebrow-location">Mock {mockNumber} · Speaking</span>
            </div>
          </div>
          <h2 className="spt-title-main">{title}</h2>
          {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
        </div>
        <div className="spt-passage">
          {currentSection?.instruction && <p className="spt-para">{currentSection.instruction}</p>}
          {currentSection?.duration && (
            <p className="spt-para" style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Duration: {currentSection.duration}
            </p>
          )}
        </div>
        <div className="spt-speaking-topics">
          {currentSection?.topics?.map((topic, tIdx) => (
            <div key={tIdx} className="spt-speaking-topic">
              <h3 className="spt-speaking-topic-title">{topic.topic}</h3>
              {topic.questions?.map((q, qIdx) => (
                <div key={qIdx} className="spt-speaking-question">
                  <span className="spt-q-num">{String(q.id).replace(/\D/g, '')}</span>
                  <span className="spt-q-text">{q.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpeakingResponse = () => {
    const minutes = Math.floor(speakingTimeLeft / 60);
    const seconds = (speakingTimeLeft % 60).toString().padStart(2, '0');

    return (
      <div className="spt-speaking-response">
        <h3 className="spt-speaking-response-title">Speaking Task</h3>

        {/* Timer */}
        {speakingMode !== 'review' && (
          <div className="spt-speaking-timer">{minutes}:{seconds}</div>
        )}

        {/* Recording UI */}
        {speakingMode === 'recording' && (
          <>
            <div className="spt-speaking-mic">
              <button
                className={`spt-speaking-mic-btn ${isSpeakingRecording ? 'recording' : ''}`}
                onClick={isSpeakingRecording ? handleStopSpeakingRecording : handleStartSpeakingRecording}
              >
                {isSpeakingRecording ? '■' : '⏺'}
              </button>
              <p className="spt-speaking-status">
                {isSpeakingRecording ? "Recording Answer..." : "Click Mic to Begin"}
              </p>
            </div>
            <button className="spt-speaking-stop-btn" onClick={handleStopSpeakingRecording} disabled={speakingMode === 'prep'}>
              {speakingMode === 'prep' ? 'Preparation Time...' : 'Stop Recording'}
            </button>
          </>
        )}

        {speakingMode === 'review' && (
          <>
            <button className="spt-speaking-retry-btn" onClick={handleRetrySpeaking}>
              ↺ Retry
            </button>
            <button className="spt-speaking-play-btn" onClick={() => speakingAudioRef.current?.play()}>
              ▶ Play Recording
            </button>
            {speakingAudioUrl && (
              <audio ref={speakingAudioRef} src={speakingAudioUrl} />
            )}
            <button className="spt-speaking-analyze-btn" onClick={handleAnalyzeSpeaking} disabled={isAnalyzingSpeaking}>
              {isAnalyzingSpeaking ? 'Analyzing...' : 'Analyze with AI Examiner'}
            </button>
            {speakingFeedback && (
              <div className="spt-speaking-feedback">
                <h4>AI Performance Analysis</h4>
                {speakingFeedback.score && <span className="spt-speaking-band">Band {speakingFeedback.score}</span>}
                {speakingFeedback.fluency && <p><strong>Fluency:</strong> {speakingFeedback.fluency}</p>}
                {speakingFeedback.pronunciation && <p><strong>Pronunciation:</strong> {speakingFeedback.pronunciation}</p>}
                {speakingFeedback.grammar && <p><strong>Grammar/Vocab:</strong> {speakingFeedback.grammar}</p>}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Gap-fill-tokens: handle clicking a gap to set it as active / clear it
  const handleGapClick = (gapId) => {
    if (isReviewMode) return;
    if (activeGap === gapId) {
      // Clicking same active gap: clear it if it has content, otherwise deselect
      if (userAnswers[gapId]) {
        onUpdateAnswers(gapId, '');
      } else {
        setActiveGap(null);
      }
    } else {
      setActiveGap(gapId);
    }
  };

  // Render clickable gaps within a passage text (gap-fill-tokens)
  const renderInteractiveGaps = (text) => {
    if (!text) return null;
    const answers = {};
    // Find gap-fill-tokens subTask to get answers map
    const gapTask = currentSection?.passages?.flatMap(p => p.subTasks || []).find(st => st.type === 'gap-fill-tokens');
    if (gapTask) Object.assign(answers, gapTask.answers || {});
    const parts = text.split(/____\(([a-z])\)____/g);
    return (
      <div className="spt-gap-passage">
        {parts.map((part, idx) => {
          if (idx % 2 === 0) return <span key={idx} className="spt-passage-text" dangerouslySetInnerHTML={{ __html: part }} />;
          const gapId = part;
          const selectedToken = userAnswers[gapId];
          const isActive = activeGap === gapId;
          let reviewClass = '';
          if (isReviewMode) {
            if (!selectedToken) {
              reviewClass = 'missing';
            } else {
              const correctAnswer = answers[gapId];
              reviewClass = selectedToken?.toLowerCase() === correctAnswer?.toLowerCase() ? 'correct' : 'incorrect';
            }
          }
          return (
            <span
              key={idx}
              className={`spt-gap-line ${selectedToken ? 'filled' : 'empty'} ${isActive ? 'active' : ''} ${reviewClass}`}
              onClick={() => handleGapClick(gapId)}
            >
              {selectedToken || '____'}
            </span>
          );
        })}
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (skill) {
      case 'reading':
        return (
          <>
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">{String(level).toUpperCase()}</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock {mockNumber} · {skill}</span>
                </div>
              </div>
              <h2 className="spt-title-main">{title}</h2>
            </div>
            <div className="spt-passage">{renderPassageContent()}</div>
          </>
        );
      case 'listening':
        return (
          <>
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">{String(level).toUpperCase()}</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock {mockNumber} · Listening</span>
                </div>
              </div>
              <h2 className="spt-title-main">{title}</h2>
              {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
            </div>
            <div className="spt-passage">
              {currentSection?.instructions && <p className="spt-para">{currentSection.instructions}</p>}

              {/* Audio Player */}
              <div className="spt-audio-player">
                <div className="spt-audio-controls">
                  <button
                    className="spt-audio-btn"
                    onClick={isPlaying ? handlePause : handlePlay}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <div className="spt-audio-progress">
                    <div className="spt-audio-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  src={currentSection?.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleAudioEnded}
                />
              </div>

              {/* Transcript Toggle */}
              {currentSection?.transcript && (
                <div className="spt-transcript-section">
                  <button
                    className="spt-transcript-btn"
                    onClick={() => setShowTranscript(!showTranscript)}
                  >
                    {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                  </button>
                  {showTranscript && (
                    <div className="spt-transcript-content">
                      <p className="spt-transcript-text">{currentSection.transcript}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        );
      case 'writing':
        return renderWritingPassage();
      case 'speaking':
        return renderSpeakingContent();
      case 'language-elements':
        return (
          <>
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">{String(level).toUpperCase()}</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock {mockNumber} · Language Elements</span>
                </div>
              </div>
              <h2 className="spt-title-main">{title}</h2>
              {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
            </div>
            <div className="spt-passage">{renderPassageContent()}</div>
          </>
        );
      case 'vocab':
        return (
          <>
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">{String(level).toUpperCase()}</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock {mockNumber} · Vocab</span>
                </div>
              </div>
              <h2 className="spt-title-main">{title}</h2>
              {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
            </div>
            <div className="spt-passage">
              {currentSection?.instruction && <p className="spt-para">{currentSection.instruction}</p>}
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">{String(level).toUpperCase()}</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock {mockNumber} · {skill}</span>
                </div>
              </div>
              <h2 className="spt-title-main">{title}</h2>
              {subtitle && <p className="spt-eyebrow-location">{subtitle}</p>}
            </div>
            <div className="spt-passage">
              {currentSection?.instruction && <p className="spt-para">{currentSection.instruction}</p>}
              {currentSection?.context && <p className="spt-para">{currentSection.context}</p>}
              {currentSection?.prompt && <p className="spt-para">{currentSection.prompt}</p>}
              {currentSection?.text && <p className="spt-para">{currentSection.text}</p>}
            </div>
          </>
        );
    }
  };

  const renderVocabContent = () => {
    const words = currentSection?.words || currentSection?.questions || [];
    if (!words || words.length === 0) {
      return <p className="spt-para">No vocabulary words available for this section.</p>;
    }
    return (
      <FlashcardBlock
        data={{ ...currentSection, words }}
        showFilters={false}
        onComplete={onCheckAnswers}
        onNavigateToMyWords={() => {}}
        sections={allSections}
        activeSectionIndex={activeSectionIndex}
        setActiveSectionIndex={setActiveSectionIndex}
        setActivePassageIndex={setActivePassageIndex}
        setIsReviewMode={() => {}}
        setActiveSkillTab={() => {}}
        availableSkills={[]}
        allSections={allSections}
      />
    );
  };

  // Vocab renders full-width (single pane) using FlashcardBlock
  const renderVocabFullPane = () => {
    const words = currentSection?.words || currentSection?.questions || [];
    if (!words || words.length === 0) {
      return (
        <div className="spt-vocab-empty">
          <p>No vocabulary words available for this section.</p>
        </div>
      );
    }
    return (
      <div className="spt-vocab-wrapper">
        <FlashcardBlock
          data={{ ...currentSection, words }}
          showFilters={false}
          onComplete={onCheckAnswers}
          onNavigateToMyWords={() => {}}
          sections={allSections}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={() => {}}
          setActiveSkillTab={() => {}}
          availableSkills={[]}
          allSections={allSections}
        />
        <div className="spt-vocab-next">
          {activeSectionIndex < allSections.length - 1 && (
            <button
              className="spt-nav-btn spt-nav-primary"
              onClick={() => handleJumpToSection(activeSectionIndex + 1)}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="spt-root">
      <div className="spt-toolbar">
        <div className="spt-toolbar-left">
          <span className="spt-location">{skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
          {/* Parts tabs - within toolbar left */}
          {currentSkillSections.length > 1 && (
            <div className="spt-parts-tabs">
              {currentSkillSections.map((s, i) => {
                const globalIdx = allSections.findIndex(sec => sec.id === s.id && sec.skill === s.skill);
                return (
                  <button
                    key={i}
                    className={`spt-part-tab ${globalIdx === activeSectionIndex ? 'active' : ''}`}
                    onClick={() => handleJumpToSection(globalIdx)}
                  >
                    <span className="spt-part-word">Part </span>
                    <span className="spt-part-number">{i + 1}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="spt-toolbar-right">
          {/* Main section nav - each skill shown once */}
          <div className="spt-section-icons">
            {uniqueSkills.map((s, i) => {
              const idx = allSections.findIndex(sec => sec.skill === s.skill);
              return (
                <button
                  key={i}
                  className={`spt-section-icon ${activeSectionIndex === idx ? 'active' : ''}`}
                  title={s.skill}
                  onClick={() => handleJumpToSection(idx)}
                >
                  <span className="spt-section-icon-label">{s.skill.charAt(0).toUpperCase() + s.skill.slice(1)}</span>
                </button>
              );
            })}
          </div>

          <select
            className="spt-section-dropdown"
            defaultValue={skill}
            onChange={(e) => {
              const idx = allSections.findIndex(s => s.skill === e.target.value);
              if (idx !== -1) {
                setActiveSectionIndex(idx);
                setActivePassageIndex(0);
              }
            }}
          >
            {uniqueSkills.map((s, i) => (
              <option key={i} value={s.skill}>
                {s.skill.charAt(0).toUpperCase() + s.skill.slice(1)}
              </option>
            ))}
          </select>
          <button className="spt-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Vocab renders full-width (single pane) */}
      {skill === 'vocab' && (
        <div className="spt-root spt-vocab-pane">
          {renderVocabFullPane()}
        </div>
      )}
      {skill !== 'vocab' && (
        <>
          <div className="spt-split">
            <div className="spt-content">
              <div className="spt-content-inner">
                {renderSectionContent()}
              </div>
            </div>

            <div className="spt-questions">
              <div className="spt-q-header">
                <span className="spt-q-count">{getQuestionRange()}</span>
              </div>

              <div className="spt-questions-inner">
                {skill === 'writing' ? (
                  <div className="spt-question-card">
                    {renderWritingResponse()}
                  </div>
                ) : skill === 'speaking' ? (
                  <div className="spt-question-card">
                    {renderSpeakingResponse()}
                  </div>
                ) : flatQuestions.length > 0 ? (
                  flatQuestions.map((q) => (
                    <div key={q.id || q.text} className="spt-question-card">
                      <QuestionDispatcher
                        data={q}
                        userAnswers={userAnswers}
                        onUpdate={onUpdateAnswers}
                        showCheckAnswers={false}
                        isReviewMode={isReviewMode}
                        passageContent={content}
                        activeGap={activeGap}
                        onActiveGapChange={setActiveGap}
                      />
                    </div>
                  ))
                ) : (
                  <div className="spt-questions-empty">
                    {skill === 'vocab' ? (
                      <p>Use the content pane on the left to complete this vocab task.</p>
                    ) : (
                      <p>No questions for this section.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="spt-nav">
                {allSections.length > 1 && (
                  <>
                    <button className="spt-nav-btn" onClick={handlePrevSection} disabled={activeSectionIndex === 0}>
                      Previous
                    </button>
                    <button className="spt-nav-btn spt-nav-primary" onClick={handleNextSection} disabled={activeSectionIndex === allSections.length - 1}>
                      Next
                    </button>
                  </>
                )}
                <button className="spt-check-btn" onClick={onCheckAnswers}>
                  Check Answers
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SplitPaneTest;
