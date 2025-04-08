import React from 'react';
import { getStatusColor, getSensorTypeIcon, formatDate } from "../../../data/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/components_dash_technicien/ui/card';
import { Badge } from '@/components/components_dash_technicien/ui/badge';
import { Button } from '@/components/components_dash_technicien/ui/button';
import { CheckCircle, AlertTriangle, Wrench, XCircle, MapPin, Calendar } from 'lucide-react';

export const SensorStatus = ({ sensor, showDetails = false, onStatusChange }) => {
  const STATUS_TEXT = {
    operational: 'Opérationnel',
    warning: 'Avertissement',
    failed: 'En panne',
    maintenance: 'En maintenance'
  };

  const STATUS_ICONS = {
    operational: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    failed: <XCircle className="h-5 w-5 text-red-500" />,
    maintenance: <Wrench className="h-5 w-5 text-blue-500" />
  };

  const SENSOR_TYPES = {
    energie: 'Énergie',
    dechet: 'Déchets',
    transport: 'Transport',
    securite: 'Sécurité'
  };

  const STATUS_BUTTONS = [
    { status: 'operational', icon: CheckCircle, label: 'Opérationnel', colors: 'text-green-600 border-green-200 hover:bg-green-50' },
    { status: 'warning', icon: AlertTriangle, label: 'Avertissement', colors: 'text-yellow-600 border-yellow-200 hover:bg-yellow-50' },
    { status: 'failed', icon: XCircle, label: 'En panne', colors: 'text-red-600 border-red-200 hover:bg-red-50' },
    { status: 'maintenance', icon: Wrench, label: 'Maintenance', colors: 'text-blue-600 border-blue-200 hover:bg-blue-50' }
  ];

  // Formatage des dates
  const lastUpdate = sensor.dernier_mise_a_jour ? formatDate(sensor.dernier_mise_a_jour) : 'N/A';
  const lastMaintenance = sensor.lastMaintenance ? formatDate(sensor.lastMaintenance) : 'N/A';
  const installationDate = sensor.installationDate ? formatDate(sensor.installationDate) : 'N/A';

  // Données spécifiques au type de capteur
  const getSpecificData = () => {
    switch (sensor.type) {
      case 'energie':
        return `Seuil: ${sensor.seuilConsomation} kWh | Batterie: ${sensor.batteryLevel}%`;
      case 'dechet':
        return `Remplissage: ${sensor.niveaux_remplissage}% | Batterie: ${sensor.batteryLevel}%`;
      case 'transport':
        return `Flux: ${sensor.fluxActuelle} véhicules/h | Batterie: ${sensor.batteryLevel}%`;
      case 'securite':
        return `Anomalies: ${sensor.anomalieDetection} | Batterie: ${sensor.batteryLevel}%`;
      default:
        return `État: ${sensor.pourcentage}%`;
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3`}>
              {getSensorTypeIcon(sensor.type)}
            </div>
            <div>
              <CardTitle className="text-base font-medium">{sensor.name}</CardTitle>
              <p className="text-xs text-gray-500">
                {SENSOR_TYPES[sensor.type] || sensor.type}
              </p>
            </div>
          </div>
          <Badge className={`px-2 py-1 flex items-center gap-1 rounded-full ${getStatusColor(sensor.status)}`}>
            {STATUS_ICONS[sensor.status]}
            <span className="ml-1 text-xs font-medium">
              {STATUS_TEXT[sensor.status] || sensor.status}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{sensor.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Dernière mise à jour: {lastUpdate}</span>
          </div>

          {showDetails && (
            <>
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Dernière maintenance: {lastMaintenance}</span>
              </div>
              <div className="text-sm text-gray-700">
                <span>{getSpecificData()}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      {!showDetails && (
        <CardFooter className="pt-0 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex justify-between w-full py-2">
            <span>ID: {sensor.id}</span>
            <span>Installé: {installationDate.split(' ')[0]}</span>
          </div>
        </CardFooter>
      )}

      <CardFooter className="pt-3 pb-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 w-full">
          {STATUS_BUTTONS.map(({ status, icon: Icon, label, colors }) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              className={`text-xs ${colors}`}
              onClick={() => onStatusChange(sensor.id, status)}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SensorStatus;