# 🏥 Hospital Appointment Management System

A full-stack web application for managing hospital appointments between patients and doctors.

---

## Tech Stack

### Backend
- **NestJS** — Node.js framework (feature-based architecture)
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** + **Passport** — Authentication
- **bcrypt** — Password hashing
- **Swagger** — API documentation

### Frontend
- **React** + **Vite** — UI framework & build tool
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling (dark theme)
- **React Router DOM** — Routing
- **Axios** — HTTP client with JWT interceptor
- **TanStack React Query** — Server state management
- **React Hook Form** — Form handling

---

## Features

### Authentication
- Register as **Patient** or **Doctor**
- Login with JWT (stored in localStorage)
- Protected routes with role-based access control
- Auto-logout on 401

### Patients
- Browse & search doctors (by name / specialization)
- Book appointments with date & time
- View appointment history with status
- Pay for confirmed appointments (demo)
- View payment history
- Leave reviews for doctors (one per doctor, star rating)
- View prescriptions
- Patient dashboard with stats & upcoming appointments

### Doctors
- Update profile (specialization, experience, fee, bio, availability)
- View & manage appointments (confirm / cancel / reschedule)
- Create prescriptions for confirmed appointments
- Doctor dashboard with stats & upcoming appointments

---

## Project Structure

```
hospital-appointment-system/
├── backend/
│   └── src/
│       ├── auth/              # JWT auth, register, login
│       ├── users/             # User schema & service
│       ├── doctors/           # Doctor profiles & search
│       ├── appointments/      # Booking & management
│       ├── prescriptions/     # Prescription CRUD
│       ├── reviews/           # Doctor reviews
│       ├── payments/          # Demo payment system
│       ├── dashboard/         # Patient & doctor dashboards
│       └── common/            # Enums, guards, decorators
│
└── frontend/
    └── src/
        ├── api/               # Axios instance, types, query keys
        ├── context/           # AuthContext, ToastContext
        ├── hooks/             # useDebounce, useThrottle, custom hooks
        ├── pages/             # All page components
        ├── components/        # Shared UI components
        ├── routes/            # AppRoutes with protected/guest routes
        └── layouts/           # MainLayout, Navbar
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd hospital-appointment-backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

Start the server:
```bash
npm run start:dev
```

API runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

### 2. Frontend Setup

```bash
cd hospital-appointment-frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register patient or doctor |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/profile` | Get logged-in user (JWT required) |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | List all available doctors |
| GET | `/doctors/:id` | Get doctor by ID |
| GET | `/doctors/search` | Search by name & specialization |
| PATCH | `/doctors/profile` | Update own profile (DOCTOR only) |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointments` | Book appointment (PATIENT only) |
| GET | `/appointments/my-appointments` | Patient's appointments |
| GET | `/appointments/doctor` | Doctor's appointments (DOCTOR only) |
| PATCH | `/appointments/:id/confirm` | Confirm (DOCTOR only) |
| PATCH | `/appointments/:id/cancel` | Cancel (DOCTOR only) |
| PATCH | `/appointments/:id/reschedule` | Reschedule (DOCTOR only) |

### Prescriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/prescriptions` | Create prescription (DOCTOR only) |
| GET | `/prescriptions/patient` | Patient's prescriptions |
| GET | `/prescriptions/:id` | Single prescription |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Submit review (PATIENT only) |
| GET | `/reviews/doctor/:doctorId` | Get doctor's reviews |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/pay` | Make payment (PATIENT only) |
| GET | `/payments/history` | Payment history |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/patient` | Patient dashboard stats |
| GET | `/dashboard/doctor` | Doctor dashboard stats |

---

## Key Design Decisions

- Doctor `fullName` lives on the **User** document, linked via `userId` — always access as `doctor.userId.fullName`
- JWT payload: `{ sub: userId, email, role }`
- Appointment dates stored and sent as **ISO 8601** strings
- `whitelist: true` on ValidationPipe strips unknown fields
- Debounced search (400ms) for doctor list
- Throttled submissions (3s) for reviews, payments, and appointment actions to prevent double-submit
- React Query: `staleTime: 2min`, `retry: 1`, `refetchOnWindowFocus: false`

---

## Future Improvements

- Real-time notifications via WebSocket / Socket.io
- Email notifications on appointment status changes
- PDF prescription download (jsPDF)
- Real payment gateway (Razorpay / Stripe)
- Admin panel for user & appointment management
- Doctor availability calendar
- Video consultation via WebRTC
- Mobile app with React Native
- Dark / light theme toggle
- Jest + React Testing Library test coverage
