import { useMeetings } from "../../hooks/useMeetings";
import MeetingControls from "./MeetingControls";

const UpcomingMeetingCard = () => {
  const { meetings, loading, error } = useMeetings();

  // Filter for upcoming meetings (future dates)
  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.scheduled_at) > new Date()
  ).slice(0, 5); // Show only next 5 meetings

  return (
    <div className='flex-col'>
      <h2 className="text-xl font-semibold text-primary mb-4">Upcoming Meetings</h2>
      <div className="bg-surface p-4 rounded-lg shadow-md w-full h-full overflow-y-auto max-h-[300px]">
        {loading ? (
          <div className="text-gray-500">Loading meetings...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : upcomingMeetings.length === 0 ? (
          <div className="text-gray-500">No upcoming meetings</div>
        ) : (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h3 className="font-semibold text-primary">{meeting.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    {meeting.status === 'student_checked_in' ? 'Student Checked In' : 
                     meeting.status === 'confirmed' ? 'Confirmed' :
                     meeting.status || 'Pending'}
                  </span>
                </div>
                <MeetingControls meeting={meeting} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetingCard;

