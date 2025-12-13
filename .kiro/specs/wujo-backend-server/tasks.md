# Implementation Plan: Wujo Backend Server

- [x] 1. Initialize project structure and dependencies
  - Create new directory `wujo-backend-server` in project root
  - Initialize npm project with TypeScript configuration
  - Install core dependencies: express, typescript, mongoose, jsonwebtoken, bcryptjs, cors, dotenv, express-validator
  - Install dev dependencies: @types/node, @types/express, ts-node, nodemon, jest, ts-jest, supertest
  - Create tsconfig.json with strict mode and ES2020 target
  - Create directory structure: src/{config,middleware,models,repositories,services,controllers,routes,types,utils}
  - Create .env.example with all required environment variables
  - Create .gitignore for node_modules, dist, .env, logs
  - _Requirements: 14.1, 16.3_

- [x] 2. Set up MongoDB connection and configuration
  - [x] 2.1 Create database configuration module
    - Write src/config/database.ts with MongoDB connection logic
    - Implement connection pool with min 5, max 20 connections
    - Implement retry logic with exponential backoff (5 attempts)
    - Add connection event handlers for connected, error, disconnected
    - Export database connection function
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 2.2 Create environment configuration module
    - Write src/config/env.ts to load and validate environment variables
    - Define TypeScript interface for environment config
    - Validate required variables: PORT, MONGODB_URI, JWT_SECRET
    - Export typed config object
    - _Requirements: 14.1_

- [x] 3. Implement authentication utilities
  - [x] 3.1 Create password hashing utilities
    - Write src/utils/password.util.ts with bcrypt functions
    - Implement hashPassword function with 10 salt rounds
    - Implement comparePassword function for verification
    - _Requirements: 1.1, 2.1_

  - [x] 3.2 Create JWT utilities
    - Write src/utils/jwt.util.ts for token operations
    - Implement generateToken function with 30-day expiration
    - Implement verifyToken function with signature validation
    - Define JWTPayload interface with userId and role
    - _Requirements: 1.2, 2.2, 3.1, 3.2_

  - [x] 3.3 Create validation utilities
    - Write src/utils/validation.util.ts for common validations
    - Implement phone number validation (E.164 format)
    - Implement email validation
    - Implement positive number validation
    - _Requirements: 1.5, 5.2, 5.3_

  - [x] 3.4 Create response formatting utilities
    - Write src/utils/response.util.ts for consistent API responses
    - Implement success response formatter
    - Implement error response formatter with request ID
    - _Requirements: 15.2, 15.4_

- [x] 4. Define MongoDB schemas and models
  - [x] 4.1 Create User model
    - Write src/models/User.model.ts with Mongoose schema
    - Define fields: name, phone (unique), email, gender, role, password_hash, profile_picture_url, timestamps
    - Add indexes: phone (unique), role (non-unique)
    - Add pre-save hook to hash password if modified
    - Export User model and UserDocument interface
    - _Requirements: 1.1, 2.1, 4.1, 4.2_

  - [x] 4.2 Create Iqub model
    - Write src/models/Iqub.model.ts with Mongoose schema
    - Define fields: collector_id, name, saving_pattern, saving_amount, credit_pattern, credit_amount, members_count, current_members, status, next_lottery_date, timestamps
    - Add indexes: collector_id, status
    - Add virtual field for hosted_lottery calculation
    - Export Iqub model and IqubDocument interface
    - _Requirements: 5.1, 6.1, 11.2_

  - [x] 4.3 Create Member model
    - Write src/models/Member.model.ts with Mongoose schema
    - Define fields: user_id, iqub_id, join_date, status, has_won, saving_rounds, created_at
    - Add compound unique index on {user_id, iqub_id}
    - Add indexes: user_id, iqub_id
    - Export Member model and MemberDocument interface
    - _Requirements: 7.1, 7.2, 8.1_

  - [x] 4.4 Create Round model
    - Write src/models/Round.model.ts with Mongoose schema
    - Define fields: iqub_id, round_number, status, winner_id, total_collected, expected_amount, verification_date, created_at
    - Add compound unique index on {iqub_id, round_number}
    - Add index: iqub_id
    - Export Round model and RoundDocument interface
    - _Requirements: 12.1, 12.2, 13.1_

  - [x] 4.5 Create Lottery model
    - Write src/models/Lottery.model.ts with Mongoose schema
    - Define fields: iqub_id, round_number, winner_id, lottery_date, created_at
    - Add compound unique index on {iqub_id, round_number}
    - Add index: iqub_id
    - Export Lottery model and LotteryDocument interface
    - _Requirements: 9.4, 10.1_

