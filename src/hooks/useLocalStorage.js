import { useState, useEffect, useCallback } from 'react';
import { readFromStorage, writeToStorage, StorageError } from '../utils/storage';

/**
 * Custom hook for localStorage with React state integration
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key doesn't exist
 * @returns {[value, setValue, error]} - current value, setter function, and error state
 */
export const useLocalStorage = (key, initialValue) => {
  const [error, setError] = useState(null);
  
  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = readFromStorage(key, initialValue);
      return item;
    } catch (err) {
      setError(err);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      writeToStorage(key, valueToStore);
      setError(null);
    } catch (err) {
      setError(err);
      console.error(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, error];
};
