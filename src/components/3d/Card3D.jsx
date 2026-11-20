import React from 'react';
import { useTilt3D } from '../../hooks/useTilt3D';

/**
 * Card3D provides a layered 3D tilt card with ambient edge glow and glassmorphism
 */
export const Card3D = ({
  children,
  className = '',
  maxTilt = 6,
  scale = 1.015,
  onClick,
  glowColor = 'rgba(121, 103, 255, 0.15)',
}) => {
  const { cardRef, tiltStyle, handleMouseMove, handleMouseLeave } = useTilt3D(maxTilt, scale);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={tiltStyle}
      className={`relative group rounded-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200/80 
        bg-[#151E30]/75 dark:bg-[#151E30]/80 light:bg-white/90 backdrop-blur-xl
        shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] 
        hover:shadow-[0_20px_45px_-12px_rgba(121,103,255,0.2)] 
        hover:border-[#7967FF]/30 transition-all duration-300 preserve-3d ${className}`}
    >
      {/* Decorative gradient sheen highlight */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)`
        }}
      />
      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

