import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext, Context } from "@/context";
import { Store } from "@/helpers/serverHelpers";
import api from "@/config/axios";
import { message } from "antd";

function RegisterPage() {
  const navigate = useNavigate();

  const { getters, setters } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (getters.loginState) {
      navigate("/dashboard");
    }
  }, [getters.loginState, navigate]);

  async function setUpUser(email: string, name: string) {
    try {
      const data: Store = {
        user: { email, name, presentations: [], avatar: "" },
        presentations: [],
        history: [],
      };
      await api.put("/store", { store: data });
      setters.setUserData(data);
    } catch (e) {
      const error = e as { response: { data: { error: string } } };
      message.error("Store Error: " + error.response.data.error);
    }
  }

  async function registerUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      message.error("Registration Error: Passwords do not match!");
      return;
    }

    try {
      const response = await api.post("/admin/auth/register", {
        email,
        password,
        name,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setters.setLogin(true);
        message.success("Register successful!");
        setUpUser(email, name);
        navigate("/dashboard");
      }
    } catch (e) {
      const error = e as { response: { data: { error: string } } };
      message.error("Registration Error: " + error.response.data.error);
    }
  }
  return (
    <div id="registerPage">
      <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-white">P r e s t o</div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" id="registerForm" onSubmit={registerUser}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="block w-full rounded-md border-0 bg-gray-700 text-white placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 py-1.5 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                id="registerButton"
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 text-sm font-semibold leading-6 text-white shadow-sm py-1.5 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
