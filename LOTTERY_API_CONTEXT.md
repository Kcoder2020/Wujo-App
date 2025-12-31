# Lottery API - Server Context & Frontend Expectations

## Overview

This document outlines the complete API architecture for the Lottery Spin Wheel feature, including:
- Current server implementation status
- Required API endpoints (existing and missing)
- Expected request/response formats
- Frontend integration requirements

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Vue.js + Ionic)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  IqubDetailPage.vue                                                         │
│  ├── Lottery Tab                                                            │
│  │   ├── CreditRoundCard.vue (displays credit round status)                 │
│  │   └── Lottery History Section                                            │
│  │                                                                          │
│  └── LotterySpinModal.vue                                                   │
│      ├── SpinWheel.vue (animated wheel)                                     │
│      └── WinnerAnnouncement.vue (confetti celebration)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                           VUEX STORE (iqubs module)                         │
│  ├── State: lotteryHistory, currentLotteryResult, isInitiatingLottery       │
│  ├── Actions: initiateLottery, fetchLotteryHistory                          │
│  └── Getters: lotteryHistory, currentLotteryResult                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Express.js + MongoDB)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Routes: collector.routes.ts                                                │
│  ├── POST /api/iqubs/:iqubId/lottery/initiate     ✅ EXISTS                 │
│  ├── GET  /api/iqubs/:iqubId/lottery/history      ❌ MISSING                │
│  ├── GET  /api/iqubs/:iqubId/credit-round-status  ✅ EXISTS                 │
│  └── GET  /api/iqubs/:iqubId/lottery/eligible     ❌ MISSING (optional)     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Controllers: collector.controller.ts                                       │
│  ├── initiateLottery()                            ✅ EXISTS (needs update)  │
│  ├── getLotteryHistory()                          ❌ MISSING                │
│  └── getEligibleMembers()                         ❌ MISSING (optional)     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Services: lottery.service.ts                                               │
│  ├── initiateLottery()                            ✅ EXISTS (needs update)  │
│  ├── getLotteryHistory()                          ❌ MISSING                │
│  └── getEligibleMembers()                         ❌ MISSING (optional)     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Repository: lottery.repository.ts                                          │
│  ├── createLottery()                              ✅ EXISTS                 │
│  ├── findLotteriesByIqubId()                      ✅ EXISTS                 │
│  └── findLatestLotteryByIqubId()                  ✅ EXISTS                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Model: Lottery.model.ts                                                    │
│  ├── iqub_id                                      ✅ EXISTS                 │
│  ├── round_number                                 ✅ EXISTS                 │
│  ├── winner_id                                    ✅ EXISTS                 │
│  ├── lottery_date                                 ✅ EXISTS                 │
│  ├── credit_round_number                          ❌ MISSING                │
│  ├── credit_amount                                ❌ MISSING                │
│  ├── is_pair                                      ❌ MISSING                │
│  └── pair_winner_id                               ❌ MISSING                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Specification

### 1. Initiate Lottery ✅ EXISTS (Needs Enhancement)

**Endpoint:** `POST /api/iqubs/:iqubId/lottery/initiate`

**Current Implementation:**
- Selects random winner from eligible members
- Creates lottery record
- Updates member's `has_won` flag
- Returns simple success message

**Required Enhancement:**
- Return winner details in response (for spin wheel animation)
- Support half contributor pairing
- Track credit round number (not just round number)
- Return credit amount won

#### Request
```http
POST /api/iqubs/69517bd6a919f5466478ccf2/lottery/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "credit_round_number": 1  // Optional - defaults to current credit round
}
```

#### Response (Single Winner)
```json
{
  "success": true,
  "data": {
    "lottery_id": "lottery_abc123",
    "winner": {
      "member_id": "member_xyz789",
      "name": "Abebe Kebede",
      "credit_amount": 10000
    },
    "credit_round_number": 1,
    "is_pair": false
  }
}
```

#### Response (Pair Winners - Half Contributors)
```json
{
  "success": true,
  "data": {
    "lottery_id": "lottery_abc123",
    "winners": [
      {
        "member_id": "member_xyz789",
        "name": "Abebe Kebede",
        "credit_amount": 5000
      },
      {
        "member_id": "member_def456",
        "name": "Sara Tesfaye",
        "credit_amount": 5000
      }
    ],
    "credit_round_number": 1,
    "is_pair": true
  }
}
```

