import React from 'react';
import './ui.css'; // Create a small css file for UI components

export const Button = ({ children, onClick, disabled, variant = 'primary' }) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};