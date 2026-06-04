# Hospital Appointment Management System

## Current Phase
Phase 3 — Backend Modules (COMPLETE)

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
- [x] GET /doctors/:id — view single doctor by MongoDB _id
- [x] PATCH /doctors/profile — doctor updates own profile (DOCTOR only)
- [x] GET /doctors/search?name=&specialization= — search doctors
- [x] Appointment schema with status enum
- [x] POST /appointments — book appointment (PATIENT only)
- [x] GET /appointments/my-appointments — patient's own appointments
- [x] GET /appointments/doctor — doctor's appointments (DOCTOR only)
- [x] PATCH /appointments/:id/confirm — confirm (DOCTOR only)
- [x] PATCH /appointments/:id/cancel — cancel (DOCTOR only)
- [x] PATCH /appointments/:id/reschedule — reschedule (DOCTOR only)

### Phase 3 (Backend Modules)
- [x] Prescription schema + service + controller + module
- [x] POST /prescriptions — create (DOCTOR only, appointment must be COMPLETED)
- [x] GET /prescriptions/patient — patient's own prescriptions (PATIENT only)
- [x] GET /prescriptions/:id — get by ID (patient sees own only)
- [x] Review schema with unique compound index (one review per patient per doctor)
- [x] POST /reviews — submit review (PATIENT only)
- [x] GET /reviews/doctor/:doctorId — get reviews for a doctor (public)
- [x] Demo Payment schema (status always SUCCESS)
- [x] POST /payments/pay — make demo payment (PATIENT only)
- [x] GET /payments/history — payment history (PATIENT only)
- [x] GET /dashboard/patient — patient dashboard summary
- [x] GET /dashboard/doctor — doctor dashboard summary

---

## Bugs Fixed
- `doctor.schema.ts` — removed `required: true` from profile fields; all default to empty / 0
- `users.service.ts` — `findById()` return type → `Promise<any>` + `.lean()` for type safety

---

## Files

```
hospital-appointment-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/roles.decorator.ts
│   │   ├── enums/
│   │   │   ├── role.enum.ts
│   │   │   └── appointment-status.enum.ts
│   │   └── guards/roles.guard.ts
│   ├── config/jwt.config.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/jwt.strategy.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── schemas/user.schema.ts
│   │   └── dto/create-user.dto.ts
│   ├── doctors/
│   │   ├── doctors.module.ts
│   │   ├── doctors.service.ts
│   │   ├── doctors.controller.ts
│   │   ├── schemas/doctor.schema.ts
│   │   └── dto/update-doctor.dto.ts
│   ├── appointments/
│   │   ├── appointments.module.ts
│   │   ├── appointments.service.ts
│   │   ├── appointments.controller.ts
│   │   ├── schemas/appointment.schema.ts
│   │   └── dto/
│   │       ├── create-appointment.dto.ts
│   │       └── reschedule-appointment.dto.ts
│   ├── prescriptions/
│   │   ├── prescriptions.module.ts
│   │   ├── prescriptions.service.ts
│   │   ├── prescriptions.controller.ts
│   │   ├── schemas/prescription.schema.ts
│   │   └── dto/create-prescription.dto.ts
│   ├── reviews/
│   │   ├── reviews.module.ts
│   │   ├── reviews.service.ts
│   │   ├── reviews.controller.ts
│   │   ├── schemas/review.schema.ts
│   │   └── dto/create-review.dto.ts
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.service.ts
│   │   ├── payments.controller.ts
│   │   ├── schemas/payment.schema.ts
│   │   └── dto/create-payment.dto.ts
│   └── dashboard/
│       ├── dashboard.module.ts
│       ├── dashboard.service.ts
│       └── dashboard.controller.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env
├── .env.example
├── .gitignore
└── PROJECT_CONTEXT.md
```

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

> No new packages added in Phase 3.

---

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /auth/register | None | Any | Register PATIENT or DOCTOR |
| POST | /auth/login | None | Any | Login, returns JWT |
| GET | /auth/profile | JWT | Any | Get logged-in user info |
| GET | /doctors | None | Any | List all available doctors |
| GET | /doctors/search | None | Any | Search by name / specialization |
| GET | /doctors/:id | None | Any | Get doctor by MongoDB _id |
| PATCH | /doctors/profile | JWT | DOCTOR | Update own doctor profile |
| POST | /appointments | JWT | PATIENT | Book appointment |
| GET | /appointments/my-appointments | JWT | PATIENT | View own appointments |
| GET | /appointments/doctor | JWT | DOCTOR | View assigned appointments |
| PATCH | /appointments/:id/confirm | JWT | DOCTOR | Confirm appointment |
| PATCH | /appointments/:id/cancel | JWT | DOCTOR | Cancel appointment |
| PATCH | /appointments/:id/reschedule | JWT | DOCTOR | Reschedule appointment |
| POST | /prescriptions | JWT | DOCTOR | Create prescription (appt must be COMPLETED) |
| GET | /prescriptions/patient | JWT | PATIENT | View own prescriptions |
| GET | /prescriptions/:id | JWT | Any | Get prescription by ID |
| POST | /reviews | JWT | PATIENT | Submit doctor review (1 per doctor) |
| GET | /reviews/doctor/:doctorId | None | Any | Get reviews for a doctor |
| POST | /payments/pay | JWT | PATIENT | Demo payment for appointment |
| GET | /payments/history | JWT | PATIENT | View payment history |
| GET | /dashboard/patient | JWT | PATIENT | Patient dashboard summary |
| GET | /dashboard/doctor | JWT | DOCTOR | Doctor dashboard summary |

