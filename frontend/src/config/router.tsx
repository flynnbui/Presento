import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/Landing";
import RegisterPage from "@/pages/Register";
import LoginPage from "@/pages/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Logout from "@/pages/Logout";
import { ReactNode, useContext, useEffect, useRef } from "react";
import { Context } from "@/context";
import { message } from "antd";
import { PresentationPage } from "@/pages/Presentation";

interface ProtectedRouteAuthProps {
  children: ReactNode;
}

const ProtectedRouteAuth: React.FC<ProtectedRouteAuthProps> = ({
  children,
}) => {
  const { getters } = useContext(Context);
  const isLogin = getters.loginState || localStorage.getItem("token") !== null;
  const messageShownRef = useRef(false);
  useEffect(() => {
    if (!isLogin && !messageShownRef.current) {
      message.error("You need to login first!!");
      messageShownRef.current = true;
    }
  }, [isLogin]);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRouteAuth>
        <Dashboard />
      </ProtectedRouteAuth>
    ),
  },
  {
    path: "/presentation/:pId",
    element: (
      <ProtectedRouteAuth>
        <PresentationPage />
      </ProtectedRouteAuth>
    ),
  },
]);
