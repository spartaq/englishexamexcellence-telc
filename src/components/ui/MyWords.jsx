import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';
import { VOCAB_HUB } from '../../data/vocabulary';
import { Trophy, BookOpen, Sparkles, Search, Filter, Calendar, TrendingUp, Target, Award, ArrowLeft } from 'lucide-react';
import './MyWords.css';

const MyWords = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('mastered');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  
  const vocabProgress = useExamStore(state => state.vocabProgress);
  const masteryDates = useExamStore(state => state.masteryDates);
  const masteryHistory = useExamStore(state => state.masteryHistory);

  // Get all words from vocabulary data
  const allWords = useMemo(() => {
    const words = [];
    VOCAB_HUB.categories.forEach(category => {
      category.tasks.forEach(task => {
        task.words.forEach(word => {
          words.push({
            ...word,
            topic: category.title,
            level: task.level,
            taskId: task.id
          });
        });
      });
    });
    return words;
  }, []);

  // Categorize words
  const categorizedWords = useMemo(() => {
    const mastered = [];
    const learning = [];
    const notStarted = [];

    allWords.forEach(word => {
      const progress = vocabProgress[word.term];
      if (!progress) {
        notStarted.push(word);
      } else if (progress.level >= 3) {
        mastered.push({
          ...word,
          masteredDate: masteryDates[word.term],
          currentLevel: progress.level
        });
      } else {
        learning.push({
          ...word,
          currentLevel: progress.level
        });
      }
    });

    return { mastered, learning, notStarted };
  }, [allWords, vocabProgress, masteryDates]);

  // Filter words based on search and topic
  const filteredWords = useMemo(() => {
    let words = [];
    if (activeTab === 'mastered') words = categorizedWords.mastered;
    else if (activeTab === 'learning') words = categorizedWords.learning;
    else words = categorizedWords.notStarted;

    // Filter by topic
    if (selectedTopic !== 'all') {
      words = words.filter(w => w.topic === selectedTopic);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      words = words.filter(w => 
        w.term.toLowerCase().includes(query) ||
        w.definition.toLowerCase().includes(query)
      );
    }

    return words;
  }, [activeTab, categorizedWords, selectedTopic, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalWords = allWords.length;
    const masteredCount = categorizedWords.mastered.length;
    const learningCount = categorizedWords.learning.length;
    const notStartedCount = categorizedWords.notStarted.length;
    const masteryPercentage = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

    // Topic breakdown
    const topicBreakdown = {};
    VOCAB_HUB.categories.forEach(cat => {
      const topicWords = allWords.filter(w => w.topic === cat.title);
      const topicMastered = categorizedWords.mastered.filter(w => w.topic === cat.title);
      topicBreakdown[cat.title] = {
        total: topicWords.length,
        mastered: topicMastered.length,
        percentage: topicWords.length > 0 ? Math.round((topicMastered.length / topicWords.length) * 100) : 0
      };
    });

    // Mastery timeline (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentMastery = masteryHistory.filter(m => m.date > thirtyDaysAgo);
    
    // Group by day
    const dailyMastery = {};
    recentMastery.forEach(m => {
      const day = new Date(m.date).toLocaleDateString();
      dailyMastery[day] = (dailyMastery[day] || 0) + 1;
    });

    return {
      totalWords,
      masteredCount,
      learningCount,
      notStartedCount,
      masteryPercentage,
      topicBreakdown,
      dailyMastery,
      recentMasteryCount: recentMastery.length
    };
  }, [allWords, categorizedWords, masteryHistory]);

  const tabs = [
    { id: 'mastered', label: 'Mastered', icon: <Trophy size={16} />, count: stats.masteredCount },
    { id: 'learning', label: 'Learning', icon: <BookOpen size={16} />, count: stats.learningCount },
    { id: 'notStarted', label: 'New', icon: <Sparkles size={16} />, count: stats.notStartedCount }
  ];

  const topics = ['all', ...VOCAB_HUB.categories.map(c => c.title)];

  return (
    <div className="my-words-container">
      {/* Header */}
      <header className="my-words-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Vocab Hub
        </button>
        <div className="header-content">
          <h1 className="my-words-title">MY WORDS</h1>
          <p className="my-words-subtitle">Track your vocabulary mastery journey</p>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="stats-dashboard">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Trophy size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.masteredCount}</span>
              <span className="stat-label">Words Mastered</span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.masteryPercentage}%` }}></div>
              </div>
              <span className="progress-text">{stats.masteryPercentage}% of total</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.learningCount}</span>
              <span className="stat-label">Currently Learning</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.recentMasteryCount}</span>
              <span className="stat-label">Mastered (30 days)</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalWords}</span>
              <span className="stat-label">Total Words</span>
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="topic-breakdown">
          <h3 className="breakdown-title">TOPIC PROGRESS</h3>
          <div className="topic-bars">
            {Object.entries(stats.topicBreakdown).map(([topic, data]) => (
              <div key={topic} className="topic-bar-item">
                <div className="topic-bar-header">
                  <span className="topic-name">{topic}</span>
                  <span className="topic-stats">{data.mastered}/{data.total}</span>
                </div>
                <div className="topic-bar-bg">
                  <div 
                    className="topic-bar-fill" 
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs and Filters */}
      <section className="words-section">
        <div className="tabs-container">
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filters-row">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={16} />
            <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Words List */}
        <div className="words-list">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedTopic + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredWords.length === 0 ? (
                <div className="empty-state">
                  <Sparkles size={48} />
                  <h3>No words found</h3>
                  <p>
                    {activeTab === 'mastered' 
                      ? "You haven't mastered any words yet. Keep practicing!"
                      : activeTab === 'learning'
                      ? "No words in progress. Start a flashcard session!"
                      : "All words have been started. Great job!"}
                  </p>
                </div>
              ) : (
                <div className="words-grid">
                  {filteredWords.map((word, index) => (
                    <motion.div
                      key={word.term}
                      className={`word-card ${activeTab}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <div className="word-header">
                        <h4 className="word-term">{word.term}</h4>
                        {activeTab === 'mastered' && (
                          <span className="mastery-badge">
                            <Trophy size={12} />
                            Mastered
                          </span>
                        )}
                        {activeTab === 'learning' && (
                          <span className="level-badge">
                            Lvl {Math.floor(word.currentLevel)}
                          </span>
                        )}
                      </div>
                      <p className="word-definition">{word.definition}</p>
                      <div className="word-meta">
                        <span className="word-topic">{word.topic}</span>
                        <span className="word-level">{word.level}</span>
                        {activeTab === 'mastered' && word.masteredDate && (
                          <span className="mastered-date">
                            <Calendar size={12} />
                            {new Date(word.masteredDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {word.hu && (
                        <p className="word-translation">{word.hu}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default MyWords;
