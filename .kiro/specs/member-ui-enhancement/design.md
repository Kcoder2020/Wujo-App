# Member UI Enhancement - Design Document

## Overview
This design document outlines the comprehensive transformation of all member-related pages and components to match the premium Wujo brand identity. The design follows the same high-quality standards established in the collector dashboard while creating a distinct member-focused experience centered on savings progress, lottery participation, and achievement tracking.

---

## Architecture

### Component Hierarchy

```
Member Experience
├── MemberDashboard.vue (Main landing page)
│   ├── Hero Section (Premium gradient header)
│   ├── Summary Cards (Savings, Active Iqubs, Lottery Position)
│   ├── Recent Activity Feed
│   ├── Quick Actions
│   └── Floating Refresh FAB
│
├── MemberMyIqubsPage.vue (IqubBook)
│   ├── Hero Section
│   ├── MemberIqubCard[] (List of joined Iqubs)
│   │   ├── SavingsProgressRing
│   │   └── Status Badge
│   └── Empty State
│
├── MemberDiscoverPage.vue
│   ├── Search Bar
│   ├── Filter Chips
│   ├── DiscoverIqubCard[] (Available Iqubs)
│   └── Join Confirmation Dialog
│
├── MemberProfilePage.vue
│   ├── Profile Hero Section
│   ├── Achievement Badges
│   ├── Savings History Timeline
│   │   └── PaymentHistoryItem[]
│   ├── Lottery Wins Display
│   └── Edit Profile Modal
│
└── Shared Components
    ├── MemberTabBar.vue (Navigation)
    ├── MemberHeroSection.vue (Reusable hero)
    ├── ProgressRing.vue (Circular progress)
    ├── SavingsProgressRing.vue (Member-specific)
    ├── LotteryCountdown.vue (Countdown timer)
    ├── AchievementBadge.vue (Milestone badges)
    └── PaymentHistoryItem.vue (Timeline item)
```

### State Management

```typescript
// Member Vuex Store Enhancement
interface MemberState {
  profile: MemberProfile | null;
  dashboard: MemberDashboard | null;
  joinedIqubs: Iqub[];
  availableIqubs: Iqub[];
  recentActivity: Activity[];
  achievements: Achievement[];
  paymentHistory: Payment[];
  error: string | null;
  status: FetchStatus;
}

// New Actions
- fetchMemberDashboard()
- fetchJoinedIqubs()
- fetchAvailableIqubs(filters)
- joinIqub(iqubId)
- updateMemberProfile(data)
- fetchAchievements()
- fetchPaymentHistory()
```

---

## Components and Interfaces

### 1. MemberDashboard.vue - Premium Landing Page

#### Design Specifications

**Hero Section:**
- Background: Linear gradient `135deg, #014023 0%, #012d19 50%, rgba(95, 217, 172, 0.1) 100%`
- Height: Auto (content-based)
- Padding: 24px
- Border Radius: 0 0 24px 24px (rounded bottom)

**Greeting:**
```vue
<h1 class="hero-greeting">Welcome Back, {{ userName }}!</h1>
```
- Font Size: 32px
- Font Weight: Bold
- Color: White
- Animation: fadeInDown 0.5s ease-out

**Summary Cards Grid:**
```vue
<div class="summary-cards">
  <div class="summary-card">
    <ProgressRing :percentage="savingsPercentage" />
    <h3>Total Savings</h3>
    <p class="value">{{ formatCurrency(totalSavings) }}</p>
    <p class="trend">+12% this month</p>
  </div>
  <!-- More cards... -->
</div>
```

**Card Styling:**
- Background: #014023 (dark green)
- Color: White
- Border Radius: 20px
- Padding: 24px
- Shadow: `0 8px 32px rgba(1, 64, 35, 0.2)`
- Animation: scaleIn 0.3s ease-out (staggered)

**Recent Activity Feed:**
```vue
<div class="activity-feed">
  <div class="activity-item" v-for="activity in recentActivities">
    <ion-icon :icon="activityIcon(activity.type)" />
    <div class="activity-content">
      <p class="activity-title">{{ activity.title }}</p>
      <p class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</p>
    </div>
  </div>
</div>
```

**Activity Types:**
- Payment Made: `cash-outline` icon, aquamarine color
- Lottery Won: `trophy-outline` icon, gold color
- Iqub Joined: `people-outline` icon, green color

**Quick Actions:**
```vue
<div class="quick-actions">
  <ion-button class="action-btn" @click="goToDiscover">
    <ion-icon :icon="searchOutline" />
    Discover Iqubs
  </ion-button>
  <ion-button class="action-btn" @click="makePayment">
    <ion-icon :icon="cardOutline" />
    Make Payment
  </ion-button>
  <ion-button class="action-btn" @click="viewProfile">
    <ion-icon :icon="personOutline" />
    View Profile
  </ion-button>
</div>
```

**Button Styling:**
- Background: #5FD9AC (aquamarine)
- Color: #014023 (dark green text)
- Height: 56px
- Border Radius: 16px
- Shadow: `0 8px 24px rgba(95, 217, 172, 0.35)`
- Position: Bottom 30% (thumb zone)

