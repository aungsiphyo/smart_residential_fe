import Button from "../../../components/ui/Button";

export default function RevenueCard({ revenueData }) {
  const pendingCollection = revenueData?.pendingCollection || 0;
  const maintenancePercent = revenueData?.maintenancePaidPercent || 0;
  const utilitiesPercent = revenueData?.utilitiesPaidPercent || 0;

  // Format currency
  const formattedPending = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(pendingCollection);

  return (
    <div className="bg-white dark:bg-[#0e1422] p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Revenue Stream</h2>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-100">
            MONTHLY
          </span>
        </div>

        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pending Collection</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-8">
          {formattedPending}
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              <span>Maintenance Fee</span>
              <span className="text-blue-500 font-bold">{maintenancePercent}% Paid</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-800/60 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${maintenancePercent}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              <span>Utilities Pool</span>
              <span className="text-blue-500 font-bold">{utilitiesPercent}% Paid</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-800/60 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${utilitiesPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}