- [x] 5. Implement repository layer for data access
  - [x] 5.1 Create User repository
    - Write src/repositories/user.repository.ts
    - Implement createUser method
    - Implement findUserByPhone method
    - Implement findUserById method
    - Implement updateUser method
    - _Requirements: 1.1, 2.1, 4.1, 7.1_

  - [x] 5.2 Create Iqub repository
    - Write src/repositories/iqub.repository.ts
    - Implement createIqub method
    - Implement findIqubsByCollectorId method with sorting
    - Implement findIqubById method
    - Implement updateIqub method
    - Implement incrementCurrentMembers method
    - _Requirements: 5.1, 6.1, 6.2, 6.3, 7.2_

  - [x] 5.3 Create Member repository
    - Write src/repositories/member.repository.ts
    - Implement createMember method
    - Implement findMembersByIqubId method
    - Implement findMemberByUserAndIqub method
    - Implement findIqubsByUserId method
    - Implement updateMemberHasWon method
    - _Requirements: 7.2, 8.1, 9.3_

  - [x] 5.4 Create Round repository
    - Write src/repositories/round.repository.ts
    - Implement createRound method
    - Implement findRoundsByIqubId method with sorting
    - Implement findRoundByIqubAndNumber method
    - Implement updateRoundStatus method
    - _Requirements: 12.1, 12.3, 13.1, 13.2_

  - [x] 5.5 Create Lottery repository
    - Write src/repositories/lottery.repository.ts
    - Implement createLottery method
    - Implement findLatestLotteryByIqubId method
    - Implement findLotteryByIqubAndRound method
    - _Requirements: 9.4, 10.1, 10.2_

- [x] 6. Implement service layer business logic
  - [x] 6.1 Create authentication service
    - Write src/services/auth.service.ts
    - Implement signup method: validate input, check phone uniqueness, hash password, create user, generate token
    - Implement login method: find user by phone, verify password, generate token
    - Implement getUserById method for profile retrieval
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3_

  - [x] 6.2 Create Iqub service
    - Write src/services/iqub.service.ts
    - Implement createIqub method: validate amounts and members_count, create with status 'pending'
    - Implement getIqubsByCollector method: fetch and compute hosted_lottery, total_collected
    - Implement getIqubById method: verify ownership, return full details
    - Implement updateNextLotteryDate method: validate future date, update Iqub
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 6.3 Create member service
    - Write src/services/member.service.ts
    - Implement addMember method: find user by phone, check Iqub capacity, check duplicate, create member, increment current_members, update Iqub status if full
    - Implement getMembersByIqub method: fetch members with user details
    - Implement getJoinedIqubs method: fetch Iqubs for member with saving_rounds
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3_

  - [x] 6.4 Create lottery service
    - Write src/services/lottery.service.ts
    - Implement initiateLottery method: verify Iqub status 'active', check no existing winner for round, get eligible members (has_won=false), select random winner, create lottery record, update member has_won flag
    - Implement getLotteryWinner method: fetch latest lottery for Iqub, return winner details or null
    - Implement selectRandomWinner helper: use Math.random() for selection
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4_

  - [x] 6.5 Create round service
    - Write src/services/round.service.ts
    - Implement getRoundsByIqub method: fetch all rounds sorted by round_number
    - Implement getRoundDetails method: fetch specific round with contributions
    - Implement verifyRound method: check collector ownership, update status, record timestamp
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 7. Implement middleware components
  - [x] 7.1 Create authentication middleware
    - Write src/middleware/auth.middleware.ts
    - Implement authenticateToken function: extract Bearer token, verify JWT, attach user to request
    - Handle missing token (401), invalid token (401), expired token (401)
    - Export middleware and AuthenticatedRequest interface
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 7.2 Create role authorization middleware
    - Add requireRole function to auth.middleware.ts
    - Check req.user.role matches required role
    - Return 403 if role mismatch
    - _Requirements: 5.5, 13.4_

  - [x] 7.3 Create error handling middleware
    - Write src/middleware/error.middleware.ts
    - Implement global error handler with error type detection
    - Format validation errors (422), auth errors (401), not found (404), business logic (400), server errors (500)
    - Include request ID and timestamp in all error responses
    - Log errors with stack trace
    - _Requirements: 15.1, 15.2, 15.4, 15.5_

  - [x] 7.4 Create request logging middleware
    - Write src/middleware/logger.middleware.ts
    - Log HTTP method, path, status code, response time for each request
    - Generate and attach request ID to each request
    - _Requirements: 15.3_

  - [x] 7.5 Create validation middleware
    - Write src/middleware/validate.middleware.ts
    - Create validation chains using express-validator for each endpoint
    - Export validation middleware for signup, login, createIqub, addMember, etc.
    - _Requirements: 1.5, 5.2, 5.3, 7.3, 11.4, 11.5_

