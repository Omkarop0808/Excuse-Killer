# Design Document

## Overview

The Excuse Killer application is a single-page React application built with Vite that runs entirely in the browser. It uses localStorage for data persistence and the Browser Notifications API for lightweight client-side reminders (active only while the tab is open). The architecture follows a component-based design with centralized state management through React hooks and context. The UI implements glass morphism design with a dark theme, smooth animations, and responsive layouts for both desktop and mobile devices.

The application consists of four main pages (Challenge, Progress, Achievements, Profile) connected through client-side routing, with a persistent navigation header. All game mechanics (XP, streaks, achievements) are calculated client-side based on completion data stored in localStorage.

**Key Features**:
- **Enhanced Challenge Creation**: Users can create challenges with customizable duration (editable minutes), recurrence patterns (once/daily/weekly/monthly), schedule times (HH:MM), and notes
- **Action Modals**: Clicking pending challenges opens a modal with three actions: Start Task, Mark Completed, View Details
- **Persistent Timer**: Timer state persists across page reloads using localStorage timestamps; live progress bars show ongoing tasks on Progress page
- **Profile Customization**: Users can set username, choose from preset avatars, view badge collection, see 30-day streak heatmap, and track goal statistics
- **Data Migration**: Automatic migration from old challenge format to new format with backup creation for safety

## Architecture

### Technology Stack
- **Frontend Framework**: React 18+ with Vite build tool
- **Routing**: React Router v6
- **Styling**: CSS Modules or Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth transitions and effects
- **Notifications**: Browser Notifications API
- **Storage**: localStorage for all data persistence
- **Development Server**: Vite dev server on port 5173

### Application Structure
```
src/
├── components/
│   ├── Nav.jsx                 # Navigation header
│   ├── Timer.jsx               # Circular progress timer with persistence
│   ├── TimerModal.jsx          # Modal wrapper for timer
│   ├── Confetti.jsx            # Confetti animation
│   ├── NotificationManager.jsx # Notification scheduling logic
│   ├── PendingChallengesList.jsx # Pending challenges display
│   ├── ActionModal.jsx         # Modal for Start/Complete/View Details
│   ├── AchievementBadge.jsx    # Individual achievement display
│   ├── IntensityBadge.jsx      # Intensity level indicator
│   ├── StreakHeatmap.jsx       # 30-day activity heatmap
│   ├── AvatarSelector.jsx      # Avatar selection component
│   └── LiveProgressBar.jsx     # Small progress indicator for ongoing tasks
├── pages/
│   ├── ChallengePage.jsx       # Challenge creation and tracking
│   ├── ProgressPage.jsx        # Stats and pending challenges
│   ├── AchievementsPage.jsx    # Achievement grid
│   └── ProfilePage.jsx         # User profile and customization
├── hooks/
│   ├── useLocalStorage.js      # localStorage abstraction
│   ├── useNotifications.js     # Notification permission and scheduling
│   ├── useGameStats.js         # Streak, XP, and achievement calculations
│   └── useProfile.js           # Profile data management
├── utils/
│   ├── storage.js              # localStorage key constants and helpers
│   ├── gameLogic.js            # XP, streak, achievement unlock logic
│   ├── dateUtils.js            # Date comparison and formatting
│   └── migration.js            # Data migration and backup logic
├── App.jsx                     # Root component with routing
└── main.jsx                    # Application entry point
```

### Data Flow
1. User interacts with UI components
2. Components update React state
3. State changes trigger localStorage updates via custom hooks
4. localStorage changes persist across sessions
5. On app load, data is read from localStorage and hydrated into React state
6. Notification schedules are checked on app load and set up using setTimeout/setInterval

## Components and Interfaces

### Core Components

#### App Component
- Root component managing routing and global state
- Provides context for shared data (completions, pending challenges, achievements)
- Handles initial data load from localStorage
- Sets up notification permission request on first load

#### Nav Component
- Sticky header with navigation links
- Displays current streak badge (animated)
- Shows notification bell with pending challenge count
- Logo display

