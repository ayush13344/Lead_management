# 🎯 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript. Manage leads, track status, filter, search, export to CSV, and control access with role-based authentication.

---

## 📸 Features

- 🔐 JWT Authentication (Register / Login)
- 👥 Role-Based Access Control (Admin / Sales)
- 📋 Full Lead CRUD (Create, Read, Update, Delete)
- 🔍 Advanced Filtering (Status, Source, Search, Sort)
- 📄 Backend Pagination (10 records/page)
- ⌨️ Debounced Search
- 📤 CSV Export
- 🌙 Dark Mode Support
- 🐳 Docker Ready

---

## 🛠️ Tech Stack

### Frontend
| Tech | Version |
|------|---------|
| React | 18 |
| TypeScript | 5 |
| TailwindCSS | 3 |
| React Router | 6 |
| Axios | 1.4 |
| Vite | 4 |

### Backend
| Tech | Version |
|------|---------|
| Node.js | 18 |
| Express | 4 |
| TypeScript | 5 |
| MongoDB | 6 |
| Mongoose | 7 |
| JWT | 9 |
| bcryptjs | 2.4 |

---

## 📁 Project Structure

```
lead_management/
├── docker-compose.yml
├── README.md
│
├── server/                         # Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Register & Login
│   │   │   └── leadController.ts   # Lead CRUD & CSV export
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT protect & adminOnly
│   │   │   └── errorHandler.ts     # Global error handler
│   │   ├── models/
│   │   │   ├── User.ts             # User schema
│   │   │   └── Lead.ts             # Lead schema
│   │   ├── routes/
│   │   │   ├── auth.ts             # /api/auth routes
│   │   │   └── leads.ts            # /api/leads routes
│   │   ├── types/
│   │   │   └── index.ts            # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── generateToken.ts    # JWT token generator
│   │   └── index.ts                # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                       # Frontend
    ├── src/
    │   ├── api/
    │   │   ├── axios.ts            # Axios instance + interceptors
    │   │   ├── auth.ts             # Auth API calls
    │   │   └── leads.ts            # Leads API calls
    │   ├── components/
    │   │   ├── Navbar.tsx          # Top navigation bar
    │   │   ├── LeadModal.tsx       # Create/Edit lead modal
    │   │   ├── StatusBadge.tsx     # Colored status pill
    │   │   ├── Pagination.tsx      # Pagination controls
    │   │   └── ProtectedRoute.tsx  # Auth route guard
    │   ├── context/
    │   │   └── AuthContext.tsx     # Global auth state
    │   ├── hooks/
    │   │   └── useDebounce.ts      # Debounce hook
    │   ├── pages/
    │   │   ├── Login.tsx           # Login page
    │   │   ├── Register.tsx        # Register page
    │   │   └── Dashboard.tsx       # Main leads dashboard
    │   ├── types/
    │   │   └── index.ts            # Shared TypeScript types
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── nginx.conf
    ├── Dockerfile
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.ts
    └── package.json
```

---

## ⚙️ Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Run the dev server:

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🐳 Docker Setup (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run Everything with One Command

From the root `lead_management/` folder:

```bash
docker-compose up --build
```

This starts:
- 🍃 MongoDB on port `27017`
- 🚀 Backend on port `5000`
- 🌐 Frontend on port `3000`

Access your app:
```
Frontend  → http://localhost:3000
Backend   → http://localhost:5000/api/health
```

### Useful Docker Commands

```bash
# Run in background
docker-compose up --build -d

# Stop all containers
docker-compose down

# Stop and wipe all data (fresh start)
docker-compose down -v

# View live logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and get JWT token |

#### Register — `POST /auth/register`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin"
}

// Response
{
  "success": true,
  "data": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "token": "eyJhbGci..."
  }
}
```

#### Login — `POST /auth/login`
```json
// Request Body
{
  "email": "john@example.com",
  "password": "123456"
}

// Response
{
  "success": true,
  "data": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "token": "eyJhbGci..."
  }
}
```

---

### Lead Endpoints

All lead endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/leads` | All | Get paginated leads with filters |
| GET | `/leads/:id` | All | Get single lead |
| POST | `/leads` | All | Create a new lead |
| PUT | `/leads/:id` | All | Update a lead |
| DELETE | `/leads/:id` | Admin only | Delete a lead |
| GET | `/leads/export/csv` | All | Export leads as CSV |

#### Get Leads — `GET /leads`

Query parameters:

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |
| `status` | string | `Qualified` | Filter by status |
| `source` | string | `Instagram` | Filter by source |
| `search` | string | `Rahul` | Search name or email |
| `sort` | string | `latest` | `latest` or `oldest` |

Example:
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Create Lead — `POST /leads`
```json
// Request Body
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

---

## 👥 Role-Based Access

| Feature | Admin | Sales |
|---------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit lead | ✅ | ✅ (own only) |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own only) |

---

## 🌱 Lead Data Model

```typescript
{
  name: string;        // Required
  email: string;       // Required
  status: enum;        // New | Contacted | Qualified | Lost
  source: enum;        // Website | Instagram | Referral
  createdBy: ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Free Deployment

### Option 1 — Railway (Easiest)
1. Push project to GitHub
2. Go to [railway.app](https://railway.app)
3. Click **New Project** → **Deploy from GitHub**
4. Select your repo — Railway auto-detects `docker-compose.yml`
5. Add environment variables in Railway dashboard
6. Done — you get a public URL for free

### Option 2 — Render + MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Deploy backend at [render.com](https://render.com) as a Web Service
3. Deploy frontend at [render.com](https://render.com) as a Static Site
4. Set environment variables in Render dashboard

---

## 📝 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | Secret key for JWT signing | `mysecretkey123` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `NODE_ENV` | Environment | `development` |

---

