import React, { useEffect, useState } from 'react';
import './Confetti.css';

function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.5,
        backgroundColor: ['#7C3AED', '#06B6D4', '#FBBF24', '#22c55e', '#ef4444'][Math.floor(Math.random() * 5)]
      }));

      setParticles(newParticles);

      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            backgroundColor: particle.backgroundColor
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
