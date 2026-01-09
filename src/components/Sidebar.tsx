import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../utils/authService';
import { roleCheck } from '../utils/roleCheck';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/tables', label: 'Tables', icon: '🍽️', show: true },
    { path: '/menu', label: 'Menu', icon: '📋', show: true },
    { path: '/staff', label: 'Staff', icon: '👥', show: roleCheck.canManageStaff() },
    { path: '/invoices', label: 'Invoices', icon: '📄', show: roleCheck.canManageBilling() },
    { path: '/reports', label: 'Reports', icon: '📊', show: roleCheck.canAccessReports() },
    { path: '/order-rolls', label: 'Order Rolls', icon: '🧻', show: roleCheck.canManageBilling() },
    { path: '/subscription', label: 'Subscription', icon: '💳', show: roleCheck.isOwner() },
    { path: '/settings', label: 'Settings', icon: '⚙️', show: true },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            BB
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">BillBharat</h1>
            <p className="text-xs text-gray-500">Restaurant POS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          if (!item.show) return null;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive(item.path) ? 'bg-primary bg-opacity-10 border-r-4 border-primary text-primary font-semibold' : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded"
        >
          <span className="text-xl mr-3">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
