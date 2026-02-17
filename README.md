# 🎙️ AI Meeting Intelligence

AI system that automatically transcribes meetings, generates summaries, and extracts action items using a fully self‑hosted async pipeline.

---

## 🚀 Features

* 🎤 Transcription with faster‑whisper
* 🧠 Summarization via Ollama
* ⚡ Async processing with BullMQ + Redis
* 📊 Live meeting status tracking
* 🗂️ Modern React dashboard

---

## 🏗️ Architecture

```
Upload → Node API → Redis Queue → Worker
       → Whisper → Ollama → SQLite → React UI
```

---

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind
**Backend:** Node.js, Express, SQLite, BullMQ, Redis
**AI:** faster‑whisper, Ollama, Python

---

## ⚙️ Quick Start

```bash
# backend
cd backend && npm install && npm run dev

# worker
node workers/meetingWorker.js

# frontend
cd frontend && npm install && npm run dev
```

App runs at: `http://localhost:5173`

---

## 🎯 Why This Project

Demonstrates real‑world:

* async job architecture
* AI pipeline orchestration
* queue‑based backend design
* self‑hosted AI systems

---
