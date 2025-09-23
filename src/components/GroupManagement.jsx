import React, { useState, useEffect } from 'react';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hq/all-groups', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data.groups);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Group Management</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 border-b border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.name} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700">{group.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700">{group.members_id.join(', ')}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-700 text-sm leading-5 font-medium">
                  <button className="text-yellow-400 hover:text-yellow-300">Edit</button>
                  <button className="text-red-500 hover:text-red-400 ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupManagement;