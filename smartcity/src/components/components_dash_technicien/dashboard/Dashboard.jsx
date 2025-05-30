import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertList } from './AlertList';

import { activeAlerts, resolvedAlerts } from '../../../data/adminData';


const Dashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Alertes Actives</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertList alerts={activeAlerts} />
        </CardContent>
      </Card>

      

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Alertes Résolues</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertList alerts={resolvedAlerts} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 