const Task = require("../models/Task");
const taskQueue = require("../queues/taskQueue");

exports.createTask = async (req, res) => {

  const { title, input, operation } = req.body;

  if (!title?.trim() || !input?.trim()) {
    return res.status(400).json({ message: "Task title and input are required" });
  }

  const allowedOperations = [
    "uppercase",
    "lowercase",
    "reverse",
    "wordcount"
  ];

  if (!allowedOperations.includes(operation)) {
    return res.status(400).json({ message: "Invalid operation" });
  }

  const task = await Task.create({
    userId: req.user,
    title,
    input,
    operation
  });

  await taskQueue.add("processTask", {
    taskId: task._id.toString(),
    input,
    operation
  });

  // Wake worker service without blocking request
  fetch(process.env.WORKER_URL + "/healthz").catch(() => {});
  
  res.json(task);
};

exports.getTasks = async (req, res) => {

  const tasks = await Task.find({ userId: req.user });

  res.json(tasks);

};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    userId: req.user._id
  });

  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
};
