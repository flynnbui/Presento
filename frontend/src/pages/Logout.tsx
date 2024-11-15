import api from "@/config/axios";
import { useContext, Context } from "../context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    api.post("/admin/auth/logout", localStorage.getItem("token"));
    localStorage.removeItem("token");
    setters.setLogin(false);
    setters.setUserData(undefined);
    navigate("/login");
  }, [getters.loginState, navigate]);
  return <></>;
}

export default Logout;
