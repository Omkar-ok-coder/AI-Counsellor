# AI Counsellor - Study Abroad Application

A full-stack application for study abroad counseling with AI-powered recommendations.

## Project Structure

```
AI-Counsellor/
├── frontend/          # Next.js frontend application
└── server/            # Express.js backend API
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The `.env` file is already created in the `server/` directory
   - Update the MongoDB connection string if needed:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_jwt_key_123
     OPENAI_API_KEY=your_openai_api_key_here
     PORT=5000
     ```

4. Seed the database with sample universities:
```bash
node utils/seed.js
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The `.env.local` file is already created
   - Update if your backend runs on a different port:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

- **User Authentication**: Sign up and login with JWT token-based authentication
- **Profile Management**: Complete onboarding flow to set up your academic profile
- **University Recommendations**: Get personalized university recommendations based on your profile
- **AI Counsellor**: Chat with an AI assistant for study abroad guidance
- **University Shortlisting**: Browse, shortlist, and lock universities

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)

### Universities
- `GET /api/universities` - Get university recommendations (protected)

### AI
- `POST /api/ai/chat` - Chat with AI counsellor (protected)

## Development

### Running Both Servers

You'll need to run both the backend and frontend servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Notes

- Make sure MongoDB is running before starting the backend server
- The AI chat feature uses a mock response by default. To enable real AI responses, add your OpenAI API key to the `.env` file and update the `aiController.js`
- JWT tokens are stored in localStorage on the frontend
- Protected routes require authentication via JWT token
