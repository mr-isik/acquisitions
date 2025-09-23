# Architecture Document

## System Architecture

### 1. High-Level Overview

This is a **RESTful API backend service** built with Node.js and Express.js, designed to handle "acquisitions" management with user authentication and authorization capabilities.

### Problem It Solves

The system provides a secure, scalable foundation for managing acquisition-related workflows with:

- User registration and authentication
- Role-based access control (user/admin)
- Secure data persistence
- Comprehensive logging and monitoring
- Production-ready security measures

## 2. **Core Architecture**

This application follows a **Layered Architecture Pattern** (also known as N-Tier Architecture), with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                   (External Applications)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                    ├── Routes (Express)                      │
│                    └── Middleware Stack                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│                    ├── Controllers                           │
│                    ├── Services                              │
│                    └── Validations (Zod)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│                    ├── Models (Drizzle ORM)                  │
│                    └── Database Config                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│                  (Neon PostgreSQL Cloud)                     │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
acquisitions/
├── src/
│   ├── index.js         # Application entry point
│   ├── server.js        # Server configuration
│   ├── app.js           # Express app setup
│   ├── config/          # Configuration modules
│   │   ├── db.js        # Database connection
│   │   └── logger.js    # Winston logger setup
│   ├── controllers/     # Request handlers
│   │   └── auth.controller.js
│   ├── services/        # Business logic
│   │   └── auth.service.js
│   ├── models/          # Database schemas
│   │   └── user.model.js
│   ├── routes/          # API endpoints
│   │   └── auth.routes.js
│   ├── validations/     # Input validation schemas
│   │   └── auth.validation.js
│   └── utils/           # Helper utilities
│       ├── jwt.js       # JWT token management
│       ├── cookies.js   # Cookie utilities
│       └── format.js    # Error formatting
├── drizzle/             # Database migrations
│   ├── meta/            # Migration metadata
│   └── *.sql            # SQL migration files
└── logs/                # Application logs
```

## 3. **Key Components**

### Entry & Server Setup

- **`index.js`**: Minimal entry point that loads environment variables and imports the server
- **`server.js`**: Creates HTTP server listening on configured port
- **`app.js`**: Core Express application setup with middleware chain

### Middleware Stack (Order Matters!)

1. **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
2. **CORS**: Cross-Origin Resource Sharing configuration
3. **Cookie Parser**: Parse Cookie headers
4. **Body Parsers**: JSON and URL-encoded request bodies
5. **Morgan**: HTTP request logging integrated with Winston

### Authentication System

- **Controller** (`auth.controller.js`): Handles HTTP requests, validation, responses
- **Service** (`auth.service.js`): Business logic for user creation, password hashing
- **Validation** (`auth.validation.js`): Zod schemas for input validation
- **JWT Utility** (`jwt.js`): Token signing and verification
- **Cookie Utility** (`cookies.js`): Secure cookie management with environment-aware settings

### Database Layer

- **ORM**: Drizzle ORM for type-safe database queries
- **Provider**: Neon serverless PostgreSQL
- **Migrations**: Version-controlled schema changes in `drizzle/` folder
- **Models**: TypeScript-like schema definitions with Drizzle's API

### Logging Infrastructure

- **Winston Logger**: Structured JSON logging with multiple transports
- **File Transports**: Separate error.log and combined.log files
- **Console Transport**: Colorized output in development
- **Request Logging**: Morgan middleware pipes to Winston

## 4. **Data Flow & Communication**

### Registration Flow Example

```
CLIENT                                    SERVER
  │                                          │
  ├──[1]── POST /api/auth/register ─────────►│
  │         {name, email, password, role}    │
  │                                          │
  │                                    ┌─────▼─────┐
  │                                    │  Router   │
  │                                    └─────┬─────┘
  │                                          │
  │                                    ┌─────▼─────┐
  │                                    │Controller │
  │                                    │  ├─[2]─►  │ Validation (Zod)
  │                                    │  ◄─[3]──  │
  │                                    └─────┬─────┘
  │                                          │
  │                                    ┌─────▼─────┐
  │                                    │  Service  │
  │                                    │  ├─[4]─►  │ Check existing user
  │                                    │  ├─[5]─►  │ Hash password (bcrypt)
  │                                    │  ├─[6]─►  │ Insert to DB (Drizzle)
  │                                    │  ◄─[7]──  │ Return new user
  │                                    └─────┬─────┘
  │                                          │
  │                                    ┌─────▼─────┐
  │                                    │Controller │
  │                                    │  ├─[8]─►  │ Generate JWT
  │                                    │  ├─[9]─►  │ Set cookie
  │                                    └─────┬─────┘
  │                                          │
  │◄──[10]─ 201 Created ─────────────────────┤
  │         {user, message}                  │
  │         + Set-Cookie header              │
