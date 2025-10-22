
import React from 'react';
import type { AnalysisResult, KeyFact, Exhibit, Objection } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
}

const ResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h3>
        {children}
    </div>
);

const KeyFactCard: React.FC<{ item: KeyFact }> = ({ item }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg mb-4 border-l-4 border-cyan-500">
        <p className="font-semibold text-white">"{item.fact}"</p>
        <p className="text-sm text-gray-300 mt-2">{item.summary}</p>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
            <span>Witness: <span className="font-medium text-gray-200">{item.witness}</span></span>
            <span>Ref: <span className="font-medium text-gray-200">{item.pageLine}</span></span>
        </div>
    </div>
);

const ExhibitRow: React.FC<{ item: Exhibit }> = ({ item }) => (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50">
        <td className="p-3 font-semibold text-gray-200">{item.id}</td>
        <td className="p-3 text-gray-300">{item.description}</td>
        <td className="p-3 text-gray-400">{item.pageLine}</td>
    </tr>
);

const ObjectionRow: React.FC<{ item: Objection }> = ({ item }) => (
     <tr className="border-b border-gray-700 hover:bg-gray-700/50">
        <td className="p-3 font-semibold text-gray-200">{item.type}</td>
        <td className="p-3 text-gray-300">{item.by}</td>
        <td className="p-3 text-gray-400">
             <span className={`px-2 py-1 text-xs rounded-full ${
                item.ruling === 'Sustained' ? 'bg-red-900 text-red-300' :
                item.ruling === 'Overruled' ? 'bg-green-900 text-green-300' :
                'bg-gray-600 text-gray-300'
             }`}>
                {item.ruling}
             </span>
        </td>
        <td className="p-3 text-gray-400">{item.pageLine}</td>
    </tr>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transcript_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-3xl font-bold text-white">Analysis Results</h2>
             <button
                onClick={handleDownload}
                className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-2 px-4 rounded-lg transition duration-300"
             >
                Download JSON
            </button>
        </div>

      <ResultSection title="Key Facts & Admissions">
        {result.keyFactsAndAdmissions.length > 0 ? (
            result.keyFactsAndAdmissions.map((fact, index) => <KeyFactCard key={index} item={fact} />)
        ) : <p className="text-gray-400">No key facts or admissions were identified.</p>}
      </ResultSection>

      <ResultSection title="Exhibits Referenced">
        {result.exhibitsReferenced.length > 0 ? (
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-400 text-sm">
                        <th className="p-3">ID</th><th className="p-3">Description</th><th className="p-3">Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {result.exhibitsReferenced.map((exhibit, index) => <ExhibitRow key={index} item={exhibit} />)}
                </tbody>
            </table>
        ) : <p className="text-gray-400">No exhibits were referenced.</p>}
      </ResultSection>
      
      <ResultSection title="Objections Log">
         {result.objectionsLog.length > 0 ? (
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-400 text-sm">
                        <th className="p-3">Type</th><th className="p-3">By</th><th className="p-3">Ruling</th><th className="p-3">Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {result.objectionsLog.map((objection, index) => <ObjectionRow key={index} item={objection} />)}
                </tbody>
            </table>
         ) : <p className="text-gray-400">No objections were logged.</p>}
      </ResultSection>
    </div>
  );
};
