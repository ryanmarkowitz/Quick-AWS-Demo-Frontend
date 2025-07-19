'use client';

import { useState, useEffect } from 'react';
import { fetchResults } from '@/utils/api';

interface Result {
  text: string;
}

export default function Results() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true);
        const data = await fetchResults();
        setResult(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch results. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getResults();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(getResults, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  if (!result && !loading && !error) {
    return (
      <div className="text-center py-10">
        <h1 className="page-title">Processing Results</h1>
        <p className="text-gray-600">No results found. Upload a PDF file to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Processing Results</h1>
      
      {result && (
        <div className="result-card">
          <div className="result-data">
            <pre className="result-data-content whitespace-pre-wrap">
              {result.text}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}