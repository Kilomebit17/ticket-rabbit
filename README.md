# Intimulator

A mobile application for managing tasks and family relationships with a ticket-based reward system.

## Features

- **User Management**: Create profile with name and sex selection
- **Family Creation**: Create families with partners and manage family relationships
- **Task Management**: Create tasks with ticket prices, solve tasks, and approve completed tasks
- **Ticket System**: Earn tickets by completing approved tasks
- **User Board**: Browse and view other users' profiles
- **Profile Management**: View personal information and family details

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- SCSS Modules for styling
- Local Storage for data persistence
- Vite for build tooling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Application Flow

1. **Initial Setup**: User selects their sex and enters their name
2. **Dashboard**: 
   - Create a family if none exists
   - View and manage tasks
   - Create new tasks with ticket prices
3. **Task Workflow**:
   - Created: Task is created by one family member
   - Pending: Task is solved by another family member, waiting for approval
   - Approved: Task is approved by creator, solver receives tickets
4. **Userboard**: Browse other users and view their profiles
5. **Profile**: View personal information and family details

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout/       # Header, NavBar, Layout
│   ├── CreateFamilyModal/
│   ├── CreateTaskModal/
│   └── TaskCard/
├── screens/          # Main application screens
│   ├── SexSelection/
│   ├── Dashboard/
│   ├── Userboard/
│   ├── Profile/
│   └── FriendDetail/
├── styles/           # Global styles and variables
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (storage, helpers)
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

## Data Models

- **User**: id, name, sex, balance
- **Family**: id, members (user IDs), createdAt
- **Task**: id, familyId, creatorId, solverId, name, price, status, timestamps
- **FamilyRequest**: id, fromUserId, toUserId, status, createdAt

## License

MIT

