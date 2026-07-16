import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpenState] = useState(() => {
    const stored = sessionStorage.getItem("sidebarOpen");
    return stored === null ? true : stored === "true";
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const setSidebarOpen = (value) => {
    setSidebarOpenState((previous) => {
      const nextValue =
        typeof value === "function" ? value(previous) : value;
      sessionStorage.setItem("sidebarOpen", String(nextValue));
      return nextValue;
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("sidebarOpen") === null) {
      sessionStorage.setItem("sidebarOpen", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar
        setSidebarOpen={setSidebarOpen}
        onLogout={() => logout(navigate)}
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`pt-20 px-4 pb-8 transition-[margin] duration-300 sm:px-6 lg:px-8 ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
