import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCar,
  faTrash,
  faUserShield,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { metricsData } from '../../../data/adminData'; // Import from adminData.js
import './Metrics.css';

// Map string icon names to actual icon objects
const iconMap = {
  faBolt,
  faCar,
  faTrash,
  faUserShield,
};

const Metrics = () => {
  return (
    <div className="metrics">
      <div className="metric-group">
        <div className="metric-cards">
          {metricsData.map((group, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">{group.primaryMetric.title}</h3>
                <div className={`metric-icon ${group.primaryMetric.iconClass}-icon`}>
                  <FontAwesomeIcon icon={iconMap[group.primaryMetric.icon]} />
                </div>
              </div>
              <div className="metric-value">{group.primaryMetric.value}</div>
              <div className="metric-label">{group.primaryMetric.label}</div>
              <div
                className={`metric-trend ${
                  group.primaryMetric.percentage >= 0 ? 'trend-up' : 'trend-down'
                }`}
              >
                <FontAwesomeIcon
                  icon={group.primaryMetric.percentage >= 0 ? faArrowUp : faArrowDown}
                />{' '}
                {Math.abs(group.primaryMetric.percentage)}% {group.primaryMetric.comparison}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;