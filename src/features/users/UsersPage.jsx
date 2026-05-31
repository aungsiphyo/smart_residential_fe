import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

// Dynamic helper to compute Tailwind utility classes for the roles
const getRoleColor = (role) => {
  switch (role) {
    case "Admin":
      return "bg-blue-100 text-blue-700";
    case "Citizen":
      return "bg-green-100 text-green-700";
    case "Security":
      return "bg-red-100 text-red-700";
    case "Staff":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function UsersPage() {
  // State definitions linked to MongoDB backend data structures
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const usersPerPage = 4;

  // 1. GET ALL USERS FROM DATABASE
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.get("/admin/users");
      
      // Safety check to handle data array formatting variations
      const data = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial loading fetch once on component mount
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

  // 3. DELETE USER INTEGRATION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setError("");
      // Hitting the backend deletion route using Mongoose database string matching
      await api.delete(`/admin/users/${id}`);
      
      // Update local view cleanly without full page refresh
      setUsers(users.filter((user) => user._id !== id));
      
      // Reset page boundary index if item deletion isolates an empty trailing page
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

      // Push sanitized payload changes directly up to the database object context
      await api.put(`/admin/users/${editingUser._id}`, payload);

      // Re-map localized display rows instantly 
      setUsers(users.map((u) => (u._id === editingUser._id ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Update Error:", err);
      setError(err.response?.data?.message || "Failed to update profile updates.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage villa residents, staff, and administrators.</p>
          
          {/* Real-time system errors display panel */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* TOP BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center mb-4">
          
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by name, email, or room..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-96 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
          />

            <div className="flex items-center gap-3">
            
            {/* FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Filter by Role</option>
              <option value="Admin">Admin</option>
              <option value="Citizen">Citizen</option>
              <option value="Staff">Staff</option>
              <option value="Security">Security</option>
            </select>

            {/* (Add User button removed) */}
          </div>
        </div>

        {/* DATA CONDITIONAL AREA */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-500 font-medium">
            <div className="animate-pulse mb-2">Syncing database arrays...</div>
            <p className="text-xs text-slate-400">Communicating with internal system services.</p>
          </div>
        ) : (
          /* TABLE FRAMEWORK */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Room</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No registered data matches your selection rules.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* NAME */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?u=${user._id}`}
                            alt={user.fullname || "User Avatar"}
                            className="w-10 h-10 rounded-full bg-slate-100"
                          />
                          <span className="font-semibold text-slate-800">
                            {user.fullname || "Unnamed Entry"}
                          </span>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getRoleColor(user.role)}`}>
                          {user.role || "Citizen"}
                        </span>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-5 text-slate-500">{user.email}</td>

                      {/* PHONE */}
                      <td className="px-6 py-5 text-slate-500">{user.phone}</td>

                      {/* ROOM */}
                      <td className="px-6 py-5 text-blue-700 font-semibold">
                        {user.room_id || "N/A"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 text-right">
                        <details className="relative inline-block text-left">
                          <summary className="list-none cursor-pointer text-xl text-slate-400 hover:text-slate-700 px-2 py-1 select-none outline-none">
                            ⋮
                          </summary>

                          <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 origin-top-right">
                            {/* EDIT ROW ACTION */}
                            <button
                              onClick={() => setEditingUser({ ...user })}
                              className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium"
                            >
                              Edit
                            </button>
                            {/* DELETE ROW ACTION */}
                            <button
                              onClick={() => handleDelete(user._id)}
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
          </div>
        )}

        {/* FOOTER */}
        {!loading && (
          <div className="flex justify-between items-center mt-4 text-sm text-slate-500">
            <p>
              Showing{" "}
              <span className="font-semibold text-slate-800">{currentUsers.length}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">{filteredUsers.length}</span>{" "}
              users
            </p>

            {/* PAGE BUTTONS */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-lg font-medium transition-all ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-white shadow-sm shadow-blue-200"
                      : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Edit User Profile</h2>
            <p className="text-xs text-slate-400 mb-4">Modify system parameters associated with this specific document reference.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullname || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-2 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-2 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-2 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room / Unit Reference</label>
                <input
                  type="text"
                  value={editingUser.room_id || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, room_id: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-2 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Access Level</label>
                <select
                  value={editingUser.role || "Citizen"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-2 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all cursor-pointer text-slate-800 font-medium"
                >
                  <option value="Admin">Admin</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Staff">Staff</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>

            {/* MODAL DIALOG CONTROLS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-slate-600 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm transition-colors shadow-md shadow-blue-100"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}