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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Record Meeting
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Record your meeting and get AI-powered transcription with speaker identification and summaries
          </p>
        </div>
        
        {/* Audio recorder component */}
        <div className="mb-8">
          <Recorder onStop={handleRecordingStop} />
        </div>
        
        {/* Loading indicator while processing audio */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Processing your recording...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 15-45 seconds</p>
            </div>
          </div>
        )}
        
        {/* Display results if we have transcript and summary */}
        {transcript && summary && (
          <div className="space-y-8">
            <SummaryCard transcript={transcript} summary={summary} />
            
            {/* Push to Notion button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="text-center">
                <button 
                  onClick={handlePushToNotion}
                  disabled={pushingToNotion}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {pushingToNotion ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Pushing to Notion...
                    </>
                  ) : (
                    '📝 Save to Notion'
                  )}
                </button>
                
                {/* Notion status message */}
                {notionStatus && (
                  <p className={`mt-4 text-sm font-medium ${
                    notionStatus.includes('Successfully') 
                      ? 'text-green-600' 
                      : notionStatus.includes('Failed') 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                  }`}>
                    {notionStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 