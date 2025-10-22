
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-10 bg-gray-800/50 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      <p className="mt-4 text-lg text-gray-300">{message}</p>
    </div>
  );
};
