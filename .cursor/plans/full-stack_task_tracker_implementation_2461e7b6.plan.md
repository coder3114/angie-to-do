---
name: Full-Stack Task Tracker Implementation
overview: Build a complete React Native/Expo + NestJS task/habit tracker with smart suggestions, daily checklist, weekly backlog, journal, and analytics features. Single-user app with PostgreSQL database.
todos:
  - id: setup-projects
    content: Initialize Expo and NestJS projects with TypeScript, configure NativeWind, set up PostgreSQL connection
    status: completed
  - id: database-schema
    content: Create PostgreSQL schema (tasks, completions, task_notes, user_patterns tables) and migrations
    status: completed
    dependencies:
      - setup-projects
  - id: data-models
    content: Define TypeScript interfaces for all data structures (Task, Completion, TaskNote, UserPattern, AnalyticsInsight)
    status: completed
    dependencies:
      - database-schema
  - id: suggestion-logic
    content: Implement getSuggestedTasks() with 90-day rolling average and 80% threshold logic
    status: completed
    dependencies:
      - data-models
  - id: backend-api
    content: Create NestJS REST API endpoints for tasks, completions, suggestions, and analytics
    status: completed
    dependencies:
      - suggestion-logic
  - id: frontend-stores
    content: Set up Zustand stores for tasks, completions, and analytics state management
    status: completed
    dependencies:
      - data-models
  - id: dashboard-ui
    content: Build DashboardScreen with Suggested Today section, Weekly Backlog tab, and analytics summary
    status: completed
    dependencies:
      - frontend-stores
      - backend-api
  - id: journal-screen
    content: Implement Journal timeline view with completion history and notes
    status: completed
    dependencies:
      - dashboard-ui
  - id: analytics-screen
    content: Create Analytics screen with Victory Native charts (daily/weekly graphs, heatmap, streaks, categories)
    status: completed
    dependencies:
      - journal-screen
  - id: atomic-components
    content: Build reusable atomic components (TaskItem, TaskList, AnalyticsCard, ChartContainer) with proper styling
    status: completed
    dependencies:
      - dashboard-ui
  - id: cross-platform
    content: Ensure all UI components work on both mobile (touch) and web (click/hover) with NativeWind
    status: completed
    dependencies:
      - atomic-components
---

# Full-Stack Task/Habit Tracker Implementation Plan

## Overview

Build a complete cross-platform task tracker with smart recommendation engine, daily checklist, weekly backlog, journal timeline, and analytics dashboard. Uses Expo (React Native) for frontend and NestJS for backend.

## Project Structure

```
angie-to-do/
├── mobile/                    # Expo React Native app
│   ├── app/                   # Expo Router file-based routing
│   │   ├── (tabs)/            # Tab navigation
│   │   │   ├── index.tsx      # DashboardScreen (main)
│   │   │   ├── backlog.tsx    # Weekly Backlog view
│   │   │   └── journal.tsx    # Journal timeline view
│   │   └── analytics.tsx      # Analytics dashboard
│   ├── components/            # Atomic design components
│   │   ├── TaskItem/
│   │   ├── TaskList/
│   │   ├── AnalyticsChart/
│   │   └── ...
│   ├── stores/                # Zustand state management
│   ├── types/                 # TypeScript interfaces
│   └── services/              # API client
├── backend/                   # NestJS backend
│   ├── src/
│   │   ├── tasks/             # Tasks module
│   │   ├── completions/       # Completions module
│   │   ├── suggestions/       # Smart suggestion engine
│   │   ├── analytics/         # Analytics calculations
│   │   └── database/          # Database schema & migrations
│   └── prisma/                # Prisma ORM (or TypeORM)
└── shared/                    # Shared TypeScript types
```

## Implementation Steps

### 1. Project Setup & Configuration

- Initialize Expo project with TypeScript and Expo Router
- Initialize NestJS project with TypeScript
- Configure NativeWind (Tailwind for React Native)
- Set up PostgreSQL connection
- Configure Prisma or TypeORM for database access
- Install dependencies: Zustand, Victory Native, Expo Router

### 2. Database Schema (`backend/src/database/schema.sql`)

Create PostgreSQL tables:

