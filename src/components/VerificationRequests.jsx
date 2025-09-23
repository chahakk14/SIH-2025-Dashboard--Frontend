import React from 'react';

const VerificationRequestItem = ({ user, id, group, requester }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <p><strong>User:</strong> {user} (Veteran ID: {id})</p>
    <p className="text-gray-400 text-sm mt-1"><strong>Group:</strong> {group}</p>
    <p className="text-gray-400 text-sm"><strong>Requester:</strong> {requester}</p>
    <div className="flex space-x-2 mt-3">
      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm">Approve</button>
      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm">Reject</button>
      {/* <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded text-sm">View Details</button> */}
    </div>
  </div>
);

const VerificationRequests = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Pending Verification Requests</h2>
      <div className="space-y-4">
        <VerificationRequestItem 
          user="Ramesh Kumar"
          id="7890"
          group="12th Rajuat Families"
          requester="Cpt. Singh"
        />
         <VerificationRequestItem 
          user="Ramesh Kumar"
          id="7890"
          group="12th Rajuat Families"
          requester="Cpt. Singh"
        />
      </div>
    </div>
  );
};

export default VerificationRequests;