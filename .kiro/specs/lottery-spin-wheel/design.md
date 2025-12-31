# Design Document: Lottery Spin Wheel

## Overview

This design transforms the Lottery tab in the Collector's Iqub Detail Page into an engaging, premium lottery experience. The feature replaces the current simple date picker interface with interactive credit round cards and an animated spin wheel for winner selection.

The system follows a clear flow:
1. Display credit rounds as premium cards showing lottery eligibility
2. When eligible, collector clicks "Initiate Lottery" button
3. System calls backend API to determine winner
4. Animated spin wheel displays and spins to land on the winner
5. Celebration modal announces the winner with confetti
6. Credit round card updates to show completed lottery with winner info

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    IqubDetailPage.vue                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Lottery Tab                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           CreditRoundCard.vue (multiple)            │  │  │
│  │  │  - Credit round info                                │  │  │
│  │  │  - Eligibility status                               │  │  │
│  │  │  - Initiate Lottery button                          │  │  │
│  │  │  - Winner info (if completed)                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Opens Modal
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LotterySpinModal.vue                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   SpinWheel.vue                            │  │
│  │  - Member segments                                        │  │
│  │  - Pointer indicator                                      │  │
│  │  - Spin animation                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               WinnerAnnouncement.vue                       │  │
│  │  - Winner name                                            │  │
│  │  - Credit amount                                          │  │
│  │  - Confetti animation                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. CreditRoundCard Component

```typescript
// src/components/CreditRoundCard.vue
interface CreditRoundCardProps {
  creditRound: CreditRoundInfo;
  onInitiateLottery: () => void;
}

interface CreditRoundInfo {
  credit_round_number: number;
  saving_round_range: {
    start: number;
    end: number;
  };
  completion_percentage: number;
  is_complete: boolean;
  can_initiate_lottery: boolean;
  lottery_completed: boolean;
  winner?: LotteryWinner;
  lottery_date?: string;
}

interface LotteryWinner {
  member_id: string;
  name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_member?: {
    member_id: string;
    name: string;
  };
}
```

### 2. SpinWheel Component

```typescript
// src/components/SpinWheel.vue
interface SpinWheelProps {
  segments: WheelSegment[];
  winnerId: string;
  onSpinComplete: () => void;
}

interface WheelSegment {
  id: string;
  label: string;
  color: string;
  isPair: boolean;
  members: {
    id: string;
    name: string;
  }[];
}
```

### 3. LotterySpinModal Component

```typescript
// src/components/LotterySpinModal.vue
interface LotterySpinModalProps {
  isOpen: boolean;
  iqubId: string;
  creditRoundNumber: number;
  eligibleMembers: EligibleMember[];
  onClose: () => void;
  onLotteryComplete: (winner: LotteryWinner) => void;
}

interface EligibleMember {
  member_id: string;
  name: string;
  contribution_type: 'full' | 'half';
  has_won: boolean;
}
```

### 4. WinnerAnnouncement Component

```typescript
// src/components/WinnerAnnouncement.vue
interface WinnerAnnouncementProps {
  winner: LotteryWinner;
  onDone: () => void;
}
```

### 5. Vuex Store Extensions

```typescript
// src/store/modules/iqubs.ts - Additional state
interface LotteryState {
  lotteryHistory: LotteryRecord[];
  lotteryHistoryStatus: FetchStatus;
  lotteryHistoryError: string | null;
  currentLotteryResult: LotteryResult | null;
  isInitiatingLottery: boolean;
}

interface LotteryRecord {
  id: string;
  iqub_id: string;
  credit_round_number: number;
  winner_member_id: string;
  winner_name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_member_id?: string;
  pair_member_name?: string;
  initiated_at: string;
}

interface LotteryResult {
  success: boolean;
  winner: {
    member_id: string;
    name: string;
    credit_amount: number;
    is_pair: boolean;
    pair_member?: {
      member_id: string;
      name: string;
    };
  };
  lottery_id: string;
}
```

## Data Models

### API Request/Response

```typescript
// POST /api/iqubs/:iqubId/lottery/initiate
// Request: No body required (uses current credit round)

// Response (Success - Single Winner)
interface LotteryInitiateResponse {
  success: true;
  data: {
    lottery_id: string;
    winner: {
      member_id: string;
      name: string;
      credit_amount: number;
    };
    credit_round_number: number;
  };
}

// Response (Success - Pair Winner)
interface LotteryInitiatePairResponse {
  success: true;
  data: {
    lottery_id: string;
    winners: [
      {
        member_id: string;
        name: string;
        credit_amount: number; // Half of total
      },
      {
        member_id: string;
        name: string;
        credit_amount: number; // Half of total
      }
    ];
    credit_round_number: number;
    is_pair: true;
  };
}

// Response (Error)
interface LotteryInitiateError {
  success: false;
  message: string;
  error_code?: string;
}
```

### Wheel Segment Generation

