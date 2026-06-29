import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import RoomsPage from "../features/rooms/RoomsPage";
import UsersPage from "../features/users/UsersPage";
import VisitorCheckInPage from "../features/visitors/VisitorCheckInPage";
import VisitorPage from "../features/visitors/VisitorPage";
import ReportsPage from "../features/reports/ReportsPage";
import AdvertisementsPage from "../features/reports/AdvertisementsPage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import AnnouncementsPage from "../features/announcements/AnnouncementsPage";
import SosAlertsPage from "../features/sos/SosAlertsPage";
import BillsPage from "../features/bills/BillsPage";
import UserBillsPage from "../features/bills/UserBillsPage";
import useAuthStore from "../features/auth/authStore";
import HelpersPage from "../features/helpers/HelpersPage";
import RoleProtectedRoute from "./RoleProtectedRoute";

const BillsRouteWrapper = () => {
  const user = useAuthStore(state => state.user);
  if (user?.role === "Admin" || user?.role === "Staff") {
    return <BillsPage />;
  }
  return <UserBillsPage />;
};
import ParkingPage from "../features/parking/ParkingPage";
import SettingsPage from "../features/settings/SettingsPage";
import Login from "../features/auth/pages/Login";
import OTP from "../features/auth/pages/OTP";
import Signup from "../features/auth/pages/Signup";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rooms", element: <RoleProtectedRoute allowedRoles={["Admin", "Staff"]}><RoomsPage /></RoleProtectedRoute> },
      { path: "users", element: <RoleProtectedRoute allowedRoles={["Admin", "Staff"]}><UsersPage /></RoleProtectedRoute> },
      { path: "visitor-checkin", element: <VisitorPage /> },
      { path: "reports", element: <RoleProtectedRoute allowedRoles={["Admin", "Staff"]}><ReportsPage /></RoleProtectedRoute> },
      { path: "advertisements", element: <RoleProtectedRoute allowedRoles={["Admin", "Staff"]}><AdvertisementsPage /></RoleProtectedRoute> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "announcements", element: <AnnouncementsPage /> },
      { path: "sos", element: <SosAlertsPage /> },
      { path: "bills", element: <BillsRouteWrapper /> },
      { path: "helpers", element: <RoleProtectedRoute allowedRoles={["Admin", "Staff"]}><HelpersPage /></RoleProtectedRoute> },
      { path: "parking", element: <ParkingPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/otp", element: <OTP /> },
]);
