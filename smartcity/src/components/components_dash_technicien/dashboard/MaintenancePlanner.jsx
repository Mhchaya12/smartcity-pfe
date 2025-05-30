import React from 'react';
import { 
  getPriorityColor, 
  formatDate 
} from "../../../data/mockData";
import { Badge } from '@/components/components_dash_technicien/ui/badge';
import { Button } from '@/components/components_dash_technicien/ui/button';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertCircle,
  RotateCw,
  Search,
  Settings,
  Battery,
  Trash2,
  Car,
  Shield,
  Info,
  Activity
} from 'lucide-react';

const SENSOR_TYPE_LABELS = {
  energie: 'Énergie',
  transport: 'Transport',
  dechet: 'Déchets',
  securite: 'Sécurité'
};

export const MaintenancePlanner = ({ 
  tasks, 
  onStatusChange,
  limit
}) => {
  const DISPLAY_TASKS = limit ? tasks.slice(0, limit) : tasks;

  const TASK_CONFIG = {
    replacement: { label: 'Remplacement', icon: <Wrench className="h-4 w-4" /> },
    calibration: { label: 'Calibration', icon: <RotateCw className="h-4 w-4" /> },
    inspection: { label: 'Inspection', icon: <Search className="h-4 w-4" /> },
    repair: { label: 'Réparation', icon: <Settings className="h-4 w-4" /> }
  };

  const STATUS_CONFIG = {
    pending: { 
      label: 'En attente',
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    in_progress: { 
      label: 'En cours',
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    completed: { 
      label: 'Terminé',
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      badgeClass: 'bg-green-100 text-green-800 border-green-200'
    }
  };

  const SENSOR_TYPE_ICONS = {
    transport: <Car className="h-4 w-4" />,
    energie: <Battery className="h-4 w-4" />,
    dechet: <Trash2 className="h-4 w-4" />,
    securite: <Shield className="h-4 w-4" />
  };

  const SENSOR_STATUS_CONFIG = {
    operational: {
      label: 'Opérationnel',
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      badgeClass: 'bg-green-100 text-green-800 border-green-200'
    },
    warning: {
      label: 'Avertissement',
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    critical: {
      label: 'Critique',
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      badgeClass: 'bg-red-100 text-red-800 border-red-200'
    },
    maintenance: {
      label: 'En maintenance',
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    offline: {
      label: 'Hors ligne',
      icon: <Activity className="h-4 w-4 text-gray-500" />,
      badgeClass: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const DUE_STYLES = {
    overdue: { border: 'border-red-300 shadow-sm shadow-red-100', text: 'text-red-600 font-medium' },
    dueSoon: { border: 'border-yellow-300 shadow-sm shadow-yellow-100', text: 'text-amber-600 font-medium' },
    normal: { border: '', text: '' }
  };

  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDueSoon = (dueDate) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isOverdue = (dueDate) => {
    return dueDate < new Date();
  };

  const getMediumPriorityIndicator = (task) => {
    return null;
  };

  const getMaintenanceStatus = (task) => {
    if (task.status === 'completed') {
      return 'bg-green-50 border-green-200';
    }
    if (task.sensorStatus === 'critical') {
      return 'bg-red-50 border-red-200';
    }
    if (task.sensorStatus === 'warning') {
      return 'bg-yellow-50 border-yellow-200';
    }
    if (task.sensorStatus === 'maintenance') {
      return 'bg-blue-50 border-blue-200';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div className="space-y-4">
      {DISPLAY_TASKS.length === 0 ? (
        <div className="flex items-center justify-center p-6 text-gray-500">
          Aucune tâche de maintenance programmée
        </div>
      ) : (
        DISPLAY_TASKS.map((task) => {
          const taskConfig = TASK_CONFIG[task.taskType] || TASK_CONFIG.default;
          const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.default;
          const sensorStatusConfig = SENSOR_STATUS_CONFIG[task.sensorStatus] || SENSOR_STATUS_CONFIG.default;
          const dueStatus = isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'dueSoon' : 'normal';
          const maintenanceStatusClass = getMaintenanceStatus(task);

          return (
            <div 
              key={task.id} 
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${maintenanceStatusClass}`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      task.sensorStatus === 'critical' ? 'bg-red-100' :
                      task.sensorStatus === 'warning' ? 'bg-yellow-100' :
                      task.sensorStatus === 'maintenance' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {SENSOR_TYPE_ICONS[task.sensorType] || <Settings className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {task.sensorType}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {task.sensorName ? `ID: ${task.sensorId} • ${task.sensorName}` : `ID: ${task.sensorId}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                    <Badge className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusConfig?.badgeClass || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig?.icon || <Clock className="h-4 w-4" />}
                      <span>{statusConfig?.label || task.status}</span>
                    </Badge>
                    <Badge className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${sensorStatusConfig?.badgeClass || 'bg-gray-100 text-gray-800'}`}>
                      {sensorStatusConfig?.icon || <Activity className="h-4 w-4" />}
                      <span>{sensorStatusConfig?.label || task.sensorStatus}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-b border-gray-200 py-3">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 w-24">Échéance:</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={`text-sm ${DUE_STYLES[dueStatus].text}`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && (
                          <span className="inline-flex items-center ml-2 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Retard
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 w-24">Assigné à:</p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 mr-2">
                        {task.assignedTo?.split(' ')[0]?.[0] || 'N'}{task.assignedTo?.split(' ')[1]?.[0] || 'A'}
                      </div>
                      <span className="text-sm font-medium">{task.assignedTo || 'Non assigné'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Notes:</p>
                  <p className="text-gray-700">{task.notes || 'Aucune note'}</p>
                </div>
                
                {task.status !== 'completed' && onStatusChange && (
                  <div className="flex justify-end pt-2 space-x-2">
                    {task.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => onStatusChange(task.id, 'in_progress')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Démarrer
                      </Button>
                    )}
                    
                    {task.status === 'in_progress' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                        onClick={() => onStatusChange(task.id, 'completed')}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Terminer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};