import React from "react";

const groupedMeetings = {
  '2025-06-05': [
    {
      title: 'Dr. Smith',
      time: '10:00 AM',
      description: 'Start backend',
    },
    {
      title: 'Prof. Dumbledore',
      time: '3:00 PM',
      description: 'UX Focus',
    },
  ],
  '2025-06-06': [
    {
      title: 'Mr. Strange',
      time: '1:00 PM',
      description: 'Finalize report',
    },
  ],
};

const MeetingTranscriptionsCard = () => {
  return (
    <div className="flex-col">
    <h3 className="text-xl font-semibold text-primary mb-4">Meeting Transcriptions</h3>
    <div className="shadow-md text-black p-4 w-full h-full max-h-[300px] rounded-lg bg-surface">  
      <p className="text-secondary">Coming soon: summaries and action points from past meetings.</p>
    </div>
    </div>
  );
};

export default MeetingTranscriptionsCard;

