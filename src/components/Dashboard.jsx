import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiUserCheck, FiUserX, FiAlertCircle } from 'react-icons/fi';
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
        fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/hq/all-users`, { headers }),
        fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/hq/all-groups`, { headers }),
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
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">HQ Command Dashboard</h1>
        
        {/* Skeleton Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700/50 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-md bg-gray-600"></div>
                <div className="h-4 ml-3 bg-gray-600 rounded w-24"></div>
              </div>
              <div className="h-7 bg-gray-600 rounded w-16 mb-1"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-gray-800/70 rounded-2xl shadow-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-gray-700 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-20 h-8 rounded-md bg-gray-600"></div>
                    <div className="w-20 h-8 rounded-md bg-gray-600"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/70 rounded-2xl shadow-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-36 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-5 bg-gray-600 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
