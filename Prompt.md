# Prompts.md — AI-Assisted Debugging Log

This document records key moments where I used an AI assistant (Claude) to debug issues, understand errors, and improve the Cine-Stream codebase during development.

---

## 1. Infinite Scroll — Component Called as a Function

**Issue:** After implementing infinite scroll with `IntersectionObserver`, the app threw cascading "Hooks called conditionally" errors on scroll.

**Root cause:** Inside the movies-fetch logic, `App(data.results || [])` was accidentally called — invoking the `App` component itself as a plain function instead of spreading the array into state.

**Fix:** Corrected `setMovies(prev => [...prev, ...(data.results || [])])`.

**Takeaway:** A stray typo (missing spread operator, matching component name) can produce error messages that look far scarier than the actual bug.

---

## 2. Favorites Resetting on Refresh

**Issue:** Favorites saved to `localStorage` were being wiped out on page reload.

**Root cause:** A separate `useEffect` was reading from `localStorage` after the initial render, racing against the write effect and overwriting saved data with an empty array.

**Fix:** Switched to a lazy `useState` initializer that reads `localStorage` once on mount, combined with a single `useEffect` that writes on every `favorites` change.

---

## 3. Dark/Light Mode Toggle Not Working

**Issue:** The theme toggle button changed its emoji (☀️/🌙) but the page colors never actually switched.

**Root cause:** The project uses Tailwind CSS v4, which is CSS-first — the `darkMode: "class"` option in `tailwind.config.js` is ignored unless explicitly wired up. By default, `dark:` classes were following the OS-level color scheme instead of the toggle.

**Fix:** Added `@custom-variant dark (&:where(.dark, .dark *));` to `index.css`, right after the Tailwind import, so `dark:` classes respond to the `.dark` class on `<html>` (which the toggle button controls).

---

## 4. Gemini API — Model & Auth Iteration

**Issue:** Multiple rounds of 404 and 401 errors when calling the Gemini API.

**Root cause:** Google's Gemini API had recently shifted to a new API key format (`AQ.` prefix instead of `AIzaSy...`), which requires authentication via the `x-goog-api-key` header instead of a `?key=` query parameter. Model names also changed (`gemini-2.0-flash` → `gemini-flash-latest`).

**Fix:** Updated the fetch call's headers and used the current model alias. Occasional `503` responses were identified as temporary server-side overload on Google's end, resolved by retrying.

---

## 5. Variable Naming Mismatch (`text` vs `title`)

**Issue:** `ReferenceError: text is not defined` when parsing the Gemini API response.

**Root cause:** During a refactor, the extracted response value was stored in a variable named `title`, but a later line still referenced the old name `text`.

**Fix:** Renamed the reference to match the actual declared variable.

**Takeaway:** Careful about variable names staying consistent across a function, especially after edits.

---

## 6. Duplicate React Keys on Infinite Scroll

**Issue:** Console warning — `Encountered two children with the same key`.

**Root cause:** TMDB occasionally returns overlapping movies across paginated requests, so appending new results directly to the existing list introduced duplicate `movie.id` values.

**Fix:** Filtered out any incoming movie whose `id` already existed in the current list before appending, using a `Set` for quick lookups.

---

## 7. Responsive Navbar Layout

**Issue:** On small mobile screens, the "Cine-Stream" title was getting squeezed and cut off next to the search bar and theme toggle.

**Fix:** Restructured the navbar to stack vertically (`flex-col`) on small screens and switch to a horizontal row (`sm:flex-row`) from the `sm` breakpoint upward, so the title always has room to render fully.

---

## 8. API Key Security

**Issue:** API keys were initially hardcoded directly in `tmdb.js` and `gemini.js`.

**Fix:** Moved both keys into a `.env` file using Vite's `VITE_` prefix convention, accessed via `import.meta.env.VITE_*`, and added `.env` to `.gitignore` to prevent committing secrets to version control.

---

## Reflections

Working through these issues helped me understand React's rendering cycle more deeply (especially around `useEffect` timing and state updates), how Tailwind's dark-mode strategy actually works under the hood, and the importance of keeping environment secrets out of source code. AI assistance was most useful for quickly narrowing down *where* a bug lived from a stack trace, while the actual reasoning about *why* it happened and verifying the fix was done by testing in the browser each time.
