#!/usr/bin/env python3
"""
OmniQuest Python Backend Server
Lightweight, robust HTTP JSON REST API with zero external dependencies.
"""

import sys
import os
import json
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Import questions and topics from local module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from questions import TOPICS, QUESTIONS

LEADERBOARD_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "leaderboard.json")

def load_leaderboard():
    if os.path.exists(LEADERBOARD_FILE):
        try:
            with open(LEADERBOARD_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_leaderboard(board):
    try:
        with open(LEADERBOARD_FILE, "w", encoding="utf-8") as f:
            json.dump(board, f, indent=2)
    except Exception as e:
        print(f"Error saving leaderboard: {e}", file=sys.stderr)

class OmniQuestHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/health":
            self._send_json({
                "status": "healthy",
                "backend": "Python 3.10",
                "framework": "Standard Library HTTP Server",
                "total_questions": len(QUESTIONS),
                "topics_available": [t["id"] for t in TOPICS]
            })
            return

        if path == "/api/topics":
            topic_counts = {}
            for q in QUESTIONS:
                topic_counts[q["topic"]] = topic_counts.get(q["topic"], 0) + 1

            topics_with_counts = []
            for t in TOPICS:
                count = len(QUESTIONS) if t["id"] == "All" else topic_counts.get(t["id"], 0)
                topics_with_counts.append({
                    **t,
                    "question_count": count
                })
            self._send_json({"topics": topics_with_counts})
            return

        if path == "/api/questions":
            topic = query.get("topic", ["All"])[0]
            try:
                count = int(query.get("count", ["8"])[0])
            except ValueError:
                count = 8

            candidates = QUESTIONS if topic == "All" else [q for q in QUESTIONS if q["topic"] == topic]
            selected = random.sample(candidates, min(count, len(candidates)))

            # Shuffle choices for each question so client gets randomized deck
            deck = []
            for item in selected:
                options_shuffled = list(item["o"])
                random.shuffle(options_shuffled)
                deck.append({
                    "id": item["id"],
                    "topic": item["topic"],
                    "c": item["c"],
                    "q": item["q"],
                    "code": item.get("code"),
                    "options": options_shuffled,
                    "correctAnswer": item["o"][item["a"]],
                    "explanation": item["e"]
                })
            self._send_json({"deck": deck, "count": len(deck), "topic": topic})
            return

        if path == "/api/leaderboard":
            board = load_leaderboard()
            self._send_json({"leaderboard": board})
            return

        self._send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length)
            body = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except Exception:
            body = {}

        if path == "/api/verify":
            qid = body.get("questionId")
            chosen = body.get("selectedAnswer")
            time_left = float(body.get("timeLeft", 0))
            streak = int(body.get("streak", 0))
            is_timed = bool(body.get("isTimed", True))

            target = next((q for q in QUESTIONS if q["id"] == qid), None)
            if not target:
                self._send_json({"error": "Question not found"}, status=404)
                return

            correct_answer = target["o"][target["a"]]
            is_correct = (chosen == correct_answer)

            if is_correct:
                speed_bonus = round(time_left * 6) if is_timed else 0
                streak_bonus = streak * 15
                total_gain = 100 + speed_bonus + streak_bonus
            else:
                speed_bonus = 0
                streak_bonus = 0
                total_gain = 0

            self._send_json({
                "isCorrect": is_correct,
                "correctAnswer": correct_answer,
                "explanation": target["e"],
                "pointsGain": total_gain,
                "speedBonus": speed_bonus,
                "streakBonus": streak_bonus
            })
            return

        if path == "/api/leaderboard":
            name = str(body.get("name", "Player")).strip() or "Player"
            topic = str(body.get("topic", "All"))
            score = int(body.get("score", 0))
            correct = int(body.get("correct", 0))
            total = int(body.get("total", 0))

            board = load_leaderboard()
            board.append({
                "name": name,
                "topic": topic,
                "score": score,
                "correct": correct,
                "total": total,
                "timestamp": body.get("date", "Today")
            })
            board.sort(key=lambda x: x["score"], reverse=True)
            board = board[:10]  # top 10
            save_leaderboard(board)
            self._send_json({"success": True, "leaderboard": board})
            return

        self._send_json({"error": "Endpoint not found"}, status=404)

    def log_message(self, format, *args):
        # Quiet standard HTTP access logs
        return

def run(port=5001):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, OmniQuestHandler)
    print(f"🐍 OmniQuest Python Backend listening on http://127.0.0.1:{port}", flush=True)
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    run(port)