#### Error Responses
```json
// 400 - Not eligible
{
  "success": false,
  "message": "Cannot initiate lottery: not all members have completed required saving rounds",
  "error_code": "LOTTERY_NOT_ELIGIBLE"
}

// 400 - Already initiated
{
  "success": false,
  "message": "Lottery has already been initiated for this credit round",
  "error_code": "LOTTERY_ALREADY_INITIATED"
}

// 400 - No eligible members
{
  "success": false,
  "message": "No eligible members for lottery",
  "error_code": "NO_ELIGIBLE_MEMBERS"
}
```

---

### 2. Get Lottery History ❌ MISSING (Required)

**Endpoint:** `GET /api/iqubs/:iqubId/lottery/history`

**Purpose:** Retrieve all completed lotteries for an Iqub to display in the lottery history section.

#### Request
```http
GET /api/iqubs/69517bd6a919f5466478ccf2/lottery/history
Authorization: Bearer <token>
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "lottery_abc123",
      "iqub_id": "69517bd6a919f5466478ccf2",
      "credit_round_number": 2,
      "winner_member_id": "member_xyz789",
      "winner_name": "Abebe Kebede",
      "credit_amount": 10000,
      "is_pair": false,
      "pair_member_id": null,
      "pair_member_name": null,
      "initiated_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": "lottery_def456",
      "iqub_id": "69517bd6a919f5466478ccf2",
      "credit_round_number": 1,
      "winner_member_id": "member_abc123",
      "winner_name": "Sara Tesfaye",
      "credit_amount": 5000,
      "is_pair": true,
      "pair_member_id": "member_ghi789",
      "pair_member_name": "Dawit Haile",
      "initiated_at": "2025-01-01T14:00:00Z"
    }
  ]
}
```

---

### 3. Get Credit Round Status ✅ EXISTS

**Endpoint:** `GET /api/iqubs/:iqubId/credit-round-status`

**Current Implementation:** Returns credit round completion status with member payment details.

**Frontend Usage:** Used to determine lottery eligibility and display credit round cards.

#### Response (Already Implemented)
```json
{
  "success": true,
  "data": {
    "iqub": {
      "id": "69517bd6a919f5466478ccf2",
      "name": "Family Savings",
      "total_credit_rounds": 10,
      "saving_rounds_per_credit_round": 3
    },
    "current_credit_round": {
      "credit_round_number": 1,
      "saving_round_range": {
        "start": 1,
        "end": 3
      },
      "total_saving_rounds": 3,
      "completion_percentage": 100,
      "is_complete": true,
      "can_initiate_lottery": true
    },
    "members": [
      {
        "member_id": "member_xyz789",
        "user_id": "user_abc123",
        "name": "Abebe Kebede",
        "phone": "+251911234567",
        "contribution_type": "full",
        "saving_rounds": [
          {
            "saving_round_number": 1,
            "status": "verified",
            "amount": 1000,
            "payment_date": "2025-01-05T10:00:00Z"
          }
        ],
        "completed_count": 3,
        "required_count": 3,
        "is_complete": true
      }
    ]
  }
}
```

---

### 4. Get Eligible Members (Optional Enhancement)

**Endpoint:** `GET /api/iqubs/:iqubId/lottery/eligible`

**Purpose:** Get list of members eligible for lottery (for spin wheel segments).

**Note:** This can be derived from credit-round-status, but a dedicated endpoint would be cleaner.

#### Response
```json
{
  "success": true,
  "data": {
    "credit_round_number": 1,
    "eligible_members": [
      {
        "member_id": "member_xyz789",
        "name": "Abebe Kebede",
        "contribution_type": "full",
        "has_won": false
      },
      {
        "member_id": "member_abc123",
        "name": "Sara Tesfaye",
        "contribution_type": "half",
        "has_won": false
      }
    ],
    "total_eligible": 8,
    "full_contributors": 6,
    "half_contributors": 4
  }
}
```

---

## Database Schema Updates

### Lottery Model Enhancement

**Current Schema:**
```typescript
{
  iqub_id: ObjectId,
  round_number: Number,      // Saving round number
  winner_id: ObjectId,
  lottery_date: Date,
  created_at: Date
}
```

**Required Schema:**
```typescript
{
  iqub_id: ObjectId,
  round_number: Number,           // Keep for backward compatibility
  credit_round_number: Number,    // NEW: Credit round this lottery belongs to
  winner_id: ObjectId,
  winner_name: String,            // NEW: Denormalized for faster queries
  credit_amount: Number,          // NEW: Amount won (full or half)
  is_pair: Boolean,               // NEW: Whether winner is a half contributor pair
  pair_winner_id: ObjectId,       // NEW: Second winner if pair
  pair_winner_name: String,       // NEW: Second winner name if pair
  lottery_date: Date,
  created_at: Date
}
```

