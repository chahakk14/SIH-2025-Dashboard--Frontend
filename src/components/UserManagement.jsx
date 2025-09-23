import React from 'react';

const UserManagement = () => {
  // Dummy data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', group: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', group: 'Editor' },
    { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', group: 'Viewer' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-3 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{user.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{user.group}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5 font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900 ml-4">Delete</button>
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