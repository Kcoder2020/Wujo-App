# Member Profile APIs

API documentation for the Member Profile feature endpoints.

**Base URL:** `/api`  
**Authentication:** All endpoints require Bearer token in Authorization header

---

## 1. GET /api/member/profile

Get the authenticated member's profile with aggregated statistics.

### Request

```http
GET /api/member/profile
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Abebe Kebede",
    "phone": "+251911234567",
    "email": "abebe@example.com",
    "avatar_url": "https://example.com/avatar.jpg",
    "join_date": "2024-01-15T10:30:00.000Z",
    "iqub_joined_count": 3,
    "lotteries_won_count": 1,
    "total_saved": 15000,
    "active_iqubs": 2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | User's unique ID |
| name | string | User's full name |
| phone | string | Phone number |
| email | string \| null | Email address (optional) |
| avatar_url | string \| null | Profile picture URL (optional) |
| join_date | string | ISO 8601 date when user registered |
| iqub_joined_count | number | Total number of Iqubs joined |
| lotteries_won_count | number | Total lotteries won across all Iqubs |
| total_saved | number | Total amount saved (successful payments) |
| active_iqubs | number | Number of currently active Iqubs |

### Error Responses

| Status | Message |
|--------|---------|
| 401 | Authentication required |
| 404 | User not found |

---

## 2. PUT /api/member/profile

Update the authenticated member's profile information.

### Request

```http
PUT /api/member/profile
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Abebe Kebede Updated",
  "phone": "+251911234568",
  "email": "abebe.new@example.com",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

### Request Body (all fields optional)

| Field | Type | Description |
|-------|------|-------------|
| name | string | New name (trimmed) |
| phone | string | New phone number (must be unique) |
| email | string | New email (validated format) |
| avatar_url | string | New profile picture URL |

### Response (200 OK)

