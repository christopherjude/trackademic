import DashboardLayout from "@/layouts/DashboardLayout";
import MeetingsOverview from "@/components/meetings/MeetingsOverview";

const StudentDashboard = () => {
  return (
    <DashboardLayout
      role="student"
      user={{ firstName: "Alice", lastName: "Wonderdust", role: "Student", avatarUrl: "/avatar.png" }}
    >
    <MeetingsOverview />
    </DashboardLayout>
  );
};

export default StudentDashboard;

