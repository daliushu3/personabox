
import React from 'react';

interface MetalButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position: 'top-left' | 'bottom-right' | 'default';
  className?: string;
}

export const MetalButton: React.FC<MetalButtonProps> = ({ onClick, icon, label, position, className = '' }) => {
  const posClasses = {
    'top-left': 'top-8 left-8',
    'bottom-right': 'bottom-8 right-8',
    'default': '',
  };

  return (
    <div className={`fixed ${posClasses[position]} z-50 group`}>
      <button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center 
          bg-gradient-to-br from-slate-200 to-slate-400 
          border-4 border-slate-600 shadow-xl shadow-blue-900/20
          hover:scale-110 active:scale-95 transition-all duration-300
          overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
        <span className="text-slate-900 text-2xl group-hover:text-blue-600 transition-colors">
          {icon}
        </span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        bg-slate-900/90 text-slate-100 text-sm py-2 px-4 rounded-md border border-slate-700 backdrop-blur-sm
        whitespace-nowrap shadow-2xl
        ${position === 'top-left' ? 'left-20 top-4' : 'right-20 bottom-4'}
      ">
        {label}
        <div className={`absolute top-1/2 -translate-y-1/2 border-4 
          ${position === 'top-left' ? '-left-2 border-r-slate-900 border-t-transparent border-b-transparent border-l-transparent' : '-right-2 border-l-slate-900 border-t-transparent border-b-transparent border-r-transparent'}`} 
        />
      </div>
    </div>
  );
};
