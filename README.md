# 📝 Notes to Flashcards

> Convert handwritten notes into a smart, AI-powered flashcard and spaced-repetition learning system.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📖 Overview

**Notes to Flashcards** lets you upload handwritten notes (images, PDFs, or camera scans), extracts the text using OCR, and uses AI to turn that text into structured, study-ready flashcards — question/answer, fill-in-the-blank, and multiple choice. It then schedules your reviews using the **SM-2 spaced repetition algorithm**, tracks your progress, and helps you focus on what you're weakest at.

This is not just a converter — it's a full AI study assistant, built end-to-end as a learning project and portfolio piece.

---

## ✨ Features

- 📤 Upload handwritten notes as images or PDFs
- 🔍 OCR text extraction (Tesseract.js)
- 🤖 AI-powered structuring into topics & key concepts (Google Gemini)
- 🃏 Auto-generated flashcards: Q&A, fill-in-the-blank, MCQ
- 🧠 Spaced repetition scheduling (SM-2 algorithm)
- 📊 Analytics dashboard — streaks, retention rate, time spent
- 💬 AI tutor chat to ask questions about your notes
- 🏆 Gamification — XP, daily goals, leaderboards
- 🤝 Shareable flashcard decks & community content
- 📁 Export to PDF / Anki

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| OCR | Tesseract.js |
| AI / LLM | Google Gemini API |
| Database | MongoDB Atlas |
| Cache / Scheduling | Redis (Upstash) |
| File Storage | Cloudinary |
| Auth | NextAuth.js |
| Deployment | Vercel |

---

## 🗺️ Roadmap

- [x] Project setup & repo structure
- [x] Authentication (sign up / login)
- [x] Upload notes (image / PDF)
- [x] OCR text extraction pipeline
- [x] AI flashcard generation (Q&A, fill-blank, MCQ)
- [x] SM-2 spaced repetition engine
- [x] Review / study mode UI
- [x] Analytics dashboard
- [ ] AI tutor chat
- [ ] Gamification (XP, streaks, goals)
- [ ] Deck sharing & community features
- [ ] Export to PDF / Anki
- [ ] Deployment

> This roadmap is updated as features are completed — check commit history for progress.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Cloudinary](https://cloudinary.com/) account
- A free [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

```bash
git clone https://github.com/meghaasinghh/notes-to-flashcards.git
cd notes-to-flashcards
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure
notes-to-flashcards/

├── src/

│   ├── app/              # Next.js App Router pages & API routes

│   ├── components/       # Reusable React components

│   ├── lib/               # Database, AI, OCR, auth utilities

│   ├── models/            # MongoDB schemas

│   └── types/              # TypeScript types

├── public/                 # Static assets

└── README.md

---

## 📌 Project Status

🚧 **Actively in development.** This project is being built incrementally, one feature at a time, with progress tracked through commits and the roadmap above.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🙋 Author

**Megha Singh** — [@meghaasinghh](https://github.com/meghaasinghh)