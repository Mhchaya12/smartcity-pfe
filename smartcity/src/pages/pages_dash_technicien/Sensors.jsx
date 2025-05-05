// import React, { useState } from 'react';
// import { DashboardLayout } from '../../components/components_dash_technicien/layout/DashboardLayout';
// import { SensorStatus } from '../../components/components_dash_technicien/dashboard/SensorStatus';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components_dash_technicien/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components_dash_technicien/ui/tabs';
// import { Input } from '../../components/components_dash_technicien/ui/input';
// import { Button } from '../../components/components_dash_technicien/ui/button';
// import { Badge } from '../../components/components_dash_technicien/ui/badge';
// import { Progress } from '../../components/components_dash_technicien/ui/progress';
// import { useToast } from '../../components/components_dash_technicien/ui/use-toast';
// import { sensors as mockSensors, getSensorTypeIcon, formatDate } from '../../data/mockData';
// import { Cpu, Search, Filter, AlertTriangle, CheckCircle, Wrench, RotateCw } from 'lucide-react';

// const Sensors = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sensors, setSensors] = useState(mockSensors);
//   const { toast } = useToast();
  
//   const operationalSensors = sensors.filter(s => s.status === 'operational');
//   const warningSensors = sensors.filter(s => s.status === 'warning');
//   const failedSensors = sensors.filter(s => s.status === 'failed');
//   const maintenanceSensors = sensors.filter(s => s.status === 'maintenance');
  
//   // Filtrage par type de capteur
//   const energieSensors = sensors.filter(s => s.type === 'energie');
//   const dechetSensors = sensors.filter(s => s.type === 'dechet');
//   const transportSensors = sensors.filter(s => s.type === 'transport');
//   const securiteSensors = sensors.filter(s => s.type === 'securite');
  
//   const totalSensors = sensors.length;
//   const operationalPercentage = Math.round((operationalSensors.length / totalSensors) * 100);
//   const warningPercentage = Math.round((warningSensors.length / totalSensors) * 100);
//   const failedPercentage = Math.round((failedSensors.length / totalSensors) * 100);
//   const maintenancePercentage = Math.round((maintenanceSensors.length / totalSensors) * 100);
  
//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value) {
//       toast({
//         title: "Recherche en cours",
//         description: "Filtrage des capteurs en fonction de votre recherche...",
//       });
//     }
//   };

//   const handleStatusChange = (sensorId, newStatus) => {
//     setSensors(sensors.map(sensor => 
//       sensor.id === sensorId ? { ...sensor, status: newStatus } : sensor
//     ));
    
//     const statusText = {
//       operational: 'opérationnel',
//       warning: 'en avertissement',
//       failed: 'en panne',
//       maintenance: 'en maintenance'
//     }[newStatus];
    
//     toast({
//       title: `État du capteur mis à jour`,
//       description: `Le capteur a été marqué comme ${statusText}.`,
//     });
//   };
  
//   const filteredSensors = sensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredOperationalSensors = operationalSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredWarningSensors = warningSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredFailedSensors = failedSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredMaintenanceSensors = maintenanceSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   // Filtrage des capteurs par type
//   const filteredEnergieSensors = energieSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredDechetSensors = dechetSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredTransportSensors = transportSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredSecuriteSensors = securiteSensors.filter(sensor => 
//     sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     sensor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     sensor.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Fonction pour afficher le pourcentage et les dernières mesures spécifiques au type de capteur
//   const renderSensorSpecificData = (sensor) => {
//     const lastUpdate = sensor.dernier_mise_a_jour ? formatDate(sensor.dernier_mise_a_jour) : 'N/A';
    