```typescript
// Utility function to generate wheel segments from eligible members
function generateWheelSegments(
  members: EligibleMember[]
): WheelSegment[] {
  const segments: WheelSegment[] = [];
  const fullContributors = members.filter(m => m.contribution_type === 'full' && !m.has_won);
  const halfContributors = members.filter(m => m.contribution_type === 'half' && !m.has_won);
  
  // Add full contributors as individual segments
  fullContributors.forEach((member, index) => {
    segments.push({
      id: member.member_id,
      label: member.name,
      color: index % 2 === 0 ? '#014023' : '#016630', // Alternating dark greens
      isPair: false,
      members: [{ id: member.member_id, name: member.name }]
    });
  });
  
  // Pair half contributors and add as single segments
  for (let i = 0; i < halfContributors.length; i += 2) {
    if (i + 1 < halfContributors.length) {
      const pair = [halfContributors[i], halfContributors[i + 1]];
      segments.push({
        id: `pair_${pair[0].member_id}_${pair[1].member_id}`,
        label: `${pair[0].name} & ${pair[1].name}`,
        color: segments.length % 2 === 0 ? '#014023' : '#016630',
        isPair: true,
        members: pair.map(m => ({ id: m.member_id, name: m.name }))
      });
    }
  }
  
  return segments;
}
```

### Rotation Calculation

```typescript
// Calculate rotation to land on winner segment
function calculateWinningRotation(
  segments: WheelSegment[],
  winnerId: string
): number {
  const segmentAngle = 360 / segments.length;
  const winnerIndex = segments.findIndex(s => 
    s.id === winnerId || s.members.some(m => m.id === winnerId)
  );
  
  if (winnerIndex === -1) {
    throw new Error('Winner not found in segments');
  }
  
  // Calculate base rotation to center winner at top (pointer position)
  const baseRotation = -(winnerIndex * segmentAngle) - (segmentAngle / 2);
  
  // Add random extra spins (2-4 full rotations) for dramatic effect
  const extraSpins = (Math.floor(Math.random() * 3) + 2) * 360;
  
  // Add small random offset within segment for natural feel
  const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
  
  return baseRotation + extraSpins + randomOffset;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Credit Round Card State Rendering

*For any* credit round data object with valid fields, the rendered Credit_Round_Card SHALL display the correct UI state based on `is_complete`, `can_initiate_lottery`, and `lottery_completed` flags.

**Validates: Requirements 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**

### Property 2: Wheel Segments Match Eligible Members

*For any* list of eligible members, the generated wheel segments SHALL contain exactly one segment per full contributor and one segment per pair of half contributors, with all member names correctly displayed.

**Validates: Requirements 3.2, 3.3**

### Property 3: Winner Data Extraction

*For any* valid API response (single winner or pair winner), the Lottery_System SHALL correctly extract the winner member ID(s), name(s), and credit amount(s).

**Validates: Requirements 4.3, 4.5**

### Property 4: Rotation Calculation Lands on Winner

*For any* wheel configuration and winner ID, the calculated rotation SHALL result in the winner's segment being positioned at the pointer (top of wheel) when animation completes.

**Validates: Requirements 5.1**

### Property 5: Winner Announcement Content

*For any* lottery winner data (single or pair), the Winner_Announcement SHALL display the correct name(s) and credit amount(s).

**Validates: Requirements 6.2, 6.3**

### Property 6: Lottery History Rendering

*For any* list of completed lottery records, the Lottery_System SHALL display them in correct order with winner name(s), credit amount(s), and lottery date for each.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

## Error Handling

### API Errors

| Error Code | Message | User Action |
|------------|---------|-------------|
| `LOTTERY_NOT_ELIGIBLE` | "Cannot initiate lottery: not all members have completed required saving rounds" | Show toast, disable button |
| `LOTTERY_ALREADY_INITIATED` | "Lottery has already been initiated for this credit round" | Refresh credit round status |
| `NO_ELIGIBLE_MEMBERS` | "No eligible members for lottery" | Show info message |
| `UNAUTHORIZED` | "Authentication required" | Redirect to login |
| `NETWORK_ERROR` | "Network error. Please try again." | Show retry button |

### Component Error States

```typescript
// Error state handling in LotterySpinModal
const errorState = ref<{
  hasError: boolean;
  message: string;
  canRetry: boolean;
}>({
  hasError: false,
  message: '',
  canRetry: false
});

const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'Failed to initiate lottery';
  const canRetry = !['LOTTERY_ALREADY_INITIATED', 'NO_ELIGIBLE_MEMBERS'].includes(
    error.response?.data?.error_code
  );
  
  errorState.value = {
    hasError: true,
    message,
    canRetry
  };
  
  // Show toast notification
  toastController.create({
    message,
    duration: 3000,
    position: 'top',
    color: 'danger'
  }).then(toast => toast.present());
};
```

## Testing Strategy

### Unit Tests

Unit tests verify specific examples and edge cases:

1. **CreditRoundCard rendering** - Test each state combination (loading, error, eligible, not eligible, completed)
2. **Wheel segment generation** - Test with various member configurations
3. **Rotation calculation** - Test edge cases (single segment, many segments, winner at different positions)
4. **API response parsing** - Test single winner and pair winner responses

### Property-Based Tests

Property-based tests verify universal properties across many generated inputs:

1. **Wheel segment count property** - For any valid member list, segment count equals full contributors + (half contributors / 2)
2. **Rotation lands on winner property** - For any wheel and winner, final rotation positions winner at top
3. **Winner data extraction property** - For any valid API response, extracted data matches response structure

### Integration Tests

1. **Full lottery flow** - Click initiate → API call → spin animation → winner announcement → modal close → refresh
2. **Error recovery** - API failure → error toast → retry → success
3. **Accessibility** - Keyboard navigation, screen reader announcements

### Test Configuration

- **Property tests**: Minimum 100 iterations per property
- **Test framework**: Vitest with @vue/test-utils
- **Property testing library**: fast-check
- **Tag format**: `Feature: lottery-spin-wheel, Property {number}: {property_text}`
