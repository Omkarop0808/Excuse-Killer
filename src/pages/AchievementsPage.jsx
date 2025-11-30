import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { ACHIEVEMENTS } from '../utils/gameLogic';
import { formatDate } from '../utils/dateUtils';
import './AchievementsPage.css';

function AchievementsPage() {
  const [achievements] = useLocalStorage(STORAGE_KEYS.ACHIEVEMENTS, {});

  return (
    <div className="page achievements-page">
      <div className="achievements-container">
        <h1 className="page-title">Achievements</h1>
        
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = !!achievements[achievement.id];
            const unlockedDate = achievements[achievement.id];

            return (
              <div 
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {isUnlocked ? achievement.icon : '???'}
                </div>
                <div className="achievement-content">
                  <h3 className="achievement-name">
                    {isUnlocked ? achievement.name : '???'}
                  </h3>
                  <p className="achievement-description">
                    {isUnlocked ? achievement.description : 'Locked'}
                  </p>
                  {isUnlocked ? (
                    <div className="achievement-unlocked-date">
                      Unlocked: {formatDate(unlockedDate)}
                    </div>
                  ) : (
                    <div className="achievement-unlock-condition">
                      {achievement.unlockCondition}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AchievementsPage;
