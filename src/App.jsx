import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import ChallengePage from './pages/ChallengePage';
import ProgressPage from './pages/ProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGameStats } from './hooks/useGameStats';
import { STORAGE_KEYS } from './utils/storage';
import { checkAchievementUnlocks } from './utils/gameLogic';
import { loadSampleData } from './utils/sampleData';
import { runMigration } from './utils/migration';
import './App.css';

function App() {
  const [completions] = useLocalStorage(STORAGE_KEYS.COMPLETIONS, []);
  const [pendingChallenges] = useLocalStorage(STORAGE_KEYS.PENDING, []);
  const [achievements, setAchievements] = useLocalStorage(STORAGE_KEYS.ACHIEVEMENTS, {});
  const [migrationComplete, setMigrationComplete] = useState(false);
  
  const stats = useGameStats(completions, achievements);

  // Run migration on app startup (once)
  useEffect(() => {
    try {
      const result = runMigration();
      if (result.migrated) {
        console.log('Data migration completed successfully');
        // Reload to pick up migrated data
        window.location.reload();
      }
      setMigrationComplete(true);
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationComplete(true); // Continue anyway
    }
  }, []); // Run only once on mount

  // Check for achievement unlocks whenever completions change
  useEffect(() => {
    const newAchievements = checkAchievementUnlocks(completions, achievements);
    if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
      setAchievements(newAchievements);
    }
  }, [completions, achievements, setAchievements]);

  // Load sample data (for testing - can be removed in production)
  const handleLoadSampleData = () => {
    loadSampleData();
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <Nav streak={stats.streak} pendingCount={pendingChallenges.length} />
        
        {/* Sample Data Button (for testing) */}
        {completions.length === 0 && pendingChallenges.length === 0 && (
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            zIndex: 1000 
          }}>
            <button 
              onClick={handleLoadSampleData}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Load Sample Data
            </button>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<ChallengePage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
