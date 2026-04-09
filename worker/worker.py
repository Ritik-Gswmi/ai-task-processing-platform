import json
import time
import threading
from typing import Optional, List, cast
from flask import Flask
from bson import ObjectId
from redis_client import redis_client
from db import tasks_collection
from ai_processor import process_task

QUEUE_NAME = "task_queue"
app = Flask(__name__)

def update_task(task_id: str, status: str, result: str | None = None):
    update_data = {"status": status}
    if result is not None:
        update_data["result"] = result
    tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})

def process_queue():
    print("Worker started. Waiting for tasks...")
    print("Waiting for tasks in queue:", QUEUE_NAME)
    print("Mongo DB:", tasks_collection.database.name)
    print("Mongo Collection:", tasks_collection.name)
    while True:
        task_data: Optional[List[str]] = cast(Optional[List[str]], redis_client.blpop(QUEUE_NAME))
        if task_data:
            _, task_json = task_data
            task = json.loads(task_json)
            task_id = task.get("task_id") or task.get("taskId")
            operation = task["operation"]
            input_text = task["input"]

            print(f"[Worker] Processing task {task_id} -> {operation}")
            try:
                update_task(task_id, "processing")
                result = process_task(operation, input_text)
                update_task(task_id, "completed", result)
                print(f"[Worker] Task {task_id} completed: {result}")
            except Exception as e:
                update_task(task_id, "failed", str(e))
                print(f"[Worker] Task {task_id} failed: {e}")

# Start the worker in a background thread
threading.Thread(target=process_queue, daemon=True).start()

@app.route("/")
def home():
    return "Worker running", 200

@app.route("/healthz")
def health():
    return "ok", 200

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
