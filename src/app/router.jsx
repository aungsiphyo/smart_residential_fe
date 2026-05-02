import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import RoomsPage from "../features/rooms/RoomsPage";
import UsersPage from "../features/users/UsersPage";
import VisitorCheckInPage from "../features/visitors/VisitorCheckInPage";
import ReportsPage from "../features/reports/ReportsPage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import AnnouncementsPage from "../features/announcements/AnnouncementsPage";
import SosPage from "../features/sos/SosPage";
import BillsPage from "../features/bills/BillsPage";
import HelpersPage from "../features/helpers/HelpersPage";
import ParkingPage from "../features/parking/ParkingPage";
import SettingsPage from "../features/settings/SettingsPage";
import Login from "../features/auth/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/rooms", element: <RoomsPage /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/visitor-checkin", element: <VisitorCheckInPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/announcements", element: <AnnouncementsPage /> },
      { path: "/sos", element: <SosPage /> },
      { path: "/bills", element: <BillsPage /> },
      { path: "/helpers", element: <HelpersPage /> },
      { path: "/parking", element: <ParkingPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);