import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "@/pages/Dashboard";
import { PresentationPage } from "@/pages/PresentationPage";
import RevealEditor from "@/pages/Test";

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
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path: "logout",
        element: <LogoutPage />
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
    },
    {
        path: "/presentation",
        element: <PresentationPage/>,
    },
    {
        path: "/test",
        element: <RevealEditor/>
    }
]);