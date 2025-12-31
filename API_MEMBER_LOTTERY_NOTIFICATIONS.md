# Member Lottery Notification API

## Overview

These endpoints allow members to receive lottery result notifications and view spin wheel data.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/member/notifications/count` | Get count of unviewed lottery results |
| GET | `/api/member/lottery/unviewed` | Get all unviewed lottery results |
| GET | `/api/member/lottery/:lotteryId` | Get specific lottery result with spin wheel data |
| POST | `/api/member/lottery/:lotteryId/viewed` | Mark lottery as viewed |

---

## 1. Get Notification Count

### Endpoint
```
GET /api/member/notifications/count
```

### Description
Returns the count of unviewed lottery results across all Iqubs the member belongs to. Use this on app open to show notification badge.

### Response
```json
{
  "success": true,
  "data": {
    "unviewed_lottery_results": 2
  }
}
```

---

## 2. Get Unviewed Lottery Results

### Endpoint
```
GET /api/member/lottery/unviewed
```

### Description
Returns all lottery results the member hasn't viewed yet. Perfect for showing a list of new lottery notifications.

### Response
```json
{
  "success": true,
  "data": [
    {
      "lottery_id": "6953c1234567890abcdef",
      "iqub_id": "6953b9f67855b691443b326b",
      "iqub_name": "Wujo Short Iqub Test",
      "credit_round_number": 1,
      "credit_amount": 6000,
      "lottery_date": "2025-12-30T14:30:00.000Z",
      "winner": {
        "user_id": "693d2e0da299450ff00c2d2e",
        "name": "million girmay",
        "is_pair": false,
        "pair_user_id": null,
        "pair_name": null
      },
      "participants": [
        {
          "user_id": "693d2e0da299450ff00c2d2e",
          "name": "million girmay",
          "contribution_type": "full",
          "paired_with_name": null
        },
        {
          "user_id": "6953095e64640db1af2cc574",
          "name": "Test Member",
          "contribution_type": "full",
          "paired_with_name": null
        }
      ],
      "is_viewed": false,
      "is_winner": true
    }
  ]
}
```

---

## 3. Get Lottery Result (Spin Wheel Data)

### Endpoint
```
GET /api/member/lottery/:lotteryId
```

### Description
Returns detailed lottery result including all participants for spin wheel animation.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lotteryId | string | Yes | MongoDB ObjectId of the lottery |

### Response
```json
{
  "success": true,
  "data": {
    "lottery_id": "6953c1234567890abcdef",
    "iqub_id": "6953b9f67855b691443b326b",
    "iqub_name": "Wujo Short Iqub Test",
    "credit_round_number": 1,
    "credit_amount": 6000,
    "lottery_date": "2025-12-30T14:30:00.000Z",
    "winner": {
      "user_id": "693d2e0da299450ff00c2d2e",
      "name": "million girmay",
      "is_pair": false,
      "pair_user_id": null,
      "pair_name": null
    },
    "participants": [
      {
        "user_id": "693d2e0da299450ff00c2d2e",
        "name": "million girmay",
        "contribution_type": "full",
        "paired_with_name": null
      },
      {
        "user_id": "6953095e64640db1af2cc574",
        "name": "Test Member",
        "contribution_type": "full",
        "paired_with_name": null
      }
    ],
    "is_viewed": false,
    "is_winner": true
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| lottery_id | string | Lottery record ID |
| iqub_id | string | Iqub ID |
| iqub_name | string | Iqub name |
| credit_round_number | number | Which credit round this lottery was for |
| credit_amount | number | Total credit amount won |
| lottery_date | string | ISO 8601 date when lottery was initiated |
| winner | object | Winner information |
| participants | array | All eligible members at draw time (for spin wheel) |
| is_viewed | boolean | Whether this user has viewed this result |
| is_winner | boolean | Whether the requesting user won |

### Participants Array (for Spin Wheel)

Each participant object contains:
| Field | Type | Description |
|-------|------|-------------|
| user_id | string | User ID |
| name | string | User's name (display on wheel) |
| contribution_type | string | "full" or "half" |
| paired_with_name | string\|null | For half contributors, their pair's name |

---

## 4. Mark Lottery as Viewed

### Endpoint
```
POST /api/member/lottery/:lotteryId/viewed
```

### Description
Marks a lottery result as viewed by the member. Call this after showing the spin wheel animation.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lotteryId | string | Yes | MongoDB ObjectId of the lottery |

### Response
```json
{
  "success": true,
  "message": "Lottery marked as viewed"
}
```

---

## Client Integration Flow

### 1. On App Open
```javascript
// Check for new notifications
const countResponse = await fetch('/api/member/notifications/count', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await countResponse.json();

if (data.unviewed_lottery_results > 0) {
  // Show notification badge
  showBadge(data.unviewed_lottery_results);
}
```

### 2. When User Clicks Notification
```javascript
// Get unviewed lottery results
const response = await fetch('/api/member/lottery/unviewed', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: lotteries } = await response.json();

// Show list of new lottery results
showLotteryNotificationList(lotteries);
```

### 3. When User Selects a Lottery Result
```javascript
// Get full lottery data for spin wheel
const response = await fetch(`/api/member/lottery/${lotteryId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: lottery } = await response.json();

// Show spin wheel with participants
showSpinWheel(lottery.participants, lottery.winner);
```

### 4. After Spin Wheel Animation Completes
```javascript
// Mark as viewed
await fetch(`/api/member/lottery/${lotteryId}/viewed`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Update notification count
refreshNotificationCount();
```

---

## Spin Wheel Implementation Tips

1. **Participants Array**: Use `participants` array to populate wheel segments
2. **Winner Highlight**: Use `winner.user_id` to know which segment to land on
3. **Pair Winners**: If `winner.is_pair` is true, highlight both winner segments
4. **Half Contributors**: Show `paired_with_name` in tooltip for half contributors
5. **Animation**: Spin wheel, then land on winner segment, then show result modal

### Example Spin Wheel Data Usage
```javascript
// Build wheel segments from participants
const segments = lottery.participants.map(p => ({
  id: p.user_id,
  label: p.name,
  color: p.contribution_type === 'full' ? '#4CAF50' : '#FFC107',
  tooltip: p.paired_with_name ? `Paired with ${p.paired_with_name}` : null
}));

// Find winner segment index
const winnerIndex = segments.findIndex(s => s.id === lottery.winner.user_id);

// Animate wheel to land on winnerIndex
spinWheel(segments, winnerIndex);
```

---

## TypeScript Interfaces

```typescript
interface NotificationCount {
  unviewed_lottery_results: number;
}

interface LotteryParticipant {
  user_id: string;
  name: string;
  contribution_type: 'full' | 'half';
  paired_with_name: string | null;
}

interface LotteryWinner {
  user_id: string;
  name: string;
  is_pair: boolean;
  pair_user_id: string | null;
  pair_name: string | null;
}

interface MemberLotteryResult {
  lottery_id: string;
  iqub_id: string;
  iqub_name: string;
  credit_round_number: number;
  credit_amount: number;
  lottery_date: string;
  winner: LotteryWinner;
  participants: LotteryParticipant[];
  is_viewed: boolean;
  is_winner: boolean;
}
```
