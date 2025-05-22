const notifications = [
  {
    name: "Aaron",
    message: "met with their supervisor today.",
  },
  {
    name: "Jenny",
    message: "hit her Week 3 milestone!",
  },
];

const NotificationsCard = () => {
  return (
    <div className="card h-[208px]">
      <h3 className="text-lg font-semibold text-primary mb-4">Student Activity</h3>
      <div className="space-y-4">
        {notifications.map((n, idx) => (
          <div
            key={idx}
            className="flex items-center bg-primary/70 rounded-md p-2 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white font-semibold mr-4">
              {n.name.charAt(0)}
            </div>
            <p className="text-white text-xs">
              <span className="font-medium text-white">{n.name}</span> {n.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCard;

