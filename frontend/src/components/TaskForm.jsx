import { useState } from "react";
import API from "../api/api";
import { addCurrentTask } from "../utils/token";

function TaskForm() {

  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState("uppercase");

  const submitTask = async (e) => {
    e.preventDefault();

    if (!title.trim() || !input.trim()) {
      alert("Task title and input text are required.");
      return;
    }

    const task = await API.post("/tasks", {
      title: title.trim(),
      input: input.trim(),
      operation
    });

    setTitle("");
    setInput("");
    addCurrentTask(task.data);
  };

  return (
    <form
      onSubmit={submitTask}
      className="space-y-4"
    >
      <input
        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:bg-white"
        placeholder="Task Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="h-28 w-full resize-none overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:bg-white"
        placeholder="Input text"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <select
        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-600 focus:bg-white"
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
        <option value="reverse">Reverse String</option>
        <option value="wordcount">Word Count</option>
      </select>

      <button
        className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
