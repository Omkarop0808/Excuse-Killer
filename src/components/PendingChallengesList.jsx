import React from 'react';
import { isToday, isThisWeek, isThisMonth, daysRemaining, formatDate } from '../utils/dateUtils';
import './PendingChallengesList.css';

function PendingChallengesList({ challenges, onChallengeClick }) {
  // Group challenges by target type
  const groupedChallenges = {
    today: challenges.filter(c => isToday(c.targetDateISO)),
    thisWeek: challenges.filter(c => !isToday(c.targetDateISO) && isThisWeek(c.targetDateISO)),
    thisMonth: challenges.filter(c => !isToday(c.targetDateISO) && !isThisWeek(c.targetDateISO) && isThisMonth(c.targetDateISO)),
    other: challenges.filter(c => !isToday(c.targetDateISO) && !isThisWeek(c.targetDateISO) && !isThisMonth(c.targetDateISO))
  };

  const handleChallengeClick = (challenge) => {
    if (onChallengeClick) {
      onChallengeClick(challenge);
    }
  };

  const renderChallengeCard = (challenge) => {
    const days = daysRemaining(challenge.targetDateISO);
    const status = challenge.status === 'ongoing' ? 'Ongoing' : 'Pending';

    return (
      <div 
        key={challenge.id} 
        className="pending-challenge-card"
        onClick={() => handleChallengeClick(challenge)}
      >
        <div className="pending-challenge-header">
          <h4>{challenge.taskText}</h4>
          <span className={`status-badge status-${challenge.status}`}>
            {status}
          </span>
        </div>
        <div className="pending-challenge-meta">
          <span className={`intensity-badge intensity-${challenge.intensity}`}>
            {challenge.intensity}
          </span>
          <span className="target-date">{formatDate(challenge.targetDateISO)}</span>
          <span className={`days-remaining ${days < 0 ? 'overdue' : ''}`}>
            {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days left`}
          </span>
        </div>
      </div>
    );
  };

  if (challenges.length === 0) {
    return (
      <div className="pending-challenges-empty">
        <p>No pending challenges. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="pending-challenges-list">
      {groupedChallenges.today.length > 0 && (
        <div className="challenge-group">
          <h3 className="group-title">Today</h3>
          <div className="challenge-cards">
            {groupedChallenges.today.map(renderChallengeCard)}
          </div>
        </div>
      )}

      {groupedChallenges.thisWeek.length > 0 && (
        <div className="challenge-group">
          <h3 className="group-title">This Week</h3>
          <div className="challenge-cards">
            {groupedChallenges.thisWeek.map(renderChallengeCard)}
          </div>
        </div>
      )}

      {groupedChallenges.thisMonth.length > 0 && (
        <div className="challenge-group">
          <h3 className="group-title">This Month</h3>
          <div className="challenge-cards">
            {groupedChallenges.thisMonth.map(renderChallengeCard)}
          </div>
        </div>
      )}

      {groupedChallenges.other.length > 0 && (
        <div className="challenge-group">
          <h3 className="group-title">Later</h3>
          <div className="challenge-cards">
            {groupedChallenges.other.map(renderChallengeCard)}
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingChallengesList;
