# 🎬 Cine-Stream

A movie discovery single-page application built with React, powered by the TMDB API. Users can browse popular movies, search in real time, save favorites, and get AI-powered movie suggestions based on their mood.

**Live Demo:** [add your deployed link here]
**GitHub Repo:** [add your repo link here]

---

## ✨ Features

### Core
- **Popular Movies Grid** — Browse trending and popular movies fetched live from TMDB.
- **Debounced Search** — Search movies by title with a 500ms debounce to avoid excessive API calls.
- **Infinite Scroll** — Automatically loads more movies as you scroll, using the Intersection Observer API.
- **Favorites** — Save movies to a personal favorites list, persisted in `localStorage` so it survives page reloads.
- **Responsive Design** — Fully responsive layout across mobile, tablet, and desktop screens.
- **Dark / Light Mode** — Toggle between dark and light themes with a single click.

### Extra
- **🎭 Mood Matcher (AI-powered)** — Describe how you're feeling, and Google's Gemini API suggests a real movie that matches your mood, which is then looked up on TMDB and displayed as a card.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **APIs:** TMDB API for movie data, Google Gemini API for mood-based suggestions
- **Persistence:** Browser `localStorage` for favorites

---

## 📂 Project Structure

cine-stream/
├── src/
│ ├── api/
│ │ ├── tmdb.js # TMDB API calls (popular movies, search)
│ │ └── gemini.js # Gemini API call for mood-based suggestions
│ ├── components/
│ │ ├── Navbar.jsx # Sticky navbar with search + theme toggle
│ │ ├── SearchBar.jsx # Debounced search input
│ │ ├── MovieCard.jsx # Individual movie card
│ │ ├── MovieGrid.jsx # Grid layout for movie cards
│ │ └── MoodMatcher.jsx # AI mood-based movie suggestion widget
│ |
│ │ 
│ ├── App.jsx
│ └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── README.md


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A TMDB API key
- A Google Gemini API key

### Installation

1. Clone the repository
```bash
   git clone <your-repo-url>
   cd cine-stream
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root directory

VITE_TMDB_API_KEY=tmdb_api_key_here
VITE_GEMINI_API_KEY=gemini_api_key_here


4. Run the development server
```bash
   npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎯 How It Works

- **Search:** Typing in the search bar triggers a debounced API call to TMDB after 500ms of inactivity, replacing the popular-movies grid with search results.

- **Infinite Scroll:** An `IntersectionObserver` watches the last movie card in the grid; when it comes into view, the next page of results is fetched and appended.

- **Favorites:** Clicking the heart icon on any card toggles it in and out of a favorites array, which is synced to `localStorage` on every change.

- **Mood Matcher:** User input is sent to the Gemini API with a prompt asking for one real movie title matching the described mood. That title is then searched on TMDB, and the first matching result is displayed.
