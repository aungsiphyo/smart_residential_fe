import React, { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "./api";
import Button from "../../components/ui/Button";

// 1. Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Occupied: "bg-red-500/10 text-red-400 border border-red-500/20",
    Maintenance: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <div className={`px-2 py-0.5 rounded text-[10px] font-medium border inline-flex items-center justify-center ${styles[status] || "bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"}`}>
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
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer select-none text-slate-800 dark:text-slate-200 hover:border-slate-700 transition-colors"
      >
        <span>{selected}</span>
        <span className="text-[9px] text-slate-500 dark:text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md py-1 px-1">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2.5 text-sm font-medium rounded-md cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-800 hover:text-slate-900 dark:text-white transition-colors"
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Room Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and manage all residential villa units.</p>
        </div>
        <Button
          onClick={() => {
            setRoomForm(initialRoomForm);
            setEditingRoom(null);
            setIsModalOpen(true);
          }}
        >
          + Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <div className="md:col-span-3">
          <CustomDropdown
            label="FLOOR LEVEL"
            options={["All Floors", "Ground Floor", "1st Floor", "2nd Floor"]}
            value={floorFilter}
            onSelect={setFloorFilter}
            defaultValue="All Floors"
          />
        </div>
        <div className="md:col-span-3">
          <CustomDropdown
            label="OCCUPANCY STATUS"
            options={["All Status", "Available", "Occupied", "Maintenance"]}
            value={statusFilter}
            onSelect={setStatusFilter}
            defaultValue="All Status"
          />
        </div>
        <div className="md:col-span-6 bg-white dark:bg-[#0e1422] p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center px-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">PROPERTY UTILIZATION</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1 font-mono">
              {rooms.length > 0 ? Math.round(((rooms.filter((room) => room.status !== "Available").length / rooms.length) * 100)) : 0}% Full
            </h2>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Available</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{rooms.filter((room) => room.status === "Available").length} Units</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Maint.</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{rooms.filter((room) => room.status === "Maintenance").length} Units</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3 font-semibold">ROOM NUMBER</th>
              <th className="px-6 py-3 font-semibold">FLOOR</th>
              <th className="px-6 py-3 font-semibold">ROOM TYPE</th>
              <th className="px-6 py-3 font-semibold">STATUS</th>
              <th className="px-6 py-3 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  Loading rooms...
                </td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No rooms found.
                </td>
              </tr>
            ) : (
              paginatedRooms.map((room) => (
                <tr key={room._id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4.5 font-semibold text-slate-900 dark:text-white">{room.room_name}</td>
                  <td className="px-6 py-4.5 text-slate-700 dark:text-slate-300 font-medium">{getFloorLabel(room.floor)}</td>
                  <td className="px-6 py-4.5 text-slate-700 dark:text-slate-300 font-medium">{room.room_type}</td>
                  <td className="px-6 py-4.5"><StatusBadge status={room.status} /></td>
                  <td className="px-6 py-4.5 text-right">
                    <details className="relative inline-block text-left">
                      <summary className="list-none cursor-pointer text-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-2 py-1 select-none outline-none">
                        ⋮
                      </summary>
                      <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md z-20 py-1 origin-top-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditRoom(room)}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room._id)}
                          className="block w-full text-left px-4 py-2 hover:bg-red-500/10 text-sm text-red-400 font-semibold border-t border-slate-200 dark:border-slate-800"
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
        <div className="px-6 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400">
          <p>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{paginatedRooms.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredRooms.length}</span> rooms
          </p>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPageSafe === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              {"<"}
            </button>
            {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-all ${page === currentPageSafe ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] hover:bg-slate-800"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPageSafe === pageCount}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {editingRoom ? "Edit Room" : "Add Room"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room Name</label>
                <input
                  required
                  value={roomForm.room_name}
                  onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Floor</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room Type</label>
                  <select
                    required
                    value={roomForm.room_type}
                    onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Office">Office</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  required
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {error && (
                <p className="text-sm font-semibold text-red-400 mt-2">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingRoom ? "Update Room" : "Save Room"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}