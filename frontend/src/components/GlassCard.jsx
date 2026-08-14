import React from 'react';

export const GlassCard = ({ children, className = '', hover = false, onClick, style = {} }) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`glass-card p-4 ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
