import UpcomingMeetingCard from "./UpcomingMeetingCard";
import MeetingHistoryCard from "./MeetingHistoryCard";
import MeetingTranscriptionsCard from "./MeetingTranscriptionsCard";
import MeetingInProgressCard from "./MeetingInProgressCard";
import ScheduleMeetingButton from "./ScheduleMeetingButton";
import { useAuth } from "../../context/AuthContext";
import { useMeetings } from "../../hooks/useMeetings";

const MeetingsOverview = () => {
  const { user } = useAuth();
  const { getInProgressMeeting } = useMeetings();
  const inProgress = getInProgressMeeting();
  const isSupervisor = user?.role === "supervisor";

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Meetings</h2>
        <ScheduleMeetingButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Show in-progress card at the top, full width */}
        {inProgress && (
          <div className="md:col-span-3">
            <MeetingInProgressCard isSupervisor={isSupervisor} />
          </div>
        )}
        <UpcomingMeetingCard />
        <MeetingHistoryCard />
        <MeetingTranscriptionsCard />
      </div>
    </div>
  );
};

export default MeetingsOverview;
