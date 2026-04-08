from pymongo import MongoClient
from pymongo.errors import ConfigurationError
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017/ai_tasks")
client = MongoClient(MONGO_URI)

try:
    db = client.get_default_database()
except ConfigurationError:
    db = None

if db is None:
    db = client["ai_tasks"]
tasks_collection = db["tasks"]
