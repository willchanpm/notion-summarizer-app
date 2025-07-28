// This is the record page where users can record their meetings
// This page integrates the Recorder component with OpenAI transcription
// and displays the results using the SummaryCard component

'use client'; // This is needed for React hooks and event handlers

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Recorder from '../../components/Recorder';
import SummaryCard from '../../components/SummaryCard';

export default function RecordPage() {
  // State to store the transcript and summary from OpenAI
  const [transcript, setTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  
  // State to track loading status while processing audio
  const [loading, setLoading] = useState<boolean>(false);
  
  // State to track Notion push status
  const [pushingToNotion, setPushingToNotion] = useState<boolean>(false);
  const [notionStatus, setNotionStatus] = useState<string>('');

  // Function to handle when recording stops
  // This is called by the Recorder component with the audio blob
  const handleRecordingStop = async (audioBlob: Blob) => {
    try {
      // Set loading state to show user that processing is happening
      setLoading(true);
      setNotionStatus(''); // Clear any previous Notion status
      
      // Clear any previous results
      setTranscript('');
      setSummary('');
      
      console.log('Sending audio to API for processing...');
      
      // Create FormData to send the audio blob
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      
      // Send the audio blob to our API route
      const response = await fetch('/api/transcribe-and-summarise', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }
      
      const result = await response.json();
      
      // Store the results in state
      setTranscript(result.transcript);
      setSummary(result.summary);
      
      console.log('Audio processing completed!');
      
    } catch (error) {
      // Handle any errors that occur during processing
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
    } finally {
      // Always clear loading state, whether successful or not
      setLoading(false);
    }
  };

  // Function to push results to Notion
  const handlePushToNotion = async () => {
    if (!transcript || !summary) {
      alert('No transcript or summary to push to Notion');
      return;
    }

    try {
      setPushingToNotion(true);
      setNotionStatus('Pushing to Notion...');
      
      const response = await fetch('/api/push-to-notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, summary }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to push to Notion');
      }
      
      setNotionStatus('Successfully pushed to Notion! ✅');
      console.log('Successfully pushed to Notion');
      
    } catch (error) {
      console.error('Error pushing to Notion:', error);
      setNotionStatus('Failed to push to Notion ❌');
      alert('Error pushing to Notion. Please try again.');
    } finally {
      setPushingToNotion(false);
    }
  };

  return (
    <div className="record-page">
      {/* Navigation back to homepage */}
      <nav className="navigation">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </nav>

      {/* Main heading for the record page */}
      <h1>Record Meeting</h1>
      
      {/* Audio recorder component */}
      <Recorder onStop={handleRecordingStop} />
      
      {/* Loading indicator while processing audio */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Transcribing...</p>
        </div>
      )}
      
      {/* Display results if we have transcript and summary */}
      {transcript && summary && (
        <div className="results-container">
          <SummaryCard transcript={transcript} summary={summary} />
          
          {/* Push to Notion button */}
          <div className="notion-section">
            <button 
              onClick={handlePushToNotion}
              disabled={pushingToNotion}
              className="notion-button"
            >
              {pushingToNotion ? 'Pushing to Notion...' : '📝 Save to Notion'}
            </button>
            
            {/* Notion status message */}
            {notionStatus && (
              <p className="notion-status">{notionStatus}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Basic styling */}
      <style jsx>{`
        .record-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
          background-color: #ffffff;
          min-height: 100vh;
        }
        
        .navigation {
          text-align: left;
          margin-bottom: 2rem;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #15803d;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        
        .back-link:hover {
          background-color: #dcfce7;
          color: #166534;
          transform: translateY(-1px);
        }
        
        h1 {
          color: #1f2937;
          margin-bottom: 2rem;
          font-size: 2.5rem;
          font-weight: bold;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
          padding: 2rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #15803d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-container p {
          color: #6b7280;
          font-weight: 500;
          margin: 0;
        }
        
        .results-container {
          margin-top: 2rem;
        }
        
        .notion-section {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .notion-button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #15803d;
          color: white;
          box-shadow: 0 2px 4px rgba(21, 128, 61, 0.2);
        }
        
        .notion-button:hover:not(:disabled) {
          background-color: #166534;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(21, 128, 61, 0.3);
        }
        
        .notion-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }
        
        .notion-status {
          color: #6b7280;
          font-weight: 500;
          margin: 0;
        }
      `}</style>
    </div>
  );
} 