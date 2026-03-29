import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
};