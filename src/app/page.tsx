'use client';

import { useState } from 'react';
import { uploadToS3 } from '@/utils/s3';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      await uploadToS3(file);
      
      setUploadSuccess(true);
      setFile(null);
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-main">
      <h1 className="page-title">Upload PDF for Processing</h1>
      
      {uploadSuccess && (
        <div className="alert alert-success">
          File uploaded successfully! Check the results page soon.
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="file-drop-area">
          <label className="file-input-label">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange}
              className="hidden" 
            />
            <div className="file-name-display">
              {file ? file.name : 'Click to select a PDF file'}
            </div>
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={!file || uploading}
          className={`btn w-full ${
            !file || uploading 
              ? 'btn-disabled' 
              : 'btn-primary'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
}