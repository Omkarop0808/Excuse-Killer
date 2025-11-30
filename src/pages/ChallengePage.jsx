import React, { useState } from 'react';
import { isPastDate, getTargetDate, getISODate, getISOTimestamp } from '../utils/dateUtils';
import { getTimerDuration, calculateXP, calculateStreak } from '../utils/gameLogic';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import Timer from '../components/Timer';
import Confetti from '../components/Confetti';
import ActionModal from '../components/ActionModal';
import PendingChallengesList from '../components/PendingChallengesList';
import './ChallengePage.css';

function ChallengePage() {
  const [pendingChallenges, setPendingChallenges] = useLocalStorage(STORAGE_KEYS.PENDING, []);
  const [completions, setCompletions] = useLocalStorage(STORAGE_KEYS.COMPLETIONS, []);
  const [notifications, setNotifications] = useLocalStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  
  const [formData, setFormData] = useState({
    taskText: '',
    intensity: 'normal',
    durationMinutes: 20, // Default for normal
    targetType: 'today',
    customDate: '',
    recurrence: 'once',
    scheduleTime: '',
    useTimer: false,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Handle intensity change - update default duration
    if (name === 'intensity') {
      const defaultDuration = getTimerDuration(value);
      setFormData(prev => ({
        ...prev,
        intensity: value,
        durationMinutes: defaultDuration
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate task text
    if (!formData.taskText.trim()) {
      newErrors.taskText = 'Task description is required';
    }

    // Validate intensity
    if (!['chill', 'normal', 'hardcore'].includes(formData.intensity)) {
      newErrors.intensity = 'Invalid intensity level';
    }

    // Validate duration
    const duration = parseInt(formData.durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      newErrors.durationMinutes = 'Duration must be a positive number';
    }

    // Validate target type
    if (!['today', 'this_week', 'this_month', 'custom_date'].includes(formData.targetType)) {
      newErrors.targetType = 'Invalid target type';
    }

    // Validate custom date
    if (formData.targetType === 'custom_date') {
      if (!formData.customDate) {
        newErrors.customDate = 'Custom date is required';
      } else if (isPastDate(formData.customDate)) {
        newErrors.customDate = 'Date cannot be in the past';
      }
    }

    // Validate recurrence
    if (!['once', 'daily', 'weekly', 'monthly'].includes(formData.recurrence)) {
      newErrors.recurrence = 'Invalid recurrence option';
    }

    // Validate schedule time format (HH:MM)
    if (formData.scheduleTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.scheduleTime)) {
      newErrors.scheduleTime = 'Time must be in HH:MM format (00:00 to 23:59)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate unique ID
    const id = `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate target date
    const targetDateISO = formData.targetType === 'custom_date' 
      ? formData.customDate 
      : getTargetDate(formData.targetType);

    // Create challenge object with new format
    const newChallenge = {
      id,
      taskText: formData.taskText.trim(),
      intensity: formData.intensity,
      durationMinutes: parseInt(formData.durationMinutes),
      targetType: formData.targetType,
      targetDateISO: targetDateISO,
      customDateISO: formData.targetType === 'custom_date' ? formData.customDate : null,
      recurrence: formData.recurrence,
      scheduleTime: formData.scheduleTime || null,
      useTimer: formData.useTimer,
      notes: formData.notes.trim(),
      status: 'pending',
      notificationSent: false,
      createdAt: getISOTimestamp(),
      updatedAt: getISOTimestamp(),
      timerStartedAt: null
    };

    // Save to localStorage
    setPendingChallenges([...pendingChallenges, newChallenge]);
    
    // Set as active challenge
    setActiveChallenge(newChallenge);
    
    // Show success message
    setSuccessMessage('Challenge created successfully! 🎯');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset form
    setFormData({
      taskText: '',
      intensity: 'normal',
      durationMinutes: 20,
      targetType: 'today',
      customDate: '',
      recurrence: 'once',
      scheduleTime: '',
      useTimer: false,
      notes: ''
    });
  };

  const handlePendingChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setShowActionModal(true);
  };

  const handleStartTask = (challenge) => {
    // Update challenge status to ongoing
    const updatedChallenges = pendingChallenges.map(c =>
      c.id === challenge.id ? { ...c, status: 'ongoing', timerStartedAt: getISOTimestamp() } : c
    );
    setPendingChallenges(updatedChallenges);
    
    // Set as active challenge
    const updatedChallenge = updatedChallenges.find(c => c.id === challenge.id);
    setActiveChallenge(updatedChallenge);
    
    // If timer is enabled, show timer modal
    if (challenge.useTimer) {
      setShowTimerModal(true);
    }
    
    setShowActionModal(false);
  };

  const handleTimerComplete = (completed) => {
    if (completed === true) {
      handleCompleteChallenge(activeChallenge);
      setShowTimerModal(false);
    } else if (completed === false) {
      handleTaskNotCompleted(activeChallenge);
      setShowTimerModal(false);
    }
  };

  const handleCompleteChallenge = (challenge = activeChallenge) => {
    if (!challenge) return;

    // Create completion record
    const completion = {
      id: `completion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskText: challenge.taskText,
      dateISO: getISODate(),
      targetType: challenge.targetType,
      targetDateISO: challenge.targetDateISO || getTargetDate(challenge.targetType),
      finishedOnTime: !isPastDate(challenge.targetDateISO || getTargetDate(challenge.targetType)),
      xpEarned: calculateXP(challenge.intensity),
      completedAt: getISOTimestamp(),
      intensity: challenge.intensity
    };

    // Save completion
    setCompletions([...completions, completion]);

    // Remove from pending challenges
    setPendingChallenges(pendingChallenges.filter(c => c.id !== challenge.id));

    // Clear active challenge if it's the same
    if (activeChallenge?.id === challenge.id) {
      setActiveChallenge(null);
    }

    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    // Show success message
    setSuccessMessage(`🎉 Challenge completed! +${completion.xpEarned} XP`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleTaskNotCompleted = (challenge) => {
    // Calculate current streak
    const currentStreak = calculateStreak(completions);
    
    // Deduct streak by removing the most recent completion if streak > 0
    if (currentStreak > 0 && completions.length > 0) {
      // Remove the most recent completion to break the streak
      const sortedCompletions = [...completions].sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      );
      const updatedCompletions = completions.filter(c => c.id !== sortedCompletions[0].id);
      setCompletions(updatedCompletions);
    }
    
    // Show notification
    const notif = {
      id: `notif-${Date.now()}`,
      message: '❌ Task not completed. Streak deducted by 1.',
      type: 'error',
      timestamp: getISOTimestamp()
    };
    setNotification(notif);
    setNotifications([...notifications, notif]);
    
    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
    
    // Remove from pending and active
    setPendingChallenges(pendingChallenges.filter(c => c.id !== challenge.id));
    if (activeChallenge?.id === challenge.id) {
      setActiveChallenge(null);
    }
  };

  return (
    <div className="page challenge-page">
      <Confetti trigger={showConfetti} />
      
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="challenge-container">
        <h1 className="page-title">Create Challenge</h1>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        <form className="challenge-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskText">What's your challenge?</label>
            <input
              type="text"
              id="taskText"
              name="taskText"
              value={formData.taskText}
              onChange={handleChange}
              placeholder="Enter your task..."
              className={errors.taskText ? 'error' : ''}
            />
            {errors.taskText && <span className="error-message">{errors.taskText}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="intensity">Intensity Level</label>
            <select
              id="intensity"
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
              className={errors.intensity ? 'error' : ''}
            >
              <option value="chill">😌 Chill</option>
              <option value="normal">💪 Normal</option>
              <option value="hardcore">🔥 Hardcore</option>
            </select>
            {errors.intensity && <span className="error-message">{errors.intensity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="durationMinutes">Duration (minutes)</label>
            <input
              type="number"
              id="durationMinutes"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
              placeholder="Enter duration in minutes"
              className={errors.durationMinutes ? 'error' : ''}
            />
            {errors.durationMinutes && <span className="error-message">{errors.durationMinutes}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="targetType">Target</label>
            <select
              id="targetType"
              name="targetType"
              value={formData.targetType}
              onChange={handleChange}
              className={errors.targetType ? 'error' : ''}
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="custom_date">Custom Date</option>
            </select>
            {errors.targetType && <span className="error-message">{errors.targetType}</span>}
          </div>

          {formData.targetType === 'custom_date' && (
            <div className="form-group">
              <label htmlFor="customDate">Custom Date</label>
              <input
                type="date"
                id="customDate"
                name="customDate"
                value={formData.customDate}
                onChange={handleChange}
                min={getISODate()}
                className={errors.customDate ? 'error' : ''}
              />
              {errors.customDate && <span className="error-message">{errors.customDate}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="recurrence">Recurrence</label>
            <select
              id="recurrence"
              name="recurrence"
              value={formData.recurrence}
              onChange={handleChange}
              className={errors.recurrence ? 'error' : ''}
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.recurrence && <span className="error-message">{errors.recurrence}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="scheduleTime">Schedule Time (optional)</label>
            <input
              type="time"
              id="scheduleTime"
              name="scheduleTime"
              value={formData.scheduleTime}
              onChange={handleChange}
              placeholder="HH:MM"
              className={errors.scheduleTime ? 'error' : ''}
            />
            {errors.scheduleTime && <span className="error-message">{errors.scheduleTime}</span>}
            <small className="field-hint">Set a time for notifications (HH:MM format)</small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="useTimer"
                checked={formData.useTimer}
                onChange={handleChange}
              />
              <span>Use Timer</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Challenge
          </button>
        </form>

        <div className="challenges-layout">
          {activeChallenge && (
            <div className="active-challenge">
              <h2 className="challenge-title">Active Challenge</h2>
              <div className="challenge-card">
                <div className="challenge-header">
                  <h3>{activeChallenge.taskText}</h3>
                  <span className={`intensity-badge intensity-${activeChallenge.intensity}`}>
                    {activeChallenge.intensity}
                  </span>
                </div>

                {activeChallenge.useTimer && !showTimerModal && (
                  <Timer 
                    durationMinutes={activeChallenge.durationMinutes || 20}
                    taskId={activeChallenge.id}
                    onFinish={handleTimerComplete}
                  />
                )}

                <button 
                  className="btn btn-complete"
                  onClick={() => handleCompleteChallenge(activeChallenge)}
                >
                  ✅ Completed this challenge
                </button>
              </div>
            </div>
          )}

          {pendingChallenges.length > 0 && (
            <div className="pending-challenges-section">
              <h2 className="challenge-title">Pending Challenges</h2>
              <PendingChallengesList 
                challenges={pendingChallenges}
                onChallengeClick={handlePendingChallengeClick}
              />
            </div>
          )}
        </div>
      </div>

      <ActionModal
        challenge={selectedChallenge}
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onStartTask={handleStartTask}
        onMarkCompleted={handleCompleteChallenge}
      />

      {showTimerModal && activeChallenge && (
        <div className="modal-overlay" onClick={() => setShowTimerModal(false)}>
          <div className="modal-content timer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeChallenge.taskText}</h2>
              <button className="modal-close" onClick={() => setShowTimerModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="challenge-info">
                <span className={`intensity-badge intensity-${activeChallenge.intensity}`}>
                  {activeChallenge.intensity}
                </span>
                <span className="duration-info">
                  {activeChallenge.durationMinutes || 20} minutes
                </span>
              </div>
              
              <Timer 
                durationMinutes={activeChallenge.durationMinutes || 20}
                taskId={activeChallenge.id}
                onFinish={handleTimerComplete}
              />
              
              {activeChallenge.notes && (
                <div className="challenge-notes">
                  <h4>Notes:</h4>
                  <p>{activeChallenge.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengePage;
