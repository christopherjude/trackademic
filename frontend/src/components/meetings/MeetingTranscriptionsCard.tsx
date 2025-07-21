import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";

const MeetingTranscriptionsCard = () => {
  const { user } = useAuth();
  const { meetings, loading, error } = useMeetings();

  // Filter for completed meetings only, and by user access
  const completedMeetings = meetings
    .filter(meeting => {
      // First filter by completion status
      if (meeting.status?.toUpperCase() !== 'COMPLETED') {
        return false;
      }
      
      // Then filter by user access
      const isDirector = user?.role === 'director';
      const isUserMeeting = 
        meeting.student_id === user?.id || 
        meeting.supervisor_id === user?.id;
      
      // Directors see all meetings, others only see their own
      return isDirector || isUserMeeting;
    })
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 5); // Show only last 5 completed meetings

  return (
    <div className="flex-col w-full">
      <h3 className="text-lg font-semibold text-primary mb-4">Meeting Summaries</h3>
      <div className="bg-white p-4 rounded-lg shadow-md max-h-[300px] overflow-y-auto space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading meeting summaries...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : completedMeetings.length === 0 ? (
          <div className="text-gray-500">No meeting summaries available</div>
        ) : (
          completedMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-background-light p-4 rounded-md shadow-sm border-l-4 border-secondary"
            >
              <p className="text-base font-semibold text-primary">{meeting.title}</p>
              <p className="text-sm text-secondary mb-2">
                {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                {new Date(meeting.scheduled_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <p className="text-sm text-gray-800 mb-3">
                {meeting.meeting_summary || "No meeting summary available."}
              </p>

              <div className="text-sm text-gray-700 mb-2">
                <p className="font-semibold mb-1">Meeting Details:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Duration: {meeting.actual_duration_minutes || meeting.duration_minutes} minutes
                    {meeting.actual_duration_minutes && meeting.actual_duration_minutes !== meeting.duration_minutes && (
                      <span className="text-gray-500"> (planned: {meeting.duration_minutes})</span>
                    )}
                  </li>
                  {meeting.location && <li>Location: {meeting.location}</li>}
                  <li>Supervisor: {meeting.supervisor.first_name} {meeting.supervisor.last_name}</li>
                  <li>Student: {meeting.student.first_name} {meeting.student.last_name}</li>
                </ul>
              </div>

              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Status:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  meeting.status?.toLowerCase() === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {meeting.status || 'Completed'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingTranscriptionsCard;

