import { useState } from "react";
import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";

interface MeetingControlsProps {
  meeting: any; // Meeting interface from useMeetings
}

const MeetingControls = ({ meeting }: MeetingControlsProps) => {
  const { user } = useAuth();
  const { checkIntoMeeting, confirmMeeting, endMeeting, markMeetingMissed } = useMeetings();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: () => Promise<any>) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Meeting action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user?.role === 'student';
  const isSupervisor = user?.role === 'supervisor' || user?.role === 'director';
  
  // For now, we'll assume the logged-in student is Alice (id=1) and supervisor is Bob (id=2)
  // In production, you'd get the actual user ID from the backend based on email
  const currentUserId = user?.email === 'alice@trackademic.uk' ? 1 : 
                       user?.email === 'bob@trackademic.uk' ? 2 : 
                       user?.email === 'candice@trackademic.uk' ? 3 : null;
  
  const isParticipant = 
    (isStudent && meeting.student_id === currentUserId) ||
    (isSupervisor && meeting.supervisor_id === currentUserId);

  if (!isParticipant) return null;

  return (
    <div className="flex gap-2 mt-2">
      {/* Student Actions */}
      {isStudent && meeting.status === 'scheduled' && (
        <button
          onClick={() => handleAction(() => checkIntoMeeting(meeting.id))}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking In...' : "I'm in the meeting"}
        </button>
      )}

      {/* Supervisor Actions */}
      {isSupervisor && meeting.status === 'student_checked_in' && (
        <button
          onClick={() => handleAction(() => confirmMeeting(meeting.id))}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Confirming...' : 'Confirm Meeting'}
        </button>
      )}

      {/* End Meeting (Both can do this) */}
      {meeting.status === 'confirmed' && (
        <button
          onClick={() => handleAction(() => endMeeting(meeting.id))}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Ending...' : 'End Meeting'}
        </button>
      )}

      {/* Mark as Missed (Supervisor only) */}
      {isSupervisor && ['scheduled', 'student_checked_in'].includes(meeting.status) && (
        <button
          onClick={() => handleAction(() => markMeetingMissed(meeting.id))}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Marking...' : 'Mark as Missed'}
        </button>
      )}
    </div>
  );
};

export default MeetingControls;
