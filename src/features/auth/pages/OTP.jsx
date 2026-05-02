import { useState } from "react";
import API from "../../../services/axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    const res = await API.post("/auth/login/step2", {
      email: state.email,
      otp,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    navigate("/");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded">
        <input
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleVerify}
          className="bg-green-600 text-white p-2 w-full"
        >
          Verify
        </button>
      </div>
    </div>
  );
}