//     switch (sensor.type) {
//       case 'energie':
//         return (
//           <div>
//             <div className="text-sm text-muted-foreground mb-1">
//               Seuil: {sensor.seuilConsomation} kWh | Dernière mise à jour: {lastUpdate}
//             </div>
//             <Progress value={sensor.pourcentage} className="h-2" />
//           </div>
//         );
//       case 'dechet':
//         return (
//           <div>
//             <div className="text-sm text-muted-foreground mb-1">
//               Remplissage: {sensor.niveaux_remplissage}% | Dernière mise à jour: {lastUpdate}
//             </div>
//             <Progress value={sensor.niveaux_remplissage} className="h-2" />
//           </div>
//         );
//       case 'transport':
//         return (
//           <div>
//             <div className="text-sm text-muted-foreground mb-1">
//               Flux: {sensor.fluxActuelle} véhicules/h | Dernière mise à jour: {lastUpdate}
//             </div>
//             <Progress value={sensor.pourcentage} className="h-2" />
//           </div>
//         );
//       case 'securite':
//         return (
//           <div>
//             <div className="text-sm text-muted-foreground mb-1">
//               Anomalies: {sensor.anomalieDetection} | Dernière mise à jour: {lastUpdate}
//             </div>
//             <Progress value={sensor.pourcentage} className="h-2" />
//           </div>
//         );
//       default:
//         return (
//           <div>
//             <div className="text-sm text-muted-foreground mb-1">
//               État: {sensor.pourcentage}% | Dernière mise à jour: {lastUpdate}
//             </div>
//             <Progress value={sensor.pourcentage} className="h-2" />
//           </div>
//         );
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Gestion des Capteurs</h1>
//         <p className="text-muted-foreground mt-1">Surveillez et gérez l'état des capteurs du système.</p>
//       </div>
      
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>État du Système</CardTitle>
//           <CardDescription>Aperçu de la santé globale du système deonomous capteurs</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium">Santé globale du système</span>
//                 <span className="text-sm font-medium">{operationalPercentage}%</span>
//               </div>
//               <Progress value={operationalPercentage} className="h-2 mb-6" />
              
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm flex items-center text-tech-green">
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Opérationnels
//                     </span>
//                     <Badge variant="outline" className="text-tech-green">
//                       {operationalSensors.length} / {totalSensors}
//                     </Badge>
//                   </div>
//                   <Progress value={operationalPercentage} className="h-1.5 bg-gray-100 [&>div]:bg-tech-green" />
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm flex items-center text-tech-yellow">
//                       <AlertTriangle className="h-4 w-4 mr-2" />
//                       Avertissement
//                     </span>
//                     <Badge variant="outline" className="text-tech-yellow">
//                       {warningSensors.length} / {totalSensors}
//                     </Badge>
//                   </div>
//                   <Progress value={warningPercentage} className="h-1.5 bg-gray-100 [&>div]:bg-tech-yellow" />
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm flex items-center text-tech-red">
//                       <AlertTriangle className="h-4 w-4 mr-2" />
//                       En panne
//                     </span>
//                     <Badge variant="outline" className="text-tech-red">
//                       {failedSensors.length} / {totalSensors}
//                     </Badge>
//                   </div>
//                   <Progress value={failedPercentage} className="h-1.5 bg-gray-100 [&>div]:bg-tech-red" />
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm flex items-center text-tech-blue">
//                       <Wrench className="h-4 w-4 mr-2" />
//                       En maintenance
//                     </span>
//                     <Badge variant="outline" className="text-tech-blue">
//                       {maintenanceSensors.length} / {totalSensors}
//                     </Badge>
//                   </div>
//                   <Progress value={maintenancePercentage} className="h-1.5 bg-gray-100 [&>div]:bg-tech-blue" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <Card className="glass-morphism">
//                 <CardContent className="p-4">
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <div className="h-12 w-12 rounded-full bg-tech-green/20 flex items-center justify-center mb-2">
//                       <CheckCircle className="h-6 w-6 text-tech-green" />
//                     </div>
//                     <p className="text-sm font-medium text-muted-foreground">Opérationnels</p>
//                     <h2 className="text-2xl font-bold text-tech-green">{operationalSensors.length}</h2>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card className="glass-morphism">
//                 <CardContent className="p-4">
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <div className="h-12 w-12 rounded-full bg-tech-yellow/20 flex items-center justify-center mb-2">
//                       <AlertTriangle className="h-6 w-6 text-tech-yellow" />
//                     </div>
//                     <p className="text-sm font-medium text-muted-foreground">Avertissement</p>
//                     <h2 className="text-2xl font-bold text-tech-yellow">{warningSensors.length}</h2>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card className="glass-morphism">
//                 <CardContent className="p-4">
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <div className="h-12 w-12 rounded-full bg-tech-red/20 flex items-center justify-center mb-2">
//                       <AlertTriangle className="h-6 w-6 text-tech-red" />
//                     </div>
//                     <p className="text-sm font-medium text-muted-foreground">En panne</p>
//                     <h2 className="text-2xl font-bold text-tech-red">{failedSensors.length}</h2>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card className="glass-morphism">
//                 <CardContent className="p-4">
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <div className="h-12 w-12 rounded-full bg-tech-blue/20 flex items-center justify-center mb-2">
//                       <Wrench className="h-6 w-6 text-tech-blue" />
//                     </div>
//                     <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
//                     <h2 className="text-2xl font-bold text-tech-blue">{maintenanceSensors.length}</h2>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="pb-0">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <CardTitle>Liste des Capteurs</CardTitle>
//               <CardDescription>Aperçu détaillé de tous les capteurs du système</CardDescription>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Rechercher par nom, type, lieu..."
//                   className="pl-8 w-full md:w-[250px] lg:w-[350px]"
//                   value={searchQuery}
//                   onChange={handleSearch}
//                 />
//               </div>
              
