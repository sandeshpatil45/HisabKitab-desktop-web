export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || 'User';
  const role = user.role || 'OWNER';
  const shopName = localStorage.getItem('shopName') || user.restaurantName || 'My Restaurant';

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div>
        <h2 className="text-2xl font-bold">{shopName}</h2>
        <p className="text-sm text-green-100 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
          Offline - Billing Works
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{username}</p>
          <p className="text-xs text-green-200 px-2 py-1 bg-green-800 bg-opacity-50 rounded-full inline-block">
            {role}
          </p>
        </div>
        <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
