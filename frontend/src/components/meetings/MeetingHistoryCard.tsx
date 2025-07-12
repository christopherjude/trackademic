import { useMeetings } from "../../hooks/useMeetings";

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
  const { fetchMeetingHistory, loading, error } = useMeetings();

  const pastMeetings = fetchMeetingHistory();

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
                <span className={`px-3 py-1 rounded-md text-sm ${getStatusColor(meeting.status || 'completed')}`}>
                  {meeting.status === 'student_checked_in' ? 'Student Checked In' : 
                   meeting.status === 'confirmed' ? 'Confirmed' :
                   meeting.status || 'Completed'}
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

