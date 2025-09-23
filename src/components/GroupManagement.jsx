import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUsers, FiAlertCircle } from 'react-icons/fi';

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        } else {
          setGroups([]);
          console.error("API response for groups is not an array:", data);
        }
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleEditGroup = (index) => {
    alert(`Editing Group ${index + 1}. Feature not yet implemented.`);
  };

  const handleDeleteGroup = (index) => {
    if (window.confirm(`Are you sure you want to delete Group ${index + 1}?`)) {
        alert(`Deleting Group ${index + 1}. Feature not yet implemented.`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Group Management</h2>
      {error && 
        <div className="flex items-center text-red-400 bg-red-900/50 p-3 rounded-lg">
            <FiAlertCircle className="mr-2"/> {`Error: ${error}`}
        </div>
      }
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 border-b border-gray-700 text-right text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 font-medium">{group.group_name || `Group ${index + 1}`}</td>
                  <td className="px-6 py-4 border-b border-gray-700">
                    {Array.isArray(group.members) && group.members.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {group.members.map((member, memberIndex) => (
                          <span key={memberIndex} className="bg-gray-700/50 px-2 py-1 rounded-full text-sm">
                            {member.username || 'N/A'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No members</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right border-b border-gray-700 text-sm leading-5 font-medium">
                    <button onClick={() => handleEditGroup(index)} className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 inline-flex items-center">
                        <FiEdit className="mr-1"/> Edit
                    </button>
                    <button onClick={() => handleDeleteGroup(index)} className="text-red-500 hover:text-red-400 ml-4 transition-colors duration-200 inline-flex items-center">
                        <FiTrash2 className="mr-1"/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;