// This component displays meeting transcripts and summaries
// It receives the transcribed text and summary from the parent component
// and presents them in a clean, readable format

import React from 'react';

// Define the props interface for the SummaryCard component
interface SummaryCardProps {
  transcript: string;
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ transcript, summary }) => {
  return (
    <div className="summary-card">
      {/* Summary section */}
      <div className="summary-section">
        <h3>Meeting Summary</h3>
        <p className="summary-text">{summary}</p>
      </div>
      
      {/* Transcript section */}
      <div className="transcript-section">
        <h3>Full Transcript</h3>
        <p className="transcript-text">{transcript}</p>
      </div>
      
      {/* Basic styling */}
      <style jsx>{`
        .summary-card {
          margin-top: 2rem;
          padding: 2rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: left;
        }
        
        .summary-section {
          margin-bottom: 2rem;
        }
        
        .transcript-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }
        
        h3 {
          color: #1f2937;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .summary-text {
          color: #374151;
          line-height: 1.6;
          margin: 0;
          padding: 1.5rem;
          background-color: #f0fdf4;
          border-radius: 8px;
          border-left: 4px solid #15803d;
          border: 1px solid #bbf7d0;
        }
        
        .transcript-text {
          color: #374151;
          line-height: 1.6;
          margin: 0;
          padding: 1.5rem;
          background-color: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #10b981;
          border: 1px solid #d1fae5;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default SummaryCard; 