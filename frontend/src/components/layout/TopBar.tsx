import React from "react";
import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
}

const TopBar: React.FC<TopBarProps> = ({ firstName, lastName, role }) => {
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-800">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-gray-500 capitalize">{role}</div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
