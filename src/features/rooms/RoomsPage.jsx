import React, { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "./api";
import Button from "../../components/ui/Button";

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const config = {
    Available: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    Occupied: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      dot: "bg-red-400",
    },
    Maintenance: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
  };
  const s = config[status] || config.Available;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {status}
    </span>
  );
};

/* ─── Dropdown ─── */
const CustomDropdown = ({ label, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer select-none text-slate-800 dark:text-slate-200 hover:border-slate-700 transition-colors"
      >
        <span>{value}</span>
        <span className="text-[9px] text-slate-500 dark:text-slate-400">
          {isOpen ? "▲" : "▼"}
        </span>
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
              className="px-4 py-2.5 text-sm font-medium rounded-md cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Helpers ─── */
const getFloorLabel = (floor) => {
  if (floor === 1) return "Ground Floor";
  if (floor === 2) return "1st Floor";
  if (floor === 3) return "2nd Floor";
  if (floor === 4) return "3rd Floor";
  return `${floor - 1}th Floor`;
};

const getBuilding = (room) =>
  room.building || room.room_name?.split("-")[0] || "A";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initialForm = {
  room_name: "",
  building: "A",
  floor: 1,
  room_type: "Standard",
  status: "Available",
};

/* ─── Stat Item ─── */
const StatItem = ({ label, count, color }) => (
  <div className="text-center">
    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
      {label}
    </p>
    <p className={`font-bold text-lg ${color}`}>{count}</p>
  </div>
);

/* ─── Detail Row ─── */
const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

/* ─── Room Card ─── */
const RoomCard = ({ room, onClick }) => {
  const borderColors = {
    Available: "border-l-emerald-400",
    Occupied: "border-l-red-400",
    Maintenance: "border-l-amber-400",
  };

  return (
    <div
      onClick={() => onClick(room)}
      className={`bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 border-l-[3px] ${borderColors[room.status] || "border-l-slate-400"} p-4 cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
          {room.room_name}
        </h3>
        <StatusBadge status={room.status} />
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {room.room_type}
      </p>
      {room.status === "Occupied" && room.owner_name && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-xs">👤</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
            {room.owner_name}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Detail Modal ─── */
const RoomDetailModal = ({ room, onClose, onEdit, onDelete }) => {
  if (!room) return null;

  const resident =
    room.resident_id && typeof room.resident_id === "object"
      ? room.resident_id
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 shadow-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {room.room_name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Room Details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-1 overflow-y-auto">
          <DetailRow label="Room Name" value={room.room_name} />
          <DetailRow label="Building" value={`Building ${getBuilding(room)}`} />
          <DetailRow label="Floor" value={getFloorLabel(room.floor)} />
          <DetailRow label="Room Type" value={room.room_type} />
          <DetailRow label="Status" value={<StatusBadge status={room.status} />} />
          <DetailRow label="Owner" value={room.owner_name || "—"} />

          {resident && (
            <>
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Resident Info
                </p>
              </div>
              <DetailRow label="Name" value={resident.fullname || "—"} />
              <DetailRow label="Email" value={resident.email || "—"} />
              <DetailRow label="Phone" value={resident.phone || "—"} />
              <DetailRow label="Role" value={resident.role || "—"} />
              <DetailRow
                label="Resident UID"
                value={resident.resident_uid || "—"}
              />
            </>
          )}

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Timestamps
            </p>
          </div>
          <DetailRow label="Created" value={formatDate(room.createdAt)} />
          <DetailRow label="Updated" value={formatDate(room.updatedAt)} />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <Button variant="danger" onClick={() => onDelete(room._id)}>
            Delete
          </Button>
          <Button onClick={() => onEdit(room)}>Edit</Button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════ */
export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Filters
  const [floorFilter, setFloorFilter] = useState("All Floors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ─ Fetch ─ */
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Unable to load rooms.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─ Derived data ─ */
  const filteredRooms = rooms.filter((room) => {
    const matchesStatus =
      statusFilter === "All Status" || room.status === statusFilter;
    const matchesFloor =
      floorFilter === "All Floors" ||
      getFloorLabel(room.floor) === floorFilter;
    const matchesBuilding =
      buildingFilter === "All Buildings" ||
      getBuilding(room) === buildingFilter;
    return matchesStatus && matchesFloor && matchesBuilding;
  });

  const buildings = [...new Set(rooms.map((r) => getBuilding(r)))].sort();
  const floors = [...new Set(rooms.map((r) => r.floor))].sort(
    (a, b) => a - b,
  );

  // Group filtered rooms: building → floor → rooms[]
  const groupedRooms = {};
  filteredRooms.forEach((room) => {
    const b = getBuilding(room);
    if (!groupedRooms[b]) groupedRooms[b] = {};
    if (!groupedRooms[b][room.floor]) groupedRooms[b][room.floor] = [];
    groupedRooms[b][room.floor].push(room);
  });

  // Stats
  const availableCount = rooms.filter(
    (r) => r.status === "Available",
  ).length;
  const occupiedCount = rooms.filter((r) => r.status === "Occupied").length;
  const maintenanceCount = rooms.filter(
    (r) => r.status === "Maintenance",
  ).length;
  const occupancyPercent =
    rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  // Filter options (dynamic)
  const floorOptions = ["All Floors", ...floors.map((f) => getFloorLabel(f))];
  const buildingOptions = ["All Buildings", ...buildings];

  /* ─ Handlers ─ */
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingRoom(null);
    setRoomForm(initialForm);
    setFormError("");
  };

  const handleOpenAdd = () => {
    setRoomForm(initialForm);
    setEditingRoom(null);
    setFormError("");
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(null);
    setEditingRoom(room);
    setRoomForm({
      room_name: room.room_name || "",
      building: getBuilding(room),
      floor: room.floor || 1,
      room_type: room.room_type || "Standard",
      status: room.status || "Available",
    });
    setFormError("");
    setIsFormModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      if (editingRoom) {
        const updated = await updateRoom(editingRoom._id, roomForm);
        setRooms((prev) =>
          prev.map((r) => (r._id === editingRoom._id ? updated : r)),
        );
      } else {
        const created = await createRoom(roomForm);
        setRooms((prev) => [created, ...prev]);
      }
      closeFormModal();
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unable to save room.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setError("");
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      setSelectedRoom(null);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Unable to delete room.",
      );
    }
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Room Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Monitor and manage all residential villa units.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>+ Add Room</Button>
      </div>

      {/* ── Filters + Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-2">
          <CustomDropdown
            label="BUILDING"
            options={buildingOptions}
            value={buildingFilter}
            onSelect={setBuildingFilter}
          />
        </div>
        <div className="md:col-span-2">
          <CustomDropdown
            label="FLOOR LEVEL"
            options={floorOptions}
            value={floorFilter}
            onSelect={setFloorFilter}
          />
        </div>
        <div className="md:col-span-2">
          <CustomDropdown
            label="STATUS"
            options={["All Status", "Available", "Occupied", "Maintenance"]}
            value={statusFilter}
            onSelect={setStatusFilter}
          />
        </div>
        <div className="md:col-span-6 bg-white dark:bg-[#0e1422] p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center px-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              OCCUPANCY
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {occupancyPercent}% Full
            </h2>
          </div>
          <div className="flex gap-5">
            <StatItem
              label="Available"
              count={availableCount}
              color="text-emerald-400"
            />
            <StatItem
              label="Occupied"
              count={occupiedCount}
              color="text-red-400"
            />
            <StatItem
              label="Maint."
              count={maintenanceCount}
              color="text-amber-400"
            />
          </div>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* ── Room Cards (Building → Floor → Grid) ── */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 font-medium">
          Loading rooms...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 font-medium">
          No rooms found.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedRooms)
            .sort()
            .map((building) => (
              <div key={building} className="space-y-5">
                {/* Building header */}
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Building {building}
                </h2>

                {Object.keys(groupedRooms[building])
                  .sort((a, b) => Number(a) - Number(b))
                  .map((floor) => (
                    <div key={floor} className="ml-4">
                      {/* Floor label */}
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        {getFloorLabel(Number(floor))}
                      </p>

                      {/* 4-column card grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {groupedRooms[building][floor].map((room) => (
                          <RoomCard
                            key={room._id}
                            room={room}
                            onClick={setSelectedRoom}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ── Add / Edit Form Modal ── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {editingRoom ? "Edit Room" : "Add Room"}
              </h2>
              <button
                type="button"
                onClick={closeFormModal}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Room Name
                </label>
                <input
                  required
                  value={roomForm.room_name}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, room_name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Building
                  </label>
                  <input
                    required
                    value={roomForm.building}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, building: e.target.value })
                    }
                    placeholder="A"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Floor
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={roomForm.floor}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        floor: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Room Type
                  </label>
                  <select
                    required
                    value={roomForm.room_type}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, room_type: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Business">Business</option>
                    <option value="Office">Office</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  required
                  value={roomForm.status}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm font-semibold text-red-400 mt-2">
                  ⚠️ {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="secondary" onClick={closeFormModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingRoom
                      ? "Update Room"
                      : "Save Room"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}