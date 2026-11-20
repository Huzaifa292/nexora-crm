import React from 'react';
import { getStatusColor } from '../../utils/formatters';

export const Badge = ({ children, status, className = '', variant = 'default', size = 'sm' }) => {
  const statusClasses = status ? getStatusColor(status) : '';
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }[size] || 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: statusClasses || 'bg-white/5 text-slate-300 border border-white/10',
    purple: 'bg-[#7967FF]/15 text-[#A78BFA] border border-[#7967FF]/30',
    blue: 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

