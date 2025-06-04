const dummyTranscriptions = [
  {
    title: "Meeting with Dr. Smith",
    time: "2025-05-20 at 3:00 PM",
    summary: "Discussed milestone progress and outlined next deliverables.",
    highlights: ["Reviewed research goals", "Discussed upcoming deadlines"],
    actionItems: ["Submit revised abstract", "Share reading list by Friday"],
  },
  {
    title: "Check-In with Supervisor",
    time: "2025-05-06 at 1:00 PM",
    summary: "Quick review of last week's tasks and blockers.",
    highlights: ["Reviewed progress on literature review"],
    actionItems: ["Finish Zotero tagging", "Draft intro paragraph"],
  },
  {
    title: "Initial Planning Meeting",
    time: "2025-04-22 at 11:00 AM",
    summary: "Kickoff meeting to align expectations and tools.",
    highlights: ["Set up shared Notion board", "Agreed on weekly check-ins"],
    actionItems: ["Schedule recurring meetings", "Upload initial notes"],
  },
];

const MeetingTranscriptionsCard = () => {
  return (
    <div className="flex-col w-full">
      <h3 className="text-lg font-semibold text-primary mb-4">Meeting Transcriptions</h3>
      <div className="bg-white p-4 rounded-lg shadow-md max-h-[300px] overflow-y-auto space-y-4">
        {dummyTranscriptions.map((item, index) => (
          <div
            key={index}
            className="bg-background-light p-4 rounded-md shadow-sm border-l-4 border-secondary"
          >
            <p className="text-base font-semibold text-primary">{item.title}</p>
            <p className="text-sm text-secondary mb-2">{item.time}</p>
            <p className="text-sm text-gray-800 mb-2">{item.summary}</p>

            <div className="text-sm text-gray-700 mb-2">
              <p className="font-semibold mb-1">Highlights:</p>
              <ul className="list-disc list-inside space-y-1">
                {item.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Action Points:</p>
              <ul className="list-disc list-inside space-y-1">
                {item.actionItems.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingTranscriptionsCard;

