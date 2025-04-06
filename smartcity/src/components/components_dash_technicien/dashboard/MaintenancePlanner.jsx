import React from 'react';
import { 
  getPriorityColor, 
  formatDate 
} from "../../../data/mockData";
import { Card, CardContent } from '@/components/components_dash_technicien/ui/card';
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
  Settings
} from 'lucide-react';

export const MaintenancePlanner = ({ 
  tasks, 
  onStatusChange,
  limit 
}) => {
  const DISPLAY_TASKS = limit ? tasks.slice(0, limit) : tasks;

  const TASK_CONFIG = {
    replacement: { label: 'Remplacement' },
    calibration: { label: 'Calibration' },
    inspection: { label: 'Inspection' },
    repair: { label: 'Réparation' },
    default: { label: 'Inconnu' }
  };

  const STATUS_CONFIG = {
    pending: { label: 'En attente' },
    in_progress: { label: 'En cours' },
    completed: { label: 'Terminé' },
    default: { label: 'Inconnu' }
  };

  const PRIORITY_CONFIG = {
    critical: { label: 'Critique' },
    high: { label: 'Élevée' },
    medium: { label: 'Moyenne' },
    low: { label: 'Basse' },
    default: { label: 'Inconnu' }
  };

  const TASK_STYLES = {
    replacement: { icon: <Wrench className="h-4 w-4" /> },
    calibration: { icon: <RotateCw className="h-4 w-4" /> },
    inspection: { icon: <Search className="h-4 w-4" /> },
    repair: { icon: <Settings className="h-4 w-4" /> },
    default: { icon: <Settings className="h-4 w-4" /> }
  };

  const STATUS_STYLES = {
    pending: { 
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    in_progress: { 
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    completed: { 
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      badgeClass: 'bg-green-100 text-green-800 border-green-200'
    },
    default: { 
      icon: <Clock className="h-4 w-4" />,
      badgeClass: 'bg-gray-100 text-gray-800'
    }
  };

  const DUE_STYLES = {
    overdue: { border: 'border-red-300 shadow-sm shadow-red-100', text: 'text-red-600 font-medium' },
    dueSoon: { border: 'border-yellow-300 shadow-sm shadow-yellow-100', text: 'text-amber-600 font-medium' },
    normal: { border: '', text: '' }
  };

  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-4">
      {DISPLAY_TASKS.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6 text-gray-500">
            Aucune tâche de maintenance programmée
          </CardContent>
        </Card>
      ) : (
        DISPLAY_TASKS.map((task) => {
          const taskConfig = TASK_CONFIG[task.taskType] || TASK_CONFIG.default;
          const taskStyle = TASK_STYLES[task.taskType] || TASK_STYLES.default;
          const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.default;
          const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.default;
          const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.default;
          const dueStatus = isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'dueSoon' : 'normal';

          return (
            <Card 
              key={task.id} 
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                task.status === 'completed' 
                  ? 'bg-gray-50 border-gray-200' 
                  : DUE_STYLES[dueStatus].border
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
                        <CalendarClock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{taskConfig.label} - {task.sensorName}</h3>
                        <p className="text-sm text-gray-500">ID: {task.sensorId}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getPriorityBadgeClass(task.priority)}`}>
                        {priorityConfig.label}
                      </Badge>
                      <Badge className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusStyle.badgeClass}`}>
                        {statusStyle.icon}
                        <span>{statusConfig.label}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-b border-gray-100 py-3">
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
                          {task.assignedTo.split(' ')[0][0]}{task.assignedTo.split(' ')[1]?.[0] || ''}
                        </div>
                        <span className="text-sm font-medium">{task.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Notes:</p>
                    <p className="text-gray-700">{task.notes}</p>
                  </div>
                  
                  {task.status !== 'completed' && onStatusChange && (
                    <div className="flex justify-end pt-2">
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
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};