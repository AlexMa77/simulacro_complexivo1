from django.conf import settings
from pymongo import MongoClient

_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB]

# Ensure required indexes exist for collections used by the app
try:
	db["rental_events"].create_index([("rental_id", 1)])
	db["fleet_logs"].create_index([("vehicle_id", 1)])
except Exception:
	# If Mongo isn't available at import time, the app can still start; indexes will be created on first request
	pass
