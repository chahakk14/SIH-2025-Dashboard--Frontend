import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [verifiedUsers, setVerifiedUsers] = useState([]);

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

  const fetchVerifiedUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/hq/all-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.users)) {
        // not in selectedGroupId 
        const verifiedUsers = data.users.filter(user => user.is_verified );
        setVerifiedUsers(verifiedUsers);
      } else {
        setVerifiedUsers([]);
        console.error("API response for verified users is not an array:", data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch verified users:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchVerifiedUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Please enter a group name.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/hq/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ name: newGroupName, members_id: [] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewGroupName('');
      fetchGroups();
    } catch (error) {
      setError(error.message);
      console.error("Failed to create group:", error);
    }
  };

  const handleEditGroup = (index) => {
    alert(`Editing Group ${index + 1}. Feature not yet implemented.`);
  };

  const handleDeleteGroup = (index) => {
    if (window.confirm(`Are you sure you want to delete Group ${index + 1}?`)) {
        alert(`Deleting Group ${index + 1}. Feature not yet implemented.`);
    }
  };

  const openAddMemberModal = (groupId) => {
    setSelectedGroupId(groupId);
    setIsAddMemberModalOpen(true);
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      alert('Please select a user to add.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/hq/add-members/${selectedGroupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ members: [selectedUserId] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSelectedUserId('');
      setIsAddMemberModalOpen(false);
      fetchGroups();
    } catch (error) {
      setError(error.message);
      console.error("Failed to add member:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Group Management</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Create New Group</h3>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
            className="bg-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button onClick={handleCreateGroup} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200">
            <FiPlus className="mr-2" /> Create Group
          </button>
        </div>
      </div>

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
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 font-medium">{group.name || `Group ${index + 1}`}</td>
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
                    <button onClick={() => openAddMemberModal(group._id)} className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center">
                        <FiPlus className="mr-1"/> Add Member  
                    </button>
                    <button onClick={() => handleEditGroup(index)} className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 inline-flex items-center ml-4">
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

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Add New Member</h3>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled>Select a verified user</option>
              {verifiedUsers.map(user => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))}
            </select>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleAddMember} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
