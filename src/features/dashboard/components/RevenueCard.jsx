import Button from "../../../components/ui/Button";

export default function RevenueCard() {
  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 rounded-xl shadow-lg">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Revenue Stream</h2>
        <Button variant="badge" size="sm" className="bg-blue-600 text-white hover:bg-blue-500">
          MONTHLY
        </Button>
      </div>

      <p className="text-sm text-blue-100 mb-4">Pending Collection</p>

      <p className="text-4xl font-bold mb-6">
        $48,250.00
      </p>

      <div className="space-y-4">

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Maintenance Fee</span>
            <span className="text-sm font-bold">84% Paid</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: '84%' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Utilities Pool</span>
            <span className="text-sm font-bold">62% Paid</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>

      </div>

    </div>
  );
}