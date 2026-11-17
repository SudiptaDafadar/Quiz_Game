# OmniQuest — Interactive Multi-Topic Quiz Game

Gamified quiz application across **Marvel Universe (MCU)**, **General Knowledge (GK)**, **Video Games**, and **Python & Code**, built in **JavaScript (React 19)** with a **Python 3 REST backend**.

---

## 🚀 Running in Visual Studio Code (Quick Start)

### 1. Prerequisites
- **Node.js** (v18 or higher): [nodejs.org](https://nodejs.org/)
- **Python** (v3.8 or higher, standard library — zero pip packages required): [python.org](https://python.org/)

---

### 2. Open Project in VS Code
1. Open the project folder in VS Code:
   ```bash
   code .
   ```
2. Open the integrated terminal (`Ctrl + \`` or `Cmd + \``).

---

### 3. Install Dependencies
In the VS Code terminal, run:
```bash
npm install
```

---

### 4. Run the Full-Stack Application
Start the unified server (starts both the JavaScript/Vite frontend on port `3000` and automatically spawns the Python REST backend on port `5001`):
```bash
npm run dev
```
Or run directly with Node:
```bash
node server.js
```

Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ VS Code One-Click Run & Debug (F5)

The project includes pre-configured `.vscode/launch.json`:
1. Press `F5` (or go to **Run & Debug** in the VS Code sidebar).
2. Select **"⚡ Run OmniQuest Full-Stack (Node server.js + Python)"** or **"🚀 Full-Stack App + Browser"**.
3. VS Code will automatically start the server and open Chrome connected to your session.

---

## 📁 Project Structure

- **Frontend (`src/`)**: Pure JavaScript & JSX (`App.jsx`, `main.jsx`, `data/questions.js`) using React 19, Tailwind CSS, Lucide Icons, and HTML5 Web Audio synthesis.
- **Backend (`backend/`)**: Python 3 HTTP REST API (`app.py`, `questions.py`, `leaderboard.json`) with zero external dependencies.
- **Full-Stack Gateway**: `server.js` (Express + Vite) which automatically manages the Python backend process and routes `/api/*` requests.

---

## 🎮 Key Features

- **Marvel Universe (MCU Only)**: Curated canon questions covering Infinity Stones, Avengers Endgame, Wakanda, and Phase 1–4 lore.
- **Multi-Domain Selection**: General Knowledge, Video Games, Python & Code, Science & Cosmos, or All Topics Tournament Mix.
- **Zero-Latency Scoring**: Instant (0ms) answer locking with emerald green highlight for correct answers.
- **Time's Up Revelation**: Automatically displays the correct answer in green with explanations whenever time expires.
- **Keyboard Shortcuts**: Keys `1–4` to answer, `Enter` for next question, `H` for 50/50 lifeline.
