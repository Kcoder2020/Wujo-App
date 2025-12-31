# Member API Updates - Credit Round Support

## Updated Endpoint: Get Member Iqub Details

### Endpoint
```
GET /api/member/iqub/:iqubId
```

### Description
Returns detailed information about a member's participation in a specific Iqub, including their current credit round progress.

### Authentication
Required: Bearer token in Authorization header

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| iqubId | string | Yes | MongoDB ObjectId of the Iqub |

### Success Response (200 OK)

```json
{
  "iqub": {
    "id": "69517bd6a919f5466478ccf2",
    "name": "Wujo Test Iqubs(with half members)",
    "saving_amount": 1000,
    "credit_amount": 70000,
    "members_count": 9,
    "half_contributors": 2,
    "effective_members": 10,
    "current_members": 1,
    "status": "pending",
    "next_lottery_date": null
  },
  "member": {
    "id": "69517c22a919f5466478cd32",
    "name": "million girmay",
    "phone": "+251991883459",
    "avatar": null,
    "contribution_type": "full",
    "join_date": "2025-12-28T18:51:14.516Z",
    "saving_rounds": 1,
    "has_won": false
  },
  "current_credit_round": {
    "credit_round_number": 1,
    "saving_round_range": {
      "start": 1,
      "end": 7
    },
    "total_credit_rounds": 10,
    "saving_rounds_per_credit_round": 7,
    "member_progress": {
      "completed_saving_rounds": 1,
      "required_saving_rounds": 7,
      "is_complete": false
    }
  },
  "stats": {
    "total_saved": 1000,
    "current_round": 2,
    "total_rounds": 70,
    "completion_percentage": 1,
    "lottery_position": 1
  },
  "payment_history": [
    {
      "round_number": 1,
      "amount": 1000,
      "payment_method": "manual",
      "status": "success",
      "paid_at": "2025-12-28T18:52:32.705Z",
      "chapa_tx_ref": null
    }
  ]
}
```

### Response Fields

#### iqub
| Field | Type | Description |
|-------|------|-------------|
| id | string | Iqub MongoDB ObjectId |
| name | string | Iqub name |
| saving_amount | number | Amount each full member pays per saving round |
| credit_amount | number | Amount given to lottery winner |
| members_count | number | Number of full contributor slots |
| half_contributors | number | Number of half contributor slots |
| effective_members | number | Calculated: members_count + (half_contributors / 2) |
| current_members | number | Current number of members who have joined |
| status | string | "pending", "active", "completed" |
| next_lottery_date | string\|null | ISO 8601 date or null |

#### member
| Field | Type | Description |
|-------|------|-------------|
| id | string | Member MongoDB ObjectId |
| name | string | Member's full name |
| phone | string | Member's phone number |
| avatar | string\|null | Avatar URL or null |
| contribution_type | string | "full" or "half" |
| join_date | string | ISO 8601 date when member joined |
| saving_rounds | number | Number of saving rounds completed |
| has_won | boolean | Whether member has won lottery |

#### current_credit_round (NEW)
| Field | Type | Description |
|-------|------|-------------|
| credit_round_number | number | Current credit round number (1, 2, 3, ...) |
| saving_round_range.start | number | First saving round in this credit round |
| saving_round_range.end | number | Last saving round in this credit round |
| total_credit_rounds | number | Total credit rounds in the Iqub |
| saving_rounds_per_credit_round | number | How many saving rounds per credit round |
| member_progress.completed_saving_rounds | number | How many saving rounds member completed in current credit round |
| member_progress.required_saving_rounds | number | How many saving rounds required in current credit round |
| member_progress.is_complete | boolean | Whether member completed current credit round |

#### stats
| Field | Type | Description |
|-------|------|-------------|
| total_saved | number | Total amount member has saved |
| current_round | number | Next saving round member needs to pay |
| total_rounds | number | **UPDATED** Total saving rounds in entire Iqub (credit_round × saving_rounds_per_credit_round) |
| completion_percentage | number | **UPDATED** Percentage of all saving rounds completed (0-100) |
| lottery_position | number | Member's position in lottery queue |

#### payment_history
Array of payment objects:
| Field | Type | Description |
|-------|------|-------------|
| round_number | number | Saving round number |
| amount | number | Amount paid |
| payment_method | string | "manual" or "chapa" |
| status | string | "success", "pending", "failed" |
| paid_at | string | ISO 8601 date |
| chapa_tx_ref | string\|null | Chapa transaction reference or null |

---

## Key Changes

### 1. New `current_credit_round` Object
Members now receive information about their current credit round:
- Which credit round they're in
- Which saving rounds belong to that credit round
- Their progress within the credit round

### 2. Fixed `stats.total_rounds`
**Before:** Incorrectly showed `effective_members` (e.g., 10)
**After:** Correctly shows total saving rounds (e.g., 70 = 10 credit rounds × 7 saving rounds per credit round)

### 3. Fixed `stats.completion_percentage`
**Before:** Calculated against effective_members
**After:** Calculated against total_saving_rounds

---

## Frontend Integration

### TypeScript Interface

```typescript
interface MemberIqubDetailsResponse {
  iqub: {
    id: string;
    name: string;
    saving_amount: number;
    credit_amount: number;
    members_count: number;
    half_contributors: number;
    effective_members: number;
    current_members: number;
    status: 'pending' | 'active' | 'completed';
    next_lottery_date: string | null;
  };
  member: {
    id: string;
    name: string;
    phone: string;
    avatar: string | null;
    contribution_type: 'full' | 'half';
    join_date: string;
    saving_rounds: number;
    has_won: boolean;
  };
  current_credit_round: {
    credit_round_number: number;
    saving_round_range: {
      start: number;
      end: number;
    };
    total_credit_rounds: number;
    saving_rounds_per_credit_round: number;
    member_progress: {
      completed_saving_rounds: number;
      required_saving_rounds: number;
      is_complete: boolean;
    };
  };
  stats: {
    total_saved: number;
    current_round: number;
    total_rounds: number;
    completion_percentage: number;
    lottery_position: number;
  };
  payment_history: Array<{
    round_number: number;
    amount: number;
    payment_method: 'manual' | 'chapa';
    status: 'success' | 'pending' | 'failed';
    paid_at: string;
    chapa_tx_ref: string | null;
  }>;
}
```

### Usage Example

```typescript
const response = await fetch(`/api/member/iqub/${iqubId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data: MemberIqubDetailsResponse = await response.json();

// Display current credit round info
console.log(`Credit Round ${data.current_credit_round.credit_round_number} of ${data.current_credit_round.total_credit_rounds}`);
console.log(`Saving Rounds ${data.current_credit_round.saving_round_range.start}-${data.current_credit_round.saving_round_range.end}`);
console.log(`Progress: ${data.current_credit_round.member_progress.completed_saving_rounds}/${data.current_credit_round.member_progress.required_saving_rounds}`);

// Display overall progress
console.log(`Total Progress: ${data.stats.completion_percentage}%`);
console.log(`Completed ${data.member.saving_rounds} of ${data.stats.total_rounds} saving rounds`);
```

### UI Display Recommendations

#### Credit Round Progress Card
```
┌─────────────────────────────────────────┐
│ Current Credit Round: 1 of 10           │
│ Saving Rounds: 1-7                      │
│                                         │
│ Your Progress:                          │
│ ████░░░░░░░░░░░░░░░░ 1/7 rounds        │
│                                         │
│ Next Payment: Round 2                   │
│ Amount: 1,000 ETB                       │
└─────────────────────────────────────────┘
```

#### Overall Progress Card
```
┌─────────────────────────────────────────┐
│ Overall Iqub Progress                   │
│                                         │
│ ██░░░░░░░░░░░░░░░░░░ 1%                │
│                                         │
│ Completed: 1 of 70 saving rounds        │
│ Total Saved: 1,000 ETB                  │
└─────────────────────────────────────────┘
```

---

## Migration Notes

### Breaking Changes
- `stats.total_rounds` value has changed from effective_members to actual total saving rounds
- `stats.completion_percentage` calculation has changed

### New Fields
- `current_credit_round` object (entire object is new)
- `current_credit_round.credit_round_number`
- `current_credit_round.saving_round_range`
- `current_credit_round.total_credit_rounds`
- `current_credit_round.saving_rounds_per_credit_round`
- `current_credit_round.member_progress`

### Backward Compatibility
All existing fields remain, but some values have changed:
- Existing apps may show incorrect progress percentages until updated
- Frontend should be updated to use `current_credit_round` for accurate progress tracking

---

## Testing Scenarios

### Scenario 1: Member in First Credit Round
```json
{
  "member": { "saving_rounds": 3 },
  "current_credit_round": {
    "credit_round_number": 1,
    "saving_round_range": { "start": 1, "end": 7 },
    "member_progress": {
      "completed_saving_rounds": 3,
      "required_saving_rounds": 7,
      "is_complete": false
    }
  },
  "stats": {
    "current_round": 4,
    "total_rounds": 70,
    "completion_percentage": 4
  }
}
```

### Scenario 2: Member Completed First Credit Round
```json
{
  "member": { "saving_rounds": 7 },
  "current_credit_round": {
    "credit_round_number": 2,
    "saving_round_range": { "start": 8, "end": 14 },
    "member_progress": {
      "completed_saving_rounds": 0,
      "required_saving_rounds": 7,
      "is_complete": false
    }
  },
  "stats": {
    "current_round": 8,
    "total_rounds": 70,
    "completion_percentage": 10
  }
}
```

### Scenario 3: Member in Middle of Second Credit Round
```json
{
  "member": { "saving_rounds": 10 },
  "current_credit_round": {
    "credit_round_number": 2,
    "saving_round_range": { "start": 8, "end": 14 },
    "member_progress": {
      "completed_saving_rounds": 3,
      "required_saving_rounds": 7,
      "is_complete": false
    }
  },
  "stats": {
    "current_round": 11,
    "total_rounds": 70,
    "completion_percentage": 14
  }
}
```

---

## Summary

The member endpoint now provides:
1. ✅ Correct total_rounds calculation (70 instead of 10)
2. ✅ Correct completion_percentage (1% instead of 10%)
3. ✅ Current credit round information
4. ✅ Member's progress within current credit round
5. ✅ Clear indication of which saving rounds belong to which credit round

This allows the frontend to:
- Display accurate progress bars
- Show current credit round status
- Indicate when member completes a credit round
- Guide member on next payment requirements