#### ChallengePage Component
- Challenge creation form with fields:
  - Task text input (required)
  - Intensity selector (chill/normal/hardcore)
  - Duration input (number, user-editable, defaults: chill=10, normal=20, hardcore=30)
  - Target type selector (today/this_week/this_month/custom_date)
  - Custom date picker (visible only when targetType="custom_date", must be >= today)
  - Recurrence selector (once/daily/weekly/monthly)
  - Schedule time picker (HH:MM format, optional)
  - Timer toggle (useTimer boolean)
  - Notes textarea (optional)
- Form validation:
  - Empty task text → show error
  - Invalid date (past date) → show error
  - Negative duration → show error
- Handles challenge submission and stores to localStorage

#### Timer Component
Props: `durationMinutes`, `taskId`, `onFinish` callback
- Circular progress visualization
- Countdown display (MM:SS format)
- Updates every second when active
- Persists start timestamp in localStorage (key: `excuse-killer-timer-${taskId}`)
- Restores timer state if page reloads (calculates elapsed time from stored timestamp)
- When timer finishes:
  - Shows message: "Timer finished — Complete task?"
  - If confirmed → triggers onFinish callback which runs completion flow
- Pause/Resume/Reset controls

#### TimerModal Component
Props: `challenge`, `isOpen`, `onClose`, `onComplete`
- Modal wrapper that displays Timer component
- Handles timer completion confirmation
- Triggers completion flow (award XP, update streak, remove from pending, play confetti)

#### ProgressPage Component
- Stats section:
  - Animated streak counter
  - Weekly/monthly completion counts
  - Title badge display
  - Last 5 completions list
- Pending challenges section:
  - Grouped by target type (Today, This Week, This Month)
  - Each challenge shows: task, intensity, target date, days remaining, status
  - Click handler to navigate to Challenge page with pre-loaded data

#### AchievementsPage Component
- 6-badge grid layout
- Each badge shows:
  - Icon/image
  - Name and description
  - Unlock condition (if locked)
  - Unlock date (if unlocked)
  - Visual state (locked: greyed "???", unlocked: colored with glow)
- Unlock animation trigger

#### NotificationManager Component
- Checks notification permission status (asks only once, stores in localStorage)
- Schedules notifications based on scheduleTime + recurrence for pending challenges
- Triggers notifications only while tab is open (no service workers)
- On notification click → opens ActionModal for the associated challenge
- Handles permission denied gracefully (continues without notifications)

#### ProfilePage Component
- Displays user profile with sections:
  1. **Username**: Editable text field, saves to localStorage
  2. **Avatar**: Shows current avatar, opens AvatarSelector on click
  3. **Total XP**: Computed from all completions
  4. **Current Title**: Based on streak (Starter → Unstoppable)
  5. **Badge Showcase**: Grid of achievements (colored if unlocked, grey if locked)
  6. **Streak Heatmap**: Last 30 days visualization
  7. **Goals Overview**: Weekly goals done, monthly goals done, completion rate %
- Loads profile data from localStorage key "excuse-killer-profile"
- Saves updates to localStorage

#### AvatarSelector Component
Props: `currentAvatar`, `onSelect`
- Displays 6-8 preset SVG/emoji avatars in a grid
- Highlights currently selected avatar
- On selection → calls onSelect callback and closes

#### StreakHeatmap Component
Props: `completions`
- Displays last 30 days as a grid (similar to GitHub contribution graph)
- Each day shows:
  - Green/colored if has completion
  - Grey/empty if no completion
- Tooltip on hover showing date and completion count

#### PendingChallengesList Component
Props: `challenges`, `onChallengeClick`
- Groups challenges by target type
- Renders compact challenge cards
- Calculates and displays days remaining
- Shows status (Pending/Ongoing)
- Clicking a challenge opens ActionModal

#### ActionModal Component
Props: `challenge`, `isOpen`, `onClose`, `onStartTask`, `onMarkCompleted`, `onViewDetails`
- Displays three action buttons:
  1. **Start Task**: 
     - If useTimer=true → opens TimerModal with durationMinutes
     - Sets status="ongoing"
  2. **Mark Completed**:
     - Shows confirmation dialog
     - Awards XP (chill=30, normal=50, hardcore=75)
     - Adds to completions list
     - Updates streak
     - Removes from pending list
     - Plays confetti
  3. **View Details**:
     - Shows all challenge fields: recurrence, scheduleTime, notes, targetType, customDate, intensity, duration

