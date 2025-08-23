# 🔧 WhatsApp Chat Analyzer - API & Developer Guide

This document provides detailed API references, development patterns, and implementation guides for the WhatsApp Chat Analyzer.

## 📋 Table of Contents

1. [Type Definitions](#type-definitions)
2. [Component APIs](#component-apis)
3. [Utility Functions](#utility-functions)
4. [Analytics Algorithms](#analytics-algorithms)
5. [Development Patterns](#development-patterns)
6. [Error Handling](#error-handling)
7. [Performance Guidelines](#performance-guidelines)

## 🏷️ Type Definitions

### Core Data Structures

```typescript
// Primary message interface
interface Message {
  timestamp: Date;           // Parsed timestamp from chat
  sender: string;           // Participant name
  content: string;          // Message text content
  isMedia: boolean;         // True for media/attachment messages
}

// Chat data container
interface ChatData {
  messages: Message[];                          // All parsed messages
  participants: string[];                      // Unique participant names
  dateRange: { start: Date; end: Date };      // Chat timeline boundaries
  totalMessages: number;                       // Message count
  totalDays: number;                          // Days between first and last message
}

// Comprehensive analytics results
interface AnalyticsData {
  messagesByParticipant: { [key: string]: number };     // Message count per person
  messagesByDay: { [key: string]: number };             // Daily message distribution
  messagesByHour: { [key: number]: number };            // Hourly activity patterns
  emojiStats: { [key: string]: number };                // Emoji frequency analysis
  wordStats: { [key: string]: number };                 // Word frequency (top 50)
  averageResponseTime: { [key: string]: number };       // Response time in minutes
  longestConversation: { date: string; messageCount: number }; // Peak activity day
  loveWords: { [key: string]: number };                 // Romantic expressions count
  messagesByMonth: { [key: string]: number };           // Monthly message trends
  weeklyActivity: { [key: string]: number };            // Day-of-week patterns
  timeOfDayActivity: {                                   // Activity by time periods
    morning: number;    // 6 AM - 12 PM
    afternoon: number;  // 12 PM - 6 PM
    evening: number;    // 6 PM - 10 PM
    night: number;      // 10 PM - 6 AM
  };
  questionStats: { [key: string]: number };             // Question frequency
  exclamationStats: { [key: string]: number };          // Exclamation usage
  longestMessages: MessageAnalysis[];                   // Top 5 longest messages
  shortestMessages: MessageAnalysis[];                  // Top 5 shortest messages
  dailyMessageCounts: { [key: string]: number };        // Date-indexed counts
  streak: StreakData;                                    // Consecutive day analysis
  callStats: CallAnalysis;                              // Voice/video call metrics
}

// Message analysis for length statistics
interface MessageAnalysis {
  sender: string;
  content: string;
  length: number;
  timestamp: Date;
}

// Streak tracking data
interface StreakData {
  current: number;          // Current active streak (days)
  longest: number;          // Longest historical streak
  lastActiveDate: string;   // Last day with messages (YYYY-MM-DD)
}

// Call analysis results
interface CallAnalysis {
  totalCalls: number;                    // Total call mentions
  callsByParticipant: { [key: string]: number }; // Calls per person
  totalDuration: number;                 // Total duration in minutes
  averageDuration: number;               // Average call length
}
```

### Component Props

```typescript
// FileUpload component interface
interface FileUploadProps {
  onFileUpload: (data: ChatData) => void;  // Callback for successful parse
  isLoading: boolean;                      // Loading state indicator
  setIsLoading: (loading: boolean) => void; // Loading state setter
}

// Analytics component interface
interface AnalyticsProps {
  chatData: ChatData;              // Parsed chat data for analysis
  onReset: () => void;            // Function to return to upload view
}

// ChatReader subcomponent interface
interface ChatReaderProps {
  messages: Message[];             // Messages to display
  participants: string[];          // Chat participants for filtering
}
```

## 🧩 Component APIs

### FileUpload Component

**Location**: `src/components/FileUpload.tsx`

**Purpose**: Handles file upload, validation, and WhatsApp chat parsing

#### Key Methods

```typescript
// Main parsing function with multiple format support
const parseWhatsAppChat = useCallback((content: string): ChatData => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const messages: Message[] = [];
  const participants = new Set<string>();
  
  // Multiple regex patterns for different WhatsApp export formats
  const patterns = [
    /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}\s[ap]m)\s-\s([^:]+):\s(.+)$/i,
    /^(\d{1,2}\/\d{1,2}\/\d{2}),\s(\d{1,2}:\d{2}\s[ap]m)\s-\s([^:]+):\s(.+)$/i,
    /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2})\s-\s([^:]+):\s(.+)$/,
    /^(\d{1,2}-\d{1,2}-\d{4}),\s(\d{1,2}:\d{2})\s-\s([^:]+):\s(.+)$/,
    /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+):\s(.+)$/
  ];
  
  // Date parsing with format detection
  const parseDate = (dateStr: string, timeStr: string): Date => {
    // Implementation handles multiple date/time formats
    // Returns parsed Date object
  };
  
  return {
    messages,
    participants: Array.from(participants),
    dateRange: { start: new Date(), end: new Date() },
    totalMessages: messages.length,
    totalDays: 0
  };
}, []);

// File validation and processing
const handleFileUpload = async (file: File): Promise<void> => {
  setIsLoading(true);
  
  try {
    // Validate file type and size
    if (!file.name.endsWith('.txt')) {
      throw new Error('Please upload a .txt file exported from WhatsApp');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size too large. Please upload a smaller file.');
    }
    
    // Read and parse file content
    const content = await file.text();
    const chatData = parseWhatsAppChat(content);
    
    if (chatData.messages.length === 0) {
      throw new Error('No valid messages found. Please check the file format.');
    }
    
    onFileUpload(chatData);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

#### Usage Example

```typescript
import FileUpload from './components/FileUpload';

const App = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileUpload = (data: ChatData) => {
    setChatData(data);
  };
  
  return (
    <FileUpload 
      onFileUpload={handleFileUpload}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />
  );
};
```

### Analytics Component

**Location**: `src/components/Analytics.tsx`

**Purpose**: Comprehensive chat analysis with visualization and interactive chat reader

#### Key Methods

```typescript
// Main analytics calculation engine
const calculateAnalytics = useCallback((): AnalyticsData => {
  const { messages } = chatData;
  
  // Initialize analytics containers
  const messagesByParticipant: { [key: string]: number } = {};
  const messagesByHour: { [key: number]: number } = {};
  const emojiStats: { [key: string]: number } = {};
  const loveWordStats: { [key: string]: number } = {};
  
  // Process each message for multiple analytics
  messages.forEach(message => {
    // Participant message counting
    messagesByParticipant[message.sender] = (messagesByParticipant[message.sender] || 0) + 1;
    
    // Hourly activity tracking
    const hour = message.timestamp.getHours();
    messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
    
    // Emoji extraction and counting
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = message.content.match(emojiRegex) || [];
    emojis.forEach(emoji => {
      emojiStats[emoji] = (emojiStats[emoji] || 0) + 1;
    });
    
    // Love words detection with multilingual support
    const loveWords = [
      'love', 'miss', 'heart', 'kiss', 'hug', 'cute', 'beautiful',
      'chiku', 'chikku', 'chikoo', 'motu', 'chocolate',
      'jaan', 'jaanu', 'pyaar', 'mohabbat', 'ishq', 'dil'
    ];
    
    loveWords.forEach(loveWord => {
      const regex = new RegExp(`\\b${loveWord}\\b`, 'i');
      if (regex.test(message.content)) {
        loveWordStats[loveWord] = (loveWordStats[loveWord] || 0) + 1;
      }
    });
  });
  
  // Advanced analytics calculations
  const streak = calculateStreakData(messages);
  const callStats = calculateCallStatistics(messages);
  const responseTime = calculateResponseTimes(messages, chatData.participants);
  
  return {
    messagesByParticipant,
    messagesByHour,
    emojiStats,
    loveWords: loveWordStats,
    streak,
    callStats,
    averageResponseTime: responseTime,
    // ... other analytics properties
  };
}, [chatData]);

// Streak calculation with consecutive day logic
const calculateStreakData = (messages: Message[]): StreakData => {
  const dailyCounts: { [key: string]: number } = {};
  
  // Count messages per day
  messages.forEach(message => {
    const dateKey = format(message.timestamp, 'yyyy-MM-dd');
    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
  });
  
  const sortedDates = Object.keys(dailyCounts).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Calculate longest historical streak
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = parseISO(sortedDates[i]);
    const prevDate = i > 0 ? parseISO(sortedDates[i - 1]) : null;
    
    if (prevDate && differenceInDays(currentDate, prevDate) === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  
  // Calculate current active streak
  let currentStreak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const lastActiveDate = sortedDates[sortedDates.length - 1];
  
  if (lastActiveDate === today || lastActiveDate === yesterday) {
    currentStreak = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDateCheck = parseISO(sortedDates[i]);
      const nextDateCheck = parseISO(sortedDates[i + 1]);
      
      if (differenceInDays(nextDateCheck, currentDateCheck) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return {
    current: currentStreak,
    longest: longestStreak,
    lastActiveDate
  };
};

// Call detection and analysis
const calculateCallStatistics = (messages: Message[]): CallAnalysis => {
  let totalCalls = 0;
  let totalDuration = 0;
  const callsByParticipant: { [key: string]: number } = {};
  
  const callRegex = /call|called|calling|missed call|video call|voice call|rang|ringing/i;
  const durationRegex = /(\d+)\s*(min|minute|minutes|hour|hours|hr|hrs|second|seconds|sec|secs)/i;
  
  messages.forEach(message => {
    if (callRegex.test(message.content.toLowerCase())) {
      totalCalls++;
      callsByParticipant[message.sender] = (callsByParticipant[message.sender] || 0) + 1;
      
      // Extract duration if mentioned
      const durationMatch = message.content.match(durationRegex);
      if (durationMatch) {
        const value = parseInt(durationMatch[1]);
        const unit = durationMatch[2].toLowerCase();
        
        let minutes = 0;
        if (unit.includes('hour')) minutes = value * 60;
        else if (unit.includes('min')) minutes = value;
        else if (unit.includes('sec')) minutes = value / 60;
        
        totalDuration += minutes;
      }
    }
  });
  
  return {
    totalCalls,
    callsByParticipant,
    totalDuration,
    averageDuration: totalCalls > 0 ? totalDuration / totalCalls : 0
  };
};
```

#### Usage Example

```typescript
import Analytics from './components/Analytics';

const App = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  
  const handleReset = () => {
    setChatData(null);
  };
  
  return (
    <>
      {chatData ? (
        <Analytics chatData={chatData} onReset={handleReset} />
      ) : (
        <FileUpload onFileUpload={setChatData} />
      )}
    </>
  );
};
```

### ChatReader Component

**Location**: Embedded within `Analytics.tsx`

**Purpose**: Interactive chat browsing with search and filtering capabilities

#### Key Features

```typescript
const ChatReader: React.FC<ChatReaderProps> = ({ messages, participants }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const messagesPerPage = 50;
  
  // Advanced message filtering
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesSearch = searchTerm === '' || 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = selectedDate === '' || 
        format(msg.timestamp, 'yyyy-MM-dd') === selectedDate;
      
      return matchesSearch && matchesDate;
    });
  }, [messages, searchTerm, selectedDate]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = currentPage * messagesPerPage;
  const currentMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);
  
  // Message rendering with WhatsApp-style bubbles
  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.sender === participants[0]; // Assumes first participant is current user
    
    return (
      <div
        key={index}
        className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
            isCurrentUser
              ? 'bg-romantic-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          {!isCurrentUser && (
            <div className="text-xs font-semibold text-romantic-600 mb-1">
              {message.sender}
            </div>
          )}
          <div className="text-sm">{message.content}</div>
          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-romantic-100' : 'text-gray-500'}`}>
            {format(message.timestamp, 'HH:mm')}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="chat-reader-container">
      {/* Search and filter controls */}
      <div className="search-controls mb-4">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-filter"
        />
      </div>
      
      {/* Message list */}
      <div className="messages-container h-96 overflow-y-auto">
        {currentMessages.map(renderMessage)}
      </div>
      
      {/* Pagination controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>{currentPage + 1} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

## 🛠️ Utility Functions

### Date Parsing Utilities

```typescript
// Multi-format date parser for WhatsApp exports
export const parseWhatsAppDate = (dateStr: string, timeStr: string): Date => {
  // Handle different date formats
  let normalizedDate = dateStr;
  
  // Convert DD/MM/YY to DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    const year = parseInt(parts[2]);
    // Assume years 00-30 are 2000s, 31-99 are 1900s
    const fullYear = year <= 30 ? 2000 + year : 1900 + year;
    normalizedDate = `${parts[0]}/${parts[1]}/${fullYear}`;
  }
  
  // Convert DD-MM-YYYY to DD/MM/YYYY
  normalizedDate = normalizedDate.replace(/-/g, '/');
  
  // Parse time (handle both 12-hour and 24-hour formats)
  let normalizedTime = timeStr;
  if (!/[ap]m$/i.test(timeStr)) {
    // 24-hour format, no conversion needed
  } else {
    // 12-hour format with AM/PM
    const timeParts = timeStr.toLowerCase().match(/(\d{1,2}):(\d{2})\s*([ap]m)/);
    if (timeParts) {
      let hours = parseInt(timeParts[1]);
      const minutes = timeParts[2];
      const period = timeParts[3];
      
      if (period === 'am' && hours === 12) hours = 0;
      if (period === 'pm' && hours !== 12) hours += 12;
      
      normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }
  
  // Combine date and time
  const dateTimeStr = `${normalizedDate} ${normalizedTime}`;
  const parsedDate = parse(dateTimeStr, 'dd/MM/yyyy HH:mm', new Date());
  
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${dateStr} ${timeStr}`);
  }
  
  return parsedDate;
};

// Generate date range for filtering
export const generateDateRange = (messages: Message[]): { start: Date; end: Date } => {
  if (messages.length === 0) {
    const now = new Date();
    return { start: now, end: now };
  }
  
  const timestamps = messages.map(msg => msg.timestamp.getTime());
  return {
    start: new Date(Math.min(...timestamps)),
    end: new Date(Math.max(...timestamps))
  };
};
```

### Text Processing Utilities

```typescript
// Enhanced emoji extraction with Unicode support
export const extractEmojis = (text: string): string[] => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  return text.match(emojiRegex) || [];
};

// Word frequency analysis with stop word filtering
export const analyzeWordFrequency = (messages: Message[], limit: number = 50): { [key: string]: number } => {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these',
    'those', 'not', 'no', 'yes', 'hi', 'hello', 'hey', 'ok', 'okay', 'thanks', 'thank'
  ]);
  
  const wordCounts: { [key: string]: number } = {};
  
  messages.forEach(message => {
    const words = message.content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });
  
  // Return top N words
  return Object.fromEntries(
    Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
  );
};

// Message length analysis
export const analyzeMessageLengths = (messages: Message[]): {
  longest: MessageAnalysis[];
  shortest: MessageAnalysis[];
} => {
  const messageAnalyses: MessageAnalysis[] = messages.map(msg => ({
    sender: msg.sender,
    content: msg.content,
    length: msg.content.length,
    timestamp: msg.timestamp
  }));
  
  const sortedByLength = [...messageAnalyses].sort((a, b) => b.length - a.length);
  
  return {
    longest: sortedByLength.slice(0, 5),
    shortest: sortedByLength.slice(-5).reverse()
  };
};
```

## 🎨 Chart Configuration

### Chart.js Setup and Optimization

```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Standard chart options for consistent styling
export const getChartOptions = (title: string, type: 'bar' | 'doughnut' | 'line' = 'bar') => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#1f2937'
        }
      },
      title: {
        display: true,
        text: title,
        font: { family: 'Dancing Script', size: 18, weight: 'bold' },
        color: '#9d174d'
      },
      tooltip: {
        backgroundColor: '#fdf2f8',
        titleColor: '#9d174d',
        bodyColor: '#1f2937',
        borderColor: '#ec4899',
        borderWidth: 1
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };
  
  if (type === 'bar' || type === 'line') {
    return {
      ...baseOptions,
      scales: {
        x: {
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#6b7280',
            maxTicksLimit: 10
          },
          grid: { color: '#f3f4f6' }
        },
        y: {
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#6b7280',
            maxTicksLimit: 8
          },
          grid: { color: '#f3f4f6' }
        }
      }
    };
  }
  
  return baseOptions;
};

// Color palette for charts
export const chartColors = {
  romantic: {
    primary: '#ec4899',
    secondary: '#f472b6',
    light: '#fce7f3',
    dark: '#9d174d'
  },
  love: {
    primary: '#f97316',
    secondary: '#fb923c',
    light: '#fed7aa',
    dark: '#9a3412'
  },
  gradients: [
    'rgba(236, 72, 153, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(239, 68, 68, 0.8)'
  ]
};
```

## 🔍 Error Handling Patterns

### Comprehensive Error Management

```typescript
// Custom error types for different failure scenarios
export class ParseError extends Error {
  constructor(message: string, public readonly line?: number) {
    super(message);
    this.name = 'ParseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error handling hook for components
export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleError = useCallback((error: unknown) => {
    console.error('Application error:', error);
    
    if (error instanceof ParseError) {
      setError(`Parsing failed: ${error.message}${error.line ? ` at line ${error.line}` : ''}`);
    } else if (error instanceof ValidationError) {
      setError(`Validation failed: ${error.message}`);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
};

// Graceful error boundaries for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error boundary caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }
    
    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error-container p-6 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Reload Page
    </button>
  </div>
);
```

## ⚡ Performance Guidelines

### Optimization Strategies

```typescript
// Memoization for expensive calculations
export const useMemoizedAnalytics = (chatData: ChatData) => {
  return useMemo(() => {
    if (!chatData || chatData.messages.length === 0) return null;
    
    // Expensive analytics calculations here
    return calculateAnalytics(chatData);
  }, [chatData]);
};

// Debounced search for chat reader
export const useDebouncedSearch = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Virtual scrolling for large message lists
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return {
    visibleItems,
    visibleStart,
    totalHeight: items.length * itemHeight,
    offsetY: visibleStart * itemHeight
  };
};

// Lazy loading for chart components
export const LazyChart = React.lazy(() => 
  import('./ChartComponent').then(module => ({
    default: module.ChartComponent
  }))
);

// Bundle optimization with dynamic imports
export const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

## 🧪 Testing Utilities

### Test Helpers and Mocks

```typescript
// Mock data generators for testing
export const generateMockMessage = (overrides: Partial<Message> = {}): Message => ({
  timestamp: new Date(),
  sender: 'TestUser',
  content: 'Test message content',
  isMedia: false,
  ...overrides
});

export const generateMockChatData = (messageCount: number = 10): ChatData => {
  const messages = Array.from({ length: messageCount }, (_, i) =>
    generateMockMessage({
      timestamp: new Date(Date.now() - (messageCount - i) * 3600000),
      sender: i % 2 === 0 ? 'User1' : 'User2',
      content: `Message ${i + 1}`
    })
  );
  
  return {
    messages,
    participants: ['User1', 'User2'],
    dateRange: {
      start: messages[0].timestamp,
      end: messages[messages.length - 1].timestamp
    },
    totalMessages: messages.length,
    totalDays: 1
  };
};

// Testing utilities for async operations
export const waitForAnalytics = async (component: any) => {
  await act(async () => {
    // Wait for analytics calculations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  });
};

// Mock file for testing file upload
export const createMockFile = (content: string, filename: string = 'test-chat.txt'): File => {
  const blob = new Blob([content], { type: 'text/plain' });
  return new File([blob], filename, { type: 'text/plain' });
};
```

---

This developer guide provides comprehensive API documentation and implementation patterns for the WhatsApp Chat Analyzer. Use these references to understand the codebase structure, extend functionality, and maintain code quality standards.
