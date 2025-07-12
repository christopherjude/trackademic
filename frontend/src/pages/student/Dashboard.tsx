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
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        avatarUrl: user.avatarUrl
      }}
    >
      <MeetingsOverview />
    </DashboardLayout>
  );
};

export default StudentDashboard;

