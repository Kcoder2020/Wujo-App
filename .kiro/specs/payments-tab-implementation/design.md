# Design Document

## Overview

This design document outlines the technical implementation approach for the Payments tab in IqubDetailPage. The design focuses on displaying current credit round payment status, member-by-member payment tracking, and lottery initiation functionality using existing backend APIs.

### Design Goals

1. **Real-Time Payment Tracking**: Display up-to-date payment status for all members
2. **Premium Visual Design**: Apply Wujo brand colors with gradients and sophisticated card patterns
3. **Clear Status Indicators**: Use icons and colors to show payment verification states
4. **Conditional Actions**: Enable lottery initiation only when all payments are verified
5. **Mobile Optimization**: Ensure touch-friendly interactions and responsive layouts

## Architecture

### Component Structure

```
IqubDetailPage.vue (Payments Tab)
├── Loading State
│   ├── Spinner
│   └── Skeleton Cards (3)
├── Error State
│   ├── Alert Icon
│   ├── Error Message
│   └── Retry Button
├── Empty State
│   ├── Document Icon
│   ├── Empty Message
│   └── Go to Members Button
└── Content State
    ├── Header Card (Premium Dark Green)
    │   ├── Credit Round Info
    │   │   ├── Round Number (X of Y)
    │   │   └── Saving Round Range (X-Y)
    │   └── Progress Ring (120px)
    │       ├── Percentage Display
    │       └── Checkmark (if 100%)
    ├── Status Legend Card
    │   ├── Legend Title
    │   └── Status Items (4)
    │       ├── Verified (Green ✓)
    │       ├── Pending (Yellow ⏳)
    │       ├── Not Paid (Gray ○)
    │       └── Failed (Red ✗)
    ├── Member Payment Grid
    │   └── Member Cards (scrollable)
    │       ├── Member Avatar
    │       ├── Member Info
    │       │   ├── Name
    │       │   ├── Phone
    │       │   └── Contribution Badge
    │       ├── Saving Rounds Row
    │       │   └── Round Indicators (with status icons)
    │       └── Completion Count
    └── Sticky Action Button
        └── Initiate Lottery Button
            ├── Trophy Icon
            └── Button Text
```


### Data Flow

```typescript
// 1. Component Mount / Tab Activation
IqubDetailPage (Payments Tab) → dispatch('iqubs/fetchCreditRoundStatus', iqubId)

// 2. Vuex Action
fetchCreditRoundStatus → API GET /api/collector/iqubs/:iqubId/credit-round-status

// 3. API Response
{
  iqub: { id, name, total_credit_rounds, saving_rounds_per_credit_round },
  current_credit_round: { credit_round_number, saving_round_range, completion_percentage, can_initiate_lottery },
  members: [{ member_id, name, phone, contribution_type, saving_rounds: [...], completed_count, is_complete }]
}

// 4. Vuex Mutation
setCreditRoundStatus → state.creditRoundStatus = response.data

// 5. Component Computed
creditRoundStatus → state.iqubs.creditRoundStatus
members → creditRoundStatus.members
completionPercentage → creditRoundStatus.current_credit_round.completion_percentage
canInitiateLottery → creditRoundStatus.current_credit_round.can_initiate_lottery

// 6. User Action (Initiate Lottery)
Button Click → dispatch('iqubs/initiateLottery', iqubId)

// 7. Lottery API
initiateLottery → API POST /api/collector/iqubs/:iqubId/lottery/initiate

// 8. Success
Show toast → Navigate to Lottery tab → Refresh Iqub details
```

## Components and Interfaces

### 1. Vuex Store Module Updates

#### State Extensions

```typescript
// Add to src/store/modules/iqubs.ts state
interface IqubState {
  // ... existing state
  creditRoundStatus: CreditRoundStatus | null;
  creditRoundStatusLoading: boolean;
  creditRoundStatusError: string | null;
}
```

#### TypeScript Interfaces

```typescript
// Add to src/types/index.ts or create src/types/creditRound.ts

interface CreditRoundStatus {
  iqub: {
    id: string;
    name: string;
    total_credit_rounds: number;
    saving_rounds_per_credit_round: number;
  };
  current_credit_round: {
    credit_round_number: number;
    saving_round_range: {
      start: number;
      end: number;
    };
    total_saving_rounds: number;
    completion_percentage: number;
    is_complete: boolean;
    can_initiate_lottery: boolean;
  };
  members: CreditRoundMember[];
}

interface CreditRoundMember {
  member_id: string;
  user_id: string;
  name: string;
  phone: string;
  contribution_type: 'full' | 'half';
  saving_rounds: SavingRoundStatus[];
  completed_count: number;
  required_count: number;
  is_complete: boolean;
}

interface SavingRoundStatus {
  saving_round_number: number;
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  amount: number;
  payment_date: string | null;
}
```


