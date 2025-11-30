# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize React + Vite project on port 5173
  - Install dependencies: react-router-dom, framer-motion, fast-check (for property testing)
  - Create directory structure: components/, pages/, hooks/, utils/
  - Set up .env template with VITE_GEMINI_API_KEY placeholder
  - Configure Vite for development
  - _Requirements: All (foundation)_

- [ ] 2. Implement localStorage utilities and data models
  - [x] 2.1 Create storage utility functions
    - Define localStorage key constants
    - Implement read/write helpers with JSON serialization
    - Add error handling for quota exceeded and access denied
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 2.2 Write property test for localStorage round-trip
    - **Property 42: State persistence round-trip**
    - **Validates: Requirements 11.5**

  - [x] 2.3 Create custom hooks for localStorage
    - Implement useLocalStorage hook with React state integration
    - Create useGameStats hook for streak/XP/title calculations
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]* 2.4 Write property tests for game stats calculations
    - **Property 19: Streak display accuracy**
    - **Property 20: Period count accuracy**
    - **Property 21: Title badge correctness**
    - **Property 23: Streak calculation correctness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**

- [ ] 3. Build core routing and navigation
  - [x] 3.1 Set up React Router with three routes
    - Configure routes for Challenge, Progress, Achievements pages
    - Set Challenge page as default route
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 3.2 Create Nav component
    - Build sticky header with navigation links
    - Add streak badge display in top-right
    - Add notification bell with pending count
    - Add logo display
    - _Requirements: 8.1, 8.3, 8.4_

  - [ ]* 3.3 Write property tests for navigation
    - **Property 33: Navigation functionality**
    - **Property 34: Header streak display**
    - **Property 35: Notification bell count**
    - **Validates: Requirements 8.2, 8.3, 8.4**

- [ ] 4. Implement data migration system
  - [x] 4.1 Create migration utility
    - Implement detectOldFormat function to check for old challenge format
    - Implement migrateChallenge function to transform single challenge
    - Implement createBackup function to save backup with timestamp
    - Implement migrateChallenges function for batch migration
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ]* 4.2 Write property tests for migration
    - **Property 54: Challenge migration correctness**
    - **Property 55: Migration backup creation**
    - **Property 56: Migration field preservation**
    - **Property 57: Migration default field addition**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**

  - [x] 4.3 Integrate migration on app startup
    - Check for old format on App.jsx mount
    - Run migration if needed
    - Continue normal operation after migration
    - _Requirements: 14.5_

- [ ] 5. Update Challenge creation form with new fields
  - [x] 5.1 Enhance ChallengePage component form
    - Add duration input (number, user-editable)
    - Add recurrence selector (once/daily/weekly/monthly)
    - Add schedule time picker (HH:MM format)
    - Add notes textarea
    - Update custom date picker visibility logic
    - Implement default duration population based on intensity
    - _Requirements: 1.1, 1.4, 1.5, 1.7, 1.8, 1.11, 1.12_

  - [ ]* 5.2 Write property tests for new form fields
    - **Property 1: Enhanced challenge creation persistence**
    - **Property 4: Default duration mapping**
    - **Property 5: Positive duration validation**
    - **Property 7: Recurrence validation**
    - **Property 8: Schedule time format validation**
    - **Property 11: Custom date picker visibility**
    - **Validates: Requirements 1.1, 1.4, 1.5, 1.7, 1.8, 1.11, 1.12**

  - [x] 5.3 Enhance form validation
    - Validate empty task text (show error)
    - Validate negative/zero duration (show error)
    - Validate past custom dates (show error)
    - Validate schedule time format
    - _Requirements: 1.6, 1.9, 1.10_

  - [ ]* 5.4 Write property tests for enhanced validation
    - **Property 2: Intensity validation**
    - **Property 3: Target type validation**
    - **Property 6: Past date rejection**
    - **Property 9: Empty task text rejection**
    - **Property 10: Negative duration rejection**
    - **Validates: Requirements 1.2, 1.3, 1.6, 1.9, 1.10**