#### LiveProgressBar Component
Props: `challenge`
- Small horizontal progress bar showing timer progress
- Displayed on Progress page for ongoing challenges
- Clicking opens TimerModal
- Updates in real-time based on elapsed time

### Custom Hooks

#### useLocalStorage(key, initialValue)
Returns: `[value, setValue]`
- Abstracts localStorage read/write operations
- Handles JSON serialization/deserialization
- Provides React state-like interface
- Syncs changes across components

#### useNotifications()
Returns: `{ permission, requestPermission, scheduleNotification, cancelNotification }`
- Manages notification permission state
- Requests permission from user
- Schedules notifications using setTimeout
- Handles notification click events

#### useGameStats(completions)
Returns: `{ streak, weeklyCount, monthlyCount, totalXP, title, unlockedAchievements }`
- Calculates current streak from completions
- Counts completions by time period
- Sums total XP earned
- Determines current title badge
- Checks achievement unlock conditions

#### useProfile()
Returns: `{ profile, updateUsername, updateAvatar, refreshProfile }`
- Loads profile data from localStorage
- Computes totalXP, currentTitle from completions
- Computes weeklyGoalsCompleted, monthlyGoalsCompleted from completions
- Computes completionRate from pending vs completed challenges
- Generates streakHeatmap for last 30 days
- Provides methods to update username and avatar
- Saves changes to localStorage

## Data Models

### Challenge (Pending/Ongoing)
```javascript
{
  id: string,                    // UUID
  taskText: string,              // User-entered task description
  intensity: 'chill' | 'normal' | 'hardcore',
  durationMinutes: number,       // User-editable duration in minutes
  targetType: 'today' | 'this_week' | 'this_month' | 'custom_date',
  customDateISO: string | null,  // ISO date for custom target (null if not custom_date)
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly',
  scheduleTime: string | null,   // HH:MM format time for notifications (null if not scheduled)
  useTimer: boolean,             // Whether timer is enabled
  notes: string,                 // Optional user notes
  status: 'pending' | 'ongoing', // Pending: not started, Ongoing: timer started
  notificationSent: boolean,     // Whether notification has been sent
  createdAt: string,             // ISO timestamp when challenge was created
  updatedAt: string,             // ISO timestamp when challenge was last updated
  timerStartedAt: string | null  // ISO timestamp when timer was started (null if not started)
}
```

### Completion
```javascript
{
  id: string,                    // UUID
  taskText: string,              // Task description from challenge
  dateISO: string,               // ISO date when completed
  targetType: string,            // Original target type
  targetDateISO: string,         // Original target date
  finishedOnTime: boolean,       // Whether completed before target date
  xpEarned: number,              // XP awarded (30/50/75)
  completedAt: string,           // ISO timestamp of completion
  intensity: string              // Challenge intensity
}
```

### Achievement
```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // Display name
  description: string,           // Achievement description
  unlockCondition: string,       // Human-readable unlock requirement
  icon: string,                  // Icon identifier or emoji
  unlockedAt: string | null      // ISO timestamp when unlocked, null if locked
}
```

### Stats (Computed)
```javascript
{
  streakDays: number,            // Current consecutive days
  weeklyCount: number,           // Completions this week
  monthlyCount: number,          // Completions this month
  title: string,                 // Current title badge
  totalXP: number,               // Sum of all XP earned
  unlockedAchievements: string[] // Array of unlocked achievement IDs
}
```

### Profile
```javascript
{
  username: string,              // User's display name
  avatar: string,                // Selected avatar identifier (e.g., "emoji-fire", "svg-star")
  totalXP: number,               // Computed from completions
  currentTitle: string,          // Computed from streak
  weeklyGoalsCompleted: number,  // Count of this week's completions
  monthlyGoalsCompleted: number, // Count of this month's completions
  completionRate: number,        // Percentage of completed vs pending challenges
  streakHeatmap: Array<{         // Last 30 days of activity
    dateISO: string,
    hasCompletion: boolean
  }>
}
```

