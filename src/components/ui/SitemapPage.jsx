import React from 'react';
import { Link } from 'react-router-dom';
import './SitemapPage.css';

const SitemapPage = () => {
  return (
    <div className="sitemap-page">
      <div className="sitemap-container">
        <header className="sitemap-header">
          <h1>Sitemap</h1>
          <p>A complete map of every page on English Exam Excellence.</p>
        </header>

        {/* ── PUBLIC ─────────────────────────────────────────────── */}
        <section className="sitemap-section">
          <h2>
            <span className="badge badge-public">Public</span>
            Accessible without signing in
          </h2>
          <div className="sitemap-group">
            <div className="sitemap-card">
              <h3>Home</h3>
              <ul>
                <li><Link to="/">Landing Page</Link></li>
              </ul>
            </div>
            <div className="sitemap-card">
              <h3>TELC Info</h3>
              <ul>
                <li><Link to="/telc-info">Exam Description &amp; Intel</Link></li>
              </ul>
            </div>
            <div className="sitemap-card">
              <h3>Free Mock Tests</h3>
              <ul>
                <li><Link to="/free-mock">All Levels (default: B2)</Link></li>
                <li><Link to="/free-mock/b1">B1 Free Mock</Link></li>
                <li><Link to="/free-mock/b2">B2 Free Mock</Link></li>
                <li><Link to="/free-mock/c1">C1 Free Mock</Link></li>
              </ul>
            </div>
            <div className="sitemap-card">
              <h3>Pricing</h3>
              <ul>
                <li><Link to="/pricing">Pricing Tiers &amp; FAQ</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── PROTECTED ──────────────────────────────────────────── */}
        <section className="sitemap-section">
          <h2>
            <span className="badge badge-protected">Protected</span>
            Sign in required to access
          </h2>

          {/* B1 */}
          <div className="sitemap-group">
            <h3>TELC B1</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/b1</li>
                <li><Link to="/telc/b1">B1 Skill Hub</Link></li>
                <li><Link to="/telc/b1/mini-test">B1 Mini-Test</Link></li>
                <li><Link to="/telc/b1/reading">B1 Reading</Link></li>
                <li><Link to="/telc/b1/writing">B1 Writing</Link></li>
                <li><Link to="/telc/b1/speaking">B1 Speaking</Link></li>
                <li><Link to="/telc/b1/listening">B1 Listening</Link></li>
              </ul>
            </div>
          </div>

          {/* B2 */}
          <div className="sitemap-group">
            <h3>TELC B2</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/b2</li>
                <li><Link to="/telc/b2">B2 Skill Hub</Link></li>
                <li><Link to="/telc/b2/mini-test">B2 Mini-Test</Link></li>
                <li><Link to="/telc/b2/reading">B2 Reading</Link></li>
                <li><Link to="/telc/b2/writing">B2 Writing</Link></li>
                <li><Link to="/telc/b2/speaking">B2 Speaking</Link></li>
                <li><Link to="/telc/b2/listening">B2 Listening</Link></li>
              </ul>
            </div>
          </div>

          {/* C1 */}
          <div className="sitemap-group">
            <h3>TELC C1</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/c1</li>
                <li><Link to="/telc/c1">C1 Skill Hub</Link></li>
                <li><Link to="/telc/c1/mini-test">C1 Mini-Test</Link></li>
                <li><Link to="/telc/c1/reading">C1 Reading</Link></li>
                <li><Link to="/telc/c1/writing">C1 Writing</Link></li>
                <li><Link to="/telc/c1/speaking">C1 Speaking</Link></li>
                <li><Link to="/telc/c1/listening">C1 Listening</Link></li>
              </ul>
            </div>
          </div>

          {/* Vocabulary Lab */}
          <div className="sitemap-group">
            <h3>Vocabulary Lab</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/vocabulary</li>
                <li><Link to="/telc/vocabulary">Level Selector</Link></li>
                <li><Link to="/telc/vocabulary/b1">B1 Vocabulary</Link></li>
                <li><Link to="/telc/vocabulary/b2">B2 Vocabulary</Link></li>
                <li><Link to="/telc/vocabulary/c1">C1 Vocabulary</Link></li>
              </ul>
            </div>
          </div>

          {/* Drills Hub */}
          <div className="sitemap-group">
            <h3>Drills Hub</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/drillshub</li>
                <li><Link to="/telc/drillshub">Level Selector</Link></li>
                <li><Link to="/telc/drillshub/b1">B1 Drills</Link></li>
                <li><Link to="/telc/drillshub/b2">B2 Drills</Link></li>
                <li><Link to="/telc/drillshub/c1">C1 Drills</Link></li>
              </ul>
            </div>
          </div>

          {/* My Words */}
          <div className="sitemap-group">
            <h3>My Words</h3>
            <div className="sitemap-card">
              <ul>
                <li className="path-label">/telc/mywords</li>
                <li><Link to="/telc/mywords">My Saved Words</Link></li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="sitemap-footer">
          <p>
            Sessions started from the B1 / B2 / C1 hubs generate unique URLs per mock
            test (e.g. <code>telc-b1-mock-1</code> up to <code>telc-c1-mock-9</code>),
            which are served dynamically from <code>src/data/TELC/mocks/</code> and are
            not individually listed here. Total accessible routes: <strong>34 unique
            URLs</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SitemapPage;
