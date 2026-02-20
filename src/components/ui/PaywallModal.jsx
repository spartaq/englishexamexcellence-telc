import React from 'react';

const PaywallModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="paywall-overlay">
      <div className="paywall-card">
        <div className="badge gold">GOLD TIER REQUIRED</div>
        <h2>Unlock Advanced Lab Tasks</h2>
        <p>Silver and Gold tier tasks include complex interactions, detailed analytics, and official mock exams.</p>
        
        <div className="benefits">
          <div>✓ Advanced Writing Analysis</div>
          <div>✓ Full Length Mock Tests</div>
          <div>✓ Priority Rank Support</div>
        </div>

        <button className="btn-primary" onClick={() => alert("Redirecting to checkout...")}>
          Upgrade to Gold
        </button>
        <button className="btn-text" onClick={onClose}>Maybe Later</button>
      </div>
    </div>
  );
};

export default PaywallModal;