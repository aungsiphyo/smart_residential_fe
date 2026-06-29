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
  Active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const requestStatusStyle = {
  Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "In Progress": "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
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

  const itemsPerPage = 6;
  const pageCount = Math.max(1, Math.ceil(filteredHelpers.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, pageCount);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const paginatedHelpers = filteredHelpers.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = startIndex + paginatedHelpers.length;

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

  const requestItemsPerPage = 6;
  const requestPageCount = Math.max(1, Math.ceil(filteredRequests.length / requestItemsPerPage));
  const requestPageSafe = Math.min(requestPage, requestPageCount);
  const requestStartIndex = (requestPageSafe - 1) * requestItemsPerPage;
  const paginatedRequests = filteredRequests.slice(requestStartIndex, requestStartIndex + requestItemsPerPage);
  const requestEndIndex = requestStartIndex + paginatedRequests.length;

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Helpers Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage helper staff records and resident service requests.</p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("helpers")}
            className={`rounded-md px-4.5 py-1.5 text-sm font-semibold transition-all cursor-pointer ${activeTab === "helpers" ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-800/40"}`}
          >
            Helpers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-md px-4.5 py-1.5 text-sm font-semibold transition-all cursor-pointer ${activeTab === "requests" ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-800/40"}`}
          >
            Requests
          </button>
        </div>
      </div>

      {activeTab === "helpers" ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, NRIC..."
              className="w-full sm:w-80 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-semibold transition text-slate-800 dark:text-slate-200 placeholder-slate-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 font-semibold outline-none cursor-pointer hover:border-slate-700 transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button onClick={openAddHelper}>+ Add Helper</Button>
          </div>

          {helperError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-400">
              ⚠️ {helperError}
            </div>
          )}

          <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden mt-6">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">HELPER</th>
                  <th className="px-6 py-3">CONTACT</th>
                  <th className="px-6 py-3">EXPERIENCE</th>
                  <th className="px-6 py-3">NRIC</th>
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {helperLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                      Loading helpers...
                    </td>
                  </tr>
                ) : paginatedHelpers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No helpers found.
                    </td>
                  </tr>
                ) : (
                  paginatedHelpers.map((helper) => (
                    <tr key={helper._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-4">
                          <img
                            src={helper.nric_photo_url || "https://via.placeholder.com/64?text=Photo"}
                            alt={helper.fullname}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{helper.fullname}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{helper.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{helper.phone}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{helper.gender}, {helper.age || "—"} yrs</p>
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{helper.experience ?? 0} yrs</p>
                      </td>
                      <td className="px-6 py-4.5 text-sm text-slate-700 dark:text-slate-300 font-semibold font-mono">{helper.nric_number || "—"}</td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold border items-center justify-center ${helperStatusStyle[helper.status] || "bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"}`}>
                          {helper.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <details className="relative inline-block text-left">
                          <summary className="list-none cursor-pointer text-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-2 py-1 select-none outline-none">
                            ⋮
                          </summary>
                          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md z-20 py-1 origin-top-right">
                            <button
                              type="button"
                              onClick={() => openEditHelper(helper)}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHelper(helper._id)}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 border-t border-slate-200 dark:border-slate-800"
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

            <div className="flex flex-col gap-3 justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-6 py-4 sm:flex-row sm:items-center text-slate-500 dark:text-slate-400 text-sm">
              <p>
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{paginatedHelpers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredHelpers.length}</span> helpers
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPageSafe === 1}
                >
                  {"<"}
                </button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition-all ${currentPageSafe === index + 1 ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 hover:bg-slate-800"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={currentPageSafe === pageCount}
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={requestSearch}
              onChange={(e) => setRequestSearch(e.target.value)}
              placeholder="Search type, room, preference..."
              className="w-full sm:w-80 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-semibold transition text-slate-800 dark:text-slate-200 placeholder-slate-500"
            />
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 font-semibold outline-none cursor-pointer hover:border-slate-700 transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <Button onClick={openAddRequest}>+ Add Request</Button>
          </div>

          {requestError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-400">
              ⚠️ {requestError}
            </div>
          )}

          <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden mt-6">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">ROOM</th>
                  <th className="px-6 py-3">TYPE</th>
                  <th className="px-6 py-3">PREFERRED</th>
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3">REQUESTED</th>
                  <th className="px-6 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {requestLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                      Loading requests...
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No helper requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => {
                    const roomLabel = rooms.find((room) => room._id === request.room_id)?.room_number || rooms.find((room) => room._id === request.room_id)?.name || request.room_id;
                    return (
                      <tr key={request._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm">
                        <td className="px-6 py-4.5">
                          <p className="font-semibold text-slate-900 dark:text-white">{roomLabel}</p>
                        </td>
                        <td className="px-6 py-4.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{request.type}</p>
                        </td>
                        <td className="px-6 py-4.5 text-sm text-slate-700 dark:text-slate-300 font-semibold">{request.gender_preferred}</td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold border items-center justify-center ${requestStatusStyle[request.status] || "bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-sm text-slate-500 dark:text-slate-400 font-medium font-mono">{formatDate(request.created_at)}</td>
                        <td className="px-6 py-4.5 text-sm text-right">
                          <Button
                            size="sm"
                            onClick={() => openEditRequest(request)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="flex flex-col gap-3 justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-6 py-4 sm:flex-row sm:items-center text-slate-500 dark:text-slate-400 text-sm">
              <p>
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{paginatedRequests.length > 0 ? requestStartIndex + 1 : 0}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{requestEndIndex}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredRequests.length}</span> requests
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setRequestPage((prev) => Math.max(prev - 1, 1))}
                  disabled={requestPageSafe === 1}
                >
                  {"<"}
                </button>
                {Array.from({ length: requestPageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRequestPage(index + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition-all ${requestPageSafe === index + 1 ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 hover:bg-slate-800"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setRequestPage((prev) => Math.min(prev + 1, requestPageCount))}
                  disabled={requestPageSafe === requestPageCount}
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{editingHelper ? "Edit Helper" : "Add Helper"}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use real helper profile data from the database.</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveHelper} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  value={helperForm.fullname}
                  onChange={(e) => setHelperForm({ ...helperForm, fullname: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</label>
                <input
                  required
                  value={helperForm.phone}
                  onChange={(e) => setHelperForm({ ...helperForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address</label>
                <input
                  required
                  value={helperForm.address}
                  onChange={(e) => setHelperForm({ ...helperForm, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</label>
                <select
                  value={helperForm.gender}
                  onChange={(e) => setHelperForm({ ...helperForm, gender: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  min={18}
                  value={helperForm.age}
                  onChange={(e) => setHelperForm({ ...helperForm, age: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience (Years)</label>
                <input
                  type="number"
                  min={0}
                  value={helperForm.experience}
                  onChange={(e) => setHelperForm({ ...helperForm, experience: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={helperForm.status}
                  onChange={(e) => setHelperForm({ ...helperForm, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NRIC Number</label>
                <input
                  required
                  value={helperForm.nric_number}
                  onChange={(e) => setHelperForm({ ...helperForm, nric_number: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NRIC Image URL</label>
                <input
                  value={helperForm.nric_photo_url}
                  onChange={(e) => setHelperForm({ ...helperForm, nric_photo_url: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              {helperError && (
                <div className="sm:col-span-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-400">
                  ⚠️ {helperError}
                </div>
              )}

              <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingHelper ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{editingRequest ? "Edit Request" : "Add Request"}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create or update a helper service request.</p>
              </div>
              <button type="button" onClick={closeRequestModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room</label>
                <select
                  required
                  value={requestForm.room_id}
                  onChange={(e) => setRequestForm({ ...requestForm, room_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.room_number || room.name || room.room_name || room._id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Request Type</label>
                  <select
                    required
                    value={requestForm.type}
                    onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Gender Preference</label>
                  <select
                    value={requestForm.gender_preferred}
                    onChange={(e) => setRequestForm({ ...requestForm, gender_preferred: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={requestForm.status}
                  onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1422] px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {requestError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-400">
                  ⚠️ {requestError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
