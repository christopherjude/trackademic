const SuggestionsCard = () => {
  const actions = [
    { label: "Schedule follow-up with Chris", icon: "📌" },
    { label: "Review Jenny's milestone report", icon: "📄" },
  ];

  return (
    <div className="card h-[208px]">
      <h3 className="text-lg font-semibold text-primary mb-4">Suggested Actions</h3>
      <div className="space-y-2">
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-primary/70 px-4 py-2 rounded-md shadow-sm"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-light text-sm">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsCard;

