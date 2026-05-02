import Button from "../../../components/ui/Button";

export default function VisitorChart() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const data = [30, 60, 40, 80, 50, 70, 35];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">
            Visitor Traffic Analysis
          </h2>
          <p className="text-sm text-gray-500 mt-1">Weekly entry vs exit flow patterns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">Scheduled</Button>
          <Button variant="outline" size="sm">Walk-in</Button>
        </div>
      </div>

      <div className="h-64 flex items-end gap-3">
        {data.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition hover:opacity-80 cursor-pointer"
              style={{ height: `${h}%` }}
            />
            <p className="text-xs font-semibold text-gray-600">{days[i]}</p>
          </div>
        ))}
      </div>

    </div>
  );
}