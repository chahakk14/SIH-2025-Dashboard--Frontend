import React from 'react';
import { FiGrid, FiUsers, FiShield, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ handleLogout }) => {
  const menuItems = [
    { icon: <FiGrid />, name: 'Dashboard' },
    { icon: <FiUsers />, name: 'User Management' },
    { icon: <FiUsers />, name: 'Group Management' },
    { icon: <FiShield />, name: 'Security & Logs' },
    { icon: <FiBarChart2 />, name: 'System Status' },
    { icon: <FiSettings />, name: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gray-800 flex flex-col fixed top-20 left-0 bottom-0">
      <nav className="flex-1 px-4 py-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href="#"
                className={`flex items-center p-3 rounded-lg text-gray-300 hover:bg-yellow-600 hover:text-white transition-colors duration-200 ${
                  item.name === 'Dashboard' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
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