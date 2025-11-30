import { getISODate, getISOTimestamp, getTargetDate } from './dateUtils';

/**
 * Generate sample data for testing
 */
export const generateSampleData = () => {
  const today = new Date();
  
  // Generate 5 past completions (5-day streak)
  const completions = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateISO = getISODate(date);
    
    completions.push({
      id: `completion-sample-${i}`,
      taskText: [
        'Complete morning workout',
        'Read 30 pages of a book',
        'Practice coding for 1 hour',
        'Meditate for 15 minutes',
        'Write in journal'
      ][i],
      dateISO,
      targetType: 'today',
      targetDateISO: dateISO,
      finishedOnTime: true,
      xpEarned: [50, 30, 75, 30, 50][i],
      completedAt: getISOTimestamp(date),
      intensity: ['normal', 'chill', 'hardcore', 'chill', 'normal'][i]
    });
  }

  // Generate 3 pending challenges
  const pendingChallenges = [
    {
      id: 'challenge-sample-1',
      taskText: 'Finish project documentation',
      dateISO: getISODate(today),
      targetType: 'today',
      targetDateISO: getTargetDate('today'),
      intensity: 'normal',
      useTimer: true,
      timerDuration: 20,
      scheduledTime: null,
      notificationSent: false,
      status: 'pending',
      timerStartedAt: null
    },
    {
      id: 'challenge-sample-2',
      taskText: 'Learn React hooks in depth',
      dateISO: getISODate(today),
      targetType: 'this_week',
      targetDateISO: getTargetDate('this_week'),
      intensity: 'hardcore',
      useTimer: true,
      timerDuration: 30,
      scheduledTime: null,
      notificationSent: false,
      status: 'pending',
      timerStartedAt: null
    },
    {
      id: 'challenge-sample-3',
      taskText: 'Build a side project',
      dateISO: getISODate(today),
      targetType: 'this_month',
      targetDateISO: getTargetDate('this_month'),
      intensity: 'hardcore',
      useTimer: false,
      timerDuration: 0,
      scheduledTime: null,
      notificationSent: false,
      status: 'pending',
      timerStartedAt: null
    }
  ];

  // Set up 2 unlocked achievements
  const achievements = {
    'first-step': getISOTimestamp(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)), // 4 days ago
    'week-warrior': getISOTimestamp(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000))  // 1 day ago (assuming 7-day streak)
  };

  return {
    completions,
    pendingChallenges,
    achievements
  };
};

/**
 * Load sample data into localStorage
 */
export const loadSampleData = () => {
  const { completions, pendingChallenges, achievements } = generateSampleData();
  
  localStorage.setItem('excuse-killer-completions', JSON.stringify(completions));
  localStorage.setItem('excuse-killer-pending', JSON.stringify(pendingChallenges));
  localStorage.setItem('excuse-killer-achievements', JSON.stringify(achievements));
  
  console.log('Sample data loaded successfully!');
  console.log('- 5 completions (5-day streak)');
  console.log('- 3 pending challenges');
  console.log('- 2 unlocked achievements');
};
