# Angie To-Do Backend

NestJS backend API for the Angie To-Do task tracker.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials.

4. Start PostgreSQL and create the database:
```bash
createdb angie_todo
```

5. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Database

The database schema is defined in `src/database/schema.sql`. TypeORM will automatically sync the schema in development mode.

## API Documentation

The API runs on `http://localhost:3000` by default.

### Health Check
- `GET /` - API info
- `GET /health` - Health status

See main README.md for full API endpoint documentation.

