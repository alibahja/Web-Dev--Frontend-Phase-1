# BiblioTech — Digital Library Management System

# Overview

BiblioTech is a full-stack digital library platform designed to enhance how users discover, manage, and engage with books. It combines traditional library features with modern interactive elements such as learning roadmaps, reading analytics, and community discussions.

The system supports both end-users (students/readers) and administrators, offering a complete ecosystem for digital reading and content management.

# Core Features

# Book Management
Advanced search with filters (title, author, genre, ISBN, pages, year)
Book borrowing system with a 14-day return policy
Personalized reading lists:
Want to Read
Currently Reading
Favorites
Book ratings and reviews
Random book generator
Option to purchase books

# Reading Games (Learning Roadmaps)
Structured learning paths (e.g., Web Development, Data Science)
Step-by-step guided progression
Book recommendations per step
Progress tracking with persistence
Completion badges and milestones

# Communities
Create and join reading communities
Threaded discussions with nested comments
Community roles and moderation tools
Founder/admin controls (remove members, delete communities)

# User Profile & Analytics
Reading statistics:
Total books read
Pages read
Monthly activity
Favorite genre insights
Achievement ranking system (Avid Reader → Scholar)
Reading streak tracking
Profile customization with image upload

# Admin Dashboard
Full CRUD operations for books
User management (roles, deletion)
Comment moderation
Community oversight
Game/roadmap creation and management
Analytics dashboard (popular books, genres)

# Authentication & Security
JWT-based authentication
Role-based access control (Student, Librarian, Admin)
Secure password hashing using bcrypt
Protected API routes

# Tech Stack
Frontend
React 18 — UI development
Tailwind CSS — Styling & responsiveness
Framer Motion — Animations
React Router DOM — Routing
Axios — API communication
React Icons — Icons

Backend
Node.js — Runtime
Express.js — Server framework
MySQL — Relational database
JWT — Authentication
bcrypt — Password hashing
Multer — File uploads
Nodemailer — Email service
Swagger UI — API documentation


# Project Structure
bibliotech/
├── frontend-improved/        # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page views
│   │   ├── api/              # API client
│   │   ├── assets/           # Images & static files
│   │   └── styles/           # Global styles
│   └── public/
│
├── nodebackend/              # Node.js backend
│   ├── src/
│   │   ├── config/           # DB, JWT, email config
│   │   ├── controllers/      # Business logic
│   │   ├── middlewares/      # Auth & error handling
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helpers
│   ├── uploads/              # User-uploaded files
│   └── package.json
│
└── README.md

# Getting Started

Prerequisites
Node.js (v18+)
MySQL (v8+)
npm or yarn

Installation
1. Clone the Repository
git clone https://github.com/alibahja/Web-Dev--Frontend-Phase-1.git
cd Web-Dev--Frontend-Phase-1
2. Backend Setup
cd nodebackend
npm install

# Create environment file
cp .env.example .env

Update .env:

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bibliotech

JWT_SECRET=your_secret_key

EMAIL_USER=bibliotech453@gmail.com
EMAIL_PASS=your_app_password

Run backend:
npm run dev

3. Frontend Setup
cd ../frontend-improved
npm install
npm run dev

# Running the Application
Service	Command	URL
Backend	npm run dev	http://localhost:3000

Frontend	npm run dev	http://localhost:5173

API Docs	Auto-generated	http://localhost:3000/api-docs

Database	MySQL	http://localhost:3306


# API Documentation

Interactive API docs available via Swagger:

http://localhost:3000/api-docs

Includes:

Endpoint details
Request/response schemas
Authentication support (Bearer token)

# Key API Endpoints
Category	Endpoint	Method	Description
Auth	/api/auth/register	POST	Register user
Auth	/api/auth/login	POST	Login
Books	/api/books	GET	Get books
Books	/api/books/search	GET	Search books
Profile	/api/profile/profile	GET	User profile
Games	/api/games	GET	Get roadmaps
Communities	/api/communities	GET	Get communities
Admin	/api/admin/stats	GET	Dashboard stats

# Security Highlights
Password hashing (bcrypt, 10 rounds)
JWT authentication (7-day expiry)
Input validation & sanitization
Parameterized queries (SQL injection prevention)
File upload restrictions (images only, max 5MB)
Secure environment variables
CORS protection

# Testing
Backend (Postman)
Import collection from:
/postman/BiblioTech.postman_collection.json
Frontend
npm run lint
npm run build

# Database Overview
Core Tables
users
books
user_books
games
game_steps
communities
comments
reading_stats

# team members: 
   Ali bahja
   Asmaa Zeid
   Makram Kordab
   Ahmed Abd El Rida
   
# Contact
Email: bibliotech453@gmail.com
