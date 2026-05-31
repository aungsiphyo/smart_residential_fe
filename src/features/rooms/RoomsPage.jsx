import React, { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "./api";

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

const initialRoomForm = {
  room_name: "",
  floor: 1,
  room_type: "Standard",
  status: "Available",
};

// 3. Main Page
export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [floorFilter, setFloorFilter] = useState("All Floors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomForm, setRoomForm] = useState(initialRoomForm);
  const [editingRoom, setEditingRoom] = useState(null);

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
    const matchesStatus = statusFilter === "All Status" || room.status === statusFilter;
    const matchesFloor = floorFilter === "All Floors" || getFloorLabel(room.floor) === floorFilter;
    return matchesStatus && matchesFloor;
  });

  const itemsPerPage = 6;
  const pageCount = Math.max(1, Math.ceil(filteredRooms.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, pageCount);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = startIndex + paginatedRooms.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [floorFilter, statusFilter, rooms.length]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setRoomForm(initialRoomForm);
    setError("");
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      room_name: room.room_name || "",
      floor: room.floor || 1,
      room_type: room.room_type || "Standard",
      status: room.status || "Available",
    });
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingRoom) {
        const updated = await updateRoom(editingRoom._id, roomForm);
        setRooms((prev) => prev.map((room) => (room._id === editingRoom._id ? updated : room)));
      } else {
        const created = await createRoom(roomForm);
        setRooms((prev) => [created, ...prev]);
        setCurrentPage(1);
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to save room.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    setError("");
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((room) => room._id !== id));
      if (paginatedRooms.length === 1 && currentPageSafe > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.response?.data?.error || err.message || "Unable to delete room.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-[40px]">
      <div className="flex justify-between items-start mb-[35px]">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a1c1e]">Room Management</h1>
          <p className="text-[#6d727a] text-[14px]">Monitor and manage all residential villa units.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingRoom(null);
            setRoomForm(initialRoomForm);
            setIsModalOpen(true);
          }}
          className="bg-[#004ada] text-white px-[22px] py-[12px] rounded-[10px] font-bold text-[14px] shadow-md hover:bg-[#0031a8]"
        >
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
            options={["All Status", "Available", "Occupied", "Maintenance"]}
            value={statusFilter}
            onSelect={setStatusFilter}
            defaultValue="All Status"
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
              paginatedRooms.map((room) => (
                <tr key={room._id} className="text-[13.5px]">
                  <td className="px-[25px] py-[18px] font-bold text-[#004ada]">{room.room_name}</td>
                  <td className="px-[25px] py-[18px]">{getFloorLabel(room.floor)}</td>
                  <td className="px-[25px] py-[18px]">{room.room_type}</td>
                  <td className="px-[25px] py-[18px]"><StatusBadge status={room.status} /></td>
                  <td className="px-[25px] py-[18px] text-right">
                    <details className="relative inline-block text-left">
                      <summary className="list-none cursor-pointer text-xl text-slate-400 hover:text-slate-700 px-2 py-1 select-none outline-none">
                        ⋮
                      </summary>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditRoom(room)}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room._id)}
                          className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 font-medium border-t border-slate-50"
                        >
                          Delete
                        </button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-[25px] py-[20px] flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-t border-gray-50 text-[13px] text-gray-400">
          <p>
            Showing <span className="font-semibold text-gray-700">{paginatedRooms.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-gray-700">{endIndex}</span> of <span className="font-semibold text-gray-700">{filteredRooms.length}</span> rooms
          </p>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              disabled={currentPageSafe === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              {"<"}
            </button>
            {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold ${page === currentPageSafe ? "bg-[#004ada] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              disabled={currentPageSafe === pageCount}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[18px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1a1c1e]">
                {editingRoom ? "Edit Room" : "Add Room"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Room Name</label>
                <input
                  required
                  value={roomForm.room_name}
                  onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                  className="w-full rounded-[12px] border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Floor</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                    className="w-full rounded-[12px] border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Room Type</label>
                  <select
                    required
                    value={roomForm.room_type}
                    onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                    className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Office">Office</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  required
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-[12px] border border-gray-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-[12px] bg-[#004ada] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0031a8] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingRoom ? "Update Room" : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}