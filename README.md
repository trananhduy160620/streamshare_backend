# StreamShare Backend API

A modern RESTful API for a media sharing platform with rating system, built with Deno and Oak framework.

## 🚀 Tech Stack

### **Backend Framework**
- **Deno** - Secure JavaScript/TypeScript runtime
- **Oak** - Expressive middleware framework for Deno
- **PostgreSQL** - Primary database with advanced features

### **Core Dependencies**
- **oak_cors** - Cross-Origin Resource Sharing middleware
- **http-status-codes** - HTTP status code constants
- **bcrypt** - Password hashing for authentication
- **jsonwebtoken** - JWT token generation and verification
- **zod** - Schema validation for API inputs

### **Development Tools**
- **Deno Linter** - Code quality and style checking
- **ES Modules** - Modern JavaScript module system

## 🏗️ Architecture

### **Layered Architecture Pattern**
```
┌─────────────────────────────────────┐
│              API Layer               │
│         (Controllers & Routes)       │
├─────────────────────────────────────┤
│            Business Layer            │
│           (Services)                 │
├─────────────────────────────────────┤
│             Data Layer               │
│         (Queries & Database)         │
├─────────────────────────────────────┤
│            Utility Layer             │
│        (Utils & Middleware)          │
└─────────────────────────────────────┘
```

### **Core Design Principles**
- **Separation of Concerns** - Clear distinction between layers
- **Dependency Injection** - Clean service dependencies
- **Error Handling** - Centralized error management
- **Validation First** - Input validation before processing
- **Security by Default** - Authentication and authorization

## 📁 Folder Structure

```
StreamShareBE/
├── src/
│   ├── cores/                    # Core configurations
│   │   └── config/
│   │       └── postgresql.config.js    # Database connection
│   ├── features/                 # Feature modules
│   │   ├── media/               # Media management
│   │   │   ├── media.controller.js     # Media API endpoints
│   │   │   ├── media.service.js         # Media business logic
│   │   │   ├── media.query.js          # Media database queries
│   │   │   ├── media.router.js         # Media routing
│   │   │   └── media.validation.js     # Media input validation
│   │   ├── ratings/             # Rating system
│   │   │   ├── rating.controller.js    # Rating API endpoints
│   │   │   ├── rating.service.js      # Rating business logic
│   │   │   ├── rating.query.js         # Rating database queries
│   │   │   ├── rating.router.js        # Rating routing
│   │   │   └── rating.validation.js    # Rating input validation
│   │   └── users/               # User management
│   │       ├── user.controller.js      # User API endpoints
│   │       ├── user.service.js         # User business logic
│   │       ├── user.query.js            # User database queries
│   │       ├── user.router.js          # User routing
│   │       └── user.validation.js       # User input validation
│   ├── middlewares/              # Custom middleware
│   │   ├── auth.middleware.js          # JWT authentication
│   │   └── base.middleware.js          # Base middleware functions
│   ├── routers/                  # Route aggregation
│   │   └── index.js                     # Main router configuration
│   └── utils/                    # Utility functions
│       ├── brcypt.utils.js             # Password hashing
│       ├── jwt.utils.js                # JWT token management
│       ├── logger.utils.js             # Logging utility
│       ├── parse.utils.js              # Form parsing
│       ├── parseYoutubeVideoId.utils.js # YouTube ID extraction
│       ├── response.utils.js            # API response formatting
│       ├── router.utils.js             # Router registration
│       └── transformMedia.utils.js     # Media data transformation
├── app.js                         # Application entry point
├── deno.json                      # Deno configuration
└── README.md                      # This file
```

## 🎯 Core Functions

### **User Management**
- **Authentication** - JWT-based secure authentication
- **Registration** - User signup with password hashing
- **Profile Management** - User profile CRUD operations
- **Score Summary** - Comprehensive user statistics

### **Media Management**
- **Media Upload** - Create and manage media content
- **Media Discovery** - Browse and search media
- **Media Organization** - Hide/unhide functionality
- **YouTube Integration** - Automatic thumbnail and video ID extraction

### **Rating System**
- **Like/Dislike** - Binary rating system
- **Self-Rating** - Users can rate their own content
- **Points Calculation** - Scoring algorithm based on other ratings
- **Real-time Updates** - Instant score recalculation

### **Smart Lists**
- **Positive Media** - User's liked content
- **Negative Media** - User's disliked content
- **Hidden Media** - User's hidden content
- **Latest Media** - Recently uploaded content
- **My Media** - User's uploaded content

## 🔄 Application Flow

