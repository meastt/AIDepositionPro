
import React from 'react';

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-6 md:p-8 bg-gray-800/50 border-b border-gray-700">
      <div className="flex items-center justify-center gap-4">
        <DocumentTextIcon className="text-cyan-400" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          AI Deposition Transcript Mapper
        </h1>
      </div>
       <p className="mt-2 text-gray-400">Instantly extract structured insights from your legal documents.</p>
    </header>
  );
};
