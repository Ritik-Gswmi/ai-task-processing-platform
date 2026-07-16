import { Trash2 } from "lucide-react";

function TaskCard({ task, onDelete }) {

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-slate-100 text-slate-700",
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
    <div className="relative flex max-h-[420px] flex-col rounded-2xl border border-slate-200 bg-white p-5 pb-16 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusColor[task.status]}`}
        >
          {task.status === "processing" && (
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
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

      <p className="mb-2 text-sm text-slate-600">
        <strong>Operation:</strong> {task.operation}
      </p>

      <div className="mb-3 max-h-24 overflow-auto rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        <strong>Input:</strong> {task.input}
      </div>

      <div className="mb-3 flex max-h-24 flex-col overflow-auto rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        <div className="mb-1 flex items-center justify-between">
          <strong className="text-slate-900">Result</strong>
          {task.result && (
            <button
              onClick={copyResult}
              className="text-xs font-medium text-slate-700 hover:underline"
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

      <div className="mb-3 max-h-20 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        <strong>Logs</strong>
        <div className="mt-1 space-y-1">
          <p>Task created</p>
          {task.status === "processing" && <p>Worker picked up task...</p>}
          {task.status === "completed" && <p>Task completed successfully</p>}
          {task.status === "failed" && <p>Task failed during processing</p>}
        </div>
      </div>

      <div className="mt-auto text-xs text-slate-400">
        {new Date(task.createdAt).toLocaleString()}
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Delete task"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
