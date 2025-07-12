import UpcomingMeetingCard from "./UpcomingMeetingCard";
import MeetingHistoryCard from "./MeetingHistoryCard";
import MeetingTranscriptionsCard from "./MeetingTranscriptionsCard";
import ScheduleMeetingButton from "./ScheduleMeetingButton";

const MeetingsOverview = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Meetings</h2>
        <ScheduleMeetingButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UpcomingMeetingCard />
        <MeetingHistoryCard />
        <MeetingTranscriptionsCard />
      </div>
    </div>
  );
};

export default MeetingsOverview;
