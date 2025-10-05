# 🚀 Better Template

Modern, production-ready **Node.js + TypeScript + Express + Better Auth + Prisma** template with best practices and enterprise-grade architecture.

## ✨ Features

- 🔐 **Better Auth** - Modern authentication with email/password, OAuth, and session management
- 🗄️ **Prisma ORM** - Type-safe database access with PostgreSQL
- ⚡ **TypeScript** - Full type safety with strict mode
- 🛡️ **Security** - Helmet, CORS, express-rate-limit, input validation
- ✅ **Zod Validation** - Runtime type checking and validation
- 📝 **Clean Architecture** - Layered design (Controller → Service → Database)
- 🔄 **Environment Validation** - Type-safe env variables with Zod
- 🚦 **Rate Limiting** - IP-based rate limiting with configurable rules
- 🎯 **Error Handling** - Centralized error handling with custom error classes
- 📊 **Request Logging** - Built-in request logger
- 🔄 **Graceful Shutdown** - Proper cleanup on server shutdown
- 🎨 **Code Organization** - Modular structure with clear separation of concerns

## 📋 Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/better-template.git
cd better-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database (update with your credentials)
DATABASE_URL="postgresql://user:password@localhost:5432/better_template?schema=public"

# Auth (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secure-random-string-at-least-32-characters-long"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# Optional: Rate Limiting
API_RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

### 4. Setup database

```bash
# Create database and run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 5. Run the server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will be running at `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Auth Endpoints

#### Sign Up

```http
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response:** User object + session token  
✅ **Cookie `better-auth.session_token` automatically set**

#### Other Auth Endpoints

- `POST /api/auth/sign-in/email` - Sign in
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/sign-out` - Sign out (clears cookie)
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Other Endpoints

#### Health Check

```http
GET /health
```

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🏗️ Project Structure

```
better-template/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   ├── client.ts              # Prisma client instance
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   └── validate-env.ts    # Environment validation with Zod
│   ├── controllers/
│   │   └── user.controller.ts # User request handlers
│   ├── middleware/
│   │   ├── auth-guard.ts      # Auth middleware
│   │   ├── cors.ts            # CORS configuration
│   │   ├── error-handler.ts   # Error handling middleware
│   │   ├── rate-limit.ts      # Rate limiting middleware
│   │   ├── request-logger.ts  # Request logging
│   │   └── validate-request.ts # Zod validation middleware
│   ├── routes/
│   │   ├── user.routes.ts     # User routes (includes auth)
│   │   └── index.ts           # Routes aggregation
│   ├── schemas/
│   │   ├── auth.schema.ts     # Auth validation schemas
│   │   ├── user.schema.ts     # User validation schemas
│   │   ├── common.schema.ts   # Common validation schemas
│   │   └── index.ts           # Schema exports
│   ├── services/
│   │   └── user.service.ts    # User business logic
│   ├── types/
│   │   └── user-select-type.ts # Type definitions
│   ├── app.ts                 # Express app configuration
│   ├── auth.ts                # Better Auth configuration
│   └── index.ts               # Server entry point
├── generated/
│   └── prisma/                # Generated Prisma client
├── .env                       # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

All environment variables are validated using Zod. See `src/config/validate-env.ts` for the complete schema.

**Required:**

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for Better Auth (min 32 characters)

**Optional:**

- `NODE_ENV` - Environment mode (development/production/test)
- `PORT` - Server port (default: 3000)
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)
- `REDIS_URL` - Redis URL for distributed rate limiting
- `LOG_LEVEL` - Logging level (error/warn/info/http/debug)
- `API_RATE_LIMIT_MAX` - API rate limit (default: 100/min)
- `AUTH_RATE_LIMIT_MAX` - Auth rate limit (default: 5/15min)

**Social Auth (Optional):**

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

**Email (Optional):**

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

### Rate Limiting

Uses `express-rate-limit` for robust rate limiting.

Default rate limits:

- **Auth endpoints:** 5 requests per 15 minutes (prevents brute force)
- **API endpoints:** 100 requests per minute (prevents API abuse)
- **Strict endpoints:** 10 requests per minute (sensitive operations)

Configure via environment variables:

```env
API_RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

**For production with multiple servers**, use Redis store:

```bash
npm install rate-limit-redis ioredis
```

See `src/middleware/rate-limit.ts` for Redis configuration example.

### CORS

- **Development:** Allows all origins (`*`)
- **Production:** Uses `ALLOWED_ORIGINS` from environment

## 🛡️ Security Features

- ✅ **Helmet** - Sets secure HTTP headers
- ✅ **CORS** - Configurable cross-origin resource sharing
- ✅ **Rate Limiting** - IP-based request limiting
- ✅ **Input Validation** - Zod schema validation
- ✅ **Password Requirements** - Min 8 chars, uppercase, lowercase, number
- ✅ **Session Management** - Database-backed sessions (revocable)
- ✅ **Graceful Shutdown** - Proper cleanup on termination

## 📝 Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Prisma
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:push      # Push schema to DB (no migration)

# Testing
npm test                 # Run tests (TODO)
```

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and structure.

## 📄 License

ISC

## 🙏 Acknowledgments

- [Better Auth](https://github.com/better-auth/better-auth) - Modern authentication library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting middleware

## 📧 Contact

Project Link: [https://github.com/ismetcanbyk/better-template](https://github.com/ismetcanbyk/better-template)

---

Made with ❤️ using Better Auth, Prisma, and TypeScript
