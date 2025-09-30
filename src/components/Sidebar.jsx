import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FiGrid, 
    FiUsers, 
    FiLogOut, 
    FiX, 
    FiActivity
} from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
    const location = useLocation();
    const sidebar = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || sidebar.current.contains(target)) return;
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [sidebarOpen, setSidebarOpen]);

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [sidebarOpen, setSidebarOpen]);

    const menuItems = [
        { icon: <FiGrid />, name: 'Dashboard', path: '/' },
        { icon: <FiUsers />, name: 'User Management', path: '/user-management' },
        { icon: <FiUsers />, name: 'Group Management', path: '/group-management' },
        { icon: <FiActivity />, name: 'Security Logs', path: '/security/logs' },
        // { icon: <FiBarChart2 />, name: 'System Status', path: '/status' },
        // { icon: <FiSettings />, name: 'Settings', path: '/settings' },
    ];

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-800 duration-300 ease-linear lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
                <Link to="/" className="flex items-center space-x-3">
                    <img src="src/images/logo.png" alt="Suraksha Vaarta Logo" className="h-12 w-auto" />
                    <span className="text-xl font-semibold text-white">Suraksha Vaarta</span>
                </Link>

                <button
                    className="block lg:hidden text-gray-400 hover:text-white"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <FiX className="w-6 h-6" />
                </button>
            </div>

            {/* <!-- SIDEBAR MENU --> */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:px-6">
                    <div>
                        <h3 className="mb-4 ml-4 text-xs font-semibold text-gray-400 uppercase">MENU</h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-gray-300 duration-200 ease-in-out hover:bg-blue-600 hover:text-white ${
                                            (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) && 'bg-blue-700 text-white'
                                        }`}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>

            {/* <!-- SIDEBAR FOOTER --> */}
            <div className="mt-auto p-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout} 
                    className="flex w-full items-center gap-3 rounded-md py-2 px-4 font-medium text-gray-300 duration-200 ease-in-out hover:bg-red-600 hover:text-white"
                >
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
