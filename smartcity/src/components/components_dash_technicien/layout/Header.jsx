import React from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { alerts } from '@/data/mockData';

export const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { toast } = useToast();
  const unreadAlerts = alerts.filter(alert => !alert.resolved).length;

  const handleBellClick = () => {
    toast({
      title: "Nouvelles alertes",
      description: `Vous avez ${unreadAlerts} alertes non résolues.`,
      duration: 3000,
    });
  };

  return (
    <header className="bg-background h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 z-20 glass-morphism backdrop-blur-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-secondary smooth-transition"
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 rounded-md bg-secondary w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 smooth-transition"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="relative p-2 rounded-md hover:bg-secondary smooth-transition"
          onClick={handleBellClick}
        >
          <Bell className="h-5 w-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-tech-red text-white text-xs rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
              {unreadAlerts}
            </span>
          )}
        </button>
        
        <div className="h-8 w-8 rounded-full bg-tech-blue text-white flex items-center justify-center">
          <span className="text-sm font-medium">TT</span>
        </div>
      </div>
    </header>
  );
}; 