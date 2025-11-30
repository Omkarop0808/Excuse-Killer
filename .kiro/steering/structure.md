# Project Structure

## Directory Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Top-level page components (routes)
├── hooks/              # Custom React hooks
├── utils/              # Pure utility functions and business logic
├── App.jsx             # Root component with routing
└── main.jsx            # Application entry point
```

## Component Architecture

- **Pages**: Top-level route components (ChallengePage, ProgressPage, AchievementsPage)
- **Components**: Reusable UI elements (Nav, Timer, Confetti, IntensityBadge, PendingChallengesList)
- **Hooks**: Custom React hooks for state management (useLocalStorage, useGameStats)
- **Utils**: Pure functions for business logic, storage, and calculations

## Code Conventions

### File Naming
- React components: PascalCase with `.jsx` extension (e.g., `Timer.jsx`)
- Utilities/hooks: camelCase with `.js` extension (e.g., `gameLogic.js`)
- Styles: Match component name with `.css` extension (e.g., `Timer.css`)

### Component Patterns
- Functional components with hooks (no class components)
- Props destructuring in function parameters
- Custom hooks for shared stateful logic
- Separate CSS files for each component

### State Management
- localStorage via custom `useLocalStorage` hook
- No external state management library (Redux, Zustand, etc.)
- State lifted to App.jsx when shared across routes

### Storage Keys
- All localStorage keys defined in `STORAGE_KEYS` constant (utils/storage.js)
- Prefixed with `excuse-killer-` namespace
- Keys: completions, pending, achievements, notifications

### Utility Organization
- **storage.js**: localStorage operations with error handling
- **gameLogic.js**: XP, streak, achievement calculations
- **dateUtils.js**: Date manipulation and formatting
- **sampleData.js**: Test data generation

### Error Handling
- Custom `StorageError` class for localStorage failures
- Try-catch blocks in storage operations
- Graceful fallbacks when localStorage unavailable
