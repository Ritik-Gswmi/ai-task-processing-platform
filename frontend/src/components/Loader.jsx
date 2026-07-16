function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex items-center gap-2 text-lg font-medium text-slate-600">
          <span>Loading</span>
          <span className="loader-dot" />
          <span className="loader-dot" style={{ animationDelay: "0.15s" }} />
          <span className="loader-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}

export default Loader;