- `tasks`: id, title, category, is_weekly_backlog, created_at, updated_at
- `completions`: id, task_id, completed_at, time_of_day, notes
- `task_notes`: id, completion_id, content, created_at
- `user_patterns`: id, task_id, mean_interval_days, last_calculated_at, streak_count

### 3. TypeScript Data Models (`shared/types/` and `mobile/types/`)

Define strict interfaces:

- `Task`, `Completion`, `TaskNote`, `UserPattern`, `AnalyticsInsight`
- API request/response types
- Store state types for Zustand

### 4. Core Smart Suggestion Logic (`backend/src/suggestions/suggestion.service.ts`)

Implement `getSuggestedTasks()`:

- Calculate 90-day rolling average of completion intervals per task
- Recommend when time elapsed > 80% of mean interval
- Return prioritized list with suggestion reasons

### 5. NestJS Backend API

Create REST endpoints:

- `GET /tasks` - List all tasks
- `POST /tasks` - Create task
- `GET /tasks/suggested` - Get suggested tasks (uses suggestion engine)
- `POST /completions` - Log task completion
- `GET /completions` - Get completion history
- `GET /analytics/daily` - Daily completion stats
- `GET /analytics/weekly` - Weekly completion stats
- `GET /analytics/heatmap` - Time-of-day heatmap data
- `GET /analytics/streaks` - Streak calculations
- `GET /analytics/categories` - Category breakdown

### 6. Frontend State Management (`mobile/stores/`)

Zustand stores:

- `useTaskStore` - Task CRUD operations
- `useCompletionStore` - Completion logging
- `useAnalyticsStore` - Analytics data caching

### 7. DashboardScreen UI (`mobile/app/(tabs)/index.tsx`)

Main screen with:

- "Suggested Today" section with quick-complete checkboxes
- Tab navigation to Weekly Backlog
- Summary analytics cards (completion rate, active streaks)
- Performance optimizations with `useMemo`/`useCallback`

### 8. Weekly Backlog Screen (`mobile/app/(tabs)/backlog.tsx`)

- List of weekly backlog tasks
- "Add to Today" button for each task
- Drag-to-reorder support (optional)

### 9. Journal Screen (`mobile/app/(tabs)/journal.tsx`)

- Timeline view of all completions
- Filter by date range
- Add/view notes for completions
- Victory Native timeline visualization

### 10. Analytics Screen (`mobile/app/analytics.tsx`)

Victory Native charts:

- Daily completion line chart
- Weekly completion bar chart
- Time-of-day heatmap (custom component)
- Streak tracker display
- Category breakdown pie chart

### 11. Atomic Design Components

Create reusable components:

- `TaskItem.tsx` + `TaskItem.styles.ts` - Individual task card
- `TaskList.tsx` - List container with pull-to-refresh
- `CompletionButton.tsx` - Quick-complete button
- `AnalyticsCard.tsx` - Analytics summary card
- `ChartContainer.tsx` - Wrapper for Victory Native charts

### 12. Cross-Platform Styling

- NativeWind configuration for mobile
- Responsive breakpoints for web
- Touch/click event handling
- Hover states for web

## Key Files to Create

**Backend:**

- `backend/src/database/schema.sql` - Database schema
- `backend/src/suggestions/suggestion.service.ts` - Core recommendation logic
- `backend/src/tasks/tasks.controller.ts` - Task endpoints
- `backend/src/completions/completions.controller.ts` - Completion endpoints
- `backend/src/analytics/analytics.service.ts` - Analytics calculations

**Frontend:**

- `mobile/app/(tabs)/index.tsx` - DashboardScreen
- `mobile/stores/taskStore.ts` - Zustand task store
- `mobile/components/TaskItem/TaskItem.tsx` - Task component
- `mobile/services/api.ts` - API client with fetch/axios

**Shared:**

- `shared/types/index.ts` - All TypeScript interfaces

## Technical Considerations

- Use Prisma or TypeORM for type-safe database access
- Implement proper error handling and loading states
- Add optimistic UI updates for better UX
- Cache analytics data to reduce API calls
- Use React Query or SWR for data fetching (optional enhancement)
- Ensure all components are cross-platform tested (mobile + web)