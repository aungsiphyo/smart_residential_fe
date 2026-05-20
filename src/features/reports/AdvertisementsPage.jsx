import React, { useState } from "react";
import Button from "../../components/ui/Button";

// 1. Categories for the Dropdown menu
const categories = ['All', 'Childcare', 'Education', 'Marketplace', 'Service'];

const adsData = [
  { id: 1, title: "🎓 English & Maths Tutor", date: "June 10, 2026", type: "Education", status: "Active", location: "Yangon Education Center", phone: "09-777 254 852", description: "Experienced teacher." },
  { id: 2, title: "👶 Part-time Nanny (Weekends)", date: "June 12, 2026", type: "Childcare", status: "Active", location: "Trusted Care Agency", phone: "09-254 753 964", description: "Certified in First Aid." },
  { id: 3, title: "🎹 Piano Lessons for Beginners", date: "June 14, 2026", type: "Education", status: "Active", location: "Hlaing Township", phone: "09-423 654 381", description: "Learn piano basics." },
  { id: 4, title: "🧹 Helper for House Cleaning", date: "June 15, 2026", type: "Service", status: "Booked", room: "02-B", phone: "09-970 542 664", description: "Professional deep cleaning." },
  { id: 5, title: "🛍️ Samsung Blue Sky Air Purifier", date: "June 18, 2026", type: "Marketplace", status: "Sold", room: "21-D", phone: "09-696 654", description: "Perfect condition." },
];

export default function AdvertisementsPage() {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const filteredData = adsData.filter(item => 
    filter === 'All' || item.type === filter || item.status === filter
  );

  return (
    <div className="space-y-6 p-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Advertisements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your building Advertisements</p>
        </div>

        {/* Right side buttons container */}
        <div className="flex items-center gap-3">
          
          {/* Dropdown Container */}
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              Filter By: <span className="text-blue-600 font-medium">
                {filter === 'Education' ? 'Tutors' : filter}
              </span>
              {/* This is the Arrow */}
              <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </Button>

            {/* The actual Dropdown List */}
            {isDropdownOpen && (
              <>
                {/* Invisible backdrop to close dropdown when clicking outside */}
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors
                        ${filter === cat ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                      onClick={() => {
                        setFilter(cat);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {cat === 'Education' ? 'Tutors' : cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <Button variant="primary" className="shadow-sm">
            + New Advertisement
          </Button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service/Item</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{ad.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ad.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ad.date}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ad.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {ad.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => alert(`Item: ${ad.title}\nDescription: ${ad.description}`)}>
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => alert(`Phone: ${ad.phone}`)}>
                    Contact
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}