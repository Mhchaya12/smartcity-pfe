import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBolt, 
  faCar, 
  faTrash, 
  faUserShield, 
  faArrowUp, 
  faArrowDown, 
  faBatteryFull, 
  faBatteryHalf, 
  faBatteryEmpty 
} from '@fortawesome/free-solid-svg-icons';
import './Metrics.css';

const Metrics = () => {
  const metricsData = [
    {
      type: 'Énergie',
      primaryMetric: {
        title: 'Consommation d\'Énergie',
        value: '425 kWh',
        icon: faBolt,
        iconClass: 'bolt',
        percentage: 2.4,
        comparison: '(hier)',
        label: 'Moyenne journalière',
      },
      batteryLevel: {
        value: '75%',
        percentage: -1.5,
      }
    },
    {
      type: 'Transport',
      primaryMetric: {
        title: 'Flux de Circulation',
        value: '3190 véh/h',
        icon: faCar, // Fixed from faPostal to faCar
        iconClass: 'car',
        percentage: 1.2,
        comparison: '(hier)',
        label: 'Capacité routière utilisée',
      },
      batteryLevel: {
        value: '20%',
        percentage: -5.0,
      } 
    },
    {
      type: 'Déchets',
      primaryMetric: {
        title: 'Niveau de Déchets',
        value: '75%',
        icon: faTrash,
        iconClass: 'trash',
        percentage: 4.8,
        comparison: '(hier)',
        label: 'Cette semaine',
      },
      batteryLevel: {
        value: '50%',
        percentage: -3.0,
      }
    },
    {
      type: 'Sécurité',
      primaryMetric: {
        title: 'Personnel de Sécurité',
        value: '12/15',
        icon: faUserShield,
        iconClass: 'security-staff',
        percentage: 0.8,
        comparison: '(hier)',
        label: 'Toutes zones confondues',
      },
      batteryLevel: {
        value: '10%',
        percentage: -10.0,
      }
    },
  ];

  const getBatteryIcon = (value) => {
    const batteryPercentage = parseInt(value);
    if (batteryPercentage >= 75) return { icon: faBatteryFull, class: 'battery-full' };
    if (batteryPercentage >= 25) return { icon: faBatteryHalf, class: 'battery-half' };
    return { icon: faBatteryEmpty, class: 'battery-empty' };
  };

  return (
    <div className="metrics">
      <div className="metric-group">
        <div className="metric-cards">
          {metricsData.map((group, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">{group.primaryMetric.title}</h3>
                <div className={`metric-icon ${group.primaryMetric.iconClass}-icon`}>
                  <FontAwesomeIcon icon={group.primaryMetric.icon} />
                </div>
              </div>
              <div className="metric-value">{group.primaryMetric.value}</div>
              <div className="metric-label">{group.primaryMetric.label}</div>
              <div className={`metric-trend ${group.primaryMetric.percentage >= 0 ? 'trend-up' : 'trend-down'}`}>
                <FontAwesomeIcon icon={group.primaryMetric.percentage >= 0 ? faArrowUp : faArrowDown} />{' '}
                {Math.abs(group.primaryMetric.percentage)}% {group.primaryMetric.comparison}
              </div>
              
              <div className="battery-indicator">
                {(() => {
                  const battery = getBatteryIcon(group.batteryLevel.value);
                  return (
                    <>
                      <FontAwesomeIcon icon={battery.icon} className={`battery-icon ${battery.class}`} />
                      <span className="battery-value">{group.batteryLevel.value}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;