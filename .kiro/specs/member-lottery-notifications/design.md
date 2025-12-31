# Design Document: Member Lottery Notifications

## Overview

This feature implements a notification system for members to view lottery results from Iqubs they participate in. When a collector initiates a lottery, members receive notifications and can view the spin wheel animation showing all participants and the winner. The system reuses existing `SpinWheel` and `WinnerAnnouncement` components from the collector lottery feature.

## Architecture

The feature follows the existing Vue 3 + Vuex architecture pattern used in the Wujo app:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Member Views                              │
├─────────────────────────────────────────────────────────────────┤
│  MemberDashboard.vue    │  LotteryNotificationsPage.vue         │
│  (notification badge)   │  (list + spin wheel modal)            │
└─────────────────────────┴───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vuex Store (member module)                   │
├─────────────────────────────────────────────────────────────────┤
│  State: lotteryNotifications, unviewedCount, selectedLottery    │
│  Actions: fetchNotificationCount, fetchUnviewedLotteries,       │
│           fetchLotteryDetails, markLotteryAsViewed              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Service                               │
├─────────────────────────────────────────────────────────────────┤
│  GET /api/member/notifications/count                            │
│  GET /api/member/lottery/unviewed                               │
│  GET /api/member/lottery/:lotteryId                             │
│  POST /api/member/lottery/:lotteryId/viewed                     │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### New Components

#### 1. LotteryNotificationsPage.vue
Main page for viewing lottery notifications.

```typescript
// Props: none (uses route params and store)
// Emits: none

// Local State
interface LocalState {
  isModalOpen: boolean;
  selectedLotteryId: string | null;
  isAnimationComplete: boolean;
}
```

#### 2. LotteryNotificationCard.vue
Card component for displaying a lottery result in the list.

```typescript
interface Props {
  lottery: MemberLotteryResult;
}

interface Emits {
  (e: 'select', lotteryId: string): void;
}
```

#### 3. MemberLotteryModal.vue
Modal for displaying the spin wheel animation for members.

```typescript
interface Props {
  isOpen: boolean;
  lotteryId: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'viewed'): void;
}
```

### Reused Components

- `SpinWheel.vue` - Existing wheel animation component
- `WinnerAnnouncement.vue` - Existing winner display component

### Updated Components

#### MemberDashboard.vue
Add notification badge to the header notification icon.

```typescript
// New computed property
const unviewedLotteryCount = computed(() => 
  store.getters['member/unviewedLotteryCount']
);
```

## Data Models

### TypeScript Interfaces

```typescript
// New types to add to src/types/lottery.ts or src/types/member.ts

interface LotteryParticipant {
  user_id: string;
  name: string;
  contribution_type: 'full' | 'half';
  paired_with_name: string | null;
}

interface LotteryWinnerInfo {
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
  winner: LotteryWinnerInfo;
  participants: LotteryParticipant[];
  is_viewed: boolean;
  is_winner: boolean;
}

interface NotificationCount {
  unviewed_lottery_results: number;
}
```

### Vuex State Extensions

```typescript
// Add to MemberState interface in src/store/modules/member.ts

interface MemberState {
  // ... existing state
  
  // Lottery Notifications
  unviewedLotteryCount: number;
  unviewedLotteries: MemberLotteryResult[];
  selectedLotteryDetails: MemberLotteryResult | null;
  lotteryNotificationsStatus: FetchStatus;
  lotteryNotificationsError: string | null;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Notification Badge Visibility
*For any* unviewed lottery count value, the notification badge SHALL be visible if and only if the count is greater than zero, and the displayed count SHALL match the actual unviewed count.
**Validates: Requirements 1.2, 1.3, 5.2**

### Property 2: Lottery List Data Completeness
*For any* lottery result displayed in the unviewed list, the rendered output SHALL contain the Iqub name, credit round number, credit amount, lottery date, and winner indication.
**Validates: Requirements 2.2, 2.3**

### Property 3: Spin Wheel Segment Generation
*For any* lottery with participants, the spin wheel SHALL display one segment per full contributor and one combined segment per pair of half-contributors, with correct labels showing participant names.
**Validates: Requirements 3.2, 3.5**

### Property 4: Winner Segment Landing
*For any* lottery result with a known winner, the spin wheel animation SHALL land on the segment containing the winner's user_id.
**Validates: Requirements 3.3**

### Property 5: Mark as Viewed State Update
*For any* lottery marked as viewed, the unviewed count SHALL decrease by one AND the lottery SHALL be removed from the unviewed list.
**Validates: Requirements 4.2, 4.3**

### Property 6: Winner Congratulation Display
*For any* lottery where is_winner is true, the winner announcement SHALL display a special congratulatory message indicating the member won.
**Validates: Requirements 3.6**

## Error Handling

### API Error Scenarios

| Scenario | Handling Strategy |
|----------|-------------------|
| Notification count fetch fails | Show badge with "!" or hide badge, don't block UI |
| Unviewed list fetch fails | Show error state with retry button |
| Lottery details fetch fails | Show error in modal with retry option |
| Mark as viewed fails | Retry silently up to 3 times, log error |

### Error State UI

```typescript
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  canRetry: boolean;
  retryAction: () => void;
}
```

## Testing Strategy

### Unit Tests
- Test Vuex mutations for state updates
- Test computed properties for badge visibility logic
- Test segment generation from participants array
- Test winner matching logic

### Property-Based Tests
- Property 1: Generate random counts (0-100), verify badge visibility matches count > 0
- Property 2: Generate random lottery results, verify all required fields are rendered
- Property 3: Generate random participant lists with full/half contributors, verify correct segment count
- Property 5: Generate random viewed actions, verify count decrements and list updates

### Integration Tests
- Test full flow: fetch notifications → select lottery → view animation → mark as viewed
- Test error recovery scenarios
- Test navigation between dashboard and notifications page

### Testing Framework
- Use Vitest for unit and property-based tests
- Use fast-check for property-based test generation
- Minimum 100 iterations per property test