```

### Component Interactions

1. **Routes → Controllers**: Direct function import and route binding
2. **Controllers → Services**: Async function calls for business logic
3. **Services → Database**: Drizzle ORM queries through db instance
4. **Controllers → Utils**: JWT signing, cookie setting, error formatting
5. **All Components → Logger**: Centralized logging for debugging and monitoring

## 5. **Tech Stack & Dependencies**

### Core Framework

- **Express v5**: Modern web framework with async error handling
- **Node.js**: ES modules enabled (`"type": "module"`)

### Security Layer

- **Helmet**: Security headers middleware
- **CORS**: Cross-origin request handling
- **bcryptjs**: Password hashing (10 salt rounds)
- **jsonwebtoken**: JWT authentication

### Database Stack

- **Drizzle ORM**: Type-safe SQL query builder
- **Neon Database**: Serverless PostgreSQL
- **drizzle-kit**: Migration and studio tools

### Validation & Utilities

- **Zod**: Schema validation with TypeScript-like API
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **dotenv**: Environment variable management

### Development Tools

- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Node --watch**: Built-in file watching for development

## 6. **Execution Flow**

### Startup Sequence

1. `index.js` loads environment variables via dotenv
2. Imports `server.js` which imports the Express app
3. Express app configures middleware in specific order
4. Routes are mounted on the app
5. Server starts listening on configured PORT

### Request Lifecycle

```
1. Request arrives → Express middleware chain
2. Security headers applied (Helmet)
3. CORS validation
4. Cookie parsing
5. Body parsing (JSON/URL-encoded)
6. Request logging (Morgan → Winston)
7. Route matching
8. Controller invoked
9. Input validation (Zod)
10. Service layer processing
11. Database operations (if needed)
12. Response generation
13. Cookie setting (if auth-related)
14. Response sent with appropriate status code
```

### Error Flow

- Validation errors → 400 Bad Request with formatted messages
- Duplicate user → 400 Bad Request with specific message
- Unexpected errors → Logged and passed to Express error handler
- All errors logged via Winston for debugging

## 7. **Strengths & Tradeoffs**

### Strengths ✅

- **Clean Architecture**: Clear separation between layers makes the code maintainable
- **Type Safety**: Zod validation + Drizzle ORM provide runtime and development-time safety
- **Security First**: Multiple security layers (Helmet, httpOnly cookies, password hashing)
- **Modern Stack**: Latest versions of Express, ES modules, native Node.js features
- **Scalable**: Serverless database, stateless authentication (JWT)
- **Developer Experience**: Hot reload, structured logging, consistent error handling
- **Production Ready**: Environment-specific configurations, comprehensive logging

### Tradeoffs & Considerations ⚠️

- **No Middleware Directory**: Auth middleware not yet implemented (placeholder for protected routes)
- **Limited Endpoints**: Only registration implemented, login/logout are placeholders
- **Cookie Duration**: 15-minute cookies might be too short for some use cases
- **No Rate Limiting**: Missing protection against brute force attacks
- **No Input Sanitization**: Beyond Zod validation, no XSS protection on inputs
- **Single Database**: No read replicas or caching layer for scale
- **Synchronous Password Hashing**: Could block event loop under high load

### Watch Out For 🔍

- The service layer has a bug: `existingUser` check doesn't await the database query
- JWT secret defaults to insecure value if not set in environment
- No database connection pooling configuration
- Missing transaction support for complex operations
- No API versioning strategy

## 8. **Final Summary**

**In 3 sentences**: This is a Node.js/Express REST API with a layered architecture that handles user authentication using JWT tokens stored in secure cookies, with all data persisted to a Neon PostgreSQL database via Drizzle ORM. The codebase follows modern JavaScript practices with ES modules, comprehensive validation using Zod, and production-ready security measures including bcrypt password hashing and Helmet middleware. While currently focused on authentication, the clean separation of concerns (routes → controllers → services → models) makes it easy to extend with additional business logic for acquisition management features.

## Quick Start Commands

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # (create this file with your values)

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# View database in browser
npm run db:studio
```

## Example API Usage

### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "user"
  }'
```

### Response

```json
{
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "id": 1
  }
}
```

Plus a `Set-Cookie` header with the JWT token.
