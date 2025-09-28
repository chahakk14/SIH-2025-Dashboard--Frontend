import React from 'react';

const ActivityLog = () => {
  const logs = [
    { time: '2024-10-26 09:45:10', message: "User 'Alpha_007' access suspended." },
    { time: '2024-10-26 09:43:15', message: "ALERT: Screenshot attempt detected from 'Rakesh_Family'", isAlert: true },
    { time: '2024-10-26 09:40:22', message: "New group \"Ops_Control_Room\" created by Lt. Anand Sharma" },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="text-sm text-gray-300 font-mono">
            <span className="mr-3 text-gray-500">
              {log.time}
            </span>
            <span className={`${log.isAlert ? 'text-red-500 font-bold' : ''}`}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
