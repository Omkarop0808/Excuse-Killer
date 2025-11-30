import React, { useState, useEffect } from 'react';
import './LiveProgressBar.css';

function LiveProgressBar({ challenge, onClick }) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!challenge || !challenge.timerStartedAt) {
      return;
    }

    const updateProgress = () => {
      const startTime = new Date(challenge.timerStartedAt).getTime();
      const durationMs = (challenge.durationMinutes || challenge.timerDuration || 20) * 60 * 1000;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      
      const progressPercent = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(progressPercent);

      // Format remaining time
      const remainingSeconds = Math.floor(remaining / 1000);
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      setTimeRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    // Update immediately
    updateProgress();

    // Update every second
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [challenge]);

  if (!challenge || challenge.status !== 'ongoing' || !challenge.timerStartedAt) {
    return null;
  }

  return (
    <div 
      className="live-progress-bar" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="progress-bar-header">
        <span className="progress-task-name">{challenge.taskText}</span>
        <span className="progress-time-remaining">{timeRemaining}</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-bar-hint">Click to open timer</div>
    </div>
  );
}

export default LiveProgressBar;

