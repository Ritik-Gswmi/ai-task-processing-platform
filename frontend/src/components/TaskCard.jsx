function TaskCard({ task }) {

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700"
  };

  const copyResult = async () => {
    if (!task?.result) return;

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(task.result);
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = task.result;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border flex flex-col max-h-[420px]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{task.title}</h3>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColor[task.status]}`}
        >
          {task.status === "processing" && (
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          )}
          {task.status === "completed" && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
          {task.status === "failed" && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* Operation */}
      <p className="text-sm text-gray-600 mb-2">
        <strong>Operation:</strong> {task.operation}
      </p>

      {/* Input */}
      <div className="bg-gray-50 p-2 rounded text-sm mb-3 max-h-24 overflow-auto">
        <strong>Input:</strong> {task.input}
      </div>

      {/* Result Display */}
      <div className="bg-gray-50 p-3 rounded text-sm mb-3 max-h-24 overflow-auto flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <strong>Result</strong>
          {task.result && (
            <button
              onClick={copyResult}
              className="text-xs text-blue-600 hover:underline"
            >
              Copy
            </button>
          )}
        </div>
        <div>
          {task.result
            ? task.result
            : <span className="italic text-gray-400">Processing result...</span>
          }
        </div>
      </div>

      {/* Logs Display */}
      <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 mb-3 max-h-20 overflow-auto">
        <strong>Logs</strong>
        <div className="mt-1 space-y-1">
          <p>Task created</p>
          {task.status === "processing" && <p>Worker picked up task...</p>}
          {task.status === "completed" && <p>Task completed successfully</p>}
          {task.status === "failed" && <p>Task failed during processing</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-400">
        {new Date(task.createdAt).toLocaleString()}
      </div>

    </div>
  );
}

export default TaskCard;
