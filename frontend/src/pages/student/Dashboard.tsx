import DashboardLayout from "@/layouts/DashboardLayout";
import MeetingsOverview from "@/components/meetings/MeetingsOverview";
import { useAuth } from "@/context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      role={user?.role || "student"}
      user={{ 
        firstName: user?.firstName || "User", 
        lastName: user?.lastName || "", 
        role: user?.role || "Student", 
        avatarUrl: user?.avatarUrl || "/avatar.png" 
      }}
    >
      <MeetingsOverview />
    </DashboardLayout>
  );
};

export default StudentDashboard;

