import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import api from "../../services/axios";// Make sure your path correctly reaches your axios/fetch instance

export default function AdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      
      // Handle the status query parameters matching your route controller
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
    <div className="space-y-6 p-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Advertisements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your building Advertisements</p>
          {error && <p className="text-red-500 text-xs font-semibold mt-2">⚠️ {error}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Dropdown Container */}
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              Filter By: <span className="text-blue-600 font-medium">{statusFilter}</span>
              <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </Button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                  {["All", "Active", "Inactive"].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors
                        ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
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
          
          <Button variant="primary" className="shadow-sm" onClick={() => setIsModalOpen(true)}>
            + New Advertisement
          </Button>
        </div>
      </div>

      {/* --- DATA TABLE SECTION --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
            Loading live advertising streams from data nodes...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service/Item</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (Days)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No matching advertisements found.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{ad.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ad.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ad.duration || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ad.created_at ? new Date(ad.created_at).toLocaleDateString() : "Just Now"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ad.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => alert(`Company: ${ad.company_name}\n\nDescription:\n${ad.content}`)}>
                        View
                      </Button>
                      {ad.link_url && (
                        <Button variant="secondary" size="sm" onClick={() => window.open(ad.link_url, "_blank")}>
                          Link
                        </Button>
                      )}
                      <Button variant="danger" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteAd(ad._id)}>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Advertisement</h2>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Content / Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">External Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Ad
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}