import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

function Timer({ 
  durationMinutes, 
  duration, // Keep for backward compatibility
  taskId, 
  onFinish, 
  onComplete, // Keep for backward compatibility
  isActive, 
  onToggle, 
  onReset 
}) {
  // Use durationMinutes if provided, otherwise fall back to duration
  const timerDuration = durationMinutes || duration || 20;
  const timerKey = taskId ? `excuse-killer-timer-${taskId}` : null;
  
  const [timeRemaining, setTimeRemaining] = useState(timerDuration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(timerDuration * 60);

  // Initialize time when duration changes and restore from localStorage
  useEffect(() => {
    // Try to restore timer state from localStorage
    if (timerKey) {
      const savedState = localStorage.getItem(timerKey);
      if (savedState) {
        try {
          const { startTimestamp, durationSeconds } = JSON.parse(savedState);
          const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
          const remaining = durationSeconds - elapsed;
          
          if (remaining > 0) {
            setTimeRemaining(remaining);
            pausedTimeRef.current = remaining;
            setIsRunning(true);
            startTimeRef.current = startTimestamp;
            return;
          } else {
            // Timer finished while page was closed
            localStorage.removeItem(timerKey);
            setTimeRemaining(0);
            setIsComplete(true);
            setShowCompletionPrompt(true);
            return;
          }
        } catch (error) {
          console.error('Error restoring timer state:', error);
          localStorage.removeItem(timerKey);
        }
      }
    }
    
    // Default initialization
    setTimeRemaining(timerDuration * 60);
    pausedTimeRef.current = timerDuration * 60;
    setIsComplete(false);
  }, [timerDuration, timerKey]);

  // Handle visibility change (background tab detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        // Tab is hidden, store current state
        pausedTimeRef.current = timeRemaining;
      } else if (!document.hidden && isRunning && startTimeRef.current) {
        // Tab is visible again, recalculate elapsed time
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = duration * 60 - elapsed;
        if (remaining > 0) {
          setTimeRemaining(remaining);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, timeRemaining, duration]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning) {
      // Set start time if not already set
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - ((timerDuration * 60 - timeRemaining) * 1000);
      }
      
      // Persist timer state to localStorage
      if (timerKey) {
        localStorage.setItem(timerKey, JSON.stringify({
          startTimestamp: startTimeRef.current,
          durationSeconds: timerDuration * 60
        }));
      }
      
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = timerDuration * 60 - elapsed;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          setIsRunning(false);
          setIsComplete(true);
          setShowCompletionPrompt(true);
          
          // Clear localStorage
          if (timerKey) {
            localStorage.removeItem(timerKey);
          }
          
          // Call legacy onComplete for backward compatibility
          if (onComplete) {
            onComplete();
          }
        } else {
          setTimeRemaining(remaining);
          pausedTimeRef.current = remaining;
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Clear localStorage when paused
      if (timerKey && !isComplete) {
        localStorage.removeItem(timerKey);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerDuration, timeRemaining, onComplete, timerKey, isComplete]);

  const handleToggle = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
    
    if (!newRunningState) {
      // Pausing - reset start time ref
      startTimeRef.current = null;
    }
    
    if (onToggle) {
      onToggle(newRunningState);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(timerDuration * 60);
    pausedTimeRef.current = timerDuration * 60;
    setIsComplete(false);
    setShowCompletionPrompt(false);
    startTimeRef.current = null;
    
    // Clear localStorage
    if (timerKey) {
      localStorage.removeItem(timerKey);
    }
    
    if (onReset) {
      onReset();
    }
  };

  const handleConfirmCompletion = () => {
    setShowCompletionPrompt(false);
    if (onFinish) {
      onFinish(true); // Pass true to indicate completion
    }
  };

  const handleCancelCompletion = () => {
    setShowCompletionPrompt(false);
    if (onFinish) {
      onFinish(false); // Pass false to indicate not completed
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((timerDuration * 60 - timeRemaining) / (timerDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="timer">
      {showCompletionPrompt && (
        <div className="timer-completion-prompt">
          <p className="completion-message">⏰ Timer finished — Complete task?</p>
          <div className="completion-actions">
            <button 
              className="btn btn-primary"
              onClick={handleConfirmCompletion}
            >
              ✅ Yes, Complete
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleCancelCompletion}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="timer-circle">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={timeRemaining === 0 ? '#22c55e' : '#7C3AED'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            className="timer-progress"
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">{formatTime(timeRemaining)}</div>
          <div className="timer-label">
            {isComplete ? '✅ Complete!' : isRunning ? 'Running' : 'Paused'}
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button 
          className={`btn btn-timer ${isRunning ? 'btn-pause' : 'btn-start'}`}
          onClick={handleToggle}
          disabled={isComplete}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button 
          className="btn btn-timer btn-reset"
          onClick={handleReset}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
