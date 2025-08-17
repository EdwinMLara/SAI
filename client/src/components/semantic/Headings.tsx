import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-1 h-8 bg-primary-color rounded-sm"></div>
      <h1 className="text-3xl font-bold text-primary-color">{children}</h1>
    </div>
  );
};

export const H2: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-1 h-6 bg-primary-color rounded-sm"></div>
      <h2 className="text-2xl font-semibold text-primary-color">{children}</h2>
    </div>
  );
};

export const H3: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-1 h-5 bg-primary-color rounded-sm"></div>
      <h3 className="text-xl font-medium text-primary-color">{children}</h3>
    </div>
  );
};

export const H4: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-1 h-4 bg-primary-color rounded-sm"></div>
      <h4 className="text-lg font-medium text-primary-color">{children}</h4>
    </div>
  );
};

// Exportar todos los headings en un objeto para facilitar el uso
export const Headings = {
  H1,
  H2,
  H3,
  H4,
};