### localStorage Keys
- `excuse-killer-completions`: Array of Completion objects
- `excuse-killer-pending`: Array of Challenge objects
- `excuse-killer-achievements`: Object mapping achievement IDs to unlock dates
- `excuse-killer-notifications`: Notification permission status
- `excuse-killer-profile`: Profile object with user customization
- `excuse-killer-backup-<timestamp>`: Backup of data before migration

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Enhanced challenge creation persistence
*For any* valid challenge data (task text, intensity, duration, target type, recurrence, schedule time, timer preference, notes), creating a challenge should result in that challenge being stored in localStorage with all fields intact.
**Validates: Requirements 1.1**

### Property 2: Intensity validation
*For any* intensity value, the application should accept it if and only if it is one of "chill", "normal", or "hardcore".
**Validates: Requirements 1.2**

### Property 3: Target type validation
*For any* target type value, the application should accept it if and only if it is one of "today", "this_week", "this_month", or "custom_date".
**Validates: Requirements 1.3**

### Property 4: Default duration mapping
*For any* intensity level selected, the application should populate the duration field with 10 minutes for chill, 20 minutes for normal, and 30 minutes for hardcore.
**Validates: Requirements 1.4**

### Property 5: Positive duration validation
*For any* duration value, the application should accept it if and only if it is a positive integer.
**Validates: Requirements 1.5**

### Property 6: Past date rejection
*For any* custom date in the past, the application should reject it as invalid, while accepting future dates and today.
**Validates: Requirements 1.6**

### Property 7: Recurrence validation
*For any* recurrence value, the application should accept it if and only if it is one of "once", "daily", "weekly", or "monthly".
**Validates: Requirements 1.7**

### Property 8: Schedule time format validation
*For any* schedule time value, the application should accept it if and only if it matches HH:MM format (00:00 to 23:59).
**Validates: Requirements 1.8**

### Property 9: Empty task text rejection
*For any* task text that is empty or contains only whitespace, the application should display an error and prevent submission.
**Validates: Requirements 1.9**

### Property 10: Negative duration rejection
*For any* duration value that is negative or zero, the application should display an error and prevent submission.
**Validates: Requirements 1.10**

### Property 11: Custom date picker visibility
*For any* target type selection, the custom date picker should be visible if and only if the target type is "custom_date".
**Validates: Requirements 1.11, 1.12**

### Property 12: Schedule configuration persistence
*For any* schedule time and recurrence configuration, creating a challenge with that schedule should result in the schedule being stored correctly in localStorage with the challenge.
**Validates: Requirements 2.1**

### Property 13: Notification modal opening
*For any* notification clicked by the user, the application should open the action modal for the associated challenge.
**Validates: Requirements 2.3**

### Property 14: Timer initial duration
*For any* timer-enabled challenge, starting the timer should display the correct initial duration from the challenge's durationMinutes field.
**Validates: Requirements 3.1**

### Property 15: Timer pause preservation
*For any* running timer, pausing it should preserve the remaining time exactly.
**Validates: Requirements 3.2**

### Property 16: Timer reset restoration
*For any* timer, resetting it should restore the original duration from the challenge's durationMinutes field.
**Validates: Requirements 3.3**

### Property 17: Timer completion flow trigger
*For any* challenge, confirming task completion after the timer finishes should execute the full completion flow (award XP, update streak, remove from pending, play confetti).
**Validates: Requirements 3.5**

### Property 18: Timer start timestamp persistence
*For any* timer start event, the start timestamp should be persisted to localStorage.
**Validates: Requirements 3.7**

### Property 19: Timer state restoration after reload
*For any* running timer, reloading the page should restore the timer with the correct remaining time calculated from the persisted start timestamp.
**Validates: Requirements 3.8**

### Property 20: Ongoing challenge progress bar display
*For any* challenge with status "ongoing", the Progress page should display a live progress bar for that challenge.
**Validates: Requirements 3.9**

### Property 21: Completion record completeness
*For any* challenge marked as completed, a completion record should be created containing task text, date, target information, and XP earned.
**Validates: Requirements 4.1**

### Property 22: XP calculation correctness
*For any* completed challenge, the XP awarded should be 30 for chill, 50 for normal, and 75 for hardcore intensity.
**Validates: Requirements 4.2**

### Property 23: Completion persistence
*For any* completion created, it should be saved to localStorage under the key "excuse-killer-completions".
**Validates: Requirements 4.4**

