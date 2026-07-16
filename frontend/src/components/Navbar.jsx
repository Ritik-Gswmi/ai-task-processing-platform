import { Menu, LogOut } from "lucide-react";

function Navbar({ setSidebarOpen, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-800 text-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold tracking-tight">
            AI Task Processing Platform
          </h1>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
