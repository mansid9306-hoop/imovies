# IMovies Technical Architecture & Design Document

## 1. System Overview
IMovies is built using a decoupled Client-Server architecture on the MERN stack (MongoDB, Express.js, React.js, Node.js). It integrates real-time bi-directional WebSocket communication via Socket.io to manage seat selection concurrency and prevent double-booking.

```
+-------------------------------------------------------+
|                   Client (React.js)                   |
|  - React Router DOM   - Context API (Auth, Socket)    |
|  - Axios Interceptors - Bootstrap 5 & Custom CSS      |
+---------------------------+---------------------------+
                            |
                 HTTP / REST|& WebSocket (Socket.io)
                            |
+---------------------------v---------------------------+
|               Express.js & Node.js Server             |
|  - JWT Authentication Middleware & Rate Limiting      |
|  - Show Seat Concurrency Manager (8-min Locks)        |
|  - Centralized Error Handling & Controllers           |
+---------------------------+---------------------------+
                            |
                 Mongoose / | Database Adapter
                            |
+---------------------------v---------------------------+
|                   MongoDB Database                    |
|  Users | Movies | Theatres | Shows | Bookings         |
|  Payments | Notifications                             |
+-------------------------------------------------------+
```

---

## 2. Database Design & Schemas

### 2.1 Users Collection
- `_id`: ObjectId
- `name`: String (Required, trimmed)
- `email`: String (Required, unique, indexed)
- `password`: String (Bcrypt salted hash, 10 rounds)
- `role`: Enum `['user', 'admin']` (Default: `'user'`)
- `phone`: String
- `avatar`: String (Profile image URL)
- `timestamps`: CreatedAt, UpdatedAt

### 2.2 Movies Collection
- `_id`: ObjectId
- `title`: String (Indexed)
- `description`: String
- `genre`: [String] (Indexed)
- `language`: [String] (Indexed)
- `duration`: Number (Minutes)
- `releaseDate`: Date
- `poster`: String (URL)
- `banner`: String (High-res backdrop URL)
- `trailerUrl`: String (YouTube embed)
- `rating`: Number (0.0 to 10.0)
- `votesCount`: Number
- `certificate`: Enum `['U', 'UA', 'A']`
- `status`: Enum `['now_showing', 'upcoming']`
- `cast`: Array of `{ name, role, photo }`
- `director`: String

### 2.3 Theatres Collection
- `_id`: ObjectId
- `name`: String
- `city`: String (Indexed)
- `location`: String
- `address`: String
- `screens`: Array of `{ screenNumber, name, seatingCapacity, tierPricing: { vip, premium, standard } }`
- `facilities`: [String] (e.g. `['Dolby Atmos', 'IMAX Laser', 'Recliners']`)

### 2.4 Shows Collection
- `_id`: ObjectId
- `movieId`: Ref -> Movie (Indexed)
- `theatreId`: Ref -> Theatre (Indexed)
- `screenName`: String
- `showDate`: String `YYYY-MM-DD` (Indexed)
- `showTime`: String (e.g. `'06:15 PM'`)
- `pricing`: `{ vip, premium, standard }`
- `seatMatrix`: Array of 60 seats:
  - `seatId`: String (e.g. `'A1'`, `'C5'`, `'F10'`)
  - `row`: String (`'A'` through `'F'`)
  - `col`: Number (1 to 10)
  - `tier`: Enum `['vip', 'premium', 'standard']`
  - `price`: Number
  - `status`: Enum `['available', 'locked', 'booked']`
  - `lockedBy`: Ref -> User (Nullable)
  - `lockExpiry`: Date (Nullable)
- `totalSeats`: Number (60)
- `availableSeats`: Number

