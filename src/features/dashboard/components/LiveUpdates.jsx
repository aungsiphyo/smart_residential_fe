const updates = [
  {
    id: 1,
    title: "Parking Violation: Block B",
    description: "Vehicle XY-402 parked in emergency zone",
    time: "2 mins ago",
    icon: "🚗",
  },
];

export default function LiveUpdates() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">Live Updates</h2>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{update.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{update.title}</p>
                <p className="text-xs text-gray-500 mt-1">{update.description}</p>
                <p className="text-xs text-gray-400 mt-2">{update.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
