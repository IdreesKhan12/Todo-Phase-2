# 📝 Full-Stack Task Management Application

A modern, full-stack task management web application built with Next.js, FastAPI, and Neon PostgreSQL. Features a beautiful UI with dark mode support, user authentication, and real-time task management capabilities.

## ✨ Features

### 🎨 User Interface
- **Modern Design System** - Professional SaaS-quality UI with Inter font
- **Dark Mode Support** - Seamless light/dark theme toggle with localStorage persistence
- **Responsive Layout** - Fully responsive from desktop (1200px+) to mobile (375px)
- **Task State Visualization** - Color-coded task cards (Upcoming: Blue, Overdue: Red, Completed: Green)
- **Grouped Task Sections** - Organized by status with colored indicators and counts
- **Touch-Friendly** - 44px minimum touch targets for mobile accessibility
- **WCAG AA Compliant** - Accessible contrast ratios for all text and UI elements

### 📋 Task Management
- **Create Tasks** - Add tasks with title, description, and optional due date
- **View Tasks** - See all your tasks organized by status
- **Update Tasks** - Edit task details through a polished modal interface
- **Delete Tasks** - Remove tasks with confirmation dialog
- **Mark Complete** - Toggle task completion status
- **Due Date Tracking** - Automatic overdue detection and visual indicators
- **Empty State Handling** - Helpful prompts when no tasks exist

### 🔐 Authentication & Security
- **User Signup/Signin** - Secure authentication with Better Auth
- **JWT Tokens** - Token-based authentication for API requests
- **Password Hashing** - Bcrypt password hashing for security
- **User Isolation** - Each user can only access their own tasks
- **Protected Routes** - Frontend route protection with authentication checks

### 🗄️ Data Management
- **Persistent Storage** - All data stored in Neon Serverless PostgreSQL
- **Automatic Timestamps** - Created and updated timestamps for all tasks
- **Data Validation** - Input validation at multiple layers (frontend, backend, database)
- **User-Specific Data** - Complete data isolation between users

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3.3 with custom design tokens
- **Language**: TypeScript
- **Font**: Inter (via next/font/google)
- **State Management**: React Context API (Auth & Theme)

### Backend
- **Framework**: Python FastAPI
- **ORM**: SQLModel
- **Authentication**: Better Auth with JWT
- **Password Hashing**: Bcrypt
- **Validation**: Pydantic models

### Database
- **Database**: Neon Serverless PostgreSQL
- **Connection**: psycopg2-binary with SSL
- **Migrations**: Runtime schema updates

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm (frontend), pip (backend)
- **Code Quality**: ESLint, Prettier (frontend)

## 📋 Prerequisites

- **Node.js** 18+ (for Next.js frontend)
- **Python** 3.11+ (for FastAPI backend)
- **Neon PostgreSQL** account (or any PostgreSQL database)
- **Git** (for version control)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Phase-II
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your database credentials
cat > .env << EOF
DATABASE_URL='postgresql://user:password@host/database?sslmode=require'
BETTER_AUTH_SECRET='your-secret-key-here'
EOF

# Initialize database (creates tables)
python init_db.py

# Start the backend server
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8001 --reload
```

Backend will be running at `http://localhost:8001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

### 4. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Sign up for a new account
3. Start creating and managing your tasks!

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Task Endpoints

All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Create Task
```http
POST /api/{user_id}/tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "due_date": "2024-12-31",
  "completed": false,
  "user_id": "user-id"
}
```

#### Get All Tasks
```http
GET /api/{user_id}/tasks?user_id={user_id}
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/{user_id}/tasks/{task_id}?user_id={user_id}
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/{user_id}/tasks/{task_id}?user_id={user_id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated title",
  "description": "Updated description",
  "due_date": "2024-12-31"
}
```

#### Delete Task
```http
DELETE /api/{user_id}/tasks/{task_id}?user_id={user_id}
Authorization: Bearer <token>
```

#### Toggle Task Completion
```http
PATCH /api/{user_id}/tasks/{task_id}/complete?user_id={user_id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "completed": true
}
```

## 📁 Project Structure

```
Phase-II/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── main.py              # FastAPI app initialization
│   │   │   ├── exceptions.py        # HTTP exception handlers
│   │   │   └── routes/
│   │   │       ├── auth.py          # Authentication routes
│   │   │       └── tasks.py         # Task CRUD routes
│   │   ├── models/
│   │   │   ├── task_model.py        # Task SQLModel definition
│   │   │   └── user_model.py        # User SQLModel definition
│   │   ├── services/
│   │   │   ├── database.py          # Database engine and session
│   │   │   └── task_service.py      # Task business logic
│   │   └── config/
│   │       └── settings.py          # Configuration management
│   ├── tests/                       # Backend tests
│   ├── docs/                        # Backend documentation
│   ├── requirements.txt             # Python dependencies
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout with providers
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── login/               # Authentication page
│   │   │   └── dashboard/           # Main dashboard
│   │   ├── components/
│   │   │   ├── auth/                # Auth components
│   │   │   ├── tasks/               # Task components
│   │   │   └── ui/                  # UI components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication context
│   │   │   └── ThemeContext.tsx     # Theme context (dark mode)
│   │   ├── config/
│   │   │   └── api.js               # API configuration
│   │   └── styles/
│   │       └── globals.css          # Global styles and design tokens
│   ├── public/                      # Static assets
│   ├── package.json                 # Node dependencies
│   └── tailwind.config.js           # Tailwind configuration
│
├── specs/                           # Feature specifications
├── history/                         # Development history
└── README.md                        # This file
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **11 Semantic Color Tokens** - Consistent colors across light and dark modes
- **6-Level Typography Scale** - From page titles to labels
- **Responsive Spacing** - Adapts from desktop to mobile
- **State-Based Styling** - Visual feedback for task states
- **Dark Mode** - Complete dark theme with localStorage persistence

### Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| bg-primary | #FFFFFF | #111827 | Page background |
| bg-surface | #F9FAFB | #1F2937 | Content area background |
| bg-card | #FFFFFF | #374151 | Card backgrounds |
| text-primary | #111827 | #F9FAFB | Primary text |
| text-secondary | #6B7280 | #9CA3AF | Secondary text |
| accent-primary | #2563EB | #3B82F6 | Primary actions |
| accent-success | #16A34A | #22C55E | Completed state |
| accent-danger | #DC2626 | #EF4444 | Overdue/delete |

## 🧪 Testing

### Backend Tests

```bash
cd backend
python tests/test_api.py
python tests/test_simple.py
```

### Frontend Testing

Visual verification checklist:
1. ✅ Login page shows polished design
2. ✅ Dashboard shows theme toggle
3. ✅ Theme toggle works (light ↔ dark)
4. ✅ Task badges show correct colors
5. ✅ Mobile layout adapts cleanly
6. ✅ All CRUD operations work
7. ✅ User isolation is enforced

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt
- **JWT Authentication** - Secure token-based auth
- **User Isolation** - Database-level data separation
- **Input Validation** - Multi-layer validation (frontend, backend, database)
- **SQL Injection Protection** - ORM-based queries
- **CORS Configuration** - Restricted to frontend origin
- **Environment Variables** - Sensitive data in .env files

## 🌐 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-here
ENVIRONMENT=development
DEBUG=true
```

### Frontend

No environment variables required for development. API base URL is configured in `src/config/api.js`.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [FastAPI](https://fastapi.tiangolo.com/)
- Database hosted on [Neon](https://neon.tech/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Font: [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
