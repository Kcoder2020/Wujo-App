# API Endpoint Mismatch - Frontend vs Backend

## 🚨 Problem Identified

The frontend is calling API endpoints that don't exist in the backend, causing 404 errors.

---

## ✅ Fixed Endpoints

### 1. Get Joined Iqubs
**Frontend was calling:** `/member/iqubs` ❌  
**Backend expects:** `/joinedIqubs` ✅  
**Status:** FIXED ✅

---

## ❌ Missing Backend Endpoints

The following endpoints are called by the frontend but **DO NOT EXIST** in the backend:

### 1. Member Dashboard
**Frontend calls:** `GET /member/dashboard`  
**Used in:** `src/store/modules/member.ts:308`  
**Purpose:** Get dashboard summary data  
**Status:** ❌ NOT IMPLEMENTED

### 2. Discover Iqubs
**Frontend calls:** `GET /iqubs/discover`  
**Used in:** `src/store/modules/member.ts:406`  
**Purpose:** Get available Iqubs to join  
**Status:** ❌ NOT IMPLEMENTED

### 3. Member Achievements
**Frontend calls:** `GET /member/achievements`  
**Used in:** `src/store/modules/member.ts:544`  
**Purpose:** Get member achievements/badges  
**Status:** ❌ NOT IMPLEMENTED

### 4. Payment History
**Frontend calls:** `GET /member/payment-history`  
**Used in:** `src/store/modules/member.ts:583`  
**Purpose:** Get member's payment history  
**Status:** ❌ NOT IMPLEMENTED

---

## 📋 Backend Routes Currently Available

### Member Routes (`wujo-backend-server/src/routes/member.routes.ts`)
1. ✅ `GET /api/joinedIqubs` - Get joined Iqubs
2. ✅ `GET /api/fetchlottery` - Get lottery winner

### Collector Routes
1. ✅ `POST /api/createIqub` - Create Iqub
2. ✅ `GET /api/myIqubs` - Get collector's Iqubs
3. ✅ `GET /api/iqubs/:iqubId` - Get Iqub details
4. ✅ `POST /api/iqubs/:iqubId/members` - Add member
5. ✅ `POST /api/iqubs/:iqubId/lottery/initiate` - Initiate lottery
6. ✅ `PUT /api/iqubs/:iqubId/next-lottery-date` - Set lottery date
7. ✅ `GET /api/iqubs/:iqubId/rounds` - Get payment rounds
8. ✅ `GET /api/iqubs/:iqubId/rounds/:roundNumber` - Get round details
9. ✅ `PUT /api/iqubs/:iqubId/rounds/:roundId/verify` - Verify round

### Auth Routes
1. ✅ `POST /api/signup` - User signup
2. ✅ `POST /api/login` - User login
3. ✅ `GET /api/logout` - User logout
4. ✅ `GET /api/user` - Get user profile (collector)
5. ✅ `GET /api/profile` - Get user profile (member)

---

## 🔧 Solutions

### Option 1: Add Missing Backend Endpoints (Recommended)

Create the following endpoints in the backend:

#### 1. Member Dashboard Endpoint
```typescript
// wujo-backend-server/src/routes/member.routes.ts
router.get('/member/dashboard', authenticateToken, memberController.getDashboard);
```

**Response Structure:**
```json
{
  "data": {
    "totalSavings": 50000,
    "activeIqubs": 3,
    "completedIqubs": 1,
    "lotteryPosition": 5,
    "nextLotteryDate": "2024-12-25T10:00:00Z",
    "savingsPercentage": 75,
    "recentActivities": [
      {
        "id": "1",
        "type": "payment",
        "title": "Payment Made",
        "description": "Paid 1000 ETB to Family Savings",
        "timestamp": "2024-12-13T10:00:00Z"
      }
    ]
  }
}
```

#### 2. Discover Iqubs Endpoint
```typescript
// wujo-backend-server/src/routes/member.routes.ts
router.get('/iqubs/discover', authenticateToken, memberController.discoverIqubs);
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "iqub123",
      "name": "Family Savings",
      "savingAmount": 1000,
      "creditAmount": 10000,
      "membersCount": 10,
      "currentMembers": 7,
      "status": "active",
      "collectorName": "John Doe",
      "startDate": "2024-01-01"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### 3. Member Achievements Endpoint
```typescript
// wujo-backend-server/src/routes/member.routes.ts
router.get('/member/achievements', authenticateToken, memberController.getAchievements);
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "First Payment",
      "description": "Made your first payment",
      "icon": "star",
      "earnedDate": "2024-01-15",
      "isUnlocked": true
    }
  ]
}
```

#### 4. Payment History Endpoint
```typescript
// wujo-backend-server/src/routes/member.routes.ts
router.get('/member/payment-history', authenticateToken, memberController.getPaymentHistory);
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "payment123",
      "iqubName": "Family Savings",
      "amount": 1000,
      "date": "2024-12-01",
      "status": "completed",
      "receiptUrl": "https://..."
    }
  ]
}
```

---

### Option 2: Mock Data in Frontend (Temporary)

Add mock data interceptors in the frontend until backend is ready:

```typescript
// src/services/mockData.ts
export const mockDashboard = {
  data: {
    totalSavings: 50000,
    activeIqubs: 3,
    // ... mock data
  }
};

// In member.ts store
async fetchDashboard({ commit }: { commit: Commit }) {
  try {
    // Temporarily use mock data
    const response = { data: mockDashboard };
    // ... rest of logic
  }
}
```

---

## 🎯 Immediate Action Required

### For Frontend to Work:

1. **✅ DONE:** Fixed `/member/iqubs` → `/joinedIqubs`

2. **TODO:** Either:
   - Add 4 missing backend endpoints, OR
   - Add mock data for these endpoints in frontend

---

## 📝 Recommended Approach

1. **Short-term:** Use mock data in frontend for missing endpoints
2. **Long-term:** Implement proper backend endpoints with real data

This allows frontend development to continue while backend catches up.

---

## 🔍 How to Verify

### Check Backend Routes:
```bash
cd wujo-backend-server
grep -r "router.get\|router.post" src/routes/
```

### Check Frontend API Calls:
```bash
grep -r "apiService.get\|apiService.post" src/store/
```

---

**Status:** 1/5 endpoints fixed  
**Action Required:** Implement or mock 4 missing endpoints  
**Priority:** High (blocking member UI functionality)
