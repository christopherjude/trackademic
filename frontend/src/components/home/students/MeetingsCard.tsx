const MeetingsCard = () => {
    return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Encouraging regular supervisor meetings
      </h3>
      <div className="flex flex-col gap-2 text-sm text-secondary">
        <div className="flex justify-between">
          <span>8am</span>
          <div className="h-4 w-40 bg-neutral-light/30 rounded"></div>
        </div>
        <div className="flex justify-between">
          <span>9am</span>
          <div className="h-4 w-40 bg-neutral-light/30 rounded"></div>
        </div>
        <div className="flex justify-between">
          <span>10am</span>
          <div className="h-4 w-40 rounded bg-primary/60 border border-primary animate-pulse"></div>
        </div>
        <div className="flex justify-between">
          <span>11am</span>
          <div className="h-4 w-40 bg-neutral-light/30 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsCard;
