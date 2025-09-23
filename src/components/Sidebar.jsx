import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiShield, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ handleLogout }) => {
  const location = useLocation();
  const menuItems = [
    { icon: <FiGrid />, name: 'Dashboard', path: '/' },
    { icon: <FiUsers />, name: 'User Management', path: '/user-management' },
    { icon: <FiUsers />, name: 'Group Management', path: '/group-management' },
    { icon: <FiShield />, name: 'Security & Logs', path: '/security' },
    { icon: <FiBarChart2 />, name: 'System Status', path: '/status' },
    { icon: <FiSettings />, name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-gray-800 flex flex-col fixed top-20 left-0 bottom-0">
      <nav className="flex-1 px-4 py-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg text-gray-300 hover:bg-yellow-600 hover:text-white transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <a href="#" onClick={handleLogout} className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200">
          <FiLogOut className="mr-3 text-lg" />
          Logout
        </a>
      </div>
    </div>
  );
};

export default Sidebar;