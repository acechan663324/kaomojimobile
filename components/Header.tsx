
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        {/* SVG Logo Icon */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true" // Hide from screen readers as the text is present
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#logo-gradient)"
            strokeWidth="5"
            fill="rgba(30, 41, 59, 0.5)"
          />
          <text
            x="50"
            y="55"
            fontFamily="monospace, sans-serif"
            fontSize="30"
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            (^_−)
          </text>
        </svg>

        {/* Site Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Kaomoji World
          </span>
        </h1>
      </div>
      <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-400">
        Your ultimate destination for finding, copying, and creating the perfect kaomoji for any mood.
      </p>
    </header>
  );
};