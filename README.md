# Angie To-Do - Flexible Task/Habit Tracker

A cross-platform task and habit tracker designed for users with executive dysfunction, prioritizing "flow" over strict schedules. Built with React Native/Expo and NestJS.

## Features

- **Smart Suggestions**: AI-powered task recommendations based on 90-day rolling completion patterns
- **Daily Checklist**: Quick-complete tasks with timestamp logging
- **Weekly Backlog**: Optional tasks available to add to today
- **Journal**: Timeline view of completions with optional notes
- **Analytics**: Comprehensive insights including daily/weekly graphs, time-of-day heatmaps, streak tracking, and category breakdowns

## Tech Stack

### Frontend (Mobile)
- React Native with Expo (Managed Workflow)
- TypeScript (Strict mode)
- Expo Router (file-based routing)
- Zustand (state management)
- NativeWind (Tailwind CSS for React Native)
- Victory Native (charts)

### Backend
- NestJS
- TypeORM
- PostgreSQL
- TypeScript (Strict mode)

## Project Structure

```
angie-to-do/
├── mobile/                    # Expo React Native app
│   ├── app/                   # Expo Router file-based routing
│   ├── components/            # Atomic design components
│   ├── stores/                # Zustand state management
│   ├── types/                 # TypeScript interfaces
│   └── services/              # API client
├── backend/                   # NestJS backend
│   └── src/
│       ├── tasks/             # Tasks module
│       ├── completions/       # Completions module
│       ├── suggestions/       # Smart suggestion engine
│       ├── analytics/         # Analytics calculations
│       └── database/          # Database schema & migrations
└── shared/                    # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Expo CLI (`npm install -g expo-cli`)
- NestJS CLI (`npm install -g @nestjs/cli`)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=angie_todo
PORT=3000
```

4. Create the database:
```bash
createdb angie_todo
```

5. Run database migrations (schema will auto-sync in development):
```bash
# The schema.sql file contains the SQL to create tables
# TypeORM will auto-sync in development mode
```

**📖 For detailed PostgreSQL setup instructions, see [SETUP.md](SETUP.md) - Step 2**

6. Start the backend:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your device

## API Endpoints

### Tasks
- `GET /tasks` - List all tasks
- `GET /tasks/backlog` - Get weekly backlog tasks
- `GET /tasks/suggested` - Get suggested tasks (smart recommendations)
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Completions
- `GET /completions` - Get completion history (optional query params: startDate, endDate)
- `POST /completions` - Log a task completion
- `DELETE /completions/:id` - Delete a completion
- `POST /completions/notes` - Add a note to a completion

### Analytics
- `GET /analytics` - Get all analytics data
- `GET /analytics/daily?days=30` - Daily completion stats
- `GET /analytics/weekly?weeks=12` - Weekly completion stats
- `GET /analytics/heatmap` - Time-of-day heatmap data
- `GET /analytics/streaks` - Streak calculations
- `GET /analytics/categories` - Category breakdown

## Smart Suggestion Algorithm

The recommendation engine uses a 90-day rolling window to calculate the mean interval between task completions. A task is suggested when:

- The time elapsed since the last completion is > 80% of the mean interval
- OR the task has no completions in the last 90 days
- OR no pattern is established but it's been more than 7 days

Tasks are prioritized by the ratio of days since last completion to mean interval.

## Development

### TypeScript
Both projects use strict TypeScript mode. All data models are fully typed with no `any` types.

### Code Style
- Atomic Design pattern for components
- Single responsibility principle
- Performance optimizations with `useMemo` and `useCallback`
- Cross-platform compatibility (mobile + web)

## License

MIT
