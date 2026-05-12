import React, { useState } from "react";

// 1. Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    Occupied: "bg-[#e2f9e8] text-[#129141]",
    Vacant: "bg-[#f1f3f6] text-[#6d7580]",
    Maintenance: "bg-[#fff7ea] text-[#f4931a]",
  };
  return (
    <div className={`px-[14px] py-[4px] rounded-full text-[11px] font-medium inline-flex items-center justify-center ${styles[status]}`}>
      {status}
    </div>
  );
};

// 2. Custom Dropdown
const CustomDropdown = ({ label, options, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="relative w-full">
      <label className="block text-[10px] font-bold text-[#b0b3b9] uppercase tracking-[0.1em] mb-[6px]">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-white px-[15px] py-[10px] rounded-[10px] border border-[#d1d5db] cursor-pointer"
      >
        <span className="text-[14px] font-semibold text-[#1a1c1e]">{selected}</span>
        <span className="text-[10px]">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-[12px] shadow-xl py-1">
          {options.map((opt) => (
            <div 
              key={opt} 
              onClick={() => { setSelected(opt); setIsOpen(false); }} 
              className="px-4 py-[10px] text-[13.5px] cursor-pointer hover:bg-gray-50"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Main Page
export default function RoomManagementPage() {
  const rooms = [
    { id: "R-101", floor: "Ground Floor", type: "3BHK Executive Villa", status: "Occupied" },
    { id: "R-102", floor: "Ground Floor", type: "Studio Deluxe", status: "Vacant" },
    { id: "R-205", floor: "1st Floor", type: "4BHK Royal Suite", status: "Maintenance" },
    { id: "R-208", floor: "1st Floor", type: "2BHK Classic", status: "Occupied" },
    { id: "R-301", floor: "2nd Floor", type: "Penthouse Suite", status: "Vacant" },
    { id: "R-304", floor: "2nd Floor", type: "3BHK Executive Villa", status: "Occupied" },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] p-[40px]">
      <div className="flex justify-between items-start mb-[35px]">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a1c1e]">Room Management</h1>
          <p className="text-[#6d727a] text-[14px]">Monitor and manage all residential villa units.</p>
        </div>
        <button className="bg-[#004ada] text-white px-[22px] py-[12px] rounded-[10px] font-bold text-[14px] shadow-md">
          + Add Room
        </button>
      </div>

      <div className="grid grid-cols-12 gap-[18px] mb-[35px]">
        <div className="col-span-3">
          <CustomDropdown label="FLOOR LEVEL" options={["All Floors", "Ground Floor", "1st Floor","2nd Floor"]} defaultValue="All Floors" />
        </div>
        <div className="col-span-3">
          <CustomDropdown label="OCCUPANCY STATUS" options={["All Statuses", "Occupied", "Vacant"]} defaultValue="All Statuses" />
        </div>
        <div className="col-span-6 bg-[#eff5ff] p-[18px] rounded-[11px] border flex justify-between items-center px-[28px]">
          <div>
            <p className="text-[10px] font-bold text-[#4c84ff]">PROPERTY UTILIZATION</p>
            <h2 className="text-[24px] font-bold text-[#004ada]">84% Full</h2>
          </div>
          <div className="flex gap-[30px]">
            <div className="text-right">
              <p className="text-[11px] text-[#adb1b9]">Vacant</p>
              <p className="font-bold">12 Units</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#adb1b9]">Maint.</p>
              <p className="font-bold">04 Units</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="text-[#adb1b9] text-[10px] font-bold border-b bg-gray-50">
            <tr>
              <th className="px-[25px] py-[20px]">ROOM NUMBER</th>
              <th className="px-[25px] py-[20px]">FLOOR</th>
              <th className="px-[25px] py-[20px]">ROOM TYPE</th>
              <th className="px-[25px] py-[20px]">STATUS</th>
              <th className="px-[25px] py-[20px] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.map((room) => (
              <tr key={room.id} className="text-[13.5px]">
                <td className="px-[25px] py-[18px] font-bold text-[#004ada]">{room.id}</td>
                <td className="px-[25px] py-[18px]">{room.floor}</td>
                <td className="px-[25px] py-[18px]">{room.type}</td>
                <td className="px-[25px] py-[18px]"><StatusBadge status={room.status} /></td>
                <td className="px-[25px] py-[18px] text-right">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-[25px] py-[20px] flex justify-between items-center border-t border-gray-50 text-[13px] text-gray-400">
  {/* ဘယ်ဘက်က Showing စာသား */}
  <p>Showing <span className="font-semibold text-gray-700">1 to 6</span> of 48 rooms</p>

  {/* ညာဘက်က Pagination ခလုတ်များ */}
  <div className="flex items-center gap-2">
    <button className="p-2 text-gray-300 hover:text-gray-500">{"<"}</button>
    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#004ada] text-white font-semibold">1</button>
    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">2</button>
    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">3</button>
    <button className="p-2 text-gray-400 hover:text-gray-600 font-bold">{">"}</button>
  </div>
</div>
    </div>
    </div>
  );
}