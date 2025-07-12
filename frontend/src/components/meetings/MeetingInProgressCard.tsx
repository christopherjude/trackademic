import { useEffect, useState } from "react";
import { useMeetings } from "../../hooks/useMeetings";

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

const MeetingInProgressCard = ({ isSupervisor = false }: { isSupervisor?: boolean }) => {
  const { getInProgressMeeting, endMeeting, refetch } = useMeetings();
  const meeting = getInProgressMeeting();
  const [timer, setTimer] = useState('00:00:00');
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (!meeting?.actual_start_time) return;
    setTimer(getElapsed(meeting.actual_start_time));
    const interval = setInterval(() => {
      setTimer(getElapsed(meeting.actual_start_time!));
    }, 1000);
    return () => clearInterval(interval);
  }, [meeting?.actual_start_time]);

  if (!meeting) return null;

  const handleEndMeeting = async () => {
    setEnding(true);
    try {
      await endMeeting(meeting.id);
      await refetch();
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-yellow-800">Meeting In Progress</div>
          <div className="font-medium text-primary">{meeting.title}</div>
          <div className="text-sm text-gray-600">
            {new Date(meeting.scheduled_at).toLocaleDateString()} at {new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-mono text-yellow-900">{timer}</span>
          {isSupervisor && (
            <button
              className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 disabled:opacity-50"
              onClick={handleEndMeeting}
              disabled={ending}
            >
              {ending ? 'Ending...' : 'End Meeting'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingInProgressCard;