- [x] 8. Implement controllers for request handling
  - [x] 8.1 Create authentication controller
    - Write src/controllers/auth.controller.ts
    - Implement signup handler: validate request, call auth.service.signup, return 201 with user and token
    - Implement login handler: validate request, call auth.service.login, return 200 with user and token
    - Implement logout handler: return success message (token invalidation handled client-side)
    - Implement getProfile handler: call auth.service.getUserById, return user without password
    - Handle errors and return appropriate status codes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 Create collector controller
    - Write src/controllers/collector.controller.ts
    - Implement createIqub handler: validate input, call iqub.service.createIqub, return 201 with Iqub
    - Implement getMyIqubs handler: call iqub.service.getIqubsByCollector, return 200 with array
    - Implement getIqubDetails handler: validate iqubId, call iqub.service.getIqubById, return 200
    - Implement addMember handler: validate phone and iqubId, call member.service.addMember, return 200
    - Implement initiateLottery handler: validate iqubId, call lottery.service.initiateLottery, return 200
    - Implement setNextLotteryDate handler: validate date, call iqub.service.updateNextLotteryDate, return 200
    - Implement getRounds handler: call round.service.getRoundsByIqub, return 200
    - Implement getRoundDetails handler: call round.service.getRoundDetails, return 200
    - Implement verifyRound handler: validate status, call round.service.verifyRound, return 200
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 8.3 Create member controller
    - Write src/controllers/member.controller.ts
    - Implement getJoinedIqubs handler: call member.service.getJoinedIqubs, return 200 with array
    - Implement getLotteryWinner handler: validate iqub_id query param, call lottery.service.getLotteryWinner, return 200
    - _Requirements: 8.1, 8.2, 8.3, 10.1, 10.2, 10.3, 10.4_

- [x] 9. Define API routes
  - [x] 9.1 Create authentication routes
    - Write src/routes/auth.routes.ts
    - Define POST /signup with validation middleware
    - Define POST /login with validation middleware
    - Define GET /logout with auth middleware
    - Define GET /user with auth middleware (collector profile)
    - Define GET /profile with auth middleware (member profile)
    - Export router
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

  - [x] 9.2 Create collector routes
    - Write src/routes/collector.routes.ts
    - Define POST /createIqub with auth and role middleware
    - Define GET /myIqubs with auth and role middleware
    - Define GET /iqubs/:iqubId with auth middleware
    - Define POST /iqubs/:iqubId/members with auth and role middleware
    - Define POST /iqubs/:iqubId/lottery/initiate with auth and role middleware
    - Define PUT /iqubs/:iqubId/next-lottery-date with auth and role middleware
    - Define GET /iqubs/:iqubId/rounds with auth middleware
    - Define GET /iqubs/:iqubId/rounds/:roundNumber with auth middleware
    - Define PUT /iqubs/:iqubId/rounds/:roundId/verify with auth and role middleware
    - Export router
    - _Requirements: 5.1, 6.1, 6.3, 7.1, 9.1, 11.1, 12.1, 12.3, 13.1_

  - [x] 9.3 Create member routes
    - Write src/routes/member.routes.ts
    - Define GET /joinedIqubs with auth middleware
    - Define GET /fetchlottery with auth middleware and iqub_id query validation
    - Export router
    - _Requirements: 8.1, 10.1_

