import { authService } from '../utils/authService';

const Header = () => {
  const user = authService.getUser();
  const username = localStorage.getItem('username') || user?.username || 'User';
  const role = localStorage.getItem('role') || user?.role || 'OWNER';
  const shopName = localStorage.getItem('shopName') || 'My Restaurant';

  return (
    <header className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">{shopName}</h2>
        <p className="text-sm text-green-100">Offline - Billing Works</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{username}</p>
          <p className="text-xs text-green-100">{role}</p>
        </div>
        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
