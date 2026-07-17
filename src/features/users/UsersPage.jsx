import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

// ─── Role badge colors ───────────────────────────────────────────────────────
const getRoleColor = (role) => {
  switch (role) {
    case "Admin":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Resident":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Security":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "Staff":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "Helper":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

// ─── Avatar initial letter colors (deterministic by name) ───────────────────
const AVATAR_PALETTES = [
  { bg: "bg-blue-500",    text: "text-white" },
  { bg: "bg-violet-500",  text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-rose-500",    text: "text-white" },
  { bg: "bg-amber-500",   text: "text-white" },
  { bg: "bg-cyan-500",    text: "text-white" },
  { bg: "bg-pink-500",    text: "text-white" },
  { bg: "bg-indigo-500",  text: "text-white" },
];

function getAvatarPalette(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

// ─── UserAvatar component ────────────────────────────────────────────────────
function UserAvatar({ user, size = "sm" }) {
  const sizeClass = size === "sm" ? "w-9 h-9 text-sm" : "w-16 h-16 text-xl";
  const initial = (user?.fullname || "?")[0].toUpperCase();
  const palette = getAvatarPalette(user?.fullname || "");

  if (user?.profile_image) {
    return (
      <img
        src={user.profile_image}
        alt={user.fullname}
        className={`${sizeClass} rounded-full object-cover border-2 border-white/10 flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${palette.bg} ${palette.text} rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-white/10`}
    >
      {initial}
    </div>
  );
}

// ─── Role definitions for the Add User card selector ────────────────────────
const ROLE_DEFS = [
  {
    role: "Resident",
    label: "Resident",
    icon: "🏠",
    desc: "Lives in the building",
    color: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    fields: ["room", "rfid"],
  },
  {
    role: "Admin",
    label: "Admin",
    icon: "🛡️",
    desc: "Full system access",
    color: "border-blue-500 bg-blue-500/10 text-blue-400",
    fields: [],
  },
  {
    role: "Staff",
    label: "Staff",
    icon: "👷",
    desc: "Building operations",
    color: "border-purple-500 bg-purple-500/10 text-purple-400",
    fields: [],
  },
  {
    role: "Helper",
    label: "Helper",
    icon: "🔧",
    desc: "Maintenance & support",
    color: "border-amber-500 bg-amber-500/10 text-amber-400",
    fields: [],
  },
  {
    role: "Security",
    label: "Security",
    icon: "🔒",
    desc: "Access control",
    color: "border-red-500 bg-red-500/10 text-red-400",
    fields: [],
  },
];

// ─── Image compressor (canvas resize → base64 < ~150KB) ─────────────────────
function compressImage(file, maxWidth = 400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── ImageUploadZone ─────────────────────────────────────────────────────────
function ImageUploadZone({ value, onChange }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [imgError, setImgError] = useState("");

  const handleFile = async (file) => {
    setImgError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImgError("Only JPG, PNG, WEBP allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImgError("File must be under 5MB.");
      return;
    }
    try {
      const base64 = await compressImage(file);
      onChange(base64);
    } catch {
      setImgError("Failed to process image.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
        Profile Photo <span className="text-slate-400 normal-case font-normal">(optional)</span>
      </label>

      {value ? (
        <div className="flex items-center gap-4">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-emerald-400 font-semibold">✓ Image selected</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-red-400 hover:text-red-300 font-semibold text-left"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center justify-center cursor-pointer transition-all gap-2
            ${dragOver
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
        >
          <div className="text-3xl">📷</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Click or drag to upload
          </p>
          <p className="text-[10px] text-slate-400">JPG, PNG, WEBP • Max 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {imgError && (
        <p className="text-xs text-red-400 mt-1 font-semibold">{imgError}</p>
      )}
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 placeholder-slate-500";

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Edit modal ──
  const [editingUser, setEditingUser] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // ── Add modal ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Resident");
  const [newUser, setNewUser] = useState({
    fullname: "", email: "", phone: "", password: "",
    room_id: "", rfid_uid: "", profile_image: null,
  });

  const usersPerPage = 6;

  // ── Fetch users ──────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/users");
      const data = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Filtering & pagination ───────────────────────────────────────────────
  const filteredUsers = users.filter((user) => {
    const v = search.toLowerCase();
    const matchesSearch =
      (user.fullname?.toLowerCase().includes(v)) ||
      (user.email?.toLowerCase().includes(v)) ||
      (user.phone?.toLowerCase().includes(v)) ||
      (user.room_id?.toLowerCase().includes(v)) ||
      (user.role?.toLowerCase().includes(v));
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const endIndex = startIndex + currentUsers.length;

  useEffect(() => { setCurrentPage(1); }, [roleFilter, search]);

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setError("");
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      if (currentUsers.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove user.");
    }
  };

  // ── Edit Save ────────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setEditingUser({ ...user });
    setEditImage(user.profile_image || null);
  };

  const handleSave = async () => {
    try {
      setSavingEdit(true);
      setError("");
      const payload = {
        fullname: editingUser.fullname,
        email: editingUser.email,
        phone: editingUser.phone,
        room_id: editingUser.room_id,
        role: editingUser.role,
        profile_image: editImage,
      };
      const res = await api.put(`/admin/users/${editingUser._id}`, payload);
      const updated = res.data.user || { ...editingUser, profile_image: editImage };
      setUsers(users.map((u) => (u._id === editingUser._id ? updated : u)));
      setEditingUser(null);
      setEditImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Add User ─────────────────────────────────────────────────────────────
  const resetAddForm = () => {
    setNewUser({ fullname: "", email: "", phone: "", password: "", room_id: "", rfid_uid: "", profile_image: null });
    setSelectedRole("Resident");
  };

  const handleAddUser = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.phone || !newUser.password) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setError("");
      setAddingUser(true);
      const roleDef = ROLE_DEFS.find((r) => r.role === selectedRole);
      const payload = {
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: selectedRole,
        profile_image: newUser.profile_image || null,
        ...(roleDef?.fields.includes("room") && newUser.room_id
          ? { room_id: newUser.room_id }
          : {}),
        ...(roleDef?.fields.includes("rfid") && newUser.rfid_uid
          ? { rfid_uid: newUser.rfid_uid }
          : {}),
      };
      await api.post("/auth/signup", payload);
      await fetchUsers();
      setShowAddModal(false);
      resetAddForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setAddingUser(false);
    }
  };

  const currentRoleDef = ROLE_DEFS.find((r) => r.role === selectedRole);

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">

      {/* TITLE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage residents, staff, and administrators.</p>
        </div>
        <Button onClick={() => { setShowAddModal(true); setError(""); }}>
          + Add User
        </Button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-medium transition placeholder-slate-500 text-slate-800 dark:text-slate-200"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#0e1422] outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-medium cursor-pointer transition text-slate-800 dark:text-slate-200"
        >
          <option value="All">All Roles</option>
          {ROLE_DEFS.map((r) => (
            <option key={r.role} value={r.role}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg p-16 text-center">
          <div className="animate-pulse mb-2 text-slate-900 dark:text-white font-semibold">Syncing database records...</div>
          <p className="text-xs text-slate-500">Communicating with internal system services.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mt-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="px-6 py-3 font-semibold">Room</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
                    No users match your filter.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    {/* NAME + AVATAR */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} size="sm" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {user.fullname || "Unnamed"}
                        </span>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border inline-flex items-center justify-center ${getRoleColor(user.role)}`}>
                        {user.role || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{user.phone}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-semibold font-mono">
                      {user.room_id || "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <details className="relative inline-block text-left">
                        <summary className="list-none cursor-pointer text-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 select-none outline-none">
                          ⋮
                        </summary>
                        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md z-20 py-1 origin-top-right">
                          <button
                            onClick={() => { setError(""); openEdit(user); }}
                            className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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

          {/* TABLE FOOTER / PAGINATION */}
          <div className="px-6 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400">
            <p>
              Showing{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUsers.length > 0 ? startIndex + 1 : 0}</span>
              {" "}to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredUsers.length}</span>
              {" "}users
            </p>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >{"<"}</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >{">"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          EDIT MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white dark:bg-[#0e1422] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <UserAvatar user={{ ...editingUser, profile_image: editImage }} size="sm" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Edit Profile</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingUser(null); setEditImage(null); }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xl font-bold cursor-pointer"
              >✕</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              <ImageUploadZone value={editImage} onChange={setEditImage} />

              <Field label="Full Name" required>
                <input type="text" value={editingUser.fullname || ""} onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Email Address" required>
                <input type="email" value={editingUser.email || ""} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Phone Number">
                <input type="text" value={editingUser.phone || ""} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Room / Unit">
                <input type="text" value={editingUser.room_id || ""} onChange={(e) => setEditingUser({ ...editingUser, room_id: e.target.value })} className={`${inputClass} font-mono`} />
              </Field>
              <Field label="Role">
                <select
                  value={editingUser.role || "Resident"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={`${inputClass} cursor-pointer bg-white dark:bg-[#0e1422]`}
                >
                  {ROLE_DEFS.map((r) => (
                    <option key={r.role} value={r.role}>{r.icon} {r.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <Button onClick={() => { setEditingUser(null); setEditImage(null); }} variant="secondary">Cancel</Button>
              <Button onClick={handleSave} disabled={savingEdit}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ADD USER MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white dark:bg-[#0e1422] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New User</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a role then fill in the details.</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); resetAddForm(); setError(""); }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xl font-bold cursor-pointer"
              >✕</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              {/* ── Role Card Selector ── */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ROLE_DEFS.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer
                        ${selectedRole === r.role
                          ? r.color + " shadow-md scale-105"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
                        }`}
                    >
                      <span className="text-xl leading-none">{r.icon}</span>
                      <span className={`text-[10px] font-bold leading-none ${selectedRole === r.role ? "" : "text-slate-500 dark:text-slate-400"}`}>
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Description */}
                <p className="text-xs text-slate-400 mt-2 pl-1">
                  {currentRoleDef?.icon} <span className="font-semibold text-slate-500 dark:text-slate-300">{currentRoleDef?.label}:</span> {currentRoleDef?.desc}
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                {/* Image Upload */}
                <ImageUploadZone
                  value={newUser.profile_image}
                  onChange={(v) => setNewUser({ ...newUser, profile_image: v })}
                />

                {/* Common Fields */}
                <Field label="Full Name" required>
                  <input
                    type="text"
                    placeholder="e.g. Aung Si Phyo"
                    value={newUser.fullname}
                    onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    type="text"
                    placeholder="e.g. 09123456789"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Password" required>
                  <input
                    type="password"
                    placeholder="Enter a secure password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                {/* Citizen-only fields */}
                {currentRoleDef?.fields.includes("room") && (
                  <Field label="Room / Unit Reference">
                    <input
                      type="text"
                      placeholder="e.g. A-102"
                      value={newUser.room_id}
                      onChange={(e) => setNewUser({ ...newUser, room_id: e.target.value })}
                      className={`${inputClass} font-mono`}
                    />
                  </Field>
                )}
                {currentRoleDef?.fields.includes("rfid") && (
                  <Field label="RFID Card UID">
                    <input
                      type="text"
                      placeholder="e.g. A1B2C3D4"
                      value={newUser.rfid_uid}
                      onChange={(e) => setNewUser({ ...newUser, rfid_uid: e.target.value })}
                      className={`${inputClass} font-mono uppercase`}
                    />
                  </Field>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={() => { setShowAddModal(false); resetAddForm(); setError(""); }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={addingUser}>
                {addingUser ? "Creating..." : `Create ${currentRoleDef?.label}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}