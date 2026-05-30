import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/authStore";

export default function ProtectedRoute({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
