# Requirements Document: Wujo Backend Server

## Introduction

The Wujo Backend Server is a Node.js + TypeScript REST API that manages the core business logic for the Wujo ROSCA (Rotating Savings and Credit Association) mobile application. The system SHALL handle user authentication, Iqub (savings group) management, member operations, lottery mechanics, and payment round tracking. The backend SHALL use MongoDB for data persistence, JWT tokens for authentication, and Better-auth for modern authentication flows.

## Glossary

- **System**: The Wujo Backend Server (Node.js + TypeScript REST API)
- **User**: A registered individual with role 'collector' or 'member'
- **Collector**: A User who creates and manages Iqubs
- **Member**: A User who participates in Iqubs
- **Iqub**: A Rotating Savings and Credit Association group
- **Payment Round**: A cycle within an Iqub where members contribute and one member receives the pot
- **Lottery**: The process of randomly selecting a winner for a payment round
- **JWT Token**: JSON Web Token used for authentication
- **Bearer Token**: Authentication token sent in Authorization header
- **MongoDB**: NoSQL database for data persistence
- **Better-auth**: Modern authentication library for Node.js
- **E.164 Format**: International phone number format (e.g., +251911110000)

## Requirements

### Requirement 1: User Registration

**User Story:** As a new user, I want to register an account with my phone number and personal details, so that I can access the Wujo platform.

#### Acceptance Criteria

1. WHEN THE System receives a POST request to `/signup` with valid user data, THE System SHALL create a new User record in MongoDB with hashed password
2. WHEN THE System successfully creates a User, THE System SHALL generate a JWT Bearer Token with 30-day expiration
3. WHEN THE System successfully creates a User, THE System SHALL return a response containing the User object and Bearer Token within 2 seconds
4. IF THE System receives a signup request with a phone number that already exists, THEN THE System SHALL return a 400 error with message "Phone number already registered"
5. IF THE System receives a signup request with invalid data format, THEN THE System SHALL return a 422 error with field-specific validation messages

### Requirement 2: User Authentication

**User Story:** As a registered user, I want to log in with my phone number and password, so that I can access my account securely.

#### Acceptance Criteria

1. WHEN THE System receives a POST request to `/login` with valid credentials, THE System SHALL verify the password against the hashed password in MongoDB
2. WHEN THE System successfully authenticates a User, THE System SHALL generate a new JWT Bearer Token with 30-day expiration
3. WHEN THE System successfully authenticates a User, THE System SHALL return the User object and Bearer Token within 1 second
4. IF THE System receives invalid credentials, THEN THE System SHALL return a 401 error with message "Invalid credentials"
5. WHEN THE System receives a GET request to `/logout` with valid Bearer Token, THE System SHALL invalidate the token and return success message

### Requirement 3: Token-Based Authorization

**User Story:** As an authenticated user, I want my requests to be securely authorized, so that only I can access my data.

#### Acceptance Criteria

1. WHEN THE System receives a request with Authorization header containing Bearer Token, THE System SHALL verify the JWT signature using the secret key
2. IF THE System receives a request with expired JWT Token, THEN THE System SHALL return a 401 error with message "Token expired"
3. IF THE System receives a request with invalid JWT Token, THEN THE System SHALL return a 401 error with message "Invalid token"
4. WHEN THE System successfully verifies a JWT Token, THE System SHALL extract the User ID and attach it to the request context
5. WHEN THE System receives a protected endpoint request without Authorization header, THE System SHALL return a 401 error with message "Authorization required"

### Requirement 4: User Profile Management

**User Story:** As an authenticated user, I want to retrieve my profile information, so that I can view my account details.

#### Acceptance Criteria

1. WHEN THE System receives a GET request to `/user` with valid Collector Bearer Token, THE System SHALL return the User object from MongoDB
2. WHEN THE System receives a GET request to `/profile` with valid Member Bearer Token, THE System SHALL return the User object from MongoDB
3. WHEN THE System retrieves a User profile, THE System SHALL exclude the password field from the response
4. IF THE System cannot find the User ID from the token, THEN THE System SHALL return a 404 error with message "User not found"

### Requirement 5: Iqub Creation

**User Story:** As a collector, I want to create a new Iqub with specific savings and credit parameters, so that I can start a savings group.

#### Acceptance Criteria

