import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SensorStatus as SensorStatusType, SensorType } from '../../../data/sharedData';

const getStatusColor = (status) => {
  switch (status) {
    case SensorStatusType.ACTIVE:
      return 'text-green-500';
    case SensorStatusType.WARNING:
      return 'text-yellow-500';
    case SensorStatusType.ERROR:
      return 'text-red-500';
    case SensorStatusType.OFFLINE:
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const getSensorIcon = (type) => {
  switch (type) {
    case SensorType.ENERGY:
      return '⚡';
    case SensorType.TRAFFIC:
      return '🚦';
    case SensorType.WASTE:
      return '🗑️';
    case SensorType.SECURITY:
      return '🔒';
    default:
      return '📡';
  }
};

export const SensorStatus = ({ sensor }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {getSensorIcon(sensor.type)} {sensor.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {sensor.location}
          </div>
          <div className={`text-sm font-medium ${getStatusColor(sensor.status)}`}>
            {sensor.status}
          </div>
        </div>
        {sensor.lastUpdate && (
          <div className="mt-2 text-xs text-muted-foreground">
            Dernière mise à jour: {new Date(sensor.lastUpdate).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};