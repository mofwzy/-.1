
import React, { ReactNode } from 'react';

interface NeumorphicButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ children, onClick, className = '', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none';
  const enabledClasses = 'text-slate-700 bg-slate-100 shadow-[5px_5px_10px_#bec3cf,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]';
  const disabledClasses = 'text-slate-400 bg-slate-200 shadow-[inset_2px_2px_5px_#bec3cf,inset_-2px_-2px_5px_#ffffff] cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;
