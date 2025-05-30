import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { AlertList } from '../../components/components_dash_technicien/dashboard/AlertList';
import { MaintenancePlanner } from '../../components/components_dash_technicien/dashboard/MaintenancePlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { alerts as mockAlerts, sensors as mockSensors } from '../../data/mockData';
import { SensorStatus } from '../../data/sharedData';
import { 
  ArrowRight, 
  BellRing, 
  CalendarClock, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Search,
  Filter,
  Wrench,
  RotateCw,
  Battery,
  Trash2,
  Car,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { maintenanceService } from '../../services/maintenanceService';
import { sensorService } from '../../services/sensorService';
import { socketService } from '../../services/socketService';

const Index = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [tasks, setTasks] = useState([]);
  const [sensors, setSensors] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceTasks();
    fetchSensors();
    
    // S'abonner aux mises à jour des capteurs
    const handleSensorUpdate = (data) => {
      setTasks(currentTasks => {
        return currentTasks.map(task => {
          if (task.sensorId === data.sensorId) {
            return {
              ...task,
              sensorStatus: data.status,
              sensorName: data.name || task.sensorName
            };
          }
          return task;
        });
      });
    };

    // S'abonner aux mises à jour de chaque type de capteur
    socketService.subscribeToSensorUpdates('dechet', handleSensorUpdate);
    socketService.subscribeToSensorUpdates('energie', handleSensorUpdate);
    socketService.subscribeToSensorUpdates('securite', handleSensorUpdate);
    socketService.subscribeToSensorUpdates('transport', handleSensorUpdate);

    return () => {
      // Nettoyer les abonnements
      socketService.unsubscribeFromSensorUpdates('dechet', handleSensorUpdate);
      socketService.unsubscribeFromSensorUpdates('energie', handleSensorUpdate);
      socketService.unsubscribeFromSensorUpdates('securite', handleSensorUpdate);
      socketService.unsubscribeFromSensorUpdates('transport', handleSensorUpdate);
    };
  }, []);

  const fetchSensors = async () => {
    try {
      const allSensors = await sensorService.getAllSensors();
      const normalizedSensors = {
        dechet: allSensors.dechets || [],
        energie: allSensors.energie || [],
        securite: allSensors.securite || [],
        transport: allSensors.transport || []
      };
      setSensors(normalizedSensors);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des capteurs",
        variant: "destructive"
      });
    }
  };

  const getSensorName = (sensorId, sensorType) => {
    if (!sensors[sensorType]) return '';
    const sensor = sensors[sensorType].find(s => s._id === sensorId);
    return sensor?.localisation || '';
  };

  const fetchMaintenanceTasks = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAllMaintenanceTasks();
      
      const transformedTasks = data.map(task => {
        const sensorName = getSensorName(task.sensorId, task.sensorType);
        return {
          id: task._id,
          sensorId: task.sensorId,
          taskType: task.typeTask,
          dueDate: new Date(task.date),
          priority: task.priorite,
          status: task.status,
          notes: task.description,
          sensorName: sensorName,
          assignedTo: task.assignedTo || 'Technicien',
          sensorStatus: task.sensorStatus || 'operational',
          location: task.location || sensorName,
          sensorType: task.sensorType || 'default'
        };
      });
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches de maintenance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, resolved: true } : alert
    ));

    toast({
      title: "Alerte résolue",
      description: "L'alerte a été marquée comme résolue.",
    });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      await maintenanceService.updateMaintenanceTask(taskId, {
        ...taskToUpdate,
        status: newStatus
      });

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      const statusText = newStatus === 'in_progress' ? 'démarrée' : 'terminée';
      
      toast({
        title: `Tâche ${statusText}`,
        description: `La tâche a été marquée comme ${statusText}.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tâche",
        variant: "destructive"
      });
    }
  };

  // Statistiques des capteurs
  const sensorsByStatus = {
    operational: mockSensors.filter(s => s.status === SensorStatus.OPERATIONAL).length,
    warning: mockSensors.filter(s => s.status === SensorStatus.WARNING).length,
    critical: mockSensors.filter(s => s.status === SensorStatus.CRITICAL).length,
    maintenance: mockSensors.filter(s => s.status === SensorStatus.MAINTENANCE).length,
    offline: mockSensors.filter(s => s.status === SensorStatus.OFFLINE).length,
  };

  const totalSensors = mockSensors.length;
  const operationalPercentage = Math.round((sensorsByStatus.operational / totalSensors) * 100);

  // Statistiques des tâches de maintenance
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  // Statistiques des alertes
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const warningAlerts = alerts.filter(a => !a.resolved && a.severity === 'warning').length;

  // Statistiques des états des capteurs
  const sensorStatusCounts = {
    operational: tasks.filter(t => t.sensorStatus === 'operational').length,
    warning: tasks.filter(t => t.sensorStatus === 'warning').length,
    critical: tasks.filter(t => t.sensorStatus === 'critical').length,
    maintenance: tasks.filter(t => t.sensorStatus === 'maintenance').length,
    offline: tasks.filter(t => t.sensorStatus === 'offline').length
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Bienvenue sur le tableau de bord du technicien.</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alertes Actives</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{activeAlerts}</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-tech-red font-medium">{criticalAlerts} critiques</span>
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-red/20 flex items-center justify-center">
                <BellRing className="h-5 w-5 text-tech-red" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Link to="/technicien/alerts" className="text-sm text-tech-blue hover:underline flex items-center">
                Voir les alertes
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tâches en Attente</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{pendingTasks.length}</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-tech-red font-medium">{criticalTasks} critiques</span>
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-yellow/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-tech-yellow" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Link to="/technicien/maintenance" className="text-sm text-tech-blue hover:underline flex items-center">
                Voir la maintenance
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tâches en Cours</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{inProgressTasks.length}</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-tech-orange font-medium">{highPriorityTasks} prioritaires</span>
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-blue/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-tech-blue" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Link to="/technicien/maintenance" className="text-sm text-tech-blue hover:underline flex items-center">
                Voir la maintenance
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Capteurs Opérationnels</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{sensorsByStatus.operational}</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-tech-green font-medium">{operationalPercentage}%</span>
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-green/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-tech-green" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Link to="/technicien/sensors" className="text-sm text-tech-blue hover:underline flex items-center">
                Voir les capteurs
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alertes récentes</CardTitle>
                <CardDescription>Les dernières alertes reçues du système</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-tech-red">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{criticalAlerts} critiques</span>
                </div>
                <Link to="/technicien/alerts">
                  <Button variant="ghost" size="sm" className="text-tech-blue hover:text-tech-blue">
                    Voir toutes
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AlertList
              alerts={alerts.filter(a => !a.resolved).slice(0, 3)}
              onResolve={handleResolveAlert}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Maintenance à venir</CardTitle>
                <CardDescription>Tâches de maintenance planifiées</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-tech-yellow">
                  <Clock className="h-4 w-4" />
                  <span>{pendingTasks.length} en attente</span>
                </div>
                <Link to="/technicien/maintenance">
                  <Button variant="ghost" size="sm" className="text-tech-blue hover:text-tech-blue">
                    Voir toutes
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MaintenancePlanner
              tasks={tasks.filter(t => t.status !== 'completed').slice(0, 2)}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;