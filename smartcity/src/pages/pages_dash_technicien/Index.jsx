import React, { useState } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { AlertList } from '../../components/components_dash_technicien/dashboard/AlertList';
import { SensorStatus } from '../../components/components_dash_technicien/dashboard/SensorStatus';
import { MaintenancePlanner } from '../../components/components_dash_technicien/dashboard/MaintenancePlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { alerts as mockAlerts, sensors as mockSensors, maintenanceTasks as mockTasks } from '../../data/mockData';
import { ArrowRight, BellRing, Cpu, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const { toast } = useToast();
  
  const sensorsByStatus = {
    operational: mockSensors.filter(s => s.status === 'operational').length,
    warning: mockSensors.filter(s => s.status === 'warning').length,
    failed: mockSensors.filter(s => s.status === 'failed').length,
    maintenance: mockSensors.filter(s => s.status === 'maintenance').length,
  };
  
  const totalSensors = mockSensors.length;
  const operationalPercentage = Math.round((sensorsByStatus.operational / totalSensors) * 100);
  
  const pendingTasks = mockTasks.filter(t => t.status !== 'completed').length;
  const criticalTasks = mockTasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
  
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  
  const handleResolveAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    
    toast({
      title: "Alerte résolue",
      description: "L'alerte a été marquée comme résolue.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Bienvenue sur le tableau de bord du technicien.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alertes Actives</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{activeAlerts}</h2>
                  <p className="text-sm text-muted-foreground">sur {alerts.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground mb-1">État des Capteurs</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{operationalPercentage}%</h2>
                  <p className="text-sm text-muted-foreground">opérationnels</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-blue/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-tech-blue" />
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
      
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tâches en Attente</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">{pendingTasks}</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-tech-red font-medium">{criticalTasks} critiques</span>
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-tech-yellow/20 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-tech-yellow" />
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Alertes récentes</CardTitle>
              <Link to="/technicien/alerts">
                <Button variant="ghost" size="sm" className="text-tech-blue hover:text-tech-blue">
                  Voir toutes
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Les dernières alertes reçues du système</CardDescription>
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
              <CardTitle>Maintenance à venir</CardTitle>
              <Link to="/technicien/maintenance">
                <Button variant="ghost" size="sm" className="text-tech-blue hover:text-tech-blue">
                  Voir toutes
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Tâches de maintenance planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <MaintenancePlanner 
              tasks={mockTasks.filter(t => t.status !== 'completed').slice(0, 2)} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>État des capteurs</CardTitle>
            <Link to="/technicien/sensors">
              <Button variant="ghost" size="sm" className="text-tech-blue hover:text-tech-blue">
                Voir tous
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardDescription>Aperçu de l'état des capteurs dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSensors
              .filter(s => s.status !== 'operational')
              .slice(0, 3)
              .map(sensor => (
                <SensorStatus key={sensor.id} sensor={sensor} />
              ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Index; 