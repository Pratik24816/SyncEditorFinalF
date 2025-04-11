import React from "react";

const Client = ({ username, role }) => {
    const isAdmin = role === "admin";
    const userInitial = username?.charAt(0)?.toUpperCase() || '?';
    const avatarColor = isAdmin 
        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
        : 'bg-gradient-to-r from-blue-500 to-blue-700';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg relative ${isAdmin ? 'bg-gray-800' : 'bg-gray-700'}`}>
            {isAdmin && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-400 to-yellow-600"></div>
            )}
            
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold`}>
                    {userInitial}
                </div>
                <span className="text-white">{username}</span>
            </div>
            
            <span className={`text-sm ${isAdmin ? 'text-yellow-400' : 'text-gray-400'}`}>
                {role}
            </span>
        </div>
    );
};

export default Client;










