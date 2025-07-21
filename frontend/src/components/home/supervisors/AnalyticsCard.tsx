const AnalyticsCard = () => {
  const data = [
    { label: "Completed", value: 50, color: "#4CAF50" },
    { label: "In Progress", value: 30, color: "#FFC107" },
    { label: "Overdue", value: 20, color: "#F44336" },
  ];

  const radius = 45;
  const center = 50;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const start = (cumulative / total) * 360;
    const end = ((cumulative + d.value) / total) * 360;
    cumulative += d.value;

    const startX = center + radius * Math.cos((Math.PI * start) / 180);
    const startY = center + radius * Math.sin((Math.PI * start) / 180);
    const endX = center + radius * Math.cos((Math.PI * end) / 180);
    const endY = center + radius * Math.sin((Math.PI * end) / 180);
    const largeArc = end - start > 180 ? 1 : 0;

    return (
      <path
        key={i}
        d={`M${center},${center} L${startX},${startY} A${radius},${radius} 0 ${largeArc},1 ${endX},${endY} Z`}
        fill={d.color}
      />
    );
  });

  return (
    <div className="card h-[208px]">
      <h3 className="text-lg font-semibold text-primary mb-4">Meeting Completion</h3>
      <div className="flex items-center justify-between gap-6">
        {/* Legend */}
        <div className="space-y-2 text-sm text-secondary">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color }}
              ></span>
              <span>{d.label} ({d.value}%)</span>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 block">
          {slices}
        </svg>
      </div>
    </div>
  );
};

export default AnalyticsCard;

