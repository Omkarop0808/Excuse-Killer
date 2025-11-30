import React from 'react';
import Timer from './Timer';
import './TimerModal.css';

function TimerModal({ challenge, isOpen, onClose, onComplete }) {
  if (!isOpen || !challenge) {
    return null;
  }

  const handleFinish = () => {
    // Call the completion handler
    if (onComplete) {
      onComplete(challenge);
    }
    // Close the modal
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content timer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{challenge.taskText}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="challenge-info">
            <span className={`intensity-badge intensity-${challenge.intensity}`}>
              {challenge.intensity}
            </span>
            <span className="duration-info">
              {challenge.durationMinutes || challenge.timerDuration || 20} minutes
            </span>
          </div>
          
          <Timer 
            durationMinutes={challenge.durationMinutes || challenge.timerDuration}
            taskId={challenge.id}
            onFinish={handleFinish}
          />
          
          {challenge.notes && (
            <div className="challenge-notes">
              <h4>Notes:</h4>
              <p>{challenge.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimerModal;

