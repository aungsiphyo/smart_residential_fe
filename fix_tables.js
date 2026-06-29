const fs = require('fs');
const glob = require('glob'); // Need to check if available, or just use hardcoded paths

const files = [
  'src/features/reports/ReportsPage.jsx',
  'src/features/visitors/components/VisitorList.jsx',
  'src/features/visitors/VisitorCheckInPage.jsx',
  'src/features/users/UsersPage.jsx',
  'src/features/rooms/RoomsPage.jsx',
  'src/features/sos/SosAlertsPage.jsx',
  'src/features/helpers/HelpersPage.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Containers
  content = content.replace(/bg-\[#0e1422\]/g, 'bg-white dark:bg-[#0e1422]');
  content = content.replace(/border-slate-800(?![\/\w])/g, 'border-slate-200 dark:border-slate-800');
  
  // Table headers
  content = content.replace(/bg-slate-900\/60/g, 'bg-slate-50 dark:bg-slate-900/60');
  content = content.replace(/border-b border-slate-800/g, 'border-b border-slate-200 dark:border-slate-800');
  content = content.replace(/border-t border-slate-800/g, 'border-t border-slate-200 dark:border-slate-800');
  
  // Table bodies
  content = content.replace(/divide-slate-800\/80/g, 'divide-slate-200 dark:divide-slate-800/80');
  
  // Rows
  content = content.replace(/hover:bg-slate-900\/30/g, 'hover:bg-slate-50 dark:hover:bg-slate-900/30');
  
  // Text
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  
  // Modals & Panels
  content = content.replace(/bg-slate-900\/40/g, 'bg-slate-50 dark:bg-slate-900/40');
  content = content.replace(/bg-slate-900\/30/g, 'bg-slate-50 dark:bg-slate-900/30');

  // Specific slate texts
  // For standard td/th text slate-400 to slate-500 in light mode
  content = content.replace(/text-slate-400(?![\/\w])/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-slate-300(?![\/\w])/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/text-slate-200(?![\/\w])/g, 'text-slate-800 dark:text-slate-200');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
});
