import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '580px' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="glass-modal-backdrop" onClick={onClose}>
      <div
        className="glass-modal-dialog p-4 position-relative"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <h4 className="fw-bold m-0 text-white brand-font">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-link text-muted p-1 hover-light text-decoration-none"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
