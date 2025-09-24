<div align="center">
  <img src="src/assets/logo.svg" alt="Acquisitions API Logo" width="400">
</div>

# Postify API

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
- **Content Management** - Blog-style posts with slug-based URLs and pagination
- **Role-Based Access** - Admin-only content management operations

## 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/mr-isik/postify.git
cd postify
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

### Comment Operations

#### Get Comments for a Post

```http
GET /posts/:id/comments?page=1&limit=10
```

Response:

```json
{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "id": 1,
      "postId": 1,
      "content": "Great post!",
      "author": "John Doe",
      "createdAt": "2025-09-24T10:00:00Z",
      "updatedAt": "2025-09-24T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Add Comment to Post

```http
POST /posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a comment"
}
```

Response:

```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "postId": 1,
    "content": "This is a comment",
    "authorId": 1,
    "createdAt": "2025-09-24T10:00:00Z",
    "updatedAt": "2025-09-24T10:00:00Z"
  }
}
```

#### Update Comment

```http
PUT /posts/:id/comments/:commentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

Response:

```json
{
  "message": "Comment updated successfully",
  "comment": {
    "id": 1,
    "postId": 1,
    "content": "Updated comment content",
    "authorId": 1,
    "createdAt": "2025-09-24T10:00:00Z",
    "updatedAt": "2025-09-24T10:00:00Z"
  }
}
```

#### Delete Comment

```http
DELETE /posts/:id/comments/:commentId
Authorization: Bearer <token>
```

Response:

```json
{
  "message": "Comment deleted successfully"
}
```

Validation:

- content: 2-500 characters
- Authentication required for adding, updating, and deleting comments
- Users can only update/delete their own comments

### Post Operations

#### Get All Posts (with Pagination)

```http
GET /posts?page=1&limit=10
```

Response:

```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Sample Post",
    "slug": "sample-post",
    "content": "Post content here...",
    "createdAt": "2025-09-24T10:00:00Z",
    "updatedAt": "2025-09-24T10:00:00Z"
  }
]
```

#### Get Post by Slug

```http
GET /posts/:slug
```

Response:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Sample Post",
  "slug": "sample-post",
  "content": "Post content here...",
  "createdAt": "2025-09-24T10:00:00Z",
  "updatedAt": "2025-09-24T10:00:00Z"
}
```

#### Create New Post (Admin Only)

```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Post Title",
  "slug": "new-post-title",
  "content": "Post content goes here..."
}
```

Validation:

- title: 3-200 characters
- content: Minimum 10 characters
- slug: 3-200 characters (optional, will be generated from title if not provided)

#### Update Post (Admin Only)

```http
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Post Title",
  "slug": "updated-post-title",
  "content": "Updated content goes here..."
}
```

All fields are optional in update operation.

#### Delete Post (Admin Only)

```http
DELETE /posts/:id
Authorization: Bearer <token>
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
postify/
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
