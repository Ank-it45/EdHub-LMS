import React from 'react';
import { Layers } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No items found',
  description = 'There are currently no items to display.',
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card text-center py-5 px-4 my-4 d-flex flex-column align-items-center">
      <div
        className="rounded-circle p-4 mb-3 d-flex align-items-center justify-content-center"
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: '#60a5fa',
        }}
      >
        <Icon size={36} />
      </div>
      <h4 className="fw-bold text-white mb-2">{title}</h4>
      <p className="text-muted mb-4 text-center" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
