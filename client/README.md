# PawMatch Web Client

React frontend for the PawMatch pet adoption management application, built for IFN666 Assessment 2.

## Setup

### Prerequisites
- Node.js

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the client root:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

For production, update to your deployed API URL before building.

### Run (Development)

```bash
npm run dev
```

The app runs at `http://localhost:5173/assignment2/`.

### Build (Production)

```bash
npm run build
```

Output goes to `dist/`. Deploy these static files to your web server.

## Features

- Browse shelters and available pets (public)
- User registration and login with JWT authentication
- Submit and manage adoption applications (authenticated users)
- Admin panel for managing shelters, pets, and reviewing applications
- Search and sort on all list views
- Pagination with server-side support
- Responsive design with mobile burger menu
- Form validation with clear error messages

## Tech Stack

- React 19 + Vite
- Mantine UI (core, form, hooks, notifications)
- React Router DOM (BrowserRouter)

## User Roles

- **Admin**: Create, edit, and delete shelters and pets. View all applications per pet.
- **User**: Browse shelters and pets. Submit and manage own adoption applications.
- **Guest**: Browse shelters and pets only.
