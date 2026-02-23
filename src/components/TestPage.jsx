import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>This is a test page to verify navigation is working.</p>
      <a href="/dashboard" style={{ 
        display: 'inline-block', 
        padding: '1rem 2rem', 
        background: 'red', 
        color: 'white', 
        fontWeight: 'bold',
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 9999
      }}>Go to Dashboard</a>
    </div>
  );
};

export default TestPage;