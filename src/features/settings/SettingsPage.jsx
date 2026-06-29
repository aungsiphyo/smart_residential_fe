import Button from "../../components/ui/Button";
import useAuthStore from "../../features/auth/authStore";

export default function SettingsPage() {
  const user = useAuthStore(state => state.user);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage system settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-[#0e1422] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text" 
              defaultValue={user?.fullname || ""}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/60 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              defaultValue={user?.email || ""}
              readOnly
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-sm font-medium outline-none text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              defaultValue={user?.phone || ""}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/60 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-5 flex items-center gap-3">
          <Button variant="primary">Save Changes</Button>
          <p className="text-xs text-slate-500 dark:text-slate-400">Profile updates will be implemented in a future release.</p>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-[#0e1422] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Notification Preferences</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/20 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Notifications</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-700 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/20 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">SMS Alerts</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-700 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/20 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Push Notifications</span>
            <input type="checkbox" className="w-4 h-4 accent-blue-700 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-[#0e1422] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Security</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Change Password</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="password" 
                placeholder="New Password"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900/60 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <Button variant="secondary">Change</Button>
            </div>
          </div>
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
            <Button variant="danger">Logout All Devices</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
