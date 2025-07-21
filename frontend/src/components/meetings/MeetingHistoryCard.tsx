import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "missed":
      return "bg-red-100 text-red-700";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "student_checked_in":
      return "bg-yellow-100 text-yellow-800";
    case "scheduled":
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const MeetingHistoryCard = () => {
  const { user } = useAuth();
  const { fetchMeetingHistory, loading, error } = useMeetings();

  const allPastMeetings = fetchMeetingHistory();
  
  // Filter meetings based on user role
  const pastMeetings = allPastMeetings.filter(meeting => {
    const isDirector = user?.role === 'director';
    const isUserMeeting = 
      meeting.student_id === user?.id || 
      meeting.supervisor_id === user?.id;
    
    // Directors see all meetings, others only see their own
    return isDirector || isUserMeeting;
  });

  // Helper function to determine display status
  const getDisplayStatus = (meeting: any) => {
    const meetingTime = new Date(meeting.scheduled_at);
    const meetingEndTime = new Date(meetingTime.getTime() + (meeting.duration_minutes * 60 * 1000));
    const now = new Date();
    const status = (meeting.status || '').toLowerCase();
    
    // If meeting time window has passed and it's still pending/scheduled, treat as missed
    if ((status === 'pending' || status === 'scheduled') && now > meetingEndTime) {
      return 'missed';
    }
    
    return status;
  };

  return (
    <div className="flex-col">
      <h3 className="text-xl font-semibold text-primary mb-4">Meeting History</h3>
      <div className="shadow-md text-black p-4 w-full h-full max-h-[300px] rounded-lg bg-surface overflow-y-auto">
        {loading ? (
          <div className="text-gray-500">Loading meeting history...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : pastMeetings.length === 0 ? (
          <div className="text-gray-500">No meeting history available</div>
        ) : (
          <ul className="space-y-2">
            {pastMeetings.map((meeting) => (
              <li key={meeting.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium">{meeting.title}</div>
                  <span className="text-sm text-gray-600">
                    {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {meeting.actual_duration_minutes && (
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {meeting.actual_duration_minutes} minutes
                      {meeting.duration_minutes !== meeting.actual_duration_minutes && (
                        <span className="ml-1">
                          (planned: {meeting.duration_minutes} min)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-md text-sm ${getStatusColor(getDisplayStatus(meeting))}`}>
                  {(() => {
                    const displayStatus = getDisplayStatus(meeting);
                    if (displayStatus === 'student_checked_in') return 'Student Checked In';
                    if (displayStatus === 'confirmed') return 'Confirmed';
                    if (displayStatus === 'missed') return 'Missed';
                    if (displayStatus === 'completed') return 'Completed';
                    return displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
                  })()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MeetingHistoryCard;

