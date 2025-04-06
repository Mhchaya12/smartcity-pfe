// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/components_dash_technicien/ui/toaster';
import { useToast } from './hooks/use-toast';

import Index from './pages/pages_dash_technicien/Index';
import Alerts from './pages/pages_dash_technicien/Alerts';
import Maintenance from './pages/pages_dash_technicien/Maintenance';
import Sensors from './pages/pages_dash_technicien/Sensors';
import NotFound from './pages/pages_dash_technicien/NotFound';

import Dashboard from './pages/pages_dash_admin/Dashboard';
import Alertsad from './pages/pages_dash_admin/Alerts_ad';
import Users from './pages/pages_dash_admin/Users';
import Configuration from './pages/pages_dash_admin/Configuration';

import HomePages from './pages/pages_home/HomesPages';
import AuthPage from './pages/pages_home/AuthPage';


import AnalysteDashboard from './pages/pages_dash_analyste/Dashboard';
import PerformanceReportsPage from './pages/pages_dash_analyste/PerformanceReportsPage';



import './styles/hom_authen.css';
import './styles/global.css';

function App() {
  useToast();
  return (
    <Router>
      <Routes>
        <Route path="/technicien" element={<Index />} />
        <Route path="/technicien/alerts" element={<Alerts />} />
        <Route path="/technicien/maintenance" element={<Maintenance />} />
        <Route path="/technicien/sensors" element={<Sensors />} />
        <Route path="/technicien/*" element={<NotFound />} />

        <Route path="/" element={<HomePages />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/da" element={<Dashboard />} />
        <Route path="/alertsad" element={<Alertsad />} />
        <Route path="/users" element={<Users />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/dl" element={<AnalysteDashboard/>} />
        <Route path="/rapport" element={<PerformanceReportsPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;