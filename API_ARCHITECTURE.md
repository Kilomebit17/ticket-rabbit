# API Architecture Documentation

## Overview

This document describes the API architecture for the Telegram Mini App, including authentication flow, HTTP client setup, and state management.

## Architecture Components

### 1. HTTP Client (`src/utils/http.ts`)

Centralized Axios instance configured for API requests:

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:3000/api`)
- **Timeout**: 10 seconds
- **Request Interceptor**: Automatically adds Telegram init data from `window.Telegram.WebApp.initData` to request headers as `X-Telegram-Init-Data`
- **Response Interceptor**: Handles errors and logs them with context

### 2. Auth Provider (`src/providers/auth/`)

Complete authentication system using React Context API and useReducer:

#### Structure

```
providers/auth/
├── index.tsx      # AuthContext and AuthProvider component
├── reducer.ts    # Auth state reducer
├── service.ts    # API service methods
└── types.ts      # TypeScript types and interfaces
```

#### Components

**types.ts**
- `IAuthState`: Auth state interface (user, isLoading, error)
- `EAuthActionType`: Action type enum
- `IAuthAction`: Union type for all auth actions
- `ICreateUserRequest`: User creation payload
- `ICreateUserResponse` / `IGetUserResponse`: API response types

**reducer.ts**
- `initialState`: Initial auth state
- `authReducer`: Reducer function handling all auth actions

**service.ts**
- `AuthService` class with methods:
  - `checkUser()`: Check if user exists (returns User | null)
  - `createUser(data)`: Create new user
  - `getCurrentUser()`: Get current authenticated user

**index.tsx**
- `AuthProvider`: Context provider component
- `useAuth()`: Hook to access auth context
- Automatically checks user on mount
- Provides: `state`, `checkUser`, `createUser`, `logout`, `clearError`

## API Endpoints

### Authentication Endpoints

#### GET `/auth/me`
Check if current user exists.

**Headers:**
- `X-Telegram-Init-Data`: Telegram WebApp init data

**Response:**
- `200 OK`: User exists
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "sex": "man" | "woman",
      "balance": number
    }
  }
  ```
- `404 Not Found`: User doesn't exist

#### POST `/auth/register`
Create a new user.

**Headers:**
- `X-Telegram-Init-Data`: Telegram WebApp init data
- `Content-Type`: application/json

**Request Body:**
```json
{
  "name": "string",
  "sex": "man" | "woman"
}
```

**Response:**
- `201 Created`:
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "sex": "man" | "woman",
      "balance": 0
    }
  }
  ```

## Authentication Flow

1. **App Initialization**
   - `AuthProvider` mounts and automatically calls `checkUser()`
   - If user exists → User is set in state, app shows main content
   - If user doesn't exist (404) → User is set to `null`, app shows `SexSelection` screen

2. **User Registration**
   - User enters name and selects sex on `SexSelection` screen
   - `createUser()` is called with user data
   - On success → User is set in state, app navigates to main content
   - On error → Error is set in state and displayed to user

3. **State Management**
   - All auth state is managed via `useReducer`
   - Actions dispatched: `SET_LOADING`, `SET_USER`, `SET_ERROR`, `CLEAR_ERROR`, `LOGOUT`
   - State is accessible throughout app via `useAuth()` hook

## Telegram Mini App Integration

The HTTP client automatically extracts Telegram init data from:
```typescript
window.Telegram.WebApp.initData
```

This data is sent with every API request in the `X-Telegram-Init-Data` header, allowing the backend to:
- Verify the request is from Telegram
- Extract user information from Telegram
- Authenticate the user

## Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, set this to your backend API URL.

## Usage Examples

### Using Auth Context

```typescript
import { useAuth } from '@/providers/auth';

function MyComponent() {
  const { state, createUser, logout } = useAuth();
  
  // Access user
  const user = state.user;
  
  // Check loading state
  if (state.isLoading) {
    return <Loading />;
  }
  
  // Check for errors
  if (state.error) {
    return <Error message={state.error} />;
  }
  
  // Create user
  const handleCreate = async () => {
    try {
      await createUser({ name: 'John', sex: 'man' });
    } catch (error) {
      // Error handled by context
    }
  };
}
```

### Making API Calls

```typescript
import { httpClient } from '@/utils/http';

// GET request
const response = await httpClient.get('/some-endpoint');

// POST request
const response = await httpClient.post('/some-endpoint', { data });
```

## Error Handling

- Network errors are caught and logged
- API errors (4xx, 5xx) are caught and error messages are set in auth state
- 404 errors from `checkUser()` are treated as "user doesn't exist" (not an error)
- All errors are accessible via `state.error` in components

## Type Safety

All API requests and responses are fully typed:
- Request payloads use TypeScript interfaces
- Response types are defined in `types.ts`
- Axios responses are typed with generic parameters
- No `any` types used

