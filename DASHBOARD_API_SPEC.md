# Collector Dashboard API Specification

## Endpoint

```
GET /api/collector/dashboard
```

## Authentication
Requires collector authentication token in header:
```
Authorization: Bearer <token>
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "overview": {
    "total_collected": 520000,
    "total_members": 45,
    "total_iqubs": 3,
    "hosted_lotteries": 12
  },
  "recent_activities": [
    {
      "id": 1,
      "type": "lottery",
      "title": "Lottery Winner Announced",
      "description": "Abebe Kebede won the lottery for Damay Iqub",
      "timestamp": "2025-12-29T10:30:00Z"
    },
    {
      "id": 2,
      "type": "payment",
      "title": "Payment Received",
      "description": "5 members paid their monthly contribution",
      "timestamp": "2025-12-29T08:15:00Z"
    },
    {
      "id": 3,
      "type": "member",
      "title": "New Member Joined",
      "description": "Tigist Alemu joined Damay Iqub",
      "timestamp": "2025-12-28T14:20:00Z"
    },
    {
      "id": 4,
      "type": "iqub_created",
      "title": "New Iqub Created",
      "description": "Habesha Iqub was created",
      "timestamp": "2025-12-27T09:00:00Z"
    }
  ],
  "monthly_collections": {
    "period": "3months",
    "data": [
      {
        "month": "Oct",
        "amount": 150000,
        "target": 200000
      },
      {
        "month": "Nov",
        "amount": 180000,
        "target": 200000
      },
      {
        "month": "Dec",
        "amount": 190000,
        "target": 200000
      }
    ]
  }
}
```

---

## Data Field Descriptions

### Overview Object

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| `total_collected` | number | Total amount collected across all Iqubs | `SUM(iqubs.total_collected)` |
| `total_members` | number | Total unique members across all Iqubs | `COUNT(DISTINCT member_id)` |
| `total_iqubs` | number | Total count of ALL Iqubs (active + pending + completed) | `COUNT(iqubs.id)` |
| `hosted_lotteries` | number | Total lotteries completed across all Iqubs | `SUM(iqubs.completed_credit_rounds)` |

### Recent Activities Array

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `id` | number | Unique activity ID | Auto-increment |
| `type` | string | Activity type | `"lottery"`, `"payment"`, `"member"`, `"iqub_created"` |
| `title` | string | Activity title | Short description |
| `description` | string | Activity details | Detailed description |
| `timestamp` | string | ISO 8601 timestamp | `"2025-12-29T10:30:00Z"` |

**Activity Types:**
- `lottery` - Lottery winner announced
- `payment` - Payment received/verified
- `member` - Member joined/left
- `iqub_created` - New Iqub created

**Sorting:** Most recent first (DESC by timestamp)
**Limit:** Return last 5-10 activities

### Monthly Collections Object

| Field | Type | Description |
|-------|------|-------------|
| `period` | string | Time period | `"1month"`, `"3months"`, `"6months"` |
| `data` | array | Collection data points | Array of monthly data |

**Monthly Data Point:**
| Field | Type | Description |
|-------|------|-------------|
| `month` | string | Month abbreviation | `"Jan"`, `"Feb"`, `"Mar"`, etc. |
| `amount` | number | Total collected in that month | Sum of payments |
| `target` | number (optional) | Target amount for that month | Can be null |

---

## SQL Queries

### Total Collected
```sql
SELECT COALESCE(SUM(total_collected), 0) as total_collected
FROM iqubs
WHERE collector_id = ?
```

### Total Members
```sql
SELECT COUNT(DISTINCT im.user_id) as total_members
FROM iqub_members im
JOIN iqubs i ON im.iqub_id = i.id
WHERE i.collector_id = ?
```

### Total Iqubs
```sql
SELECT COUNT(*) as total_iqubs
FROM iqubs
WHERE collector_id = ?
```

### Hosted Lotteries
```sql
SELECT COALESCE(SUM(completed_credit_rounds), 0) as hosted_lotteries
FROM iqubs
WHERE collector_id = ?
```