#### Vuex Actions

```typescript
// Add to src/store/modules/iqubs.ts actions

async fetchCreditRoundStatus(
  { commit }: { commit: Commit },
  iqubId: string | number
) {
  commit('setCreditRoundStatusLoading', true);
  commit('setCreditRoundStatusError', null);
  
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found.');
    
    const response = await apiService.get(
      `/api/collector/iqubs/${iqubId}/credit-round-status`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data && response.data.success) {
      commit('setCreditRoundStatus', response.data.data);
      commit('setCreditRoundStatusLoading', false);
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch credit round status';
    commit('setCreditRoundStatusError', errorMessage);
    commit('setCreditRoundStatusLoading', false);
    throw error;
  }
}
```

#### Vuex Mutations

```typescript
// Add to src/store/modules/iqubs.ts mutations

setCreditRoundStatus(state: IqubState, status: CreditRoundStatus | null) {
  state.creditRoundStatus = status;
}

setCreditRoundStatusLoading(state: IqubState, loading: boolean) {
  state.creditRoundStatusLoading = loading;
}

setCreditRoundStatusError(state: IqubState, error: string | null) {
  state.creditRoundStatusError = error;
}

clearCreditRoundStatus(state: IqubState) {
  state.creditRoundStatus = null;
  state.creditRoundStatusLoading = false;
  state.creditRoundStatusError = null;
}
```

#### Vuex Getters

```typescript
// Add to src/store/modules/iqubs.ts getters

creditRoundStatus: (state: IqubState) => state.creditRoundStatus,
creditRoundStatusLoading: (state: IqubState) => state.creditRoundStatusLoading,
creditRoundStatusError: (state: IqubState) => state.creditRoundStatusError,
```


### 2. Premium Header Card Component

#### Visual Design Specification

```css
/* Premium Header Card */
.credit-round-header {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green) 0%,
    rgba(1, 64, 35, 0.9) 100%
  );
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  margin-bottom: 16px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-info {
  flex: 1;
}

.round-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.round-subtitle {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.progress-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-percentage {
  position: absolute;
  font-size: 32px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine);
}

.progress-label {
  position: absolute;
  bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.complete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Component Logic

```typescript
// In IqubDetailPage.vue Payments tab section

const creditRoundStatus = computed(() => 
  store.getters['iqubs/creditRoundStatus']
);

const isLoading = computed(() => 
  store.getters['iqubs/creditRoundStatusLoading']
);

const error = computed(() => 
  store.getters['iqubs/creditRoundStatusError']
);

const completionPercentage = computed(() => 
  creditRoundStatus.value?.current_credit_round.completion_percentage || 0
);

const canInitiateLottery = computed(() => 
  creditRoundStatus.value?.current_credit_round.can_initiate_lottery || false
);

const isComplete = computed(() => completionPercentage.value === 100);
```


### 3. Status Legend Component

#### Visual Design Specification

```css
/* Status Legend */
.status-legend {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.2s ease-in;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 12px;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-icon {
  font-size: 16px;
}

.legend-icon.verified {
  color: #10B981; /* Green */
}

.legend-icon.pending {
  color: #FFA500; /* Orange */
}

.legend-icon.not-started {
  color: #9CA3AF; /* Gray */
}

.legend-icon.failed {
  color: #DC3545; /* Red */
}

.legend-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```


### 4. Member Payment Card Component

#### Visual Design Specification

```css
/* Member Payment Card */
.member-payment-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.3s ease-in;
  animation-fill-mode: both;
}

/* Staggered animation */
.member-payment-card:nth-child(1) { animation-delay: 0ms; }
.member-payment-card:nth-child(2) { animation-delay: 100ms; }
.member-payment-card:nth-child(3) { animation-delay: 200ms; }
.member-payment-card:nth-child(4) { animation-delay: 300ms; }
.member-payment-card:nth-child(5) { animation-delay: 400ms; }

.member-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-avatar-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 4px;
}

.member-phone {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.contribution-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.contribution-badge.full {
  background: rgba(95, 217, 172, 0.1);
  color: var(--ion-color-medium-aquamarine);
}

.contribution-badge.half {
  background: rgba(95, 217, 172, 0.05);
  color: rgba(95, 217, 172, 0.7);
}

.saving-rounds-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.round-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background: var(--ion-color-white-smoke);
  min-width: 60px;
}

