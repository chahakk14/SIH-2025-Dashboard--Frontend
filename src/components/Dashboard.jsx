import React, { useState, useEffect } from 'react';
import { FiUsers, FiLayers, FiUserCheck, FiUserX, FiAlertCircle } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex items-center`}>
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0, verifiedUsers: 0, unverifiedUsers: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` };
        
        const [usersResponse, groupsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/hq/all-users', { headers }),
          fetch('http://localhost:8000/api/hq/all-groups', { headers }),
        ]);

        if (!usersResponse.ok) throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
        if (!groupsResponse.ok) throw new Error(`Failed to fetch groups: ${groupsResponse.statusText}`);

        const usersData = await usersResponse.json();
        const groupsData = await groupsResponse.json();

        const totalUsers = Array.isArray(usersData.users) ? usersData.users.length : 0;
        const verifiedUsers = Array.isArray(usersData.users) ? usersData.users.filter(u => u.is_verified).length : 0;

        setStats({
          totalUsers,
          totalGroups: Array.isArray(groupsData.groups) ? groupsData.groups.length : 0,
          verifiedUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">HQ Dashboard</h2>
      {error && 
        <div className="flex items-center text-red-400 bg-red-900/50 p-3 rounded-lg mb-6">
            <FiAlertCircle className="mr-2"/> {`Error: ${error}`}
        </div>
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiUsers size={24} />} title="Total Users" value={stats.totalUsers} color="bg-blue-500/80" />
        <StatCard icon={<FiLayers size={24} />} title="Total Groups" value={stats.totalGroups} color="bg-purple-500/80" />
        <StatCard icon={<FiUserCheck size={24} />} title="Verified Users" value={stats.verifiedUsers} color="bg-green-500/80" />
        <StatCard icon={<FiUserX size={24} />} title="Unverified Users" value={stats.unverifiedUsers} color="bg-yellow-500/80" />
      </div>
    </div>
  );
};

export default Dashboard;