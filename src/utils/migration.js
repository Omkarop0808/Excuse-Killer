import { STORAGE_KEYS, readFromStorage, writeToStorage } from './storage';
import { TIMER_DURATIONS } from './gameLogic';
import { getISOTimestamp } from './dateUtils';

/**
 * Detect if challenges are in old format (missing new fields)
 * @param {Array} challenges - Array of challenge objects
 * @returns {boolean} - True if old format detected
 */
export const detectOldFormat = (challenges) => {
  if (!challenges || challenges.length === 0) {
    return false;
  }

  // Check if any challenge is missing new required fields
  return challenges.some(challenge => 
    challenge.durationMinutes === undefined ||
    challenge.recurrence === undefined ||
    challenge.status === undefined ||
    challenge.createdAt === undefined
  );
};

/**
 * Migrate a single challenge from old format to new format
 * @param {Object} oldChallenge - Challenge in old format
 * @returns {Object} - Challenge in new format
 */
export const migrateChallenge = (oldChallenge) => {
  // Preserve all existing fields
  const newChallenge = { ...oldChallenge };

  // Add durationMinutes based on intensity (if not present)
  if (newChallenge.durationMinutes === undefined) {
    newChallenge.durationMinutes = TIMER_DURATIONS[oldChallenge.intensity] || 20;
  }

  // Add recurrence (default to "once")
  if (newChallenge.recurrence === undefined) {
    newChallenge.recurrence = 'once';
  }

  // Add scheduleTime (default to null)
  if (newChallenge.scheduleTime === undefined) {
    newChallenge.scheduleTime = null;
  }

  // Add notes (default to empty string)
  if (newChallenge.notes === undefined) {
    newChallenge.notes = '';
  }

  // Add status (default to "pending")
  if (newChallenge.status === undefined) {
    newChallenge.status = 'pending';
  }

  // Add notificationSent (default to false)
  if (newChallenge.notificationSent === undefined) {
    newChallenge.notificationSent = false;
  }

  // Add createdAt (use existing dateISO if available)
  if (newChallenge.createdAt === undefined) {
    newChallenge.createdAt = oldChallenge.dateISO || getISOTimestamp();
  }

  // Add updatedAt (current timestamp)
  if (newChallenge.updatedAt === undefined) {
    newChallenge.updatedAt = getISOTimestamp();
  }

  // Convert targetDateISO to customDateISO if targetType is custom_date
  if (newChallenge.customDateISO === undefined) {
    if (oldChallenge.targetType === 'custom_date' && oldChallenge.targetDateISO) {
      newChallenge.customDateISO = oldChallenge.targetDateISO;
    } else {
      newChallenge.customDateISO = null;
    }
  }

  return newChallenge;
};

/**
 * Create a backup of current data before migration
 * @param {Object} data - Data to backup
 * @returns {string} - Backup key
 */
export const createBackup = (data) => {
  const timestamp = Date.now();
  const backupKey = `excuse-killer-backup-${timestamp}`;
  
  try {
    writeToStorage(backupKey, data);
    console.log(`Backup created: ${backupKey}`);
    return backupKey;
  } catch (error) {
    console.error('Failed to create backup:', error);
    throw error;
  }
};

/**
 * Migrate all challenges from old format to new format
 * @param {Array} challenges - Array of challenges to migrate
 * @returns {Array} - Migrated challenges
 */
export const migrateChallenges = (challenges) => {
  if (!challenges || challenges.length === 0) {
    return [];
  }

  return challenges.map(challenge => migrateChallenge(challenge));
};

/**
 * Run migration process on app startup
 * @returns {Object} - Migration result { migrated: boolean, backupKey: string|null }
 */
export const runMigration = () => {
  try {
    // Read pending challenges from localStorage
    const pendingChallenges = readFromStorage(STORAGE_KEYS.PENDING, []);

    // Check if migration is needed
    if (!detectOldFormat(pendingChallenges)) {
      console.log('No migration needed - data is already in new format');
      return { migrated: false, backupKey: null };
    }

    console.log('Old format detected - starting migration...');

    // Create backup before migration
    const backupData = {
      pending: pendingChallenges,
      completions: readFromStorage(STORAGE_KEYS.COMPLETIONS, []),
      achievements: readFromStorage(STORAGE_KEYS.ACHIEVEMENTS, {}),
      notifications: readFromStorage(STORAGE_KEYS.NOTIFICATIONS, {})
    };
    
    const backupKey = createBackup(backupData);

    // Migrate challenges
    const migratedChallenges = migrateChallenges(pendingChallenges);

    // Save migrated data back to localStorage
    writeToStorage(STORAGE_KEYS.PENDING, migratedChallenges);

    console.log(`Migration complete! ${migratedChallenges.length} challenges migrated`);
    console.log(`Backup saved as: ${backupKey}`);

    return { migrated: true, backupKey };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

