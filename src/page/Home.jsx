import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import UserManagement from "../components/UserManagement";
import GroupManagement from "../components/GroupManagement";

const Home = ({ handleLogout }) => {

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
            <Header />
            <div className="flex pt-20">
                <Sidebar handleLogout={handleLogout} />
                <main className="flex-1 p-6 ml-64">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/user-management" element={<UserManagement />} />
                        <Route path="/group-management" element={<GroupManagement />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default Home;