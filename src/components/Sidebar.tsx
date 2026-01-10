import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'OWNER';
  const isStaff = role === 'STAFF';

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/tables', label: 'Tables', icon: '🍽️', staffAccess: true },
    { path: '/kitchen-orders', label: 'Kitchen Orders', icon: '👨‍🍳', staffAccess: true },
    { path: '/menu', label: 'Menu', icon: '📋', staffAccess: true },
    { path: '/staff', label: 'Staff', icon: '👥', staffAccess: false },
    { path: '/invoices', label: 'Invoices', icon: '📄', staffAccess: false },
    { path: '/reports', label: 'Reports', icon: '📊', staffAccess: false },
    { path: '/order-rolls', label: 'Order Rolls', icon: '🧻', staffAccess: false },
    { path: '/subscription', label: 'Subscription', icon: '💳', staffAccess: false },
    { path: '/settings', label: 'Settings', icon: '⚙️', staffAccess: false },
  ];

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b bg-green-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            BB
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">BillBharat</h1>
            <p className="text-xs text-gray-600">Restaurant POS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (isStaff && !item.staffAccess) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-700 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
        >
          <span className="text-2xl">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
