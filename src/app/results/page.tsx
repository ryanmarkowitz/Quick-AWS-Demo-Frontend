'use client';

import { useState, useEffect } from 'react';
import { fetchResults, fetchLargeResult } from '@/utils/api';

interface Result {
  id: string;
  filename: string;
  status: string;
  timestamp: string;
  data?: any;
  hasLargeContent?: boolean;
}

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<{[key: string]: string}>({});
  const [loadingContent, setLoadingContent] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true);
        const data = await fetchResults();
        setResults(data);
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

  // Function to load large content when needed
  const loadLargeContent = async (resultId: string) => {
    if (expandedContent[resultId]) {
      return; // Content already loaded
    }
    
    try {
      setLoadingContent(prev => ({ ...prev, [resultId]: true }));
      const content = await fetchLargeResult(resultId);
      setExpandedContent(prev => ({ ...prev, [resultId]: content }));
    } catch (err) {
      console.error(`Error loading content for ${resultId}:`, err);
    } finally {
      setLoadingContent(prev => ({ ...prev, [resultId]: false }));
    }
  };

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

  if (results.length === 0) {
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
      
      <div className="grid gap-4">
        {results.map((result) => (
          <div 
            key={result.id} 
            className="result-card"
          >
            <div className="result-header">
              <h2 className="result-title">{result.filename}</h2>
              <span 
                className={`status-badge ${
                  result.status === 'completed' 
                    ? 'status-completed' 
                    : result.status === 'processing' 
                    ? 'status-processing'
                    : 'status-error'
                }`}
              >
                {result.status}
              </span>
            </div>
            
            <p className="result-timestamp">
              Uploaded: {new Date(result.timestamp).toLocaleString()}
            </p>
            
            {result.status === 'completed' && (
              <div className="result-data">
                {result.hasLargeContent ? (
                  <div>
                    {!expandedContent[result.id] && !loadingContent[result.id] && (
                      <button 
                        onClick={() => loadLargeContent(result.id)}
                        className="btn btn-primary text-sm mt-2 mb-2"
                      >
                        Load Content
                      </button>
                    )}
                    
                    {loadingContent[result.id] && (
                      <div className="text-center py-4">
                        <div className="loading-spinner inline-block h-6 w-6"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading content...</p>
                      </div>
                    )}
                    
                    {expandedContent[result.id] && (
                      <pre className="result-data-content">
                        {expandedContent[result.id]}
                      </pre>
                    )}
                  </div>
                ) : result.data ? (
                  <pre className="result-data-content">
                    {typeof result.data === 'string' 
                      ? result.data 
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}