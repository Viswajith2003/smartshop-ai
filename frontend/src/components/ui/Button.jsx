import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BUTTON_VARIANTS } from '../../constants/ui';

const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  onClick,
  to,
  href,
  target,
  type = 'button',
  pill = false,
  block = false,
  ...props
}) => {
  const buttonClasses = useMemo(() => {
    const baseClasses = 'btn';
    const variantClass = variant.includes('outline-') 
      ? BUTTON_VARIANTS.outline?.[variant.replace('outline-', '')] || BUTTON_VARIANTS.primary
      : BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
    
    const sizeClass = size !== 'md' ? `btn-${size}` : '';
    const pillClass = pill ? 'rounded-pill' : '';
    const blockClass = block ? 'w-100' : '';
    
    return [
      baseClasses,
      variantClass,
      sizeClass,
      pillClass,
      blockClass,
      className
    ].filter(Boolean).join(' ');
  }, [variant, size, pill, block, className]);

  const handleClick = useCallback((e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }, [onClick, disabled, loading]);

  const content = useMemo(() => {
    const iconElement = icon && (
      <i className={`${icon} ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i>
    );
    
    if (loading) {
      return (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {iconElement}
          {children && <span className="ms-2">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span className="me-2">{children}</span>}
          {iconElement}
        </>
      );
    }

    return children;
  }, [icon, loading, children, iconPosition]);
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      style={style}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;