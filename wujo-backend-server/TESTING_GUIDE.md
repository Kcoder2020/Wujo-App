# API Testing Guide

## Quick Start Testing

### 1. Start the Server
```bash
cd wujo-backend-server
npm run dev
```

Server should be running at: `http://localhost:3000`

### 2. Test Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-13T...",
  "uptime": 123.456,
  "mongodb": "connected"
}
```

---

## Testing with cURL

### Authentication Tests

#### Signup (Collector)
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Collector",
    "phone": "+251911110000",
    "gender": "male",
    "role": "collector",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

#### Signup (Member)
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Member",
    "phone": "+251911110001",
    "gender": "female",
    "role": "member",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+251911110000",
    "password": "password123"
  }'
```

**Save the token from response for subsequent requests!**

#### Get User Profile
```bash
curl -X GET http://localhost:3000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Collector Tests

#### Create Iqub
```bash
curl -X POST http://localhost:3000/api/createIqub \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Iqub",
    "saving_pattern": 1,
    "saving_amount": 1000,
    "credit_pattern": 1,
    "credit_amount": 10000,
    "members_count": 5
  }'
```

#### Get My Iqubs
```bash
curl -X GET http://localhost:3000/api/myIqubs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Iqub Details
```bash
curl -X GET http://localhost:3000/api/iqubs/IQUB_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Add Member to Iqub
```bash
curl -X POST http://localhost:3000/api/iqubs/IQUB_ID_HERE/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "phone": "+251911110001"
  }'
```

#### Initiate Lottery
```bash
curl -X POST http://localhost:3000/api/iqubs/IQUB_ID_HERE/lottery/initiate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Set Next Lottery Date
```bash
curl -X PUT http://localhost:3000/api/iqubs/IQUB_ID_HERE/next-lottery-date \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2024-12-31T10:00:00.000Z"
  }'
```

#### Get Payment Rounds
```bash
curl -X GET http://localhost:3000/api/iqubs/IQUB_ID_HERE/rounds \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Verify Payment Round
```bash
curl -X PUT http://localhost:3000/api/iqubs/IQUB_ID_HERE/rounds/ROUND_ID_HERE/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "verified"
  }'
```

---

### Member Tests

#### Get Joined Iqubs
```bash
curl -X GET http://localhost:3000/api/joinedIqubs \
  -H "Authorization: Bearer MEMBER_TOKEN_HERE"
```

#### Get Lottery Winner
```bash
curl -X GET "http://localhost:3000/api/fetchlottery?iqub_id=IQUB_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

### Import Collection

Create a new Postman collection with these settings:

**Base URL Variable:**
- Variable: `baseUrl`
- Value: `http://localhost:3000/api`

**Authorization:**
- Type: Bearer Token
- Token: `{{token}}`

### Collection Structure

```
Wujo API
├── Auth
│   ├── Signup (Collector)
│   ├── Signup (Member)
│   ├── Login
│   ├── Logout
│   └── Get Profile
├── Collector
│   ├── Create Iqub
│   ├── Get My Iqubs
│   ├── Get Iqub Details
│   ├── Add Member
│   ├── Initiate Lottery
│   ├── Set Next Lottery Date
│   ├── Get Payment Rounds
│   ├── Get Round Details
│   └── Verify Round
└── Member
    ├── Get Joined Iqubs
    └── Get Lottery Winner
```

### Environment Variables

Create a Postman environment with:
```
baseUrl: http://localhost:3000/api
token: (will be set after login)
iqubId: (will be set after creating iqub)
memberId: (will be set after adding member)
```

### Test Scripts

Add this to Login request's "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

