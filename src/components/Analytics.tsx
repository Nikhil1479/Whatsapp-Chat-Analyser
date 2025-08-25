import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Heart, MessageCircle, Clock, Smile, TrendingUp, Calendar,
  Zap, MessageSquare, HelpCircle, AlertCircle, Phone, Timer,
  Flame, BookOpen, Activity, Volume2, Sparkles, Star
} from 'lucide-react';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ChatData, AnalyticsData } from '../types/ChatTypes';
import { format, getHours, differenceInMinutes, parseISO, differenceInDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Chat Reader Component
interface ChatReaderProps {
  messages: { timestamp: Date; sender: string; content: string; isMedia: boolean }[];
  participants: string[];
}

const ChatReader: React.FC<ChatReaderProps> = ({ messages, participants }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const messagesPerPage = 50;

  // Filter messages based on search and date
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = searchTerm === '' || 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate === '' || 
      format(msg.timestamp, 'yyyy-MM-dd') === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const currentMessages = filteredMessages.slice(
    currentPage * messagesPerPage,
    (currentPage + 1) * messagesPerPage
  );

  // Get unique dates for date filter
  const uniqueDates = [...new Set(messages.map(msg => format(msg.timestamp, 'yyyy-MM-dd')))].sort();

  const isUser1 = (sender: string) => sender === participants[0];

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
          <MessageCircle className="w-6 h-6 text-rose-500" />
          <span>Chat Explorer</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-romantic-700 mb-2">Search Messages</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="Search for words, names, or phrases..."
              className="w-full px-4 py-2 border border-romantic-200 rounded-lg focus:ring-2 focus:ring-romantic-500 focus:border-romantic-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-romantic-700 mb-2">Filter by Date</label>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(0);
              }}
              title="Filter messages by date"
              className="w-full px-4 py-2 border border-romantic-200 rounded-lg focus:ring-2 focus:ring-romantic-500 focus:border-romantic-500"
            >
              <option value="">All dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {format(parseISO(date), 'MMM dd, yyyy')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Pagination Info */}
        <div className="flex justify-between items-center text-sm text-romantic-600">
          <span>
            Showing {currentPage * messagesPerPage + 1}-{Math.min((currentPage + 1) * messagesPerPage, filteredMessages.length)} of {filteredMessages.length} messages
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-romantic-100 text-romantic-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-romantic-200 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage + 1} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 bg-romantic-100 text-romantic-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-romantic-200 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {currentMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${isUser1(message.sender) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                isUser1(message.sender)
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-l-2xl rounded-tr-lg shadow-elegant'
                  : 'bg-white/90 text-neutral-800 rounded-r-2xl rounded-tl-lg shadow-elegant border border-neutral-200'
              } p-4 backdrop-blur-sm`}>
                <div className={`text-xs mb-2 font-medium ${
                  isUser1(message.sender) ? 'text-white/80' : 'text-neutral-500'
                }`}>
                  {message.sender} • {format(message.timestamp, 'MMM dd, HH:mm')}
                </div>
                <div className="text-sm leading-relaxed">
                  {message.isMedia ? (
                    <span className="italic flex items-center space-x-2">
                      <span>📎</span>
                      <span>Media attachment</span>
                    </span>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-romantic-300 mx-auto mb-4" />
            <p className="text-romantic-600">No messages found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface AnalyticsProps {
  chatData: ChatData;
  onReset: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ chatData, onReset }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [showChatView, setShowChatView] = useState(false);

  useEffect(() => {
    const calculateAnalytics = (): AnalyticsData => {
      const { messages } = chatData;
      const totalMessages = chatData.totalMessages;
      
      // Message count by participant
      const messagesByParticipant: { [key: string]: number } = {};
      chatData.participants.forEach(p => messagesByParticipant[p] = 0);
      
      // Other analytics objects
      const messagesByDay: { [key: string]: number } = {};
      const messagesByHour: { [key: number]: number } = {};
      const emojiStats: { [key: string]: number } = {};
      const wordStats: { [key: string]: number } = {};
      const messagesByMonth: { [key: string]: number } = {};
      
      // Initialize hours
      for (let i = 0; i < 24; i++) {
        messagesByHour[i] = 0;
      }

      // Enhanced love words with Hindi terms and variations
      const loveWords = [
        // English love words
        'love', 'miss', 'heart', 'kiss', 'hug', 'cute', 'beautiful', 'handsome', 'amazing', 'wonderful', 'sweet', 
        'dear', 'darling', 'baby', 'honey', 'babe', 'sweetheart', 'gorgeous', 'stunning', 'lovely', 'precious',
        'angel', 'princess', 'prince', 'queen', 'king', 'sunshine', 'moonlight', 'star', 'treasure',
        
        // Cute nicknames (with variations)
        'chiku', 'chikku', 'chikoo', 'choco', 'chocolate', 'cookie', 'cupcake', 'muffin', 'candy', 'sugar',
        'honey', 'sweetie', 'cutie', 'buddy', 'bunny', 'bear', 'teddy', 'tiger', 'lion', 'panda', 'motu',
        
        // Hindi/Urdu love words
        'jaan', 'jaanu', 'jaanam', 'pyaar', 'pyaara', 'pyaari', 'mohabbat', 'ishq', 'dil', 'dildar',
        'mehboob', 'sanam', 'shona', 'sona', 'meri', 'tera', 'tumhara', 'hamara', 'priya', 'priye',
        'rajkumar', 'rajkumari', 'rani', 'raja', 'bachcha', 'bacche', 'beta', 'betu', 'gudiya', 'guddu',
        'chintu', 'pintu', 'mintu', 'bunty', 'montu', 'pappu', 'bablu', 'champ', 'hero', 'heroine',
        
        // More romantic terms
        'forever', 'always', 'together', 'soulmate', 'destiny', 'meant', 'special', 'magical', 'perfect',
        'dream', 'fantasy', 'wish', 'hope', 'promise', 'commitment', 'devoted', 'faithful', 'loyal',
        
        // Action words
        'adore', 'cherish', 'worship', 'treasure', 'value', 'appreciate', 'admire', 'respect', 'honor'
      ];
      
      // Create object to track found love words with their variations
      const loveWordStats: { [key: string]: number } = {};
      const foundLoveWords = new Set<string>();
      
      // Additional analytics
      const dailyMessageCounts: { [key: string]: number } = {};
      const weeklyActivity: { [key: string]: number } = {}; // Mon, Tue, etc.
      const monthlyActivity: { [key: string]: number } = {};
      const longestMessages: Array<{sender: string, content: string, length: number, timestamp: Date}> = [];
      const shortestMessages: Array<{sender: string, content: string, length: number, timestamp: Date}> = [];
      const longestMessageByParticipant: { [key: string]: {sender: string, content: string, length: number, timestamp: Date} } = {};
      const questionStats: { [key: string]: number } = {};
      const exclamationStats: { [key: string]: number } = {};
      const timeOfDayActivity = {
        morning: 0,    // 6-12
        afternoon: 0,  // 12-18
        evening: 0,    // 18-22
        night: 0       // 22-6
      };
      
      // Initialize weekly activity
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
        weeklyActivity[day] = 0;
      });
      
      // Initialize participant stats
      chatData.participants.forEach(p => {
        questionStats[p] = 0;
        exclamationStats[p] = 0;
      });

      // Calculate streak information
      const calculateStreak = (dailyCounts: { [key: string]: number }) => {
        const sortedDates = Object.keys(dailyCounts).sort();
        if (sortedDates.length === 0) {
          return { current: 0, longest: 0, lastActiveDate: '' };
        }

        let currentStreak = 0;
        let longestStreak = 1; // Start with 1 since we have at least one day
        let tempStreak = 1; // Start with 1 for the first day
        const today = new Date();

        // Calculate longest streak
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = parseISO(sortedDates[i]);
          const prevDate = parseISO(sortedDates[i - 1]);

          if (differenceInDays(currentDate, prevDate) === 1) {
            // Consecutive days - increment streak
            tempStreak++;
          } else {
            // Non-consecutive days - start new streak
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        // Don't forget to check the last streak
        longestStreak = Math.max(longestStreak, tempStreak);

        // Calculate current streak (working backwards from the last active day)
        const lastActiveDate = sortedDates[sortedDates.length - 1];
        
        // Start counting from the most recent day and work backwards
        currentStreak = 1; // Count the last active day
        
        // Count backwards for consecutive days
        for (let i = sortedDates.length - 2; i >= 0; i--) {
          const currentDateCheck = parseISO(sortedDates[i]);
          const nextDateCheck = parseISO(sortedDates[i + 1]);
          
          if (differenceInDays(nextDateCheck, currentDateCheck) === 1) {
            currentStreak++;
          } else {
            break;
          }
        }

        // If the last active date is not recent (more than 1 day ago), current streak should be 0
        const daysSinceLastActive = differenceInDays(today, parseISO(lastActiveDate));
        if (daysSinceLastActive > 1) {
          currentStreak = 0;
        }

        return {
          current: currentStreak,
          longest: longestStreak,
          lastActiveDate
        };
      };

      // Emoji regex
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|❤️|💕|💖|💗|💘|💙|💚|💛|💜|🧡|🖤|🤍|🤎|💔|❣️|💟|♥️|💯|💢|💥|💫|💦|💨|🕳️|💬|👁️‍🗨️|🗨️|🗯️|💭|💤/gu;

      messages.forEach((message) => {
        // Count by participant
        messagesByParticipant[message.sender]++;
        
        // Count by day
        const dayKey = format(message.timestamp, 'yyyy-MM-dd');
        messagesByDay[dayKey] = (messagesByDay[dayKey] || 0) + 1;
        dailyMessageCounts[dayKey] = (dailyMessageCounts[dayKey] || 0) + 1;
        
        // Count by month
        const monthKey = format(message.timestamp, 'yyyy-MM');
        messagesByMonth[monthKey] = (messagesByMonth[monthKey] || 0) + 1;
        monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;
        
        // Count by day of week
        const dayOfWeek = format(message.timestamp, 'EEEE');
        weeklyActivity[dayOfWeek]++;
        
        // Count by hour
        const hour = getHours(message.timestamp);
        messagesByHour[hour]++;
        
        // Time of day analysis
        if (hour >= 6 && hour < 12) timeOfDayActivity.morning++;
        else if (hour >= 12 && hour < 18) timeOfDayActivity.afternoon++;
        else if (hour >= 18 && hour < 22) timeOfDayActivity.evening++;
        else timeOfDayActivity.night++;
        
        // Message length analysis
        const messageLength = message.content.length;
        if (messageLength > 10 && !message.isMedia) {
          longestMessages.push({
            sender: message.sender,
            content: message.content,
            length: messageLength,
            timestamp: message.timestamp
          });
          
          // Track longest message per participant
          if (!longestMessageByParticipant[message.sender] || 
              messageLength > longestMessageByParticipant[message.sender].length) {
            longestMessageByParticipant[message.sender] = {
              sender: message.sender,
              content: message.content,
              length: messageLength,
              timestamp: message.timestamp
            };
          }
          
          if (messageLength < 50) {
            shortestMessages.push({
              sender: message.sender,
              content: message.content,
              length: messageLength,
              timestamp: message.timestamp
            });
          }
        }
        
        // Question and exclamation analysis
        if (message.content.includes('?')) {
          questionStats[message.sender]++;
        }
        if (message.content.includes('!')) {
          exclamationStats[message.sender]++;
        }
        
        // Count emojis
        const emojis = message.content.match(emojiRegex);
        if (emojis) {
          emojis.forEach(emoji => {
            emojiStats[emoji] = (emojiStats[emoji] || 0) + 1;
          });
        }
        
        // Count words and love words with enhanced matching
        const messageText = message.content.toLowerCase();
        const words = messageText.split(/\s+/);
        
        words.forEach(word => {
          const cleanWord = word.replace(/[^\w]/g, '');
          if (cleanWord.length > 2) { // Changed from 3 to 2 to catch more words
            wordStats[cleanWord] = (wordStats[cleanWord] || 0) + 1;
          }
        });
        
        // Enhanced love word detection with wildcard matching
        loveWords.forEach(loveWord => {
          // Direct word matching
          const regex = new RegExp(`\\b${loveWord}\\b`, 'i');
          if (regex.test(messageText)) {
            loveWordStats[loveWord] = (loveWordStats[loveWord] || 0) + 1;
            foundLoveWords.add(loveWord);
          }
          
          // Partial matching for variations (e.g., chiku, chikku, chikoo)
          if (loveWord.length > 3) {
            const partialRegex = new RegExp(`\\b\\w*${loveWord}\\w*\\b`, 'i');
            if (partialRegex.test(messageText) && !regex.test(messageText)) {
              loveWordStats[loveWord] = (loveWordStats[loveWord] || 0) + 1;
              foundLoveWords.add(loveWord);
            }
          }
        });
      });
      
      // Sort longest messages and keep top 5
      longestMessages.sort((a, b) => b.length - a.length);
      const topLongestMessages = longestMessages.slice(0, 5);
      
      // Sort shortest messages and keep top 5
      shortestMessages.sort((a, b) => a.length - b.length);
      const topShortestMessages = shortestMessages.slice(0, 5);

      // Find longest conversation day
      const longestConversation = Object.entries(messagesByDay)
        .reduce((max, [date, count]) => 
          count > max.messageCount ? { date, messageCount: count } : max,
          { date: '', messageCount: 0 }
        );

      // Calculate average response times (simplified)
      const averageResponseTime: { [key: string]: number } = {};
      chatData.participants.forEach(participant => {
        const participantMessages = messages.filter(m => m.sender === participant);
        if (participantMessages.length > 1) {
          const times = participantMessages.slice(1).map((msg, i) => 
            differenceInMinutes(msg.timestamp, participantMessages[i].timestamp)
          ).filter(time => time > 0 && time < 1440); // Filter out negative and > 24 hours
          
          averageResponseTime[participant] = times.length > 0 
            ? times.reduce((sum, time) => sum + time, 0) / times.length 
            : 0;
        }
      });

      // Calculate streak
      const streak = calculateStreak(dailyMessageCounts);

      // Calculate call statistics
      const callRegex = /call|called|calling|missed call|video call|voice call|rang|ringing/i;
      const durationRegex = /(\d+)\s*(min|minute|minutes|hour|hours|hr|hrs|second|seconds|sec|secs)/i;
      let totalCalls = 0;
      let totalDuration = 0;
      let missedCalls = 0;
      const callsByParticipant: { [key: string]: number } = {};
      
      chatData.participants.forEach(p => callsByParticipant[p] = 0);

      messages.forEach(message => {
        const content = message.content.toLowerCase();
        
        // Detect calls
        if (callRegex.test(content)) {
          totalCalls++;
          callsByParticipant[message.sender]++;
          
          // Check for missed calls
          if (content.includes('missed')) {
            missedCalls++;
          }
          
          // Extract duration if mentioned
          const durationMatch = content.match(durationRegex);
          if (durationMatch) {
            const value = parseInt(durationMatch[1]);
            const unit = durationMatch[2].toLowerCase();
            
            // Convert to minutes
            let minutes = 0;
            if (unit.includes('hour') || unit.includes('hr')) {
              minutes = value * 60;
            } else if (unit.includes('min')) {
              minutes = value;
            } else if (unit.includes('sec')) {
              minutes = value / 60;
            }
            
            totalDuration += minutes;
          }
        }
      });

      const callStats = {
        totalCalls,
        totalDuration,
        averageDuration: totalCalls > 0 ? totalDuration / totalCalls : 0,
        callsByParticipant,
        missedCalls
      };

      // Calculate daily average
      const averagePerDay = Math.round(chatData.totalMessages / chatData.totalDays);

      // Calculate Love Score
      const calculateLoveScore = () => {
        const totalLoveWords = Object.values(loveWordStats).reduce((sum, count) => sum + count, 0);
        const totalEmojis = Object.values(emojiStats).reduce((sum, count) => sum + count, 0);
        const heartEmojis = ['❤️', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '🤎', '💔', '❣️', '💟', '♥️'];
        const heartEmojiCount = heartEmojis.reduce((sum, emoji) => sum + (emojiStats[emoji] || 0), 0);
        
        // Scoring factors (out of 100)
        const factors = {
          // Love words usage (25 points max)
          loveWordsScore: Math.min(25, (totalLoveWords / totalMessages) * 1000),
          
          // Emoji usage especially hearts (20 points max)
          emojiScore: Math.min(15, (totalEmojis / totalMessages) * 500) + Math.min(5, (heartEmojiCount / totalMessages) * 1000),
          
          // Communication frequency (20 points max)
          frequencyScore: Math.min(20, (averagePerDay / 50) * 20),
          
          // Response time (15 points max) - faster responses = higher score
          responseScore: (() => {
            const avgResponseTime = Object.values(averageResponseTime).reduce((sum, time) => sum + time, 0) / Object.keys(averageResponseTime).length || 0;
            if (avgResponseTime === 0) return 10;
            if (avgResponseTime <= 5) return 15;
            if (avgResponseTime <= 15) return 12;
            if (avgResponseTime <= 30) return 8;
            if (avgResponseTime <= 60) return 5;
            return 2;
          })(),
          
          // Consistency (streak) (10 points max)
          consistencyScore: Math.min(10, (streak.longest / 30) * 10),
          
          // Engagement (questions + exclamations) (10 points max)
          engagementScore: Math.min(10, ((Object.values(questionStats).reduce((sum, count) => sum + count, 0) + 
                                          Object.values(exclamationStats).reduce((sum, count) => sum + count, 0)) / totalMessages) * 200)
        };
        
        const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
        
        return {
          totalScore: Math.round(totalScore),
          factors,
          grade: totalScore >= 85 ? 'A+' : totalScore >= 75 ? 'A' : totalScore >= 65 ? 'B+' : totalScore >= 55 ? 'B' : totalScore >= 45 ? 'C+' : totalScore >= 35 ? 'C' : 'D',
          description: totalScore >= 85 ? 'Epic Love Story! 💖✨' : 
                      totalScore >= 75 ? 'True Love 💕' : 
                      totalScore >= 65 ? 'Sweet Romance 💗' : 
                      totalScore >= 55 ? 'Growing Love 🌱💕' : 
                      totalScore >= 45 ? 'Good Connection 😊' : 
                      totalScore >= 35 ? 'Building Romance 💫' : 'Early Stages 🌸'
        };
      };

      const loveScore = calculateLoveScore();

      // Conversation initiator calculation
      const initiatorCount: { [key: string]: number } = {};
      chatData.participants.forEach(p => initiatorCount[p] = 0);
      const firstMessageByDay: { [key: string]: string } = {};
      // Group messages by day
      const messagesByDayArr: { [key: string]: Array<typeof messages[0]> } = {};
      messages.forEach(msg => {
        const dayKey = format(msg.timestamp, 'yyyy-MM-dd');
        if (!messagesByDayArr[dayKey]) messagesByDayArr[dayKey] = [];
        messagesByDayArr[dayKey].push(msg);
      });
      Object.entries(messagesByDayArr).forEach(([day, msgs]) => {
        if (msgs.length > 0) {
          const firstSender = msgs[0].sender;
          firstMessageByDay[day] = firstSender;
          initiatorCount[firstSender] = (initiatorCount[firstSender] || 0) + 1;
        }
      });

      // Calculate cute insights that make users happy
      const calculateCuteInsights = () => {
        // Good morning/night detection
        const morningGreetings = ['good morning', 'gm', 'morning', 'rise and shine', 'wake up'];
        const nightGreetings = ['good night', 'gn', 'sweet dreams', 'sleep well', 'sleep tight'];
        let goodMorningCount = 0;
        let goodNightCount = 0;

        // Compliment words
        const complimentWords: { [key: string]: number } = {
          'beautiful': 0, 'gorgeous': 0, 'handsome': 0, 'cute': 0, 'sweet': 0, 
          'amazing': 0, 'wonderful': 0, 'perfect': 0, 'best': 0, 'awesome': 0,
          'smart': 0, 'funny': 0, 'kind': 0, 'lovely': 0, 'adorable': 0,
          'stunning': 0, 'incredible': 0, 'fantastic': 0, 'brilliant': 0
        };

        // Support and encouragement words
        const supportWords = ['proud of you', 'believe in you', 'you can do', 'support', 'here for you', 
                             'got this', 'you are strong', 'dont worry', 'everything will be', 'i am here'];
        let supportiveMessages = 0;
        let encouragementCount = 0;

        // Happy emojis
        const happyEmojiList = ['😊', '😄', '😁', '🤗', '😍', '🥰', '😘', '💕', '💖', '💗', '🎉', '🥳', '😂', '🤣'];
        let happyEmojis = 0;
        let laughingTogether = 0;

        // Anniversary and birthday detection
        const specialWords = ['anniversary', 'birthday', 'happy birthday', 'bday', 'celebrate'];
        let anniversaryMessages = 0;
        let birthdayWishes = 0;

        // Memory moments
        const memoryTypes: Array<{ type: string; words: string[]; count: number; examples: string[] }> = [
          { type: 'Remember when', words: ['remember when', 'do you remember', 'that time when'], count: 0, examples: [] },
          { type: 'Miss you', words: ['miss you', 'missing you', 'i miss'], count: 0, examples: [] },
          { type: 'Thank you', words: ['thank you', 'thanks', 'grateful', 'appreciate'], count: 0, examples: [] },
          { type: 'Inside jokes', words: ['haha', 'lol', 'lmao', 'rofl', 'our joke'], count: 0, examples: [] },
          { type: 'Future plans', words: ['when we', 'lets', 'we should', 'planning', 'cant wait'], count: 0, examples: [] }
        ];

        // Weekend vs weekday analysis
        let weekendMessages = 0;
        let weekdayMessages = 0;

        // Analyze each message
        messages.forEach(message => {
          const content = message.content.toLowerCase();
          const hour = getHours(message.timestamp);
          const dayOfWeek = format(message.timestamp, 'EEEE');

          // Weekend vs weekday
          if (['Saturday', 'Sunday'].includes(dayOfWeek)) {
            weekendMessages++;
          } else {
            weekdayMessages++;
          }

          // Good morning/night
          if (morningGreetings.some(greeting => content.includes(greeting))) {
            goodMorningCount++;
          }
          if (nightGreetings.some(greeting => content.includes(greeting))) {
            goodNightCount++;
          }

          // Compliments
          Object.keys(complimentWords).forEach(word => {
            if (content.includes(word)) {
              complimentWords[word]++;
            }
          });

          // Support and encouragement
          if (supportWords.some(word => content.includes(word))) {
            supportiveMessages++;
          }
          if (['you got this', 'believe', 'proud', 'amazing job', 'well done'].some(phrase => content.includes(phrase))) {
            encouragementCount++;
          }

          // Happy emojis
          happyEmojiList.forEach(emoji => {
            if (message.content.includes(emoji)) {
              happyEmojis++;
            }
          });

          // Laughing together
          if (['😂', '🤣', 'haha', 'lol', 'lmao'].some(laugh => content.includes(laugh))) {
            laughingTogether++;
          }

          // Special occasions
          if (content.includes('anniversary')) anniversaryMessages++;
          if (content.includes('birthday') || content.includes('bday')) birthdayWishes++;

          // Memory moments
          memoryTypes.forEach(memoryType => {
            memoryType.words.forEach(word => {
              if (content.includes(word) && memoryType.examples.length < 1) {
                memoryType.count++;
                memoryType.examples.push(message.content.substring(0, 100));
              }
            });
          });
        });

        // Find sweetest hour (most love words used)
        const hourlyLoveWords: { [key: number]: number } = {};
        for (let i = 0; i < 24; i++) hourlyLoveWords[i] = 0;
        
        messages.forEach(message => {
          const hour = getHours(message.timestamp);
          const content = message.content.toLowerCase();
          const loveWordCount = loveWords.filter(word => content.includes(word)).length;
          hourlyLoveWords[hour] += loveWordCount;
        });

        const sweetestHour = Object.entries(hourlyLoveWords)
          .reduce((max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, 
                  { hour: 0, count: 0 });

        // Find longest chat session (most messages in a single day)
        const longestChatSession = Object.entries(messagesByDay)
          .reduce((max, [date, count]) => 
            count > max.messages ? { date, messages: count, duration: '24 hours' } : max,
            { date: '', messages: 0, duration: '' }
          );

        // Find favorite day of week
        const favoriteDay = Object.entries(weeklyActivity)
          .reduce((max, [day, count]) => count > max.count ? { day, count } : max, 
                  { day: '', count: 0 });

        // Calculate thoughtfulness score
        const thoughtfulnessScore = Math.round(
          ((goodMorningCount + goodNightCount) * 2 + 
           supportiveMessages * 3 + 
           Object.values(complimentWords).reduce((sum, count) => sum + count, 0) * 2 + 
           encouragementCount * 3) / totalMessages * 100
        );

        return {
          sweetestHour,
          longestChatSession,
          favoriteDay,
          goodMorningCount,
          goodNightCount,
          laughingTogether,
          complimentsGiven: complimentWords,
          supportiveMessages,
          weekendVsWeekday: { weekend: weekendMessages, weekday: weekdayMessages },
          anniversaryMessages,
          birthdayWishes,
          encouragementCount,
          thoughtfulnessScore,
          happyEmojis,
          memoryMoments: memoryTypes.filter(m => m.count > 0).map(m => ({
            type: m.type,
            count: m.count,
            example: m.examples[0] || ''
          }))
        };
      };

      const cuteInsights = calculateCuteInsights();

      return {
        messagesByParticipant,
        messagesByDay,
        messagesByHour,
        emojiStats,
        wordStats,
        averageResponseTime,
        longestConversation,
        loveWords: loveWordStats,
        messagesByMonth,
        weeklyActivity,
        timeOfDayActivity,
        questionStats,
        exclamationStats,
        longestMessages: topLongestMessages,
        shortestMessages: topShortestMessages,
        longestMessageByParticipant,
        dailyMessageCounts,
        streak,
        callStats,
        loveScore,
        initiatorCount,
        firstMessageByDay,
        cuteInsights
      };
    };

    setAnalytics(calculateAnalytics());
  }, [chatData]);

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-romantic-500 mx-auto heart-animation mb-4" />
        <p className="text-romantic-600">Calculating your love analytics... 💕</p>
      </div>
    );
  }

  // Chart configurations
  const participantColors = ['#ec4899', '#f97316'];
  const participants = chatData.participants;

  const messagesByParticipantChart = {
    labels: participants,
    datasets: [{
      label: 'Messages Sent',
      data: participants.map(p => analytics.messagesByParticipant[p]),
      backgroundColor: participantColors,
      borderRadius: 8,
    }]
  };

  const hourlyChart = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Messages by Hour',
      data: Array.from({ length: 24 }, (_, i) => analytics.messagesByHour[i]),
      backgroundColor: 'rgba(236, 72, 153, 0.6)',
      borderColor: '#ec4899',
      borderRadius: 4,
    }]
  };

  const topEmojis = Object.entries(analytics.emojiStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const topLoveWords = Object.entries(analytics.loveWords)
    .filter(([,count]) => count > 0)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
    
  // Top words (excluding common words)
  const commonWords = ['and', 'the', 'you', 'are', 'for', 'not', 'but', 'have', 'will', 'can', 'this', 'that', 'with', 'from', 'they', 'was', 'were', 'been', 'said', 'each', 'which', 'she', 'all', 'any', 'could', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'don', 'had', 'let', 'put', 'say', 'too', 'use'];
  const topWords = Object.entries(analytics.wordStats)
    .filter(([word]) => !commonWords.includes(word) && word.length > 3)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Weekly activity chart
  const weeklyChart = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [{
      label: 'Messages by Day of Week',
      data: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => analytics.weeklyActivity[day]),
      backgroundColor: 'rgba(249, 115, 22, 0.6)',
      borderColor: '#f97316',
      borderRadius: 4,
    }]
  };

  // Time of day chart
  const timeOfDayChart = {
    labels: ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-6)'],
    datasets: [{
      label: 'Messages by Time of Day',
      data: [
        analytics.timeOfDayActivity.morning,
        analytics.timeOfDayActivity.afternoon,
        analytics.timeOfDayActivity.evening,
        analytics.timeOfDayActivity.night
      ],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',  // Morning - yellow
        'rgba(249, 115, 22, 0.8)',  // Afternoon - orange
        'rgba(236, 72, 153, 0.8)',  // Evening - pink
        'rgba(99, 102, 241, 0.8)'   // Night - indigo
      ],
      borderRadius: 4,
    }]
  };

  // Messages over time (monthly)
  const monthlyChart = {
    labels: Object.keys(analytics.messagesByMonth).sort(),
    datasets: [{
      label: 'Messages Over Time',
      data: Object.keys(analytics.messagesByMonth).sort().map(month => analytics.messagesByMonth[month]),
      backgroundColor: 'rgba(236, 72, 153, 0.3)',
      borderColor: '#ec4899',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }]
  };

  // Categorize love words for better display
  const loveWordCategories = {
    english: ['love', 'miss', 'heart', 'kiss', 'hug', 'cute', 'beautiful', 'handsome', 'amazing', 'wonderful', 'sweet', 'dear', 'darling', 'baby', 'honey', 'babe', 'sweetheart', 'gorgeous', 'stunning', 'lovely', 'precious', 'angel', 'princess', 'prince', 'queen', 'king', 'sunshine', 'moonlight', 'star', 'treasure'],
    nicknames: ['chiku', 'chikku', 'chikoo', 'choco', 'chocolate', 'cookie', 'cupcake', 'muffin', 'candy', 'sugar', 'sweetie', 'cutie', 'buddy', 'bunny', 'bear', 'teddy', 'tiger', 'lion', 'panda', 'motu'],
    hindi: ['jaan', 'jaanu', 'jaanam', 'pyaar', 'pyaara', 'pyaari', 'mohabbat', 'ishq', 'dil', 'dildar', 'mehboob', 'sanam', 'shona', 'sona', 'meri', 'tera', 'tumhara', 'hamara', 'priya', 'priye', 'rajkumar', 'rajkumari', 'rani', 'raja', 'bachcha', 'bacche', 'beta', 'betu', 'gudiya', 'guddu', 'chintu', 'pintu', 'mintu', 'bunty', 'montu', 'pappu', 'bablu', 'champ', 'hero', 'heroine']
  };

  const getCategoryEmoji = (word: string) => {
    if (loveWordCategories.hindi.includes(word)) return '🇮🇳';
    if (loveWordCategories.nicknames.includes(word)) return '🥰';
    return '💖';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const totalMessages = chatData.totalMessages;
  const totalDays = chatData.totalDays;
  const averagePerDay = Math.round(totalMessages / totalDays);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="elegant-card p-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center space-x-3 text-neutral-600 hover:text-neutral-900 transition-colors group"
          >
            <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Upload New Chat</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
              Your Chat <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-neutral-600 font-medium">
              {format(chatData.dateRange.start, 'MMM dd, yyyy')} - {format(chatData.dateRange.end, 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowChatView(false)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                !showChatView 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-elegant' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setShowChatView(true)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                showChatView 
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-elegant' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              💬 Chat
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Content */}
      {showChatView ? (
        /* Chat View */
        <ChatReader messages={chatData.messages} participants={participants} />
      ) : (
        /* Analytics View */
        <>
      {/* Chat Participants Header */}
      <div className="bg-gradient-to-r from-romantic-100 to-love-100 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200 mb-8 text-center">
        <h2 className="text-2xl font-romantic font-bold text-romantic-800 mb-2">
          💕 Chat Between 💕
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-white/70 rounded-full px-4 py-2 border border-romantic-200">
            <span className="font-semibold text-romantic-800">{participants[0]}</span>
          </div>
          <Heart className="w-6 h-6 text-pink-500 heart-animation" />
          <div className="bg-white/70 rounded-full px-4 py-2 border border-love-200">
            <span className="font-semibold text-love-800">{participants[1]}</span>
          </div>
        </div>
        <p className="text-sm text-romantic-600 mt-3">
          From {format(new Date(chatData.dateRange.start), 'MMM dd, yyyy')} to {format(new Date(chatData.dateRange.end), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="elegant-card p-6 text-center group">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-display font-bold text-neutral-900 mb-1">{totalMessages.toLocaleString()}</div>
          <div className="text-sm text-neutral-600 font-medium">Total Messages</div>
        </div>
        
        <div className="elegant-card p-6 text-center group">
          <div className="p-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-display font-bold text-neutral-900 mb-1">{totalDays}</div>
          <div className="text-sm text-neutral-600 font-medium">Days Chatting</div>
        </div>
        
        <div className="elegant-card p-6 text-center group">
          <div className="p-3 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-display font-bold text-neutral-900 mb-1">{averagePerDay}</div>
          <div className="text-sm text-neutral-600 font-medium">Daily Average</div>
        </div>
        
        <div className="elegant-card p-6 text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-accent-50/80"></div>
          <div className="relative z-10">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center">
                <span className="text-xl text-white mr-1">🔥</span>
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-neutral-900 mb-1">{analytics.streak.current}</div>
            <div className="text-sm text-neutral-600 font-medium">Day Streak</div>
            <div className="text-xs text-neutral-500 mt-2 font-medium">Record: {analytics.streak.longest}</div>
          </div>
        </div>

        <div className="elegant-card p-6 text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 to-red-50/80"></div>
          <div className="relative z-10">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-neutral-900 mb-1">{analytics.loveScore.totalScore}</div>
            <div className="text-sm text-neutral-600 font-medium">Love Score</div>
            <div className="text-xs text-neutral-500 mt-2 font-medium">Grade: {analytics.loveScore.grade}</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Message Distribution */}
        <div className="elegant-card p-8">
          <h3 className="text-2xl font-display font-bold text-neutral-900 mb-6 text-center flex items-center justify-center space-x-2">
            <MessageCircle className="w-6 h-6 text-primary-500" />
            <span>Message Distribution</span>
          </h3>
          <div className="chart-container">
            <Bar data={messagesByParticipantChart} options={chartOptions} />
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
              <span className="font-medium text-neutral-700">{participants[0]}</span>
              <span className="text-neutral-900 font-semibold">
                {analytics.messagesByParticipant[participants[0]]} 
                <span className="text-sm text-neutral-500 ml-1">
                  ({Math.round((analytics.messagesByParticipant[participants[0]] / totalMessages) * 100)}%)
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
              <span className="font-medium text-neutral-700">{participants[1]}</span>
              <span className="text-neutral-900 font-semibold">
                {analytics.messagesByParticipant[participants[1]]} 
                <span className="text-sm text-neutral-500 ml-1">
                  ({Math.round((analytics.messagesByParticipant[participants[1]] / totalMessages) * 100)}%)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center">
            When Love Happens ⏰
          </h3>
          <div className="chart-container">
            <Bar data={hourlyChart} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-romantic-600">
              Most active hour: {Object.entries(analytics.messagesByHour)
                .reduce((max, [hour, count]) => count > max.count ? { hour, count } : max, { hour: '0', count: 0 }).hour}:00
            </p>
          </div>
        </div>
      </div>

      {/* Emoji and Love Words */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Emojis */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
            <Smile className="w-5 h-5 text-romantic-600" />
            <span>Your Favorite Emojis</span>
          </h3>
          <div className="space-y-3">
            {topEmojis.map(([emoji, count], index) => (
              <div key={emoji} className="flex items-center justify-between bg-romantic-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-medium text-romantic-800">#{index + 1}</span>
                </div>
                <span className="text-romantic-600 font-semibold">{count} times</span>
              </div>
            ))}
          </div>
        </div>

        {/* Love Words */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
            <Heart className="w-5 h-5 text-romantic-600" />
            <span>Words of Love</span>
          </h3>
          <div className="space-y-3">
            {topLoveWords.map(([word, count]) => (
              <div key={word} className="flex items-center justify-between bg-love-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryEmoji(word)}</span>
                  <span className="font-medium text-romantic-800 capitalize">{word}</span>
                  {loveWordCategories.hindi.includes(word) && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Hindi</span>
                  )}
                  {loveWordCategories.nicknames.includes(word) && (
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Nickname</span>
                  )}
                </div>
                <span className="text-love-600 font-semibold">{count} times</span>
              </div>
            ))}
          </div>
          {topLoveWords.length === 0 && (
            <p className="text-center text-romantic-600 py-8">
              No love words detected yet... time to be more romantic! 💕
            </p>
          )}
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
            <Activity className="w-5 h-5 text-romantic-600" />
            <span>Weekly Love Pattern</span>
          </h3>
          <div className="chart-container">
            <Bar data={weeklyChart} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-romantic-600">
              Most active day: {Object.entries(analytics.weeklyActivity)
                .reduce((max, [day, count]) => count > max.count ? { day, count } : max, { day: '', count: 0 }).day}
            </p>
          </div>
        </div>

        {/* Time of Day Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center">
            When Do You Chat? 🕐
          </h3>
          <div className="chart-container">
            <Doughnut data={timeOfDayChart} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {position: 'bottom'}}}} />
          </div>
        </div>
      </div>

      {/* Chat Timeline */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
          <TrendingUp className="w-5 h-5 text-romantic-600" />
          <span>Your Love Story Timeline</span>
        </h3>
        <div className="chart-container">
          <Line data={monthlyChart} options={chartOptions} />
        </div>
        <p className="text-center text-sm text-romantic-600 mt-4 flex items-center justify-center space-x-2">
          <span>Messages exchanged over time - watch your love grow!</span>
          <Heart className="w-4 h-4 text-pink-500" />
        </p>
      </div>

      {/* Most Used Words */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
          <BookOpen className="w-5 h-5 text-romantic-600" />
          <span>Your Favorite Words</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {topWords.map(([word, count], index) => (
            <div key={word} className="flex items-center justify-between bg-romantic-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <span className="text-romantic-500 font-bold">#{index + 1}</span>
                <span className="font-medium text-romantic-800 capitalize">{word}</span>
              </div>
              <span className="text-romantic-600 font-semibold">{count} times</span>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Questions vs Exclamations */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center">
            Communication Style 🗣️
          </h3>
          <div className="space-y-4">
            {participants.map(participant => (
              <div key={participant} className="space-y-2">
                <h4 className="font-semibold text-romantic-700">{participant}</h4>
                <div className="flex justify-between items-center bg-romantic-50 rounded-lg p-3">
                  <span className="text-sm flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-romantic-600" />
                    <span>Questions asked</span>
                  </span>
                  <span className="font-bold text-romantic-800">{analytics.questionStats[participant] || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-love-50 rounded-lg p-3">
                  <span className="text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-love-600" />
                    <span>Exclamations used</span>
                  </span>
                  <span className="font-bold text-love-800">{analytics.exclamationStats[participant] || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Response Times */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center">
            Response Times ⏱️
          </h3>
          <div className="space-y-4">
            {participants.map(participant => {
              const avgTime = analytics.averageResponseTime[participant] || 0;
              const hours = Math.floor(avgTime / 60);
              const minutes = Math.round(avgTime % 60);
              return (
                <div key={participant} className="bg-romantic-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-romantic-700">{participant}</span>
                    <span className="text-xs text-romantic-500">Average Response</span>
                  </div>
                  <div className="text-2xl font-bold text-romantic-800">
                    {hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`}
                  </div>
                  <div className="text-xs text-romantic-600 mt-1 flex items-center justify-center space-x-1">
                    {avgTime < 5 ? (
                      <>
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>Lightning fast!</span>
                      </>
                    ) : avgTime < 30 ? (
                      <>
                        <Timer className="w-3 h-3 text-green-500" />
                        <span>Quick responder</span>
                      </>
                    ) : avgTime < 120 ? (
                      <>
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>Pretty responsive</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>Takes their time</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call Statistics */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
          <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
            <Phone className="w-5 h-5 text-romantic-600" />
            <span>Call Stats</span>
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Calls</span>
                <span className="text-xl font-bold text-green-600">{analytics.callStats.totalCalls}</span>
              </div>
            </div>
            
            {analytics.callStats.totalDuration > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Total Duration</span>
                  <span className="text-lg font-bold text-blue-600">
                    {Math.floor(analytics.callStats.totalDuration / 60)}h {Math.round(analytics.callStats.totalDuration % 60)}m
                  </span>
                </div>
                <div className="text-xs text-blue-500">
                  Avg: {Math.round(analytics.callStats.averageDuration)} min per call
                </div>
              </div>
            )}
            
            {analytics.callStats.missedCalls > 0 && (
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Missed Calls</span>
                  <span className="text-lg font-bold text-red-600">{analytics.callStats.missedCalls}</span>
                </div>
              </div>
            )}
            
            {participants.map(participant => (
              <div key={participant} className="bg-romantic-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-romantic-700">{participant}</span>
                  <span className="text-sm font-bold text-romantic-800">
                    {analytics.callStats.callsByParticipant[participant] || 0} calls
                  </span>
                </div>
              </div>
            ))}
            
            {analytics.callStats.totalCalls === 0 && (
              <div className="text-center py-4">
                <span className="text-2xl">📵</span>
                <p className="text-sm text-gray-500 mt-2">No calls detected in chat</p>
                <p className="text-xs text-gray-400">Calls might not be mentioned in messages</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Longest Messages by Participant */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-6 text-center">
          Longest Messages Ever 📝✨
        </h3>
        <div className="space-y-6">
          {participants.map(participant => {
            const longestMsg = analytics.longestMessageByParticipant[participant];
            if (!longestMsg) return null;
            
            return (
              <div key={participant} className="bg-gradient-to-r from-romantic-50 to-love-50 rounded-xl p-4 border border-romantic-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-romantic-800">{participant}</span>
                    <span className="text-sm bg-romantic-200 text-romantic-700 px-2 py-1 rounded-full">
                      {longestMsg.length} characters
                    </span>
                  </div>
                  <div className="text-xs text-romantic-600">
                    {format(longestMsg.timestamp, 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border-l-4 border-romantic-400">
                  <p className="text-romantic-800 leading-relaxed">
                    {longestMsg.content.length > 300 
                      ? `${longestMsg.content.substring(0, 300)}...` 
                      : longestMsg.content
                    }
                  </p>
                  {longestMsg.content.length > 300 && (
                    <button className="text-romantic-600 text-sm mt-2 hover:text-romantic-800 transition-colors">
                      Show full message
                    </button>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-romantic-600">
                  <span>
                    {longestMsg.length > 500 ? "Epic novel! 📚" :
                     longestMsg.length > 200 ? "Quite the storyteller! 📖" :
                     longestMsg.length > 100 ? "Getting chatty! 💬" :
                     "Short and sweet! 😊"}
                  </span>
                  <span>
                    {Math.round(longestMsg.length / 5)} words approx.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Overall Longest Message */}
        {(() => {
          const allLongestMessages = Object.values(analytics.longestMessageByParticipant);
          const overallLongest = allLongestMessages.reduce((max, msg) => 
            msg.length > max.length ? msg : max, 
            { length: 0, sender: '', content: '', timestamp: new Date() }
          );
          
          if (overallLongest.length > 0) {
            return (
              <div className="mt-6 bg-gradient-to-r from-love-100 to-romantic-100 rounded-xl p-4 border-2 border-love-300">
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-love-800">🏆 Record Holder 🏆</span>
                  <p className="text-sm text-love-600">Longest message in your entire chat history!</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <p className="text-love-800 font-semibold">
                    <span className="text-xl">{overallLongest.sender}</span> with an epic{' '}
                    <span className="text-2xl font-bold text-love-600">{overallLongest.length}</span> character message!
                  </p>
                  <p className="text-sm text-love-600 mt-1">
                    Sent on {format(overallLongest.timestamp, 'MMM dd, yyyy')} - That&apos;s approximately {Math.round(overallLongest.length / 5)} words! 🎉
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Special Moments */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-6 text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-romantic-600" />
          <span>Special Moments</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-romantic-50 rounded-xl">
            <Calendar className="w-8 h-8 text-romantic-500 mx-auto mb-2" />
            <h4 className="font-semibold text-romantic-800">Chattiest Day</h4>
            <p className="text-2xl font-bold text-romantic-600">
              {analytics.longestConversation.messageCount}
            </p>
            <p className="text-sm text-romantic-600">
              {format(new Date(analytics.longestConversation.date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="text-center p-4 bg-love-50 rounded-xl">
            <Clock className="w-8 h-8 text-love-500 mx-auto mb-2" />
            <h4 className="font-semibold text-romantic-800">Avg Response Time</h4>
            <p className="text-lg font-bold text-love-600">
              {Math.round(Object.values(analytics.averageResponseTime).reduce((sum, time) => sum + time, 0) / Object.keys(analytics.averageResponseTime).length) || 0} min
            </p>
            <div className="text-xs text-love-600 flex items-center justify-center space-x-1">
              <Timer className="w-3 h-3 text-love-500" />
              <span>Keep it quick!</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-romantic-50 rounded-xl">
            <Smile className="w-8 h-8 text-romantic-500 mx-auto mb-2" />
            <h4 className="font-semibold text-romantic-800">Emoji Lovers</h4>
            <p className="text-2xl font-bold text-romantic-600">
              {Object.values(analytics.emojiStats).reduce((sum, count) => sum + count, 0)}
            </p>
            <p className="text-sm text-romantic-600">Total emojis sent</p>
          </div>
        </div>
      </div>

      {/* Love Score Breakdown */}
      <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 border-2 border-pink-200">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-romantic font-bold text-pink-800 mb-3 flex items-center justify-center space-x-2">
            <Heart className="w-8 h-8 text-pink-600" />
            <span>Love Score Analysis</span>
            <Heart className="w-8 h-8 text-pink-600" />
          </h3>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-8 py-4">
              <span className="text-4xl font-bold">{analytics.loveScore.totalScore}/100</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-700 mb-1">Grade: {analytics.loveScore.grade}</div>
              <div className="text-lg text-pink-600 font-medium">{analytics.loveScore.description}</div>
            </div>
          </div>
          
          {/* Score Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className={`bg-gradient-to-r from-pink-400 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(100, analytics.loveScore.totalScore)}%` }}
            ></div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Love Words</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.loveWordsScore)}/25
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.loveWordsScore / 25) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              Based on romantic words used in your chats
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <Smile className="w-4 h-4 text-pink-600" />
                <span>Emojis & Hearts</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.emojiScore)}/20
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.emojiScore / 20) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              Emoji usage, especially heart emojis
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-pink-600" />
                <span>Chat Frequency</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.frequencyScore)}/20
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.frequencyScore / 20) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              How often you message each other daily
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-pink-600" />
                <span>Response Speed</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.responseScore)}/15
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.responseScore / 15) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              How quickly you respond to each other
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-pink-600" />
                <span>Consistency</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.consistencyScore)}/10
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.consistencyScore / 10) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              Your longest chatting streak
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-pink-600" />
                <span>Engagement</span>
              </h4>
              <span className="text-pink-600 font-bold">
                {Math.round(analytics.loveScore.factors.engagementScore)}/10
              </span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className={`bg-pink-500 h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, (analytics.loveScore.factors.engagementScore / 10) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-pink-600 mt-2">
              Questions asked and excitement shown
            </p>
          </div>
        </div>

        {/* Love Score Interpretation */}
        <div className="mt-8 bg-white/90 rounded-xl p-6 border border-pink-200">
          <h4 className="font-semibold text-pink-800 mb-4 text-center">💝 What Your Love Score Means</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-600 font-medium">85-100: Epic Love Story! 💖✨</span>
                <span className="text-green-600">A+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">75-84: True Love 💕</span>
                <span className="text-blue-600">A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600 font-medium">65-74: Sweet Romance 💗</span>
                <span className="text-purple-600">B+</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-pink-600 font-medium">55-64: Growing Love 🌱💕</span>
                <span className="text-pink-600">B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600 font-medium">45-54: Good Connection 😊</span>
                <span className="text-orange-600">C+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Below 45: Building Romance 💫</span>
                <span className="text-gray-600">C-D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-gradient-to-r from-romantic-100 to-love-100 rounded-2xl p-6 border border-romantic-200">
        <h3 className="text-xl font-romantic font-bold text-romantic-800 mb-4 text-center flex items-center justify-center space-x-2">
          <Heart className="w-5 h-5 text-romantic-600" />
          <span>Fun Love Facts</span>
          <Heart className="w-5 h-5 text-romantic-600" />
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-center">
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>If printed:</strong> Your chat would be approximately{' '}
              <span className="text-romantic-800 font-bold">
                {Math.ceil(totalMessages / 50)} pages
              </span> long! 📄
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Message Marathon:</strong> You've been chatting for{' '}
              <span className="text-romantic-800 font-bold">
                {totalDays} days
              </span> straight! 🏃‍♂️💨
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Love Languages:</strong> You used{' '}
              <span className="text-romantic-800 font-bold">
                {Object.entries(analytics.loveWords).filter(([word, count]) => 
                  count > 0 && loveWordCategories.hindi.includes(word)
                ).length} Hindi
              </span> and{' '}
              <span className="text-romantic-800 font-bold">
                {Object.entries(analytics.loveWords).filter(([word, count]) => 
                  count > 0 && loveWordCategories.english.includes(word)
                ).length} English
              </span> love words! 🇮🇳💕
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Cute Nicknames:</strong> You have{' '}
              <span className="text-romantic-800 font-bold">
                {Object.entries(analytics.loveWords).filter(([word, count]) => 
                  count > 0 && loveWordCategories.nicknames.includes(word)
                ).length} special nicknames
              </span> for each other! 🥰
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Word Count:</strong> Together you've shared approximately{' '}
              <span className="text-romantic-800 font-bold">
                {(totalMessages * 8).toLocaleString()} words
              </span> of love! 📚
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Time Investment:</strong> You've spent about{' '}
              <span className="text-romantic-800 font-bold">
                {Math.round(totalMessages * 0.5)} minutes
              </span> typing to each other! ⏱️
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Epic Message:</strong> Your longest message was{' '}
              <span className="text-romantic-800 font-bold">
                {Math.max(...Object.values(analytics.longestMessageByParticipant).map(msg => msg.length))} characters
              </span> long! 📝
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-romantic-700">
              <strong>Love Score:</strong> You scored{' '}
              <span className="text-romantic-800 font-bold">
                {analytics.loveScore.totalScore}/100 ({analytics.loveScore.grade})
              </span> in romance! 💖
            </p>
          </div>
        </div>
      </div>

      {/* Conversation Initiator Feature */}
      <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl p-6 border border-pink-200 mb-8 text-center">
        <h2 className="text-2xl font-romantic font-bold text-pink-800 mb-2 flex items-center justify-center space-x-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          <span>Who Initiates the Conversation?</span>
        </h2>
        <div className="flex items-center justify-center space-x-8 mt-4">
          {participants.map((p, idx) => (
            <div key={p} className="bg-white/80 rounded-xl px-6 py-4 border border-pink-200 shadow-elegant">
              <div className="text-lg font-bold text-pink-700 mb-1">{p}</div>
              <div className="text-3xl font-display font-bold text-pink-800 mb-1">{analytics.initiatorCount[p] || 0}</div>
              <div className="text-sm text-pink-600 font-medium">Times initiated</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-sm text-pink-700">
          <span className="font-semibold">First ever message:</span> <span className="font-bold">{analytics.firstMessageByDay[Object.keys(analytics.firstMessageByDay).sort()[0]]}</span>
        </div>
      </div>

      {/* Cute Insights Section */}
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-romantic font-bold text-pink-800 mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <span>Cute Insights That Make You Happy</span>
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
          </h2>
          <p className="text-pink-600 text-lg">Special moments and sweet memories from your conversations!</p>
        </div>

        {/* Sweet Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Thoughtfulness Score */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 border border-pink-200 text-center">
            <div className="text-4xl mb-2">💝</div>
            <h3 className="text-lg font-bold text-pink-800 mb-2">Thoughtfulness Score</h3>
            <div className="text-3xl font-bold text-pink-700 mb-1">{analytics.cuteInsights.thoughtfulnessScore}%</div>
            <p className="text-sm text-pink-600">Based on your sweet gestures!</p>
          </div>

          {/* Good Morning/Night Messages */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200 text-center">
            <div className="text-4xl mb-2">🌅</div>
            <h3 className="text-lg font-bold text-orange-800 mb-2">Morning & Night Wishes</h3>
            <div className="text-2xl font-bold text-orange-700 mb-1">
              {analytics.cuteInsights.goodMorningCount + analytics.cuteInsights.goodNightCount}
            </div>
            <p className="text-sm text-orange-600">
              {analytics.cuteInsights.goodMorningCount} mornings, {analytics.cuteInsights.goodNightCount} nights
            </p>
          </div>

          {/* Laughter Together */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200 text-center">
            <div className="text-4xl mb-2">😂</div>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Laughter Together</h3>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{analytics.cuteInsights.laughingTogether}</div>
            <p className="text-sm text-yellow-600">Moments of pure joy!</p>
          </div>

          {/* Supportive Messages */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 text-center">
            <div className="text-4xl mb-2">🤗</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Support & Encouragement</h3>
            <div className="text-3xl font-bold text-green-700 mb-1">{analytics.cuteInsights.supportiveMessages}</div>
            <p className="text-sm text-green-600">Times you lifted each other up!</p>
          </div>

          {/* Happy Emojis */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 text-center">
            <div className="text-4xl mb-2">😊</div>
            <h3 className="text-lg font-bold text-purple-800 mb-2">Happy Emojis</h3>
            <div className="text-3xl font-bold text-purple-700 mb-1">{analytics.cuteInsights.happyEmojis}</div>
            <p className="text-sm text-purple-600">Spreading happiness together!</p>
          </div>

          {/* Favorite Day */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-6 border border-indigo-200 text-center">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="text-lg font-bold text-indigo-800 mb-2">Favorite Chat Day</h3>
            <div className="text-2xl font-bold text-indigo-700 mb-1">{analytics.cuteInsights.favoriteDay.day}</div>
            <p className="text-sm text-indigo-600">{analytics.cuteInsights.favoriteDay.count} messages</p>
          </div>
        </div>

        {/* Special Moments */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border border-pink-200 mb-6">
          <h3 className="text-2xl font-romantic font-bold text-pink-800 mb-4 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <span>Special Moments</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-xl p-4 border border-pink-100">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-bold text-pink-700 mb-1">Sweetest Hour</h4>
              <p className="text-pink-600">
                {analytics.cuteInsights.sweetestHour.hour}:00 - Most love words shared!
              </p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-pink-100">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-bold text-pink-700 mb-1">Longest Chat Session</h4>
              <p className="text-pink-600">
                {analytics.cuteInsights.longestChatSession.messages} messages in one day!
              </p>
            </div>
          </div>
        </div>

        {/* Memory Moments */}
        {analytics.cuteInsights.memoryMoments.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200 mb-6">
            <h3 className="text-2xl font-romantic font-bold text-purple-800 mb-4 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span>Memory Moments</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.cuteInsights.memoryMoments.map((memory, index) => (
                <div key={index} className="bg-white/70 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-bold text-purple-700 mb-2">{memory.type}</h4>
                  <p className="text-purple-600 text-sm mb-2">Count: {memory.count}</p>
                  {memory.example && (
                    <p className="text-purple-500 text-xs italic">"{memory.example}..."</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekend vs Weekday */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 border border-orange-200 mb-6">
          <h3 className="text-2xl font-romantic font-bold text-orange-800 mb-4 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            <span>Chat Patterns</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-xl p-4 border border-orange-100 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h4 className="font-bold text-orange-700 mb-1">Weekend Chats</h4>
              <div className="text-2xl font-bold text-orange-600">{analytics.cuteInsights.weekendVsWeekday.weekend}</div>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-orange-100 text-center">
              <div className="text-2xl mb-2">💼</div>
              <h4 className="font-bold text-orange-700 mb-1">Weekday Chats</h4>
              <div className="text-2xl font-bold text-orange-600">{analytics.cuteInsights.weekendVsWeekday.weekday}</div>
            </div>
          </div>
        </div>

        {/* Compliments Given */}
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 border border-rose-200">
          <h3 className="text-2xl font-romantic font-bold text-rose-800 mb-4 flex items-center space-x-2">
            <Star className="w-6 h-6 text-rose-500" />
            <span>Sweet Compliments</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(analytics.cuteInsights.complimentsGiven)
              .filter(([_, count]) => count > 0)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([word, count]) => (
                <div key={word} className="bg-white/70 rounded-lg p-3 border border-rose-100 text-center">
                  <div className="font-bold text-rose-700 capitalize">{word}</div>
                  <div className="text-lg font-bold text-rose-600">{count}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
