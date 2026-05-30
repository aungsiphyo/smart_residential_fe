import React, { useState, useEffect } from "react";
import { getRooms } from "./api";

// 1. Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-[#e2f9e8] text-[#129141]",
    Occupied: "bg-[#fde8e8] text-[#c92b2b]",
    Maintenance: "bg-[#fff7ea] text-[#f4931a]",
  };
  return (
    <div className={`px-[14px] py-[4px] rounded-full text-[11px] font-medium inline-flex items-center justify-center ${styles[status] || "bg-[#f1f3f6] text-[#6d7580]"}`}>
      {status}
    </div>
  );
};

// 2. Custom Dropdown
const CustomDropdown = ({ label, options, value, onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = value || defaultValue;

  return (
    <div className="relative w-full">
      <label className="block text-[10px] font-bold text-[#b0b3b9] uppercase tracking-[0.1em] mb-[6px]">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-white px-[15px] py-[10px] rounded-[10px] border border-[#d1d5db] cursor-pointer"
      >
        <span className="text-[14px] font-semibold text-[#1a1c1e]">{selected}</span>
        <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-[12px] shadow-xl py-1">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
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

const getFloorLabel = (floor) => {
  if (floor === 1) return "Ground Floor";
  if (floor === 2) return "1st Floor";
  if (floor === 3) return "2nd Floor";
  return `${floor}th Floor`;
};

// 3. Main Page
export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [floorFilter, setFloorFilter] = useState("All Floors");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Unable to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = statusFilter === "All Statuses" || room.status === statusFilter;
    const matchesFloor = floorFilter === "All Floors" || getFloorLabel(room.floor) === floorFilter;
    return matchesStatus && matchesFloor;
  });

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
          <CustomDropdown
            label="FLOOR LEVEL"
            options={["All Floors", "Ground Floor", "1st Floor", "2nd Floor"]}
            value={floorFilter}
            onSelect={setFloorFilter}
            defaultValue="All Floors"
          />
        </div>
        <div className="col-span-3">
          <CustomDropdown
            label="OCCUPANCY STATUS"
            options={["All Statuses", "Available", "Occupied", "Maintenance"]}
            value={statusFilter}
            onSelect={setStatusFilter}
            defaultValue="All Statuses"
          />
        </div>
        <div className="col-span-6 bg-[#eff5ff] p-[18px] rounded-[11px] border flex justify-between items-center px-[28px]">
          <div>
            <p className="text-[10px] font-bold text-[#4c84ff]">PROPERTY UTILIZATION</p>
            <h2 className="text-[24px] font-bold text-[#004ada]">
              {rooms.length > 0 ? Math.round(((rooms.filter((room) => room.status !== "Available").length / rooms.length) * 100)) : 0}% Full
            </h2>
          </div>
          <div className="flex gap-[30px]">
            <div className="text-right">
              <p className="text-[11px] text-[#adb1b9]">Available</p>
              <p className="font-bold">{rooms.filter((room) => room.status === "Available").length} Units</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#adb1b9]">Maint.</p>
              <p className="font-bold">{rooms.filter((room) => room.status === "Maintenance").length} Units</p>
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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-[25px] py-[18px] text-center text-gray-500">
                  Loading rooms...
                </td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-[25px] py-[18px] text-center text-gray-500">
                  No rooms found.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room._id} className="text-[13.5px]">
                  <td className="px-[25px] py-[18px] font-bold text-[#004ada]">{room.room_name}</td>
                  <td className="px-[25px] py-[18px]">{getFloorLabel(room.floor)}</td>
                  <td className="px-[25px] py-[18px]">{room.room_type}</td>
                  <td className="px-[25px] py-[18px]"><StatusBadge status={room.status} /></td>
                  <td className="px-[25px] py-[18px] text-right">⋮</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-[25px] py-[20px] flex justify-between items-center border-t border-gray-50 text-[13px] text-gray-400">
          <p>
            Showing <span className="font-semibold text-gray-700">{filteredRooms.length}</span> of <span className="font-semibold text-gray-700">{rooms.length}</span> rooms
          </p>

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