import React from "react";

const history = [
  { date: "2025-05-20 at 3:00 PM", status: "Completed" },
  { date: "2025-05-06 at 1:00 PM", status: "Missed" },
  { date: "2025-04-22 at 11:00 AM", status: "Confirmed" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Missed":
      return "bg-red-100 text-red-700";
    case "Confirmed":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MeetingHistoryCard = () => {
  return (
    <div className="flex-col">
      <h3 className="text-xl font-semibold text-primary mb-4">Meeting History</h3>
      <div className="shadow-md text-black p-4 w-full h-full max-h-[300px] rounded-lg bg-surface">
      <ul className="space-y-2">
        {history.map((meeting, index) => (
          <li key={index} className="flex justify-between items-center border-b pb-2">
            <span>{meeting.date}</span>
            <span className={`px-3 py-1 rounded-md text-sm ${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default MeetingHistoryCard;

