
import React, { ReactNode } from 'react';

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = 'p-4 sm:p-6 bg-slate-100 rounded-2xl transition-all duration-300';
  const shadowClasses = 'shadow-[7px_7px_15px_#bec3cf,-7px_-7px_15px_#ffffff]';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${shadowClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default NeumorphicCard;
