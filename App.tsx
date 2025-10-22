
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import type { AnalysisResult } from './types';
import { analyzeTranscript } from './services/geminiService';

declare const pdfjsLib: any;

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setError(null);
  };

  const extractTextFromPdf = async (pdfFile: File): Promise<string> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      setLoadingMessage('Reading transcript file...');
      let transcriptText = '';
      if (file.type === 'application/pdf') {
        setLoadingMessage('Extracting text from PDF...');
        transcriptText = await extractTextFromPdf(file);
      } else {
        transcriptText = await file.text();
      }

      if (!transcriptText.trim()) {
        throw new Error('The file is empty or text could not be extracted.');
      }
      
      setLoadingMessage('Analyzing transcript with AI... This may take a moment for large files.');
      const result = await analyzeTranscript(transcriptText);
      setAnalysisResult(result);

    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [file]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-grow">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Upload Transcript</h2>
          <p className="text-gray-400 mb-6">Upload a deposition or e-Discovery transcript (.pdf or .txt) to begin.</p>
          
          <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
          
          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Transcript'}
          </button>
          
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>

        {isLoading && <LoadingIndicator message={loadingMessage} />}
        
        {analysisResult && (
          <div className="mt-10">
            <ResultsDisplay result={analysisResult} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
