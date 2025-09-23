import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiTrash2, FiAlertCircle } from 'react-icons/fi';

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
          console.error("API response for users is not an array:", data);
        }
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch users:", error);
      }
    };

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
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to verify user');
      }

      setUsers(users.map(user =>
        user._id === userId ? { ...user, is_verified: true } : user
      ));
    } catch (error) {
      alert(`Verification failed: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        // NOTE: The API documentation does not specify a user deletion endpoint.
        // This is a placeholder for when the endpoint is available.
        alert("User deletion is not yet supported by the backend API.");

        // Example of what the code would look like with a real endpoint:
        /*
        try {
            const response = await fetch(`http://localhost:8000/api/hq/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            alert(`Deletion failed: ${error.message}`);
        }
        */
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">User Management</h2>
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
                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || user.email || index} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_verified ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right border-b border-gray-700 text-sm leading-5 font-medium">
                    {!user.is_verified && user._id && (
                        <button onClick={() => handleVerifyUser(user._id)} className="text-green-400 hover:text-green-300 transition-colors duration-200 flex items-center">
                            <FiCheckCircle className="mr-1"/> Verify
                        </button>
                    )}
                    {user._id && (
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 ml-4 transition-colors duration-200 flex items-center">
                           <FiTrash2 className="mr-1"/> Delete
                        </button>
                    )}
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

export default UserManagement;