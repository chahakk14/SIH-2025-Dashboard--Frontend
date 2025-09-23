import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hq/all-users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">User Management</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 border-b border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700">{user.username}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700">{user.is_verified ? 'Yes' : 'No'}</td>
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

export default UserManagement;