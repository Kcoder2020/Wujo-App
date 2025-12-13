# Client Integration Guide

## ✅ Backend API Status

All APIs expected by the client are **FULLY IMPLEMENTED** and response structures have been **UPDATED** to match client expectations.

---

## 📡 API Endpoints Summary

### Authentication Endpoints

#### 1. Signup
- **Endpoint:** `POST /api/signup`
- **Request Body:**
```json
{
  "name": "string",
  "phone": "+251911110000",
  "gender": "male" | "female",
  "role": "collector" | "member",
  "password": "string",
  "password_confirmation": "string",
  "email": "string (optional)"
}
```
- **Response (201):**
```json
{
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "ObjectId",
      "name": "string",
      "phone": "string",
      "email": "string",
      "gender": "male" | "female",
      "role": "collector" | "member",
      "created_at": "ISO Date",
      "updated_at": "ISO Date"
    },
    "token": "JWT token string"
  }
}
```

#### 2. Login
- **Endpoint:** `POST /api/login`
- **Request Body:**
```json
{
  "phone": "+251911110000",
  "password": "string"
}
```
- **Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "user": { /* User object */ },
    "token": "JWT token string"
  }
}
```

#### 3. Logout
- **Endpoint:** `GET /api/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "success": true,
  "message": "Successfully logged out",
  "timestamp": "ISO Date"
}
```

#### 4. Get User Profile (Collector)
- **Endpoint:** `GET /api/user`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": {
    "id": "ObjectId",
    "name": "string",
    "phone": "string",
    "email": "string",
    "gender": "male" | "female",
    "role": "collector",
    "profile_picture_url": "string",
    "created_at": "ISO Date",
    "updated_at": "ISO Date"
  }
}
```

#### 5. Get User Profile (Member)
- **Endpoint:** `GET /api/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": {
    /* Same as /api/user */
  }
}
```

---

### Collector Endpoints

#### 6. Create Iqub
- **Endpoint:** `POST /api/createIqub`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Request Body:**
```json
{
  "name": "string",
  "saving_pattern": 1,
  "saving_amount": 1000,
  "credit_pattern": 1,
  "credit_amount": 10000,
  "members_count": 10
}
```
- **Response (201):**
```json
{
  "message": "Iqub created successfully",
  "iqub": {
    "_id": "ObjectId",
    "collector_id": "ObjectId",
    "name": "string",
    "saving_pattern": 1,
    "saving_amount": 1000,
    "credit_pattern": 1,
    "credit_amount": 10000,
    "members_count": 10,
    "current_members": 0,
    "status": "pending",
    "next_lottery_date": null,
    "created_at": "ISO Date",
    "updated_at": "ISO Date"
  }
}
```

#### 7. Get My Iqubs
- **Endpoint:** `GET /api/myIqubs`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Response (200):**
```json
{
  "data": [
    {
      "id": "ObjectId",
      "user_id": "ObjectId",
      "name": "string",
      "saving_pattern": 1,
      "saving_amount": 1000,
      "credit_pattern": 1,
      "credit_amount": 10000,
      "members_count": 10,
      "current_members": 5,
      "status": "active",
      "next_lottery_date": "ISO Date",
      "created_at": "ISO Date",
      "updated_at": "ISO Date",
      "hosted_lottery": "5/10",
      "total_collected": 25000
    }
  ]
}
```

#### 8. Get Iqub Details
- **Endpoint:** `GET /api/iqubs/:iqubId`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": {
    /* Full Iqub object with all details */
  }
}
```

#### 9. Add Member to Iqub
- **Endpoint:** `POST /api/iqubs/:iqubId/members`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Request Body:**
```json
{
  "phone": "+251911110000"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Member added successfully",
  "timestamp": "ISO Date"
}
```

#### 10. Initiate Lottery
- **Endpoint:** `POST /api/iqubs/:iqubId/lottery/initiate`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Response (200):**
```json
{
  "success": true,
  "message": "Lottery initiated successfully",
  "timestamp": "ISO Date"
}
```

#### 11. Set Next Lottery Date
- **Endpoint:** `PUT /api/iqubs/:iqubId/next-lottery-date`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Request Body:**
```json
{
  "date": "2024-12-31T10:00:00.000Z"
}
```
- **Response (200):**
```json
{
  "message": "Next lottery date updated successfully",
  "iqub": {
    /* Updated Iqub object */
  }
}
```

#### 12. Get Payment Rounds
- **Endpoint:** `GET /api/iqubs/:iqubId/rounds`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": [
    {
      "_id": "ObjectId",
      "iqub_id": "ObjectId",
      "round_number": 1,
      "status": "pending" | "verified" | "rejected",
      "winner_id": "ObjectId",
      "total_collected": 10000,
      "expected_amount": 10000,
      "verification_date": "ISO Date",
      "created_at": "ISO Date"
    }
  ]
}
```

