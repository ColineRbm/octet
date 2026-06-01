import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardAdminPage from "./pages/Admin/DashboardAdminPage";
import DashboardBenevolePage from "./pages/Benevole/DashboardBenevolePage";
import DevicesPage from "./pages/Admin/DevicesPage";
import UsersPage from "./pages/Admin/UsersPage";
import BeneficiariesPage from "./pages/Admin/BeneficiariesPage";
import AttributionsPage from "./pages/Admin/AttributionsPage";

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
