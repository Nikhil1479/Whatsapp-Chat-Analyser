# 💕 WhatsApp Chat Analyzer

A beautiful and comprehensive React TypeScript application for analyzing WhatsApp chat exports with romantic and cute analytics. Transform your chat conversations into meaningful insights with elegant visualizations and detailed statistics.

![WhatsApp Chat Analyzer](https://img.shields.io/badge/WhatsApp-Chat%20Analyzer-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🌐 Live Demo

**[View Live App →](https://nikhil1479.github.io/Whatsapp-Chat-Analyser/)**

> 🔒 **Privacy First**: All chat analysis happens locally in your browser. No data is sent to any server.

## ✨ Features

### � Beautiful UI/UX
- **Modern Glass Morphism Design** - Elegant backdrop blur effects and transparent cards
- **Romantic Color Palette** - Soft pinks, roses, and warm orange tones
- **Smooth Animations** - Heart pulses, floating elements, and fade-in transitions
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Clean Typography** - Dancing Script font for romantic headings, modern sans-serif for content
- **Flat Pastel Icons** - Beautiful Lucide React icons for elegant visual experience

### 📊 Comprehensive Analytics

#### **Core Statistics**
- **Total Messages** - Complete message count with formatting
- **Chat Duration** - Total days of conversation
- **Daily Average** - Messages per day calculation
- **Message Distribution** - Breakdown by participant with percentages

#### **Activity Patterns**
- **Hourly Analysis** - 24-hour activity heatmap showing when you chat most
- **Weekly Patterns** - Day-of-week analysis to find your most active days
- **Time of Day** - Morning, afternoon, evening, and night activity breakdown
- **Monthly Timeline** - Messages over time showing relationship growth

#### **Communication Insights**
- **Response Time Analysis** - Average response times for each participant
- **Communication Style** - Questions asked vs exclamations used
- **Message Length Analysis** - Longest messages by each participant
- **Call Statistics** - Total calls, duration, and missed calls tracking

#### **Love Score Algorithm** (🔥 Featured)
A sophisticated scoring system (0-100) that analyzes:
- **Love Words Usage** (25 points) - Romantic expressions in English, Hindi, and nicknames
- **Emoji & Hearts** (20 points) - Heart emojis and expressive communication
- **Chat Frequency** (20 points) - How often you message daily
- **Response Speed** (15 points) - How quickly you respond to each other
- **Consistency** (10 points) - Your longest chatting streak
- **Engagement** (10 points) - Questions and excitement levels

#### **Content Analysis**
- **Top Emojis** - Most used emojis with usage counts
- **Love Words Detection** - Romantic expressions categorized by:
  - English love words (love, miss, heart, beautiful, etc.)
  - Hindi expressions (jaan, pyaar, dil, etc.)
  - Cute nicknames (chiku, baby, sweetheart, etc.)
- **Popular Words** - Most frequently used words (excluding common words)
- **Language Diversity** - Multi-language love word detection

#### **Streak Analysis** (🔧 Recently Fixed)
- **Current Streak** - Consecutive days of active chatting
- **Longest Streak** - Your record for continuous communication
- **Smart Logic** - Properly calculates consecutive days and handles gaps

### 💬 Interactive Chat Reader
- **Dual View Mode** - Switch between Analytics and Chat views
- **Search Functionality** - Find specific messages, dates, or senders
- **Filter Options** - Filter by participant, date range, or message type
- **Pagination** - Smooth navigation through large chat histories
- **Message Formatting** - Proper display of timestamps, emojis, and formatting

### 🎯 Special Features

#### **🚀 GitHub Integration** (New!)
- **Automatic Backup** - Securely upload chat files to your private GitHub repository
- **Private Storage** - All data stored in your own private "chats" repository
- **Rich Metadata** - Each backup includes timestamps, participants, and statistics
- **Easy Setup** - One-time configuration with GitHub Personal Access Token
- **Non-blocking** - Chat analysis continues even if backup fails
- **Privacy First** - Your data never leaves your control

#### **Fun Facts & Insights**
- Page count estimation if chat were printed
- Total words and typing time calculations
- Language breakdown (Hindi vs English love words)
- Nickname count and usage
- Epic message highlights

#### **Privacy-First Design**
- **100% Client-Side Processing** - No data ever leaves your device
- **No Server Required** - Everything runs in your browser
- **Secure File Handling** - Files are processed locally and never uploaded

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nikhil1479/Whatsapp-Chat-Analyser.git
   cd Whatsapp-Chat-Analyser
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 📱 How to Export WhatsApp Chat

### For iPhone:
1. Open WhatsApp and go to the chat you want to export
2. Tap the contact name at the top
3. Scroll down and tap "Export Chat"
4. Choose "Without Media" for faster processing
5. Save the `.txt` file to your device

### For Android:
1. Open WhatsApp and select the chat
2. Tap the three dots menu (⋮)
3. Select "More" → "Export chat"
4. Choose "Without Media"
5. Save the `.txt` file to your device

## 🛠️ Technical Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.0+** - Type-safe development with comprehensive interfaces
- **Vite 4.4+** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.3+** - Utility-first CSS framework
- **Custom CSS** - Romantic animations and glass morphism effects
- **Lucide React** - Beautiful flat pastel icons (replaced emojis for elegance)

### Data Visualization
- **Chart.js 4.4+** - Comprehensive charting library
- **react-chartjs-2** - React wrapper for Chart.js
- Chart types used:
  - Bar charts for message distribution and activity
  - Line charts for timeline analysis
  - Doughnut charts for time-of-day breakdown

### Date Management
- **date-fns 2.30+** - Modern date utility library
- Functions used:
  - `format` - Date formatting
  - `parseISO` - ISO string parsing
  - `differenceInDays` - Date calculations
  - `subDays` - Date arithmetic

## 📁 Project Structure

```
src/
├── components/
│   ├── Analytics.tsx       # Main analytics dashboard component
│   ├── FileUpload.tsx     # File upload and parsing component
│   └── ChatReader.tsx     # Interactive chat viewer (embedded in Analytics)
├── types/
│   └── ChatTypes.ts       # TypeScript interfaces and types
├── App.tsx               # Main application component
├── App.css              # Global styles and animations
├── main.tsx             # Application entry point
└── index.css            # Tailwind CSS imports
```

### Key Files Explained

#### `ChatTypes.ts` - Type Definitions
```typescript
export interface Message {
  timestamp: Date;
  sender: string;
  content: string;
}

export interface ChatData {
  participants: string[];
  messages: Message[];
  totalMessages: number;
  totalDays: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface Analytics {
  messagesByParticipant: { [key: string]: number };
  messagesByHour: number[];
  weeklyActivity: { [key: string]: number };
  timeOfDayActivity: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  loveScore: {
    totalScore: number;
    grade: string;
    description: string;
    factors: {
      loveWordsScore: number;
      emojiScore: number;
      frequencyScore: number;
      responseScore: number;
      consistencyScore: number;
      engagementScore: number;
    };
  };
  // ... more analytics interfaces
}
```

#### `Analytics.tsx` - Main Engine
The core analytics component that:
- Processes chat data and calculates all statistics
- Implements the Love Score algorithm with 6 factors
- Renders beautiful charts and visualizations
- Provides interactive chat reader functionality
- Handles dual-view mode (Analytics/Chat)

#### `FileUpload.tsx` - File Processing
Handles:
- File selection and validation
- WhatsApp chat parsing logic (supports multiple date formats)
- Loading states with elegant animations
- Error handling and user feedback
- Progress feedback during processing

## 🎨 Styling Guide

### Color Palette
```css
/* Primary romantic colors */
--primary-50: #fdf2f8;
--primary-500: #ec4899;
--primary-600: #db2777;

/* Accent warm colors */
--accent-500: #f97316;
--accent-600: #ea580c;

/* Romantic theme */
--romantic-100: #fce7f3;
--romantic-800: #9d174d;

/* Love theme */
--love-100: #fef3c7;
--love-800: #92400e;
```

### Custom Animations
```css
/* Heart pulse animation */
.heart-pulse {
  animation: heartPulse 2s ease-in-out infinite;
}

/* Float animation */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(135deg, #ec4899, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glass Morphism
```css
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.elegant-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## � Configuration

### Tailwind CSS Configuration
The project uses a custom Tailwind configuration with:
- Extended color palette for romantic themes
- Custom font families (Dancing Script for headings)
- Extended animation utilities
- Backdrop blur utilities

### Vite Configuration
Optimized for:
- Fast development with Hot Module Replacement
- TypeScript support
- CSS processing
- Production build optimization

## 🐛 Known Issues & Solutions

### ✅ Recently Fixed
- **Streak Calculation Bug** - Fixed incorrect longest streak calculation that was showing 55 for most chats
- **Import Syntax Error** - Resolved corrupted import statements
- **Emoji-to-Icon Migration** - Successfully replaced all emojis with elegant Lucide React icons

### Current Status
- ✅ All core functionality working
- ✅ Love Score algorithm accurate
- ✅ Streak calculations fixed
- ✅ Modern icon system implemented
- ⚠️ Chart.js inline styles (expected warnings, doesn't affect functionality)

## 🚀 Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Quick Setup
1. **Fork or clone** this repository
2. **Enable GitHub Pages** in repository settings
3. **Push to main branch** - deployment happens automatically
4. **Access your app** at `https://yourusername.github.io/Whatsapp-Chat-Analyser/`

#### Manual Deployment Steps
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any changes to the `main` branch
4. GitHub Actions will build and deploy automatically

For detailed deployment instructions, see [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)

### Local Deployment
```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

### Other Hosting Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Import repository and deploy
- **Firebase Hosting**: Use Firebase CLI to deploy

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain the romantic/cute theme
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📈 Future Enhancements

### Planned Features
- **Export Analytics** - Save insights as PDF or image
- **Comparison Mode** - Compare multiple chat exports
- **Advanced Filters** - More granular filtering options
- **Dark Mode** - Dark theme with romantic accents
- **Multiple Languages** - Support for more languages in love word detection

### Technical Improvements
- **Performance Optimization** - Virtual scrolling for large chats
- **PWA Support** - Progressive Web App capabilities
- **Offline Mode** - Work without internet connection
- **Advanced Animations** - More sophisticated UI animations

## 💝 Perfect For

- Couples wanting to analyze their relationship through data
- Anniversary gifts with a tech twist
- Fun insights into communication patterns
- Creating romantic presentations or memories
- Understanding relationship dynamics through chat patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- **Chart.js** - For beautiful data visualizations
- **Lucide React** - For elegant flat icons
- **Tailwind CSS** - For rapid UI development
- **date-fns** - For reliable date handling
- **React & TypeScript** - For robust application architecture

## 🌟 Support

If you found this project helpful, please:
- ⭐ Star the repository
- 🍴 Fork it for your own projects
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📤 Share with friends and loved ones

---

<div align="center">

**Made with 💕 for meaningful conversations**

*Transform your chats into beautiful memories*

[Demo](https://your-demo-link.com) • [Report Bug](https://github.com/Nikhil1479/Whatsapp-Chat-Analyser/issues) • [Request Feature](https://github.com/Nikhil1479/Whatsapp-Chat-Analyser/issues)

</div>
