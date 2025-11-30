# Requirements Document

## Introduction

The Excuse Killer application is a gamified React web application designed to help users overcome procrastination by tracking challenges, maintaining streaks, and earning achievements. The system operates entirely client-side using localStorage for persistence and lightweight browser notifications for scheduled reminders (active only while the tab is open). The application features a dark-themed glass morphism UI with animations and provides four main views: Challenge management, Progress tracking, Achievement display, and Profile customization. Users can create highly customizable challenges with editable durations, recurrence patterns, schedule times, and notes. Pending challenges can be interacted with through action modals that allow starting tasks, marking completion, or viewing details. The timer system persists across page reloads and displays live progress indicators. A new Profile page allows users to customize their username and avatar, view their badge collection, see a 30-day streak heatmap, and track goal completion statistics.

## Glossary

- **Application**: The Excuse Killer React web application
- **User**: A person interacting with the Application through a web browser
- **Challenge**: A task with associated metadata (intensity, duration, target date, recurrence, schedule time, timer settings, notes) that the User commits to completing
- **Completion**: A record of a successfully finished Challenge
- **Streak**: A count of consecutive days where the User has completed at least one Challenge
- **Intensity**: A difficulty level for a Challenge (chill, normal, or hardcore)
- **Duration**: The number of minutes allocated for completing a Challenge
- **XP**: Experience points earned by completing Challenges
- **Achievement**: A badge unlocked by meeting specific criteria
- **Title Badge**: A rank displayed to the User based on their current Streak (Starter, Overcomer, Super Overcomer, Unstoppable)
- **Pending Challenge**: A Challenge that has been created but not yet completed
- **Ongoing Challenge**: A Pending Challenge that has been started (timer activated or status set to ongoing)
- **Target Type**: The timeframe category for a Challenge (today, this_week, this_month, custom_date)
- **Recurrence**: How often a Challenge repeats (once, daily, weekly, monthly)
- **Schedule Time**: The specific time (HH:MM format) when a Challenge notification should trigger
- **Action Modal**: A dialog that appears when clicking a pending Challenge, offering Start Task, Mark Completed, and View Details options
- **Profile**: User-specific data including username, avatar, total XP, title, badges, and statistics
- **Streak Heatmap**: A visual representation of the last 30 days showing which days had completions
- **Migration**: The process of converting old data format to new data format while preserving existing information
- **Glass Morphism**: A UI design style using semi-transparent backgrounds with backdrop blur effects
- **localStorage**: Browser-based persistent storage mechanism

## Requirements

### Requirement 1

**User Story:** As a User, I want to create challenges with customizable parameters, so that I can commit to tasks with appropriate difficulty and deadlines.

#### Acceptance Criteria

1. WHEN the User submits a challenge form with task text, intensity, duration, target type, recurrence, schedule time, timer preference, and notes, THEN the Application SHALL create a new Challenge and store it in localStorage
2. WHEN the User selects an intensity level, THEN the Application SHALL accept only "chill", "normal", or "hardcore" as valid values
3. WHEN the User selects a target type, THEN the Application SHALL accept only "today", "this_week", "this_month", or "custom_date" as valid values
4. WHEN the User selects an intensity level, THEN the Application SHALL populate the duration field with default values (chill=10min, normal=20min, hardcore=30min)
5. WHEN the User edits the duration field, THEN the Application SHALL accept any positive integer value in minutes
6. WHEN the User provides a custom date, THEN the Application SHALL validate that the date is not in the past
7. WHEN the User selects a recurrence option, THEN the Application SHALL accept only "once", "daily", "weekly", or "monthly" as valid values
8. WHEN the User provides a schedule time, THEN the Application SHALL accept time in HH:MM format
9. WHEN the User submits a challenge form with empty task text, THEN the Application SHALL display an error message and prevent submission
10. WHEN the User submits a challenge form with a negative duration, THEN the Application SHALL display an error message and prevent submission
11. WHEN the User selects target type "custom_date", THEN the Application SHALL display a date picker for custom date selection
12. WHEN the User selects a target type other than "custom_date", THEN the Application SHALL hide the custom date picker

