from pymongo import MongoClient
import os
import time
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = None
db = None
tasks_collection = None


def connect_db():
    global client, db, tasks_collection

    while True:
        try:
            client = MongoClient(MONGO_URI)

            # Use default DB from MongoDB URI (same behavior as Node backend)
            db = client.get_default_database()

            tasks_collection = db["tasks"]

            print("MongoDB Connected")
            break

        except Exception as e:
            print("MongoDB connection failed. Retrying...", e)
            time.sleep(5)


connect_db()