.round-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.round-status-icon {
  font-size: 20px;
}

.round-status-icon.verified {
  color: #10B981;
}

.round-status-icon.pending {
  color: #FFA500;
}

.round-status-icon.not-started {
  color: #9CA3AF;
}

.round-status-icon.failed {
  color: #DC3545;
}

.completion-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  text-align: right;
}
```

#### Component Logic

```typescript
// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return checkmarkCircleOutline;
    case 'pending':
      return timeOutline;
    case 'not_started':
      return ellipseOutline;
    case 'failed':
      return closeCircleOutline;
    default:
      return ellipseOutline;
  }
};

// Helper function to get status class
const getStatusClass = (status: string) => {
  return status.replace('_', '-');
};
```


### 5. Sticky Action Button Component

#### Visual Design Specification

```css
/* Sticky Action Button */
.sticky-action-button {
  position: fixed;
  bottom: 80px; /* Above tab bar */
  left: 16px;
  right: 16px;
  z-index: 100;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.initiate-lottery-button {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --border-radius: 16px;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  transition: all 0.1s ease;
}

.initiate-lottery-button:active {
  transform: scale(0.98);
}

.initiate-lottery-button.button-disabled {
  --background: #E5E7EB;
  --color: #9CA3AF;
  opacity: 0.5;
  box-shadow: none;
}

.button-icon {
  font-size: 24px;
  margin-right: 8px;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tooltip for disabled state */
.button-tooltip {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.sticky-action-button:hover .button-tooltip {
  opacity: 1;
}
```

#### Component Logic

```typescript
// Initiate Lottery Handler
const isInitiating = ref(false);

const initiateLottery = async () => {
  if (!canInitiateLottery.value || isInitiating.value) return;
  
  isInitiating.value = true;
  
  try {
    await store.dispatch('iqubs/initiateLottery', iqubId.value);
    
    // Show success toast
    showToast.value = true;
    toastMessage.value = 'Lottery initiated successfully!';
    toastColor.value = 'success';
    
    // Navigate to lottery tab
    setTimeout(() => {
      activeTab.value = 'lottery';
    }, 1000);
    
  } catch (error: any) {
    console.error('Failed to initiate lottery:', error);
    showToast.value = true;
    toastMessage.value = error.message || 'Failed to initiate lottery';
    toastColor.value = 'danger';
  } finally {
    isInitiating.value = false;
  }
};
```


### 6. Loading, Error, and Empty States

#### Visual Design Specification

```css
/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: fadeIn 0.2s ease-in;
}

.loading-spinner {
  --color: var(--ion-color-medium-aquamarine);
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-color-medium);
}

/* Skeleton Cards */
.skeleton-card {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  height: 120px;
  margin-bottom: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.error-icon {
  font-size: 64px;
  color: var(--ion-color-danger);
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
}

.error-message {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}

.retry-button {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.empty-icon {
  font-size: 80px;
  color: rgba(95, 217, 172, 0.3);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}

.empty-action-button {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}
```


### 7. Refresh Functionality

#### Visual Design Specification

```css
/* Refresh Button */
.refresh-button {
  position: absolute;
  top: 16px;
  right: 16px;
  --color: var(--ion-color-medium-aquamarine);
  --padding-start: 8px;
  --padding-end: 8px;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  transition: transform 0.1s ease;
}

.refresh-button:active {
  transform: scale(0.95);
}

.refresh-icon {
  font-size: 24px;
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 0.5s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.refresh-success-icon {
  font-size: 24px;
  color: #10B981;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### Component Logic

```typescript
// Refresh Handler
const isRefreshing = ref(false);
const showRefreshSuccess = ref(false);

const refreshPaymentStatus = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  showRefreshSuccess.value = false;
  
  try {
    await store.dispatch('iqubs/fetchCreditRoundStatus', iqubId.value);
    
    // Show success feedback
    showRefreshSuccess.value = true;
    setTimeout(() => {
      showRefreshSuccess.value = false;
    }, 2000);
    
  } catch (error: any) {
    console.error('Failed to refresh payment status:', error);
    showToast.value = true;
    toastMessage.value = 'Failed to refresh payment status';
    toastColor.value = 'danger';
  } finally {
    isRefreshing.value = false;
  }
};
```

## Lifecycle Management

### Component Mount

```typescript
// Watch for tab activation
watch(
  () => activeTab.value,
  (newTab) => {
    if (newTab === 'payments') {
      // Fetch credit round status when Payments tab is activated
      if (iqubId.value) {
        store.dispatch('iqubs/fetchCreditRoundStatus', iqubId.value);
      }
    }
  }
);

// Cleanup on unmount
onUnmounted(() => {
  store.commit('iqubs/clearCreditRoundStatus');
});
```

## Performance Optimization

### Computed Properties Caching

```typescript
// Cache expensive computations
const members = computed(() => 
  creditRoundStatus.value?.members || []
);

const sortedMembers = computed(() => {
  // Sort members: incomplete first, then by name
  return [...members.value].sort((a, b) => {
    if (a.is_complete !== b.is_complete) {
      return a.is_complete ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });
});
```

### Conditional Rendering

```vue
<!-- Only render when data is available -->
<div v-if="!isLoading && !error && creditRoundStatus" class="payments-content">
  <!-- Content -->
</div>

<!-- Lazy load member cards -->
<div v-for="(member, index) in sortedMembers" :key="member.member_id">
  <member-payment-card :member="member" :style="{ animationDelay: `${index * 100}ms` }" />
</div>
```

## Accessibility Considerations

### ARIA Labels

```vue
<!-- Header Card -->
<div 
  class="credit-round-header"
  role="region"
  aria-label="Current credit round status"
>
  <!-- Progress Ring -->
  <div 
    class="progress-container"
    role="progressbar"
    :aria-valuenow="completionPercentage"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`Completion progress: ${completionPercentage} percent`"
  >
    <!-- Content -->
  </div>
</div>

<!-- Member Card -->
<div 
  class="member-payment-card"
  role="article"
  :aria-label="`Member: ${member.name}, ${member.completed_count} of ${member.required_count} payments complete`"
>
  <!-- Content -->
</div>

<!-- Initiate Lottery Button -->
<ion-button
  class="initiate-lottery-button"
  :disabled="!canInitiateLottery"
  :aria-label="`Initiate lottery for credit round ${creditRoundStatus?.current_credit_round.credit_round_number}`"
  :aria-disabled="!canInitiateLottery"
  @click="initiateLottery"
>
  <!-- Content -->
</ion-button>

<!-- Error Message -->
<div 
  class="error-state"
  role="alert"
  aria-live="polite"
>
  <!-- Content -->
</div>
```

## Testing Strategy

### Unit Tests

```typescript
describe('Payments Tab', () => {
  it('should fetch credit round status on tab activation', async () => {
    const wrapper = mount(IqubDetailPage);
    wrapper.vm.activeTab = 'payments';
    await wrapper.vm.$nextTick();
    expect(store.dispatch).toHaveBeenCalledWith('iqubs/fetchCreditRoundStatus', iqubId);
  });
  
  it('should display loading state while fetching', () => {
    store.state.iqubs.creditRoundStatusLoading = true;
    const wrapper = mount(IqubDetailPage);
    expect(wrapper.find('.loading-state').exists()).toBe(true);
  });
  
  it('should display error state on fetch failure', () => {
    store.state.iqubs.creditRoundStatusError = 'Failed to fetch';
    const wrapper = mount(IqubDetailPage);
    expect(wrapper.find('.error-state').exists()).toBe(true);
  });
  
  it('should enable lottery button when completion is 100%', () => {
    store.state.iqubs.creditRoundStatus = {
      current_credit_round: { completion_percentage: 100, can_initiate_lottery: true }
    };
    const wrapper = mount(IqubDetailPage);
    expect(wrapper.find('.initiate-lottery-button').attributes('disabled')).toBeUndefined();
  });
  
  it('should disable lottery button when completion is less than 100%', () => {
    store.state.iqubs.creditRoundStatus = {
      current_credit_round: { completion_percentage: 75, can_initiate_lottery: false }
    };
    const wrapper = mount(IqubDetailPage);
    expect(wrapper.find('.initiate-lottery-button').attributes('disabled')).toBe('true');
  });
});
```

## Conclusion

This design document provides a comprehensive blueprint for implementing the Payments tab in IqubDetailPage. The implementation focuses on:

- **Real-Time Data**: Fetching and displaying current credit round payment status
- **Premium UI**: Applying Wujo brand colors with gradients and sophisticated styling
- **Clear Indicators**: Using icons and colors to show payment verification states
- **Conditional Actions**: Enabling lottery initiation only when all payments are verified
- **Mobile Optimization**: Ensuring touch-friendly interactions and responsive layouts
- **Accessibility**: Including ARIA labels and keyboard navigation support

The implementation will follow Vue 3 Composition API best practices and Wujo UI/UX guidelines to deliver a premium FinTech experience.