- [ ] 6. Enhance Timer with persistence and modal
  - [x] 6.1 Update Timer component with persistence
    - Accept durationMinutes, taskId, onFinish props
    - Persist start timestamp to localStorage (key: excuse-killer-timer-${taskId})
    - Restore timer state on page reload (calculate elapsed time)
    - Show "Timer finished — Complete task?" message when timer reaches zero
    - Trigger onFinish callback on confirmation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8_

  - [ ]* 6.2 Write property tests for timer persistence
    - **Property 14: Timer initial duration**
    - **Property 15: Timer pause preservation**
    - **Property 16: Timer reset restoration**
    - **Property 18: Timer start timestamp persistence**
    - **Property 19: Timer state restoration after reload**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.7, 3.8**

  - [x] 6.3 Create TimerModal component
    - Build modal wrapper for Timer component
    - Handle timer completion confirmation
    - Trigger completion flow (award XP, update streak, remove from pending, play confetti)
    - _Requirements: 3.5_

  - [ ]* 6.4 Write property test for timer completion flow
    - **Property 17: Timer completion flow trigger**
    - **Validates: Requirements 3.5**

  - [x] 6.5 Create LiveProgressBar component
    - Build small horizontal progress bar for ongoing tasks
    - Update in real-time based on elapsed time
    - Handle click to open TimerModal
    - _Requirements: 3.9, 3.10_

  - [ ]* 6.6 Write property test for progress bar display
    - **Property 20: Ongoing challenge progress bar display**
    - **Validates: Requirements 3.9**

- [ ] 7. Implement ActionModal for pending challenges
  - [x] 7.1 Create ActionModal component
    - Build modal with three action buttons: Start Task, Mark Completed, View Details
    - Implement Start Task action (open TimerModal if useTimer=true, set status="ongoing")
    - Implement Mark Completed action (show confirmation, run completion flow)
    - Implement View Details action (display all challenge fields)
    - _Requirements: 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

  - [ ]* 7.2 Write property tests for action modal
    - **Property 34: Start task with timer opens timer modal**
    - **Property 35: Start task without timer sets status**
    - **Property 36: Completion flow execution**
    - **Property 37: View details shows all fields**
    - **Validates: Requirements 6.5, 6.6, 6.8, 6.9**

  - [ ] 7.3 Update PendingChallengesList to open ActionModal
    - Modify click handler to open ActionModal instead of navigating
    - Pass challenge data to modal
    - _Requirements: 6.4_

  - [ ]* 7.4 Write property tests for pending challenges
    - **Property 31: All pending challenges displayed**
    - **Property 32: Pending challenges grouping**
    - **Property 33: Pending challenge information completeness**
    - **Property 38: Ongoing status determination**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.10**

- [ ] 8. Update Progress page with live progress indicators
  - [ ] 8.1 Enhance ProgressPage component
    - Add section for ongoing challenges with LiveProgressBar components
    - Ensure all existing stats display correctly
    - _Requirements: 3.9, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 8.2 Write property tests for progress display
    - **Property 26: Streak display accuracy**
    - **Property 27: Period count accuracy**
    - **Property 28: Title badge correctness**
    - **Property 29: Last 5 completions display**
    - **Property 30: Streak calculation correctness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 9. Implement Profile page and customization
  - [ ] 9.1 Create useProfile hook
    - Load profile data from localStorage
    - Compute totalXP, currentTitle from completions
    - Compute weeklyGoalsCompleted, monthlyGoalsCompleted from completions
    - Compute completionRate from pending vs completed challenges
    - Generate streakHeatmap for last 30 days
    - Provide updateUsername and updateAvatar methods
    - Save changes to localStorage
    - _Requirements: 13.1, 13.2, 13.4, 13.7, 13.8, 13.9_

  - [ ]* 9.2 Write property tests for profile hook
    - **Property 48: Username persistence**
    - **Property 49: Avatar selection persistence**
    - **Property 52: Goals overview calculation**
    - **Property 53: Profile data persistence round-trip**
    - **Validates: Requirements 13.2, 13.4, 13.7, 13.8, 13.9**

  - [ ] 9.3 Create AvatarSelector component
    - Display 6-8 preset SVG/emoji avatars in a grid
    - Highlight currently selected avatar
    - Handle selection and callback
    - _Requirements: 13.3, 13.4_

  - [ ] 9.4 Create StreakHeatmap component
    - Display last 30 days as a grid (GitHub-style)
    - Show green/colored for days with completions
    - Show grey/empty for days without completions
    - Add tooltip on hover with date and completion count
    - _Requirements: 13.6_

  - [ ]* 9.5 Write property tests for heatmap
    - **Property 51: Streak heatmap accuracy**
    - **Validates: Requirements 13.6**

  - [ ] 9.6 Create ProfilePage component
    - Display editable username field
    - Show current avatar with AvatarSelector on click
    - Display total XP and current title
    - Show badge showcase (colored if unlocked, grey if locked)
    - Display StreakHeatmap component
    - Show goals overview (weekly, monthly, completion rate)
    - _Requirements: 13.1, 13.2, 13.3, 13.5, 13.6, 13.7_

  - [ ]* 9.7 Write property test for badge showcase
    - **Property 50: Badge showcase styling**
    - **Validates: Requirements 13.5**

