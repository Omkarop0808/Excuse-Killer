import { getISODate, isToday, isThisWeek, isThisMonth } from './dateUtils';

/**
 * XP values for each intensity level
 */
export const XP_VALUES = {
  chill: 30,
  normal: 50,
  hardcore: 75
};

/**
 * Timer durations in minutes for each intensity
 */
export const TIMER_DURATIONS = {
  chill: 10,
  normal: 20,
  hardcore: 30
};

/**
 * Title badges based on streak
 */
export const TITLE_BADGES = [
  { min: 0, max: 2, title: 'Starter' },
  { min: 3, max: 6, title: 'Overcomer' },
  { min: 7, max: 14, title: 'Super Overcomer' },
  { min: 15, max: Infinity, title: 'Unstoppable' }
];

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first challenge',
    icon: '🎯',
    unlockCondition: 'Complete 1 challenge'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlockCondition: 'Reach 7-day streak'
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 15-day streak',
    icon: '⚡',
    unlockCondition: 'Reach 15-day streak'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a challenge in under 5 minutes',
    icon: '⚡',
    unlockCondition: 'Complete challenge < 5 min'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Complete 30 challenges',
    icon: '👑',
    unlockCondition: 'Complete 30 challenges'
  },
  {
    id: 'ai-believer',
    name: 'AI Believer',
    description: 'Use AI coach feature (Phase 6)',
    icon: '🤖',
    unlockCondition: 'Use AI coach'
  }
];

/**
 * Calculate XP for a given intensity
 */
export const calculateXP = (intensity) => {
  return XP_VALUES[intensity] || 0;
};

/**
 * Get timer duration for intensity
 */
export const getTimerDuration = (intensity) => {
  return TIMER_DURATIONS[intensity] || 20;
};

/**
 * Get title badge based on streak
 */
export const getTitleBadge = (streak) => {
  const badge = TITLE_BADGES.find(b => streak >= b.min && streak <= b.max);
  return badge ? badge.title : 'Starter';
};

/**
 * Calculate current streak from completions
 * Streak = consecutive days with at least one completion, ending with today
 */
export const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  // Sort completions by date (most recent first)
  const sorted = [...completions].sort((a, b) => 
    new Date(b.dateISO) - new Date(a.dateISO)
  );

  // Check if there's a completion today
  const today = getISODate();
  const hasToday = sorted.some(c => c.dateISO === today);
  
  if (!hasToday) {
    return 0;
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date();
  
  while (true) {
    const dateStr = getISODate(currentDate);
    const hasCompletion = sorted.some(c => c.dateISO === dateStr);
    
    if (!hasCompletion) {
      break;
    }
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

/**
 * Count completions in current week
 */
export const countWeeklyCompletions = (completions) => {
  if (!completions) return 0;
  return completions.filter(c => isThisWeek(c.dateISO)).length;
};

/**
 * Count completions in current month
 */
export const countMonthlyCompletions = (completions) => {
  if (!completions) return 0;
  return completions.filter(c => isThisMonth(c.dateISO)).length;
};

/**
 * Calculate total XP from completions
 */
export const calculateTotalXP = (completions) => {
  if (!completions) return 0;
  return completions.reduce((total, c) => total + (c.xpEarned || 0), 0);
};

/**
 * Check which achievements should be unlocked
 */
export const checkAchievementUnlocks = (completions, currentAchievements) => {
  const unlocked = { ...currentAchievements };
  
  // First Step - complete 1 challenge
  if (completions.length >= 1 && !unlocked['first-step']) {
    unlocked['first-step'] = new Date().toISOString();
  }
  
  // Week Warrior - 7 day streak
  const streak = calculateStreak(completions);
  if (streak >= 7 && !unlocked['week-warrior']) {
    unlocked['week-warrior'] = new Date().toISOString();
  }
  
  // Unstoppable - 15 day streak
  if (streak >= 15 && !unlocked['unstoppable']) {
    unlocked['unstoppable'] = new Date().toISOString();
  }
  
  // Consistency King - 30 completions
  if (completions.length >= 30 && !unlocked['consistency-king']) {
    unlocked['consistency-king'] = new Date().toISOString();
  }
  
  // Speed Demon - complete in under 5 minutes
  // This would need timer completion data
  
  return unlocked;
};

/**
 * Get last N completions
 */
export const getLastCompletions = (completions, count = 5) => {
  if (!completions) return [];
  return [...completions]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, count);
};
