import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const VerificationRequests = ({ onUserVerified }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnverifiedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/hq/unverified-users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.unverified_users)) {
        setRequests(data.unverified_users);
      } else {
        setRequests([]);
        console.error("API response for unverified users is not an array:", data);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch unverified users', {
        description: error.message,
      });
      console.error("Failed to fetch unverified users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  const handleVerification = async (userId, approve) => {
    if (approve) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/hq/set-verified/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to verify user');
            }
            fetchUnverifiedUsers(); 
            if(onUserVerified) onUserVerified();
            toast.success('User verified successfully!', {
              description: 'The user has been verified and can now access the system',
            });
        } catch (error) {
            toast.error('Verification failed', {
              description: error.message,
            });
        }
    } else {
        toast.info('Feature coming soon!', {
          description: 'User rejection functionality will be available in the next update',
        });
    }
  };
  
  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading requests...</div>;
  }

  if (error) {
    return (
        <div className="flex items-center text-red-300 bg-red-900/30 p-3 rounded-lg">
            <FiAlertCircle className="mr-2"/> {`Error: ${error}`}
        </div>
    );
  }

  return (
    <div>
        {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No pending verification requests.</p>
        ) : (
            <ul className="space-y-3">
            {requests.map((user, index) => (
                <li key={user._id || index} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between transition duration-200 hover:bg-gray-700">
                    <div>
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleVerification(user._id, true)}
                            className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors duration-200 p-2 rounded-md hover:bg-green-800/50"
                        >
                            <FiCheckCircle size={18} />
                            <span className="text-sm font-medium">Approve</span>
                        </button>
                        <button 
                            onClick={() => handleVerification(user._id, false)}
                            className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors duration-200 p-2 rounded-md hover:bg-red-800/50"
                        >
                            <FiXCircle size={18} />
                             <span className="text-sm font-medium">Decline</span>
                        </button>
                    </div>
                </li>
            ))}
            </ul>
        )}
    </div>
  );
};

export default VerificationRequests;
