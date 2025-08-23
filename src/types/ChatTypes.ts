export interface Message {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
}

export interface ChatData {
  messages: Message[];
  participants: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  totalMessages: number;
  totalDays: number;
}

export interface AnalyticsData {
  messagesByParticipant: { [key: string]: number };
  messagesByDay: { [key: string]: number };
  messagesByHour: { [key: number]: number };
  emojiStats: { [key: string]: number };
  wordStats: { [key: string]: number };
  averageResponseTime: { [key: string]: number };
  longestConversation: {
    date: string;
    messageCount: number;
  };
  loveWords: { [key: string]: number };
  messagesByMonth: { [key: string]: number };
  weeklyActivity: { [key: string]: number };
  timeOfDayActivity: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  questionStats: { [key: string]: number };
  exclamationStats: { [key: string]: number };
  longestMessages: Array<{
    sender: string;
    content: string;
    length: number;
    timestamp: Date;
  }>;
  shortestMessages: Array<{
    sender: string;
    content: string;
    length: number;
    timestamp: Date;
  }>;
  longestMessageByParticipant: { [key: string]: {
    sender: string;
    content: string;
    length: number;
    timestamp: Date;
  }};
  dailyMessageCounts: { [key: string]: number };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  callStats: {
    totalCalls: number;
    totalDuration: number; // in minutes
    averageDuration: number;
    callsByParticipant: { [key: string]: number };
    missedCalls: number;
  };
  loveScore: {
    totalScore: number;
    factors: {
      loveWordsScore: number;
      emojiScore: number;
      frequencyScore: number;
      responseScore: number;
      consistencyScore: number;
      engagementScore: number;
    };
    grade: string;
    description: string;
  };
}