Swagger UI: `http://localhost:3000/api/docs`

---

## Database Collections

### `users`
```ts
{ _id, fullName, email, password(hashed), role: 'PATIENT'|'DOCTOR', createdAt, updatedAt }
```

### `doctors`
```ts
{ _id, userId(ref:users,unique), specialization(default:''), experience(default:0),
  qualification(default:''), consultationFee(default:0), about(default:''),
  isAvailable(default:true), createdAt, updatedAt }
```

### `appointments`
```ts
{ _id, patientId(ref:users), doctorId(ref:doctors), appointmentDate, 
  status('PENDING'|'CONFIRMED'|'COMPLETED'|'CANCELLED'|'RESCHEDULED'),
  reason, notes(default:''), createdAt, updatedAt }
```

### `prescriptions`
```ts
{ _id, appointmentId(ref:appointments), patientId(ref:users), doctorId(ref:doctors),
  diagnosis, prescription, treatmentPlan(default:''), createdAt, updatedAt }
```

### `reviews`
```ts
{ _id, doctorId(ref:doctors), patientId(ref:users), rating(1-5), comment(default:''),
  createdAt, updatedAt }
// Unique index: { doctorId, patientId }
```

### `payments`
```ts
{ _id, appointmentId(ref:appointments), patientId(ref:users), amount,
  status(default:'SUCCESS'), paymentMethod('CARD'|'UPI'|'NET_BANKING'|'CASH'),
  paidAt, createdAt, updatedAt }
```

---

## Important Decisions

### Architecture
- JWT payload: `{ sub: userId, email, role }`
- `password` excluded via `.select('-password')` + `.lean()`
- Both roles share `users` collection, differentiated by `role`
- Doctor profile auto-created (empty defaults) when a DOCTOR registers
- `whitelist: true` on ValidationPipe strips extra fields

### Role-Based Access Control
- `RolesGuard` reads `@Roles()` metadata vs `req.user.role`
- Applied with `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.X)`

### Business Rules
- Appointment: future date only, doctor must exist & be available, no duplicate within 1hr window
- Prescription: appointment must be COMPLETED, doctor must own the appointment, one per appointment
- Review: 1-5 rating, unique index prevents duplicate reviews per patient per doctor
- Payment: demo only (always SUCCESS), patient must own appointment, one payment per appointment
- Dashboard: parallel queries via `Promise.all()` for efficiency

### Route Order (prevents param conflicts)
- `GET /doctors/search` before `GET /doctors/:id`
- `GET /prescriptions/patient` before `GET /prescriptions/:id`

### Frontend Debouncing (Phase 4)
- `GET /doctors/search` has no server-side rate limiting
- Frontend must debounce search input by **400ms**

---

## Pending Tasks
- [ ] Phase 4: React + Vite frontend setup
- [ ] Phase 4: Auth pages (Register with role select, Login)
- [ ] Phase 4: Axios instance with JWT Bearer interceptor
- [ ] Phase 4: TanStack React Query integration
- [ ] Phase 4: Doctor listing + search (debounced), Doctor Detail + Reviews
- [ ] Phase 4: Patient — Book Appointment, My Appointments, Prescriptions, Payments, Dashboard
- [ ] Phase 4: Doctor — Appointments, Confirm/Cancel/Reschedule, Profile Update, Dashboard

---

## Next Session Goal
**Phase 4 — React Frontend**

Set up React (Vite) frontend with:
- React Router DOM (protected routes by role)
- Axios instance with JWT Bearer interceptor
- TanStack React Query for all API calls
- React Hook Form for all forms
- Tailwind CSS for styling
- Pages: Register, Login
- Pages: Doctor List (debounced search), Doctor Detail + Reviews
- Pages: Book Appointment, My Appointments, Prescriptions, Payments (patient)
- Pages: Doctor Appointments dashboard, Confirm/Cancel/Reschedule, Profile Update (doctor)
- Patient Dashboard page + Doctor Dashboard page