### 2.5 Bookings Collection
- `_id`: ObjectId
- `bookingNumber`: String (Unique, e.g. `'IM-2026-492817'`)
- `userId`: Ref -> User (Indexed)
- `showId`: Ref -> Show
- `movieId`: Ref -> Movie
- `theatreId`: Ref -> Theatre
- `seats`: [String] (e.g. `['C5', 'C6']`)
- `seatDetails`: Array of `{ seatId, tier, price }`
- `ticketPrice`: Number
- `convenienceFee`: Number (₹15 / seat)
- `tax`: Number (18% GST)
- `totalAmount`: Number
- `bookingStatus`: Enum `['confirmed', 'cancelled']`
- `qrCode`: String (Unique validation payload)
- `paymentId`: Ref -> Payment
- `cancellationReason`: String
- `refundAmount`: Number

### 2.6 Payments Collection
- `_id`: ObjectId
- `bookingId`: Ref -> Booking
- `userId`: Ref -> User
- `amount`: Number
- `paymentMethod`: Enum `['credit_card', 'debit_card', 'upi', 'netbanking', 'wallet']`
- `transactionId`: String (Unique, e.g. `'TXN-1718293847'`)
- `status`: Enum `['success', 'failed', 'refunded']`

### 2.7 Notifications Collection
- `_id`: ObjectId
- `userId`: Ref -> User
- `title`: String
- `message`: String
- `type`: Enum `['booking', 'cancellation', 'reminder', 'system']`
- `read`: Boolean (Default: `false`)

---

## 3. Real-Time Seat Concurrency Protocol

To eliminate race conditions and double-booking:
1. When a user navigates to the seat selection screen, their client emits `join_show(showId)` over Socket.io.
2. When the user clicks **"Proceed to Payment"**, a transactional lock request is made: `POST /api/shows/:id/lock-seats`.
3. The server validates that none of the selected seats are currently `'booked'` or `'locked'` by another user.
4. If valid, the seats are marked `'locked'` with an expiration timestamp of `Date.now() + 8 minutes`.
5. The server immediately broadcasts `seats_updated` to all connected clients in the show room:
   ```js
   io.to(`show_${showId}`).emit('seats_updated', { showId, seatMatrix, availableSeats });
   ```
6. If the user completes payment within 8 minutes, the seats transition to `'booked'`. If the timer expires or the user unlocks, the seats transition back to `'available'`.

---

## 4. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /register`: Register user or admin
- `POST /login`: Authenticate and return JWT token
- `GET /profile`: Get current user details (Protected)
- `PUT /profile`: Update profile / password (Protected)
- `GET /notifications`: Retrieve user notifications (Protected)
- `PUT /notifications/:id/read`: Mark notification as read (Protected)

### Movies (`/api/movies`)
- `GET /`: Search & filter movies with pagination
- `GET /:id`: Movie details with scheduled shows
- `GET /metadata/filters`: Distinct genres & languages
- `POST /`: Add new movie (Admin only)
- `PUT /:id`: Update movie (Admin only)
- `DELETE /:id`: Delete movie & associated shows (Admin only)

### Theatres (`/api/theatres`)
- `GET /`: List theatres with city filter
- `GET /:id`: Theatre details and screens
- `GET /metadata/cities`: Unique cities
- `POST /`: Create theatre (Admin only)
- `PUT /:id`: Update theatre (Admin only)
- `DELETE /:id`: Delete theatre (Admin only)

### Shows (`/api/shows`)
- `GET /`: Query shows by movie, theatre, date
- `GET /:id`: Show details with seat matrix & real-time statuses
- `POST /:id/lock-seats`: Hold seats for checkout (Protected)
- `POST /:id/unlock-seats`: Release held seats (Protected)
- `POST /`: Schedule new show with generated layout (Admin only)
- `PUT /:id`: Update show (Admin only)
- `DELETE /:id`: Delete show (Admin only)

### Bookings (`/api/bookings`)
- `POST /`: Reserve seats, charge payment, generate e-ticket (Protected)
- `GET /my-bookings`: Logged in user's bookings (Protected)
- `GET /:id`: Specific booking pass (Protected)
- `PUT /:id/cancel`: Cancel booking & release seats (Protected)
- `GET /`: All cinema bookings list (Admin only)

### Payments & Admin
- `POST /api/payments/process`: Simulated payment authorization (Protected)
- `GET /api/admin/analytics`: Full cinema revenue, ticket sales & performance metrics (Admin only)