### **Request Processing Pipeline**
```
1. HTTP Request → Oak App
2. CORS Middleware → Cross-origin validation
3. Body Parser → Request parsing
4. Authentication → JWT verification (protected routes)
5. Validation → Input validation (Zod schemas)
6. Controller → Request handling
7. Service → Business logic execution
8. Database → Data persistence
9. Response → Formatted API response
```

### **Rating Flow Example**
```
1. User clicks like button
2. Frontend sends POST /api/v1/ratings/rate
3. Auth middleware validates JWT token
4. Validation middleware checks input format
5. Rating controller processes request
6. Rating service handles business logic:
   - Check existing rating
   - Update/insert/delete rating
   - Calculate author's points (other-ratings only)
   - Update media statistics
7. Return updated media information
8. Frontend updates UI with new data
```

### **Points Calculation Algorithm**
```
Formula: (Other Positive Count - Other Negative Count) × 10

Example:
- User's media receives 9 likes from others = +90 points
- User's media receives 6 dislikes from others = -60 points
- Net Points = 90 - 60 = 30 points

Self-ratings are excluded from points calculation
but appear in user's positive/negative lists
```

## 🛠️ How to Run

### **Prerequisites**
- Deno runtime (latest version)
- PostgreSQL database
- Environment variables configuration

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd StreamShareBE

# Create .env file
cp .env.example .env
# Edit .env with your database credentials
```

### **Environment Variables**
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3999
NODE_ENV=development
```

### **Database Setup**
```bash
# Create database
createdb streamshare_db

# Run migration scripts (if available)
# or import from provided SQL files
psql -d streamshare_db -f stream_share_03.sql
```

### **Start Development Server**
```bash
# Start the application
deno run --allow-net --allow-env --allow-read app.js

# Or with hot reload (if using denon)
denon start
```

### **API Testing**
```bash
# Health check
curl http://localhost:3999/api/v1/users/health

# User registration
curl -X POST http://localhost:3999/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "name": "Test User", "password": "password123"}'

# User login
curl -X POST http://localhost:3999/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

## 📚 API Documentation

### **Base URL**
```
http://localhost:3999/api/v1
```

### **Authentication**
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

### **Key Endpoints**

#### **Users**
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/score-summary` - Get user statistics
- `GET /users/hidden-count` - Get hidden media count

#### **Media**
- `POST /media/create-media` - Create new media
- `GET /media/latest` - Get latest media
- `GET /media/positive` - Get user's positive media
- `GET /media/negative` - Get user's negative media
- `GET /media/hidden` - Get user's hidden media
- `GET /media/my-media` - Get user's uploaded media
- `POST /media/toggle-hide` - Hide/unhide media

#### **Ratings**
- `POST /ratings/rate` - Rate media (like/dislike)
- `GET /ratings/media/:mediaId` - Get media ratings

## 🔒 Security Features

### **Authentication & Authorization**
- JWT-based authentication with expiration
- Password hashing with bcrypt
- Protected route middleware
- User context injection

### **Input Validation**
- Zod schema validation for all inputs
- SQL injection prevention with parameterized queries
- XSS protection with proper escaping

### **Error Handling**
- Centralized error handling middleware
- Sanitized error responses
- Comprehensive logging system

## 🧪 Development Tools

### **Code Quality**
```bash
# Lint code
deno lint src/

# Format code
deno fmt src/

# Type check
deno check src/
```

### **Database Tools**
```bash
# Connect to database
psql -d streamshare_db

# Export data
pg_dump streamshare_db > backup.sql

# Import data
psql -d streamshare_db < backup.sql
```

## 🚀 Production Deployment

### **Environment Setup**
```env
NODE_ENV=production
PORT=80
DATABASE_URL=postgresql://prod_user:password@prod_db:5432/prod_db
JWT_SECRET=production-jwt-secret-key
```

### **Security Considerations**
- Use HTTPS in production
- Configure CORS for specific domains
- Implement rate limiting
- Use environment-specific secrets
- Enable database connection pooling
- Set up proper logging and monitoring

## 📝 Contributing Guidelines

### **Code Standards**
- Follow Deno linting rules
- Use descriptive variable names
- Add JSDoc comments for functions
- Implement proper error handling
- Write comprehensive tests

### **Git Workflow**
1. Create feature branch from main
2. Implement changes with proper testing
3. Run linting and formatting checks
4. Submit pull request with detailed description
5. Code review and merge

## 🐛 Troubleshooting

### **Common Issues**

**Database Connection Error**
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Verify database exists
psql -l

# Test connection
psql -d streamshare_db
```

**JWT Token Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration
# Use jwt.io to decode and validate tokens
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3999

# Kill process
kill -9 <PID>
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review API documentation
- Contact the development team

---

**Built with ❤️ using Deno and Oak**
