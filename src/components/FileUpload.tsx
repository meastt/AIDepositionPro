
import React, { useState, useCallback } from 'react';

const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
  onError?: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, onError }) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
        onError?.('Please upload a valid PDF or TXT file.');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        onError?.(`File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }

      // Warn about large files
      if (file.size > 10 * 1024 * 1024 && onError) {
        console.warn(`Large file detected: ${(file.size / 1024 / 1024).toFixed(2)}MB. Processing may take longer.`);
      }

      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      handleFileChange(e.dataTransfer.files);
    }
  }, [disabled]);
  
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  return (
    <label
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex justify-center w-full h-48 px-4 transition bg-gray-700 border-2 ${isDragging ? 'border-cyan-400' : 'border-gray-600'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="flex items-center space-x-2">
        <UploadCloudIcon className="w-10 h-10 text-gray-400" />
        <span className="font-medium text-gray-400">
          {fileName ? (
            <span className="text-cyan-400">{fileName}</span>
          ) : (
            <>
              Drop files to Attach, or <span className="text-cyan-400 underline">browse</span>
            </>
          )}
        </span>
      </span>
      <input
        type="file"
        name="file_upload"
        className="hidden"
        accept=".pdf,.txt"
        onChange={onInputChange}
        disabled={disabled}
        aria-label="Upload transcript file"
      />
    </label>
  );
};
