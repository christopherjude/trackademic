import UpcomingMeetingCard from "./UpcomingMeetingCard";
import MeetingHistoryCard from "./MeetingHistoryCard";
import MeetingTranscriptionsCard from "./MeetingTranscriptionsCard";

const MeetingsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <UpcomingMeetingCard />
      <MeetingHistoryCard />
      <MeetingTranscriptionsCard />
    </div>
  );
};

export default MeetingsOverview;
