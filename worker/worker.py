import json
import time
from typing import Optional, List, cast
from bson import ObjectId
from redis_client import redis_client
from db import tasks_collection
from ai_processor import process_task

QUEUE_NAME = "task_queue"

def update_task(task_id: str, status: str, result: str | None = None):
    """Update task status and optionally store the result in MongoDB."""
    update_data = {"status": status}
    if result is not None:   # only set result if it’s provided
        update_data["result"] = result
    tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})

def process_queue():
    print("Worker started. Waiting for tasks...")
    while True:
        # Use cast to silence Pylance Awaitable error
        task_data: Optional[List[str]] = cast(Optional[List[str]], redis_client.blpop(QUEUE_NAME))
        if task_data:
            _, task_json = task_data
            task = json.loads(task_json)
            task_id = task.get("task_id") or task.get("taskId")
            operation = task["operation"]
            input_text = task["input"]

            print(f"[Worker] Processing task {task_id} -> {operation}")

            try:
                # mark as processing
                update_task(task_id, "processing")

                # do the actual AI operation
                result = process_task(operation, input_text)

                # mark as completed
                update_task(task_id, "completed", result)
                print(f"[Worker] Task {task_id} completed: {result}")

            except Exception as e:
                # mark as failed
                update_task(task_id, "failed", str(e))
                print(f"[Worker] Task {task_id} failed: {e}")

if __name__ == "__main__":
    while True:
        try:
            process_queue()
        except Exception as e:
            print("Worker crashed. Restarting in 5 seconds...", e)
            time.sleep(5)
