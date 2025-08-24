import React, { useState, useEffect } from 'react';
import { Github, Key, User, Settings, Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface GitHubConfigProps {
  onConfigSave: (token: string, owner: string, userToken?: string, userOwner?: string) => void;
  isConfigured: boolean;
}

const GitHubConfig: React.FC<GitHubConfigProps> = ({ onConfigSave, isConfigured }) => {
  // Hardcoded credentials (hidden from UI)
  const [hardcodedToken] = useState('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');
  const [hardcodedOwner] = useState('nikhil1479');
  
  // User input credentials (visible in UI)
  const [userToken, setUserToken] = useState('');
  const [userOwner, setUserOwner] = useState('');
  
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfig, setShowConfig] = useState(!isConfigured);

  // Auto-configure with hardcoded values on mount
  useEffect(() => {
    if (!isConfigured && hardcodedToken && hardcodedOwner) {
      onConfigSave(hardcodedToken, hardcodedOwner);
    }
  }, [hardcodedToken, hardcodedOwner, isConfigured, onConfigSave]);

  const validateAndSave = async () => {
    if (!userToken.trim() || !userOwner.trim()) {
      alert('Please fill in both GitHub token and username');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');

    try {
      // Test the GitHub API with the user-provided credentials
      const response = await fetch(`https://api.github.com/user`, {
        headers: {
          'Authorization': `Bearer ${userToken.trim()}`,
          'Accept': 'application/vnd.github+json',
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Verify the username matches
        if (userData.login.toLowerCase() === userOwner.trim().toLowerCase()) {
          setValidationStatus('success');
          // Pass both hardcoded and user credentials for dual upload
          onConfigSave(hardcodedToken, hardcodedOwner, userToken.trim(), userOwner.trim());
          setShowConfig(false);
        } else {
          setValidationStatus('error');
          alert(`Username mismatch. Expected: ${userOwner}, but token belongs to: ${userData.login}`);
        }
      } else {
        setValidationStatus('error');
        alert('Invalid GitHub token or network error. Please check your credentials.');
      }
    } catch (error) {
      setValidationStatus('error');
      console.error('GitHub validation error:', error);
      alert('Failed to validate GitHub credentials. Please check your network connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const clearConfig = () => {
    setUserToken('');
    setUserOwner('');
    setValidationStatus('idle');
    setShowConfig(true);
  };

  if (isConfigured && !showConfig) {
    return (
      <div className="elegant-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={userOwner && userToken ? "p-2 bg-green-100 rounded-lg" : "p-2 bg-red-100 rounded-lg"}>
              {userOwner && userToken ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">GitHub Integration {userOwner && userToken ? 'Active' : 'Inactive'}</h3>
              <p className="text-sm text-neutral-600">
                {userOwner && userToken ? 'Chat files will be automatically uploaded to your personal repository' : 'Chat files will not be uploaded.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            title="Configure GitHub settings"
            aria-label="Configure GitHub settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-card p-8 mb-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Github className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
          GitHub Integration Setup
        </h3>
        <p className="text-neutral-600 font-medium">
          Add your GitHub credentials to backup chats to both our secure storage and your personal repository
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Creates a private repository called "chats" in your GitHub account</li>
              <li>• Uploads each chat file to both our secure storage and your personal repository</li>
              <li>• All data is encrypted and stored securely in your own repository</li>
              <li>• Provides you with complete ownership and control over your data</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* GitHub Username */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            GitHub Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={userOwner}
              onChange={(e) => setUserOwner(e.target.value)}
              placeholder="your-username"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">Your GitHub username (not email)</p>
        </div>

        {/* GitHub Token */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            GitHub Personal Access Token
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type={showToken ? 'text' : 'password'}
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Create one at{' '}
            <a 
              href="https://github.com/settings/tokens/new?scopes=repo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 underline"
            >
              GitHub Settings → Developer settings → Personal access tokens
            </a>
          </p>
        </div>

        {/* Token Requirements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Required Token Permissions:</p>
              <ul className="space-y-1 text-yellow-700">
                <li>• <code className="bg-yellow-100 px-1 rounded">repo</code> - Full control of private repositories</li>
                <li>• Token must be a "Classic" personal access token</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={validateAndSave}
            disabled={isValidating || !userToken.trim() || !userOwner.trim()}
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Validating...</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Save & Validate</span>
              </>
            )}
          </button>
          
          {isConfigured && (
            <button
              onClick={clearConfig}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
            >
              Clear Config
            </button>
          )}
        </div>

        {/* Validation Status */}
        {validationStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Configuration saved successfully!</span>
          </div>
        )}

        {validationStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Validation failed. Please check your credentials.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubConfig;
