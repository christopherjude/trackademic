const MilestonesCard = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-2">
        Project Milestones
      </h3>
      <p className="text-sm text-secondary mb-4">
        Helping students hit key project milestones efficiently.
      </p>

      <div className="flex flex-col gap-2 mt-2">
        <div className="ml-0 h-4 w-24 bg-accent rounded"></div>
        <div className="ml-4 h-4 w-28 bg-primary/70 rounded"></div>
        <div className="ml-8 h-4 w-20 bg-secondary/70 rounded"></div>
        <div className="ml-12 h-4 w-24 bg-muted/60 rounded"></div>
      </div>
    </div>
  );
};

export default MilestonesCard;

