# Acquisitions API

A modern and scalable Node.js API project. This backend application is developed using best practices and cutting-edge technologies to provide a robust foundation for acquisition management systems.

## 🚀 Features

- **Modern JavaScript** - Built with ES6+ features and modern ECMAScript patterns
- **Powerful ORM** - Type-safe database operations with Drizzle ORM
- **Advanced Security** - Rate limiting and protection with Arcjet
- **Docker Integration** - Development and production-ready Docker configurations
- **Comprehensive Logging** - Structured logging with Winston
- **Serverless Database** - Neon Serverless Postgres with local development support
- **API Security** - Enhanced security with Helmet middleware
- **Authentication** - JWT-based authentication with role-based access control
- **Input Validation** - Request validation using Zod schemas
- **Error Handling** - Centralized error handling and standardized responses

## 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/mr-isik/acquisitions.git
cd acquisitions
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set up Environment Variables**

```bash
cp .env.example .env
# Edit the .env file
```

4. **Docker Compose for Development**

```bash
docker compose -f docker-compose.dev.yml up --build
```

5. **Database Migration**

```bash
npm run db:migrate
```

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

### Lint Check

```bash
npm run lint
```

### Lint Fix

```bash
npm run lint:fix
```

## 🚀 Production

### Production Build

```bash
npm run build
```

### Production Deployment

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

### User Operations

#### Get All Users

```http
GET /users
```

#### Get Single User

```http
GET /users/:id
```

#### Create New User

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### Update User

```http
PUT /users/:id
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "admin"
}
```

#### Delete User

```http
DELETE /users/:id
```

## 🔒 Security

- Security headers with Helmet
- Role-based rate limiting
- Bot detection
- CORS configuration
- Cookie security

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=3000
DB_URL=postgres://user:password@localhost:5432/dbname
ARCJET_KEY=your-arcjet-key
```

## 🛡️ Rate Limiting

Rate limiting based on user roles:

- Admin: 20 req/min
- User: 10 req/min
- Guest: 5 req/min
- Unauthorized: 5 req/min

## 🐳 Docker

Separate Docker configurations for development and production:

- `Dockerfile` - Main application container
- `docker-compose.dev.yml` - Development environment (including Neon Local)
- `docker-compose.prod.yml` - Production environment

## 📁 Project Structure

```
acquisitions/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Helper functions
│   ├── validations/   # Input validation
│   └── app.js         # Express app configuration
├── drizzle/           # Database migrations
├── logs/             # Log files
└── docker/           # Docker configurations
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