1. WHEN THE System receives a POST request to `/createIqub` from an authenticated Collector, THE System SHALL create a new Iqub document in MongoDB with status 'pending'
2. WHEN THE System creates an Iqub, THE System SHALL validate that saving_amount and credit_amount are positive numbers
3. WHEN THE System creates an Iqub, THE System SHALL validate that members_count is an integer greater than 1
4. WHEN THE System successfully creates an Iqub, THE System SHALL return the Iqub object with generated ID within 2 seconds
5. IF THE System receives an Iqub creation request from a Member role, THEN THE System SHALL return a 403 error with message "Only collectors can create Iqubs"

### Requirement 6: Iqub Retrieval

**User Story:** As a collector, I want to view all Iqubs I have created, so that I can manage my savings groups.

#### Acceptance Criteria

1. WHEN THE System receives a GET request to `/myIqubs` from an authenticated Collector, THE System SHALL query MongoDB for all Iqubs where collector_id matches the User ID
2. WHEN THE System retrieves Iqubs, THE System SHALL include computed fields hosted_lottery and total_collected
3. WHEN THE System returns Iqubs list, THE System SHALL sort by created_at in descending order
4. WHEN THE System receives a GET request to `/iqubs/{iqubId}` with valid Bearer Token, THE System SHALL return the full Iqub document including members array
5. IF THE System receives a request for an Iqub that does not belong to the requesting User, THEN THE System SHALL return a 403 error with message "Access denied"

### Requirement 7: Member Management

**User Story:** As a collector, I want to add members to my Iqub by phone number, so that I can build my savings group.

#### Acceptance Criteria

1. WHEN THE System receives a POST request to `/iqubs/{iqubId}/members` with valid phone number, THE System SHALL find the User by phone in MongoDB
2. WHEN THE System finds the User, THE System SHALL create a membership record linking the User to the Iqub
3. IF THE System receives a request to add a member when current_members equals members_count, THEN THE System SHALL return a 400 error with message "Iqub is full"
4. IF THE System receives a request to add a member who is already in the Iqub, THEN THE System SHALL return a 400 error with message "Member already exists in this Iqub"
5. WHEN THE System successfully adds a member, THE System SHALL increment the current_members count and return success message within 1 second

### Requirement 8: Member Iqub Access

**User Story:** As a member, I want to view all Iqubs I have joined, so that I can track my participation.

#### Acceptance Criteria

1. WHEN THE System receives a GET request to `/joinedIqubs` from an authenticated Member, THE System SHALL query MongoDB for all Iqubs where the User ID exists in the members array
2. WHEN THE System retrieves joined Iqubs, THE System SHALL include the member's saving_rounds progress for each Iqub
3. WHEN THE System returns joined Iqubs, THE System SHALL sort by join_date in descending order

### Requirement 9: Lottery Initiation

**User Story:** As a collector, I want to initiate a lottery for my Iqub, so that a winner can be randomly selected for the current round.

#### Acceptance Criteria

1. WHEN THE System receives a POST request to `/iqubs/{iqubId}/lottery/initiate` from an authenticated Collector, THE System SHALL verify the Iqub status is 'active'
2. WHEN THE System initiates a lottery, THE System SHALL verify that the current round does not already have a winner
3. WHEN THE System initiates a lottery, THE System SHALL randomly select a member who has not won in previous rounds
4. WHEN THE System selects a lottery winner, THE System SHALL create a lottery record in MongoDB with winner_id and round_number
5. IF THE System receives a lottery initiation request for an Iqub not in 'active' status, THEN THE System SHALL return a 400 error with message "Lottery cannot be initiated for this Iqub status"

### Requirement 10: Lottery Winner Retrieval

**User Story:** As a user, I want to fetch the lottery winner for a specific Iqub, so that I can see who won the current round.

#### Acceptance Criteria

1. WHEN THE System receives a GET request to `/fetchlottery` with iqub_id query parameter, THE System SHALL query MongoDB for the latest lottery record for that Iqub
2. WHEN THE System finds a lottery winner, THE System SHALL return the winner User object with round_number
3. IF THE System does not find a lottery winner for the specified Iqub, THEN THE System SHALL return a response with winner null and message "No lottery winner found"
4. WHEN THE System retrieves lottery winner, THE System SHALL include only id, name, and phone fields from the User object

### Requirement 11: Next Lottery Date Management

**User Story:** As a collector, I want to set the next lottery date for my Iqub, so that members know when the next draw will occur.

#### Acceptance Criteria

