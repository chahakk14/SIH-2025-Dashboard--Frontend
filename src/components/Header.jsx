import React from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="src/images/logo.png" alt="Sainya Samvaad Logo" className="h-10 w-7.75" />
        <h1 className="text-xl font-bold text-white">Sainya Samvaad - HQ Command Center</h1>
      </div>
      <div className="flex items-center space-x-10">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-96 py-2 pl-10 pr-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        <div className="flex items-center" style={{ paddingRight: '20px' }}>
          <FiUser className="mr-2 h-5 w-5" />
          <span className="text-s text-gray-300">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
