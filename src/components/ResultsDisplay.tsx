
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

  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transcript_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadCSV = () => {
    let csv = 'SECTION: KEY FACTS AND ADMISSIONS\n';
    csv += 'Fact,Witness,Page/Line,Summary\n';
    result.keyFactsAndAdmissions.forEach(fact => {
      csv += `"${fact.fact.replace(/"/g, '""')}","${fact.witness}","${fact.pageLine}","${fact.summary.replace(/"/g, '""')}"\n`;
    });

    csv += '\n\nSECTION: EXHIBITS REFERENCED\n';
    csv += 'ID,Description,Page/Line\n';
    result.exhibitsReferenced.forEach(exhibit => {
      csv += `"${exhibit.id}","${exhibit.description.replace(/"/g, '""')}","${exhibit.pageLine}"\n`;
    });

    csv += '\n\nSECTION: OBJECTIONS LOG\n';
    csv += 'Type,By,Ruling,Page/Line\n';
    result.objectionsLog.forEach(objection => {
      csv += `"${objection.type}","${objection.by}","${objection.ruling}","${objection.pageLine}"\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transcript_analysis.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCopyToClipboard = async () => {
    const text = JSON.stringify(result, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="w-full">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
             <h2 className="text-3xl font-bold text-white">Analysis Results</h2>
             <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleCopyToClipboard}
                  className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-2 px-4 rounded-lg transition duration-300"
                  aria-label="Copy to clipboard"
                >
                  {copySuccess ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-2 px-4 rounded-lg transition duration-300"
                  aria-label="Download as CSV"
                >
                  Download CSV
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-2 px-4 rounded-lg transition duration-300"
                  aria-label="Download as JSON"
                >
                  Download JSON
                </button>
             </div>
        </div>

      <ResultSection title="Key Facts & Admissions">
        {result.keyFactsAndAdmissions.length > 0 ? (
            result.keyFactsAndAdmissions.map((fact, index) => <KeyFactCard key={index} item={fact} />)
        ) : <p className="text-gray-400">No key facts or admissions were identified.</p>}
      </ResultSection>

      <ResultSection title="Exhibits Referenced">
        {result.exhibitsReferenced.length > 0 ? (
            <table className="w-full text-left" role="table" aria-label="Exhibits referenced in transcript">
                <thead>
                    <tr className="text-gray-400 text-sm">
                        <th className="p-3" scope="col">ID</th><th className="p-3" scope="col">Description</th><th className="p-3" scope="col">Reference</th>
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
            <table className="w-full text-left" role="table" aria-label="Objections logged in transcript">
                <thead>
                    <tr className="text-gray-400 text-sm">
                        <th className="p-3" scope="col">Type</th><th className="p-3" scope="col">By</th><th className="p-3" scope="col">Ruling</th><th className="p-3" scope="col">Reference</th>
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
