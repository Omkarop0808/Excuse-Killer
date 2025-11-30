import { useMemo } from 'react';
import {
  calculateStreak,
  countWeeklyCompletions,
  countMonthlyCompletions,
  calculateTotalXP,
  getTitleBadge,
  checkAchievementUnlocks
} from '../utils/gameLogic';

/**
 * Custom hook for calculating game statistics
 * @param {Array} completions - array of completion objects
 * @param {Object} achievements - current achievement unlock dates
 * @returns {Object} - calculated stats
 */
export const useGameStats = (completions = [], achievements = {}) => {
  const stats = useMemo(() => {
    const streak = calculateStreak(completions);
    const weeklyCount = countWeeklyCompletions(completions);
    const monthlyCount = countMonthlyCompletions(completions);
    const totalXP = calculateTotalXP(completions);
    const title = getTitleBadge(streak);
    const unlockedAchievements = checkAchievementUnlocks(completions, achievements);

    return {
      streak,
      weeklyCount,
      monthlyCount,
      totalXP,
      title,
      unlockedAchievements
    };
  }, [completions, achievements]);

  return stats;
};
