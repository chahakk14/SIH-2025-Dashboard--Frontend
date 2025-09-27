import React from 'react';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    // <header className="fixed w-full bg-gray-800 shadow-md z-30">
    //   <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
    //     {/* Hamburger button for mobile */}
    //     <button
    //       className="text-gray-400 hover:text-white lg:hidden"
    //       onClick={() => setSidebarOpen(!sidebarOpen)}
    //     >
    //       <span className="sr-only">Open sidebar</span>
    //       <FiMenu className="w-6 h-6" />
    //     </button>

    //     {/* Logo and Title */}
    //     <div className="flex items-center space-x-4">
    //         <img src="src/images/logo.png" alt="Sainya Samvaad Logo" className="h-10 w-auto" />
    //         <h1 className="hidden sm:block text-xl font-bold text-white">Sainya Samvaad</h1>
    //     </div>

    //     {/* Search Bar */}
    //     <div className="flex-1 flex justify-center px-4 lg:px-8">
    //       <div className="relative w-full max-w-lg">
    //         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    //           <FiSearch className="text-gray-400" />
    //         </span>
    //         <input
    //           type="text"
    //           placeholder="Search..."
    //           className="w-full py-2 pl-10 pr-4 bg-gray-700 border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //       </div>
    //     </div>

    //     {/* Right side icons */}
    //     <div className="flex items-center space-x-4">
    //       <button className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
    //         <span className="sr-only">View notifications</span>
    //         <FiBell className="h-6 w-6" />
    //       </button>
          
    //       <div className="flex items-center">
    //         <span className="hidden sm:inline text-sm font-medium text-gray-300 mr-3">Admin</span>
    //         <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
    //           <span className="text-xs font-semibold text-white">A</span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </header>
    <></>
  );
};

export default Header;
