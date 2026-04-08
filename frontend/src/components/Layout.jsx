import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <main
        className={`pt-20 px-8 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>

    </div>
  );
}

export default Layout;