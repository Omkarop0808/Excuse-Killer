import React from 'react';
import './IntensityBadge.css';

function IntensityBadge({ intensity }) {
  return (
    <span className={`intensity-badge intensity-${intensity}`}>
      {intensity}
    </span>
  );
}

export default IntensityBadge;
