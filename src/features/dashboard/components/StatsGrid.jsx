const stats = [
  { label: "Residents", value: "1,284", icon: "👥", color: "blue", badge: "+4%" },
  { label: "Rooms Avail.", value: "12", icon: "🏠", color: "orange" },
  { label: "Visitors", value: "42", icon: "👤", color: "purple", badge: "LIVE" },
  { label: "Unpaid Bills", value: "28", icon: "📷", color: "red" },
  { label: "Helpers", value: "114", icon: "🧑", color: "green" },
  { label: "Parking Cap.", value: "88%", icon: "P", color: "gray" },
];

const iconBgColors = {
  blue: "bg-blue-100",
  orange: "bg-orange-100",
  purple: "bg-purple-100",
  red: "bg-red-100",
  green: "bg-green-100",
  gray: "bg-gray-100",
};

const badgeColors = {
  "+4%": "bg-green-100 text-green-700",
  "LIVE": "bg-red-100 text-red-700",
};

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${iconBgColors[s.color]} w-10 h-10 flex items-center justify-center rounded-lg`}>
              {s.icon}
            </div>
            {s.badge && (
              <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColors[s.badge] || 'bg-gray-100 text-gray-700'}`}>
                {s.badge}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs font-medium">{s.label}</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">{s.value}</p>
        </div>
      ))}

    </div>
  );
}