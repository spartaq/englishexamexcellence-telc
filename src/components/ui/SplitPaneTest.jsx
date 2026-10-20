import React from 'react';

const SplitPaneTest = () => {
  return (
    <div className="spt-root">
      <div className="spt-toolbar">
        <div className="spt-toolbar-left">
          <span className="spt-location">Reading</span>
        </div>

        <div className="spt-toolbar-right">
          {/* Section icons - desktop only */}
          <div className="spt-section-icons">
            <button className="spt-section-icon" title="Vocabulary">
              <span className="spt-section-icon-label">Vocab</span>
            </button>
            <button className="spt-section-icon active" title="Reading">
              <span className="spt-section-icon-label">Reading</span>
            </button>
            <button className="spt-section-icon" title="Language Elements">
              <span className="spt-section-icon-label">Lang. Elem.</span>
            </button>
            <button className="spt-section-icon" title="Listening">
              <span className="spt-section-icon-label">Listening</span>
            </button>
            <button className="spt-section-icon" title="Speaking">
              <span className="spt-section-icon-label">Speaking</span>
            </button>
            <button className="spt-section-icon" title="Writing">
              <span className="spt-section-icon-label">Writing</span>
            </button>
          </div>
          {/* Section dropdown - mobile only */}
          <select className="spt-section-dropdown" defaultValue="reading">
            <option value="vocab">Vocab</option>
            <option value="reading">Reading</option>
            <option value="language-elements">Lang. Elem.</option>
            <option value="listening">Listening</option>
            <option value="speaking">Speaking</option>
            <option value="writing">Writing</option>
          </select>
          <button className="spt-close-btn">✕</button>
        </div>
      </div>

      <div className="spt-split">
        <div className="spt-content">
          <div className="spt-content-inner">
            <div className="spt-header">
              <div className="spt-header-top">
                <span className="spt-badge">B2</span>
                <div className="spt-eyebrow">
                  <span className="spt-eyebrow-location">Mock 1 · Reading</span>
                  <div className="spt-eyebrow-parts">
                    <button className="spt-part-link">Part 1</button>
                    <button className="spt-part-link active">Part 2</button>
                    <button className="spt-part-link">Part 3</button>
                  </div>
                </div>
              </div>
              <h2 className="spt-title-main">Reading Comprehension</h2>
            </div>
            <div className="spt-passage">
              <p className="spt-para">
                <strong>1.</strong> When I first moved to the city, I was overwhelmed by the pace of life. The streets were always crowded, the buildings were taller than anything I had seen before, and the noise never seemed to stop. I came from a small town where everyone knew each other and the biggest event of the year was the autumn fair. In the city, nobody looked at you on the bus, and that felt strangely lonely at first.
              </p>
              <p className="spt-para">
                <strong>2.</strong> It took me nearly a year to feel at home. I joined a book club, which turned out to be the best decision I ever made. Through that group I met people who also had recently moved, and we formed a kind of unofficial support network. We would meet on weekends, cook together, and talk about everything from work stress to family. Slowly, the city stopped feeling like a place I was visiting and started feeling like a place I belonged.
              </p>
              <p className="spt-para">
                <strong>3.</strong> Looking back, I realise that the loneliness I felt was not really about the city at all. It was about being in a new environment and having to rebuild my social world from scratch. That process was difficult, but it also taught me resilience. Today, I would not trade my city life for anything, even though I still miss the quiet of my old town sometimes.
              </p>
            </div>
          </div>
        </div>

        <div className="spt-questions">
          <div className="spt-q-header">
            <span className="spt-q-count">Questions 6–10</span>
          </div>

          <div className="spt-questions-inner">
         
            <div className="spt-question-card">
              <div className="spt-q-top">
                <span className="spt-q-num">6</span>
                <span className="spt-q-text">What was the writer's first impression of the city?</span>
              </div>
              <div className="spt-options">
                <label className="spt-option">
                  <input type="radio" name="q6" />
                  <span className="spt-option-mark">A</span>
                  <span>It was exciting and full of opportunities.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q6" />
                  <span className="spt-option-mark">B</span>
                  <span>It was overwhelming and strangely lonely.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q6" />
                  <span className="spt-option-mark">C</span>
                  <span>It was noisy and difficult to study in.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q6" />
                  <span className="spt-option-mark">D</span>
                  <span>It was expensive and hard to find accommodation.</span>
                </label>
              </div>
            </div>

            <div className="spt-question-card">
              <div className="spt-q-top">
                <span className="spt-q-num">7</span>
                <span className="spt-q-text">How did the writer eventually feel at home?</span>
              </div>
              <div className="spt-options">
                <label className="spt-option">
                  <input type="radio" name="q7" />
                  <span className="spt-option-mark">A</span>
                  <span>By getting a better-paid job.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q7" />
                  <span className="spt-option-mark">B</span>
                  <span>By joining a book club and meeting new people.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q7" />
                  <span className="spt-option-mark">C</span>
                  <span>By moving to a quieter neighbourhood.</span>
                </label>
                <label className="spt-option">
                  <input type="radio" name="q7" />
                  <span className="spt-option-mark">D</span>
                  <span>By learning the local language.</span>
                </label>
              </div>
            </div>
          </div>

          <div className="spt-nav">
            <button className="spt-nav-btn">Previous</button>
            <button className="spt-nav-btn spt-nav-primary">Next</button>
            <button className="spt-check-btn">Check Answers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPaneTest;