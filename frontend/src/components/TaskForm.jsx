import { useState } from "react";
import API from "../api/api";

function TaskForm({ refresh }) {

  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState("uppercase");

  const submitTask = async (e) => {
    e.preventDefault();

    await API.post("/tasks", {
      title,
      input,
      operation
    });

    setTitle("");
    setInput("");

    refresh();
  };

  return (
    <form
      onSubmit={submitTask}
      className="bg-white p-6 rounded-xl shadow-md max-w-xl"
    >

      <h2 className="text-lg font-semibold mb-3">
        Create AI Task
      </h2>

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded mb-3"
        placeholder="Input text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded mb-3"
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
        <option value="reverse">Reverse String</option>
        <option value="wordcount">Word Count</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Task
      </button>

    </form>
  );
}

export default TaskForm;