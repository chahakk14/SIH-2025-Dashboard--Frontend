import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiUserCheck, FiUserX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import VerificationRequests from './VerificationRequests'; 
import ActivityLog from './ActivityLog';
import StatCard from './StatCard'; 

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0, verifiedUsers: 0, unverifiedUsers: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshNeeded, setRefreshNeeded] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
    if(refreshNeeded) {
      setRefreshNeeded(false);
    }
  }, [refreshNeeded]);

  const handleUserAction = () => {
    setRefreshNeeded(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="text-white">Loading dashboard...</div></div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">HQ Command Dashboard</h1>
      
      {error && 
        <div className="flex items-center text-red-300 bg-red-900/40 p-4 rounded-lg shadow-md">
            <FiAlertCircle className="mr-3 h-5 w-5"/> 
            <div>
              <h3 className="font-semibold">An Error Occurred</h3>
              <p className="text-sm">{error}</p>
            </div>
        </div>
      }

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiUsers className="text-blue-400" />} title="Total Users" value={stats.totalUsers} />
        <StatCard icon={<FiShield className="text-purple-400" />} title="Total Groups" value={stats.totalGroups} />
        <StatCard icon={<FiUserCheck className="text-green-400" />} title="Verified Users" value={stats.verifiedUsers} />
        <StatCard icon={<FiUserX className="text-yellow-400" />} title="Unverified Users" value={stats.unverifiedUsers} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Pending Verifications</h2>
          <VerificationRequests onUserVerified={handleUserAction} />
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
            <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
