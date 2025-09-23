import React from 'react';

const StatCard = ({ title, value, dailyChange, valueColor = 'text-white', children}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase">{title}</p>
            <p className={`text-4xl font-bold mt-2 ${valueColor}`}>{value}</p>
        </div>
        {dailyChange && <span className="text-sm text-green-400 bg-green-900/50 px-2 py-1 rounded-full">{dailyChange}</span>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default StatCard;
