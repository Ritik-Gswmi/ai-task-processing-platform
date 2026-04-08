
const Redis = require("ioredis");

const QUEUE_NAME = process.env.WORKER_QUEUE_NAME || "task_queue";

const redis = new Redis(process.env.REDIS_URL);

redis.on("error", (err) => {
  console.warn("[taskQueue] Redis error:", err?.message || err);
});

module.exports = {
  add: async (_jobName, data) => {
    const taskId = data?.taskId ?? data?.task_id;

    if (!taskId) {
      throw new Error("Missing taskId for queued task");
    }

    const payload = {
      task_id: String(taskId),
      input: data.input,
      operation: data.operation,
    };

    await redis.rpush(QUEUE_NAME, JSON.stringify(payload));
  },
};