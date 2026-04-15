/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginLayout from "../layouts/LoginLayout";
import ErrorBoundary from "./ErrorBoundary";
import NotFound from "./NotFound";
import FirsstTimers from "../pages/dashboard/FirsstTimers";
// import ChangePassword from "../pages/dashboard/ChangePassword";
// import CreateAdmin from "../pages/dashboard/CreateAdmin";

// const FirstTimers = lazy(() => import("../pages/dashboard/FirstTimers"));
const Gallery = lazy(() => import("../pages/dashboard/Gallery"));
const UploadBlog = lazy(() => import("../pages/dashboard/UploadBlog"));
const GetAllBookings = lazy(() => import("../pages/dashboard/GetAllBookings"));
const Login = lazy(() => import("../pages/auth/Login"));
const CreateAdmin = lazy(() => import("../pages/dashboard/CreateAdmin"));
const ChangePassword = lazy(() => import("../pages/dashboard/ChangePassword"));

// Private Route Guard Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');
  
  if (!token || !adminData) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const element = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <FirsstTimers />
      },
      {
        path: "uploadblog",
        element: <UploadBlog />
      },
      {
        path: "bookings",
        element: <GetAllBookings />
      },
      {
        path: "upload",
        element: <Gallery />
      },
      {
        path: "change-password",
        element: <ChangePassword />
      },
      {
        path: "create-admin",
        element: <CreateAdmin />
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorBoundary />
  }
]);