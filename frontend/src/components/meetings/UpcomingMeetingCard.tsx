import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";
import MeetingControls from "./MeetingControls";

const UpcomingMeetingCard = () => {
  const { user } = useAuth();
  const { meetings, loading, error } = useMeetings();

  const currentTime = new Date();
  const relevantMeetings = meetings.filter(meeting => {
    const isDirector = user?.role === 'director';
    const isUserMeeting = 
      meeting.student_id === user?.id || 
      meeting.supervisor_id === user?.id;
    
    if (!isDirector && !isUserMeeting) {
      return false;
    }

    const meetingTime = new Date(meeting.scheduled_at);
    const meetingEndTime = new Date(meetingTime.getTime() + (meeting.duration_minutes * 60 * 1000));
    const status = (meeting.status || '').toLowerCase();
    
    return (
      meetingTime > currentTime ||
      (currentTime >= meetingTime && currentTime <= meetingEndTime && ['scheduled', 'pending'].includes(status))
    ) && !['completed', 'missed', 'in_progress'].includes(status);
  }).slice(0, 5);

  return (
    <div className='flex-col'>
      <h2 className="text-xl font-semibold text-primary mb-4">Upcoming Meetings</h2>
      <div className="bg-surface p-4 rounded-lg shadow-md w-full h-full overflow-y-auto max-h-[300px]">
        {loading ? (
          <div className="text-gray-500">Loading meetings...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : relevantMeetings.length === 0 ? (
          <div className="text-gray-500">No upcoming meetings</div>
        ) : (
          <div className="space-y-4">
            {relevantMeetings.map((meeting) => (
              <div key={meeting.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h3 className="font-semibold text-primary">{meeting.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}z  
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    new Date(meeting.scheduled_at) <= new Date() && ['SCHEDULED', 'PENDING'].includes(meeting.status?.toUpperCase() || '') 
                      ? 'bg-green-100 text-green-800' 
                      : meeting.status === 'student_checked_in' ? 'bg-blue-100 text-blue-800' : 
                        meeting.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                  }`}>
                    {new Date(meeting.scheduled_at) <= new Date() && ['SCHEDULED', 'PENDING'].includes(meeting.status?.toUpperCase() || '') 
                      ? 'Ready to Start' 
                      : meeting.status === 'student_checked_in' ? 'Student Checked In' : 
                        meeting.status === 'confirmed' ? 'Confirmed' :
                        meeting.status || 'Scheduled'}
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

