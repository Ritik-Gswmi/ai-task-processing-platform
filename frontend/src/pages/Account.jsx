import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { getToken, removeToken } from "../utils/token";
import { withMinimumDelay } from "../utils/loading";

function Account() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await withMinimumDelay(() => API.get("/auth/me"), 900);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Username and email are required.");
      return;
    }

    try {
      setSaving(true);
      await withMinimumDelay(
        () =>
          API.put("/auth/me", {
            name: name.trim(),
            email: email.trim(),
            password: password.trim() || undefined,
          }),
        900
      );
      setPassword("");
      alert("Profile updated successfully");
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
        return;
      }

      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your username, email, and password.
          </p>
        </div>

        <form className="space-y-4 max-w-xl" onSubmit={saveProfile}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default Account;
