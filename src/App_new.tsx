import { useState } from 'react';
import { Heart, MessageCircle, BarChart3, Smile, Sparkles, Smartphone, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="relative inline-block">
              <Heart className="w-20 h-20 text-primary-500 mx-auto mb-6 heart-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-accent-500 animate-float" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6">
              WhatsApp Chat Analyzer
            </h1>
            <p className="text-xl text-neutral-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Discover the beautiful analytics of your love story through your WhatsApp conversations
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="elegant-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">Chat Analysis</h3>
              <p className="text-neutral-600">Deep insights into your conversations, message patterns, and special moments</p>
            </div>
            
            <div className="elegant-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <BarChart3 className="w-12 h-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">Beautiful Charts</h3>
              <p className="text-neutral-600">Stunning visualizations of your love story with romantic color themes</p>
            </div>
            
            <div className="elegant-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <Smile className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">Emoji Insights</h3>
              <p className="text-neutral-600">Discover your most used emojis and love words throughout your relationship</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!chatData ? (
          <div className="text-center animate-fade-in">
            <div className="mb-16">
              
              
              
              
              

              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                
                
                
                
                
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
                <p className="text-neutral-700 font-medium text-center flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span><strong>Privacy Note:</strong> All processing happens locally in your browser. 
                  Your chat data never leaves your device!</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Analytics chatData={chatData} onReset={() => setChatData(null)} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-6 border-t border-neutral-200">
        <p className="text-neutral-600 flex items-center justify-center space-x-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>for couples who love data</span>
        </p>
      </footer>
      
    </div>
  );
}

export default App;
