const fs = require('fs');

const files = [
  'src/features/bills/BillsPage.jsx',
  'src/features/bills/UserBillsPage.jsx',
  'src/features/dashboard/DashboardPage.jsx',
  'src/features/dashboard/components/StatsGrid.jsx',
  'src/features/dashboard/components/VisitorChart.jsx',
  'src/features/dashboard/components/RevenueCard.jsx',
  'src/features/dashboard/components/LiveUpdates.jsx',
  'src/features/dashboard/components/AnnouncementList.jsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log("Not found:", filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-\[#f8f9fc\](?! dark:)/g, 'bg-[#f8f9fc] dark:bg-transparent');
  content = content.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-[#0e1422]');
  content = content.replace(/bg-gray-100(?! dark:)/g, 'bg-gray-100 dark:bg-slate-800/60');
  content = content.replace(/bg-gray-50(?! dark:)/g, 'bg-gray-50 dark:bg-slate-900/40');
  content = content.replace(/bg-indigo-50(?! dark:)/g, 'bg-indigo-50 dark:bg-indigo-900/30');

  // Borders
  content = content.replace(/border-gray-100(?! dark:)/g, 'border-gray-100 dark:border-slate-800');
  content = content.replace(/border-gray-200(?! dark:)/g, 'border-gray-200 dark:border-slate-700/80');
  content = content.replace(/border-gray-300(?! dark:)/g, 'border-gray-300 dark:border-slate-700');
  content = content.replace(/border-indigo-100(?! dark:)/g, 'border-indigo-100 dark:border-indigo-900/50');

  // Text colors
  content = content.replace(/text-gray-900(?! dark:)/g, 'text-gray-900 dark:text-white');
  content = content.replace(/text-gray-700(?! dark:)/g, 'text-gray-700 dark:text-slate-300');
  content = content.replace(/text-gray-600(?! dark:)/g, 'text-gray-600 dark:text-slate-300');
  content = content.replace(/text-gray-500(?! dark:)/g, 'text-gray-500 dark:text-slate-400');
  content = content.replace(/text-gray-400(?! dark:)/g, 'text-gray-400 dark:text-slate-500');

  // Hover states
  content = content.replace(/hover:bg-gray-50(?! dark:)/g, 'hover:bg-gray-50 dark:hover:bg-slate-800/50');
  content = content.replace(/hover:bg-indigo-100(?! dark:)/g, 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Updated", filePath);
});
