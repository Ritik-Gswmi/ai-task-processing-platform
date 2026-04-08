function Navbar({ setSidebarOpen }) {

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-6 justify-between z-50">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="text-xl text-gray-700"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold">
          AI Task Processing Platform
        </h1>

      </div>

    </header>
  );
}

export default Navbar;