# Excuse Killer 🎯

A gamified React web application to help you overcome procrastination by tracking challenges, maintaining streaks, and earning achievements.

## Features

- **Challenge Management**: Create challenges with customizable intensity levels (chill, normal, hardcore) and target dates
- **Timer System**: Built-in timer with circular progress visualization for focused work sessions
- **Progress Tracking**: View your daily streak, weekly/monthly stats, and recent completions
- **Achievement System**: Unlock badges by completing challenges and maintaining streaks
- **Pending Challenges**: Track all your ongoing and upcoming challenges grouped by timeframe
- **Glass Morphism UI**: Beautiful dark-themed interface with glass morphism effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data persists in your browser - no backend required

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations (ready for future enhancements)
- **localStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Challenge

1. Navigate to the Challenge page (default)
2. Fill in the challenge details:
   - Task description
   - Intensity level (chill: 10min, normal: 20min, hardcore: 30min)
   - Target timeframe (today, this week, this month, or custom date)
   - Optional: Enable timer
3. Click "Create Challenge"

### Completing a Challenge

1. After creating a challenge, it appears as an active challenge card
2. If timer is enabled, use Start/Pause/Reset controls
3. Click "Completed this challenge" when done
4. Earn XP based on intensity level and see confetti animation!

### Viewing Progress

Navigate to the Progress page to see:
- Current streak (consecutive days with completions)
- Weekly and monthly completion counts
- Your title badge (Starter → Overcomer → Super Overcomer → Unstoppable)
- Last 5 completed challenges
- All pending challenges grouped by timeframe

### Unlocking Achievements

Visit the Achievements page to view:
- **First Step**: Complete your first challenge
- **Week Warrior**: Maintain a 7-day streak
- **Unstoppable**: Maintain a 15-day streak
- **Speed Demon**: Complete a challenge in under 5 minutes
- **Consistency King**: Complete 30 challenges
- **AI Believer**: Use AI coach feature (coming in Phase 6)

## Sample Data

On first load, you'll see a "Load Sample Data" button to populate the app with:
- 5 past completions (creating a 5-day streak)
- 3 pending challenges
- 2 unlocked achievements

This helps you explore the features without starting from scratch.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Nav.jsx         # Navigation header
│   ├── Timer.jsx       # Circular progress timer
│   ├── Confetti.jsx    # Confetti animation
│   ├── PendingChallengesList.jsx
│   └── IntensityBadge.jsx
├── pages/              # Main page components
│   ├── ChallengePage.jsx
│   ├── ProgressPage.jsx
│   └── AchievementsPage.jsx
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   └── useGameStats.js
├── utils/              # Utility functions
│   ├── storage.js      # localStorage helpers
│   ├── gameLogic.js    # XP, streak, achievement logic
│   ├── dateUtils.js    # Date manipulation
│   └── sampleData.js   # Sample data generator
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

## Game Mechanics

### XP System
- Chill challenges: 30 XP
- Normal challenges: 50 XP
- Hardcore challenges: 75 XP

### Streak Calculation
- Consecutive days with at least one completion
- Must include today to maintain streak
- Resets if a day is missed

### Title Badges
- **Starter**: 0-2 day streak
- **Overcomer**: 3-6 day streak
- **Super Overcomer**: 7-14 day streak
- **Unstoppable**: 15+ day streak

## Future Enhancements (Phase 6)

- Browser notifications for scheduled challenges
- AI Coach integration with Gemini API
- Additional achievements
- Export/import data functionality
- Dark/light theme toggle

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ to help you kill excuses and achieve your goals!
