import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks";

export default function OTPForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuthActions();

  const email = location.state?.email ?? null;

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify OTP. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Enter OTP</h1>
      <p className="mt-2 text-sm text-slate-500">
        We sent a 6-digit code to <span className="font-medium text-slate-900">{email}</span>.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">OTP code</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123456"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-green-700 px-4 py-3 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
