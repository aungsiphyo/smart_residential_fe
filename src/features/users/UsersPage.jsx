import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";

export default function UsersPage() {

  const initialUsers = [
    {
      id: 1,
      fullname: "Alex Sterling",
      role: "Admin",
      email: "alex@civic.com",
      phone: "09 421 567 890",
      room_id: "Office 1",
      roleColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      fullname: "Sarah Williams",
      role: "Citizen",
      email: "sarah@villa.com",
      phone: "09 987 654 321",
      room_id: "Villa A-101",
      roleColor: "bg-green-100 text-green-700",
    },
    {
      id: 3,
      fullname: "John Doe",
      role: "Security",
      email: "john@staff.com",
      phone: "09 555 012 345",
      room_id: "Guard Post",
      roleColor: "bg-red-100 text-red-700",
    },
    {
      id: 4,
      fullname: "Marcus Chen",
      role: "Staff",
      email: "marcus@staff.com",
      phone: "09 444 888 123",
      room_id: "Service Hub",
      roleColor: "bg-purple-100 text-purple-700",
    },
    {
      id: 5,
      fullname: "Emma Brown",
      role: "Citizen",
      email: "emma@villa.com",
      phone: "09 333 222 111",
      room_id: "Villa B-203",
      roleColor: "bg-green-100 text-green-700",
    },
    {
      id: 6,
      fullname: "Daniel Smith",
      role: "Security",
      email: "daniel@staff.com",
      phone: "09 222 333 444",
      room_id: "North Gate",
      roleColor: "bg-red-100 text-red-700",
    },
    {
      id: 7,
      fullname: "Olivia Taylor",
      role: "Admin",
      email: "olivia@civic.com",
      phone: "09 777 888 999",
      room_id: "Office 2",
      roleColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 8,
      fullname: "William Scott",
      role: "Staff",
      email: "william@staff.com",
      phone: "09 666 555 444",
      room_id: "Utility Room",
      roleColor: "bg-purple-100 text-purple-700",
    },
    {
      id: 9,
      fullname: "Sophia Miller",
      role: "Citizen",
      email: "sophia@villa.com",
      phone: "09 111 999 222",
      room_id: "Villa C-105",
      roleColor: "bg-green-100 text-green-700",
    },
    {
      id: 10,
      fullname: "James Wilson",
      role: "Security",
      email: "james@staff.com",
      phone: "09 555 777 111",
      room_id: "Parking Area",
      roleColor: "bg-red-100 text-red-700",
    },
    {
      id: 11,
      fullname: "Charlotte Davis",
      role: "Admin",
      email: "charlotte@civic.com",
      phone: "09 888 666 333",
      room_id: "Main Office",
      roleColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 12,
      fullname: "Benjamin Lee",
      role: "Staff",
      email: "benjamin@staff.com",
      phone: "09 444 222 999",
      room_id: "Repair Center",
      roleColor: "bg-purple-100 text-purple-700",
    },
    {
      id: 13,
      fullname: "Mia Anderson",
      role: "Citizen",
      email: "mia@villa.com",
      phone: "09 101 202 303",
      room_id: "Villa D-401",
      roleColor: "bg-green-100 text-green-700",
    },
    {
      id: 14,
      fullname: "Henry Walker",
      role: "Security",
      email: "henry@staff.com",
      phone: "09 404 505 606",
      room_id: "South Gate",
      roleColor: "bg-red-100 text-red-700",
    },
    {
      id: 15,
      fullname: "Amelia Harris",
      role: "Staff",
      email: "amelia@staff.com",
      phone: "09 909 808 707",
      room_id: "Electrical Room",
      roleColor: "bg-purple-100 text-purple-700",
    },
  ];

  // LOCAL STORAGE
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");

    return savedUsers
      ? JSON.parse(savedUsers)
      : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );
  }, [users]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const usersPerPage = 4;

  // SEARCH + FILTER
  const filteredUsers = users.filter((user) => {

    const value = search.toLowerCase();

    const matchesSearch =
      user.fullname.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.phone.toLowerCase().includes(value) ||
      user.room_id.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value);

    const matchesRole =
      roleFilter === "All" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // PAGINATION
  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const startIndex =
    (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // DELETE
  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      setUsers(
        users.filter(
          (user) => user.id !== id
        )
      );
    }
  };

  // SAVE EDIT
  const handleSave = () => {

    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? editingUser
          : user
      )
    );

    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage villa residents,
            staff, and administrators.
          </p>

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
              className="px-4 py-2 border border-slate-200 rounded-xl"
            >
              <option value="All">
                Filter by Role
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Citizen">
                Citizen
              </option>

              <option value="Staff">
                Staff
              </option>

              <option value="Security">
                Security
              </option>

            </select>

            {/* BUTTON */}
            <Button className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800">
              + Add User
            </Button>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-slate-400 uppercase text-xs">

              <tr>

                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-left">
                  Email
                </th>

                <th className="px-6 py-4 text-left">
                  Phone
                </th>

                <th className="px-6 py-4 text-left">
                  Room
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {currentUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  {/* NAME */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <img
                        src={`https://i.pravatar.cc/40?img=${user.id}`}
                        alt={user.fullname}
                        className="w-10 h-10 rounded-full"
                      />

                      <span className="font-semibold text-slate-800">
                        {user.fullname}
                      </span>

                    </div>

                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${user.roleColor}`}
                    >
                      {user.role}
                    </span>

                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-5 text-slate-500">
                    {user.email}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-5 text-slate-500">
                    {user.phone}
                  </td>

                  {/* ROOM */}
                  <td className="px-6 py-5 text-blue-700 font-medium">
                    {user.room_id}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5 text-right">

                    <details className="relative inline-block">

                      <summary className="list-none cursor-pointer text-xl text-slate-400 hover:text-slate-700">
                        ⋮
                      </summary>

                      <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-10">

                        {/* EDIT */}
                        <button
                          onClick={() =>
                            setEditingUser(user)
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(user.id)
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-red-500"
                        >
                          Delete
                        </button>

                      </div>

                    </details>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4 text-sm text-slate-500">

          <p>
            Showing{" "}

            <span className="font-semibold text-slate-800">
              {currentUsers.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-800">
              {filteredUsers.length}
            </span>

            {" "}users
          </p>

          {/* PAGE BUTTONS */}
          <div className="flex gap-2">

            {Array.from(
              { length: totalPages },
              (_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`w-8 h-8 rounded-lg ${
                    currentPage ===
                    index + 1
                      ? "bg-blue-700 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {index + 1}
                </button>

              )
            )}

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {editingUser && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-4">
              Edit User
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                value={editingUser.fullname}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    fullname:
                      e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-xl"
              />

              <input
                type="text"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    email:
                      e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-xl"
              />

              <input
                type="text"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phone:
                      e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-xl"
              />

              <input
                type="text"
                value={editingUser.room_id}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    room_id:
                      e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-xl"
              />

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setEditingUser(null)
                }
                className="px-4 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-blue-700 text-white"
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