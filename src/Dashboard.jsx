export default function Dashboard() {
  return (
    <div className="p-6 bg-[#f7f8fc] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#1e2a78]">
          Urban Pulse Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Monitoring life at Civic Precision Villas • Saturday, May 23 2026
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">👥</div>
          <p className="text-gray-500 mt-4 text-sm">Residents</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">1,284</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">🏠</div>
          <p className="text-gray-500 mt-4 text-sm">Rooms Avail.</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">12</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">👤</div>
          <p className="text-gray-500 mt-4 text-sm">Visitors</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">42</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-xl">💳</div>
          <p className="text-gray-500 mt-4 text-sm">Unpaid Bills</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">28</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-xl">🧑</div>
          <p className="text-gray-500 mt-4 text-sm">Helpers</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">114</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">🚗</div>
          <p className="text-gray-500 mt-4 text-sm">Parking Cap.</p>
          <h2 className="text-3xl font-bold text-[#1e2a78] mt-2">88%</h2>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 h-[420px]">
          <h2 className="text-2xl font-semibold text-gray-800">
            Visitor Traffic Analysis
          </h2>

          <p className="text-gray-400 mt-1 text-sm">
            Weekly entry vs exit flow patterns
          </p>

          <div className="flex items-end justify-between h-[300px] mt-10 px-4">
            {[40, 80, 65, 90, 55, 70, 45].map((height, index) => (
              <div key={index} className="flex flex-col items-center gap-3">

                <div
                  className="w-10 bg-blue-500 rounded-t-xl transition-all"
                  style={{ height: `${height * 2}px` }}
                ></div>

                <span className="text-sm text-gray-400">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index]}
                </span>

              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Revenue Stream</h2>
            <span className="bg-blue-500 px-3 py-1 rounded-lg text-xs">MONTHLY</span>
          </div>

          <p className="text-gray-200 mt-6">Pending Collection</p>
          <h1 className="text-5xl font-bold mt-3">$48,250.00</h1>

          <div className="mt-10">
            <div className="flex justify-between text-sm mb-2">
              <span>Maintenance Fee</span>
              <span>84% Paid</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-3">
              <div className="bg-green-400 h-3 rounded-full w-[84%]"></div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Utilities Pool</span>
              <span>62% Paid</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-3">
              <div className="bg-green-400 h-3 rounded-full w-[62%]"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}