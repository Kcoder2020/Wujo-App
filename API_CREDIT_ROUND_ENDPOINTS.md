# Credit Round API Endpoints Documentation

## Quick Reference

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/iqubs/:iqubId/credit-round-status` | Get detailed current credit round status |
| GET | `/api/iqubs/:iqubId/credit-rounds-summary` | Get all credit rounds overview |

### Base URL
```
Production: https://api.yourapp.com
Development: http://localhost:3000
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

### Common Response Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not the collector of this Iqub |
| 404 | Not Found - Iqub doesn't exist |
| 500 | Internal Server Error |

---

## 1. Get Current Credit Round Status

### Endpoint
```
GET /api/iqubs/:iqubId/credit-round-status
```

### Description
Returns detailed status of the current credit round, including:
- Which saving rounds belong to the current credit round
- Per-member payment completion status for each saving round
- Overall completion percentage
- Whether lottery can be initiated
- Whether the Iqub is complete

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| iqubId | string | Yes | MongoDB ObjectId of the Iqub |

### Request Example

**cURL:**
```bash
curl -X GET \
  'https://api.example.com/api/iqubs/507f1f77bcf86cd799439011/credit-round-status' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**JavaScript/Fetch:**
```javascript
const response = await fetch(
  'https://api.example.com/api/iqubs/507f1f77bcf86cd799439011/credit-round-status',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
```

### Success Response (200 OK)

#### Scenario 1: Credit Round In Progress
```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Family Savings Iqub",
      "total_credit_rounds": 5,
      "saving_rounds_per_credit_round": 2
    },
    "is_iqub_complete": false,
    "current_credit_round": {
      "credit_round_number": 2,
      "saving_round_range": {
        "start": 3,
        "end": 4
      },
      "total_saving_rounds": 2,
      "completion_percentage": 62,
      "is_complete": false,
      "lottery_initiated": false,
      "can_initiate_lottery": false
    },
    "members": [
      {
        "member_id": "507f1f77bcf86cd799439012",
        "user_id": "507f1f77bcf86cd799439020",
        "name": "John Doe",
        "phone": "+251911110000",
        "contribution_type": "full",
        "saving_rounds": [
          {
            "saving_round_number": 3,
            "status": "verified",
            "amount": 500,
            "payment_date": "2025-12-20T10:30:00.000Z"
          },
          {
            "saving_round_number": 4,
            "status": "pending",
            "amount": 500,
            "payment_date": "2025-12-21T14:15:00.000Z"
          }
        ],
        "completed_count": 1,
        "required_count": 2,
        "is_complete": false
      }
    ]
  }
}
```

#### Scenario 2: Credit Round Complete (Ready for Lottery)
```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Family Savings Iqub",
      "total_credit_rounds": 5,
      "saving_rounds_per_credit_round": 2
    },
    "is_iqub_complete": false,
    "current_credit_round": {
      "credit_round_number": 1,
      "saving_round_range": {
        "start": 1,
        "end": 2
      },
      "total_saving_rounds": 2,
      "completion_percentage": 100,
      "is_complete": true,
      "lottery_initiated": false,
      "can_initiate_lottery": true
    },
    "members": [...]
  }
}
```

#### Scenario 3: Iqub Complete (All Credit Rounds Done)
```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Family Savings Iqub",
      "total_credit_rounds": 2,
      "saving_rounds_per_credit_round": 7
    },
    "is_iqub_complete": true,
    "current_credit_round": {
      "credit_round_number": 2,
      "saving_round_range": {
        "start": 8,
        "end": 14
      },
      "total_saving_rounds": 7,
      "completion_percentage": 100,
      "is_complete": true,
      "lottery_initiated": true,
      "can_initiate_lottery": false
    },
    "members": [...]
  }
}
```

### Response Fields

#### Root Level
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful requests |
| data | object | Contains all credit round status data |

#### data.iqub
| Field | Type | Description |
|-------|------|-------------|
| id | string | Iqub MongoDB ObjectId |
| name | string | Iqub name |
| total_credit_rounds | number | Total number of credit rounds configured |
| saving_rounds_per_credit_round | number | Saving rounds needed per credit round |

#### data (root)
| Field | Type | Description |
|-------|------|-------------|
| is_iqub_complete | boolean | Whether all credit rounds are complete with lotteries |

#### data.current_credit_round
| Field | Type | Description |
|-------|------|-------------|
| credit_round_number | number | Current credit round number (capped at total) |
| saving_round_range.start | number | First saving round for this credit round |
| saving_round_range.end | number | Last saving round for this credit round |
| total_saving_rounds | number | Total saving rounds in this credit round |
| completion_percentage | number | Percentage of payments completed (0-100) |
| is_complete | boolean | Whether all members completed all saving rounds |
| lottery_initiated | boolean | Whether lottery has been run for this credit round |
| can_initiate_lottery | boolean | True only if complete AND lottery not initiated AND iqub not complete |

#### data.members[]
| Field | Type | Description |
|-------|------|-------------|
| member_id | string | Member MongoDB ObjectId |
| user_id | string | User MongoDB ObjectId |
| name | string | Member's full name |
| phone | string | Member's phone number |
| contribution_type | string | "full" or "half" |
| saving_rounds | array | Array of saving round payment statuses |
| completed_count | number | Verified saving rounds count |
| required_count | number | Required saving rounds count |
| is_complete | boolean | Whether member completed all required rounds |

#### data.members[].saving_rounds[]
| Field | Type | Description |
|-------|------|-------------|
| saving_round_number | number | The saving round number |
| status | string | "not_started", "pending", "verified", "failed" |
| amount | number | Payment amount (0 if not_started) |
| payment_date | string\|null | ISO 8601 date string or null |

---

## 2. Get All Credit Rounds Summary

### Endpoint
```
GET /api/iqubs/:iqubId/credit-rounds-summary
```

### Description
Returns a summary of all credit rounds for the Iqub, showing completion and lottery status for each.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| iqubId | string | Yes | MongoDB ObjectId of the Iqub |

### Request Example

**cURL:**
```bash
curl -X GET \
  'https://api.example.com/api/iqubs/507f1f77bcf86cd799439011/credit-rounds-summary' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Family Savings Iqub",
      "total_credit_rounds": 5,
      "saving_rounds_per_credit_round": 2
    },
    "is_iqub_complete": false,
    "credit_rounds": [
      {
        "credit_round_number": 1,
        "saving_round_range": { "start": 1, "end": 2 },
        "is_complete": true,
        "lottery_initiated": true,
        "can_initiate_lottery": false
      },
      {
        "credit_round_number": 2,
        "saving_round_range": { "start": 3, "end": 4 },
        "is_complete": true,
        "lottery_initiated": false,
        "can_initiate_lottery": true
      },
      {
        "credit_round_number": 3,
        "saving_round_range": { "start": 5, "end": 6 },
        "is_complete": false,
        "lottery_initiated": false,
        "can_initiate_lottery": false
      },
      {
        "credit_round_number": 4,
        "saving_round_range": { "start": 7, "end": 8 },
        "is_complete": false,
        "lottery_initiated": false,
        "can_initiate_lottery": false
      },
      {
        "credit_round_number": 5,
        "saving_round_range": { "start": 9, "end": 10 },
        "is_complete": false,
        "lottery_initiated": false,
        "can_initiate_lottery": false
      }
    ]
  }
}
```

### Response Fields

#### data.credit_rounds[]
| Field | Type | Description |
|-------|------|-------------|
| credit_round_number | number | Credit round number (1, 2, 3, ...) |
| saving_round_range.start | number | First saving round for this credit round |
| saving_round_range.end | number | Last saving round for this credit round |
| is_complete | boolean | Whether all members completed all saving rounds |
| lottery_initiated | boolean | Whether lottery has been run for this credit round |
| can_initiate_lottery | boolean | True only if complete AND lottery not initiated |

---

## TypeScript Interfaces

```typescript
interface CreditRoundStatusResponse {
  success: boolean;
  data: {
    iqub: {
      id: string;
      name: string;
      total_credit_rounds: number;
      saving_rounds_per_credit_round: number;
    };
    is_iqub_complete: boolean;
    current_credit_round: {
      credit_round_number: number;
      saving_round_range: { start: number; end: number };
      total_saving_rounds: number;
      completion_percentage: number;
      is_complete: boolean;
      lottery_initiated: boolean;
      can_initiate_lottery: boolean;
    };
    members: Array<{
      member_id: string;
      user_id: string;
      name: string;
      phone: string;
      contribution_type: 'full' | 'half';
      saving_rounds: Array<{
        saving_round_number: number;
        status: 'not_started' | 'pending' | 'verified' | 'failed';
        amount: number;
        payment_date: string | null;
      }>;
      completed_count: number;
      required_count: number;
      is_complete: boolean;
    }>;
  };
}