### Property 24: Streak update on completion
*For any* challenge completion, the user's streak should be recalculated and updated correctly.
**Validates: Requirements 4.5**

### Property 25: Pending list removal on completion
*For any* completed challenge, it should be removed from the pending challenges list.
**Validates: Requirements 4.6**

### Property 26: Streak display accuracy
*For any* set of completions, the displayed streak on the Progress page should match the calculated consecutive days with at least one completion.
**Validates: Requirements 5.1**

### Property 27: Period count accuracy
*For any* set of completions, the weekly and monthly counts displayed should match the actual number of completions in those time periods.
**Validates: Requirements 5.2**

### Property 28: Title badge correctness
*For any* streak value, the displayed title should be "Starter" for 0-2 days, "Overcomer" for 3-6 days, "Super Overcomer" for 7-14 days, and "Unstoppable" for 15+ days.
**Validates: Requirements 5.3**

### Property 29: Last 5 completions display
*For any* set of completions, the Progress page should display exactly the 5 most recent completions.
**Validates: Requirements 5.4**

### Property 30: Streak calculation correctness
*For any* set of completions, the streak should equal the number of consecutive days (ending with today) that have at least one completion.
**Validates: Requirements 5.5**

### Property 31: All pending challenges displayed
*For any* set of pending challenges, the Progress page should display all of them in the "Your Challenges" section.
**Validates: Requirements 6.1**

### Property 32: Pending challenges grouping
*For any* set of pending challenges, they should be correctly grouped by target type (Today, This Week, This Month).
**Validates: Requirements 6.2**

### Property 33: Pending challenge information completeness
*For any* pending challenge displayed, it should show task name, intensity badge, target date, days remaining, and status.
**Validates: Requirements 6.3**

### Property 34: Start task with timer opens timer modal
*For any* challenge with useTimer=true, selecting "Start Task" should open the Timer modal with the challenge's durationMinutes and set status to "ongoing".
**Validates: Requirements 6.5**

### Property 35: Start task without timer sets status
*For any* challenge with useTimer=false, selecting "Start Task" should set the challenge status to "ongoing".
**Validates: Requirements 6.6**

### Property 36: Completion flow execution
*For any* challenge, confirming completion should award XP, add to completions list, update streak, remove from pending list, and play confetti.
**Validates: Requirements 6.8**

### Property 37: View details shows all fields
*For any* challenge, selecting "View Details" should display all challenge fields including recurrence, scheduleTime, notes, and target date.
**Validates: Requirements 6.9**

### Property 38: Ongoing status determination
*For any* challenge that has been started but not completed, its status should display as "Ongoing" rather than "Pending".
**Validates: Requirements 6.10**

### Property 39: Unlocked achievement display
*For any* unlocked achievement, it should display the unlock date.
**Validates: Requirements 7.3**

### Property 40: First Step achievement unlock
*For any* user who completes their first challenge, the "First Step" achievement should be unlocked.
**Validates: Requirements 7.5**

### Property 41: Week Warrior achievement unlock
*For any* user who reaches a 7-day streak, the "Week Warrior" achievement should be unlocked.
**Validates: Requirements 7.6**

### Property 42: Unstoppable achievement unlock
*For any* user who reaches a 15-day streak, the "Unstoppable" achievement should be unlocked.
**Validates: Requirements 7.7**

### Property 43: Navigation functionality
*For any* navigation menu item clicked (Challenge, Progress, Achievements, Profile), the application should navigate to the corresponding page.
**Validates: Requirements 8.2**

### Property 44: Header streak display
*For any* current streak value, the header should display that value in the streak badge.
**Validates: Requirements 8.3**

### Property 45: Notification bell count
*For any* set of pending challenges, the notification bell should display the correct count of pending challenges.
**Validates: Requirements 8.4**

### Property 46: Notification permission feature toggle
*For any* notification permission status (granted/denied), the notification scheduling features should be enabled if granted and disabled if denied.
**Validates: Requirements 9.2, 9.3**

### Property 47: Notification toggle availability
*For any* notification permission status, the notification toggle in the challenge form should be available if permission is granted and unavailable if denied.
**Validates: Requirements 9.4**

