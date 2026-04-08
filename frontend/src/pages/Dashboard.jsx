import { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/token";
import Loader from "../components/Loader";

function Dashboard() {
  const [loading, setLoading] = useState(true);      // first fetch loader
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // live updates indicator
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (!loading) setRefreshing(true); // show subtle LIVE pulse for updates
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    } finally {
      if (loading) {
        // Keep loader visible at least 400ms
        setTimeout(() => setLoading(false), 400);
      }
      setRefreshing(false);
    }
  }, [loading, navigate]);

  // Initial fetch + 5s auto-refresh
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Show loader only during first fetch
  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">Tasks</h2>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className={`w-2 h-2 rounded-full animate-pulse ${refreshing ? "bg-green-500" : "bg-green-300"}`}></span>
            LIVE
          </span>
        </div>
        <p className="text-gray-500">Create and monitor AI processing jobs</p>
      </div>

      {/* Task Form */}
      <TaskForm refresh={fetchTasks} />

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 mt-6">No tasks created yet.</p>
      ) : (
        <div 
        id="tasks-section"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-12">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;
