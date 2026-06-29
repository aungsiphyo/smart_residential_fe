import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

// Dynamic helper to compute Notion-like capsule classes for roles
const getRoleColor = (role) => {
  switch (role) {
    case "Admin":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Citizen":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Security":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "Staff":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    default:
      return "bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800";
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const usersPerPage = 6;

  // 1. GET ALL USERS FROM DATABASE
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.get("/admin/users");
      const data = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. CLIENT-SIDE LIVE FILTER ENGINE
  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    const matchesSearch =
      (user.fullname && user.fullname.toLowerCase().includes(value)) ||
      (user.email && user.email.toLowerCase().includes(value)) ||
      (user.phone && user.phone.toLowerCase().includes(value)) ||
      (user.room_id && user.room_id.toLowerCase().includes(value)) ||
      (user.role && user.role.toLowerCase().includes(value));

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const endIndex = startIndex + currentUsers.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, search]);

  // 3. DELETE USER INTEGRATION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setError("");
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.response?.data?.message || "Could not remove user record.");
    }
  };

  // 4. UPDATE USER SAVE INTEGRATION
  const handleSave = async () => {
    try {
      setError("");
      
      const payload = {
        fullname: editingUser.fullname,
        email: editingUser.email,
        phone: editingUser.phone,
        room_id: editingUser.room_id,
        role: editingUser.role,
      };

      await api.put(`/admin/users/${editingUser._id}`, payload);
      setUsers(users.map((u) => (u._id === editingUser._id ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Update Error:", err);
      setError(err.response?.data?.message || "Failed to update profile updates.");
    }
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage villa residents, staff, and administrators.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name, email, or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-medium transition placeholder-slate-500 text-slate-800 dark:text-slate-200"
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* FILTER */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#0e1422] outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-medium cursor-pointer transition text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Citizen">Citizen</option>
            <option value="Staff">Staff</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* DATA CONDITIONAL AREA */}
      {loading ? (
        <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg p-16 text-center text-slate-500 dark:text-slate-400 font-medium">
          <div className="animate-pulse mb-2 text-slate-900 dark:text-white font-semibold">Syncing database records...</div>
          <p className="text-xs text-slate-500">Communicating with internal system services.</p>
        </div>
      ) : (
        /* TABLE FRAMEWORK */
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
                    No registered data matches your selection rules.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://i.pravatar.cc/40?u=${user._id}`}
                          alt={user.fullname || "User Avatar"}
                          className="w-8 h-8 rounded-full bg-slate-900 object-cover border border-slate-200 dark:border-slate-800"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {user.fullname || "Unnamed Entry"}
                        </span>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border inline-flex items-center justify-center ${getRoleColor(user.role)}`}>
                        {user.role || "Citizen"}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{user.email}</td>

                    {/* PHONE */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{user.phone}</td>

                    {/* ROOM */}
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-semibold font-mono">
                      {user.room_id || "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <details className="relative inline-block text-left">
                        <summary className="list-none cursor-pointer text-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-2 py-1 select-none outline-none">
                          ⋮
                        </summary>

                        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md z-20 py-1 origin-top-right">
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="block w-full text-left px-4 py-2 hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 font-semibold"
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

          {/* FOOTER */}
          <div className="px-6 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400">
            <p>
              Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUsers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredUsers.length}</span> users
            </p>

            {/* PAGE BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-all ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] hover:bg-slate-800"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#0e1422] w-full max-w-md rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Edit User Profile</h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullname || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Room / Unit Reference</label>
                <input
                  type="text"
                  value={editingUser.room_id || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, room_id: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Security Access Level</label>
                <select
                  value={editingUser.role || "Citizen"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 bg-white dark:bg-[#0e1422] transition cursor-pointer text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Admin">Admin</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Staff">Staff</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>

            {/* MODAL DIALOG CONTROLS */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={() => setEditingUser(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}