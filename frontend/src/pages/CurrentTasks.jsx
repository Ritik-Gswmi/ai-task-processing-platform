import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import {
  clearCurrentTasks,
  getCurrentTasks,
  getToken,
  setCurrentTasks,
} from "../utils/token";
import { withMinimumDelay } from "../utils/loading";

function CurrentTasks() {
  const [tasks, setTasks] = useState(() => getCurrentTasks());
  const [loading, setLoading] = useState(tasks.length === 0);
  const navigate = useNavigate();

  const currentTaskIds = useMemo(
    () => tasks.map((task) => task._id),
    [tasks]
  );

  const fetchCurrentTasks = useCallback(async () => {
    const token = getToken();
    if (!token) {
      clearCurrentTasks();
      navigate("/login");
      return;
    }

    const storedTasks = getCurrentTasks();
    if (storedTasks.length === 0) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const res = await withMinimumDelay(() => API.get("/tasks"), 900);
      const taskMap = new Map(res.data.map((task) => [task._id, task]));
      const updatedTasks = storedTasks
        .map((task) => taskMap.get(task._id))
        .filter(Boolean);

      setTasks(updatedTasks);
      setCurrentTasks(updatedTasks);
    } catch (err) {
      if (err.response?.status === 401) {
        clearCurrentTasks();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await API.delete(`/tasks/${taskId}`);
        const nextTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(nextTasks);
        setCurrentTasks(nextTasks);
      } catch (err) {
        if (err.response?.status === 401) {
          clearCurrentTasks();
          navigate("/login");
        }
      }
    },
    [navigate, tasks]
  );

  useEffect(() => {
    fetchCurrentTasks();
    const interval = setInterval(fetchCurrentTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchCurrentTasks]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <section className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Current Tasks
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Showing the tasks created in this session.
        </p>
      </section>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
          No current task available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 pb-12 lg:grid-cols-2 xl:grid-cols-3">
          {currentTaskIds.map((taskId) => {
            const task = tasks.find((item) => item._id === taskId);
            return task ? <TaskCard key={task._id} task={task} onDelete={deleteTask} /> : null;
          })}
        </div>
      )}
    </Layout>
  );
}

export default CurrentTasks;
