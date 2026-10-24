import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';
import './NotFoundPage.css';

const SUGGESTIONS = [
  { to: '/', label: 'Home' },
  { to: '/telc-info', label: 'About the TELC Exam' },
  { to: '/telc/b2', label: 'TELC B2 Hub' },
  { to: '/telc/drillshub', label: 'Drills Hub' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

const NotFoundPage = () => {
  return (
    <>
      <SEO noindex />
      <div className="notfound-page">
        <div className="notfound-container">
          <p className="notfound-code">404</p>
          <h1>This page doesn&rsquo;t exist</h1>
          <p className="notfound-text">
            The page you were looking for is either out of date or was never here. Everything
            below still works.
          </p>

          <ul className="notfound-links">
            {SUGGESTIONS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>

          <Link className="notfound-cta" to="/">
            Back to the homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;