# Hospital Appointment Management System

## Current Phase
Phase 1 — Backend Authentication (COMPLETE)

---

## Completed Features
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

---

## Files Created
```
hospital-appointment-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   └── enums/
│   │       └── role.enum.ts
│   ├── config/
│   │   └── jwt.config.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   └── auth/
│       ├── auth.module.ts
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── strategies/
│       │   └── jwt.strategy.ts
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       └── dto/
│           ├── register.dto.ts
│           └── login.dto.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env
├── .env.example
└── .gitignore
```

## Files Modified
- None (fresh project)

## Root Config Files
- `package.json` — all runtime + dev dependencies with versions
- `tsconfig.json` — TypeScript config with decorators enabled
- `tsconfig.build.json` — extends tsconfig, excludes test/dist
- `nest-cli.json` — NestJS CLI config, sourceRoot set to `src`
- `.env` — active env file (copy of .env.example, not committed)
- `.env.example` — template with `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`
- `.gitignore` — ignores `node_modules/`, `dist/`, `.env`, logs, IDE files

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

---

## API Endpoints Added

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | None | Register PATIENT or DOCTOR |
| POST | /auth/login | None | Login, returns JWT |
| GET | /auth/profile | JWT Bearer | Get logged-in user info |

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

---

## Important Decisions
- `password` field excluded from `findById()` response using `.select('-password')`
- JWT payload: `{ sub: userId, email, role }`
- Both PATIENT and DOCTOR use the same users collection (differentiated by `role`)
- `whitelist: true` on ValidationPipe strips any extra fields sent by client
- JWT secret loaded from `.env` via `jwtConfig` (not hardcoded)
- `jwtConfig` reads from `process.env` directly (loaded by ConfigModule before use)

---

## Pending Tasks
- [ ] Phase 2: React + Vite frontend setup
- [ ] Phase 2: Auth pages (Register, Login)
- [ ] Phase 2: Axios + React Query integration
- [ ] Phase 2: Protected routes on frontend
- [ ] Future: Appointment Booking module
- [ ] Future: Prescription Management
- [ ] Future: Diagnosis Management
- [ ] Future: Treatment Plans
- [ ] Future: Doctor Reviews
- [ ] Future: Dashboard
- [ ] Future: Demo Payment System
- [ ] Future: Debouncing & Throttling

---

## Next Session Goal
**Phase 2 — Frontend Authentication**

Set up React (Vite) frontend with:
- React Router DOM for routing
- Axios instance with JWT interceptor
- TanStack React Query for server state
- React Hook Form for forms
- Register page (role selection: PATIENT / DOCTOR)
- Login page
- Protected dashboard placeholder
- Logout functionality
