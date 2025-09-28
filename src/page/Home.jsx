import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import UserManagement from '../components/UserManagement';
import GroupManagement from '../components/GroupManagement';
import SecurityLogs from '../components/SecurityLogs';

const Home = ({ handleLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/user-management" element={<UserManagement />} />
                        <Route path="/group-management" element={<GroupManagement />} />
                        <Route path="/security/logs" element={<SecurityLogs />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Home;
