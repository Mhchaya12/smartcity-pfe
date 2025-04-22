import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCar,
  faTrash,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { metricsData } from '../../../data/adminData';
import './Metrics.css';

const Metrics = () => {
  return (
    <div className="metrics">
      <div className="metric-group">
        <div className="metric-cards">
          {metricsData.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">{metric.primaryMetric.title}</h3>
                <div className="metric-icon">
                  <FontAwesomeIcon 
                    icon={
                      metric.type === 'Énergie' ? faBolt :
                      metric.type === 'Transport' ? faCar :
                      metric.type === 'Déchets' ? faTrash :
                      faUserShield
                    } 
                  />
                </div>
              </div>
              <div className="metric-value">{metric.primaryMetric.value}</div>
              <div className="metric-label">{metric.primaryMetric.label}</div>
              <div className="metric-comparison">
                <span className={`metric-percentage ${metric.primaryMetric.percentage >= 0 ? 'positive' : 'negative'}`}>
                  {metric.primaryMetric.percentage > 0 ? '+' : ''}{metric.primaryMetric.percentage}%
                </span>
                <span className="metric-comparison-text">{metric.primaryMetric.comparison}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;