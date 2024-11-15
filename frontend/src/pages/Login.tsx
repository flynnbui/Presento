import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext, Context } from "../context";
import { Store } from "@/helpers/serverHelpers";
import api from "@/config/axios";
import { message } from "antd";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const navigate = useNavigate();

  const { getters, setters } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (getters.loginState) {
      navigate("/dashboard");
    }
  }, [getters.loginState, getters.userData, navigate]);

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await api.post("/admin/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setters.setLogin(true);
      const storeResponse = await api.get("/store");
      const data: Store = storeResponse.data.store;
      setters.setUserData(data);
      message.success("Login successful!");
    } catch (e) {
      const error = e as { response: { data: { error: string } } };
      message.error("Login Error: " + error.response.data.error);
    }
  }

  return (
    <div id="loginPage">
      <div className="flex h-screen flex-col justify-center px-4 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-white">P r e s t o</div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" id="loginForm" onSubmit={loginUser}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                id="loginButton"
                type="submit"
                className="flex w-full justify-center"
              >
                Sign in
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not a member?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
