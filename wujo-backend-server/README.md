# Wujo Backend Server

Node.js + TypeScript REST API for managing ROSCA (Rotating Savings and Credit Association) groups called Iqubs.

## Features

- User authentication with JWT tokens
- Iqub (savings group) creation and management
- Member management
- Lottery system for pot distribution
- Payment round tracking and verification
- MongoDB for data persistence
- PM2 for production deployment

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **Process Manager**: PM2

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string (256-bit recommended)
   - Set `FRONTEND_URL` to your frontend application URL

## Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

## Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

## Production

### Using Node.js

```bash
npm run build
npm start
```

### Using PM2

```bash
npm run build
npm run pm2:start
```

Monitor logs:

```bash
npm run pm2:logs
```

Stop the server:

```bash
npm run pm2:stop
```

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Login with phone and password
- `GET /api/logout` - Logout (invalidate token)
- `GET /api/user` - Get collector profile
- `GET /api/profile` - Get member profile

### Collector Endpoints

- `POST /api/createIqub` - Create a new Iqub
- `GET /api/myIqubs` - Get all Iqubs created by collector
- `GET /api/iqubs/:iqubId` - Get Iqub details
- `POST /api/iqubs/:iqubId/members` - Add member to Iqub
- `POST /api/iqubs/:iqubId/lottery/initiate` - Initiate lottery for current round
- `PUT /api/iqubs/:iqubId/next-lottery-date` - Set next lottery date
- `GET /api/iqubs/:iqubId/rounds` - Get all payment rounds
- `GET /api/iqubs/:iqubId/rounds/:roundNumber` - Get round details
- `PUT /api/iqubs/:iqubId/rounds/:roundId/verify` - Verify/reject payment round

### Member Endpoints

- `GET /api/joinedIqubs` - Get all Iqubs joined by member
- `GET /api/fetchlottery?iqub_id=:id` - Get lottery winner for Iqub

### Health Check

- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/wujo |
| `MONGODB_POOL_MIN` | Minimum connection pool size | 5 |
| `MONGODB_POOL_MAX` | Maximum connection pool size | 20 |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_EXPIRATION` | JWT token expiration | 30d |
| `FRONTEND_URL` | Frontend application URL for CORS | http://localhost:8080 |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | info |

## Project Structure

```
wujo-backend-server/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript (generated)
├── logs/                # PM2 logs (generated)
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── ecosystem.config.js  # PM2 configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Testing

Run unit tests:

```bash
npm test
```

Run integration tests:

```bash
npm run test:integration
```

## License

ISC