### Property 48: Username persistence
*For any* username value, editing and saving the username should persist it to localStorage and display it correctly on reload.
**Validates: Requirements 13.2**

### Property 49: Avatar selection persistence
*For any* avatar selection, saving the avatar should persist it to localStorage and display it as the user's current avatar.
**Validates: Requirements 13.4**

### Property 50: Badge showcase styling
*For any* set of achievements, the badge showcase should display unlocked achievements in color and locked achievements in grey.
**Validates: Requirements 13.5**

### Property 51: Streak heatmap accuracy
*For any* set of completions, the streak heatmap should correctly display the last 30 days with visual indicators for days with completions.
**Validates: Requirements 13.6**

### Property 52: Goals overview calculation
*For any* set of completions and pending challenges, the goals overview should correctly display weekly goals completed, monthly goals completed, and overall completion rate percentage.
**Validates: Requirements 13.7**

### Property 53: Profile data persistence round-trip
*For any* profile data, saving to localStorage and reloading the application should restore the exact same profile data.
**Validates: Requirements 13.8, 13.9**

### Property 54: Challenge migration correctness
*For any* old-format challenge, migration should produce a valid new-format challenge with all existing fields preserved and new fields populated with correct defaults.
**Validates: Requirements 14.1, 14.3, 14.4**

### Property 55: Migration backup creation
*For any* migration operation, a backup should be created in localStorage with the key "excuse-killer-backup-<timestamp>".
**Validates: Requirements 14.2**

### Property 56: Migration field preservation
*For any* old-format challenge, all existing fields (id, taskText, dateISO, intensity, targetType, targetDateISO, useTimer) should remain unchanged after migration.
**Validates: Requirements 14.3**

### Property 57: Migration default field addition
*For any* old-format challenge, migration should add new fields with correct defaults: durationMinutes based on intensity (chill=10, normal=20, hardcore=30), recurrence="once", scheduleTime=null, notes="", status="pending", notificationSent=false.
**Validates: Requirements 14.4**

### Property 58: Completions localStorage key
*For any* completion created or updated, it should be saved to localStorage under the key "excuse-killer-completions".
**Validates: Requirements 11.1**

### Property 59: Pending challenges localStorage key
*For any* pending challenge created or updated, it should be saved to localStorage under the key "excuse-killer-pending".
**Validates: Requirements 11.2**

### Property 60: Achievements localStorage key
*For any* achievement unlocked, the unlock date should be saved to localStorage under the key "excuse-killer-achievements".
**Validates: Requirements 11.3**

### Property 61: Notifications localStorage key
*For any* notification settings updated, they should be saved to localStorage under the key "excuse-killer-notifications".
**Validates: Requirements 11.4**

### Property 62: State persistence round-trip
*For any* application state (completions, pending challenges, achievements, notifications, profile), saving to localStorage and reloading the application should restore the exact same state.
**Validates: Requirements 11.5**

## Error Handling

### localStorage Errors
- **Quota Exceeded**: If localStorage quota is exceeded, display a user-friendly error message and suggest clearing old completions
- **Access Denied**: If localStorage is not available (private browsing), display a warning that data will not persist across sessions
- **Parse Errors**: If stored data is corrupted, clear the corrupted key and initialize with empty data

### Notification Errors
- **Permission Denied**: Gracefully disable notification features and hide notification-related UI elements
- **Notification API Unavailable**: Check for browser support and hide notification features if unavailable
- **Scheduling Failures**: Log errors and notify user that reminders may not work

### Timer Errors
- **Background Tab**: Handle timer accuracy issues when tab is backgrounded by storing start time and calculating elapsed time on focus
- **System Sleep**: Detect when system wakes from sleep and adjust timer accordingly

### Form Validation Errors
- **Empty Task Text**: Display inline error message requiring task description
- **Invalid Date**: Show error for past dates or invalid date formats
- **Missing Required Fields**: Highlight missing fields and prevent form submission

### Data Migration

The application includes a migration system to safely upgrade old challenge data to the new format.

