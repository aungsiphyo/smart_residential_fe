import { useState } from "react";
import API from "../../../services/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await API.post("/auth/login/step1", { email, password });
    navigate("/otp", { state: { email } });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded">
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}