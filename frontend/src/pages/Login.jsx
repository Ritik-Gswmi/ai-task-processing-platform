import { useState } from "react";
import API from "../api/api";
import { setToken } from "../utils/token";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import { withMinimumDelay } from "../utils/loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await withMinimumDelay(
        () => API.post("/auth/login", { email, password }),
        900
      );

      setToken(res.data.token);
      sessionStorage.setItem("sidebarOpen", "true");
      setUser({ token: res.data.token });

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form
      onSubmit={login}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6">
          Login to your AI Task Platform
        </p>

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700">
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-slate-700 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
