# Member Iqub Detail Page - Credit Round Update Plan

## Overview
The backend API has been updated to support credit rounds, and the Member Iqub Detail Page needs to be updated to display this new information correctly.

## What Changed in the API

### 1. New `current_credit_round` Object
The API now returns detailed information about the member's current credit round:
```json
{
  "current_credit_round": {
    "credit_round_number": 1,
    "saving_round_range": { "start": 1, "end": 7 },
    "total_credit_rounds": 10,
    "saving_rounds_per_credit_round": 7,
    "member_progress": {
      "completed_saving_rounds": 1,
      "required_saving_rounds": 7,
      "is_complete": false
    }
  }
}
```

### 2. Fixed `stats.total_rounds`
- **Before:** Showed `effective_members` (e.g., 10)
- **After:** Shows total saving rounds (e.g., 70 = 10 credit rounds × 7 saving rounds)

### 3. Fixed `stats.completion_percentage`
- **Before:** Calculated against effective_members
- **After:** Calculated against total_saving_rounds (e.g., 1% instead of 10%)

### 4. New Fields in Existing Objects
- `iqub.half_contributors`: Number of half contributor slots
- `iqub.effective_members`: Calculated members count
- `member.contribution_type`: "full" or "half"

## Files That Need Updates

### 1. TypeScript Types (`src/types/index.ts`)
**Status:** ⏳ Needs Update

**Changes Needed:**
- Add `current_credit_round` interface to `MemberIqubDetails`
- Add `half_contributors` and `effective_members` to iqub interface
- Add `contribution_type` to member interface

### 2. Member Store Module (`src/store/modules/member.ts`)
**Status:** ✅ Already Working (no changes needed)

The store already fetches and stores the data correctly. The API response structure is backward compatible.

### 3. Member Iqub Detail Page (`src/views/memberViews/MemberIqubDetailPage.vue`)
**Status:** ⏳ Needs Update

**Changes Needed:**
- Update progress ring to use correct total_rounds
- Add credit round progress card
- Display contribution type badge
- Update round generation logic to use correct total_rounds

### 4. Components (if needed)
**Status:** ⏳ May Need Updates

Components that may need updates:
- `SavingsProgressRing.vue` - Verify it uses correct data
- `RoundPaymentCard.vue` - May need contribution type display

## Implementation Steps

### Step 1: Update TypeScript Interfaces ✅ PRIORITY
**File:** `src/types/index.ts`

Add the new interfaces to match the API response:
```typescript
export interface MemberIqubDetails {
  iqub: {
    id: string;
    name: string;
    saving_amount: number;
    credit_amount: number;
    members_count: number;
    half_contributors: number;        // NEW
    effective_members: number;        // NEW
    current_members: number;
    status: "active" | "completed" | "pending";
    next_lottery_date: string | null;
  };
  member: {
    id: string;
    name: string;
    phone: string;
    avatar: string | null;
    contribution_type: "full" | "half"; // NEW
    join_date: string;
    saving_rounds: number;
    has_won: boolean;
  };
  current_credit_round: {              // NEW OBJECT
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
    total_rounds: number;              // VALUE CHANGED
    completion_percentage: number;     // VALUE CHANGED
    lottery_position: number;
  };
  payment_history: RoundPaymentDetails[];
}
```

### Step 2: Add Credit Round Progress Card
**File:** `src/views/memberViews/MemberIqubDetailPage.vue`

Add a new card in the stats section to display credit round progress:
```vue
<div class="credit-round-card" v-if="details?.current_credit_round">
  <h4>Current Credit Round</h4>
  <div class="credit-round-info">
    <span class="round-number">
      Round {{ details.current_credit_round.credit_round_number }} 
      of {{ details.current_credit_round.total_credit_rounds }}
    </span>
    <span class="saving-rounds">
      Saving Rounds {{ details.current_credit_round.saving_round_range.start }}-{{ details.current_credit_round.saving_round_range.end }}
    </span>
  </div>
  <div class="progress-bar">
    <div 
      class="progress-fill" 
      :style="{ width: creditRoundProgressPercentage + '%' }"
    ></div>
  </div>
  <span class="progress-text">
    {{ details.current_credit_round.member_progress.completed_saving_rounds }} 
    of {{ details.current_credit_round.member_progress.required_saving_rounds }} 
    rounds completed
  </span>
</div>
```

### Step 3: Update Progress Ring Target
**File:** `src/views/memberViews/MemberIqubDetailPage.vue`

