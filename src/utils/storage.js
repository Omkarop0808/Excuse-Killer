// localStorage key constants
export const STORAGE_KEYS = {
  COMPLETIONS: 'excuse-killer-completions',
  PENDING: 'excuse-killer-pending',
  ACHIEVEMENTS: 'excuse-killer-achievements',
  NOTIFICATIONS: 'excuse-killer-notifications',
  PROFILE: 'excuse-killer-profile'
};

// Error types
export class StorageError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
  }
}

// Check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Read from localStorage with error handling
export const readFromStorage = (key, defaultValue = null) => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available. Data will not persist.');
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    // If parse error, clear corrupted data
    if (error instanceof SyntaxError) {
      localStorage.removeItem(key);
      throw new StorageError('Corrupted data detected and cleared', 'PARSE_ERROR');
    }
    return defaultValue;
  }
};

// Write to localStorage with error handling
export const writeToStorage = (key, value) => {
  if (!isLocalStorageAvailable()) {
    throw new StorageError('localStorage is not available', 'ACCESS_DENIED');
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error);
    
    // Check if quota exceeded
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      throw new StorageError(
        'Storage quota exceeded. Please clear old data.',
        'QUOTA_EXCEEDED'
      );
    }
    
    throw new StorageError('Failed to save data', 'WRITE_ERROR');
  }
};

// Remove from localStorage
export const removeFromStorage = (key) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

// Clear all app data
export const clearAllStorage = () => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Get storage usage info (approximate)
export const getStorageInfo = () => {
  if (!isLocalStorageAvailable()) {
    return { available: false };
  }

  try {
    let totalSize = 0;
    const sizes = {};

    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      const size = item ? new Blob([item]).size : 0;
      sizes[name] = size;
      totalSize += size;
    });

    return {
      available: true,
      totalSize,
      sizes,
      totalSizeKB: (totalSize / 1024).toFixed(2)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { available: true, error: true };
  }
};
