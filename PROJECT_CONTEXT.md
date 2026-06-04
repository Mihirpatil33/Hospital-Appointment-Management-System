# Hospital Appointment Management System

## Current Phase
Phase 2 — Doctor & Appointment Management (COMPLETE)

---

## Completed Features

### Phase 1 (Authentication)
- [x] NestJS project structure (feature-based)
- [x] MongoDB connection via Mongoose
- [x] Environment variable support (`@nestjs/config`)
- [x] Swagger UI at `/api/docs`
- [x] Global ValidationPipe (whitelist, transform)
- [x] CORS enabled
- [x] User schema with `fullName`, `email`, `password`, `role`
- [x] Role enum: `PATIENT | DOCTOR`
- [x] Password hashing with bcrypt (salt rounds: 10)
- [x] JWT authentication (Passport + passport-jwt)
- [x] Register API (POST /auth/register)
- [x] Login API (POST /auth/login)
- [x] Protected Profile route (GET /auth/profile)

### Phase 2 (Doctor & Appointments)
- [x] RolesGuard + @Roles() decorator for role-based access control
- [x] Doctor schema (separate collection, linked to User via userId)
- [x] Auto-create empty doctor profile on DOCTOR register
- [x] GET /doctors — list all available doctors
- [x] GET /doctors/:id — view single doctor
- [x] PATCH /doctors/profile — doctor updates own profile (DOCTOR only)
- [x] GET /doctors/search?name=&specialization= — search doctors
- [x] Appointment schema with status enum
- [x] POST /appointments — book appointment (PATIENT only)
- [x] GET /appointments/my-appointments — patient's own appointments
- [x] GET /appointments/doctor — doctor's appointments (DOCTOR only)
- [x] PATCH /appointments/:id/confirm — confirm (DOCTOR only)
- [x] PATCH /appointments/:id/cancel — cancel (DOCTOR only)
- [x] PATCH /appointments/:id/reschedule — reschedule (DOCTOR only)

---

## Files Created

```
hospital-appointment-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts                              ← MODIFIED
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts                ← NEW
│   │   ├── enums/
│   │   │   ├── role.enum.ts
│   │   │   └── appointment-status.enum.ts        ← NEW
│   │   └── guards/
│   │       └── roles.guard.ts                    ← NEW
│   ├── config/
│   │   └── jwt.config.ts
│   ├── auth/
│   │   ├── auth.module.ts                        ← MODIFIED
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts                       ← MODIFIED
│   │   ├── strategies/jwt.strategy.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts                       ← MODIFIED
│   │   ├── users.service.ts
│   │   ├── schemas/user.schema.ts
│   │   └── dto/create-user.dto.ts
│   ├── doctors/                                  ← NEW MODULE
│   │   ├── doctors.module.ts
│   │   ├── doctors.service.ts
│   │   ├── doctors.controller.ts
│   │   ├── schemas/
│   │   │   └── doctor.schema.ts
│   │   └── dto/
│   │       └── update-doctor.dto.ts
│   └── appointments/                             ← NEW MODULE
│       ├── appointments.module.ts
│       ├── appointments.service.ts
│       ├── appointments.controller.ts
│       ├── schemas/
│       │   └── appointment.schema.ts
│       └── dto/
│           ├── create-appointment.dto.ts
│           └── reschedule-appointment.dto.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env
├── .env.example
└── .gitignore
```

## Files Modified (Phase 2)
- `src/app.module.ts` — added DoctorsModule + AppointmentsModule imports
- `src/users/users.module.ts` — added exports: [UsersService]
- `src/auth/auth.module.ts` — added DoctorsModule import
- `src/auth/auth.service.ts` — added DoctorsService injection + auto doctor profile creation

---

## Installed Packages

### Runtime
```
@nestjs/mongoose mongoose
@nestjs/jwt @nestjs/passport passport passport-jwt
bcrypt class-validator class-transformer
@nestjs/swagger swagger-ui-express
@nestjs/config
```

### Dev
```
@types/passport-jwt @types/bcrypt
```

> No new packages added in Phase 2.

