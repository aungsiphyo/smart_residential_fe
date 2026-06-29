import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/authStore";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
