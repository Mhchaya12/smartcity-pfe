import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { MaintenancePlanner } from '../../components/components_dash_technicien/dashboard/MaintenancePlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components_dash_technicien/ui/tabs';
import { Input } from '../../components/components_dash_technicien/ui/input';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCheck, 
  Settings,
  AlertCircle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { maintenanceService } from '../../services/maintenanceService';
import { sensorService } from '../../services/sensorService';
import { socketService } from '../../services/socketService';

const Maintenance = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensors, setSensors] = useState({});
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
      console.log('Fetched all sensors:', allSensors);
      
      // Normaliser les données des capteurs
      const normalizedSensors = {
        dechet: allSensors.dechets || [],
        energie: allSensors.energie || [],
        securite: allSensors.securite || [],
        transport: allSensors.transport || []
      };
      
      console.log('Normalized sensors:', normalizedSensors);
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
    if (!sensors[sensorType]) {
      console.log(`No sensors found for type: ${sensorType}`);
      return '';
    }
    
    const sensor = sensors[sensorType].find(s => s._id === sensorId);
    if (!sensor) {
      console.log(`No sensor found with ID: ${sensorId} for type: ${sensorType}`);
      return '';
    }
    
    return sensor.localisation || '';
  };

  const fetchMaintenanceTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await maintenanceService.getAllMaintenanceTasks();
      console.log('Maintenance tasks data:', data);
      
      // Transform the data to match the frontend format
      const transformedTasks = data.map(task => {
        const sensorName = getSensorName(task.sensorId, task.sensorType);
        console.log(`Task ${task._id}: sensorId=${task.sensorId}, sensorType=${task.sensorType}, sensorName=${sensorName}`);
        
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
          sensorType: task.sensorType
        };
      });
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
      setError('Impossible de charger les tâches de maintenance');
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches de maintenance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  // Ne compter que les tâches actives (en attente et en cours)
  const activeTasks = [...pendingTasks, ...inProgressTasks];
  const criticalTasks = activeTasks.filter(t => t.priority === 'critical').length;
  const highTasks = activeTasks.filter(t => t.priority === 'high').length;
  const mediumTasks = activeTasks.filter(t => t.priority === 'medium').length;
  const lowTasks = activeTasks.filter(t => t.priority === 'low').length;

  // Statistiques des états des capteurs
  const sensorStatusCounts = {
    operational: tasks.filter(t => t.sensorStatus === 'operational').length,
    warning: tasks.filter(t => t.sensorStatus === 'warning').length,
    critical: tasks.filter(t => t.sensorStatus === 'critical').length,
    maintenance: tasks.filter(t => t.sensorStatus === 'maintenance').length,
    offline: tasks.filter(t => t.sensorStatus === 'offline').length
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
  
  const filterTasks = (taskList) => {
    return taskList.filter(task => {
      return (
        task.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        task.sensorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };
  
  const filteredPendingTasks = filterTasks(pendingTasks);
  const filteredInProgressTasks = filterTasks(inProgressTasks);
  const filteredCompletedTasks = filterTasks(completedTasks);

  const taskCounts = {
    critical: criticalTasks,
    high: highTasks,
    medium: mediumTasks,
    low: lowTasks
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
            <Button 
              onClick={fetchMaintenanceTasks}
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Planification de Maintenance</h1>
        <p className="text-muted-foreground mt-1">Gérez les tâches de maintenance des capteurs du système.</p>
      </div>
      
      

      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Tâches de Maintenance</CardTitle>
              <CardDescription>Gérez et suivez les tâches de maintenance des capteurs</CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, type, lieu..."
                  className="pl-8 w-full md:w-[250px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>En attente ({pendingTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <span>En cours ({inProgressTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCheck className="h-4 w-4 mr-2" />
                <span>Terminées ({completedTasks.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {filteredPendingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Aucune tâche en attente ne correspond à votre recherche' : 'Aucune tâche en attente'}
                </div>
              ) : (
                <MaintenancePlanner 
                  tasks={filteredPendingTasks} 
                  onStatusChange={handleStatusChange}
                />
              )}
            </TabsContent>
            
            <TabsContent value="in_progress">
              {filteredInProgressTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Aucune tâche en cours ne correspond à votre recherche' : 'Aucune tâche en cours'}
                </div>
              ) : (
                <MaintenancePlanner 
                  tasks={filteredInProgressTasks} 
                  onStatusChange={handleStatusChange}
                />
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filteredCompletedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Aucune tâche terminée ne correspond à votre recherche' : 'Aucune tâche terminée'}
                </div>
              ) : (
                <MaintenancePlanner 
                  tasks={filteredCompletedTasks}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Maintenance;