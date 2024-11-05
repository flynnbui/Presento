import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "@/pages/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage/>,
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
    }
]);