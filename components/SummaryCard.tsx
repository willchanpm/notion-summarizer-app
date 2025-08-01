// This component displays meeting transcripts and summaries
// It receives the transcribed text and summary from the parent component
// and presents them in a clean, readable format with speaker diarization

import React from 'react';

// Define the props interface for the SummaryCard component
interface SummaryCardProps {
  transcript: string;
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ transcript, summary }) => {
  // Function to format transcript with speaker highlighting
  const formatTranscript = (text: string) => {
    // Split by lines and format speaker labels
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check if line starts with a speaker label (Speaker 1:, Speaker 2:, etc.)
      const speakerMatch = line.match(/^(Speaker \d+:)/);
      if (speakerMatch) {
        const speakerLabel = speakerMatch[1];
        const content = line.substring(speakerLabel.length).trim();
        return (
          <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-3">
            <span className="font-semibold text-blue-700 mr-2">{speakerLabel}</span>
            <span className="text-gray-700">{content}</span>
          </div>
        );
      }
      // If no speaker label, just return the line as is
      return <div key={index} className="text-gray-600 mb-2">{line}</div>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-blue-600 text-xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Meeting Summary</h3>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
      
      {/* Transcript section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-blue-600 text-xl">🎤</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Full Transcript</h3>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">
          {formatTranscript(transcript)}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard; 