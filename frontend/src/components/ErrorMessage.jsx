import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ message, onDismiss, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`glass-panel p-3 mb-3 d-flex align-items-center justify-content-between text-start ${className}`}
      style={{
        background: 'rgba(239, 68, 68, 0.12)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      }}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2 text-danger">
        <AlertCircle size={20} className="flex-shrink-0" />
        <span className="small fw-medium text-light">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
