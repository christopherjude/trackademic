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
  
  // Check if current user is a participant in this meeting
  const isParticipant = 
    (isStudent && meeting.student_id === user?.id) ||
    (isSupervisor && meeting.supervisor_id === user?.id);

  // Only show controls if user is a participant or director
  if (!isParticipant && user?.role !== 'director') return null;

  return (
    <div className="flex gap-2 mt-2">
      {/* Student or Supervisor: Start Meeting */}
      {(isStudent || isSupervisor) && meeting.status?.toUpperCase() === 'SCHEDULED' && (
        <button
          onClick={async () => {
            if (isSupervisor) {
              setLoading(true);
              try {
                await checkIntoMeeting(meeting.id); // set status to student_checked_in
                await confirmMeeting(meeting.id);  // immediately confirm
              } catch (error) {
                console.error('Meeting start failed:', error);
              } finally {
                setLoading(false);
              }
            } else {
              handleAction(() => checkIntoMeeting(meeting.id));
            }
          }}
          className="w-full bg-secondary text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all font-semibold flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start meeting'}
        </button>
      )}
      {/* Supervisor: Confirm Meeting if student has checked in */}
      {isSupervisor && meeting.status?.toUpperCase() === 'STUDENT_CHECKED_IN' && (
        <button
          onClick={async () => {
            setLoading(true);
            try {
              await confirmMeeting(meeting.id);
            } catch (error) {
              console.error('Meeting confirm failed:', error);
            } finally {
              setLoading(false);
            }
          }}
          className="w-full bg-success text-white py-3 px-6 rounded-lg shadow-lg hover:bg-success transition-all font-semibold flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading ? 'Confirming...' : 'Confirm meeting'}
        </button>
      )}
      {/* End Meeting button for participants when meeting is confirmed */}
      {(isParticipant || user?.role === 'director') && meeting.status?.toUpperCase() === 'CONFIRMED' && (
        <button
          onClick={async () => {
            setLoading(true);
            try {
              await endMeeting(meeting.id); // This should set end time and status to COMPLETED
            } catch (error) {
              console.error('End meeting failed:', error);
            } finally {
              setLoading(false);
            }
          }}
          className="w-full bg-error text-white py-3 px-6 rounded-lg shadow-lg hover:bg-error transition-all font-semibold flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading ? 'Ending...' : 'End meeting'}
        </button>
      )}
    </div>
  );
};

export default MeetingControls;
