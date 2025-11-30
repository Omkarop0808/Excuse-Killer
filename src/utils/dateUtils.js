/**
 * Get ISO date string (YYYY-MM-DD) for a given date
 */
export const getISODate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get ISO timestamp for a given date
 */
export const getISOTimestamp = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date is today
 */
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is within this week
 */
export const isThisWeek = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return date >= weekStart && date <= weekEnd;
};

/**
 * Check if a date is within this month
 */
export const isThisMonth = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1String, date2String) => {
  const d1 = new Date(date1String);
  const d2 = new Date(date2String);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate days remaining until target date
 */
export const daysRemaining = (targetDateString) => {
  const target = new Date(targetDateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Get target date based on target type
 */
export const getTargetDate = (targetType, customDate = null) => {
  const today = new Date();
  
  switch (targetType) {
    case 'today':
      return getISODate(today);
    
    case 'this_week': {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + (6 - today.getDay()));
      return getISODate(weekEnd);
    }
    
    case 'this_month': {
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return getISODate(monthEnd);
    }
    
    case 'custom_date':
      return customDate || getISODate(today);
    
    default:
      return getISODate(today);
  }
};
