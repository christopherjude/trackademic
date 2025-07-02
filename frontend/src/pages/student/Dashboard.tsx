import DashboardLayout from "@/layouts/DashboardLayout";
import MeetingsOverview from "@/components/meetings/MeetingsOverview";
import { useAuth } from "@/context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

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

