import React from 'react';

export const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary mb-3"
        style={{ width: '3rem', height: '3rem', borderWidth: '0.25em' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary fw-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
