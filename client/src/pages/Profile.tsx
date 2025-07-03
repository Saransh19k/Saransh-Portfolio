import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  // Helper for avatar letter
  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  // Helper for date formatting
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-black via-gray-900 to-indigo-950 py-10">
      {/* Profile Image or Default Avatar */}
      <div className="relative w-24 h-24 mb-6">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center z-10">
            <span className="text-white text-4xl font-bold">{getInitial()}</span>
          </div>
        )}
      </div>
      {/* User Info */}
      <h2 className="text-3xl font-bold text-white mb-2">{user?.name || 'User Name'}</h2>
      <p className="text-lg text-gray-400 mb-1">{user?.email || 'user@email.com'}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-base text-gray-300 mb-2 mt-2">
        {user?.firstName && <div><span className="font-semibold">First Name:</span> {user.firstName}</div>}
        {user?.lastName && <div><span className="font-semibold">Last Name:</span> {user.lastName}</div>}
        {user?.role && <div><span className="font-semibold">Role:</span> {user.role}</div>}
        {user?.lastLoginAt && <div><span className="font-semibold">Last Login:</span> {formatDate(user.lastLoginAt)}</div>}
        {user?.createdAt && <div><span className="font-semibold">Created At:</span> {formatDate(user.createdAt)}</div>}
        {user?.updatedAt && <div><span className="font-semibold">Updated At:</span> {formatDate(user.updatedAt)}</div>}
      </div>
      {user?.bio && <p className="text-base text-gray-300 mb-1">{user.bio}</p>}
      {user?.website && (
        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline mb-1">
          {user.website}
        </a>
      )}
      {user?.location && <p className="text-base text-gray-400 mb-1">{user.location}</p>}
      <div className="max-w-xl text-center text-gray-300 mt-4">
        <p>
          Welcome to your profile page! Here you can view your personal information and update your details in the future.
        </p>
      </div>
    </div>
  );
};

export default Profile; 