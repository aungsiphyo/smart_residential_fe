export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">

      {/* Search */}
      <div className="flex-1 max-w-md">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition"
          placeholder="Search residents, rooms or staff..."
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification Bell */}
        <button className="relative text-gray-600 hover:text-gray-900 transition text-xl">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="text-gray-600 hover:text-gray-900 transition text-xl">
          ⚙️
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Alex Thompson</p>
            <p className="text-xs text-gray-500">Chief Administrator</p>
          </div>

          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            AT
          </div>
        </div>

      </div>
    </header>
  );
}