---

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /auth/register | None | Any | Register PATIENT or DOCTOR |
| POST | /auth/login | None | Any | Login, returns JWT |
| GET | /auth/profile | JWT | Any | Get logged-in user info |
| GET | /doctors | None | Any | List all available doctors |
| GET | /doctors/search | None | Any | Search by name / specialization |
| GET | /doctors/:id | None | Any | Get doctor by ID |
| PATCH | /doctors/profile | JWT | DOCTOR | Update own doctor profile |
| POST | /appointments | JWT | PATIENT | Book appointment |
| GET | /appointments/my-appointments | JWT | PATIENT | View own appointments |
| GET | /appointments/doctor | JWT | DOCTOR | View assigned appointments |
| PATCH | /appointments/:id/confirm | JWT | DOCTOR | Confirm appointment |
| PATCH | /appointments/:id/cancel | JWT | DOCTOR | Cancel appointment |
| PATCH | /appointments/:id/reschedule | JWT | DOCTOR | Reschedule appointment |

Swagger UI: `http://localhost:3000/api/docs`

---

## Database Collections

### `users`
```ts
{
  _id: ObjectId,
  fullName: string,
  email: string (unique, lowercase),
  password: string (bcrypt hashed),
  role: 'PATIENT' | 'DOCTOR',
  createdAt: Date,
  updatedAt: Date
}
```

### `doctors`
```ts
{
  _id: ObjectId,
  userId: ObjectId (ref: users, unique),
  specialization: string,
  experience: number,
  qualification: string,
  consultationFee: number,
  about: string,
  isAvailable: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `appointments`
```ts
{
  _id: ObjectId,
  patientId: ObjectId (ref: users),
  doctorId: ObjectId (ref: doctors),
  appointmentDate: Date,
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED',
  reason: string,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Important Decisions

### Architecture
- `password` field excluded via `.select('-password')` + `.lean()`
- JWT payload: `{ sub: userId, email, role }`
- Both PATIENT and DOCTOR share the `users` collection (differentiated by `role`)
- Doctor profile is a **separate collection** (`doctors`) linked to `users` via `userId` — keeps concerns clean, easy to extend
- Doctor profile auto-created (empty) when a DOCTOR registers — no separate setup step needed
- `whitelist: true` on ValidationPipe strips extra fields

### Role-Based Access Control
- `RolesGuard` reads `@Roles()` metadata and compares against `req.user.role`
- Applied per-route with `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.X)`
- Doctor-only and Patient-only routes enforced at controller level

### Debouncing (Frontend — Phase 3)
- `GET /doctors/search` is a public API with no server-side rate limiting yet
- Frontend must debounce the search input by **400ms** before calling this API
- Implemented using a custom `useDebounce` hook OR `lodash.debounce` in React
- This prevents firing one API call per keystroke (e.g. typing "Cardio" = 6 calls → 1 call after pause)

### Validation Rules Enforced
- Appointment date must be in the future (BadRequestException if not)
- Doctor must exist and be available
- Duplicate appointment: same patient + doctor + within 1-hour window = blocked
- Doctor can only confirm/cancel/reschedule their own appointments (ownership check)
- Status transitions enforced: can't confirm COMPLETED, can't cancel CANCELLED, etc.

### Route Order
- `GET /doctors/search` declared BEFORE `GET /doctors/:id` to prevent "search" being treated as an ID

---

## Pending Tasks
- [ ] Phase 3: React + Vite frontend setup
- [ ] Phase 3: Auth pages (Register with role select, Login)
- [ ] Phase 3: Axios instance with JWT interceptor
- [ ] Phase 3: TanStack React Query integration
- [ ] Phase 3: Doctor listing + search page (with debounce hook)
- [ ] Phase 3: Doctor detail page
- [ ] Phase 3: Patient appointment booking flow
- [ ] Phase 3: Patient appointments list page
- [ ] Phase 3: Doctor appointments dashboard
- [ ] Phase 3: Doctor profile update page
- [ ] Future: Prescription Management
- [ ] Future: Diagnosis Management
- [ ] Future: Treatment Plans
- [ ] Future: Doctor Reviews
- [ ] Future: Demo Payment System

---

## Next Session Goal
**Phase 3 — React Frontend**

Set up React (Vite) frontend with:
- React Router DOM (protected routes by role)
- Axios instance with JWT Bearer interceptor
- TanStack React Query for all API calls
- React Hook Form for all forms
- Pages: Register, Login
- Pages: Doctor List (with debounced search), Doctor Detail
- Pages: Book Appointment, My Appointments (patient)
- Pages: Doctor Appointments, Confirm/Cancel/Reschedule (doctor)
- Doctor profile update form
