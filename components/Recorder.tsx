// Audio recorder component using the MediaRecorder API
// This component allows users to record audio from their microphone
// and provides the recorded audio as a blob to a parent component

import React, { useState, useRef } from 'react';

// Define the props interface for the Recorder component
interface RecorderProps {
  onStop: (blob: Blob) => void; // Callback function that receives the recorded audio blob
}

const Recorder: React.FC<RecorderProps> = ({ onStop }) => {
  // State to track if we're currently recording
  const [isRecording, setIsRecording] = useState(false);
  
  // Ref to store the MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Ref to store the recorded audio chunks
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to start recording audio
  const startRecording = async () => {
    try {
      // Request permission to access the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder instance with the audio stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear any previous audio chunks
      audioChunksRef.current = [];
      
      // Event listener for when data is available (audio chunk recorded)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Event listener for when recording stops
      mediaRecorder.onstop = () => {
        // Create a blob from all the recorded audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Call the onStop callback with the recorded audio blob
        onStop(audioBlob);
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      // Handle errors (e.g., user denied microphone permission)
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  // Function to stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop the MediaRecorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Function to handle button click (toggle between start/stop)
  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="recorder-container">
      {/* Main recording button */}
      <button 
        onClick={handleRecordingToggle}
        className={`recording-button ${isRecording ? 'recording' : ''}`}
        disabled={false} // You could disable this if needed
      >
        {/* Show different text and styling based on recording state */}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      {/* Optional: Show recording status */}
      {isRecording && (
        <div className="recording-status">
          <span className="recording-indicator">●</span>
          Recording...
        </div>
      )}
      
      {/* Basic styling */}
      <style jsx>{`
        .recorder-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background-color: #ffffff;
          max-width: 350px;
          margin: 0 auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .recording-button {
          padding: 14px 28px;
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
        
        .recording-button:hover {
          background-color: #166534;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(21, 128, 61, 0.3);
        }
        
        .recording-button.recording {
          background-color: #dc2626;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        }
        
        .recording-button.recording:hover {
          background-color: #b91c1c;
          box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }
        
        .recording-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #dc2626;
          font-weight: 500;
          padding: 0.5rem 1rem;
          background-color: #fef2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }
        
        .recording-indicator {
          color: #dc2626;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Recorder; 