// components/student/UpcomingMeetingCard.tsx
import React from 'react';

const groupedMeetings = {
  '2025-06-05': [
    {
      title: 'Meeting with Dr. Smith',
      time: '10:00 AM',
      description: 'Discuss milestone progress and feedback.',
      status: 'Pending',
    },
    {
      title: 'Check-In with Supervisor',
      time: '3:00 PM',
      description: 'Brief sync on progress.',
      status: 'Pending',
    },
  ],
  '2025-06-06': [
    {
      title: 'Milestone Review',
      time: '1:00 PM',
      description: 'Detailed review of deliverables.',
      status: 'Confirmed',
    },
  ],
};

const UpcomingMeetingCard = () => {
  return (
    <div className='flex-col'>
    <h2 className="text-xl font-semibold text-primary mb-4">Upcoming Meetings</h2>
    <div className="bg-surface p-4 rounded-lg shadow-md w-full h-full overflow-y-auto max-h-[300px]">
      {Object.entries(groupedMeetings).map(([date, meetings]) => {
        const d = new Date(date);
        const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dateNum = d.getDate();

        return (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-center text-primary font-medium">
                <div className="text-xs">{day}</div>
                <div className="text-xl font-bold">{dateNum}</div>
              </div>
              <div className="flex-1 border-t border-muted"></div>
            </div>
            {meetings.map((meeting, idx) => (
              <div
                key={idx}
                className="bg-background-light rounded-lg p-4 mb-3 shadow-sm border-l-4 border-primary"
              >
                <div className="font-semibold text-primary">{meeting.title}</div>
                <div className="text-sm text-secondary">{meeting.time}</div>
                <div className="text-sm text-secondary">{meeting.description}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default UpcomingMeetingCard;

