import React, { useState } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { MaintenancePlanner } from '../../components/components_dash_technicien/dashboard/MaintenancePlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components_dash_technicien/ui/tabs';
import { Input } from '../../components/components_dash_technicien/ui/input';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { maintenanceTasks as mockTasks } from '../../data/mockData';
import { Search, Filter, Clock, CheckCheck, Settings } from 'lucide-react';

const Maintenance = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  

  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
  const highTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const mediumTasks = tasks.filter(t => t.priority === 'medium' && t.status !== 'completed').length;
  const lowTasks = tasks.filter(t => t.priority === 'low' && t.status !== 'completed').length;
  
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    const statusText = newStatus === 'in_progress' ? 'démarrée' : 'terminée';
    
    toast({
      title: `Tâche ${statusText}`,
      description: `La tâche a été marquée comme ${statusText}.`,
    });
  };
  
  const filteredPendingTasks = pendingTasks.filter(task => 
    task.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredInProgressTasks = inProgressTasks.filter(task => 
    task.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCompletedTasks = completedTasks.filter(task => 
    task.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Planification de Maintenance</h1>
        <p className="text-muted-foreground mt-1">Gérez les tâches de maintenance des capteurs du système.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-50 border-tech-red/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-tech-red/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-tech-red" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Critique</p>
              <h2 className="text-2xl font-bold text-tech-red">{criticalTasks}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-tech-yellow/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-tech-yellow/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-tech-yellow" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Élevée</p>
              <h2 className="text-2xl font-bold text-tech-yellow">{highTasks}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-tech-blue/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-tech-blue/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-tech-blue" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Moyenne</p>
              <h2 className="text-2xl font-bold text-tech-blue">{mediumTasks}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-tech-green/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-tech-green/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-tech-green" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Basse</p>
              <h2 className="text-2xl font-bold text-tech-green">{lowTasks}</h2>
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Rechercher..."
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