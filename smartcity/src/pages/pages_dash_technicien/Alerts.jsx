import React, { useState } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { AlertList } from '../../components/components_dash_technicien/dashboard/AlertList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components_dash_technicien/ui/tabs';
import { Input } from '../../components/components_dash_technicien/ui/input';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { alerts as mockAlerts } from '../../data/mockData';
import { Bell, Search, Filter, AlertTriangle, Check } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);
  
  const criticalActiveAlerts = activeAlerts.filter(a => a.type === 'critical').length;
  const warningActiveAlerts = activeAlerts.filter(a => a.type === 'warning').length;
  const infoActiveAlerts = activeAlerts.filter(a => a.type === 'info').length;
  
  const handleResolveAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    
    toast({
      title: "Alerte résolue",
      description: "L'alerte a été marquée comme résolue.",
    });
  };
  
  const filteredActiveAlerts = activeAlerts.filter(alert => 
    alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredResolvedAlerts = resolvedAlerts.filter(alert => 
    alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Alertes</h1>
        <p className="text-muted-foreground mt-1">Consultez et gérez les alertes du système.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 border-tech-red/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alertes Critiques</p>
                <h2 className="text-2xl font-bold text-tech-red">{criticalActiveAlerts}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-tech-red/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-tech-red" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-tech-yellow/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alertes d'Avertissement</p>
                <h2 className="text-2xl font-bold text-tech-yellow">{warningActiveAlerts}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-tech-yellow/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-tech-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-tech-blue/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alertes d'Information</p>
                <h2 className="text-2xl font-bold text-tech-blue">{infoActiveAlerts}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-tech-blue/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-tech-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Liste des Alertes</CardTitle>
              <CardDescription>Gérez et répondez aux alertes du système</CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
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
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>Actives ({activeAlerts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Résolues ({resolvedAlerts.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {filteredActiveAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Aucune alerte active ne correspond à votre recherche' : 'Aucune alerte active'}
                </div>
              ) : (
                <div className="space-y-4">
                  <AlertList alerts={filteredActiveAlerts} onResolve={handleResolveAlert} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resolved">
              {filteredResolvedAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Aucune alerte résolue ne correspond à votre recherche' : 'Aucune alerte résolue'}
                </div>
              ) : (
                <div className="space-y-4">
                  <AlertList alerts={filteredResolvedAlerts} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Alerts; 
