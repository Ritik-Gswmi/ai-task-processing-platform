import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import { getToken, removeToken } from "../utils/token";
import { withMinimumDelay } from "../utils/loading";

function AllTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await withMinimumDelay(() => API.get("/tasks"), 900);
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
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
        setTasks((current) => current.filter((task) => task._id !== taskId));
      } catch (err) {
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <section className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          All Tasks
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Showing every task created for this account.
        </p>
      </section>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
          No tasks created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 pb-12 lg:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default AllTasks;
