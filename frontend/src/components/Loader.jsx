function Loader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      {/* Label */}
      <p className="mt-4 text-gray-500 text-lg font-medium">Loading tasks...</p>
    </div>
  );
}

export default Loader;