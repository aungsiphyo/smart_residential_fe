import React, { useState, useEffect } from "react";

const INITIAL_SLOTS = [
  // === WEST WING (25 Slots) ===
  { id: "L-01", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-01", icon: "🚘", userId: null },
  { id: "L-02", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Other User" },
  { id: "L-03", zone: "West Wing (Zone L)", status: "Reserved", color: "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]", dot: "bg-[#f59e0b]", top: "VIP", icon: "🚘", userId: null },
  { id: "L-04", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-02", icon: "🚘", userId: null },
  { id: "L-05", zone: "West Wing (Zone L)", status: "Maintenance", color: "border-[#f1f3f4] bg-[#f8f9fa] text-[#5f6368]", dot: "bg-[#94a3b8]", top: "SVC", icon: "🛠️", userId: null },
  { id: "L-06", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Other User" },
  { id: "L-07", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-03", icon: "🚘", userId: null },
  { id: "L-08", zone: "West Wing (Zone L)", status: "Reserved", color: "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]", dot: "bg-[#f59e0b]", top: "VIP", icon: "🚘", userId: null },
  { id: "L-09", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-04", icon: "🚘", userId: null },
  { id: "L-10", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-05", icon: "🚘", userId: null },
  { id: "L-11", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "L-12", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-06", icon: "🚘", userId: null },
  { id: "L-13", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-07", icon: "🚘", userId: null },
  { id: "L-14", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "L-15", zone: "West Wing (Zone L)", status: "Reserved", color: "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]", dot: "bg-[#f59e0b]", top: "VIP", icon: "🚘", userId: null },
  { id: "L-16", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-08", icon: "🚘", userId: null },
  { id: "L-17", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-09", icon: "🚘", userId: null },
  { id: "L-18", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "L-19", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-10", icon: "🚘", userId: null },
  { id: "L-20", zone: "West Wing (Zone L)", status: "Maintenance", color: "border-[#f1f3f4] bg-[#f8f9fa] text-[#5f6368]", dot: "bg-[#94a3b8]", top: "SVC", icon: "🛠️", userId: null },
  { id: "L-21", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-11", icon: "🚘", userId: null },
  { id: "L-22", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-12", icon: "🚘", userId: null },
  { id: "L-23", zone: "West Wing (Zone L)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "L-24", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-13", icon: "🚘", userId: null },
  { id: "L-25", zone: "West Wing (Zone L)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-14", icon: "🚘", userId: null },

  // === EAST PLAZA (25 Slots) ===
  { id: "R-01", zone: "East Plaza (Zone R)", status: "Maintenance", color: "border-[#f1f3f4] bg-[#f8f9fa] text-[#5f6368]", dot: "bg-[#94a3b8]", top: "SVC", icon: "🛠️", userId: null },
  { id: "R-02", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-01", icon: "🚘", userId: null },
  { id: "R-03", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Other User" },
  { id: "R-04", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Other User" },
  { id: "R-05", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-02", icon: "🚘", userId: null },
  { id: "R-06", zone: "East Plaza (Zone R)", status: "Reserved", color: "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]", dot: "bg-[#f59e0b]", top: "VIP", icon: "🚘", userId: null },
  { id: "R-07", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-03", icon: "🚘", userId: null },
  { id: "R-08", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "R-09", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-04", icon: "🚘", userId: null },
  { id: "R-10", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-05", icon: "🚘", userId: null },
  { id: "R-11", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "R-12", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-06", icon: "🚘", userId: null },
  { id: "R-13", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-07", icon: "🚘", userId: null },
  { id: "R-14", zone: "East Plaza (Zone R)", status: "Reserved", color: "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]", dot: "bg-[#f59e0b]", top: "VIP", icon: "🚘", userId: null },
  { id: "R-15", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-08", icon: "🚘", userId: null },
  { id: "R-16", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "R-17", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-09", icon: "🚘", userId: null },
  { id: "R-18", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-10", icon: "🚘", userId: null },
  { id: "R-19", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "R-20", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-11", icon: "🚘", userId: null },
  { id: "R-21", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-12", icon: "🚘", userId: null },
  { id: "R-22", zone: "East Plaza (Zone R)", status: "Maintenance", color: "border-[#f1f3f4] bg-[#f8f9fa] text-[#5f6368]", dot: "bg-[#94a3b8]", top: "SVC", icon: "🛠️", userId: null },
  { id: "R-23", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-13", icon: "🚘", userId: null },
  { id: "R-24", zone: "East Plaza (Zone R)", status: "Occupied", color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]", dot: "bg-[#ef4444]", top: "FULL", icon: "🚙", userId: "Guest" },
  { id: "R-25", zone: "East Plaza (Zone R)", status: "Available", color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]", dot: "bg-[#10b981]", top: "AV-14", icon: "🚘", userId: null },
];

const INITIAL_LOGS = [
  {
    id: Date.now(),
    timestamp: Date.now(),
    type: "System",
    message: "Welcome to Smart Parking Panel!",
    icon: "👋"
  },
];

export default function App() {
  const [showAllWest, setShowAllWest] = useState(false);
  const [showAllEast, setShowAllEast] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // 🚪 Shared Modal State for both VIP & Check-in
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null }); 
  const [modalChosenSlotId, setModalChosenSlotId] = useState(null);

  const currentUser = "Alex Thompson"; 

  const [parkingSlots, setParkingSlots] = useState(() => {
    const savedSlots = localStorage.getItem("parkingSlots");
    return savedSlots ? JSON.parse(savedSlots) : INITIAL_SLOTS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const savedLogs = localStorage.getItem("activityLogs");
    return savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS;
  });

  useEffect(() => {
    localStorage.setItem("parkingSlots", JSON.stringify(parkingSlots));
  }, [parkingSlots]);

  useEffect(() => {
    localStorage.setItem("activityLogs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Current User ယူထားတဲ့ Active Slot ကို ရှာဖွေခြင်း (အပေါ်က Banner အတွက်)
  const myActiveSlot = parkingSlots.find(slot => slot.userId === currentUser);

  // 🚪 Modal ဖွင့်မည့် Function
  const handleOpenModal = (actionType) => {
    if (myActiveSlot) {
      if (actionType === 'VIP') {
        alert(`⚠️ သင် ${myActiveSlot.id} နေရာကို ယူထားပြီးဖြစ်လို့ VIP Reserve ထပ်လုပ်လို့မရသေးပါ။`);
        return;
      } else if (actionType === 'PARK') {
        if (myActiveSlot.status === 'Reserved') {
          // ကြိုတင် VIP ယူထားလျှင် တိုက်ရိုက် ကားဝင်ထိုးပေးမည်
          handleDirectCheckIn(myActiveSlot.id);
          return;
        } else {
          alert(`⚠️ သင် ${myActiveSlot.id} နေရာမှာ ကားထိုးထားပြီးဖြစ်ပါတယ်။`);
          return;
        }
      }
    }

    setModalChosenSlotId(null); 
    setModalConfig({ isOpen: true, type: actionType });   
  };

  // Direct Check-in (VIP နေရာမှ Real Parking သို့ ပြောင်းလဲခြင်း)
  const handleDirectCheckIn = (slotId) => {
    const updatedSlots = parkingSlots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: "Occupied",
          top: "FULL",
          icon: "🚙",
          color: "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]",
          dot: "bg-[#ef4444]"
        };
      }
      return slot;
    });
    setParkingSlots(updatedSlots);
    setActivityLogs([{ id: Date.now(), time: "Just now", type: "Check-In", message: `You parked at your reserved slot ${slotId}`, icon: "🚙" }, ...activityLogs]);
  };

  // ✅ Modal ထဲတွင် ရွေးချယ်မှုအပြီး Confirm လုပ်ခြင်း
  const handleConfirmAction = () => {
    if (!modalChosenSlotId) {
      alert("🎯 ကျေးဇူးပြု၍ ပါကင်နေရာ အကွက်လေးတစ်ခုကို အရင်နှိပ်ပြီး ရွေးချယ်ပေးပါ။");
      return;
    }

    const isVip = modalConfig.type === 'VIP';
    const newStatus = isVip ? "Reserved" : "Occupied";
    const newTop = isVip ? "VIP" : "FULL";
    const newIcon = isVip ? "🚘" : "🚙";
    const newColor = isVip ? "border-[#fef7e0] bg-[#fffbeb] text-[#b06000]" : "border-[#fce8e6] bg-[#fef3f2] text-[#c5221f]";
    const newDot = isVip ? "bg-[#f59e0b]" : "bg-[#ef4444]";
    
    const logType = isVip ? "Reserved" : "Check-In";
    const logMessage = isVip 
      ? `You successfully reserved slot ${modalChosenSlotId} for VIP.` 
      : `You successfully parked at your chosen slot ${modalChosenSlotId}.`;

    const updatedSlots = parkingSlots.map(slot => {
      if (slot.id === modalChosenSlotId) {
        return { ...slot, status: newStatus, userId: currentUser, top: newTop, icon: newIcon, color: newColor, dot: newDot };
      }
      return slot;
    });

    setParkingSlots(updatedSlots);
    setActivityLogs([{ id: Date.now(), time: "Just now", type: logType, message: logMessage, icon: isVip ? "⭐" : "🚙" }, ...activityLogs]);
    
    setModalConfig({ isOpen: false, type: null }); 
    setModalChosenSlotId(null);
  };

  const [tick, setTick] = useState(0); 

useEffect(() => {
  const timer = setInterval(() => setTick(prev => prev + 1), 60000);
  return () => clearInterval(timer);
}, []);
const getTimeAgo = (timestamp) => {
  if (!timestamp) return "just now";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
  
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
  
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " min ago" : " mins ago");
  
  return "just now";
};
  // ❌ ကားပြန်ထွက်မည့်/Reserve ဖျက်မည့် Function (ဘယ်နေရာကမဆို လှမ်းနှိပ်နိုင်သည်)
  const handleCheckOut = (id) => {
    const slot = parkingSlots.find(s => s.id === id);
    if (!slot || slot.userId !== currentUser) return; 

    const updatedSlots = parkingSlots.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: "Available",
          userId: null, 
          top: `AV-${id.split("-")[1]}`,
          icon: "🚘",
          color: "border-[#e6f4ea] bg-[#f4fbf7] text-[#137333]",
          dot: "bg-[#10b981]"
        };
      }
      return s;
    });

    setParkingSlots(updatedSlots);
    const actionText = slot.status === "Reserved" ? "cancelled reservation for" : "checked out from";
    setActivityLogs([{ id: Date.now(), time: "Just now", type: slot.status === "Reserved" ? "Cancelled" : "Check-Out", message: `You ${actionText} slot ${id}`, icon: "✅" }, ...activityLogs]);
  };

  const totalCount = parkingSlots.length;
  const occupiedCount = parkingSlots.filter(s => s.status === "Occupied").length;
  const availableCount = parkingSlots.filter(s => s.status === "Available").length;
  const reservedCount = parkingSlots.filter(s => s.status === "Reserved").length;
  const maintenanceCount = parkingSlots.filter(s => s.status === "Maintenance").length;

  const filteredSlots = activeFilter === "All" ? parkingSlots : parkingSlots.filter(slot => slot.status === activeFilter);
  const westSlots = filteredSlots.filter((slot) => slot.zone === "West Wing (Zone L)");
  const eastSlots = filteredSlots.filter((slot) => slot.zone === "East Plaza (Zone R)");

  const displayedWestSlots = showAllWest ? westSlots : westSlots.slice(0, 5);
  const displayedEastSlots = showAllEast ? eastSlots : eastSlots.slice(0, 5);

  return (
    <div className="p-5 bg-[#f8fafc] min-h-screen text-[#4a5568] antialiased font-sans flex flex-col gap-5 relative">
      
      {/* 🚪 SHARED MODAL (POPUP) FOR VIP & CHECK-IN */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-extrabold text-[#1a202c]">
                  {modalConfig.type === 'VIP' ? "Choose Your VIP Slot ⭐" : "Choose Your Parking Slot 🚗"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Please select an <b className="text-[#137333]">Available</b> slot from the grid below.</p>
              </div>
              <button 
                onClick={() => setModalConfig({ isOpen: false, type: null })}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content (Grid of Small Slots) */}
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
              {/* West Wing */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">🏢 West Wing (Zone L)</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {parkingSlots.filter(s => s.zone === "West Wing (Zone L)").map(slot => {
                    const isAvailable = slot.status === "Available";
                    const isChosen = modalChosenSlotId === slot.id;
                    return (
                      <div 
                        key={slot.id} 
                        onClick={() => isAvailable && setModalChosenSlotId(slot.id)}
                        className={`text-center py-2.5 rounded-lg border text-sm font-bold shadow-3xs transition-all duration-150 
                          ${isChosen ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 active:scale-95' :
                            isAvailable ? 'border-[#e6f4ea] bg-[#f4fbf7] text-[#137333] hover:border-green-300 hover:bg-green-50 cursor-pointer active:scale-95' : 
                            'border-slate-100 bg-slate-50 text-slate-300'}`}
                      >
                        {slot.id}
                        {!isAvailable && <span className="block text-[9px] opacity-70">Occupied</span>}
                        {isChosen && <span className="block text-[9px] opacity-70">📍 Chosen</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* East Plaza */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">🏢 East Plaza (Zone R)</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {parkingSlots.filter(s => s.zone === "East Plaza (Zone R)").map(slot => {
                    const isAvailable = slot.status === "Available";
                    const isChosen = modalChosenSlotId === slot.id;
                    return (
                      <div 
                        key={slot.id} 
                        onClick={() => isAvailable && setModalChosenSlotId(slot.id)}
                        className={`text-center py-2.5 rounded-lg border text-sm font-bold shadow-3xs transition-all duration-150 
                          ${isChosen ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 active:scale-95' :
                            isAvailable ? 'border-[#e6f4ea] bg-[#f4fbf7] text-[#137333] hover:border-green-300 hover:bg-green-50 cursor-pointer active:scale-95' : 
                            'border-slate-100 bg-slate-50 text-slate-300'}`}
                      >
                        {slot.id}
                        {!isAvailable && <span className="block text-[9px] opacity-70">Occupied</span>}
                        {isChosen && <span className="block text-[9px] opacity-70">📍 Chosen</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              {modalChosenSlotId ? (
                <div className="text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl font-semibold border border-indigo-200">
                  Selected Slot: <b className="font-mono text-base underline ml-1">{modalChosenSlotId}</b>
                </div>
              ) : (
                <p className="text-xs text-indigo-500 font-medium">Please tap a green slot to select it.</p>
              )}
              
              <button 
                onClick={handleConfirmAction}
                disabled={!modalChosenSlotId}
                className={`text-white px-6 py-2 rounded-xl font-bold text-sm shadow active:scale-95 transition-all flex items-center gap-2
                  ${modalChosenSlotId 
                    ? (modalConfig.type === 'VIP' ? 'bg-[#f59e0b] hover:bg-[#d97706]' : 'bg-[#5046e5] hover:bg-[#4338ca]') 
                    : 'bg-slate-300 cursor-not-allowed'}`}
              >
                {modalConfig.type === 'VIP' ? "Confirm VIP Reserve ⭐" : "Confirm Park In 🚗"}
              </button>
            </div>
          </div>
        </div>
      )}
{/* HEADER SECTION */}
     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
  <div>
    <div className="flex items-center gap-3">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a202c] tracking-tighter">
        Smart Parking Panel
      </h1>
    </div>
    <p className="text-[#718096] ">
      Live digital twin & allocation hub for Civic Precision Villa.
    </p>
  </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!myActiveSlot && (
            <>
              <button 
                onClick={() => handleOpenModal('VIP')}
                className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-3 sm:px-4 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                ⭐ VIP Reserve
              </button>

              <button 
                onClick={() => handleOpenModal('PARK')}
                className="bg-[#5046e5] hover:bg-[#4338ca] text-white px-3 sm:px-4 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                🚗 Park My Car (In)
              </button>
            </>
          )}
        </div>
      </div>

{/* 🔥 MODERN ACTIVE SESSION TICKET PANEL (ရွေးချယ်ထားသော Brand Blue Gradient စတိုင်ဖြင့် ပြင်ဆင်ပြီး) */}
      {myActiveSlot && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-5 border border-blue-500/30 shadow-lg shadow-indigo-500/20 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden animate-fade-in">
          
          {/* Subtle Background Glows (နောက်ခံကို ပိုပြီး Soft ဖြစ်အောင် ပံ့ပိုးပေးမည့် အလင်းစက်များ) */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-400 opacity-20 rounded-full blur-xl"></div>
          <div className="absolute left-1/4 -bottom-8 w-28 h-28 bg-purple-400 opacity-20 rounded-full blur-xl"></div>

          <div className="flex items-center gap-3.5 z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-md relative
              ${myActiveSlot.status === 'Reserved' ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'}`}>
              {myActiveSlot.status === 'Reserved' ? "⭐" : "🚙"}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
            </div>
            
            <div className="z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md text-white backdrop-blur-md border border-white/10">
                  Active Live Session
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${myActiveSlot.status === 'Reserved' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'}`}>
                  {myActiveSlot.status === 'Reserved' ? 'VIP Booked' : 'Parked Live'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1.5 tracking-tight">
                Your Car is at Spot <b className="text-xl font-mono underline text-amber-300 decoration-amber-400/40 underline-offset-4 mx-1">{myActiveSlot.id}</b> ({myActiveSlot.zone})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end z-10">
            {myActiveSlot.status === 'Reserved' && (
              <button 
                onClick={() => handleDirectCheckIn(myActiveSlot.id)}
                className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition active:scale-95 whitespace-nowrap cursor-pointer border border-emerald-400"
              >
                🚗 Park Now (In)
              </button>
            )}
            <button 
              onClick={() => handleCheckOut(myActiveSlot.id)}
              className={`flex-1 md:flex-none font-black text-xs px-4 py-2.5 rounded-xl shadow transition active:scale-95 whitespace-nowrap cursor-pointer border
                ${myActiveSlot.status === 'Reserved' 
                  ? 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/20' 
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white border-rose-400/20 shadow-rose-950/20'}`}
            >
              {myActiveSlot.status === 'Reserved' ? 'Cancel VIP Reservation ✕' : 'Leave Spot Now (Out) ↗'}
            </button>
          </div>
        </div>
      )}

      {/* CLICKABLE METRICS PANEL */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div onClick={() => setActiveFilter("All")} className={`rounded-2xl border p-4 flex flex-col justify-between h-[130px] shadow-2xs cursor-pointer transition-all ${activeFilter === "All" ? "bg-slate-100 border-slate-300 ring-2 ring-indigo-200" : "bg-white border-slate-100"}`}>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Total Capacity</p>
              <span className="text-[9px] font-bold bg-[#edf2f7] px-1.5 py-0.5 rounded text-[#718096]">ALL</span>
            </div>
            <h2 className="text-3xl font-black text-[#1a202c] mt-1.5">{totalCount} <span className="text-xs font-bold text-[#a0aec0]">units</span></h2>
          </div>
          <p className="text-[12px] text-[#718096] font-medium flex items-center gap-1">⚡ Click to show all</p>
        </div>

        <div onClick={() => setActiveFilter("Occupied")} className={`rounded-2xl border p-4 flex flex-col justify-between h-[130px] shadow-2xs cursor-pointer transition-all ${activeFilter === "Occupied" ? "bg-red-50 border-red-200 ring-2 ring-red-200" : "bg-white border-slate-100"}`}>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Occupied</p>
              <span className="w-2 h-2 rounded-full bg-[#ff3b30]"></span>
            </div>
            <h2 className="text-3xl font-black text-[#e53e3e] mt-1.5">{occupiedCount} <span className="text-xs font-bold text-[#a0aec0]">/ 50</span></h2>
          </div>
          <p className="text-[12px] text-[#e53e3e] font-bold flex items-center gap-1 ">📈{Math.round((occupiedCount / totalCount) * 100)}% Full ➔</p>
        </div>

        <div onClick={() => setActiveFilter("Available")} className={`rounded-2xl border p-4 flex flex-col justify-between h-[130px] shadow-2xs cursor-pointer transition-all ${activeFilter === "Available" ? "bg-green-50 border-green-200 ring-2 ring-green-200" : "bg-white border-slate-100"}`}>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Available</p>
              <span className="text-[10px]">🟢</span>
            </div>
            <h2 className="text-3xl font-black text-[#38a169] mt-1.5">{availableCount} <span className="text-xs font-bold text-[#a0aec0]">vacant</span></h2>
          </div>
          <p className="text-[12px] text-[#38a169] font-bold flex items-center gap-1">✨Ready for Use ➔</p>
        </div>

        <div onClick={() => setActiveFilter("Reserved")} className={`rounded-2xl border p-4 flex flex-col justify-between h-[130px] shadow-2xs cursor-pointer transition-all ${activeFilter === "Reserved" ? "bg-amber-50 border-amber-200 ring-2 ring-amber-200" : "bg-white border-slate-100"}`}>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Reserved</p>
              <span className="text-xs">⭐</span>
            </div>
            <h2 className="text-3xl font-black text-[#dd6b20] mt-1.5">{reservedCount} <span className="text-xs font-bold text-[#a0aec0]">VIP</span></h2>
          </div>
          <p className="text-[12px] text-[#dd6b20] font-bold flex items-center gap-1">🔒 Pre-booked ➔</p>
        </div>

        <div onClick={() => setActiveFilter("Maintenance")} className={`rounded-2xl border p-4 col-span-2 lg:col-span-1 flex flex-col justify-between h-[130px] shadow-2xs cursor-pointer transition-all ${activeFilter === "Maintenance" ? "bg-slate-200 border-slate-300 ring-2 ring-slate-300" : "bg-white border-slate-100"}`}>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Offline</p>
              <span className="text-xs">🛠️</span>
            </div>
            <h2 className="text-3xl font-black text-[#718096] mt-1.5">{maintenanceCount} <span className="text-xs font-bold text-[#a0aec0]">block</span></h2>
          </div>
          <p className="text-[12px] text-[#718096] font-bold flex items-center gap-1">🔧 Maintenance ➔</p>
        </div>
      </div>

      {/* PARKING BAY ZONES (Main Displays) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-1">
        
        {/* WEST WING */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏢</span>
              <h2 className="font-bold text-sm text-[#1a202c]">West Wing <span className="text-[#a0aec0] font-normal text-xs">(Zone L)</span></h2>
            </div>
            <span className="text-[10px] font-bold bg-[#edf2f7] px-2 py-0.5 rounded-full text-[#4a5568]">Found: {westSlots.length}</span>
          </div>

          {westSlots.length === 0 ? (
            <p className="text-xs text-[#a0aec0] py-6 text-center italic">No matching slots in West Wing.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {displayedWestSlots.map((slot) => (
                <div key={slot.id} className={`rounded-xl border p-2 flex flex-col justify-between h-[100px] shadow-3xs relative ${slot.color}`}>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-bold font-mono opacity-80 uppercase">{slot.top}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${slot.dot}`}></div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full mb-0.5">
                    <h3 className="text-lg font-black text-[#2d3748] tracking-tight font-mono">{slot.id}</h3>
                    <span className="text-sm mt-0.5 block">{slot.icon}</span>
                  </div>
                  
                  {slot.userId === currentUser && (
                    <button 
                      onClick={() => handleCheckOut(slot.id)} 
                      className={`absolute bottom-1 right-1 bg-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-sm transition-colors cursor-pointer z-10 hover:scale-105
                        ${slot.status === 'Reserved' 
                          ? 'text-amber-600 border border-amber-200 hover:bg-amber-50' 
                          : 'text-red-600 border border-red-200 hover:bg-red-50'}`}
                    >
                      {slot.status === 'Reserved' ? 'Cancel ✕' : 'Out ↗'}
                    </button>
                  )}

                  {(slot.status === "Occupied" || slot.status === "Reserved") && slot.userId !== currentUser && (
                    <span className="absolute bottom-1 right-1 bg-white/50 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
                      🔒
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {westSlots.length > 5 && (
            <button onClick={() => setShowAllWest(!showAllWest)} className="w-full mt-3 bg-[#f8fafc] border border-slate-100 hover:bg-[#f1f5f9] text-[#4f46e5] font-bold text-xs py-1.5 rounded-xl transition flex items-center justify-center">
              {showAllWest ? "View Less ▲" : `View All ${westSlots.length} Slots ▼`}
            </button>
          )}
        </div>

        {/* EAST PLAZA */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏢</span>
              <h2 className="font-bold text-sm text-[#1a202c]">East Plaza <span className="text-[#a0aec0] font-normal text-xs">(Zone R)</span></h2>
            </div>
            <span className="text-[10px] font-bold bg-[#edf2f7] px-2 py-0.5 rounded-full text-[#4a5568]">Found: {eastSlots.length}</span>
          </div>

          {eastSlots.length === 0 ? (
            <p className="text-xs text-[#a0aec0] py-6 text-center italic">No matching slots in East Plaza.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {displayedEastSlots.map((slot) => (
                <div key={slot.id} className={`rounded-xl border p-2 flex flex-col justify-between h-[100px] shadow-3xs relative ${slot.color}`}>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-bold font-mono opacity-80 uppercase">{slot.top}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${slot.dot}`}></div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full mb-0.5">
                    <h3 className="text-lg font-black text-[#2d3748] tracking-tight font-mono">{slot.id}</h3>
                    <span className="text-sm mt-0.5 block">{slot.icon}</span>
                  </div>

                  {slot.userId === currentUser && (
                    <button 
                      onClick={() => handleCheckOut(slot.id)} 
                      className={`absolute bottom-1 right-1 bg-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-sm transition-colors cursor-pointer z-10 hover:scale-105
                        ${slot.status === 'Reserved' 
                          ? 'text-amber-600 border border-amber-200 hover:bg-amber-50' 
                          : 'text-red-600 border border-red-200 hover:bg-red-50'}`}
                    >
                      {slot.status === 'Reserved' ? 'Cancel ✕' : 'Out ↗'}
                    </button>
                  )}

                  {(slot.status === "Occupied" || slot.status === "Reserved") && slot.userId !== currentUser && (
                    <span className="absolute bottom-1 right-1 bg-white/50 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
                      🔒
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {eastSlots.length > 5 && (
            <button onClick={() => setShowAllEast(!showAllEast)} className="w-full mt-3 bg-[#f8fafc] border border-slate-100 hover:bg-[#f1f5f9] text-[#4f46e5] font-bold text-xs py-1.5 rounded-xl transition flex items-center justify-center">
              {showAllEast ? "View Less ▲" : `View All ${eastSlots.length} Slots ▼`}
            </button>
          )}
        </div>
      </div>
{/* MY ACTIVITY STREAM */}
<div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
  <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
    <div className="flex items-center gap-2">
      <span className="text-base">📋</span>
      <h2 className="font-bold text-sm text-[#1a202c]">My Activity Stream</h2>
    </div>
    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#e0e7ff] text-[#4338ca] px-2 py-0.5 rounded-full">
      ● Live Updated
    </span>
  </div>

  <div className="flex flex-col gap-2">
    {activityLogs.slice(0, 5).map((log) => (
      <div
        key={log.id}
        className="flex items-center justify-between bg-[#f8fafc] p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm">{log.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#2d3748]">{log.message}</span>
            <span className="text-[10px] text-[#a0aec0]">{log.type}</span>
          </div>
        </div>
        {/* 🔥 ဒီနေရာမှာ getTimeAgo ကို သုံးပေးလိုက်ပါ */}
        <span className="text-[10px] font-mono font-medium text-[#718096] bg-white px-2 py-0.5 rounded-md shadow-3xs">
          {getTimeAgo(log.id)}
        </span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}