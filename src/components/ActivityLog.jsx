import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/all-logs`, {
        method: 'GET',
        headers: { "content-type": 'application/json' }
      });
      const data = await response.json();
      // Get only the latest 10 logs for activity display
      const recentLogs = Array.isArray(data.logs) ? data.logs.reverse().slice(0, 4) : [];
      setLogs(recentLogs);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch activity logs', { description: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    // Convert UTC to UTC+05:30 (IST)
    const date = new Date(timestamp);
    // Add 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
    return istDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAlertAction = (action) => {
    return ['DELETE_USER', 'REMOVE_MEMBER_FROM_GROUP'].includes(action);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 text-sm">Failed to load activity</p>
        <button 
          onClick={fetchLogs}
          className="text-blue-400 text-xs mt-1 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log._id} className="text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium text-white">{log.username}</span>
            {' '}
            <span className={isAlertAction(log.action) ? 'text-red-400 font-medium' : 'text-gray-300'}>
              {formatAction(log.action).toLowerCase()}
            </span>
            {log.target && (
              <>
                {' '}
                <span className="text-gray-400">→</span>
                {' '}
                <span className="text-blue-400 font-mono text-xs">
                  {log.target}
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