Fix the progress ring to use correct total:
```vue
<SavingsProgressRing
  :percentage="details.stats.completion_percentage"
  :current="details.stats.total_saved"
  :target="details.iqub.saving_amount * details.stats.total_rounds"
  :size="140"
  theme="dark"
/>
```

### Step 4: Fix Round Generation Logic
**File:** `src/views/memberViews/MemberIqubDetailPage.vue`

Update the `allRounds` computed property:
```typescript
const allRounds = computed(() => {
  if (!details.value) return [];

  const { iqub, stats, payment_history } = details.value;
  const totalRounds = stats.total_rounds; // Use stats.total_rounds directly
  const currentRound = stats.current_round;
  const savingAmount = iqub.saving_amount;

  // ... rest of the logic
});
```

### Step 5: Add Contribution Type Badge
**File:** `src/views/memberViews/MemberIqubDetailPage.vue`

Add a badge showing contribution type:
```vue
<div class="contribution-badge" v-if="details?.member">
  <span :class="details.member.contribution_type">
    {{ details.member.contribution_type === 'full' ? 'Full' : 'Half' }} Contributor
  </span>
</div>
```

### Step 6: Add Computed Properties
**File:** `src/views/memberViews/MemberIqubDetailPage.vue`

Add helper computed properties:
```typescript
const creditRoundProgressPercentage = computed(() => {
  if (!details.value?.current_credit_round) return 0;
  const { completed_saving_rounds, required_saving_rounds } = 
    details.value.current_credit_round.member_progress;
  return Math.round((completed_saving_rounds / required_saving_rounds) * 100);
});

const isCreditRoundComplete = computed(() => {
  return details.value?.current_credit_round?.member_progress.is_complete || false;
});
```

## Testing Checklist

### Visual Testing
- [ ] Progress ring shows correct percentage (1% not 10%)
- [ ] Credit round card displays correctly
- [ ] Contribution type badge shows correct type
- [ ] All 70 rounds are generated (not just 10)
- [ ] Current round is highlighted correctly
- [ ] Wujo colors are used consistently

### Functional Testing
- [ ] Pull-to-refresh updates all data
- [ ] Payment modal works for all rounds
- [ ] Progress updates after payment
- [ ] Error states display correctly
- [ ] Loading states display correctly

### Data Validation
- [ ] API response matches TypeScript interface
- [ ] No TypeScript errors in console
- [ ] No runtime errors in console
- [ ] Correct calculations for all percentages

## Rollout Strategy

### Phase 1: Type Updates (Low Risk)
1. Update TypeScript interfaces
2. Verify no compilation errors
3. Deploy to staging

### Phase 2: UI Updates (Medium Risk)
1. Add credit round card
2. Update progress ring
3. Add contribution badge
4. Test on staging

### Phase 3: Logic Updates (Medium Risk)
1. Fix round generation
2. Update computed properties
3. Test payment flows
4. Deploy to production

## Backward Compatibility

The changes are backward compatible because:
- New fields are optional in TypeScript
- Existing fields remain unchanged
- Fallback logic handles missing data
- No breaking changes to component props

## Documentation

### For Users
- Update help docs to explain credit rounds
- Add FAQ about progress percentages
- Create visual guide for credit round card

### For Developers
- Update API documentation reference
- Document new TypeScript interfaces
- Add code comments for credit round logic

## Success Criteria

✅ Member sees correct total rounds (70 not 10)
✅ Member sees correct completion percentage (1% not 10%)
✅ Member sees current credit round information
✅ Member sees progress within credit round
✅ Member sees contribution type badge
✅ All payment rounds are generated correctly
✅ No TypeScript errors
✅ No runtime errors
✅ Wujo design guidelines followed

## Next Steps

1. **Review Requirements:** Read `.kiro/specs/member-iqub-detail-credit-round-update/requirements.md`
2. **Create Design Doc:** Define component structure and data flow
3. **Create Tasks:** Break down implementation into discrete tasks
4. **Implement:** Execute tasks one by one
5. **Test:** Verify all success criteria
6. **Deploy:** Roll out to production

## Questions to Resolve

1. Should we show a celebration animation when a credit round is completed?
2. Should we add a tooltip explaining what credit rounds are?
3. Should we show historical credit round completion dates?
4. Should we add a "Next Lottery" countdown specific to credit rounds?

## Resources

- **API Documentation:** `MEMBER_API_UPDATES.md`
- **Requirements:** `.kiro/specs/member-iqub-detail-credit-round-update/requirements.md`
- **Current Implementation:** `src/views/memberViews/MemberIqubDetailPage.vue`
- **Type Definitions:** `src/types/index.ts`
