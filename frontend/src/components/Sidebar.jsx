import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, LogOut } from "lucide-react";

function Sidebar({ sidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      style={{ willChange: "transform" }}
      className={`fixed top-16 bottom-0 left-0 bg-gray-900 text-white transition-[width] duration-300 overflow-hidden transform-gpu ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="flex flex-col justify-between h-full">
        {/* Menu */}
        <div className="p-2 space-y-2">
          {/* Dashboard button */}
          <button
            onClick={() => {
              if (location.pathname === "/dashboard") {
                // Already on dashboard → scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/dashboard");
              }
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-700"
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          {/* Tasks button */}
          <button
            onClick={() => {
              const element = document.getElementById("tasks-section");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-700"
          >
            <ListTodo size={20} />
            {sidebarOpen && <span>Tasks</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="p-2">
          <button
            onClick={() => logout(navigate)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded bg-red-500 hover:bg-red-600"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
