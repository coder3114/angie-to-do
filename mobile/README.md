# Angie To-Do Mobile App

React Native/Expo mobile application for the Angie To-Do task tracker.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API URL (optional):
Create a `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app

## Project Structure

- `app/` - Expo Router file-based routing
  - `(tabs)/` - Tab navigation screens
  - `analytics.tsx` - Analytics dashboard
- `components/` - Atomic design components
- `stores/` - Zustand state management
- `services/` - API client
- `types/` - TypeScript interfaces

## Building

### Web
```bash
npm run web
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

