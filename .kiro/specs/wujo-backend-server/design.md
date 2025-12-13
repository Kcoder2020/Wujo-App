# Design Document: Wujo Backend Server

## Overview

The Wujo Backend Server is a RESTful API built with Node.js, TypeScript, and Express.js that provides authentication, Iqub management, and lottery mechanics for the Wujo mobile application. The system uses MongoDB for data persistence, Better-auth with JWT for authentication, and follows a layered architecture pattern separating routes, controllers, services, and data access layers.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Mobile Client  │
│  (Vue + Ionic)  │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────────────────────────┐
│     Express.js Application          │
│  ┌───────────────────────────────┐  │
│  │   Middleware Layer            │  │
│  │  - CORS                       │  │
│  │  - Body Parser                │  │
│  │  - JWT Auth                   │  │
│  │  - Request Logging            │  │
│  │  - Error Handler              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Route Layer                 │  │
│  │  - Auth Routes                │  │
│  │  - Collector Routes           │  │
│  │  - Member Routes              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Controller Layer            │  │
│  │  - Request Validation         │  │
│  │  - Response Formatting        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Service Layer               │  │
│  │  - Business Logic             │  │
│  │  - Lottery Algorithm          │  │
│  │  - Data Transformation        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Repository Layer            │  │
│  │  - MongoDB Queries            │  │
│  │  - Data Access                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   - users       │
│   - iqubs       │
│   - members     │
│   - rounds      │
│   - lotteries   │
└─────────────────┘
```

### Directory Structure

```
wujo-backend-server/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── auth.ts              # Better-auth configuration
│   │   └── env.ts               # Environment variables
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── error.middleware.ts  # Error handling
│   │   ├── logger.middleware.ts # Request logging
│   │   └── validate.middleware.ts # Input validation
│   ├── models/
│   │   ├── User.model.ts        # User schema
│   │   ├── Iqub.model.ts        # Iqub schema
│   │   ├── Member.model.ts      # Member schema
│   │   ├── Round.model.ts       # Payment round schema
│   │   └── Lottery.model.ts     # Lottery schema
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── iqub.repository.ts
│   │   ├── member.repository.ts
│   │   ├── round.repository.ts
│   │   └── lottery.repository.ts
│   ├── services/
│   │   ├── auth.service.ts      # Authentication logic
│   │   ├── iqub.service.ts      # Iqub business logic
│   │   ├── member.service.ts    # Member operations
│   │   ├── lottery.service.ts   # Lottery algorithm
│   │   └── round.service.ts     # Payment round logic
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── collector.controller.ts
│   │   └── member.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── collector.routes.ts
│   │   └── member.routes.ts
│   ├── types/
│   │   ├── express.d.ts         # Express type extensions
│   │   ├── user.types.ts
│   │   ├── iqub.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── jwt.util.ts          # JWT helpers
│   │   ├── password.util.ts     # Bcrypt helpers
│   │   ├── validation.util.ts   # Validation helpers
│   │   └── response.util.ts     # Response formatters
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── ecosystem.config.js          # PM2 configuration
└── README.md
```

## Components and Interfaces

### 1. Authentication System

**Components:**
- `auth.service.ts`: Handles user registration, login, password hashing
- `auth.middleware.ts`: JWT token verification for protected routes
- `jwt.util.ts`: Token generation and validation utilities

**Key Interfaces:**

```typescript
interface SignupRequest {
  name: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'collector' | 'member';
  password: string;
  password_confirmation: string;
}

interface LoginRequest {
  phone: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: UserResponse;
  token: string;
}

interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
```

**Authentication Flow:**
1. Client sends credentials to `/signup` or `/login`
2. Controller validates input format
3. Service verifies credentials (login) or creates user (signup)
4. Service generates JWT token with 30-day expiration
5. Response includes user object (without password) and token
6. Client stores token and sends in Authorization header for subsequent requests

### 2. Authorization Middleware

**Component:** `auth.middleware.ts`

**Flow:**
1. Extract Bearer token from Authorization header
2. Verify JWT signature using secret key
3. Check token expiration
4. Extract user ID and role from payload
5. Attach user data to `req.user` for downstream use
6. Call `next()` or return 401 error

**Interface:**

```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'collector' | 'member';
  };
}
```

### 3. Iqub Management System

**Components:**
- `iqub.service.ts`: Business logic for Iqub operations
- `iqub.repository.ts`: Database queries for Iqub collection
- `collector.controller.ts`: HTTP handlers for collector endpoints

**Key Interfaces:**

```typescript
interface CreateIqubRequest {
  name: string;
  saving_pattern: number | string;
  saving_amount: number | string;
  credit_pattern: number | string;
  credit_amount: number | string;
  members_count: number;
}