#### Data Structure

```typescript
interface MemberDashboard {
  totalSavings: number;
  savingsPercentage: number;
  activeIqubs: number;
  completedIqubs: number;
  lotteryPosition: number;
  nextLotteryDate: string;
  recentActivities: Activity[];
  quickStats: {
    paymentsThisMonth: number;
    lotteriesWon: number;
    savingsGoal: number;
  };
}

interface Activity {
  id: string;
  type: 'payment' | 'lottery_win' | 'iqub_join';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  iqubName?: string;
}
```

---

### 2. MemberIqubCard Component

#### Design Specifications

```vue
<div class="member-iqub-card">
  <div class="card-header">
    <h3 class="iqub-name">{{ iqub.name }}</h3>
    <span class="status-badge" :class="statusClass">{{ iqub.status }}</span>
  </div>
  
  <div class="card-body">
    <div class="progress-section">
      <SavingsProgressRing 
        :percentage="iqub.completionPercentage"
        :current="iqub.currentAmount"
        :target="iqub.targetAmount"
      />
    </div>
    
    <div class="info-section">
      <div class="info-item">
        <ion-icon :icon="calendarOutline" />
        <span>Next Lottery: {{ formatDate(iqub.nextLotteryDate) }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="peopleOutline" />
        <span>{{ iqub.membersCount }} Members</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="cashOutline" />
        <span>{{ formatCurrency(iqub.savingAmount) }}/round</span>
      </div>
    </div>
  </div>
  
  <div class="card-footer">
    <ion-button expand="block" @click="viewDetails">View Details</ion-button>
  </div>
</div>
```

**Card Styling:**
- Background: White
- Border Radius: 20px
- Padding: 20px
- Shadow: `0 4px 16px rgba(0, 0, 0, 0.08)`
- Margin: 12px 0
- Transition: `transform 0.2s, box-shadow 0.2s`
- Hover: `transform: translateY(-4px)`, shadow increase

**Status Badge Colors:**
- Active: `background: #5FD9AC, color: #014023`
- Completed: `background: #4285f4, color: white`
- Pending: `background: #FFA500, color: white`

---

### 3. SavingsProgressRing Component

#### Design Specifications

```vue
<div class="savings-progress-ring">
  <svg :width="size" :height="size" class="progress-svg">
    <circle
      class="progress-bg"
      :cx="center"
      :cy="center"
      :r="radius"
      :stroke-width="strokeWidth"
    />
    <circle
      class="progress-bar"
      :cx="center"
      :cy="center"
      :r="radius"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
    />
  </svg>
  <div class="progress-content">
    <span class="percentage">{{ percentage }}%</span>
    <span class="amount">{{ formatCurrency(current) }}</span>
    <span class="target">of {{ formatCurrency(target) }}</span>
  </div>
</div>
```

**Props:**
```typescript
interface ProgressRingProps {
  percentage: number;
  current: number;
  target: number;
  size?: number; // default: 120
  strokeWidth?: number; // default: 8
}
```

**Styling:**
- Progress Bar Color: #5FD9AC (aquamarine)
- Background Circle: `rgba(1, 64, 35, 0.1)`
- Animation: Smooth stroke-dashoffset transition 1s ease-out
- Center Text: Absolute positioned, centered

---

### 4. LotteryCountdown Component

#### Design Specifications

```vue
<div class="lottery-countdown">
  <div class="countdown-ring">
    <svg viewBox="0 0 100 100">
      <circle class="countdown-bg" cx="50" cy="50" r="45" />
      <circle 
        class="countdown-progress" 
        cx="50" cy="50" r="45"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="countdownOffset"
      />
    </svg>
    <div class="countdown-content">
      <ion-icon :icon="trophyOutline" />
      <span class="countdown-label">Next Lottery</span>
    </div>
  </div>
  
  <div class="countdown-time">
    <div class="time-unit">
      <span class="time-value">{{ days }}</span>
      <span class="time-label">Days</span>
    </div>
    <div class="time-separator">:</div>
    <div class="time-unit">
      <span class="time-value">{{ hours }}</span>
      <span class="time-label">Hours</span>
    </div>
    <div class="time-separator">:</div>
    <div class="time-unit">
      <span class="time-value">{{ minutes }}</span>
      <span class="time-label">Min</span>
    </div>
  </div>
</div>
```

**Special States:**
- Lottery Today: Pulsing animation, gold color
- Less than 24 hours: Orange color, faster pulse
- More than 7 days: Normal aquamarine color

---

### 5. AchievementBadge Component

#### Design Specifications

```vue
<div class="achievement-badge" :class="{ earned: achievement.earned }">
  <div class="badge-icon">
    <ion-icon :icon="achievement.icon" />
  </div>
  <div class="badge-info">
    <h4 class="badge-title">{{ achievement.title }}</h4>
    <p class="badge-description">{{ achievement.description }}</p>
    <div v-if="!achievement.earned" class="badge-progress">
      <div class="progress-bar" :style="{ width: achievement.progress + '%' }"></div>
    </div>
  </div>
  <div v-if="achievement.earned" class="badge-checkmark">
    <ion-icon :icon="checkmarkCircle" />
  </div>
</div>
```

