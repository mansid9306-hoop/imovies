# 🎬 IMovies - Movie Ticket Booking Made Simple

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-red.svg)](https://reactjs.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%7C%20Zero--Config-brightgreen.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A production-grade, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** cinema management and movie ticket reservation system with real-time seat availability tracking, JWT role-based security, simulated payment gateways, digital QR e-tickets, and comprehensive cinema administration.

---

## 📌 Project Links for Mentor Evaluation

| Resource | Link |
| :--- | :--- |
| **GitHub Repository** | `https://github.com/<your-username>/imovies` *(Instructions to push below)* |
| **Live Interactive Demo** | `http://localhost:5173` *(Local)* \| Deployable on Render / Vercel / Railway |

---

## 🏆 Project Progress & Epics Summary (100% Complete)

| Epic | Tasks | Status | Description |
| :--- | :---: | :---: | :--- |
| **Epic 1: Architecture & Environment** | 3 / 3 | ✅ Complete | Node.js, Express, React, Vite, Socket.io, Multer, Dotenv, and dual-mode database engine |
| **Epic 2: Database Schema & Modeling** | 5 / 5 | ✅ Complete | Schemas for Users, Movies, Theatres, Shows, Bookings, Payments, and Notifications |
| **Epic 3: Authentication & Security** | 4 / 4 | ✅ Complete | JWT authentication, bcryptjs hashing, role-based protection (User/Admin), rate limiting |
| **Epic 4: Movie Discovery & Live Seats**| 4 / 4 | ✅ Complete | Multi-filter search (genre, language, date, city), live 60-seat matrix with Socket.io locking |
| **Epic 5: Checkout, Booking & e-Tickets**| 4 / 4 | ✅ Complete | Tax calculation, simulated multi-gateway payment, digital QR tickets, booking cancellation |
| **Epic 6: Administration & Monitoring** | 4 / 4 | ✅ Complete | Cinema management dashboard, movie CRUD, show scheduler, indexing, error handling |

---

## 🔑 Pre-Configured Demo Credentials (Instant 1-Click Evaluation)

The platform includes pre-seeded accounts ready for instant testing:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Cinema Admin** | `admin@imovies.com` | `admin123` | Full Admin Portal: revenue KPI metrics, add/edit/delete movies, schedule shows, monitor all customer bookings |
| **Demo Customer** | `alex@example.com` | `password123` | Browse catalog, select seats, simulate checkout, view and print official e-tickets, test cancellation refunds |

*(Quick 1-click test buttons are conveniently available on the Sign In page for immediate evaluation)*

---

## 🚀 Key Features

1. **Movie Discovery & Multi-Filtering**:
   - Filter by status (`Now Showing`, `Upcoming`), genre (`Action`, `Sci-Fi`, `Drama`, etc.), language (`English`, `Hindi`, `Tamil`), and sorting (`Rating`, `Release Date`, `Title`).
   - Integrated search for titles, directors, and cast members.

2. **Real-Time Interactive Seat Reservation**:
   - High-fidelity 60-seat auditorium layout with curved screen projection.
   - Three distinct seating tiers: **VIP Recliners**, **Premium Club**, and **Standard Classic**.
   - Real-time seat locking with 8-minute reservation timers preventing double-booking via Socket.io.

3. **Simulated Payment Gateway & Digital e-Tickets**:
   - Support for simulated Credit/Debit Cards, UPI IDs with QR codes, Net Banking, and Mobile Wallets.
   - Instant ticket generation with verifiable QR codes, tear-off pass design, booking reference numbers, and print/download capability.

4. **Booking History & Cancellation System**:
   - Dedicated user bookings dashboard categorized by Active/Upcoming and Past tickets.
   - Self-service booking cancellation with automatic 85% refund calculation and instant seat release.

5. **Cinema Admin Portal**:
   - Real-time KPI dashboards tracking total gross revenue, tickets sold, active movies, and occupancy rates.
   - Movie management panel (create new movies with posters, banners, and YouTube trailers).
   - Show scheduler (assign screen auditoriums, dates, times, and tier pricing).

6. **Zero-Setup Database Architecture**:
   - Connects to any local MongoDB daemon or MongoDB Atlas URI via `MONGO_URI` in `.env`.
   - Automatically activates a high-performance in-memory cinema document store if MongoDB is offline, guaranteeing 100% zero-config execution for reviewers!

---

## 🛠️ Technology Stack

- **Frontend**: React 19 / 18, Vite, React Router v7, Bootstrap 5, Bootstrap Icons, Lucide Icons, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT (`jsonwebtoken`), bcryptjs, CORS, Dotenv, express-rate-limit
- **Database**: MongoDB / Mongoose with custom zero-setup memory fallback adapter
- **Tooling**: Git, Postman API collections, PowerShell

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### 1. Installation
Clone or navigate to the project directory:
```bash
cd imovies
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create or verify `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026_secure_cinema
```

### 3. Seed Database (Optional - Runs automatically on first start)
```bash
cd backend
npm run seed
```

### 4. Run Application

**Terminal 1 - Backend API Server:**
```bash
cd backend
npm start
# Server starts on http://localhost:5000 (API at http://localhost:5000/api)
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
# Vite server starts on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 📤 Step-by-Step: Adding GitHub Link For Mentor Review

1. Create a new public repository on [GitHub](https://github.com/new) named `imovies`.
2. In your terminal, run the following commands from the project root:
   ```bash
   cd imovies
   git add .
   git commit -m "feat: complete production-ready MERN IMovies ticketing system"
   git remote add origin https://github.com/<your-github-username>/imovies.git
   git branch -M main
   git push -u origin main
   ```
3. Copy your repository link (e.g. `https://github.com/<your-username>/imovies`) and paste it into the **"Add Github Link"** field on your project submission portal!

---

## 🌐 Step-by-Step: Adding Live Demo Link

To provide your mentor with a live deployment link:
1. **Frontend**: Deploy `frontend` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (Build command: `npm run build`, Output directory: `dist`).
2. **Backend**: Deploy `backend` to [Render](https://render.com) or [Railway](https://railway.app) (Build command: `npm install`, Start command: `node server.js`).
3. Set `VITE_API_BASE_URL` in your frontend environment variables to point to your live backend domain.
4. Paste the live URL into the **"Add Demo Link"** field on your project portal!

---

## 📄 License
MIT License. Built for cinema lovers and academic capstone evaluation.
