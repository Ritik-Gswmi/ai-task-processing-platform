// utils/token.js
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
const CURRENT_TASKS_KEY = "currentTasks";

export const clearCurrentTasks = () => sessionStorage.removeItem(CURRENT_TASKS_KEY);

export const getCurrentTasks = () => {
  const tasks = sessionStorage.getItem(CURRENT_TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const setCurrentTasks = (tasks) =>
  sessionStorage.setItem(CURRENT_TASKS_KEY, JSON.stringify(tasks));

export const addCurrentTask = (task) => {
  const tasks = getCurrentTasks();
  const nextTasks = [task, ...tasks.filter((item) => item._id !== task._id)];
  setCurrentTasks(nextTasks);
  return nextTasks;
};

export const getCurrentTask = () => getCurrentTasks()[0] || null;
export const setCurrentTask = (task) => setCurrentTasks(task ? [task] : []);
export const clearCurrentTask = clearCurrentTasks;
