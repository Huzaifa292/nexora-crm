import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2',
  }[size];

  const variants = {
    primary:
      'bg-gradient-to-r from-[#7967FF] via-[#6854FD] to-[#38BDF8] text-white shadow-lg shadow-[#7967FF]/25 hover:shadow-[#7967FF]/40 hover:brightness-110 border border-white/10',
    secondary:
      'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 hover:border-white/20 backdrop-blur-md',
    outline:
      'border border-[#7967FF]/40 text-[#A78BFA] hover:bg-[#7967FF]/10 hover:border-[#7967FF]',
    danger:
      'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 shadow-md shadow-rose-500/10',
    ghost:
      'text-slate-400 hover:text-white hover:bg-white/5',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes} ${variants} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};

