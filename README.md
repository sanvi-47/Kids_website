# 🚀 SparkCode AI - Kids Ethical AI & Creative Coding Platform

An interactive, kid-friendly, Scratch-inspired visual programming and creative studio platform. Built for children aged 6–16 to create games, animate cartoons, author interactive branching stories, program visual logic blocks, and explore ethical AI with safe guidance.

---

## 🌟 Key Features

1. **🎮 Game Creation Studio**
   - Live 2D physics and collision engine.
   - Character hero selection (Rocket, Mouse, Car, Kangaroo, Cat, Dino, etc.).
   - Interactive arrow key / WASD / on-screen D-Pad controls.
   - Pre-loaded templates: *Star Catcher*, *Labyrinth Maze*, *Turbo Racer*, and *Lunar Jumper*.
   - Scoring system, high scores, speed multipliers, and canvas confetti celebrations!
   - Save games to user profile.

2. **🎬 Cartoon Animation Studio**
   - Multi-sprite choreography (wiggle dance, super hop, magic float, turbo spin).
   - Real-time speech bubbles and dialogue creation.
   - Sound effects and background scenery switcher.
   - Keyframe loop controls (Play, Pause, Reset).

3. **📖 Interactive Storytelling Studio**
   - Multi-scene storyboard authoring (Chapter 1, 2, 3...).
   - Branching "Choose Your Own Path" decisions (Choice A vs Choice B).
   - **Sparky Story Spark AI button**: AI-assisted scene and quest generation.
   - Character actors, sound effects, and persistent chapter saving.

4. **🧱 Scratch-Inspired Visual Coding Editor**
   - Drag-and-drop / click-to-attach block categories: **Motion, Looks, Sound, Events, Control, Sensing, Operators, Variables**.
   - Real executing visual block runtime (Moving sprites, turning angles, saying hello, playing notes, changing score variables).
   - Live Scratch VM Console Output terminal showing step-by-step executions and coordinates.

5. **🤖 Sparky AI Learning Assistant**
   - Child-friendly conversational coding buddy.
   - Explains loops, variables, bugs, and ethical AI in simple metaphors (LEGO bricks, recipes, magic boxes).
   - Pre-prompt safety filters blocking toxic, inappropriate, or scary queries.
   - Real-time Gemini 1.5 Flash integration when `GEMINI_API_KEY` is present; intelligent simulated safe demo mode when offline.

6. **🎓 Coding Quests & Academy**
   - Step-by-step missions covering Sequencing, Loops, Variables, and Ethical AI principles.
   - Claim XP rewards, badges, and level-ups.

7. **🛡️ Parent & Guardian Safety Center**
   - Screen time limit slider (20 min to 180 min).
   - AI Moderation strictness toggle.
   - COPPA-compliant ad-free privacy architecture.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, React Router v6, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js, CORS, JSON Web Token (JWT), BCrypt.js.
- **Database**: Automated resilient JSON store with sample templates (MongoDB compatible architecture).
- **AI Integration**: Google Gemini 1.5 Flash API with kid-safe moderation wrapper and graceful fallback demo engine.

---

## 🚀 How to Run the Website Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Start the Backend API Server
Open a terminal in VS Code:
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Start the Frontend Web App
Open a second terminal in VS Code:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### 3. Open in Your Browser
Navigate to **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Accounts (Ready to Test)

| Account Type | Email | Password |
|---|---|---|
| **Kid Coder** | `kid@sparkcode.ai` | `password123` |
| **Parent / Guardian** | `parent@sparkcode.ai` | `password123` |

*(You can also click the quick demo buttons on the `/login` page or register any new account!)*

---

## ⚙️ Environment Variables (Optional)

In `backend/.env`:
```env
PORT=5000
JWT_SECRET=super_safe_kids_sparkcode_secret_key_2026
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
*Note: If `GEMINI_API_KEY` is left blank, the platform automatically runs in safe simulated AI demo mode.*