interface CreditRoundsSummaryResponse {
  success: boolean;
  data: {
    iqub: {
      id: string;
      name: string;
      total_credit_rounds: number;
      saving_rounds_per_credit_round: number;
    };
    is_iqub_complete: boolean;
    credit_rounds: Array<{
      credit_round_number: number;
      saving_round_range: { start: number; end: number };
      is_complete: boolean;
      lottery_initiated: boolean;
      can_initiate_lottery: boolean;
    }>;
  };
}
```

---

## Error Responses

### 401 Unauthorized
```json
{ "success": false, "message": "Authentication required" }
```

### 403 Forbidden
```json
{ "success": false, "message": "Access denied" }
```

### 404 Not Found
```json
{ "success": false, "message": "Iqub not found" }
```

---

## Key Business Logic

1. **Credit Round Capping**: `current_credit_round` is NEVER greater than `total_credit_rounds`
2. **Iqub Complete**: When all saving rounds are done, `is_iqub_complete: true` and shows last credit round data
3. **Lottery Eligibility**: `can_initiate_lottery` is true ONLY when:
   - `is_complete: true` (all members paid all saving rounds)
   - `lottery_initiated: false` (lottery not yet run)
   - `is_iqub_complete: false` (iqub still active)
4. **Status Values**: Only `verified` status counts toward completion


---

## 3. Get All Credit Rounds for Lottery View (NEW)

### Endpoint
```
GET /api/iqubs/:iqubId/lottery/credit-rounds
```

### Description
Returns **ALL credit rounds** with detailed status including member payment info for each round. This is designed for the lottery section where collectors need to see:
- All credit rounds (not just the current one)
- Which rounds are complete and eligible for lottery
- Which rounds have already had lottery initiated
- Lottery winner info for completed rounds

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| iqubId | string | Yes | MongoDB ObjectId of the Iqub |

### Request Example

**cURL:**
```bash
curl -X GET \
  'https://api.example.com/api/iqubs/6953b9f67855b691443b326b/lottery/credit-rounds' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "6953b9f67855b691443b326b",
      "name": "Wujo Short Iqub Test",
      "total_credit_rounds": 2,
      "saving_rounds_per_credit_round": 3,
      "credit_amount": 6000
    },
    "is_iqub_complete": false,
    "credit_rounds": [
      {
        "credit_round_number": 1,
        "saving_round_range": { "start": 1, "end": 3 },
        "total_saving_rounds": 3,
        "completion_percentage": 100,
        "is_complete": true,
        "lottery_initiated": false,
        "can_initiate_lottery": true,
        "lottery_winner": null,
        "members": [
          {
            "member_id": "6953ba0d7855b691443b3279",
            "user_id": "693d2e0da299450ff00c2d2e",
            "name": "million girmay",
            "phone": "+251991883459",
            "contribution_type": "full",
            "saving_rounds": [
              { "saving_round_number": 1, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." },
              { "saving_round_number": 2, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." },
              { "saving_round_number": 3, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." }
            ],
            "completed_count": 3,
            "required_count": 3,
            "is_complete": true
          },
          {
            "member_id": "6953ba2a7855b691443b328f",
            "user_id": "6953095e64640db1af2cc574",
            "name": "Test Member",
            "phone": "+251909090909",
            "contribution_type": "full",
            "saving_rounds": [
              { "saving_round_number": 1, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." },
              { "saving_round_number": 2, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." },
              { "saving_round_number": 3, "status": "verified", "amount": 1000, "payment_date": "2025-12-30T..." }
            ],
            "completed_count": 3,
            "required_count": 3,
            "is_complete": true
          }
        ]
      },
      {
        "credit_round_number": 2,
        "saving_round_range": { "start": 4, "end": 6 },
        "total_saving_rounds": 3,
        "completion_percentage": 0,
        "is_complete": false,
        "lottery_initiated": false,
        "can_initiate_lottery": false,
        "lottery_winner": null,
        "members": [
          {
            "member_id": "6953ba0d7855b691443b3279",
            "user_id": "693d2e0da299450ff00c2d2e",
            "name": "million girmay",
            "phone": "+251991883459",
            "contribution_type": "full",
            "saving_rounds": [
              { "saving_round_number": 4, "status": "not_started", "amount": 0, "payment_date": null },
              { "saving_round_number": 5, "status": "not_started", "amount": 0, "payment_date": null },
              { "saving_round_number": 6, "status": "not_started", "amount": 0, "payment_date": null }
            ],
            "completed_count": 0,
            "required_count": 3,
            "is_complete": false
          },
          {
            "member_id": "6953ba2a7855b691443b328f",
            "user_id": "6953095e64640db1af2cc574",
            "name": "Test Member",
            "phone": "+251909090909",
            "contribution_type": "full",
            "saving_rounds": [
              { "saving_round_number": 4, "status": "not_started", "amount": 0, "payment_date": null },
              { "saving_round_number": 5, "status": "not_started", "amount": 0, "payment_date": null },
              { "saving_round_number": 6, "status": "not_started", "amount": 0, "payment_date": null }
            ],
            "completed_count": 0,
            "required_count": 3,
            "is_complete": false
          }
        ]
      }
    ]
  }
}
```

### Response After Lottery Initiated

When lottery has been initiated for a credit round, `lottery_winner` will contain winner info:

```json
{
  "credit_round_number": 1,
  "is_complete": true,
  "lottery_initiated": true,
  "can_initiate_lottery": false,
  "lottery_winner": {
    "lottery_id": "6953c1234567890abcdef",
    "winner_id": "693d2e0da299450ff00c2d2e",
    "winner_name": "million girmay",
    "credit_amount": 6000,
    "is_pair": false,
    "pair_winner_id": null,
    "pair_winner_name": null,
    "lottery_date": "2025-12-30T12:00:00.000Z"
  },
  "members": [...]
}
```

### Response Fields

#### data.credit_rounds[]
| Field | Type | Description |
|-------|------|-------------|
| credit_round_number | number | Credit round number (1, 2, 3, ...) |
| saving_round_range | object | Start and end saving round numbers |
| total_saving_rounds | number | Total saving rounds in this credit round |
| completion_percentage | number | Percentage of payments completed (0-100) |
| is_complete | boolean | Whether all members completed all saving rounds |
| lottery_initiated | boolean | Whether lottery has been run |
| can_initiate_lottery | boolean | True if complete AND lottery not initiated |
| lottery_winner | object\|null | Winner info if lottery was initiated |
| members | array | Detailed member payment status |

#### data.credit_rounds[].lottery_winner (when present)
| Field | Type | Description |
|-------|------|-------------|
| lottery_id | string | Lottery record ID |
| winner_id | string | Winner's user ID |
| winner_name | string | Winner's name |
| credit_amount | number | Credit amount won |
| is_pair | boolean | Whether winners are a half-contributor pair |
| pair_winner_id | string\|null | Second winner ID (if pair) |
| pair_winner_name | string\|null | Second winner name (if pair) |
| lottery_date | string | ISO 8601 date when lottery was initiated |

---

## TypeScript Interface for Lottery View

```typescript
interface CreditRoundsForLotteryResponse {
  success: boolean;
  data: {
    iqub: {
      id: string;
      name: string;
      total_credit_rounds: number;
      saving_rounds_per_credit_round: number;
      credit_amount: number;
    };
    is_iqub_complete: boolean;
    credit_rounds: Array<{
      credit_round_number: number;
      saving_round_range: { start: number; end: number };
      total_saving_rounds: number;
      completion_percentage: number;
      is_complete: boolean;
      lottery_initiated: boolean;
      can_initiate_lottery: boolean;
      lottery_winner: {
        lottery_id: string;
        winner_id: string;
        winner_name: string;
        credit_amount: number;
        is_pair: boolean;
        pair_winner_id: string | null;
        pair_winner_name: string | null;
        lottery_date: string;
      } | null;
      members: Array<{
        member_id: string;
        user_id: string;
        name: string;
        phone: string;
        contribution_type: 'full' | 'half';
        saving_rounds: Array<{
          saving_round_number: number;
          status: 'not_started' | 'pending' | 'verified' | 'failed';
          amount: number;
          payment_date: string | null;
        }>;
        completed_count: number;
        required_count: number;
        is_complete: boolean;
      }>;
    }>;
  };
}
```

---

## Endpoints Summary

| Endpoint | Use Case |
|----------|----------|
| `/api/iqubs/:iqubId/credit-round-status` | Dashboard view - current credit round only |
| `/api/iqubs/:iqubId/credit-rounds-summary` | Quick overview - all rounds, minimal data |
| `/api/iqubs/:iqubId/lottery/credit-rounds` | **Lottery view - all rounds with full details** |
