import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks";

const roles = ["Citizen", "Admin", "Staff", "Security"];

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuthActions();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rfidUid, setRfidUid] = useState("");
  const [role, setRole] = useState("Citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp({
        fullname,
        email,
        phone,
        password,
        role,
        room_id: roomId,
        rfid_uid: rfidUid,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Register with your villa, staff, or administrator account.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Alex Sterling"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="alex@civic.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="09 421 567 890"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Room / Area</label>
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Villa A-101"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">RFID card UID</label>
          <input
            value={rfidUid}
            onChange={(e) =>
              setRfidUid(e.target.value.replace(/[^a-fA-F0-9]/g, "").toUpperCase())
            }
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="27095007"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-700 px-4 py-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
