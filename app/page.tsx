import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meeting Recorder
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Record your meetings and get AI-powered transcripts with speaker identification and summaries
            </p>
          </div>

          {/* Main Action Button */}
          <div className="mb-16">
            <Link
              href="/record"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              🎤 Start Recording
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">🎙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Record Audio</h3>
              <p className="text-gray-600">Record meetings directly in your browser with crystal clear audio</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Transcription</h3>
              <p className="text-gray-600">Convert speech to text using OpenAI's advanced Whisper API</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaker Detection</h3>
              <p className="text-gray-600">Automatically identify and label different speakers in conversations</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Summaries</h3>
              <p className="text-gray-600">Get AI-generated bullet-point summaries of key points and decisions</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Record</h3>
                <p className="text-gray-600">Click start and record your meeting with crystal clear audio</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Process</h3>
                <p className="text-gray-600">AI transcribes, identifies speakers, and creates summaries</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save</h3>
                <p className="text-gray-600">Save everything to Notion with one click</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
            <p className="text-blue-100 mb-6">Start recording and get AI-powered insights in minutes</p>
            <Link
              href="/record"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
