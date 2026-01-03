import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Similar to uploaded image style */}
      <div 
        className="relative rounded-xl gradient-bg flex items-center justify-center"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-2/3 h-2/3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" className="text-white" />
          <circle cx="9" cy="7" r="4" className="text-white" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" className="text-white/70" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" className="text-white/70" />
        </svg>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warning" />
      </div>
      
      {showText && (
        <span className={`font-bold ${text} gradient-text`}>
          CapitaHR
        </span>
      )}
    </div>
  );
};

export default Logo;
