import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

import App from "./App";
import AttributionsPage from "./pages/Admin/AttributionsPage";
import BeneficiariesPage from "./pages/Admin/BeneficiariesPage";
import DashboardAdminPage from "./pages/Admin/DashboardAdminPage/DashboardAdminPage";
import DevicesPage from "./pages/Admin/DevicesPage";
import UsersPage from "./pages/Admin/UsersPage";
import DashboardBenevolePage from "./pages/Benevole/DashboardBenevolePage";
import LoginPage from "./pages/LoginPage/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/devices",
    element: (
      <ProtectedRoute requiredRole="admin">
        <DevicesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRole="admin">
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/beneficiaries",
    element: (
      <ProtectedRoute requiredRole="admin">
        <BeneficiariesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/attributions",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AttributionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/benevole",
    element: (
      <ProtectedRoute requiredRole="benevole">
        <DashboardBenevolePage />
      </ProtectedRoute>
    ),
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error("Your HTML Document should contain a <div id='root'></div>");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
