import { useState } from "react";
import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";

interface MeetingControlsProps {
  meeting: any; // Meeting interface from useMeetings
}

const MeetingControls = ({ meeting }: MeetingControlsProps) => {
  const { user } = useAuth();
  const { startMeeting } = useMeetings();
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
  
  // Check if current user is a participant in this meeting
  const isParticipant = 
    (isStudent && meeting.student_id === user?.id) ||
    (isSupervisor && meeting.supervisor_id === user?.id);

  // Only show controls if user is a participant
  if (!isParticipant) return null;

  return (
    <div className="flex gap-2 mt-2">
      {/* Start Meeting button - available when meeting is ready to start */}
      {(isStudent || isSupervisor) && 
       (['SCHEDULED', 'PENDING'].includes(meeting.status?.toUpperCase() || '')) && 
       new Date(meeting.scheduled_at) <= new Date() && (
        <button
          onClick={() => handleAction(() => startMeeting(meeting.id))}
          className="w-full bg-secondary text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all font-semibold flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start Meeting'}
        </button>
      )}
    </div>
  );
};

export default MeetingControls;