//               <Button variant="outline" size="icon">
//                 <Filter className="h-4 w-4" />
//               </Button>
              
//               <Button variant="outline" size="icon" onClick={() => setSensors(mockSensors)}>
//                 <RotateCw className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="pt-6">
//           <Tabs defaultValue="all" className="w-full">
//             <TabsList className="mb-4 flex flex-wrap">
//               <TabsTrigger value="all" className="flex items-center">
//                 <Cpu className="h-4 w-4 mr-2" />
//                 <span>Tous ({filteredSensors.length})</span>
//               </TabsTrigger>
//               <TabsTrigger value="operational" className="flex items-center">
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 <span>Opérationnels ({filteredOperationalSensors.length})</span>
//               </TabsTrigger>
//               <TabsTrigger value="warning" className="flex items-center">
//                 <AlertTriangle className="h-4 w-4 mr-2" />
//                 <span>Avertissement ({filteredWarningSensors.length})</span>
//               </TabsTrigger>
//               <TabsTrigger value="failed" className="flex items-center">
//                 <AlertTriangle className="h-4 w-4 mr-2" />
//                 <span>En panne ({filteredFailedSensors.length})</span>
//               </TabsTrigger>
//               <TabsTrigger value="maintenance" className="flex items-center">
//                 <Wrench className="h-4 w-4 mr-2" />
//                 <span>Maintenance ({filteredMaintenanceSensors.length})</span>
//               </TabsTrigger>
//             </TabsList> 
            
//             <TabsContent value="all">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredSensors.length === 0 ? (
//                   <div className="col-span-3 text-center py-8 text-muted-foreground">
//                     Aucun capteur ne correspond à votre recherche
//                   </div>
//                 ) : (
//                   filteredSensors.map((sensor) => (
//                     <SensorStatus 
//                       key={sensor.id} 
//                       sensor={sensor} 
//                       onStatusChange={handleStatusChange}
//                       renderSensorSpecificData={() => renderSensorSpecificData(sensor)}
//                     />
//                   ))
//                 )}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="operational">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredOperationalSensors.length === 0 ? (
//                   <div className="col-span-3 text-center py-8 text-muted-foreground">
//                     Aucun capteur opérationnel ne correspond à votre recherche
//                   </div>
//                 ) : (
//                   filteredOperationalSensors.map((sensor) => (
//                     <SensorStatus 
//                       key={sensor.id} 
//                       sensor={sensor} 
//                       onStatusChange={handleStatusChange}
//                       renderSensorSpecificData={() => renderSensorSpecificData(sensor)}
//                     />
//                   ))
//                 )}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="warning">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredWarningSensors.length === 0 ? (
//                   <div className="col-span-3 text-center py-8 text-muted-foreground">
//                     Aucun capteur en avertissement ne correspond à votre recherche
//                   </div>
//                 ) : (
//                   filteredWarningSensors.map((sensor) => (
//                     <SensorStatus 
//                       key={sensor.id} 
//                       sensor={sensor} 
//                       onStatusChange={handleStatusChange}
//                       renderSensorSpecificData={() => renderSensorSpecificData(sensor)}
//                     />
//                   ))
//                 )}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="failed">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredFailedSensors.length === 0 ? (
//                   <div className="col-span-3 text-center py-8 text-muted-foreground">
//                     Aucun capteur en panne ne correspond à votre recherche
//                   </div>
//                 ) : (
//                   filteredFailedSensors.map((sensor) => (
//                     <SensorStatus 
//                       key={sensor.id} 
//                       sensor={sensor} 
//                       onStatusChange={handleStatusChange}
//                       renderSensorSpecificData={() => renderSensorSpecificData(sensor)}
//                     />
//                   ))
//                 )}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="maintenance">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredMaintenanceSensors.length === 0 ? (
//                   <div className="col-span-3 text-center py-8 text-muted-foreground">
//                     Aucun capteur en maintenance ne correspond à votre recherche
//                   </div>
//                 ) : (
//                   filteredMaintenanceSensors.map((sensor) => (
//                     <SensorStatus 
//                       key={sensor.id} 
//                       sensor={sensor} 
//                       onStatusChange={handleStatusChange}
//                       renderSensorSpecificData={() => renderSensorSpecificData(sensor)}
//                     />
//                   ))
//                 )}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default Sensors; 