import React, { useState, useEffect } from 'react';
import { FiDownload, FiAlertTriangle, FiCheckCircle, FiInfo, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const SecurityLogs = () => {
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
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch security logs', { description: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'SIGNUP':
      case 'VERIFY_USER':
      case 'ADD_MEMBERS_TO_GROUP':
      case 'CREATE_GROUP':
        return <FiCheckCircle className="text-green-400" />;
      case 'DELETE_USER':
      case 'REMOVE_MEMBER_FROM_GROUP':
        return <FiAlertTriangle className="text-red-400" />;
      default:
        return <FiInfo className="text-blue-400" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'SIGNUP':
      case 'VERIFY_USER':
      case 'ADD_MEMBERS_TO_GROUP':
      case 'CREATE_GROUP':
        return 'bg-green-900/50 text-green-300 border border-green-700';
      case 'DELETE_USER':
      case 'REMOVE_MEMBER_FROM_GROUP':
        return 'bg-red-900/50 text-red-300 border border-red-700';
      default:
        return 'bg-blue-900/50 text-blue-300 border border-blue-700';
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Username', 'Action', 'Target', 'Timestamp'],
      ...logs.map(log => [
        log._id,
        log.username,
        log.action,
        log.target || 'N/A',
        log.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Security logs exported successfully');
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FiAlertTriangle className="mr-3 text-orange-400" />
            Security Logs
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-300">Loading security logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FiAlertTriangle className="mr-3 text-orange-400" />
            Security Logs
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <FiX className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-400 text-lg font-medium">Error loading security logs</p>
          <p className="text-gray-300 mt-2">{error}</p>
          <button
            onClick={fetchLogs}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FiAlertTriangle className="mr-3 text-orange-400" />
          Security Logs
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={exportLogs}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Export Logs
          </button>
          <button
            onClick={fetchLogs}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiCalendar className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
        <p className="text-sm text-gray-300">
          Total Logs: <span className="font-semibold text-white">{logs.length}</span>
          {logs.length > 0 && (
            <>
              {' | '}Last Updated: <span className="font-semibold text-white">
                {formatTimestamp(logs[0].timestamp)}
              </span>
            </>
          )}
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiInfo className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-300 text-lg">No security logs found</p>
          <p className="text-gray-400 mt-2">Security activity will appear here when it occurs</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Target
                </th>
                 
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{log.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getActionIcon(log.action)}
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {log.target ? (
                        <span className="font-mono text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded border border-gray-600">
                          {log.target}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </div>
                  </td>
                   
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityLogs;