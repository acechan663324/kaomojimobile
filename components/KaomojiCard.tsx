import React from 'react';

interface KaomojiCardProps {
  kaomoji: string;
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

export const KaomojiCard: React.FC<KaomojiCardProps> = ({ kaomoji, onClick, children, className, title }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 rounded-lg h-20 sm:h-24 inline-flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/20 relative max-w-full ${className}`}
      title={title}
    >
      <span className={`transition-opacity duration-300 text-lg sm:text-xl md:text-2xl font-mono whitespace-nowrap overflow-x-auto px-4 ${children ? 'opacity-0' : 'opacity-100'}`}>
        {kaomoji}
      </span>
      {children && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {children}
         </div>
      )}
    </div>
  );
};