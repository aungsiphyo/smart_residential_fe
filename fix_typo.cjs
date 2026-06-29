const fs = require('fs');

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

  // Fix typo in hover states
  content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-900\/30/g, 'hover:bg-slate-50 dark:hover:bg-slate-900/30');

  fs.writeFileSync(file, content, 'utf8');
});
console.log("Typo fixed");