### Recent Activities
```sql
-- This is a UNION of different activity types
-- Lottery activities
SELECT 
  CONCAT('lottery_', l.id) as id,
  'lottery' as type,
  'Lottery Winner Announced' as title,
  CONCAT(m.name, ' won the lottery for ', i.name) as description,
  l.created_at as timestamp
FROM lotteries l
JOIN iqubs i ON l.iqub_id = i.id
JOIN members m ON l.winner_member_id = m.id
WHERE i.collector_id = ?

UNION ALL

-- Payment activities
SELECT 
  CONCAT('payment_', p.id) as id,
  'payment' as type,
  'Payment Received' as title,
  CONCAT(COUNT(*), ' members paid their contribution') as description,
  MAX(p.verified_at) as timestamp
FROM payments p
JOIN iqubs i ON p.iqub_id = i.id
WHERE i.collector_id = ?
  AND p.status = 'verified'
GROUP BY DATE(p.verified_at)

UNION ALL

-- Member join activities
SELECT 
  CONCAT('member_', im.id) as id,
  'member' as type,
  'New Member Joined' as title,
  CONCAT(m.name, ' joined ', i.name) as description,
  im.join_date as timestamp
FROM iqub_members im
JOIN iqubs i ON im.iqub_id = i.id
JOIN members m ON im.user_id = m.user_id
WHERE i.collector_id = ?

UNION ALL

-- Iqub creation activities
SELECT 
  CONCAT('iqub_', i.id) as id,
  'iqub_created' as type,
  'New Iqub Created' as title,
  CONCAT(i.name, ' was created') as description,
  i.created_at as timestamp
FROM iqubs i
WHERE i.collector_id = ?

ORDER BY timestamp DESC
LIMIT 10
```

### Monthly Collections (3 months example)
```sql
SELECT 
  DATE_FORMAT(p.payment_date, '%b') as month,
  COALESCE(SUM(p.amount), 0) as amount,
  NULL as target  -- Target can be calculated or set to NULL
FROM payments p
JOIN iqubs i ON p.iqub_id = i.id
WHERE i.collector_id = ?
  AND p.status = 'verified'
  AND p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m')
ORDER BY p.payment_date ASC
```

**For different periods:**
- `1month`: `INTERVAL 1 MONTH`
- `3months`: `INTERVAL 3 MONTH`
- `6months`: `INTERVAL 6 MONTH`

---

## Optional: Period-Specific Endpoint

If you want to support dynamic period selection:

```
GET /api/collector/dashboard/collections?period=3months
```

**Query Parameters:**
- `period` (optional): `1month`, `3months`, `6months` (default: `3months`)

**Response:**
```json
{
  "period": "3months",
  "data": [
    { "month": "Oct", "amount": 150000, "target": 200000 },
    { "month": "Nov", "amount": 180000, "target": 200000 },
    { "month": "Dec", "amount": 190000, "target": 200000 }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "User is not a collector"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch dashboard data"
}
```

---

## Implementation Notes

### Performance Considerations
1. **Caching**: Consider caching dashboard data for 5-10 minutes
2. **Indexing**: Ensure indexes on:
   - `iqubs.collector_id`
   - `iqub_members.iqub_id`
   - `payments.iqub_id`
   - `payments.payment_date`
   - `payments.status`

### Data Consistency
1. Use transactions for calculations
2. Handle NULL values with `COALESCE`
3. Ensure timestamp format is ISO 8601

### Activity Feed Logic
1. Limit to last 10 activities
2. Sort by timestamp DESC
3. Include diverse activity types
4. Format descriptions consistently

### Monthly Collections Logic
1. Group by year-month to avoid duplicates
2. Fill missing months with 0 amounts
3. Calculate targets based on business logic
4. Return months in chronological order

---

## Testing

### Test Cases

1. **Empty Dashboard** (New collector with no Iqubs)
```json
{
  "overview": {
    "total_collected": 0,
    "total_members": 0,
    "total_iqubs": 0,
    "hosted_lotteries": 0
  },
  "recent_activities": [],
  "monthly_collections": {
    "period": "3months",
    "data": []
  }
}
```

2. **Single Iqub** (Collector with one active Iqub)
3. **Multiple Iqubs** (Collector with multiple Iqubs)
4. **Historical Data** (Collector with completed Iqubs)

---

## Frontend Integration

The frontend is ready to consume this API. See `COLLECTOR_DASHBOARD_IMPLEMENTATION_COMPLETE.md` for integration details.

**TypeScript Interface:**
```typescript
interface CollectorDashboardData {
  overview: {
    total_collected: number;
    total_members: number;
    total_iqubs: number;
    hosted_lotteries: number;
  };
  recent_activities: Array<{
    id: number;
    type: "lottery" | "payment" | "member" | "iqub_created";
    title: string;
    description: string;
    timestamp: string;
  }>;
  monthly_collections: {
    period: "1month" | "3months" | "6months";
    data: Array<{
      month: string;
      amount: number;
      target?: number;
    }>;
  };
}
```

---

**Status**: Ready for backend implementation
