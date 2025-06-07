import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/components_dash_technicien/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components_dash_technicien/ui/tabs';
import { Input } from '../../components/components_dash_technicien/ui/input';
import { Button } from '../../components/components_dash_technicien/ui/button';
import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
import { Bell, Search, Check } from 'lucide-react';
import axios from 'axios';

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('Actives');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
    // Set up polling for real-time updates
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/alerts');
      const allAlerts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActiveAlerts(allAlerts.filter(alert => !alert.resolu));
      setResolvedAlerts(allAlerts.filter(alert => alert.resolu));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les alertes",
        variant: "destructive",
      });
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5050/api/alerts/${id}/resolve`);
      fetchAlerts();
      toast({
        title: "Alerte résolue",
        description: "L'alerte a été marquée comme résolue.",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de résoudre l'alerte",
        variant: "destructive",
      });
    }
  };

  // Filter alerts based on search term
  const filteredActiveAlerts = activeAlerts.filter((alert) =>
    `${alert.description} ${alert.local}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResolvedAlerts = resolvedAlerts.filter((alert) =>
    `${alert.description} ${alert.local}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Alertes</h1>
        <p className="text-muted-foreground mt-1">Consultez et gérez les alertes du système.</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="Actives" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>Actives ({activeAlerts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="Résolues" className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Résolues ({resolvedAlerts.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Actives">
              <div className="space-y-4">
                {filteredActiveAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'Aucune alerte active ne correspond à votre recherche' : 'Aucune alerte active'}
                  </div>
                ) : (
                  filteredActiveAlerts.map((alert) => (
                    <div
                      key={alert._id}
                      className={`flex items-center p-4 rounded-lg border ${
                        alert.etat === 'critical' ? 'border-tech-red/20 bg-red-50' :
                        alert.etat === 'warning' ? 'border-tech-yellow/20 bg-amber-50' :
                        'border-tech-blue/20 bg-blue-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {alert.description} - {alert.local}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.date).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(alert._id)}
                      >
                        Résoudre
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="Résolues">
              <div className="space-y-4">
                {filteredResolvedAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'Aucune alerte résolue ne correspond à votre recherche' : 'Aucune alerte résolue'}
                  </div>
                ) : (
                  filteredResolvedAlerts.map((alert) => (
                    <div
                      key={alert._id}
                      className={`flex items-center p-4 rounded-lg border opacity-60 ${
                        alert.etat === 'critical' ? 'border-tech-red/20 bg-red-50' :
                        alert.etat === 'warning' ? 'border-tech-yellow/20 bg-amber-50' :
                        'border-tech-blue/20 bg-blue-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {alert.description} - {alert.local}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-xs text-tech-green bg-tech-green/10 px-2 py-1 rounded">
                        ✔ Résolu
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Alerts;