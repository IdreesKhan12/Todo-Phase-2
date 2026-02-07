# Quickstart Guide: Frontend Application & Integration

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to backend API (FastAPI server running)
- Better Auth secret configured in environment

## Environment Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1  # Backend API URL
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000     # Better Auth URL
   ```

## Development Server

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Access the application:**
   - Open http://localhost:3000 in your browser
   - The app will automatically reload when files change

## Project Structure Overview

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Authentication pages
│   │   └── dashboard/       # Protected task management pages
│   ├── components/          # Reusable UI components
│   ├── services/            # API clients and auth utilities
│   ├── context/             # React context providers
│   └── lib/                 # Utility functions
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## Key Configuration Files

- `next.config.js` - Next.js configuration
- `package.json` - Scripts and dependencies
- `tsconfig.json` - TypeScript settings (if using TypeScript)

## Running Tests

```bash
npm test
# or to watch for changes
npm run test:watch
```

## API Integration

The frontend connects to the backend via the API client located at `src/services/api.js`:

```javascript
// All API requests automatically include the JWT token
import { apiClient } from '@/services/api';

// Example API call
const tasks = await apiClient.get('/users/{user_id}/tasks');
```

## Authentication Flow

1. User accesses any route other than home or login
2. Authentication check occurs in root layout
3. If not authenticated, user redirected to login
4. After successful login, user redirected to dashboard
5. JWT token stored securely and attached to all API requests

## Building for Production

```bash
npm run build
npm start  # Starts production server
```

## Troubleshooting

- **API requests failing**: Verify backend server is running and `NEXT_PUBLIC_API_BASE_URL` is correct
- **Auth not working**: Check `NEXT_PUBLIC_BETTER_AUTH_URL` configuration
- **Page refresh issues**: Ensure authentication state is properly handled across page navigations