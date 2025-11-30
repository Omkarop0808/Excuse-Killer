import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGameStats } from '../hooks/useGameStats';
import { STORAGE_KEYS } from '../utils/storage';
import { getLastCompletions } from '../utils/gameLogic';
import { formatDate } from '../utils/dateUtils';
import PendingChallengesList from '../components/PendingChallengesList';
import './ProgressPage.css';

function ProgressPage() {
  const [completions] = useLocalStorage(STORAGE_KEYS.COMPLETIONS, []);
  const [achievements] = useLocalStorage(STORAGE_KEYS.ACHIEVEMENTS, {});
  const [pendingChallenges] = useLocalStorage(STORAGE_KEYS.PENDING, []);
  
  const stats = useGameStats(completions, achievements);
  const lastCompletions = getLastCompletions(completions, 5);

  return (
    <div className="page progress-page">
      <div className="progress-container">
        <h1 className="page-title">Your Progress</h1>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card streak-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.weeklyCount}</div>
            <div className="stat-label">This Week</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📆</div>
            <div className="stat-value">{stats.monthlyCount}</div>
            <div className="stat-label">This Month</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.totalXP}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>

        {/* Title Badge */}
        <div className="title-badge-section">
          <h2>Your Title</h2>
          <div className="title-badge-card">
            <div className="title-badge-icon">👑</div>
            <div className="title-badge-name">{stats.title}</div>
            <div className="title-badge-desc">
              {stats.streak === 0 && 'Start your journey!'}
              {stats.streak >= 1 && stats.streak <= 2 && 'Keep going!'}
              {stats.streak >= 3 && stats.streak <= 6 && 'You\'re making progress!'}
              {stats.streak >= 7 && stats.streak <= 14 && 'Amazing consistency!'}
              {stats.streak >= 15 && 'You\'re unstoppable!'}
            </div>
          </div>
        </div>

        {/* Recent Completions */}
        <div className="recent-completions">
          <h2>Recent Completions</h2>
          {lastCompletions.length === 0 ? (
            <div className="empty-state">
              <p>No completions yet. Start a challenge to see your progress!</p>
            </div>
          ) : (
            <div className="completions-list">
              {lastCompletions.map(completion => (
                <div key={completion.id} className="completion-item">
                  <div className="completion-text">{completion.taskText}</div>
                  <div className="completion-meta">
                    <span className={`intensity-badge intensity-${completion.intensity}`}>
                      {completion.intensity}
                    </span>
                    <span className="completion-xp">+{completion.xpEarned} XP</span>
                    <span className="completion-date">{formatDate(completion.dateISO)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Challenges */}
        <div className="your-challenges-section">
          <h2>Your Challenges</h2>
          <PendingChallengesList challenges={pendingChallenges} />
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