### Requirement 2

**User Story:** As a User, I want to schedule lightweight client-side notifications for my challenges, so that I receive timely reminders while the application is open.

#### Acceptance Criteria

1. WHEN the User sets a schedule time and recurrence for a Challenge, THEN the Application SHALL store the schedule configuration with the Challenge in localStorage
2. WHEN the scheduled time arrives and the Application tab is open, THEN the Application SHALL trigger a browser notification containing the Challenge task text
3. WHEN the User clicks a notification, THEN the Application SHALL open the pending-task action modal for the associated Challenge
4. WHEN the Application requests notification permission, THEN the Application SHALL ask only once and store the result in localStorage
5. WHEN notification permission is denied, THEN the Application SHALL continue functioning normally without notification features
6. WHEN the Application tab is closed, THEN the Application SHALL not trigger notifications (no service workers)

### Requirement 3

**User Story:** As a User, I want to track my challenge with a visual timer that persists across page reloads, so that I can stay focused and complete tasks within the allocated time.

#### Acceptance Criteria

1. WHEN the User starts a timer-enabled Challenge, THEN the Application SHALL display a circular progress timer counting down from the Challenge's duration in minutes
2. WHEN the User clicks the pause button, THEN the Application SHALL pause the timer and preserve the remaining time
3. WHEN the User clicks the reset button, THEN the Application SHALL reset the timer to its original duration
4. WHEN the timer reaches zero, THEN the Application SHALL display a message "Timer finished — Complete task?" with confirmation options
5. WHEN the User confirms task completion after timer finishes, THEN the Application SHALL run the completion flow (award XP, update streak, remove from pending)
6. WHILE the timer is running, THEN the Application SHALL update the circular progress display every second
7. WHEN the timer starts, THEN the Application SHALL persist the start timestamp in localStorage
8. WHEN the page reloads while a timer is running, THEN the Application SHALL restore the timer with the correct remaining time
9. WHEN the User views the Progress page and a Challenge is ongoing, THEN the Application SHALL display a small live progress bar for that Challenge
10. WHEN the User clicks the live progress bar on the Progress page, THEN the Application SHALL open the Timer modal

### Requirement 4

**User Story:** As a User, I want to mark challenges as completed, so that I can track my progress and earn rewards.

#### Acceptance Criteria

1. WHEN the User clicks the "Completed this challenge" button, THEN the Application SHALL create a Completion record with task text, date, target information, and XP earned
2. WHEN a Challenge is completed, THEN the Application SHALL award XP based on intensity (chill=30, normal=50, hardcore=75)
3. WHEN a Challenge is completed, THEN the Application SHALL display a confetti animation
4. WHEN a Completion is created, THEN the Application SHALL save it to localStorage under the key "excuse-killer-completions"
5. WHEN a Challenge is completed, THEN the Application SHALL update the User's Streak calculation
6. WHEN a Challenge is completed, THEN the Application SHALL remove it from the pending challenges list

### Requirement 5

**User Story:** As a User, I want to view my progress statistics, so that I can see my streak, completion counts, and current title.

#### Acceptance Criteria

1. WHEN the User navigates to the Progress page, THEN the Application SHALL display the current daily Streak with animation
2. WHEN the User views the Progress page, THEN the Application SHALL display weekly and monthly "excuses killed" counts
3. WHEN the User views the Progress page, THEN the Application SHALL display a Title Badge based on Streak (Starter: 0-2 days, Overcomer: 3-6 days, Super Overcomer: 7-14 days, Unstoppable: 15+ days)
4. WHEN the User views the Progress page, THEN the Application SHALL display the last 5 completed challenges
5. WHEN calculating the Streak, THEN the Application SHALL count consecutive days with at least one Completion

### Requirement 6

**User Story:** As a User, I want to interact with my pending and ongoing challenges through action modals, so that I can start, complete, or view details of my tasks.

