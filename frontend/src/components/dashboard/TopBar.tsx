import React from "react";

interface TopbarProps {
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
}

const Topbar: React.FC<TopbarProps> = ({ firstName, lastName, role, avatarUrl }) => {
    return (
        <header className="flex text-black items-center justify-between py-4 px-4 bg-white">
            <h1 className="text-xl font-semibold">Welcome Back {firstName}</h1>
            <div className="flex items-center gap-3">
                <img
                    src={avatarUrl || "/avatar.png"}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border"
                />
                <div className="text-left">
                    <p className="font-semibold">{firstName} {lastName}</p>
                    <p className="text-sm text-secondary">{role}</p>
                </div>
           </div>
        </header>
    );
};

export default Topbar;
