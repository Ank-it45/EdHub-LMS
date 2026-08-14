import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  rows,
  as,
  ...props
}) => {
  const isTextarea = as === 'textarea' || type === 'textarea';

  return (
    <div className={`mb-3 text-start ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label d-flex align-items-center gap-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="position-relative">
        {Icon && (
          <div
            className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
            style={{ pointerEvents: 'none' }}
          >
            <Icon size={18} />
          </div>
        )}
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows || 4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-control glass-input ${Icon ? 'ps-5' : ''} ${error ? 'border-danger' : ''}`}
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-control glass-input ${Icon ? 'ps-5' : ''} ${error ? 'border-danger' : ''}`}
            {...props}
          />
        )}
      </div>
      {error && <div className="text-danger small mt-1 ps-1">{error}</div>}
    </div>
  );
};

export default Input;
