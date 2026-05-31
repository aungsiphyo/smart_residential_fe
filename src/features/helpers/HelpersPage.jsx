import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import {
  getHelpers,
  createHelper,
  updateHelper,
  deleteHelper,
  getHelperRequests,
  createHelperRequest,
  updateHelperRequest,
} from "./api";
import { getRooms } from "../rooms/api";

const helperStatusStyle = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
};

const requestStatusStyle = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-700",
};

const initialHelperForm = {
  fullname: "",
  age: "",
  phone: "",
  address: "",
  gender: "Male",
  experience: "",
  nric_number: "",
  nric_photo_url: "",
  status: "Active",
};

const initialRequestForm = {
  room_id: "",
  type: "Cleaning",
  gender_preferred: "No Preference",
  status: "Pending",
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

export default function HelpersPage() {
  const [activeTab, setActiveTab] = useState("helpers");
  const [helpers, setHelpers] = useState([]);
  const [helperLoading, setHelperLoading] = useState(true);
  const [helperError, setHelperError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingHelper, setEditingHelper] = useState(null);
  const [helperForm, setHelperForm] = useState(initialHelperForm);

  const [helperRequests, setHelperRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("All");
  const [requestPage, setRequestPage] = useState(1);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [requestForm, setRequestForm] = useState(initialRequestForm);

  const [rooms, setRooms] = useState([]);

  const fetchHelpers = async () => {
    setHelperLoading(true);
    setHelperError("");
    try {
      const data = await getHelpers();
      setHelpers(data);
    } catch (err) {
      setHelperError(err.response?.data?.error || err.message || "Could not load helpers.");
    } finally {
      setHelperLoading(false);
    }
  };

  const fetchHelperRequests = async () => {
    setRequestLoading(true);
    setRequestError("");
    try {
      const data = await getHelperRequests();
      setHelperRequests(data);
    } catch (err) {
      setRequestError(err.response?.data?.error || err.message || "Could not load helper requests.");
    } finally {
      setRequestLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const roomData = await getRooms();
      setRooms(roomData);
    } catch {
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchHelpers();
    fetchRooms();
    fetchHelperRequests();
  }, []);

  const filteredHelpers = useMemo(() => {
    return helpers.filter((helper) => {
      const matchesSearch =
        helper.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        helper.phone?.toLowerCase().includes(search.toLowerCase()) ||
        helper.address?.toLowerCase().includes(search.toLowerCase()) ||
        helper.nric_number?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || helper.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [helpers, search, statusFilter]);

  const itemsPerPage = 8;
  const pageCount = Math.max(1, Math.ceil(filteredHelpers.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, pageCount);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const paginatedHelpers = filteredHelpers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, helpers.length]);

  const filteredRequests = useMemo(() => {
    return helperRequests.filter((request) => {
      const roomLabel = rooms.find((room) => room._id === request.room_id)?.room_number || rooms.find((room) => room._id === request.room_id)?.name || "";
      const matchesSearch =
        request.type?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        request.gender_preferred?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        roomLabel?.toLowerCase().includes(requestSearch.toLowerCase());

      const matchesStatus = requestStatusFilter === "All" || request.status === requestStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [helperRequests, requestSearch, requestStatusFilter, rooms]);

  const requestItemsPerPage = 8;
  const requestPageCount = Math.max(1, Math.ceil(filteredRequests.length / requestItemsPerPage));
  const requestPageSafe = Math.min(requestPage, requestPageCount);
  const requestStartIndex = (requestPageSafe - 1) * requestItemsPerPage;
  const paginatedRequests = filteredRequests.slice(requestStartIndex, requestStartIndex + requestItemsPerPage);

  useEffect(() => {
    setRequestPage(1);
  }, [requestSearch, requestStatusFilter, helperRequests.length]);

  const openAddHelper = () => {
    setEditingHelper(null);
    setHelperForm(initialHelperForm);
    setHelperError("");
    setIsModalOpen(true);
  };

  const openEditHelper = (helper) => {
    setEditingHelper(helper);
    setHelperForm({
      fullname: helper.fullname || "",
      age: helper.age || "",
      phone: helper.phone || "",
      address: helper.address || "",
      gender: helper.gender || "Male",
      experience: helper.experience || "",
      nric_number: helper.nric_number || "",
      nric_photo_url: helper.nric_photo_url || "",
      status: helper.status || "Active",
    });
    setHelperError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHelper(null);
    setHelperForm(initialHelperForm);
    setHelperError("");
  };

  const handleSaveHelper = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setHelperError("");

    try {
      if (editingHelper) {
        const updated = await updateHelper(editingHelper._id, {
          ...helperForm,
          age: Number(helperForm.age),
          experience: Number(helperForm.experience),
        });
        setHelpers((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      } else {
        const created = await createHelper({
          ...helperForm,
          age: Number(helperForm.age),
          experience: Number(helperForm.experience),
        });
        setHelpers((prev) => [created, ...prev]);
        setCurrentPage(1);
      }
      closeModal();
    } catch (err) {
      setHelperError(err.response?.data?.error || err.message || "Unable to save helper.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHelper = async (id) => {
    const confirmed = window.confirm("Delete this helper? This cannot be undone.");
    if (!confirmed) return;

    setHelperError("");
    try {
      await deleteHelper(id);
      setHelpers((prev) => prev.filter((helper) => helper._id !== id));
      if (paginatedHelpers.length === 1 && currentPageSafe > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      setHelperError(err.response?.data?.error || err.message || "Unable to delete helper.");
    }
  };

  const openAddRequest = () => {
    setEditingRequest(null);
    setRequestForm(initialRequestForm);
    setRequestError("");
    setIsRequestModalOpen(true);
  };

  const openEditRequest = (request) => {
    setEditingRequest(request);
    setRequestForm({
      room_id: request.room_id || "",
      type: request.type || "Cleaning",
      gender_preferred: request.gender_preferred || "No Preference",
      status: request.status || "Pending",
    });
    setRequestError("");
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setEditingRequest(null);
    setRequestForm(initialRequestForm);
    setRequestError("");
  };

  const handleSaveRequest = async (event) => {
    event.preventDefault();
    setRequestSubmitting(true);
    setRequestError("");

    try {
      if (editingRequest) {
        const updated = await updateHelperRequest(editingRequest._id, requestForm);
        setHelperRequests((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      } else {
        const created = await createHelperRequest(requestForm);
        setHelperRequests((prev) => [created, ...prev]);
        setRequestPage(1);
      }
      closeRequestModal();
    } catch (err) {
      setRequestError(err.response?.data?.error || err.message || "Unable to save request.");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Helpers Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage helper staff records and credential data.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("helpers")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === "helpers" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Helpers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === "requests" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Requests
          </button>
        </div>
      </div>

      {activeTab === "helpers" ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-2 shadow-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, address or NRIC"
                className="w-full min-w-[220px] bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button onClick={openAddHelper}>+ Add Helper</Button>
          </div>

          {helperError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {helperError}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-[0.15em] text-gray-500">
                <tr>
                  <th className="px-6 py-4">Helper</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">NRIC</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {helperLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      Loading helpers...
                    </td>
                  </tr>
                ) : paginatedHelpers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      No helpers found.
                    </td>
                  </tr>
                ) : (
                  paginatedHelpers.map((helper) => (
                    <tr key={helper._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={helper.nric_photo_url || "https://via.placeholder.com/64?text=Photo"}
                            alt={helper.fullname}
                            className="h-14 w-14 rounded-2xl object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{helper.fullname}</p>
                            <p className="text-sm text-gray-500">{helper.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{helper.phone}</p>
                        <p className="text-sm text-gray-500">{helper.gender}, {helper.age || "—"} yrs</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{helper.experience ?? 0} yrs</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{helper.nric_number || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${helperStatusStyle[helper.status] || "bg-gray-100 text-gray-700"}`}>
                          {helper.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <details className="relative inline-block text-left">
                          <summary className="list-none cursor-pointer text-xl text-slate-400 hover:text-slate-700 px-2 py-1 select-none outline-none">
                            ⋮
                          </summary>
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-1">
                            <button
                              type="button"
                              onClick={() => openEditHelper(helper)}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHelper(helper._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
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

            <div className="flex flex-col gap-3 justify-between border-t border-gray-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-600">
                Showing {paginatedHelpers.length > 0 ? startIndex + 1 : 0} to {startIndex + paginatedHelpers.length} of {filteredHelpers.length} helpers
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPageSafe === 1}
                  className={currentPageSafe === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Prev
                </Button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold ${currentPageSafe === index + 1 ? "bg-blue-600 text-white" : "text-slate-600 bg-white border border-gray-200 hover:bg-gray-100"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={currentPageSafe === pageCount}
                  className={currentPageSafe === pageCount ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-2 shadow-sm">
              <input
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search type, room or preference"
                className="w-full min-w-[220px] bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <Button onClick={openAddRequest}>+ Add Request</Button>
          </div>

          {requestError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {requestError}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-[0.15em] text-gray-500">
                <tr>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Preferred</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Requested</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requestLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      Loading requests...
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      No helper requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => {
                    const roomLabel = rooms.find((room) => room._id === request.room_id)?.room_number || rooms.find((room) => room._id === request.room_id)?.name || request.room_id;
                    return (
                      <tr key={request._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{roomLabel}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{request.type}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{request.gender_preferred}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${requestStatusStyle[request.status] || "bg-gray-100 text-gray-700"}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(request.created_at)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openEditRequest(request)}
                            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="flex flex-col gap-3 justify-between border-t border-gray-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-600">
                Showing {paginatedRequests.length > 0 ? requestStartIndex + 1 : 0} to {requestStartIndex + paginatedRequests.length} of {filteredRequests.length} requests
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setRequestPage((prev) => Math.max(prev - 1, 1))}
                  disabled={requestPageSafe === 1}
                  className={requestPageSafe === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Prev
                </Button>
                {Array.from({ length: requestPageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRequestPage(index + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold ${requestPageSafe === index + 1 ? "bg-blue-600 text-white" : "text-slate-600 bg-white border border-gray-200 hover:bg-gray-100"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setRequestPage((prev) => Math.min(prev + 1, requestPageCount))}
                  disabled={requestPageSafe === requestPageCount}
                  className={requestPageSafe === requestPageCount ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingHelper ? "Edit Helper" : "Add Helper"}</h2>
                <p className="text-sm text-gray-500">Use real helper profile data from the database.</p>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleSaveHelper} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  required
                  value={helperForm.fullname}
                  onChange={(e) => setHelperForm({ ...helperForm, fullname: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  required
                  value={helperForm.phone}
                  onChange={(e) => setHelperForm({ ...helperForm, phone: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <input
                  required
                  value={helperForm.address}
                  onChange={(e) => setHelperForm({ ...helperForm, address: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  value={helperForm.gender}
                  onChange={(e) => setHelperForm({ ...helperForm, gender: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Age</label>
                <input
                  type="number"
                  min={18}
                  value={helperForm.age}
                  onChange={(e) => setHelperForm({ ...helperForm, age: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Experience (Years)</label>
                <input
                  type="number"
                  min={0}
                  value={helperForm.experience}
                  onChange={(e) => setHelperForm({ ...helperForm, experience: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">NRIC Number</label>
                <input
                  required
                  value={helperForm.nric_number}
                  onChange={(e) => setHelperForm({ ...helperForm, nric_number: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">NRIC Image URL</label>
                <input
                  value={helperForm.nric_photo_url}
                  onChange={(e) => setHelperForm({ ...helperForm, nric_photo_url: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={helperForm.status}
                  onChange={(e) => setHelperForm({ ...helperForm, status: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {helperError && (
                <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {helperError}
                </div>
              )}

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingHelper ? "Update Helper" : "Create Helper"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingRequest ? "Edit Request" : "Add Request"}</h2>
                <p className="text-sm text-gray-500">Create or update a helper service request.</p>
              </div>
              <button type="button" onClick={closeRequestModal} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleSaveRequest} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Room</label>
                <select
                  required
                  value={requestForm.room_id}
                  onChange={(e) => setRequestForm({ ...requestForm, room_id: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.room_number || room.name || room._id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Request Type</label>
                <select
                  required
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender Preference</label>
                <select
                  value={requestForm.gender_preferred}
                  onChange={(e) => setRequestForm({ ...requestForm, gender_preferred: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={requestForm.status}
                  onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {requestError && (
                <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {requestError}
                </div>
              )}

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeRequestModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={requestSubmitting}>
                  {requestSubmitting ? "Saving..." : editingRequest ? "Update Request" : "Create Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