**Migration Process**:
1. On app startup, check if pending challenges have old format (missing new fields)
2. If old format detected:
   - Create backup: `excuse-killer-backup-<timestamp>` with current data
   - Transform each challenge:
     - Preserve existing fields: id, taskText, dateISO, intensity, targetType, targetDateISO, useTimer
     - Add new fields with defaults:
       - `durationMinutes`: Based on intensity (chill=10, normal=20, hardcore=30)
       - `recurrence`: "once"
       - `scheduleTime`: null
       - `notes`: ""
       - `status`: "pending"
       - `notificationSent`: false
       - `createdAt`: Use existing dateISO
       - `updatedAt`: Current timestamp
       - `customDateISO`: Use targetDateISO if targetType="custom_date", else null
   - Save migrated data to localStorage
   - Continue normal operation

**Migration Utility** (`utils/migration.js`):
- `detectOldFormat(challenges)`: Returns true if any challenge is missing new fields
- `migrateChallenge(oldChallenge)`: Transforms single challenge to new format
- `createBackup(data)`: Saves backup with timestamp
- `migrateChallenges(challenges)`: Migrates array of challenges

**Version Changes**: If localStorage schema changes in future versions, extend migration logic
**Corrupted Data**: Validate data structure on load and reset to defaults if validation fails

## Testing Strategy

The Excuse Killer application will use a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Property-Based Testing

We will use **fast-check** (for JavaScript/React) as our property-based testing library. Each correctness property defined above will be implemented as a property-based test.

**Configuration**:
- Each property test will run a minimum of 100 iterations
- Tests will use custom generators for domain-specific data (challenges, completions, dates)
- Each test will be tagged with a comment referencing the design document property

**Test Tagging Format**:
```javascript
// Feature: excuse-killer-app, Property 1: Challenge creation persistence
```

**Key Property Tests**:
1. **Data Persistence Properties** (Properties 1, 6, 16, 38-42): Test that data round-trips correctly through localStorage
2. **Validation Properties** (Properties 2, 3, 5): Test that validation accepts valid inputs and rejects invalid ones
3. **Calculation Properties** (Properties 4, 15, 19-23): Test that calculations (XP, streak, timer duration) are correct for all inputs
4. **State Transition Properties** (Properties 11, 12, 17, 18, 28): Test that state changes happen correctly
5. **UI Consistency Properties** (Properties 24-27, 33-35): Test that UI displays match underlying data

**Custom Generators**:
- `arbitraryChallenge()`: Generates valid challenge objects with random but valid fields
- `arbitraryCompletions()`: Generates arrays of completions with various date patterns
- `arbitraryIntensity()`: Generates valid intensity values
- `arbitraryTargetType()`: Generates valid target types
- `arbitraryDate()`: Generates dates (past, present, future)

### Unit Testing

Unit tests will complement property tests by covering:
- **Specific Examples**: Test concrete scenarios like "completing a challenge on day 5 of a 4-day streak results in a 5-day streak"
- **Edge Cases**: Empty lists, boundary values (0-day streak, exactly 5 completions), midnight date boundaries
- **Integration Points**: Component interactions, localStorage read/write, notification API calls
- **Error Conditions**: localStorage quota exceeded, notification permission denied, invalid data formats

**Unit Test Organization**:
- Co-locate tests with components using `.test.jsx` suffix
- Group tests by feature area (Challenge Creation, Progress Tracking, Achievements)
- Use React Testing Library for component tests
- Mock localStorage and Notification API for isolated testing

**Key Unit Tests**:
1. Challenge form submission creates correct challenge object
2. Timer countdown updates every second
3. Completing a challenge triggers confetti animation
4. Streak resets when a day is missed
5. Achievement unlocks at exact thresholds (1st completion, 7-day streak, 15-day streak)
6. Notification click opens correct challenge
7. Pending challenges grouped correctly by target type
8. Last 5 completions displayed in reverse chronological order

### Testing Workflow
1. Write implementation code first
2. Write property-based tests for universal properties
3. Write unit tests for specific examples and edge cases
4. Run all tests to verify correctness
5. Fix any failing tests by correcting implementation
6. Iterate until all tests pass

### Manual Testing Checklist
- Test on Chrome, Firefox, Safari
- Test on mobile devices (iOS, Android)
- Test notification permissions (allow, deny, default)
- Test localStorage quota limits
- Test with empty state (first load)
- Test with large datasets (100+ completions)
- Test date boundaries (midnight, month/year transitions)
- Test timer accuracy in background tabs

