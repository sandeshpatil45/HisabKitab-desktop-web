import React from 'react';
import { authService } from '../utils/authService';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const user = authService.getUser();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            {user?.firstName || user?.username}
          </p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          {user?.firstName?.[0] || user?.username?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;
