import React, { useState, useEffect } from 'react';
import { FiDownload, FiAlertTriangle, FiCheckCircle, FiInfo, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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
    const intervalId = setInterval(fetchLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all') return false;
    const logDate = new Date(log.timestamp);
    const today = new Date();
    if (dateRange === 'today' && logDate.toDateString() !== today.toDateString()) return false;
    if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      if (logDate < weekAgo) return false;
    }
    if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      if (logDate < monthAgo) return false;
    }
    if (dateRange === 'custom') {
      const startDate = customStartDate ? new Date(customStartDate) : null;
      const endDate = customEndDate ? new Date(customEndDate) : null;
      if (startDate && logDate < startDate) return false;
      if (endDate) {
        endDate.setHours(23, 59, 59);
        if (logDate > endDate) return false;
      }
    }
    return true;
  });

  const exportLogsAsCSV = () => {
    const headers = ['Timestamp', 'Username', 'Action', 'Target'];
    const csvData = [
      headers.join(','),
      ...filteredLogs.map(({ timestamp, username, action, target }) =>
        [timestamp, username, action, `"${(target || '').replace(/"/g, '""')}"`].join(',')
      )
    ].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `security-logs-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Logs exported successfully', { description: 'Security logs have been exported as CSV' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Security Logs</h2>
            <p className="text-gray-400">System activity monitoring and security audit logs</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-300">
              <FiInfo className="mr-1" />
              {filteredLogs.length} Log entries
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all' 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300'
              }`}
            >
              All Logs
            </button>
            <button 
              onClick={() => setFilter('info')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                filter === 'info' 
                ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300'
              }`}
            >
              <FiInfo size={16} />
              Information
            </button>
            <button 
              onClick={() => setFilter('warning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                filter === 'warning' 
                ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300'
              }`}
            >
              <FiAlertTriangle size={16} />
              Warnings
            </button>
            <button 
              onClick={() => setFilter('error')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                filter === 'error' 
                ? 'bg-red-900/40 text-red-300 border border-red-700/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300'
              }`}
            >
              <FiAlertTriangle size={16} />
              Errors
            </button>
          </div> */}
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FiCalendar size={16} />
              {dateRange === 'today' ? 'Today' : 
               dateRange === 'week' ? 'Past Week' : 
               dateRange === 'month' ? 'Past Month' : 
               'Custom Date Range'}
            </button>
            
            <button 
              onClick={exportLogsAsCSV}
              className="px-4 py-2 bg-green-700/30 hover:bg-green-700/50 text-green-400 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FiDownload size={16} />
              Export Logs
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FiAlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Logs</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FiInfo className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Logs Found</h3>
            <p className="text-gray-500 text-sm">No logs match your current filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLogs.map(({ _id, timestamp, username, action, target }) => (
                  <tr key={_id} className="hover:bg-gray-700/30 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {new Date(timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {target || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Date Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <FiCalendar className="mr-3 text-blue-400" />
                Filter by Date
              </h3>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {['today', 'week', 'month'].map((range) => (
                <button 
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setIsFilterModalOpen(false);
                  }}
                  className={`w-full flex justify-between items-center p-3 rounded-xl text-left transition-colors duration-200 ${
                    dateRange === range 
                    ? 'bg-blue-600/30 border border-blue-600/50 text-blue-300' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="font-medium">
                    {range === 'today' ? 'Today' : 
                     range === 'week' ? 'Past 7 Days' : 'Past 30 Days'}
                  </span>
                  {dateRange === range && <FiCheckCircle className="text-blue-400" />}
                </button>
              ))}
              
              <div className={`p-4 rounded-xl transition-colors duration-200 ${
                dateRange === 'custom' 
                ? 'bg-blue-600/30 border border-blue-600/50' 
                : 'bg-gray-700/50 border border-gray-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-300">Custom Date Range</span>
                  <input 
                    type="checkbox" 
                    checked={dateRange === 'custom'}
                    onChange={() => setDateRange(dateRange === 'custom' ? 'today' : 'custom')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-700 focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {['start', 'end'].map((dateType) => (
                    <div key={dateType}>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {dateType === 'start' ? 'Start Date' : 'End Date'}
                      </label>
                      <input 
                        type="date" 
                        value={dateType === 'start' ? customStartDate : customEndDate}
                        onChange={(e) => dateType === 'start' 
                          ? setCustomStartDate(e.target.value) 
                          : setCustomEndDate(e.target.value)
                        }
                        disabled={dateRange !== 'custom'}
                        className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsFilterModalOpen(false)} 
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityLogs;