# Backend Data Initialization Issue - Fresh Iqub

## Problem
When a collector creates a new Iqub and adds a member, the backend returns uninitialized/incorrect data that breaks the frontend.

## Actual Backend Response (❌ WRONG)
```json
{
  "iqub": {
    "id": "695291998b52ef7ed328a1fc",
    "name": "EDI test iqub",
    "saving_amount": 1000,
    "credit_amount": 1000,
    "members_count": 9,
    "half_contributors": 2,
    "effective_members": 10,
    "current_members": 1,
    "status": "pending"
  },
  "member": {
    "id": "695291d48b52ef7ed328a20d",
    "name": "million girmay",
    "phone": "+251991883459",
    "contribution_type": "full",
    "join_date": "2025-12-29T14:36:04.486Z",
    "saving_rounds": 1,
    "has_won": false
  },
  "current_credit_round": {
    "credit_round_number": 1,
    "saving_round_range": {
      "start": 1,
      "end": 0                                    // ❌ WRONG: end < start
    },
    "total_credit_rounds": 10,
    "saving_rounds_per_credit_round": 0,          // ❌ WRONG: Should be 10
    "member_progress": {
      "completed_saving_rounds": 0,
      "required_saving_rounds": 0,                // ❌ WRONG: Should be 10
      "is_complete": true                         // ❌ WRONG: Should be false
    }
  },
  "stats": {
    "total_saved": 1000,
    "current_round": 2,
    "total_rounds": 0,                            // ❌ WRONG: Should be 100
    "completion_percentage": null,                // ❌ WRONG: Should be 1
    "lottery_position": 1
  },
  "payment_history": [
    {
      "round_number": 1,
      "amount": 1000,
      "payment_method": "manual",
      "status": "success",
      "paid_at": "2025-12-29T14:48:41.328Z"
    }
  ]
}
```

## Expected Backend Response (✅ CORRECT)
```json
{
  "iqub": {
    "id": "695291998b52ef7ed328a1fc",
    "name": "EDI test iqub",
    "saving_amount": 1000,
    "credit_amount": 1000,
    "members_count": 9,
    "half_contributors": 2,
    "effective_members": 10,
    "current_members": 1,
    "status": "pending"
  },
  "member": {
    "id": "695291d48b52ef7ed328a20d",
    "name": "million girmay",
    "phone": "+251991883459",
    "contribution_type": "full",
    "join_date": "2025-12-29T14:36:04.486Z",
    "saving_rounds": 1,
    "has_won": false
  },
  "current_credit_round": {
    "credit_round_number": 1,
    "saving_round_range": {
      "start": 1,
      "end": 10                                   // ✅ CORRECT
    },
    "total_credit_rounds": 10,
    "saving_rounds_per_credit_round": 10,         // ✅ CORRECT
    "member_progress": {
      "completed_saving_rounds": 1,               // ✅ CORRECT (1 payment made)
      "required_saving_rounds": 10,               // ✅ CORRECT (full contributor)
      "is_complete": false                        // ✅ CORRECT (1/10 done)
    }
  },
  "stats": {
    "total_saved": 1000,
    "current_round": 2,
    "total_rounds": 100,                          // ✅ CORRECT (10 rounds × 10 credit rounds)
    "completion_percentage": 1,                   // ✅ CORRECT (1000/100000 × 100)
    "lottery_position": 1
  },
  "payment_history": [
    {
      "round_number": 1,
      "amount": 1000,
      "payment_method": "manual",
      "status": "success",
      "paid_at": "2025-12-29T14:48:41.328Z"
    }
  ]
}
```

## Required Calculations

### 1. `saving_rounds_per_credit_round`
```
saving_rounds_per_credit_round = effective_members
saving_rounds_per_credit_round = 10
```

### 2. `total_rounds`
```
total_rounds = saving_rounds_per_credit_round × total_credit_rounds
total_rounds = 10 × 10 = 100
```

### 3. `saving_round_range.end`
```
For credit_round_number 1:
start = 1
end = saving_rounds_per_credit_round = 10
```

### 4. `required_saving_rounds`
```
For full contributor:
required_saving_rounds = saving_rounds_per_credit_round = 10

For half contributor:
required_saving_rounds = ceil(saving_rounds_per_credit_round / 2) = 5
```

### 5. `completed_saving_rounds`
```
completed_saving_rounds = member.saving_rounds = 1
```

### 6. `is_complete`
```
is_complete = completed_saving_rounds >= required_saving_rounds
is_complete = 1 >= 10 = false
```

### 7. `completion_percentage`
```
total_expected = saving_amount × total_rounds
total_expected = 1000 × 100 = 100,000

completion_percentage = (total_saved / total_expected) × 100
completion_percentage = (1000 / 100000) × 100 = 1
```

## When to Calculate

These values must be calculated/updated:
1. ✅ When Iqub is created
2. ✅ When first member joins
3. ✅ When member makes a payment
4. ✅ When member joins (for their specific data)
5. ✅ When fetching member Iqub details

## Impact on Frontend

When backend returns incorrect data:
- ❌ No payment rounds displayed (total_rounds = 0)
- ❌ Progress ring shows NaN% (completion_percentage = null)
- ❌ Credit round shows invalid range (1-0)
- ❌ Member cannot make payments
- ❌ Console error: "Backend returned total_rounds=0. This should not happen!"

## Frontend Error Log
```
Backend returned total_rounds=0. This should not happen!
Promise.then
setMemberIqubDetails@member.ts:222
fetchMemberIqubDetails@member.ts:706
```

---

**Priority:** 🔴 CRITICAL - Blocks all fresh Iqubs
**Endpoint:** `GET /api/member/iqub/:iqubId`
**Date:** December 29, 2025
