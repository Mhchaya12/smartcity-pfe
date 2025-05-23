import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCar,
  faTrash,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { metricsData } from '../../../data/adminData';
import './Metrics.css';

const Metrics = ({energie, dechets, transport, securite}) => {
  useEffect(() => {
    console.log('Metrics Component - Detailed Props:', {
      energie: {
        data: energie,
        hasData: !!energie,
        properties: energie ? Object.keys(energie) : []
      },
      dechets: {
        data: dechets,
        hasData: !!dechets,
        properties: dechets ? Object.keys(dechets) : []
      },
      transport: {
        data: transport,
        hasData: !!transport,
        properties: transport ? Object.keys(transport) : []
      },
      securite: {
        data: securite,
        hasData: !!securite,
        properties: securite ? Object.keys(securite) : []
      }
    });
  }, [energie, dechets, transport, securite]);

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
              {metric.type === 'Énergie' && (
                <>
                  <div className="metric-value">{energie?.seuilConsomation || 'N/A'} kWh</div>
                  <div className="metric-label">{energie?.localisation || 'Non disponible'}</div>
                  <div className="metric-comparison">
                    <span className={`metric-percentage ${energie?.status === 'operational' ? 'positive' : 'negative'}`}>
                      {energie?.pourcentage ? `${energie.pourcentage}%` : 'N/A'}
                    </span>
                    <span className="metric-comparison-text">
                      {energie?.dernier_mise_a_jour ? `Dernière mise à jour: ${new Date(energie.dernier_mise_a_jour).toLocaleString()}` : 'Pas de mise à jour'}
                    </span>
                  </div>
                </>
              )}
              {metric.type === 'Déchets' && (
                <>
                  <div className="metric-value">{dechets?.niveaux_remplissage || 'N/A'}%</div>
                  <div className="metric-label">{dechets?.localisation || 'Non disponible'}</div>
                  <div className="metric-comparison">
                    <span className={`metric-percentage ${dechets?.status === 'operational' ? 'positive' : 'negative'}`}>
                      {dechets?.pourcentage ? `${dechets.pourcentage}%` : 'N/A'}
                    </span>
                    <span className="metric-comparison-text">
                      {dechets?.dernier_mise_a_jour ? `Dernière mise à jour: ${new Date(dechets.dernier_mise_a_jour).toLocaleString()}` : 'Pas de mise à jour'}
                    </span>
                  </div>
                </>
              )}
              {metric.type === 'Transport' && (
                <>
                  <div className="metric-value">{transport?.fluxActuelle || 'N/A'} véhicules</div>
                  <div className="metric-label">{transport?.localisation || 'Non disponible'}</div>
                  <div className="metric-comparison">
                    <span className={`metric-percentage ${transport?.status === 'operational' ? 'positive' : 'negative'}`}>
                      {transport?.pourcentage ? `${transport.pourcentage}%` : 'N/A'}
                    </span>
                    <span className="metric-comparison-text">
                      {transport?.dernier_mise_a_jour ? `Dernière mise à jour: ${new Date(transport.dernier_mise_a_jour).toLocaleString()}` : 'Pas de mise à jour'}
                    </span>
                  </div>
                </>
              )}
              {metric.type === 'Sécurité' && (
                <>
                  <div className="metric-value">{securite?.anomalieDetection || 'N/A'} anomalies</div>
                  <div className="metric-label">{securite?.localisation || 'Non disponible'}</div>
                  <div className="metric-comparison">
                    <span className={`metric-percentage ${securite?.status === 'operational' ? 'positive' : 'negative'}`}>
                      {securite?.pourcentage ? `${securite.pourcentage}%` : 'N/A'}
                    </span>
                    <span className="metric-comparison-text">
                      {securite?.dernier_mise_a_jour ? `Dernière mise à jour: ${new Date(securite.dernier_mise_a_jour).toLocaleString()}` : 'Pas de mise à jour'}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;