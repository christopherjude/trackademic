import { useEffect, useState } from "react";
import { useMeetings } from "../hooks/useMeetings";
import { useAuth } from "../../../context/AuthContext";

const pad = (n: number) => n.toString().padStart(2, '0');

function getElapsed(start: string) {
  const startTime = new Date(start).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - startTime) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const MeetingInProgressCard = () => {
  const { user } = useAuth();
  const { getInProgressMeeting, endMeeting, updateMeetingSummary, refetch } = useMeetings();
  const meeting = getInProgressMeeting();
  const [timer, setTimer] = useState('00:00:00');
  const [ending, setEnding] = useState(false);
  const [summary, setSummary] = useState(meeting?.meeting_summary || '');
  const [lastSavedSummary, setLastSavedSummary] = useState(meeting?.meeting_summary || '');

  const canEndMeeting = meeting && user && meeting.supervisor_id === user.id;
  
  const canViewMeeting = meeting && user && (
    user.role === 'director' || 
    meeting.student_id === user.id || 
    meeting.supervisor_id === user.id
  );

  useEffect(() => {
    if (!meeting?.actual_start_time) return;
    setTimer(getElapsed(meeting.actual_start_time));
    const interval = setInterval(() => {
      setTimer(getElapsed(meeting.actual_start_time!));
    }, 1000);
    return () => clearInterval(interval);
  }, [meeting?.actual_start_time]);

  useEffect(() => {
    if (meeting?.meeting_summary) {
      setSummary(meeting.meeting_summary);
      setLastSavedSummary(meeting.meeting_summary);
    }
  }, [meeting?.meeting_summary]);

  useEffect(() => {
    if (!meeting || summary === lastSavedSummary) return;
    
    const saveTimeout = setTimeout(async () => {
      try {
        await updateMeetingSummary(meeting.id, summary);
        setLastSavedSummary(summary);
      } catch (error) {
        console.error('Failed to save summary:', error);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [summary, lastSavedSummary, meeting, updateMeetingSummary]);

  if (!meeting || !canViewMeeting) return null;

  const handleEndMeeting = async () => {
    setEnding(true);
    try {
      await endMeeting(meeting.id, summary); // Pass the current summary when ending
      await refetch();
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold text-blue-800">Meeting In Progress</div>
          <div className="font-medium text-primary">{meeting.title}</div>
          <div className="text-sm text-gray-600">
            {new Date(meeting.scheduled_at).toLocaleDateString()} at {new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-mono text-blue-900">{timer}</span>
          <span className="text-xs text-gray-500 mt-1">
            {summary !== lastSavedSummary ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Notes & Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter meeting notes, discussion points, decisions made, action items, etc..."
          className="w-full text-black h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={2000}
        />
        <div className="text-xs text-gray-500 mt-1">
          {summary.length}/2000 characters
        </div>
      </div>

      {canEndMeeting && (
        <div className="flex justify-end">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 disabled:opacity-50 font-medium"
            onClick={handleEndMeeting}
            disabled={ending}
          >
            {ending ? 'Ending Meeting...' : 'End Meeting'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingInProgressCard;
