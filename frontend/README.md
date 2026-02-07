# Todo Frontend Application

A Next.js 14 frontend application for task management with authentication and API integration.

## Features

- User authentication with Better Auth
- JWT-based API authentication
- Task management (Create, Read, Update, Delete)
- Responsive design for desktop and mobile
- Real-time task updates
- Error handling and loading states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **HTTP Client**: Axios
- **State Management**: React Context API

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (FastAPI server)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:
   ```bash
   cp .env .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   ```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Authentication pages
│   │   └── dashboard/       # Protected task management pages
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── tasks/           # Task management components
│   │   └── ui/              # Base UI components
│   ├── services/            # API clients and utilities
│   │   └── api.js           # Centralized API client with JWT handling
│   ├── context/             # React context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   └── styles/              # Global styles
│       └── globals.css      # Tailwind CSS imports
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Features

### Authentication

- Sign in/Sign up functionality
- JWT token management
- Automatic token refresh
- Protected routes
- Automatic logout on token expiration

### Task Management

- View all tasks
- Create new tasks with title and description
- Toggle task completion status
- Delete tasks
- Real-time UI updates

### Responsive Design

- Mobile-first approach
- Responsive navigation
- Touch-optimized buttons
- Adaptive layouts for all screen sizes

## API Integration

The frontend communicates with the FastAPI backend through the centralized API client (`src/services/api.js`). All requests automatically include:

- JWT token in Authorization header
- Proper error handling
- 401 response handling (automatic logout)

### API Endpoints Used

- `GET /users/{user_id}/tasks` - Fetch all tasks
- `POST /users/{user_id}/tasks` - Create a new task
- `PUT /users/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /users/{user_id}/tasks/{task_id}` - Delete a task

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth server URL | `http://localhost:8000` |

## Troubleshooting

### API Connection Issues

- Verify the backend server is running
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure CORS is properly configured on the backend

### Authentication Issues

- Clear browser localStorage and cookies
- Verify `NEXT_PUBLIC_BETTER_AUTH_URL` is correct
- Check that Better Auth is properly configured on the backend

### Build Errors

- Delete `node_modules` and `.next` directories
- Run `npm install` again
- Ensure all dependencies are compatible

## Contributing

This project follows the Agentic Dev Stack workflow:
1. Specification → Plan → Tasks → Implementation
2. All code changes via Claude Code
3. No manual coding permitted

## License

This project is part of the Todo Full-Stack Web Application hackathon submission.
