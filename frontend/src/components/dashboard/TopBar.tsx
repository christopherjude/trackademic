import React, { useState, useRef, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
}

const Topbar: React.FC<TopbarProps> = ({ firstName, lastName, role, avatarUrl }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { instance } = useMsal();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await instance.logoutRedirect({
                postLogoutRedirectUri: window.location.origin,
            });
        } catch (error) {
            console.error("Logout failed:", error);
            // Fallback: redirect to home page
            navigate("/");
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="flex text-black items-center justify-between py-4 px-4 bg-white">
            <h1 className="text-xl font-semibold">Welcome Back {firstName}</h1>
            <div className="relative" ref={dropdownRef}>
                <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={toggleDropdown}
                >
                    <img
                        src={avatarUrl || "/avatar.png"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border"
                    />
                    <div className="text-left">
                        <p className="font-semibold">{firstName} {lastName}</p>
                        <p className="text-sm text-secondary">{role}</p>
                    </div>
                    {/* Dropdown Arrow */}
                    <svg 
                        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 !bg-white hover:!bg-gray-100 transition-colors flex items-center gap-2 !border-0 !outline-0 focus:!outline-0 focus:!ring-0 !rounded-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
