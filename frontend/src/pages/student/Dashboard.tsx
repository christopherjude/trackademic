import DashboardLayout from "@/layouts/DashboardLayout";
import MeetingsOverview from "@/components/meetings/MeetingsOverview";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const StudentDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("[Dashboard] Signed-in user:", user);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      role={user.role}
      user={{
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        avatarUrl: "/avatar.png" // Default avatar
      }}
    >
      <MeetingsOverview />
    </DashboardLayout>
  );
};

export default StudentDashboard;

