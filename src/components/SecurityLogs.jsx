import React, { useState, useEffect } from 'react';
import { FiDownload, FiAlertTriangle, FiCheckCircle, FiInfo, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'sonner';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, warnings, errors, info
  const [dateRange, setDateRange] = useState('today'); // today, week, month, custom
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Sample log data (replace with API fetch)
  const sampleLogs = [
    { 
      id: 1, 
      timestamp: '2025-09-26 09:45:10', 
      level: 'error', 
      source: 'auth',
      message: "Failed login attempt for user 'alpha_ops' from IP 192.168.1.105",
      details: "Multiple failed attempts detected. Account temporarily locked.",
      user: "System"
    },
    { 
      id: 2, 
      timestamp: '2025-09-26 09:43:15', 
      level: 'warning', 
      source: 'security',
      message: "Screenshot attempt detected from user 'charlie_team'",
      details: "User attempted to capture sensitive information",
      user: "charlie_team"
    },
    { 
      id: 3, 
      timestamp: '2025-09-26 09:40:22', 
      level: 'info', 
      source: 'admin',
      message: "New group 'Ops_Control_Room' created",
      details: "Group created with 3 initial members",
      user: "Lt. Anand Sharma"
    },
    { 
      id: 4, 
      timestamp: '2025-09-26 08:32:10', 
      level: 'info', 
      source: 'system',
      message: "System backup completed successfully",
      details: "Full backup completed in 3m 42s",
      user: "System"
    },
    { 
      id: 5, 
      timestamp: '2025-09-25 17:22:01', 
      level: 'warning', 
      source: 'network',
      message: "High network traffic detected",
      details: "Traffic spike of 2.3GB/s for 45 seconds",
      user: "System"
    },
    { 
      id: 6, 
      timestamp: '2025-09-25 16:05:33', 
      level: 'info', 
      source: 'user',
      message: "User 'maj_singh' password changed",
      details: "Password changed using account recovery",
      user: "maj_singh"
    },
    { 
      id: 7, 
      timestamp: '2025-09-25 15:12:40', 
      level: 'error', 
      source: 'database',
      message: "Database connection failure",
      details: "Connection to primary database lost for 12 seconds",
      user: "System"
    },
    { 
      id: 8, 
      timestamp: '2025-09-25 14:01:22', 
      level: 'info', 
      source: 'messages',
      message: "Bulk message sent to 'Field_Ops' group",
      details: "Priority message sent to 42 recipients",
      user: "Command_HQ"
    },
    { 
      id: 9, 
      timestamp: '2025-09-25 12:45:08', 
      level: 'warning', 
      source: 'api',
      message: "Rate limit exceeded for map data API",
      details: "Too many requests in 5-minute window",
      user: "tactical_view_1"
    },
    { 
      id: 10, 
      timestamp: '2025-09-25 10:33:59', 
      level: 'info', 
      source: 'auth',
      message: "New admin user 'col_patel' created",
      details: "Full system access granted",
      user: "System Admin"
    },
    { 
      id: 11, 
      timestamp: '2025-09-24 23:15:44', 
      level: 'error', 
      source: 'security',
      message: "Unauthorized access attempt to restricted documents",
      details: "Access blocked, security alert generated",
      user: "bravo_team_member"
    },
    { 
      id: 12, 
      timestamp: '2025-09-24 18:20:37', 
      level: 'info', 
      source: 'system',
      message: "System updates applied successfully",
      details: "17 security patches applied",
      user: "System"
    }
  ];

  // Fetch logs from API
  useEffect(() => {
    setLoading(true);
    try {
      // Using sample data for demo
      setTimeout(() => {
        setLogs(sampleLogs);
        setLoading(false);
      }, 800);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error('Failed to fetch security logs', {
        description: error.message,
      });
    }
  }, []);

  // Apply filters
  const filteredLogs = logs.filter(log => {
    // Filter by log level
    if (filter !== 'all' && log.level !== filter) return false;
    
    // Filter by date
    const logDate = new Date(log.timestamp);
    const today = new Date();
    
    if (dateRange === 'today') {
      if (logDate.toDateString() !== today.toDateString()) return false;
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      if (logDate < weekAgo) return false;
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      if (logDate < monthAgo) return false;
    } else if (dateRange === 'custom') {
      const startDate = customStartDate ? new Date(customStartDate) : null;
      const endDate = customEndDate ? new Date(customEndDate) : null;
      
      if (startDate && logDate < startDate) return false;
      if (endDate) {
        // Set end date to end of day
        endDate.setHours(23, 59, 59);
        if (logDate > endDate) return false;
      }
    }
    
    return true;
  });

  // Export logs as CSV
  const exportLogsAsCSV = () => {
    const headers = ['Timestamp', 'Level', 'Source', 'Message', 'Details', 'User'];
    const csvData = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.source,
        `"${log.message.replace(/"/g, '""')}"`,
        `"${log.details.replace(/"/g, '""')}"`,
        log.user
      ].join(','))
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
    
    toast.success('Logs exported successfully', {
      description: 'Security logs have been exported as CSV',
    });
  };

  // Get the appropriate icon for log level
  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <FiAlertTriangle className="text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  // Get the appropriate style for log level
  const getLevelStyle = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-900/20 text-red-400 border-red-800/50';
      case 'warning':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-800/50';
      case 'info':
        return 'bg-blue-900/20 text-blue-400 border-blue-800/50';
      default:
        return 'bg-gray-800/50 text-gray-400 border-gray-700/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
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
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-3">
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
          </div>
          
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/30 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getLevelStyle(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span className="ml-1.5 capitalize">{log.level}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div>
                        <div className="font-medium">{log.message}</div>
                        <div className="text-gray-400 text-xs mt-1">{log.details}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.user}
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