import React from 'react';

const GroupManagement = () => {
  // Dummy data for groups
  const groups = [
    { id: 1, name: 'Admin', description: 'Admins have full access to all features.' },
    { id: 2, name: 'Editor', description: 'Editors can create and edit content.' },
    { id: 3, name: 'Viewer', description: 'Viewers can only view content.' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Group Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{group.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{group.description}</td>
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

export default GroupManagement;