# 💕 WhatsApp Chat Analyzer - Love Analytics

A beautiful and romantic web application that analyzes your WhatsApp chat exports to generate cute analytics about your relationship!

## ✨ Features

### 🎯 Core Analytics
- **Message Distribution**: See who's the chattier one in your relationship
- **Activity Patterns**: Discover when you both are most active throughout the day
- **Emoji Analysis**: Find out your most used emojis together
- **Love Words Detection**: Track romantic words and expressions
- **Response Time**: Analyze how quickly you respond to each other
- **Special Moments**: Highlight your chattiest days and milestones

### 🎨 Beautiful UI
- Romantic color scheme with soft pinks and warm oranges
- Cute animations and heart effects
- Glass morphism design with backdrop blur
- Fully responsive for mobile and desktop
- Dancing Script font for romantic headings

### 🔒 Privacy First
- All processing happens in your browser
- No data is sent to any server
- Your chat data stays completely private
- Client-side only application

## 🚀 How to Use

1. **Export Your WhatsApp Chat**
   - Open WhatsApp and go to your chat
   - Tap the menu (⋮) → More → Export chat
   - Choose "Without Media"
   - Save the .txt file

2. **Upload and Analyze**
   - Drag and drop your .txt file or click to browse
   - Wait for the magic to happen
   - Explore your beautiful love analytics!

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Animations**: Custom CSS animations

## 📱 Supported Formats

- WhatsApp exported chat files (.txt format)
- Supports various date formats from different regions
- Works with chats in multiple languages
- Handles both 12-hour and 24-hour time formats

## 🎪 Analytics Dashboard

### Quick Stats
- Total messages exchanged
- Days of conversation
- Average messages per day
- Total love words used

### Visual Charts
- **Message Distribution**: Bar chart showing who sends more messages
- **Hourly Activity**: When you're most active throughout the day
- **Top Emojis**: Your most frequently used emojis with counts
- **Love Words**: Romantic words and their frequency

### Special Moments
- **Chattiest Day**: The day with the most messages
- **Response Times**: How quickly you respond to each other
- **Fun Facts**: Interesting statistics about your conversations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd whatsapp-chat-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.tsx    # File upload and parsing component
│   └── Analytics.tsx     # Main analytics dashboard
├── types/
│   └── ChatTypes.ts      # TypeScript interfaces
├── App.tsx               # Main application component
├── App.css              # Custom styles and animations
├── index.css            # Tailwind and global styles
└── main.tsx             # Application entry point
```

## 🎨 Customization

### Colors
The app uses a romantic color palette defined in `tailwind.config.js`:
- **Romantic**: Pink tones (#fdf2f8 to #831843)
- **Love**: Orange/amber tones (#fff7ed to #7c2d12)

### Fonts
- **Headers**: Dancing Script (romantic cursive font)
- **Body**: Inter with Comic Sans MS fallback for cute feel

### Analytics
You can customize the love words detection by modifying the `loveWords` array in the Analytics component.

## 💝 Perfect For

- Couples wanting to analyze their relationship through data
- Anniversary gifts with a tech twist
- Fun insights into communication patterns
- Creating romantic presentations or memories
- Understanding relationship dynamics through chat patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💖 Made with Love

Created with ❤️ for couples who love data and romance! Perfect for surprising your significant other with cute insights about your conversations.

---

**Note**: This application processes all data locally in your browser. No chat data is ever transmitted to external servers, ensuring complete privacy of your personal conversations.
