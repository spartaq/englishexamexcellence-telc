import React from 'react';
import { Link } from 'react-router-dom';

const PaywallModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="paywall-overlay">
      <div className="paywall-card">
        <div className="badge gold">UNLOCK FULL ACCESS</div>
        <h2>Upgrade to Gold for Lifetime Access</h2>
        <p>Get AI-powered feedback, community forum access, and priority support with a one-time payment.</p>
        
        <div className="benefits">
          <div>✓ AI Writing & Speaking Feedback</div>
          <div>✓ Community Forum Access</div>
          <div>✓ Priority Support</div>
          <div>✓ Lifetime Access - Pay Once</div>
        </div>

        <div className="paywall-actions">
          <Link 
            to="/pricing" 
            className="btn-outline"
          >
            View Pricing
          </Link>
          <button className="btn-primary" onClick={() => alert("Redirecting to checkout...")}>
            Upgrade to Gold (9,000 Ft)
          </button>
          <button className="btn-text" onClick={onClose}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;