- [x] 10. Set up Express application
  - [x] 10.1 Create Express app configuration
    - Write src/app.ts
    - Initialize Express app
    - Configure CORS with credentials and allowed origins
    - Add body-parser middleware for JSON
    - Add request logging middleware
    - Mount auth routes at /api
    - Mount collector routes at /api
    - Mount member routes at /api
    - Add 404 handler for undefined routes
    - Add global error handling middleware
    - Export app instance
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 10.2 Create server entry point
    - Write src/server.ts
    - Import app and database config
    - Connect to MongoDB with retry logic
    - Start Express server on configured PORT
    - Add graceful shutdown handler for SIGTERM and SIGINT
    - Close database connections on shutdown
    - _Requirements: 14.1, 14.2, 14.3, 14.5_

  - [x] 10.3 Add health check endpoint
    - Add GET /health route in app.ts
    - Check MongoDB connection status
    - Return JSON with status, timestamp, uptime, mongodb status
    - _Requirements: 14.1_

- [x] 11. Create TypeScript type definitions
  - Write src/types/express.d.ts to extend Express Request with user property
  - Write src/types/user.types.ts for User-related interfaces
  - Write src/types/iqub.types.ts for Iqub-related interfaces
  - Write src/types/api.types.ts for request/response interfaces
  - _Requirements: All requirements (type safety)_

- [x] 12. Set up build and deployment configuration
  - [x] 12.1 Create PM2 ecosystem file
    - Write ecosystem.config.js with cluster mode, 2 instances
    - Configure environment variables, log files, restart policies
    - _Requirements: 14.1_

  - [x] 12.2 Add npm scripts
    - Add "build" script: tsc
    - Add "start" script: node dist/server.js
    - Add "dev" script: nodemon --exec ts-node src/server.ts
    - Add "pm2:start" script: pm2 start ecosystem.config.js
    - Add "pm2:stop" script: pm2 stop wujo-backend
    - Add "pm2:logs" script: pm2 logs wujo-backend
    - _Requirements: 14.1_

  - [x] 12.3 Create README documentation
    - Write README.md with project overview, setup instructions, API documentation links
    - Document environment variables
    - Document build and deployment process
    - _Requirements: All requirements (documentation)_

- [ ]* 13. Write unit tests for core functionality
  - Write tests for password.util.ts (hashing and comparison)
  - Write tests for jwt.util.ts (token generation and verification)
  - Write tests for validation.util.ts (phone, email, number validation)
  - Write tests for lottery.service.ts (random selection algorithm)
  - Configure Jest with ts-jest preset
  - Add "test" script to package.json
  - _Requirements: 1.1, 2.1, 3.1, 9.3_

- [ ]* 14. Write integration tests for API endpoints
  - Set up mongodb-memory-server for test database
  - Write tests for POST /api/signup (success and validation errors)
  - Write tests for POST /api/login (success and invalid credentials)
  - Write tests for POST /api/createIqub (success and authorization)
  - Write tests for POST /api/iqubs/:iqubId/members (success and business logic errors)
  - Write tests for POST /api/iqubs/:iqubId/lottery/initiate (success and preconditions)
  - Write tests for GET /api/fetchlottery (success and not found)
  - Add "test:integration" script to package.json
  - _Requirements: 1.1, 1.5, 2.1, 2.4, 5.1, 5.5, 7.3, 7.4, 9.1, 9.5, 10.1, 10.3_
