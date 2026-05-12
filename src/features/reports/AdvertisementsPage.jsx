import React, {useState} from "react";
import Button from "../../components/ui/Button";
 
const adsData = [
  { 
    id: 1, 
    title: "🎓 English & Mathsg Tutor", 
    date: "June 10, 2026", 
    type: "Education", 
    status: "Active", 
    location: "Yangon Education Center", 
    phone: "09-777 254 852",
    description: "Experienced IGCSE teacher. Specializes in Grade 9-11 Mathematics and English Literature. Available for home visits or online sessions." 
  },
  { 
    id: 2, 
    title: "👶 Part-time Nanny (Weekends)", 
    date: "June 12, 2026", 
    type: "Childcare", 
    status: "Active", 
    location: "Trusted Care Agency", 
    phone: "09-254 753 964",
    description: "Certified in First Aid and Child Safety. Speaks fluent English and Burmese. Available Saturdays and Sundays from 9:00 AM to 5:00 PM." 
  },
  { 
    id: 3, 
    title: "🎹 Piano Lessons for Beginners", 
    date: "June 14, 2026", 
    type: "Education", 
    status: "Active", 
    location: "Hlaing Township", 
    phone: "09-423 654 381",
    description: "Learn classical piano basics. Suitable for children ages 5-12. 1-hour sessions. Note: Piano must be provided by the resident at their home." 
  },
  { 
    id: 4, 
    title: "🧹 Helper for House Cleaning", 
    date: "June 15, 2026", 
    type: "Service", 
    status: "Booked", 
    room: "02-B", 
    phone: "09-970 542 664",
    description: "Professional deep cleaning services including windows, balcony, and kitchen sanitization. Currently fully booked for the next two weeks." 
  },
  { 
    id: 5, 
    title: "🛍️ Samsung Blue Sky Air Purifier", 
    date: "June 18, 2026", 
    type: "Marketplace", 
    status: "Sold", 
    room: "21-D", 
    phone: "09-696 654",
    description: "Model: AX40. Used for only 6 months. HEPA filter included and recently cleaned. Perfect condition. Selling because the owner is moving abroad." 
  },
];
export default function AdvertisementsPage() {
  const [filter, setFilter]=React.useState('All');
  
const filteredData = adsData.filter(item => filter === 'All' || item.type === filter || item.status === filter);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Advertisements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your building Advertisements</p>
        </div>
        <Button variant="primary">New Advertisement </Button>
        <div className="flex gap-2 mt-4">
        <Button variant="secondary" onClick={() => setFilter('Childcare')}>Childcare</Button>
        <Button variant="secondary" onClick={() => setFilter('Education')}>Tutors</Button>
        <Button variant="secondary" onClick={() => setFilter('Marketplace')}>For Sale</Button>
        <Button variant="secondary" onClick={() => setFilter('Service')}>Services</Button>
        <Button variant="outline" onClick={() => setFilter('All')}>Show All</Button>
      </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service/Item</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Posted Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Availability</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((ad) => (
              <tr key={ad.id} className="border-b border-gray-200 hover:bg-gray-50">
                {/* 1. Item Name */}
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{ad.title}</td>
                
                {/* 2. Category */}
                <td className="px-6 py-4 text-sm text-gray-600">{ad.type}</td>
                
                {/* 3. Date */}
                <td className="px-6 py-4 text-sm text-gray-600">{ad.date}</td>
                
                {/* 4. Availability Status */}
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ad.status === "Active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {ad.status}
                  </span>
                </td>

                {/* 5. Action Buttons */}
                <td className="px-6 py-4 text-sm flex gap-2">
                  <Button 
  variant="ghost" 
  size="sm"
  onClick={() => alert(
    `ADVERTISEMENT DETAILS\n` +
    `--------------------------\n` +
    `Item: ${ad.title}\n` +
    `Category: ${ad.type}\n` +
    `Posted: ${ad.date}\n\n` +
    `Description: ${ad.description}`
  )}
>
  View
</Button>
                  
                  <Button 
  variant="secondary" 
  size="sm" 
  onClick={() => {
    if (ad.status === "Active") {
      // Logic to decide whether to show Room or Location
      const addressInfo = ad.room ? `Room: ${ad.room}` : `Location: ${ad.location}`;
      
      alert(`Contacting: ${ad.title}\n--------------------------\n${addressInfo}\nPhone: ${ad.phone}`);
    } else {
      alert(`Notice: This listing is ${ad.status}.\nContact is currently unavailable.`);
    }
  }}
>
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
