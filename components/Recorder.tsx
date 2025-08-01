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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center">
        {/* Main recording button */}
        <button 
          onClick={handleRecordingToggle}
          className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={false}
        >
          <div className={`w-4 h-4 rounded-full mr-3 ${
            isRecording ? 'bg-red-200 animate-pulse' : 'bg-blue-200'
          }`}></div>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {/* Recording status */}
        {isRecording && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Recording in progress...</span>
            </div>
            <p className="text-sm text-red-600 mt-2">Click the button above to stop recording</p>
          </div>
        )}
        
        {/* Instructions */}
        {!isRecording && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 font-medium">Ready to record</p>
            <p className="text-sm text-blue-600 mt-1">Click the button above to start recording your meeting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recorder; 