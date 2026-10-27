# CampusConnect — College Club & Event Management System

CampusConnect is a full-stack web application built by MCA final-semester students. Students can browse college clubs, join them, discover events and register for them. Admins manage clubs, events, users and event registrations from a simple admin panel.

---

## Features

**Student**
- Register an account and log in / log out (JWT)
- Home page and personal dashboard (joined clubs, registered events, upcoming events)
- Browse clubs with search and category filter, view club details
- Join a club (no duplicates) and leave a club
- View My Clubs
- Browse events with search and club filter, view event details
- Register for an event (no duplicates)
- View My Events

**Admin**
- Admin dashboard with total clubs, events and users
- Add, edit and delete clubs
- Add, edit and delete events
- View registered users
- View event registrations

---

## Technology Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React.js, Vite, JavaScript, JSX, CSS, React Router, Axios |
| Backend  | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors` |
| Database | MySQL (`mysql2`) |

Icons come from the Font Awesome CDN and fonts from Google Fonts (linked in `frontend/index.html`). Images are stored locally in `frontend/public/images/` (free images from Unsplash).

---

## Folder Structure

```
CampusConnect/
├── frontend/
│   ├── public/images/        # local club / event / campus images
│   ├── src/
│   │   ├── components/       # Navbar.jsx (also StudentLayout), ClubCard.jsx, EventCard.jsx
│   │   ├── pages/            # Home, Login, Register, Dashboard, Clubs, ClubDetails,
│   │   │                     # MyClubs, Events, EventDetails, MyEvents, Admin
│   │   ├── services/api.js   # Axios setup + small helper functions
│   │   ├── App.jsx           # all routes
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # all styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/db.js          # MySQL connection pool
│   ├── controllers/          # auth.js, clubs.js, events.js, users.js
│   ├── routes/               # auth.js, clubs.js, events.js, users.js
│   ├── middleware/auth.js    # verifyToken + isAdmin
│   ├── database/
│   │   ├── schema.sql        # tables
│   │   └── sample.sql        # sample clubs, events, students
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## Prerequisites

- Node.js 18 or newer (includes npm)
- MySQL 8 (or MariaDB 10+)
- VS Code (recommended)

---

## 1. MySQL Database Setup

Open a terminal in the project folder and run:

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p campusconnect < backend/database/sample.sql
```

This creates the `campusconnect` database with 5 tables:

| Table | Columns |
|-------|---------|
| users | id, name, email (unique), password (bcrypt hash), role (`STUDENT` / `ADMIN`) |
| clubs | id, name, description, category |
| events | id, club_id → clubs, name, description, date, venue |
| club_members | id, user_id → users, club_id → clubs, joined_at — **UNIQUE(user_id, club_id)** |
| registrations | id, user_id → users, event_id → events, registered_at — **UNIQUE(user_id, event_id)** |

Foreign keys use `ON DELETE CASCADE`, so deleting a club also deletes its events, memberships and registrations.

> You can also open both `.sql` files in MySQL Workbench and run them.

---

## 2. Environment Variables

Copy the example file and fill in your own values:

```bash
cd backend
cp .env.example .env      # on Windows: copy .env.example .env
```

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campusconnect
JWT_SECRET=any_long_random_text
```

Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` is listed in `.gitignore`. **Never commit it.**

---

## 3. Run the Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`. Open `http://localhost:5000/api` to check it.

## 4. Run the Frontend (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite forwards every `/api` request to `http://localhost:5000` (see `vite.config.js`), so no extra frontend configuration is needed.

---

## Sample Login

| Role | Email | Password |
|------|-------|----------|
| Student | rahul@student.com | student123 |
| Student | priya@student.com | student123 |

These are demo accounts for local testing only. Change or remove them before a real deployment.

### Create an admin account (secure way)

Public registration **always** creates a STUDENT, so admins are promoted manually in the database:

1. Register normally on the website with your admin email and a strong password.
2. In MySQL, run:
   ```sql
   USE campusconnect;
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
   ```
3. Log out and log in again. You will be taken to `/admin`.

---

## API Endpoints

Base URL: `http://localhost:5000/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /auth/register | Public | Register a new student |
| POST | /auth/login | Public | Login and get a JWT token |
| GET | /clubs | Public | List all clubs |
| GET | /clubs/:id | Public | Club details |
| POST | /clubs | Admin | Add a club |
| PUT | /clubs/:id | Admin | Edit a club |
| DELETE | /clubs/:id | Admin | Delete a club |
| POST | /clubs/:id/join | Logged in | Join a club |
| DELETE | /clubs/:id/leave | Logged in | Leave a club |
| GET | /my-clubs | Logged in | Clubs joined by the logged-in user |
| GET | /events | Public | List all events |
| GET | /events/:id | Public | Event details |
| POST | /events | Admin | Add an event |
| PUT | /events/:id | Admin | Edit an event |
| DELETE | /events/:id | Admin | Delete an event |
| POST | /events/:id/register | Logged in | Register for an event |
| GET | /my-events | Logged in | Events registered by the logged-in user |
| GET | /users | Admin | List all users |
| GET | /registrations | Admin | List all event registrations |

**Error messages:** `400` missing fields, duplicate email, already joined or already registered · `401` invalid credentials or missing token · `403` not an admin · `404` record not found.

---

## Team Members & Responsibilities

| Member | Branch | Responsibilities |
|--------|--------|------------------|
| Member 1 (Team Leader) | `leader-auth` | Authentication, database setup, student dashboard, admin panel, integration & testing, GitHub management |
| Member 2 | `member2-clubs` | Club listing, club details, join/leave club, My Clubs, club APIs |
| Member 3 | `member3-events` | Event listing, event details, event registration, My Events, event APIs |

**Files owned by each member**
- Member 1: `backend/controllers/auth.js`, `users.js`, `routes/auth.js`, `routes/users.js`, `middleware/auth.js`, `config/db.js`, `database/*`, `server.js`, `pages/Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `Admin.jsx`, `Home.jsx`, `components/Navbar.jsx`, `App.jsx`, `services/api.js`
- Member 2: `backend/controllers/clubs.js`, `routes/clubs.js`, `pages/Clubs.jsx`, `ClubDetails.jsx`, `MyClubs.jsx`, `components/ClubCard.jsx`
- Member 3: `backend/controllers/events.js`, `routes/events.js`, `pages/Events.jsx`, `EventDetails.jsx`, `MyEvents.jsx`, `components/EventCard.jsx`

**Simple Git workflow**

```bash
git checkout main && git pull
git checkout member2-clubs        # your own branch
git merge main                    # get the latest changes
# ...make changes...
git add .
git commit -m "Add category filter on clubs page"
git push origin member2-clubs
# Open a Pull Request on GitHub -> the team leader reviews and merges into main
```

---

## Basic Deployment

1. **Database:** create a MySQL database on any hosting provider (for example Railway, Aiven or a college server) and run `schema.sql`. Run `sample.sql` only if you want the demo data.
2. **Backend:** deploy the `backend/` folder to a Node.js host (for example Render or Railway). Start command: `npm start`. Set `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` and `JWT_SECRET` in the host's environment settings.
3. **Frontend:** in `frontend/`, create a `.env` file with `VITE_API_URL=https://your-backend-url/api`, then run `npm run build`. Upload the `dist/` folder to a static host (for example Netlify or Vercel) and add a rewrite rule that sends all routes to `index.html`.
