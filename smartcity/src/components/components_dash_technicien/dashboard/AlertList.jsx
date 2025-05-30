import React, { useState } from 'react';
import { getTimeAgo, AlertType } from "../../../data/sharedData";
import { Bell, BellRing, BellDot, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export const AlertList = ({ alerts, onResolve, limit }) => {
  const [hoveredAlert, setHoveredAlert] = useState(null);

  const DISPLAY_ALERTS = limit ? alerts.slice(0, limit) : alerts;

  const ALERT_CONFIG = {
    critical: { label: 'Critique' },
    warning: { label: 'Attention' },
    info: { label: 'Information' },
    default: { label: 'Inconnu' }
  };

  const ALERT_STYLES = {
    critical: {
      icon: <BellRing className="h-5 w-5 text-red-600" />,
      textClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderClass: 'border-l-4 border-red-500'
    },
    warning: {
      icon: <BellDot className="h-5 w-5 text-amber-600" />,
      textClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      borderClass: 'border-l-4 border-amber-500'
    },
    info: {
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      textClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      borderClass: 'border-l-4 border-blue-500'
    },
    default: {
      icon: <Bell className="h-5 w-5 text-gray-600" />,
      textClass: 'text-gray-600',
      bgClass: 'bg-gray-50',
      borderClass: 'border-l-4 border-gray-300'
    }
  };

  const generateUniqueKey = (alert, index) => {
    // Try to use the alert ID first
    if (alert._id) return `alert-${alert._id}`;
    
    // If no ID is available, create a unique key using other properties
    const timestamp = alert.date_creation || new Date().toISOString();
    const location = alert.local || '';
    const description = alert.description || '';
    return `alert-${timestamp}-${location}-${description}-${index}`;
  };

  return (
    <div className="space-y-4">
      {DISPLAY_ALERTS.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6 text-gray-500">
            Aucune alerte disponible
          </CardContent>
        </Card>
      ) : (
        DISPLAY_ALERTS.map((alert, index) => {
          // Map API properties to component properties
          const type = alert.etat || 'default';
          const resolved = alert.resolu || false;
          const message = alert.description || '';
          const location = alert.local || '';
          const sensorId = alert.id_capteur || '';
          const timestamp = alert.date_creation ? new Date(alert.date_creation) : new Date();
          const alertId = alert._id || '';
          const uniqueKey = generateUniqueKey(alert, index);

          const alertConfig = ALERT_CONFIG[type] || ALERT_CONFIG.default;
          const alertStyle = ALERT_STYLES[type] || ALERT_STYLES.default;

          return (
            <Card
              key={uniqueKey}
              className={`overflow-hidden transition-all duration-200 ${alertStyle.borderClass} 
                ${resolved ? 'opacity-75 bg-gray-50' : `${alertStyle.bgClass}`}`}
              onMouseEnter={() => setHoveredAlert(uniqueKey)}
              onMouseLeave={() => setHoveredAlert(null)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 mr-2">
                        {alertStyle.icon}
                      </div>
                      <h3 className={`text-base font-medium ${alertStyle.textClass}`}>
                        {alertConfig.label}
                      </h3>
                      <span className="ml-auto text-xs text-gray-500">
                        {getTimeAgo(timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{message}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs px-2 py-1 rounded-full text-gray-700 border-gray-200">
                        {location}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1 rounded-full text-gray-700 border-gray-200">
                        ID: {sensorId}
                      </Badge>
                      <Badge
                        variant={resolved ? "outline" : "secondary"}
                        className={`text-xs px-2 py-1 rounded-full ${
                          resolved 
                            ? "text-green-700 bg-green-100 border-green-200" 
                            : "text-gray-800 bg-gray-200"
                        }`}
                      >
                        {resolved ? 'Résolu' : 'Non résolu'}
                      </Badge>
                    </div>
                  </div>

                  {!resolved && onResolve && alertId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`ml-2 flex-shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50 transition-opacity duration-200 ${
                        hoveredAlert === uniqueKey ? 'opacity-100' : 'opacity-0'
                      }`}
                      onClick={() => onResolve(alertId)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Résoudre
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};