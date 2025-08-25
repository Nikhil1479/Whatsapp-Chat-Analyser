import { useState } from 'react';
import { Heart, MessageCircle, BarChart3, Smile, Sparkles, Smartphone } from 'lucide-react';
import FileUpload from './components/FileUpload';
import Analytics from './components/Analytics';
import { ChatData } from './types/ChatTypes';
import './App.css';

function App() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (data: ChatData) => {
    setChatData(data);
  };

  return (
    <div className="min-h-55screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl">
              <Heart className="w-6 h-6 text-white heart-pulse" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold text-neutral-900">
                Chat <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-sm text-neutral-600 font-medium">
                Discover your conversation insights
              </p>
            </div>
            <div className="p-2 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl">
              <MessageCircle className="w-6 h-6 text-white animate-float" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!chatData ? (
          <div className="text-center animate-fade-in">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-3 mb-8 border border-neutral-200/50">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-700 font-medium text-sm">Analyze your conversations beautifully</span>
              </div>
              
              <h2 className="text-5xl font-display font-bold text-neutral-900 mb-6 leading-tight">
                Transform Your Chats Into
                <br />
                <span className="text-gradient">Beautiful Insights</span>
              </h2>
              
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                Upload your exported WhatsApp chat and discover amazing patterns, 
                emotions, and memories hidden in your conversations.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="elegant-card p-8 text-center group">
                  <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-900 mb-3">
                    Smart Analytics
                  </h3>
                  <p className="text-neutral-600 font-medium">
                    Advanced statistics and patterns in your messaging behavior
                  </p>
                </div>
                
                <div className="elegant-card p-8 text-center group">
                  <div className="p-4 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Smile className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-900 mb-3">
                    Emotion Insights
                  </h3>
                  <p className="text-neutral-600 font-medium">
                    Discover emotional patterns and favorite expressions
                  </p>
                </div>
                
                <div className="elegant-card p-8 text-center group">
                  <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white heart-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-900 mb-3">
                    Love Metrics
                  </h3>
                  <p className="text-neutral-600 font-medium">
                    Track affection, cute nicknames, and special moments
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Component */}
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} setIsLoading={setIsLoading} />
            
            {/* Instructions */}
            <div className="mt-16 elegant-card p-10 text-left max-w-4xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-8 text-center flex items-center justify-center space-x-2">
                <Smartphone className="w-6 h-6 text-blue-500" />
                <span>How to Export Your WhatsApp Chat</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900 text-lg">For iPhone:</h4>
                  <ol className="space-y-3 text-neutral-700">
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm font-medium flex items-center justify-center">1</span>
                      <span>Open WhatsApp and go to the chat you want to export</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm font-medium flex items-center justify-center">2</span>
                      <span>Tap the contact name at the top</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm font-medium flex items-center justify-center">3</span>
                      <span>Scroll down and tap "Export Chat"</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm font-medium flex items-center justify-center">4</span>
                      <span>Choose "Without Media" for faster processing</span>
                    </li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900 text-lg">For Android:</h4>
                  <ol className="space-y-3 text-neutral-700">
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full text-sm font-medium flex items-center justify-center">1</span>
                      <span>Open WhatsApp and select the chat</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full text-sm font-medium flex items-center justify-center">2</span>
                      <span>Tap the three dots menu</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full text-sm font-medium flex items-center justify-center">3</span>
                      <span>Select "More" → "Export chat"</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full text-sm font-medium flex items-center justify-center">4</span>
                      <span>Choose "Without Media"</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-200/50">
                <p className="text-neutral-700 font-medium text-center">
                  � <strong>Privacy Note:</strong> All processing happens locally in your browser. 
                  Your chat data never leaves your device!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Analytics chatData={chatData} onReset={() => setChatData(null)} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-12 border-t border-neutral-200/50 glass-effect">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-neutral-600 font-medium">Made with</span>
          <Heart className="w-5 h-5 text-primary-500 heart-pulse" />
          <span className="text-neutral-600 font-medium">for meaningful conversations</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
