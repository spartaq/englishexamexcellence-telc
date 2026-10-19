import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(() => !localStorage.getItem('cookie-consent'));

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <p>
          We use cookies and similar technologies to improve your experience and serve
          personalized content. Google AdSense may also set cookies for advertising purposes.
          By clicking "Accept", you consent to the use of cookies as described in our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <div className="cookie-actions">
          <button className="btn-accept" onClick={handleAccept}>Accept</button>
          <button className="btn-reject" onClick={handleReject}>Reject Non-Essential</button>
        </div>
        <button className="btn-close" onClick={handleReject} aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
