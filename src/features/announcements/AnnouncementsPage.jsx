import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { fetchAnnouncements, createAnnouncement } from "./api";
import AnnouncementList from "./components/AnnouncementList";
import AnnouncementForm from "./components/AnnouncementForm";
import useAuthStore from "../auth/authStore";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export default function AnnouncementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const socketRef = useRef(null);
  const authUser = useAuthStore((s) => s.user);
  const persistedAuthUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("authUser") || "null") : null;
  const currentUser = authUser || persistedAuthUser;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAnnouncements();
      const data = res?.data || res;
      setItems(Array.isArray(data) ? data : data?.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load announcements", err.message || err);
      if (err.response?.status === 404) {
        setError("Announcements endpoint not found on server (GET /announcements). Please add a GET /announcements route on the backend.");
      } else {
        setError(err.message || "Failed to load announcements");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    const socket = socketRef.current;
    socket.on("announcement", (a) => {
      // prepend new announcements
      setItems((prev) => [a, ...prev]);
    });

    return () => {
      socket.off("announcement");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleCreate = async (payload) => {
    if (!currentUser?._id && !currentUser?.id) {
      setError("Unable to create announcement: current user is not available. Please log in again.");
      return;
    }

    try {
      const body = {
        ...payload,
        user_id: payload.user_id || currentUser._id || currentUser.id,
      };

      await createAnnouncement(body);
      setError("");
      // server will emit announcement; reload for consistency
      await load();
    } catch (err) {
      console.error("create announcement failed", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to create announcement";
      setError(`Create announcement failed: ${serverMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Announcements</h1>
          <p className="text-slate-400 text-sm mt-1">Publish community announcements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setShowCreate(true)}>+ New Announcement</Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Loading announcements...</div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 font-medium">{error}</div>
      ) : (
        <AnnouncementList items={items} onView={(a) => setSelected(a)} />
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-xl bg-[#0e1422] p-6 border border-slate-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">New Announcement</h3>
                <p className="text-xs text-slate-400 mt-1">Publish a community announcement</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">✕</button>
            </div>

            <AnnouncementForm onCancel={() => setShowCreate(false)} onSubmit={async (data) => { await handleCreate(data); setShowCreate(false); }} />
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-xl bg-[#0e1422] p-6 border border-slate-800">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">{selected.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selected.type} • {selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-900/40 p-4.5 rounded-lg border border-slate-800 font-medium text-sm text-slate-200 leading-relaxed mb-5">
              {selected.message}
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-4">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