#### Acceptance Criteria

1. WHEN the User views the Progress page, THEN the Application SHALL display a "Your Challenges" section showing all Pending Challenges
2. WHEN displaying Pending Challenges, THEN the Application SHALL group them by target type (Today, This Week, This Month)
3. WHEN displaying a Pending Challenge, THEN the Application SHALL show task name, intensity badge, target date, days remaining, and status
4. WHEN the User clicks a Pending Challenge, THEN the Application SHALL open an action modal with three options: Start Task, Mark Completed, and View Details
5. WHEN the User selects "Start Task" in the action modal and the Challenge has useTimer enabled, THEN the Application SHALL open the Timer modal with the Challenge's duration and set status to "ongoing"
6. WHEN the User selects "Start Task" in the action modal and the Challenge has useTimer disabled, THEN the Application SHALL set the Challenge status to "ongoing"
7. WHEN the User selects "Mark Completed" in the action modal, THEN the Application SHALL display a confirmation dialog
8. WHEN the User confirms completion, THEN the Application SHALL award XP, add to completions list, update streak, remove from pending list, and play confetti
9. WHEN the User selects "View Details" in the action modal, THEN the Application SHALL display all Challenge fields including recurrence, schedule time, notes, and target date
10. WHEN a Challenge has been started but not completed, THEN the Application SHALL display its status as "Ongoing" instead of "Pending"

### Requirement 7

**User Story:** As a User, I want to unlock and view achievements, so that I feel motivated to continue completing challenges.

#### Acceptance Criteria

1. WHEN the User navigates to the Achievements page, THEN the Application SHALL display a grid of 6 achievement badges (First Step, Week Warrior, Unstoppable, Speed Demon, Consistency King, AI Believer)
2. WHEN an achievement is locked, THEN the Application SHALL display it as greyed out with "???" and show the unlock condition
3. WHEN an achievement is unlocked, THEN the Application SHALL display it in color with a glow effect and show the unlock date
4. WHEN the User unlocks an achievement, THEN the Application SHALL play a flip animation with pulse effect and confetti
5. WHEN the User completes their first Challenge, THEN the Application SHALL unlock the "First Step" achievement
6. WHEN the User reaches a 7-day Streak, THEN the Application SHALL unlock the "Week Warrior" achievement
7. WHEN the User reaches a 15-day Streak, THEN the Application SHALL unlock the "Unstoppable" achievement

### Requirement 8

**User Story:** As a User, I want to navigate between different sections of the app, so that I can access challenges, progress, achievements, and my profile easily.

#### Acceptance Criteria

1. WHEN the Application loads, THEN the Application SHALL display a sticky header with navigation menu items (Challenge, Progress, Achievements, Profile)
2. WHEN the User clicks a navigation menu item, THEN the Application SHALL navigate to the corresponding page
3. WHEN the Application displays the header, THEN the Application SHALL show the current Streak badge in the top-right corner with animation
4. WHEN the Application displays the header, THEN the Application SHALL show a notification bell icon with a count of pending challenges
5. WHEN the Application loads, THEN the Application SHALL default to the Challenge page

### Requirement 9

**User Story:** As a User, I want the app to request notification permissions, so that I can receive scheduled reminders.

#### Acceptance Criteria

1. WHEN the Application loads for the first time, THEN the Application SHALL request browser notification permission from the User
2. WHEN the User grants notification permission, THEN the Application SHALL enable notification scheduling features
3. WHEN the User denies notification permission, THEN the Application SHALL disable notification scheduling features but continue functioning normally
4. WHEN notification permission status changes, THEN the Application SHALL update the notification toggle availability in the challenge form

### Requirement 10

**User Story:** As a User, I want the app to have an attractive and responsive interface, so that I can use it comfortably on any device.

#### Acceptance Criteria