Returns the complete updated profile with statistics (same format as GET /api/member/profile).

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Abebe Kebede Updated",
    "phone": "+251911234568",
    "email": "abebe.new@example.com",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "join_date": "2024-01-15T10:30:00.000Z",
    "iqub_joined_count": 3,
    "lotteries_won_count": 1,
    "total_saved": 15000,
    "active_iqubs": 2
  }
}
```

### Error Responses

| Status | Message |
|--------|---------|
| 400 | At least one field must be provided for update |
| 400 | Phone number already in use |
| 400 | Invalid email format |
| 401 | Authentication required |
| 404 | User not found |

---

## 3. GET /api/member/achievements

Get all achievements with earned status and progress for the authenticated member.

### Request

```http
GET /api/member/achievements
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "first-iqub",
      "title": "First Steps",
      "description": "Joined your first Iqub",
      "icon": "ribbon",
      "earned": true,
      "progress": 100,
      "earnedDate": "2024-12-30T10:00:00.000Z"
    },
    {
      "id": "lottery-winner",
      "title": "Lucky Winner",
      "description": "Won your first lottery",
      "icon": "trophy",
      "earned": true,
      "progress": 100,
      "earnedDate": "2024-12-30T10:00:00.000Z"
    },
    {
      "id": "iqub-veteran",
      "title": "Iqub Veteran",
      "description": "Joined 3 or more Iqubs",
      "icon": "medal",
      "earned": false,
      "progress": 66,
      "earnedDate": null
    },
    {
      "id": "consistent-saver",
      "title": "Consistent Saver",
      "description": "Made 10 successful payments",
      "icon": "star",
      "earned": false,
      "progress": 50,
      "earnedDate": null
    },
    {
      "id": "savings-streak",
      "title": "Savings Streak",
      "description": "Made 5 consecutive payments on time",
      "icon": "flame",
      "earned": false,
      "progress": 40,
      "earnedDate": null
    }
  ]
}
```

### Achievement Definitions

| ID | Title | Description | Icon | Criteria |
|----|-------|-------------|------|----------|
| first-iqub | First Steps | Joined your first Iqub | ribbon | iqub_joined_count >= 1 |
| savings-streak | Savings Streak | Made 5 consecutive payments on time | flame | 5 consecutive payments |
| lottery-winner | Lucky Winner | Won your first lottery | trophy | lotteries_won_count >= 1 |
| consistent-saver | Consistent Saver | Made 10 successful payments | star | total_payments >= 10 |
| iqub-veteran | Iqub Veteran | Joined 3 or more Iqubs | medal | iqub_joined_count >= 3 |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Achievement unique identifier |
| title | string | Display title |
| description | string | Achievement description |
| icon | string | Icon name (ribbon, flame, trophy, star, medal) |
| earned | boolean | Whether achievement is earned |
| progress | number | Progress percentage (0-100) |
| earnedDate | string \| null | ISO 8601 date when earned, null if not earned |

### Sorting

Achievements are sorted by:
1. Earned status (earned first)
2. Progress percentage (descending)

### Error Responses

| Status | Message |
|--------|---------|
| 401 | Authentication required |

---

## 4. GET /api/member/payment-history

Get complete payment history across all Iqubs for the authenticated member.

### Request

```http
GET /api/member/payment-history
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011_5_0",
      "iqubName": "Family Savings Group",
      "amount": 1000,
      "date": "2024-12-28T14:30:00.000Z",
      "status": "completed",
      "receiptUrl": "https://storage.example.com/receipts/abc123.jpg"
    },
    {
      "id": "507f1f77bcf86cd799439011_4_1",
      "iqubName": "Family Savings Group",
      "amount": 1000,
      "date": "2024-12-21T10:15:00.000Z",
      "status": "completed",
      "receiptUrl": null
    },
    {
      "id": "608f1f77bcf86cd799439022_2_2",
      "iqubName": "Office Iqub",
      "amount": 500,
      "date": "2024-12-20T09:00:00.000Z",
      "status": "pending"
    },
    {
      "id": "507f1f77bcf86cd799439011_3_3",
      "iqubName": "Family Savings Group",
      "amount": 1000,
      "date": "2024-12-14T11:45:00.000Z",
      "status": "failed"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique payment identifier |
| iqubName | string | Name of the Iqub |
| amount | number | Payment amount in ETB |
| date | string | ISO 8601 payment date |
| status | string | Payment status: "completed", "pending", or "failed" |
| receiptUrl | string \| undefined | Receipt image URL if available |

### Status Mapping

| Internal Status | API Response Status |
|-----------------|---------------------|
| success | completed |
| pending | pending |
| failed | failed |

### Sorting

Payments are sorted by date in descending order (newest first).

### Error Responses

| Status | Message |
|--------|---------|
| 401 | Authentication required |

---

## TypeScript Interfaces

```typescript
// Profile Response
interface MemberProfile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  join_date: string;
  iqub_joined_count: number;
  lotteries_won_count: number;
  total_saved: number;
  active_iqubs: number;
}

interface ProfileResponse {
  success: boolean;
  data: MemberProfile;
}

// Update Profile Request
interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
}

// Achievement Response
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'ribbon' | 'flame' | 'trophy' | 'star' | 'medal';
  earned: boolean;
  progress: number;
  earnedDate: string | null;
}

interface AchievementsResponse {
  success: boolean;
  data: Achievement[];
}

// Payment History Response
interface PaymentHistoryItem {
  id: string;
  iqubName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
}

interface PaymentHistoryResponse {
  success: boolean;
  data: PaymentHistoryItem[];
}

// Error Response
interface ErrorResponse {
  success: false;
  message: string;
}
```

---

## Example Client Usage (React/TypeScript)

```typescript
// API service
const API_BASE = 'https://api.example.com/api';

const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Get Profile
export const getMemberProfile = async (token: string): Promise<MemberProfile> => {
  const response = await fetch(`${API_BASE}/member/profile`, {
    headers: getAuthHeaders(token),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Update Profile
export const updateMemberProfile = async (
  token: string, 
  updates: UpdateProfileRequest
): Promise<MemberProfile> => {
  const response = await fetch(`${API_BASE}/member/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Get Achievements
export const getMemberAchievements = async (token: string): Promise<Achievement[]> => {
  const response = await fetch(`${API_BASE}/member/achievements`, {
    headers: getAuthHeaders(token),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Get Payment History
export const getPaymentHistory = async (token: string): Promise<PaymentHistoryItem[]> => {
  const response = await fetch(`${API_BASE}/member/payment-history`, {
    headers: getAuthHeaders(token),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```
