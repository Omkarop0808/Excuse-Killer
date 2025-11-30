import React, { useState } from 'react';
import './ActionModal.css';

function ActionModal({ 
  challenge, 
  isOpen, 
  onClose, 
  onStartTask, 
  onMarkCompleted, 
  onViewDetails 
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !challenge) {
    return null;
  }

  const handleStartTask = () => {
    if (onStartTask) {
      onStartTask(challenge);
    }
    onClose();
  };

  const handleMarkCompleted = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCompletion = () => {
    if (onMarkCompleted) {
      onMarkCompleted(challenge);
    }
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelCompletion = () => {
    setShowConfirmation(false);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleBackToActions = () => {
    setShowDetails(false);
  };

  const formatDate = (dateISO) => {
    if (!dateISO) return 'N/A';
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content action-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{challenge.taskText}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {showConfirmation ? (
            <div className="confirmation-dialog">
              <p className="confirmation-message">
                Are you sure you want to mark this challenge as completed?
              </p>
              <div className="confirmation-actions">
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
          ) : showDetails ? (
            <div className="challenge-details">
              <div className="detail-row">
                <span className="detail-label">Intensity:</span>
                <span className={`intensity-badge intensity-${challenge.intensity}`}>
                  {challenge.intensity}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">
                  {challenge.durationMinutes || challenge.timerDuration || 20} minutes
                </span>
              </div>
              
              {challenge.useTimer && challenge.customTimerDuration && (
                <div className="detail-row">
                  <span className="detail-label">Timer Duration:</span>
                  <span className="detail-value">
                    {challenge.customTimerDuration} minutes
                  </span>
                </div>
              )}
              
              <div className="detail-row">
                <span className="detail-label">Target:</span>
                <span className="detail-value">
                  {challenge.targetType === 'custom_date' 
                    ? formatDate(challenge.customDateISO || challenge.targetDateISO)
                    : challenge.targetType.replace('_', ' ')}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Recurrence:</span>
                <span className="detail-value">
                  {challenge.recurrence || 'once'}
                </span>
              </div>
              
              {challenge.scheduleTime && (
                <div className="detail-row">
                  <span className="detail-label">Schedule Time:</span>
                  <span className="detail-value">{challenge.scheduleTime}</span>
                </div>
              )}
              
              {challenge.notes && (
                <div className="detail-row detail-notes">
                  <span className="detail-label">Notes:</span>
                  <p className="detail-value">{challenge.notes}</p>
                </div>
              )}
              
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${challenge.status}`}>
                  {challenge.status || 'pending'}
                </span>
              </div>
              
              <button 
                className="btn btn-secondary btn-full-width"
                onClick={handleBackToActions}
              >
                ← Back to Actions
              </button>
            </div>
          ) : (
            <div className="action-buttons">
              <button 
                className="action-btn action-btn-start"
                onClick={handleStartTask}
              >
                <span className="action-icon">▶️</span>
                <div className="action-text">
                  <div className="action-title">Start Task</div>
                  <div className="action-description">
                    {challenge.useTimer ? 'Begin timer and track progress' : 'Mark as ongoing'}
                  </div>
                </div>
              </button>
              
              <button 
                className="action-btn action-btn-complete"
                onClick={handleMarkCompleted}
              >
                <span className="action-icon">✅</span>
                <div className="action-text">
                  <div className="action-title">Mark Completed</div>
                  <div className="action-description">
                    Finish challenge and earn XP
                  </div>
                </div>
              </button>
              
              <button 
                className="action-btn action-btn-details"
                onClick={handleViewDetails}
              >
                <span className="action-icon">📋</span>
                <div className="action-text">
                  <div className="action-title">View Details</div>
                  <div className="action-description">
                    See all challenge information
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionModal;