1. WHEN the Application renders any card component, THEN the Application SHALL apply glass morphism styling with rgba(255,255,255,0.1) background and 20px backdrop blur
2. WHEN the Application displays intensity badges, THEN the Application SHALL use cyan (#06B6D4) for chill, purple (#7C3AED) for normal, and gold (#FBBF24) for hardcore
3. WHEN the Application renders the background, THEN the Application SHALL display a dark gradient combining near-black and purple tones
4. WHEN the User views the Application on a mobile device, THEN the Application SHALL adapt the layout to remain fully functional and readable
5. WHEN the User views the Application on a desktop device, THEN the Application SHALL utilize the available screen space effectively

### Requirement 11

**User Story:** As a User, I want my data to persist across sessions, so that I don't lose my progress when I close the browser.

#### Acceptance Criteria

1. WHEN the Application creates or updates Completions, THEN the Application SHALL save them to localStorage under the key "excuse-killer-completions"
2. WHEN the Application creates or updates Pending Challenges, THEN the Application SHALL save them to localStorage under the key "excuse-killer-pending"
3. WHEN the Application unlocks achievements, THEN the Application SHALL save unlock dates to localStorage under the key "excuse-killer-achievements"
4. WHEN the Application updates notification settings, THEN the Application SHALL save them to localStorage under the key "excuse-killer-notifications"
5. WHEN the Application loads, THEN the Application SHALL retrieve all data from localStorage and restore the User's state

### Requirement 12

**User Story:** As a User, I want smooth animations and visual feedback, so that the app feels polished and engaging.

#### Acceptance Criteria

1. WHEN the User completes a Challenge, THEN the Application SHALL display a confetti animation
2. WHEN the User unlocks an achievement, THEN the Application SHALL play a flip animation with pulse effect
3. WHEN the Application displays the Streak badge, THEN the Application SHALL apply smooth animation effects
4. WHEN the User interacts with buttons, THEN the Application SHALL display glow effects on hover
5. WHEN the User navigates between pages, THEN the Application SHALL apply smooth fade transitions

### Requirement 13

**User Story:** As a User, I want to view and customize my profile, so that I can personalize my experience and track my overall progress.

#### Acceptance Criteria

1. WHEN the User navigates to the Profile page, THEN the Application SHALL display the User's username, avatar, total XP, current title, badge showcase, streak heatmap, and goals overview
2. WHEN the User clicks the username field, THEN the Application SHALL allow editing and save the new username to localStorage
3. WHEN the User views the avatar section, THEN the Application SHALL display 6-8 preset SVG or emoji avatars for selection
4. WHEN the User selects an avatar, THEN the Application SHALL save the selection to localStorage and display it as the User's current avatar
5. WHEN the User views the badge showcase, THEN the Application SHALL display unlocked achievements in color and locked achievements in grey
6. WHEN the User views the streak heatmap, THEN the Application SHALL display the last 30 days with visual indicators for days with completions
7. WHEN the User views the goals overview, THEN the Application SHALL display weekly goals completed, monthly goals completed, and overall completion rate percentage
8. WHEN the Application loads, THEN the Application SHALL retrieve profile data from localStorage under the key "excuse-killer-profile"
9. WHEN the User updates profile data, THEN the Application SHALL save it to localStorage under the key "excuse-killer-profile"

### Requirement 14

**User Story:** As a User, I want my existing data to be safely migrated to the new format, so that I don't lose any progress when the application updates.

#### Acceptance Criteria

1. WHEN the Application starts and detects old challenge format entries, THEN the Application SHALL migrate them to the new format with default values for new fields
2. WHEN the Application performs a migration, THEN the Application SHALL create a backup entry in localStorage with the key "excuse-killer-backup-<timestamp>"
3. WHEN the Application migrates challenge data, THEN the Application SHALL preserve all existing fields (id, taskText, dateISO, intensity, targetType, targetDateISO, useTimer)
4. WHEN the Application migrates challenge data, THEN the Application SHALL add new fields with sensible defaults (durationMinutes based on intensity, recurrence="once", scheduleTime=null, notes="", status="pending", notificationSent=false)
5. WHEN the Application completes migration, THEN the Application SHALL continue functioning normally with the new data format