#### 13. Get Payment Round Details
- **Endpoint:** `GET /api/iqubs/:iqubId/rounds/:roundNumber`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": {
    /* Full round object with details */
  }
}
```

#### 14. Verify Payment Round
- **Endpoint:** `PUT /api/iqubs/:iqubId/rounds/:roundId/verify`
- **Headers:** `Authorization: Bearer <token>`
- **Role Required:** `collector`
- **Request Body:**
```json
{
  "status": "verified" | "rejected"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Payment round verified successfully",
  "timestamp": "ISO Date"
}
```

---

### Member Endpoints

#### 15. Get Joined Iqubs
- **Endpoint:** `GET /api/joinedIqubs`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "data": [
    {
      "id": "ObjectId",
      "user_id": "ObjectId",
      "name": "string",
      "saving_pattern": 1,
      "saving_amount": 1000,
      "credit_pattern": 1,
      "credit_amount": 10000,
      "members_count": 10,
      "current_members": 10,
      "status": "active",
      "next_lottery_date": "ISO Date",
      "created_at": "ISO Date",
      "updated_at": "ISO Date",
      "saving_rounds": "5/10"
    }
  ]
}
```

#### 16. Get Lottery Winner
- **Endpoint:** `GET /api/fetchlottery?iqub_id=<iqubId>`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "message": "Lottery winner retrieved successfully",
  "winner": {
    "id": "ObjectId",
    "name": "string",
    "phone": "string"
  },
  "round_number": 5
}
```
- **Response (200 - No Winner):**
```json
{
  "message": "No lottery winner found for this round/Iqub",
  "winner": null,
  "round_number": 0
}
```

---

## 🔧 Client Adjustments Needed

### ✅ No Changes Required!

All response structures have been updated on the backend to match client expectations. The client store modules should work as-is with the following access patterns:

### Auth Module
```typescript
// Signup/Login
const response = await axios.post('/signup', userData);
const token = response.data.data.token;
const user = response.data.data.user;

// Get Profile
const response = await axios.get('/user');
const user = response.data.data;
```

### Iqubs Module
```typescript
// Get My Iqubs
const response = await axios.get('/myIqubs');
const iqubs = response.data.data; // Array

// Get Iqub Details
const response = await axios.get(`/iqubs/${iqubId}`);
const iqub = response.data.data;

// Get Rounds
const response = await axios.get(`/iqubs/${iqubId}/rounds`);
const rounds = response.data.data; // Array
```

### Member Module
```typescript
// Get Joined Iqubs
const response = await axios.get('/joinedIqubs');
const iqubs = response.data.data; // Array

// Get Profile
const response = await axios.get('/profile');
const profile = response.data.data;
```

---

## 🚀 Testing Checklist

### Before Client Development:

1. **✅ Test Authentication Flow**
   - [ ] Signup with valid data
   - [ ] Login with credentials
   - [ ] Get user profile
   - [ ] Logout

2. **✅ Test Collector Flow**
   - [ ] Create Iqub
   - [ ] Get my Iqubs list
   - [ ] Get single Iqub details
   - [ ] Add member to Iqub
   - [ ] Initiate lottery
   - [ ] Set next lottery date
   - [ ] Get payment rounds
   - [ ] Verify payment round

3. **✅ Test Member Flow**
   - [ ] Get joined Iqubs
   - [ ] Get lottery winner
   - [ ] Get member profile

4. **✅ Test Error Handling**
   - [ ] Invalid credentials (401)
   - [ ] Missing token (401)
   - [ ] Expired token (401)
   - [ ] Wrong role (403)
   - [ ] Resource not found (404)
   - [ ] Validation errors (422)

---

## 🔐 Authentication Setup

### Setting Authorization Header

The client should set the Authorization header after login:

```typescript
// After successful login/signup
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Or per request
const response = await axios.get('/api/user', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Token Storage

The client stores tokens in localStorage:
```typescript
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
```

---

## 📝 Notes

1. **All endpoints are prefixed with `/api`**
2. **Phone numbers must be in E.164 format** (e.g., +251911110000)
3. **Dates should be in ISO 8601 format**
4. **JWT tokens expire after 30 days**
5. **MongoDB ObjectIds are returned as strings in JSON**

---

## 🐛 Common Issues & Solutions

### Issue: "Token expired"
**Solution:** Implement token refresh or redirect to login

### Issue: "Access denied"
**Solution:** Check user role matches endpoint requirements

### Issue: "Phone number already registered"
**Solution:** User already exists, redirect to login

### Issue: "Iqub is full"
**Solution:** Cannot add more members, show appropriate message

### Issue: "Lottery cannot be initiated"
**Solution:** Check Iqub status is 'active' and no existing winner

---

## 📞 Support

For any API issues or questions:
1. Check server logs at `wujo-backend-server/logs/`
2. Verify MongoDB connection
3. Check request/response in browser DevTools
4. Ensure correct Authorization header format

---

**Last Updated:** December 2024
**Backend Version:** 1.0.0
**API Base URL:** `http://localhost:3000/api`