Add this to Create Iqub request's "Tests" tab:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("iqubId", response.iqub._id);
}
```

---

## Expected Test Flow

### Complete Workflow Test

1. **Setup Phase**
   ```
   ✓ Signup Collector
   ✓ Signup 5 Members
   ✓ Login as Collector
   ```

2. **Iqub Creation Phase**
   ```
   ✓ Create Iqub (members_count: 5)
   ✓ Verify Iqub status is 'pending'
   ```

3. **Member Addition Phase**
   ```
   ✓ Add Member 1 (status should remain 'pending')
   ✓ Add Member 2
   ✓ Add Member 3
   ✓ Add Member 4
   ✓ Add Member 5 (status should change to 'active')
   ```

4. **Lottery Phase**
   ```
   ✓ Set next lottery date
   ✓ Initiate lottery
   ✓ Fetch lottery winner
   ✓ Verify winner is one of the members
   ```

5. **Member Verification**
   ```
   ✓ Login as Member
   ✓ Get joined Iqubs
   ✓ Verify Iqub appears in list
   ```

---

## Error Testing

### Test Invalid Scenarios

1. **Authentication Errors**
   ```bash
   # Missing token
   curl -X GET http://localhost:3000/api/myIqubs
   # Expected: 401 "Authorization required"
   
   # Invalid token
   curl -X GET http://localhost:3000/api/myIqubs \
     -H "Authorization: Bearer invalid_token"
   # Expected: 401 "Invalid token"
   ```

2. **Validation Errors**
   ```bash
   # Invalid phone format
   curl -X POST http://localhost:3000/api/signup \
     -H "Content-Type: application/json" \
     -d '{"phone": "123456", ...}'
   # Expected: 422 with validation errors
   
   # Password mismatch
   curl -X POST http://localhost:3000/api/signup \
     -H "Content-Type: application/json" \
     -d '{"password": "pass1", "password_confirmation": "pass2", ...}'
   # Expected: 422 "Passwords do not match"
   ```

3. **Business Logic Errors**
   ```bash
   # Add member to full Iqub
   # Expected: 400 "Iqub is full"
   
   # Initiate lottery on pending Iqub
   # Expected: 400 "Lottery cannot be initiated for this Iqub status"
   
   # Add duplicate member
   # Expected: 400 "Member already exists in this Iqub"
   ```

4. **Authorization Errors**
   ```bash
   # Member trying to create Iqub
   # Expected: 403 "Access denied. collector role required"
   
   # Access another collector's Iqub
   # Expected: 403 "Access denied"
   ```

---

## Monitoring Logs

### Watch Server Logs
```bash
# In development
npm run dev
# Logs appear in console

# With PM2
npm run pm2:logs
```

### Log Patterns to Watch

**Successful Request:**
```
[Request] { requestId: '...', method: 'POST', path: '/api/login', ... }
[Response] { requestId: '...', statusCode: 200, responseTime: '45ms' }
```

**Error:**
```
[Error] { requestId: '...', error: 'Invalid credentials', path: '/api/login' }
```

**Database:**
```
[Database] Mongoose connected to MongoDB
[Database] Successfully connected to MongoDB
```

---

## Performance Testing

### Response Time Targets

- Authentication: < 1 second
- Iqub creation: < 2 seconds
- List endpoints: < 500ms
- Detail endpoints: < 300ms

### Load Testing with Apache Bench

```bash
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/login

# Test get iqubs (requires auth header)
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/myIqubs
```

---

## Troubleshooting

### Common Issues

**Issue: Connection refused**
```
Solution: Ensure server is running on port 3000
Check: netstat -an | grep 3000
```

**Issue: MongoDB connection failed**
```
Solution: Ensure MongoDB is running
Check: mongosh (should connect)
Start: sudo systemctl start mongod
```

**Issue: Token expired**
```
Solution: Login again to get new token
Tokens expire after 30 days
```

**Issue: Validation errors**
```
Solution: Check request body matches expected format
Verify phone is in E.164 format (+251...)
Ensure all required fields are present
```

---

## Next Steps

After successful API testing:

1. ✅ All endpoints working
2. ✅ Error handling verified
3. ✅ Response structures match client expectations
4. 🚀 **Ready for client integration!**

---

**Happy Testing! 🎉**
