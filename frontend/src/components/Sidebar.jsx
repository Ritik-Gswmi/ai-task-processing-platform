import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Create Tasks", target: "/dashboard" },
  { label: "Current Tasks", target: "/dashboard/current" },
  { label: "All Tasks", target: "/dashboard/all" },
  { label: "Account", target: "/dashboard/account" },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] overflow-hidden border-r border-slate-200 bg-slate-50 text-slate-800 shadow-sm transition-all duration-300 ${
        sidebarOpen ? "w-64 opacity-100" : "w-0 border-transparent opacity-0"
      }`}
    >
      <div className="flex h-full flex-col p-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.target);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                location.pathname === item.target
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
