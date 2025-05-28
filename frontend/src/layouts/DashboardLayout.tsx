import React from "react";
import Topbar from "@/components/dashboard/TopBar";
import Sidebar from "@/components/dashboard/SideBar";

type Role = "student" | "supervisor" | "director";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
    user: {
        firstName: string;
        lastName: string;
        role: string;
        avatarUrl?: string;
    };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    role,
    user,
}) => {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    role={user.role}
                    avatarUrl={user.avatarUrl}
                />
                <main className="flex-1 overflow-y-auto p-6 bg-white">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
