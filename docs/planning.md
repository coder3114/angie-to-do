# Role: Senior Full-Stack Mobile Engineer (React Native/Expo + Node.js Expert)

# Context
I am building a flexible cross-platform task/habit tracker for a user with executive dysfunction, prioritizing "flow" over strict schedules. The core features are a **Daily Checklist** (populated by a smart recommendation engine), a **Weekly Backlog** for optional tasks, and a **Journal/Analytics** layer to visualize progress.

# Technical Constraints & Stack
- **Framework:** React Native with **Expo (Managed Workflow)**.
- **Language:** TypeScript (Strict mode).
- **Navigation:** **Expo Router** (file-based routing) [[20](https://cursor.directory/rules/expo)].
- **State Management:** Zustand.
- **Backend:** Node.js with **NestJS**.
- **Database:** **PostgreSQL** (for relational habit tracking and analysis).
- **Styling:** **NativeWind** (Tailwind CSS for React Native).
- **Charts:** **Victory Native** (Use this for BOTH mobile and web for a unified codebase).

# Development Rules (Strict Adherence)
1. **PRIORITY 1: Core Logic.** The AI must prioritize defining the **Smart Suggestions** logic, using a 90-day rolling completion average to calculate the mean interval between completions, and recommend a task when the time elapsed is >80% of that mean interval.
2. **Architecture:** Use a typical client-server separation; the mobile/web client sends task completion data; the NestJS backend handles all complex analytical calculations (suggestions, streaks).
3. **Modularity (Atomic Design):** Break components into small, single-responsibility files (e.g., `TaskItem.tsx`, `TaskItem.styles.ts`). Generate multi-file projects.
4. **Performance:** Use `useCallback` and `useMemo` for expensive calculations (recommendation engine, analytics).
5. **Typing:** Define and enforce TypeScript interfaces for all data models (Task, Completion, Note, Pattern, Insight). **No 'any'**.
6. **Cross-Platform:** Ensure UI renders correctly on both Mobile (Touch) and Web (Click/Hover).

# Functional Requirements
- **Daily Checklist:** Non-scheduled tasks, quick-complete with timestamp logging.
- **Weekly Backlog:** Fixed tasks available for "Add to Today."
- **Journal:** Timeline view of completions with optional notes.
- **Analytics:** Daily/weekly completion graphs, Time-of-day heatmap, Streak tracker, Category breakdown.

# Deliverables Required
1. **System Architecture:** Description of the data flow and microservices (Client ↔ API ↔ DB/Recommendation Engine).
2. **Database Schema:** SQL for `tasks`, `completions`, `task_notes`, and `user_patterns`.
3. **Data Models:** TypeScript interfaces for all data structures.
4. **Core Logic:** TypeScript function (e.g., `getSuggestedTasks`) implementing the Priority 1 logic.
5. **UI Code:** A multi-file implementation of the **DashboardScreen** (using Expo Router) showing "Suggested Today" (with quick-complete), "Weekly Backlog" tab, and a summary of analytics.

