import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ActivityLog from './ActivityLog';
import VerificationRequests from './VerificationRequests';

const Dashboard = () => {
  const [lastLoginTime, setLastLoginTime] = useState('');

  useEffect(() => {
    const storedLoginTime = localStorage.getItem("lastLoginTime");
    if (storedLoginTime) {
      setLastLoginTime(storedLoginTime);
    }
  }, []);

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-white">Welcome, Admin!</h1>
        <p className="text-gray-400">Last Login: {lastLoginTime}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="TOTAL ACTIVE USERS" value="12,500" dailyChange="+50 daily" />
        <StatCard title="PENDING VERIFICATIONS" value="12">
          <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
            REVIEW NOW
          </button>
        </StatCard>
        <StatCard title="VPN GATEWAY STATUS" value="ONLINE" valueColor="text-green-400">
           <div className="text-sm text-gray-400">3,800 Active Tunnels</div>
        </StatCard>
      </div>

      {/* Activity and Verification Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityLog />
        <VerificationRequests />
      </div>
    </div>
  );
};

export default Dashboard;