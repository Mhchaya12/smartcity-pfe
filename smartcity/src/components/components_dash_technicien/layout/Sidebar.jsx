import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Home, 
  Cpu,
  CalendarClock
} from 'lucide-react';

export const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/technicien', icon: <Home size={24} />, label: 'Tableau de bord' },
    { path: '/technicien/sensors', icon: <Cpu size={24} />, label: 'Capteurs' },
    { path: '/technicien/alerts', icon: <Bell size={24} />, label: 'Alertes' },
   
    { path: '/technicien/maintenance', icon: <CalendarClock size={24} />, label: 'Maintenance' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-30 h-screen bg-[#162234] text-[#e0e6ed]
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-[rgba(255,255,255,0.05)]
                shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex flex-col
                ${isOpen ? 'w-[260px]' : 'w-[70px]'}`}
    >
      <div className="flex items-center justify-between h-16 px-5 border-b border-[rgba(255,255,255,0.05)] mb-3">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="flex-shrink-0">
            <div className="bg-[#0070d8] h-9 w-9 rounded-[10px] flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
          </div>
          {isOpen && (
            <h2 className="text-xl font-bold text-white transition-opacity duration-300 whitespace-nowrap">
              SmartCity
            </h2>
          )}
        </div>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative flex items-center px-4 py-3 text-sm rounded-[10px] transition-all duration-300
                            group ${isOpen ? 'gap-3' : 'justify-center'}
                            ${isActive 
                              ? 'bg-[#0070d8] text-white' 
                              : 'text-[#e0e6ed] hover:bg-[rgba(255,255,255,0.08)]'}
                            before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]
                            before:bg-[#0070d8] before:transition-transform before:duration-300
                            ${isActive ? 'before:scale-y-100' : 'before:scale-y-0 hover:before:scale-y-60'}`}
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</span>
                  {isOpen && (
                    <span className="transition-opacity duration-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {!isOpen && (
                    <span className="absolute left-[70px] bg-[#1a2a44] text-[#e0e6ed] px-3 py-2 rounded-[10px]
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                  shadow-[0_3px_10px_rgba(0,0,0,0.2)] z-[100] whitespace-nowrap pointer-events-none">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-[rgba(255,255,255,0.05)] p-4">
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <div className="h-9 w-9 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#0070d8] font-semibold text-sm">
            <span>TT</span>
          </div>
          {isOpen && (
            <div className="ml-3 transition-opacity duration-300 whitespace-nowrap">
              <p className="text-sm font-semibold text-white">Tech Technicien</p>
              <p className="text-xs text-[#a9b8d5]">Technicien</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;