interface IqubDocument {
  _id: ObjectId;
  collector_id: ObjectId;
  name: string;
  saving_pattern: number;
  saving_amount: number;
  credit_pattern: number;
  credit_amount: number;
  members_count: number;
  current_members: number;
  status: 'pending' | 'active' | 'completed';
  next_lottery_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface IqubResponse extends Omit<IqubDocument, '_id' | 'collector_id'> {
  id: number;
  user_id: number;
  hosted_lottery?: string;  // e.g., "8/10"
  total_collected?: number;
}
```

**Iqub Creation Flow:**
1. Collector sends POST to `/createIqub`
2. Middleware verifies JWT and role
3. Controller validates input (positive amounts, valid members_count)
4. Service creates Iqub document with status 'pending'
5. Repository inserts into MongoDB
6. Response returns Iqub object with generated ID

### 4. Member Management System

**Components:**
- `member.service.ts`: Member addition and retrieval logic
- `member.repository.ts`: Member collection queries

**Key Interfaces:**

```typescript
interface AddMemberRequest {
  phone: string;
}

interface MemberDocument {
  _id: ObjectId;
  user_id: ObjectId;
  iqub_id: ObjectId;
  join_date: Date;
  status: 'active' | 'inactive';
  has_won: boolean;
  saving_rounds: number;
}
```

**Add Member Flow:**
1. Collector sends POST to `/iqubs/{iqubId}/members` with phone
2. Service finds user by phone number
3. Service checks if Iqub is full (current_members >= members_count)
4. Service checks if user is already a member
5. Service creates member record
6. Service increments Iqub.current_members
7. Service updates Iqub status to 'active' if members_count reached

### 5. Lottery System

**Components:**
- `lottery.service.ts`: Random winner selection algorithm
- `lottery.repository.ts`: Lottery record storage

**Key Interfaces:**

```typescript
interface LotteryDocument {
  _id: ObjectId;
  iqub_id: ObjectId;
  round_number: number;
  winner_id: ObjectId;
  lottery_date: Date;
  created_at: Date;
}

interface LotteryWinnerResponse {
  message: string;
  winner: {
    id: number;
    name: string;
    phone: string;
  } | null;
  round_number: number;
}
```

**Lottery Algorithm:**
1. Verify Iqub status is 'active'
2. Get current round number from payment rounds
3. Check if current round already has a winner
4. Query all members of the Iqub
5. Filter out members who have already won (has_won = true)
6. Randomly select one member from eligible list
7. Create lottery record with winner_id and round_number
8. Update member's has_won flag to true
9. Return success message (winner details sent via notification)

**Random Selection Implementation:**
```typescript
function selectRandomWinner(eligibleMembers: MemberDocument[]): MemberDocument {
  const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
  return eligibleMembers[randomIndex];
}
```

### 6. Payment Round System

**Components:**
- `round.service.ts`: Round creation and verification logic
- `round.repository.ts`: Round collection queries

**Key Interfaces:**

```typescript
interface RoundDocument {
  _id: ObjectId;
  iqub_id: ObjectId;
  round_number: number;
  status: 'pending' | 'verified' | 'rejected';
  winner_id: ObjectId | null;
  total_collected: number;
  expected_amount: number;
  verification_date: Date | null;
  created_at: Date;
}

interface VerifyRoundRequest {
  status: 'verified' | 'rejected';
}
```

**Round Verification Flow:**
1. Collector sends PUT to `/iqubs/{iqubId}/rounds/{roundId}/verify`
2. Service verifies collector owns the Iqub
3. Service updates round status
4. Service records verification timestamp
5. If verified and all rounds complete, update Iqub status to 'completed'

## Data Models

### MongoDB Collections

#### users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  phone: string,           // Unique index
  email?: string,
  gender: 'male' | 'female',
  role: 'collector' | 'member',
  password_hash: string,
  profile_picture_url?: string,
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
- `phone`: unique
- `role`: non-unique

#### iqubs Collection

```typescript
{
  _id: ObjectId,
  collector_id: ObjectId,  // Foreign key to users
  name: string,
  saving_pattern: number,
  saving_amount: number,
  credit_pattern: number,
  credit_amount: number,
  members_count: number,
  current_members: number,
  status: 'pending' | 'active' | 'completed',
  next_lottery_date: Date | null,
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
- `collector_id`: non-unique
- `status`: non-unique

#### members Collection

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,       // Foreign key to users
  iqub_id: ObjectId,       // Foreign key to iqubs
  join_date: Date,
  status: 'active' | 'inactive',
  has_won: boolean,
  saving_rounds: number,
  created_at: Date
}
```

**Indexes:**
- `user_id`: non-unique
- `iqub_id`: non-unique
- `{user_id, iqub_id}`: unique compound index

#### rounds Collection

```typescript
{
  _id: ObjectId,
  iqub_id: ObjectId,       // Foreign key to iqubs
  round_number: number,
  status: 'pending' | 'verified' | 'rejected',
  winner_id: ObjectId | null,
  total_collected: number,
  expected_amount: number,
  verification_date: Date | null,
  created_at: Date
}
```

**Indexes:**
- `iqub_id`: non-unique
- `{iqub_id, round_number}`: unique compound index

#### lotteries Collection

```typescript
{
  _id: ObjectId,
  iqub_id: ObjectId,       // Foreign key to iqubs
  round_number: number,
  winner_id: ObjectId,     // Foreign key to users
  lottery_date: Date,
  created_at: Date
}
```

**Indexes:**
- `iqub_id`: non-unique
- `{iqub_id, round_number}`: unique compound index

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;  // Field-specific validation errors
  requestId: string;
  timestamp: string;
}
```

### Error Categories

1. **Validation Errors (422)**
   - Invalid input format
   - Missing required fields
   - Type mismatches

2. **Authentication Errors (401)**
   - Missing token
   - Invalid token
   - Expired token

3. **Authorization Errors (403)**
   - Insufficient permissions
   - Role mismatch

4. **Not Found Errors (404)**
   - Resource doesn't exist
   - User not found

5. **Business Logic Errors (400)**
   - Iqub full
   - Member already exists
   - Lottery already initiated

6. **Server Errors (500)**
   - Database connection failure
   - Unhandled exceptions

### Error Middleware

```typescript
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  logger.error({
    requestId,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Handle other error types...

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    requestId,
    timestamp: new Date().toISOString()
  });
}
```

## Testing Strategy

### Unit Tests

**Coverage Areas:**
- Utility functions (JWT, password hashing, validation)
- Service layer business logic
- Lottery random selection algorithm
- Date validation functions

**Tools:** Jest, ts-jest

**Example:**
```typescript
describe('LotteryService', () => {
  describe('selectRandomWinner', () => {
    it('should select a member who has not won', async () => {
      const members = [
        { _id: '1', has_won: false },
        { _id: '2', has_won: false }
      ];
      const winner = await lotteryService.selectRandomWinner(members);
      expect(winner.has_won).toBe(false);
    });
  });
});
```

### Integration Tests

**Coverage Areas:**
- API endpoint responses
- Database operations
- Authentication flow
- Error handling

**Tools:** Jest, Supertest, mongodb-memory-server

**Example:**
```typescript
describe('POST /api/signup', () => {
  it('should create a new user and return token', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Test User',
        phone: '+251911110000',
        gender: 'male',
        role: 'collector',
        password: 'password123',
        password_confirmation: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.phone).toBe('+251911110000');
  });
});
```

### Manual Testing

- Postman collection for all endpoints
- Test data seeding scripts
- PM2 process monitoring in staging

## Security Considerations

### Password Security
- Use bcrypt with 10 salt rounds
- Never log or expose passwords
- Enforce minimum password length (8 characters)

### JWT Security
- Use strong secret key (256-bit minimum)
- Set reasonable expiration (30 days)
- Include user ID and role in payload
- Verify signature on every request

### Input Validation
- Sanitize all user inputs
- Validate phone number format (E.164)
- Validate email format
- Check numeric ranges for amounts

### Database Security
- Use MongoDB connection string with authentication
- Implement connection pooling
- Set query timeouts
- Use parameterized queries (Mongoose handles this)

### CORS Configuration
```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### Rate Limiting
- Implement rate limiting on auth endpoints
- 5 requests per minute for `/signup`
- 10 requests per minute for `/login`
- Use express-rate-limit middleware

## Deployment

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/wujo
MONGODB_POOL_MIN=5
MONGODB_POOL_MAX=20

# Authentication
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=30d

# CORS
FRONTEND_URL=https://app.wujo.app

# Logging
LOG_LEVEL=info
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'wujo-backend',
    script: './dist/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### Build Process

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 list
pm2 logs wujo-backend
```

## Performance Considerations

### Database Optimization
- Create indexes on frequently queried fields
- Use projection to limit returned fields
- Implement pagination for list endpoints
- Use aggregation pipeline for computed fields

### Caching Strategy
- Cache user profiles in memory (optional)
- Use MongoDB's built-in query caching
- Consider Redis for session management (future enhancement)

### Response Time Targets
- Authentication endpoints: < 1 second
- Iqub creation: < 2 seconds
- List endpoints: < 500ms
- Detail endpoints: < 300ms

## Monitoring and Logging

### Logging Strategy
- Use structured logging (JSON format)
- Log levels: error, warn, info, debug
- Include request ID for tracing
- Log all authentication attempts
- Log all database errors

### Metrics to Track
- Request count by endpoint
- Response times (p50, p95, p99)
- Error rates by type
- Active connections to MongoDB
- Memory usage
- CPU usage

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  
  res.json({
    status: dbStatus ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: dbStatus ? 'connected' : 'disconnected'
  });
});
```
