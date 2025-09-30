import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [deleteMemberGroupId, setDeleteMemberGroupId] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/all-groups`, {
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
      toast.error('Failed to fetch groups', {
        description: error.message,
      });
      console.error("Failed to fetch groups:", error);
    }
  };

  const fetchVerifiedUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/all-users`, {
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
      toast.error('Failed to fetch verified users', {
        description: error.message,
      });
      console.error("Failed to fetch verified users:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchVerifiedUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.warning('Please enter a group name');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/create-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ name: newGroupName, members: [] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewGroupName('');
      fetchGroups();
      toast.success('Group created successfully!', {
        description: `"${newGroupName}" has been created`,
      });
    } catch (error) {
      setError(error.message);
      toast.error('Failed to create group', {
        description: error.message,
      });
      console.error("Failed to create group:", error);
    }
  };

  const handleEditGroup = (index) => {
    toast.info('Feature coming soon!', {
      description: 'Group editing functionality will be available in the next update',
    });
  };

  const handleDeleteGroup = (index) => {
    if (window.confirm(`Are you sure you want to delete Group ${index + 1}?`)) {
      toast.info('Feature coming soon!', {
        description: 'Group deletion functionality will be available in the next update',
      });
    }
  };

  const toggleGroupExpansion = (groupId) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const openAddMemberModal = (groupId) => {
    setSelectedGroupId(groupId);
    
    // Filter out users who are already members of this group
    const selectedGroup = groups.find(group => group._id === groupId);
    const existingMemberIds = selectedGroup?.members?.map(member => member._id) || [];
    const usersNotInGroup = verifiedUsers.filter(user => !existingMemberIds.includes(user._id));

    console.log('verifiedUsers:', verifiedUsers);
    console.log('Group members:', selectedGroup?.members);
    console.log('Existing member IDs:', existingMemberIds);
    console.log('Available users for adding:', usersNotInGroup);
    
    setAvailableUsers(usersNotInGroup);
    setIsAddMemberModalOpen(true);
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.warning('Please select a user to add');
      return;
    }
    
    const addedUser = availableUsers.find(user => user._id === selectedUserId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/add-members/${selectedGroupId}`, {
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
      
      // Reset modal state
      setSelectedUserId('');
      setIsAddMemberModalOpen(false);
      setAvailableUsers([]);
      
      // Refresh data
      fetchGroups();
      
      // Show success message
      toast.success('Member added successfully!', {
        description: `${addedUser?.username || 'User'} has been added to the group`,
      });
    } catch (error) {
      setError(error.message);
      toast.error('Failed to add member', {
        description: error.message,
      });
      console.error("Failed to add member:", error);
    }
  };

  const handleDeleteMember = (groupId, memberId) => {
    setDeleteMemberGroupId(groupId);
    setDeleteMemberId(memberId);
    setShowDeleteMemberModal(true);
  };

  const handleDeleteMemberConfirm = async () => {
    setShowDeleteMemberModal(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/delete-member/${deleteMemberGroupId}/${deleteMemberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchGroups();
      toast.success('Member removed successfully!');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to remove member', {
        description: error.message,
      });
      console.error("Failed to remove member:", error);
    }
    setDeleteMemberGroupId(null);
    setDeleteMemberId(null);
  };

  const handleDeleteMemberCancel = () => {
    setShowDeleteMemberModal(false);
    setDeleteMemberGroupId(null);
    setDeleteMemberId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 relative">
      {/* Delete Member Confirmation Modal */}
      {showDeleteMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>
          <div className="relative bg-gray-800 rounded-xl shadow-2xl p-8 min-w-[320px] flex flex-col items-center z-10">
            <span className="text-white text-lg mb-4">Are you sure you want to remove this member from the group?</span>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteMemberConfirm}
              >
                Yes
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={handleDeleteMemberCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Group Management</h2>
            <p className="text-gray-400">Manage teams and organize members efficiently</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-300">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {groups.length} Groups
            </span>
          </div>
        </div>
        
        {/* Create New Group Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <FiPlus className="mr-3 text-green-400" />
            Create New Group
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter a descriptive group name"
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleCreateGroup} 
              disabled={!newGroupName.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <FiPlus className="mr-2" /> Create Group
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-700 rounded-2xl p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-400 mr-3 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-red-300 font-semibold">Error Occurred</h4>
              <p className="text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Groups Table */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Existing Groups
          </h3>
        </div>
        
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Groups Yet</h3>
            <p className="text-gray-500 text-sm">Create your first group to get started with team management</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {groups.map((group, index) => {
                  const isExpanded = expandedGroups.has(group._id);
                  const memberCount = Array.isArray(group.members) ? group.members.length : 0;
                  
                  return (
                    <React.Fragment key={group._id || group.id || group.name}>
                      <tr onClick={() => toggleGroupExpansion(group._id)} className="hover:bg-gray-700/30 transition-all duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleGroupExpansion(group._id)}
                              className="flex-shrink-0 w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                            >
                              <svg 
                                className={`w-4 h-4 text-white transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(group.name || 'UG').substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-white flex items-center">
                                {group.name || 'Unnamed Group'}
                                <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                                  {memberCount} member{memberCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400">Click to expand details</div>
                            </div>
                          </div>
                        </td>

                        <td  className="px-6 py-5 text-right" >
                          <div className="flex justify-end items-center gap-2">
                            <button 
                              onClick={() => openAddMemberModal(group._id)} 
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center text-sm font-medium"
                            >
                              <FiPlus className="w-4 h-4 mr-1"/> Add
                            </button>
                            <button 
                              onClick={() => handleDeleteGroup(index)} 
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center text-sm font-medium"
                            >
                              <FiTrash2 className="w-4 h-4 mr-1"/> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-gray-800/50">
                          <td colSpan="3" className="px-6 py-4">
                            <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl p-4">
                              <h4 className="text-white font-semibold mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Group Details
                              </h4>
                              {memberCount > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                  {group.members.map((member) => (
                                    <div key={member._id || member.id || member.username} className="bg-gray-700/50 rounded-lg p-3 flex items-center">
                                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-semibold">
                                          {(member.username || 'U').charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="text-white font-medium">{member.username || 'N/A'}</div>
                                        <div className="text-gray-400 text-sm">{member.email || 'No email'}</div>
                                      </div>
                                      <button 
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center text-sm font-medium ml-auto"
                              onClick={() => handleDeleteMember(group._id, member._id)}
                            >
                              <FiTrash2 className="w-4 h-4 mr-1"/>
                            </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                  </svg>
                                  <p className="text-gray-400">This group has no members yet</p>
                                  <button 
                                    onClick={() => openAddMemberModal(group._id)}
                                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                                  >
                                    Add the first member
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <FiPlus className="mr-3 text-blue-400" />
                Add New Member
              </h3>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select User to Add
              </label>
              {availableUsers.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 pr-10 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                  >
                    <option value="" disabled className="text-gray-400">Select a user to add</option>
                    {availableUsers.map(user => (
                      <option key={user._id} value={user._id} className="text-white bg-gray-700">
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-300 font-medium">No Available Users</p>
                  <p className="text-yellow-200 text-sm mt-1">All verified users are already members of this group</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsAddMemberModalOpen(false);
                  setSelectedUserId('');
                }} 
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMember} 
                disabled={!selectedUserId || availableUsers.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
