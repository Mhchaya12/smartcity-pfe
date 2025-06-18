// File: src/App.js
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/components_dash_technicien/ui/toaster';
import { useToast } from './hooks/use-toast';

import Index from './pages/pages_dash_technicien/Index';
import Alerts from './pages/pages_dash_technicien/Alerts';
import Maintenance from './pages/pages_dash_technicien/Maintenance';
import NotFound from './pages/pages_dash_technicien/NotFound';
import Dashboard from './pages/pages_dash_admin/Dashboard';
import Alertsad from './pages/pages_dash_admin/Alerts_ad';
import Users from './pages/pages_dash_admin/Users';
import Configuration from './pages/pages_dash_admin/Configuration';

import HomePages from './pages/pages_home/HomesPages';
import AuthPage from './pages/pages_home/AuthPage';

import AnalysteDashboard from './pages/pages_dash_analyste/Dashboard';
import PerformanceReportsPage from './pages/pages_dash_analyste/PerformanceReportsPage';

import DataTrends from './components/components_dash_analyste/DataTrends/DataTrends';
import WasteLevelAnalysis from './components/components_dash_analyste/WasteLevelAnalysis/WasteLevelAnalysis';

import './styles/hom_authen.css';
import './styles/global.css';
const socket = io("http://localhost:5050");

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  if (!userInfo.token) {
    return <Navigate to="/auth" />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [energie, setEnergie] = React.useState([]);
  const [dechets, setDechets] = React.useState([]);
  const [transport, setTransport] = React.useState([]);
  const [securite, setSecurite] = React.useState([]);
  
  useToast();
  useEffect(() => {
    socket.on('updateEnergie', (data) => {
      console.log('Received updateEnergie:', data);
      setEnergie(data);
    });
    socket.on('updateDechets', (data) => {
      console.log('Received updateDechets:', data);
      setDechets(data);
    });
    socket.on('updateTransport', (data) => {
      console.log('Received updateTransport:', data);
      setTransport(data);
    });
    socket.on('updateSecurite', (data) => {
      console.log('Received updateSecurite:', data);
      setSecurite(data);
    });

    // Cleanup function
    return () => {
      socket.off('updateEnergie');
      socket.off('updateDechets');
      socket.off('updateTransport');
      socket.off('updateSecurite');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Routes protégées pour l'administrateur */}
        <Route path="/da" element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <Dashboard 
              energie={energie[0]} 
              dechets={dechets[0]} 
              transport={transport[0]} 
              securite={securite[0]} 
            />
          </ProtectedRoute>
        } />
        <Route path="/alertsad" element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <Alertsad />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/configuration" element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <Configuration />
          </ProtectedRoute>
        } />

        {/* Routes protégées pour l'analyste */}
        <Route path="/dl" element={
          <ProtectedRoute allowedRoles={['analyst']}>
            <AnalysteDashboard
            energie={energie[0]} 
            dechets={dechets[0]} 
            transport={transport[0]} 
            securite={securite[0]} />
          </ProtectedRoute>
        } />
        <Route path="/rapport" element={
          <ProtectedRoute allowedRoles={['analyst']}>
            <PerformanceReportsPage
            energie={energie[0]} 
            dechets={dechets[0]} 
            transport={transport[0]} 
            securite={securite[0]} />
          </ProtectedRoute>
        } />

        {/* Routes protégées pour le technicien */}
        <Route path="/technicien" element={
          <ProtectedRoute allowedRoles={['technicien']}>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/technicien/alerts" element={
          <ProtectedRoute allowedRoles={['technicien']}>
            <Alerts />
          </ProtectedRoute>
        } />
        <Route path="/technicien/maintenance" element={
          <ProtectedRoute allowedRoles={['technicien']}>
            <Maintenance energie={energie[0]} 
              dechets={dechets[0]} 
              transport={transport[0]} 
              securite={securite[0]}  />
          </ProtectedRoute>
        } />
        {/* <Route path="/technicien/map" element={
          <ProtectedRoute allowedRoles={['technicien']}>
            <LeafletMapComponent />
          </ProtectedRoute>
        } /> */}
        <Route path="/technicien/*" element={
          <ProtectedRoute allowedRoles={['technicien']}>
            <NotFound />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;