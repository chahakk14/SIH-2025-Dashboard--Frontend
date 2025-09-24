import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiTrash2, FiAlertCircle, FiSearch, FiChevronDown, FiPlus } from 'react-icons/fi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
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
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerifyUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/hq/set-verified/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error((await response.json()).detail || 'Failed to verify user');
      }
      fetchUsers(); // Re-fetch users to get updated list
    } catch (error) {
      alert(`Verification failed: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      alert("User deletion is not yet supported by the backend API.");
      // Future implementation for user deletion
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = user.username.toLowerCase().includes(searchTermLower) || 
                          user.email.toLowerCase().includes(searchTermLower);
    
    const matchesFilter = filter === 'all' || 
                          (filter === 'verified' && user.is_verified) || 
                          (filter === 'unverified' && !user.is_verified);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">User Management</h1>
      
      {error && 
        <div className="flex items-center text-red-300 bg-red-900/40 p-4 rounded-lg">
            <FiAlertCircle className="mr-3 h-5 w-5"/>
            <div><h3 className="font-semibold">An Error Occurred</h3><p className="text-sm">{error}</p></div>
        </div>
      }

      <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search users..."
            className="w-full bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              className="appearance-none bg-gray-700 text-white rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <FiChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200">
            <FiPlus />
            New User
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Loading users...</td></tr>
              ) : filteredUsers.length > 0 ? ( 
                filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_verified ? 'bg-green-800/50 text-green-300' : 'bg-yellow-800/50 text-yellow-300'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4">
                      {!user.is_verified && (
                        <button onClick={() => handleVerifyUser(user._id)} className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors duration-200">
                            <FiCheckCircle/> Verify
                        </button>
                      )}
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors duration-200">
                        <FiTrash2/> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr><td colSpan="4" className="text-center py-8 text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