- [ ] 10. Update navigation to include Profile page
  - [ ] 10.1 Add Profile route to App.jsx
    - Add route for /profile
    - Update Nav component with Profile link
    - _Requirements: 8.1, 8.2_

  - [ ]* 10.2 Write property tests for navigation
    - **Property 43: Navigation functionality**
    - **Property 44: Header streak display**
    - **Property 45: Notification bell count**
    - **Validates: Requirements 8.2, 8.3, 8.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Verify Achievements system still works
  - [ ]* 12.1 Write property tests for achievement unlocks
    - **Property 39: Unlocked achievement display**
    - **Property 40: First Step achievement unlock**
    - **Property 41: Week Warrior achievement unlock**
    - **Property 42: Unstoppable achievement unlock**
    - **Validates: Requirements 7.3, 7.5, 7.6, 7.7**

- [ ] 13. Update browser notifications system
  - [ ] 13.1 Update useNotifications hook
    - Request permission only once, store result in localStorage
    - Handle permission granted/denied gracefully
    - _Requirements: 2.4, 2.5, 9.1, 9.2, 9.3_

  - [ ]* 13.2 Write property tests for notification permissions
    - **Property 46: Notification permission feature toggle**
    - **Property 47: Notification toggle availability**
    - **Validates: Requirements 9.2, 9.3, 9.4**

  - [ ] 13.3 Update NotificationManager component
    - Schedule notifications based on scheduleTime + recurrence
    - Trigger notifications only while tab is open (no service workers)
    - On notification click → open ActionModal for the challenge
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [ ]* 13.4 Write property tests for notification behavior
    - **Property 12: Schedule configuration persistence**
    - **Property 13: Notification modal opening**
    - **Validates: Requirements 2.1, 2.3**

- [ ] 14. Update completion logic
  - [ ] 14.1 Ensure completion flow works with new challenge format
    - Verify XP calculation uses intensity field
    - Verify completion records include all required fields
    - Verify streak updates correctly
    - Verify pending list removal works
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_

  - [ ]* 14.2 Write property tests for completion
    - **Property 21: Completion record completeness**
    - **Property 22: XP calculation correctness**
    - **Property 23: Completion persistence**
    - **Property 24: Streak update on completion**
    - **Property 25: Pending list removal on completion**
    - **Validates: Requirements 4.1, 4.2, 4.4, 4.5, 4.6**

- [ ] 15. Verify localStorage operations
  - [ ]* 15.1 Write property tests for localStorage keys
    - **Property 58: Completions localStorage key**
    - **Property 59: Pending challenges localStorage key**
    - **Property 60: Achievements localStorage key**
    - **Property 61: Notifications localStorage key**
    - **Property 62: State persistence round-trip**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Update styling for new components
  - [ ] 17.1 Style new components with glass morphism
    - Apply glass morphism to ActionModal
    - Apply glass morphism to TimerModal
    - Apply glass morphism to ProfilePage sections
    - Apply glass morphism to AvatarSelector
    - Apply glass morphism to StreakHeatmap
    - Ensure responsive design for all new components
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 17.2 Add animations to new components
    - Add modal open/close animations
    - Add avatar selection animations
    - Add heatmap hover effects
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 18. Final polish and testing
  - [ ] 18.1 Test migration with sample old data
    - Create sample old-format challenges
    - Verify migration runs correctly
    - Verify backup is created
    - Verify app works with migrated data
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 18.2 Test all new features end-to-end
    - Test enhanced challenge creation with all new fields
    - Test action modal interactions (Start/Complete/View Details)
    - Test timer persistence across page reloads
    - Test live progress bars on Progress page
    - Test Profile page customization (username, avatar)
    - Test streak heatmap display
    - Test client-side notifications
    - _Requirements: All_

  - [ ] 18.3 Cross-browser and mobile testing
    - Test on Chrome, Firefox, Safari
    - Test on iOS and Android devices
    - Verify all new features work across platforms
    - _Requirements: 10.4, 10.5_
