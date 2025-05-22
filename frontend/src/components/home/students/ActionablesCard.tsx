const ActionablesCard = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-2">
        AI-Generated Actionables
      </h3>
      <p className="text-sm text-secondary mb-4">
        Get smart summaries and to-dos after each meeting.
      </p>

      <ul className="space-y-3">
        {/* Completed Task */}
        <li className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-xs">
            ✓
          </div>
          <div className="h-5 bg-accent rounded w-full max-w-[160px]"></div>
        </li>

        {/* Incomplete Task */}
        <li className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
          <div className="h-5 bg-accent/60 rounded w-full max-w-[160px]"></div>
        </li>

        {/* Incomplete Task */}
        <li className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
          <div className="h-5 bg-accent/60 rounded w-full max-w-[140px]"></div>
        </li>
      </ul>
    </div>
  );
};

export default ActionablesCard;