---

## Implementation Checklist

### Backend Tasks

#### High Priority (Required for MVP)
- [ ] **Add `GET /api/iqubs/:iqubId/lottery/history` endpoint**
  - Add route in `collector.routes.ts`
  - Add controller method `getLotteryHistory()`
  - Add service method `getLotteryHistory()`
  - Use existing `findLotteriesByIqubId()` repository method

- [ ] **Update `POST /api/iqubs/:iqubId/lottery/initiate` response**
  - Return winner details (member_id, name, credit_amount)
  - Return lottery_id
  - Return credit_round_number
  - Return is_pair flag

#### Medium Priority (Enhanced Features)
- [ ] **Update Lottery model schema**
  - Add `credit_round_number` field
  - Add `credit_amount` field
  - Add `is_pair` field
  - Add `pair_winner_id` field
  - Add denormalized `winner_name` and `pair_winner_name`

- [ ] **Implement half contributor pairing**
  - Pair half contributors randomly
  - Split credit amount between pair
  - Create two lottery records or one with pair info

#### Low Priority (Nice to Have)
- [ ] **Add `GET /api/iqubs/:iqubId/lottery/eligible` endpoint**
  - Return list of eligible members for wheel display

---

## Frontend Integration Points

### Vuex Store Actions

```typescript
// src/store/modules/iqubs.ts

// Action: Fetch lottery history
async fetchLotteryHistory({ commit }, iqubId: string) {
  const response = await apiService.get(`/iqubs/${iqubId}/lottery/history`);
  commit('setLotteryHistory', response.data.data);
}

// Action: Initiate lottery with spin wheel
async initiateLotteryWithSpin({ commit, dispatch }, { iqubId, creditRoundNumber }) {
  const response = await apiService.post(`/iqubs/${iqubId}/lottery/initiate`, {
    credit_round_number: creditRoundNumber
  });
  commit('setCurrentLotteryResult', response.data.data);
  dispatch('fetchLotteryHistory', iqubId);
  return response.data;
}
```

### Component Data Flow

```
1. User clicks "Initiate Lottery" on CreditRoundCard
   ↓
2. LotterySpinModal opens
   ↓
3. Modal calls POST /api/iqubs/:iqubId/lottery/initiate
   ↓
4. API returns winner data
   ↓
5. SpinWheel animates to land on winner segment
   ↓
6. WinnerAnnouncement shows with confetti
   ↓
7. User clicks "Done"
   ↓
8. Modal closes, calls GET /api/iqubs/:iqubId/lottery/history
   ↓
9. Lottery tab refreshes with updated history
```

---

## Error Handling Matrix

| Error Code | HTTP Status | Frontend Action |
|------------|-------------|-----------------|
| `LOTTERY_NOT_ELIGIBLE` | 400 | Show toast, disable button |
| `LOTTERY_ALREADY_INITIATED` | 400 | Refresh credit round status |
| `NO_ELIGIBLE_MEMBERS` | 400 | Show info message |
| `IQUB_NOT_FOUND` | 404 | Navigate back to list |
| `ACCESS_DENIED` | 403 | Show permission error |
| `UNAUTHORIZED` | 401 | Redirect to login |
| Network Error | - | Show retry button |

---

## Testing Scenarios

### Happy Path
1. All members complete saving rounds → `can_initiate_lottery: true`
2. Collector clicks "Initiate Lottery"
3. API returns winner
4. Wheel spins and lands on winner
5. Celebration shows
6. History updates

### Edge Cases
1. Half contributor pair wins → Both names shown, amount split
2. Only one eligible member → Wheel has single segment
3. API fails during spin → Error toast, retry button
4. User closes modal during spin → Prevent close until complete

---

## Questions for Backend Team

1. **Credit Round Tracking:** Should lottery be tied to `credit_round_number` or `round_number`?
   - Frontend expects `credit_round_number` for display purposes

2. **Half Contributor Pairing:** How should pairs be determined?
   - Random pairing each lottery?
   - Fixed pairing based on join order?

3. **Winner Selection:** Should the API return the winner immediately or should frontend poll?
   - Current: Immediate return (preferred for spin wheel UX)

4. **Lottery History Pagination:** Should history endpoint support pagination?
   - For Iqubs with many credit rounds, pagination may be needed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-30 | Initial document |