1. WHEN THE System receives a PUT request to `/iqubs/{iqubId}/next-lottery-date` with date in ISO 8601 format, THE System SHALL validate the date is in the future
2. WHEN THE System validates the date successfully, THE System SHALL update the next_lottery_date field in the Iqub document
3. WHEN THE System updates the next lottery date, THE System SHALL return the updated Iqub object within 1 second
4. IF THE System receives a date in the past, THEN THE System SHALL return a 422 error with message "Date must be in the future"
5. IF THE System receives an invalid date format, THEN THE System SHALL return a 422 error with message "Invalid date format"

### Requirement 12: Payment Round Management

**User Story:** As a collector, I want to view payment rounds for my Iqub, so that I can track contribution cycles.

#### Acceptance Criteria

1. WHEN THE System receives a GET request to `/iqubs/{iqubId}/rounds` from an authenticated Collector, THE System SHALL query MongoDB for all payment rounds for that Iqub
2. WHEN THE System retrieves payment rounds, THE System SHALL include round_number, status, winner_id, and total_collected for each round
3. WHEN THE System receives a GET request to `/iqubs/{iqubId}/rounds/{roundNumber}`, THE System SHALL return the full payment round details including member contributions
4. WHEN THE System returns payment rounds, THE System SHALL sort by round_number in ascending order

### Requirement 13: Payment Round Verification

**User Story:** As a collector, I want to verify or reject payment rounds, so that I can confirm contributions are complete.

#### Acceptance Criteria

1. WHEN THE System receives a PUT request to `/iqubs/{iqubId}/rounds/{roundId}/verify` with status 'verified', THE System SHALL update the round status to 'verified' in MongoDB
2. WHEN THE System receives a PUT request with status 'rejected', THE System SHALL update the round status to 'rejected'
3. WHEN THE System updates round status, THE System SHALL record the verification timestamp
4. IF THE System receives a verification request from a User who is not the Iqub collector, THEN THE System SHALL return a 403 error with message "Only the collector can verify rounds"
5. WHEN THE System successfully verifies a round, THE System SHALL return success message within 1 second

### Requirement 14: Database Connection Management

**User Story:** As the system administrator, I want the server to manage database connections efficiently, so that the application remains stable under load.

#### Acceptance Criteria

1. WHEN THE System starts, THE System SHALL establish a connection pool to MongoDB with minimum 5 and maximum 20 connections
2. WHEN THE System loses database connection, THE System SHALL attempt to reconnect with exponential backoff up to 5 attempts
3. IF THE System cannot establish database connection after 5 attempts, THEN THE System SHALL log critical error and exit with code 1
4. WHEN THE System receives a database query, THE System SHALL execute the query with a timeout of 10 seconds
5. WHEN THE System shuts down, THE System SHALL close all database connections gracefully within 5 seconds

### Requirement 15: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error logging, so that I can debug issues in production.

#### Acceptance Criteria

1. WHEN THE System encounters an unhandled error, THE System SHALL log the error with stack trace to the console
2. WHEN THE System returns an error response, THE System SHALL include a unique request ID for tracing
3. WHEN THE System processes a request, THE System SHALL log the HTTP method, path, status code, and response time
4. WHEN THE System encounters a validation error, THE System SHALL return structured error messages with field names
5. WHEN THE System encounters a database error, THE System SHALL return a 500 error with message "Internal server error" without exposing database details

### Requirement 16: API Versioning and CORS

**User Story:** As a frontend developer, I want the API to support CORS and versioning, so that I can integrate with the mobile app.

#### Acceptance Criteria

1. WHEN THE System receives a preflight OPTIONS request, THE System SHALL respond with appropriate CORS headers allowing the frontend origin
2. WHEN THE System receives a request, THE System SHALL include CORS headers in the response allowing credentials
3. WHEN THE System starts, THE System SHALL mount all routes under the `/api` prefix
4. WHEN THE System receives a request to an undefined route, THE System SHALL return a 404 error with message "Route not found"

## Agent Instructions

- Implement all endpoints defined in the API contracts document
- Use Express.js as the web framework with TypeScript
- Implement Better-auth for authentication flows with JWT strategy
- Create MongoDB schemas using Mongoose ODM
- Implement JWT middleware for protected routes
- Use bcrypt for password hashing with salt rounds of 10
- Implement request validation using express-validator
- Create separate route files for auth, collector, and member endpoints
- Implement error handling middleware for consistent error responses
- Use environment variables for configuration (MongoDB URI, JWT secret, port)
- Implement request logging middleware
- Create database connection utility with retry logic
- Follow RESTful API design principles
- Implement rate limiting for authentication endpoints
- Use PM2 ecosystem file for production deployment
