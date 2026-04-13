from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

DB_NAME = "bookings.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracker_id TEXT,
            car_name TEXT,
            name TEXT,
            phone TEXT,
            start_date TEXT,
            end_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "BYAHE backend is running"})

@app.route("/book", methods=["POST"])
def book():
    data = request.get_json()

    tracker_id = data.get("tracker_id")
    car_name = data.get("car_name")
    name = data.get("name")
    phone = data.get("phone")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not all([tracker_id, car_name, name, phone, start_date, end_date]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (tracker_id, car_name, name, phone, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (tracker_id, car_name, name, phone, start_date, end_date))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Booking saved successfully"})

@app.route("/bookings", methods=["GET"])
def get_bookings():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

init_db()