# JLabs Exam - Frontend

React application for IP geolocation tracking with user authentication.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173` (Vite default port)


## Features Implemented

### Core Requirements ✅
- ✅ Login page with email/password validation
- ✅ Authentication with JWT tokens
- ✅ Automatic redirect based on login state
- ✅ Display user's IP and geolocation on home screen
- ✅ Search functionality for any IP address
- ✅ IP address validation
- ✅ Clear search to revert to user's IP
- ✅ Display search history list


## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx        # Login page component
│   │   ├── Login.css        # Login page styles
│   │   ├── Home.jsx         # Home page component
│   │   └── Home.css         # Home page styles
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context (global state)
│   ├── utils/
│   │   └── api.js           # API functions and axios config
│   ├── App.jsx              # Main app with routing
│   ├── App.css              # Global app styles
│   ├── main.jsx             # App entry point
│   └── index.css            # Base CSS
├── package.json
└── vite.config.js
```

## How It Works

### Authentication Flow

1. User opens app → checks localStorage for token
2. If token exists → redirect to Home
3. If no token → show Login page
4. Login successful → save token & user to localStorage
5. All API requests include token in Authorization header

### API Integration

All API calls go through `src/utils/api.js`:
- **axios interceptor** automatically adds JWT token to requests
- **authAPI.login()** - authenticates user
- **historyAPI.getHistory()** - fetches search history
- **historyAPI.saveHistory()** - saves new search
- **historyAPI.deleteHistory()** - deletes multiple items
- **getGeoData()** - fetches geolocation from ipinfo.io

### Context API

`AuthContext.jsx` provides global authentication state:
- Stores user and token
- Provides login/logout functions
- Persists auth state to localStorage
- Used by all components via `useAuth()` hook

### Protected Routes

- **PublicRoute**: Redirects authenticated users to Home
- **ProtectedRoute**: Redirects unauthenticated users to Login

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool (faster than create-react-app)
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Context API** - Global state management
- **Plain CSS** - Custom styling

## Test Credentials

- **Email**: test@jlabs.com
- **Password**: password123

## API Endpoints Used

- `POST /api/login` - User authentication
- `GET /api/history` - Get search history
- `POST /api/history` - Save search
- `DELETE /api/history` - Delete history items
- `GET https://ipinfo.io/geo` - Get user's IP/location
- `GET https://ipinfo.io/{ip}/geo` - Get specific IP location