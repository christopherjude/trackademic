import React from "react";
import {
    FaTachometerAlt,
    FaUserGraduate,
    FaUsers,
    FaChartPie,
    FaCog,
} from "react-icons/fa";

type Role = "student" | "supervisor" | "director";

interface SidebarProps {
    role: Role;
}

const navItems: Record<Role, { icon: React.ReactNode; label: string }[]> = {
    student: [
        { icon: <FaTachometerAlt />, label: "Dashboard" },
        { icon: <FaUserGraduate />, label: "Meetings" },
        { icon: <FaChartPie />, label: "Milestones" },
    ],
    supervisor: [
        { icon: <FaTachometerAlt />, label: "Dashboard" },
        { icon: <FaUsers />, label: "Students" },
        { icon: <FaChartPie />, label: "Analytics" },
    ],
    director: [
        { icon: <FaTachometerAlt />, label: "Dashboard" },
        { icon: <FaUsers />, label: "Supervisors" },
        { icon: <FaChartPie />, label: "Reports" },
        { icon: <FaCog />, label: "Settings" },
    ],
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    return (
        <div className="p-2">
            <aside className="w-64 h-full bg-background-light text-black p-6 space-y-6 rounded-md">
                <div className="text-2xl font-bold">Trackademic</div>
                <nav className="space-y-3">
                    {navItems[role].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 hover:text-primary cursor-pointer"
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;
