import React from 'react';

export const Button = ({
  children,
  variant = 'glass', // 'primary', 'success', 'danger', 'glass'
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  let variantClass = 'glass-btn';
  if (variant === 'primary') variantClass = 'glass-btn glass-btn-primary';
  if (variant === 'success') variantClass = 'glass-btn glass-btn-success';
  if (variant === 'danger') variantClass = 'glass-btn glass-btn-danger';

  const sizeClass = size === 'sm' ? 'py-1 px-2.5 fs-7' : size === 'lg' ? 'py-3 px-4 fs-5' : 'py-2 px-3.5';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${variantClass} ${sizeClass} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} className="me-1" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