**Achievement Types:**
- First Iqub: `ribbon-outline`
- 5 Iqubs Joined: `star-outline`
- First Lottery Win: `trophy-outline`
- 10,000 ETB Saved: `cash-outline`
- Perfect Attendance: `calendar-outline`

**Styling:**
- Earned: Full color, scale animation on reveal
- Unearned: Grayscale, 50% opacity
- Progress Bar: Aquamarine color

---

### 6. PaymentHistoryItem Component

#### Design Specifications

```vue
<div class="payment-history-item">
  <div class="timeline-marker">
    <div class="marker-dot" :class="statusClass"></div>
    <div class="marker-line"></div>
  </div>
  
  <div class="payment-card">
    <div class="payment-header">
      <h4 class="iqub-name">{{ payment.iqubName }}</h4>
      <span class="payment-amount">{{ formatCurrency(payment.amount) }}</span>
    </div>
    <div class="payment-details">
      <p class="payment-date">{{ formatDate(payment.date) }}</p>
      <span class="payment-status" :class="statusClass">{{ payment.status }}</span>
    </div>
    <ion-button v-if="payment.receiptUrl" fill="clear" size="small" @click="viewReceipt">
      View Receipt
    </ion-button>
  </div>
</div>
```

**Timeline Styling:**
- Marker Dot: 12px circle, aquamarine for completed
- Marker Line: 2px width, light gray
- Card: White background, subtle shadow
- Spacing: 16px between items

---

## Data Models

### Member Dashboard Data

```typescript
interface MemberDashboardData {
  member: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    joinDate: string;
  };
  summary: {
    totalSavings: number;
    savingsPercentage: number;
    activeIqubs: number;
    completedIqubs: number;
    lotteryPosition: number;
    nextLotteryDate: string;
  };
  recentActivities: Activity[];
  quickStats: {
    paymentsThisMonth: number;
    lotteriesWon: number;
    savingsGoal: number;
  };
}
```

### Joined Iqub Data

```typescript
interface JoinedIqub {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  currentAmount: number;
  targetAmount: number;
  completionPercentage: number;
  savingAmount: number;
  nextLotteryDate: string;
  membersCount: number;
  currentRound: number;
  totalRounds: number;
  collectorName: string;
}
```

### Available Iqub Data

```typescript
interface AvailableIqub {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  savingAmount: number;
  duration: number; // months
  membersCount: number;
  spotsAvailable: number;
  startDate: string;
  collectorName: string;
  collectorRating: number;
  category: string;
}
```

---

## Error Handling

### Error States

1. **Network Error:**
   - Display: Retry button with error message
   - Action: Allow manual retry
   - Fallback: Show cached data if available

2. **Authentication Error:**
   - Display: Redirect to login
   - Action: Clear token, navigate to /login
   - Message: "Session expired. Please log in again."

3. **API Error:**
   - Display: Toast notification with error message
   - Action: Log error, show user-friendly message
   - Fallback: Keep previous data visible

4. **Validation Error:**
   - Display: Inline error messages
   - Action: Highlight invalid fields
   - Message: Specific validation feedback

### Loading States

1. **Initial Load:**
   - Skeleton loaders matching content structure
   - Shimmer animation
   - Duration: Until data arrives

2. **Refresh:**
   - Pull-to-refresh spinner
   - Disable interactions during refresh
   - Success toast on completion

3. **Action Loading:**
   - Button spinner
   - Disable button during action
   - Success/error feedback

---

## Testing Strategy

### Unit Tests

1. **Component Tests:**
   - Test all props and events
   - Test computed properties
   - Test conditional rendering
   - Test animations trigger

2. **Store Tests:**
   - Test all actions
   - Test mutations
   - Test getters
   - Test error handling

3. **Utility Tests:**
   - Test formatters
   - Test validators
   - Test date calculations

### Integration Tests

1. **Page Flow Tests:**
   - Test navigation between pages
   - Test data flow from store to components
   - Test API integration
   - Test error scenarios

2. **User Journey Tests:**
   - Test complete member onboarding
   - Test Iqub discovery and joining
   - Test payment flow
   - Test profile editing

### Visual Regression Tests

1. **Component Snapshots:**
   - Capture all component states
   - Test responsive breakpoints
   - Test dark/light themes
   - Test animation states

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:**
   - Lazy load routes
   - Lazy load heavy components
   - Lazy load images

2. **Code Splitting:**
   - Split by route
   - Split large components
   - Split third-party libraries

3. **Caching:**
   - Cache API responses
   - Cache computed values
   - Cache formatted data

4. **Animation Performance:**
   - Use transform and opacity only
   - Use will-change sparingly
   - Debounce scroll events

---

**Document Version:** 1.0  
**Last Updated:** December 13, 2024  
**Status:** Approved - Ready for Implementation
