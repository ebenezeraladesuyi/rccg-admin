/* eslint-disable react-refresh/only-export-components */
import {lazy} from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";


const FirsstTimers = lazy(() => import("../pages/dashboard/FirsstTimers"));
const Gallery = lazy(() => import("../pages/dashboard/Gallery"));
const UploadBlog = lazy(() => import("../pages/dashboard/UploadBlog"));


export const element = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children : [
            {
                index: true,
                element: <Gallery />
            },
            {
                path: "uploadblog",
                element: <UploadBlog />
            },
            {
                path: "firsttimers",
                element: <FirsstTimers />
            },
        ]
    }
]);
