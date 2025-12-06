# Detailed Setup Guide - PostgreSQL & Environment Configuration

## Step 2: Set up PostgreSQL Database and Configure .env Files

> **Quick Start:** If you already have PostgreSQL installed and know your password, you can skip to [Part C: Configure Backend .env File](#part-c-configure-backend-env-file)

### Quick Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `angie_todo` created
- [ ] Backend `.env` file configured
- [ ] Mobile `.env` file configured (optional)
- [ ] Connection tested successfully

### Prerequisites Check

Before starting, ensure you have:
- PostgreSQL installed (version 12 or higher)
- Node.js and npm installed
- Basic command line knowledge

---

## Part A: PostgreSQL Installation & Setup

### Windows

#### Option 1: Install PostgreSQL (if not installed)

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the Windows installer (e.g., PostgreSQL 15.x)
   - Run the installer

2. **Installation Steps:**
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\15`)
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set data directory (default: `C:\Program Files\PostgreSQL\15\data`)
   - **Important:** Set a password for the `postgres` superuser (remember this!)
   - Set port (default: 5432)
   - Choose locale (default: [Default locale])

3. **Verify Installation:**
   ```powershell
   # Open PowerShell and check if PostgreSQL is installed
   psql --version
   ```

#### Option 2: Use Existing PostgreSQL

If PostgreSQL is already installed, skip to the database creation step.

### macOS

#### Install via Homebrew:
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Or download from:
https://www.postgresql.org/download/macosx/

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Part B: Create the Database

### Windows (PowerShell or Command Prompt)

1. **Open Command Prompt or PowerShell**

2. **Connect to PostgreSQL:**
   ```powershell
   # Default connection (will prompt for password)
   psql -U postgres
   
   # Or specify host and port explicitly
   psql -U postgres -h localhost -p 5432
   ```

3. **Create the database:**
   ```sql
   CREATE DATABASE angie_todo;
   ```

4. **Verify database creation:**
   ```sql
   \l
   ```
   You should see `angie_todo` in the list.

5. **Exit PostgreSQL:**
   ```sql
   \q
   ```

### Alternative: Using pgAdmin (GUI)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to your PostgreSQL server (use the password you set during installation)
3. Right-click on **Databases** → **Create** → **Database**
4. Name: `angie_todo`
5. Click **Save**

### macOS/Linux

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE angie_todo;

# Exit
\q
```

---

## Part C: Configure Backend .env File

### Step 1: Create .env file in backend directory

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create `.env` file:
   ```powershell
   # Windows PowerShell
   New-Item -Path .env -ItemType File
   
   # Or use your text editor to create the file
   ```

### Step 2: Configure database connection

Open `backend/.env` in a text editor and add the following:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password_here
DATABASE_NAME=angie_todo

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Replace `your_postgres_password_here` with the actual password you set for the `postgres` user during PostgreSQL installation.

### Step 3: Verify .env file location

Your file structure should look like:
```
backend/
├── .env              ← This file (DO NOT commit to git)
├── .env.example      ← Example file (safe to commit)
├── package.json
├── src/
└── ...
```

---

## Part D: Configure Mobile .env File (Optional)

### Step 1: Create .env file in mobile directory

1. Navigate to the mobile directory:
   ```powershell
   cd mobile
   ```

2. Create `.env` file:
   ```powershell
   # Windows PowerShell
   New-Item -Path .env -ItemType File
   ```

### Step 2: Configure API URL

Open `mobile/.env` in a text editor and add:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**For different environments:**

- **Local development (default):**
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:3000
  ```

- **If testing on physical device (replace with your computer's IP):**
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
  ```
  To find your IP address:
  - Windows: `ipconfig` (look for IPv4 Address)
  - macOS/Linux: `ifconfig` or `ip addr`

- **Production API:**
  ```env
  EXPO_PUBLIC_API_URL=https://api.yourdomain.com
  ```

---

## Part E: Test Database Connection

### Step 1: Install backend dependencies (if not done)

```powershell
cd backend
npm install
```

### Step 2: Test connection manually (optional)

A test script is already provided at `backend/test-connection.js`. 

**First, install dotenv (if not already installed):**
```powershell
cd backend
npm install dotenv --save-dev
```

**Then run the test:**
```powershell
node scripts/test-connection.js
```

**Expected output if successful:**
```
🔌 Attempting to connect to PostgreSQL...
   Host: localhost
   Port: 5432
   User: postgres
   Database: angie_todo

✅ Database connection successful!

📅 Current database time: 2024-12-06T10:00:00.000Z
📦 PostgreSQL version: PostgreSQL 15.x

✨ Connection test completed successfully!
```

**If you see errors, the script will provide troubleshooting tips.**

### Step 3: Initialize database schema

The backend will automatically create tables when you start it (TypeORM synchronize in development mode). However, you can also run the SQL schema manually:

1. **Using psql:**
   ```powershell
   psql -U postgres -d angie_todo -f src/database/schema.sql
   ```

2. **Or connect and run:**
   ```powershell
   psql -U postgres -d angie_todo
   ```
   Then copy and paste the contents of `backend/src/database/schema.sql`

---

## Part F: Verify Everything Works

### Step 1: Start the backend

```powershell
cd backend
npm run start:dev
```

**Expected output:**
```
[Nest] 12345  - 12/06/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/06/2024, 10:00:00 AM     LOG [InstanceLoader] DatabaseModule dependencies initialized
[Nest] 12345  - 12/06/2024, 10:00:00 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 12/06/2024, 10:00:00 AM     LOG [InstanceLoader] TasksModule dependencies initialized
...
Application is running on: http://localhost:3000
```

**If you see errors:**
- ❌ "Connection refused" → PostgreSQL is not running
- ❌ "password authentication failed" → Wrong password in .env
- ❌ "database does not exist" → Database not created

### Step 2: Test API endpoints

Open a browser or use curl:

```powershell
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/
```

Expected response:
```json
{"status":"ok","timestamp":"2024-12-06T10:00:00.000Z"}
```

### Step 3: Verify tables were created

Connect to PostgreSQL:
```powershell
psql -U postgres -d angie_todo
```

List tables:
```sql
\dt
```

You should see:
- tasks
- completions
- task_notes
- user_patterns

---

## Troubleshooting

### Problem: "psql: command not found"

**Solution:**
- Add PostgreSQL bin directory to PATH
- Windows: `C:\Program Files\PostgreSQL\15\bin`
- Or use full path: `"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres`

### Problem: "Connection refused" or "Cannot connect"

**Solutions:**
1. Check if PostgreSQL service is running:
   ```powershell
   # Windows
   Get-Service postgresql*
   
   # Start if stopped
   Start-Service postgresql-x64-15
   ```

2. Verify port 5432 is not blocked by firewall

3. Check PostgreSQL is listening:
   ```powershell
   netstat -an | findstr 5432
   ```

### Problem: "password authentication failed"

**Solutions:**
1. Verify password in `.env` matches PostgreSQL password
2. Check `pg_hba.conf` file (usually in PostgreSQL data directory)
3. Try resetting PostgreSQL password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

### Problem: "database does not exist"

**Solution:**
```sql
CREATE DATABASE angie_todo;
```

### Problem: Mobile app can't connect to API

**Solutions:**
1. For physical device: Use your computer's IP address instead of `localhost`
2. Ensure backend is running
3. Check firewall allows port 3000
4. Verify `EXPO_PUBLIC_API_URL` in mobile `.env`

---

## Quick Reference

### Common PostgreSQL Commands

```sql
-- Connect to database
\c angie_todo

-- List all databases
\l

-- List all tables
\dt

-- Describe table structure
\d tasks

-- Exit
\q
```

### Environment Variables Summary

**Backend (.env):**
- `DATABASE_HOST` - PostgreSQL host (usually `localhost`)
- `DATABASE_PORT` - PostgreSQL port (usually `5432`)
- `DATABASE_USER` - Database user (usually `postgres`)
- `DATABASE_PASSWORD` - Your PostgreSQL password
- `DATABASE_NAME` - Database name (`angie_todo`)
- `PORT` - Backend API port (usually `3000`)

**Mobile (.env):**
- `EXPO_PUBLIC_API_URL` - Backend API URL

---

## Next Steps

Once database and .env files are configured:

1. ✅ Database created
2. ✅ Backend .env configured
3. ✅ Mobile .env configured (optional)
4. ✅ Backend starts without errors
5. ✅ API responds to health check

**Proceed to Step 3:** Start the backend and mobile app!

