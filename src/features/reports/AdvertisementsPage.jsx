import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

export default function AdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Modal / Form state for a clean "+ New Advertisement" action
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    title: "",
    content: "",
    image_url: "",
    link_url: "",
    status: "Active",
    duration: 30, // Default duration field constraint required by backend
  });

  // 1. GET ALL ADVERTISEMENTS FROM BACKEND
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError("");
      
      let url = "/advertisements";
      if (statusFilter !== "All") {
        url += `?status=${statusFilter}`;
      }

      const response = await api.get(url);
      setAds(response.data);
    } catch (err) {
      console.error("Failed to load advertisements:", err);
      setError(err.response?.data?.error || "Failed to load advertisements from server.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger refetches whenever the status filter changes
  useEffect(() => {
    fetchAdvertisements();
  }, [statusFilter]);

  // 2. CREATE NEW ADVERTISEMENT INTEGRATION
  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await api.post("/advertisements", formData);
      
      // Update state locally and reset form views
      setAds([response.data, ...ads]);
      setIsModalOpen(false);
      setFormData({
        company_name: "",
        title: "",
        content: "",
        image_url: "",
        link_url: "",
        status: "Active",
        duration: 30,
      });
    } catch (err) {
      console.error("Creation failed:", err);
      setError(err.response?.data?.error || "Failed to post advertisement.");
    }
  };

  // 3. DELETE ADVERTISEMENT INTEGRATION
  const handleDeleteAd = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this advertisement permanently?");
    if (!confirmDelete) return;

    try {
      setError("");
      await api.delete(`/advertisements/${id}`);
      setAds(ads.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Deletion failed:", err);
      setError(err.response?.data?.error || "Failed to delete advertisement.");
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Advertisements</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your building advertisements and community banners.</p>
          {error && <p className="text-red-400 text-xs font-semibold mt-2">⚠️ {error}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Dropdown Container */}
          <div className="relative">
            <Button 
              variant="secondary" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              Filter By: <span className="text-slate-300 font-bold">{statusFilter}</span>
              <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </Button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-[#0e1422] border border-slate-800 rounded-lg shadow-md z-50 py-1 px-1 origin-top-right">
                  {["All", "Active", "Inactive"].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-md transition-colors cursor-pointer
                        ${statusFilter === status ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                      `}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + New Advertisement
          </Button>
        </div>
      </div>

      {/* --- DATA TABLE SECTION --- */}
      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Loading live advertising streams...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              <tr>
                <th className="px-6 py-3">COMPANY</th>
                <th className="px-6 py-3">SERVICE/ITEM</th>
                <th className="px-6 py-3">DURATION (DAYS)</th>
                <th className="px-6 py-3">POSTED DATE</th>
                <th className="px-6 py-3">STATUS</th>
                <th className="px-6 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
                    No matching advertisements found.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4.5 text-sm text-slate-900 dark:text-white font-semibold">{ad.company_name}</td>
                    <td className="px-6 py-4.5 text-sm text-slate-700 dark:text-slate-300 font-semibold">{ad.title}</td>
                    <td className="px-6 py-4.5 text-sm text-slate-600 dark:text-slate-300 font-mono font-medium">{ad.duration || "N/A"}</td>
                    <td className="px-6 py-4.5 text-sm text-slate-500 dark:text-slate-400 font-semibold font-mono">
                      {ad.created_at ? new Date(ad.created_at).toLocaleDateString() : "Just Now"}
                    </td>
                    <td className="px-6 py-4.5 text-sm">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border items-center justify-center ${
                        ad.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-right flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAd(ad)}>
                        View
                      </Button>
                      {ad.link_url && (
                        <Button variant="secondary" size="sm" onClick={() => window.open(ad.link_url, "_blank")}>
                          Link
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10" onClick={() => handleDeleteAd(ad._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ADD NEW AD MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0e1422] rounded-xl w-full max-w-md p-6 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white tracking-tight">Create Advertisement</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Content / Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#0e1422] px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">External Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Ad
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAILS MODAL DIALOG --- */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0e1422] rounded-xl w-full max-w-lg p-6 border border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {selectedAd.title || "Advertisement Details"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {selectedAd.company_name}
                </p>
              </div>

              <button
                onClick={() => setSelectedAd(null)}
                className="text-slate-400 hover:text-slate-200 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-1 gap-4 bg-slate-900/40 p-5 rounded-lg border border-slate-800 font-medium">
                <div>
                  <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Company</strong>
                  <p className="text-slate-200 font-semibold">{selectedAd.company_name}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Service / Item</strong>
                  <p className="text-slate-200 font-semibold">{selectedAd.title}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Duration</strong>
                  <p className="text-slate-200 font-semibold font-mono">{selectedAd.duration ? `${selectedAd.duration} Days` : "N/A"}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Status</strong>
                  <div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border items-center justify-center ${
                      selectedAd.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {selectedAd.status}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">Content / Description</strong>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 text-slate-200 leading-relaxed font-semibold">
                    {selectedAd.content || "No description"}
                  </div>
                </div>
                {selectedAd.link_url && (
                  <div className="sm:col-span-2">
                    <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">External Link</strong>
                    <a
                      href={selectedAd.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline break-all font-bold font-mono text-xs"
                    >
                      {selectedAd.link_url}
                    </a>
                  </div>
                )}
                {selectedAd.image_url && (
                  <div className="sm:col-span-2">
                    <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">Banner Image</strong>
                    <img
                      src={selectedAd.image_url}
                      alt={selectedAd.title}
                      className="max-h-48 w-full object-cover rounded-lg border border-slate-800 shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-800 pt-4">
              <Button variant="secondary" onClick={() => setSelectedAd(null)}>
                Close
              </Button>
              {selectedAd.link_url && (
                <Button onClick={() => window.open(selectedAd.link_url, "_blank")}>
                  Visit Link
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}