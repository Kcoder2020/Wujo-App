# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for transforming the Wujo app's Iqub management pages into premium FinTech experiences. The design follows the established Wujo UI/UX guidelines, implements mobile-first principles, and integrates seamlessly with the functional backend APIs.

### Design Goals

1. **Premium FinTech Aesthetic**: Apply Wujo brand identity consistently across all pages
2. **Mobile-First Experience**: Optimize for one-handed use with thumb-zone placement
3. **Seamless API Integration**: Connect to fully functional backend endpoints
4. **Performance Excellence**: Achieve smooth 60fps animations and fast load times
5. **Ethiopian Localization**: Proper currency and phone number formatting

## Architecture

### Component Hierarchy

```
CreateIqubPage.vue
├── Hero Section (Dark Green Gradient)
├── Progress Indicator (Aquamarine)
├── Multi-Step Wizard Form
│   ├── Step 1: Basic Information
│   │   ├── Iqub Name Input
│   │   ├── Members Count Input
│   │   └── Duration Estimate Card
│   ├── Step 2: Financial Details
│   │   ├── Saving Pattern Selector (Cards)
│   │   ├── Saving Amount Input (Currency)
│   │   ├── Credit Pattern Selector (Cards)
│   │   └── Credit Amount Input (Currency)
│   └── Step 3: Review & Confirm
│       ├── Summary Card
│       ├── Calculations Card
│       └── Terms Checkbox
├── Navigation Buttons (Previous/Next/Submit)
└── Success Animation Modal

MyIqubsPage.vue
├── Hero Section (Dark Green Gradient)
├── Search Bar (White Smoke)
├── Filter Chips (Aquamarine Active)
├── Iqubs Grid/List
│   └── Premium Iqub Card (Dark Green)
│       ├── Iqub Name
│       ├── Progress Ring (Aquamarine)
│       ├── Total Collected (ETB)
│       └── Hosted Lottery Count
├── Empty State (Illustration + CTA)
├── Floating Action Button (Aquamarine)
└── Pull-to-Refresh

IqubDetailPage.vue
├── Hero Card (Dark Green Premium)
│   ├── Iqub Name
│   ├── Total Amount (ETB)
│   ├── Collected Amount (ETB)
│   └── Progress Ring (Aquamarine)
├── Tabbed Interface
│   ├── Overview Tab
│   │   ├── Statistics Cards
│   │   └── Recent Activity Timeline
│   ├── Members Tab
│   │   ├── Members List
│   │   ├── Add Member Button
│   │   └── Member Cards
│   ├── Payments Tab
│   │   ├── Payment Rounds List
│   │   └── Verification Status
│   └── Lottery Tab
│       ├── Next Lottery Date Picker
│       ├── Set Date Button
│       └── Initiate Lottery Button
└── Add Member Bottom Sheet Modal
    ├── Name Input
    ├── Phone Input (E.164 Validation)
    └── Action Buttons
```

### State Management Architecture

```typescript
// Vuex Store Structure
store/
├── modules/
│   ├── auth.ts          // User authentication state
│   ├── iqubs.ts         // Iqub management state
│   └── ui.ts            // UI state (loading, errors, toasts)
```

### API Integration Layer

```typescript
// services/api.ts
class IqubAPI {
  // Create Iqub
  async createIqub(data: CreateIqubPayload): Promise<Iqub>
  
  // Get My Iqubs
  async getMyIqubs(): Promise<Iqub[]>
  
  // Get Iqub Details
  async getIqubDetails(iqubId: string): Promise<IqubDetail>
  
  // Add Member
  async addMember(iqubId: string, phone: string): Promise<void>
  
  // Initiate Lottery
  async initiateLottery(iqubId: string): Promise<void>
  
  // Set Next Lottery Date
  async setNextLotteryDate(iqubId: string, date: string): Promise<void>
}
```

## Components and Interfaces

### 1. CreateIqubPage Component

#### Component Structure

```vue
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useIonRouter } from '@ionic/vue';

// State
const currentStep = ref(1);
const focusedField = ref('');
const acceptTerms = ref(false);
const showSuccess = ref(false);

// Form Data
const formData = reactive({
  name: '',
  saving_pattern: null,
  saving_amount: null,
  credit_pattern: null,
  credit_amount: null,
  members_count: null
});

// Computed Properties
const progressWidth = computed(() => `${(currentStep.value / 3) * 100}%`);
const canProceedToNext = computed(() => validateCurrentStep());
const totalPerRound = computed(() => formData.saving_amount * formData.members_count);
const totalIqubValue = computed(() => totalPerRound.value * formData.members_count);

// Methods
const nextStep = () => { /* ... */ };
const previousStep = () => { /* ... */ };
const createIqub = async () => { /* ... */ };
</script>
```

#### Styling Approach

```css
/* Hero Section with Gradient */
.hero-section {
  background: linear-gradient(135deg, #014023 0%, #012d19 50%, rgba(95, 217, 172, 0.1) 100%);
  padding: 60px 24px 80px;
  position: relative;
}

/* Form Container with Rounded Top */
.form-container {
  background: white;
  border-radius: 32px 32px 0 0;
  margin-top: -50px;
  box-shadow: 0 -8px 48px rgba(1, 64, 35, 0.15);
}

/* Modern Input with Focus State */
.modern-item {
  background: var(--ion-color-white-smoke);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-item.item-has-focus {
  background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.15);
  transform: translateY(-2px);
}

/* Pattern Selection Cards */
.pattern-card {
  background: var(--ion-color-white-smoke);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.pattern-card.active {
  background: var(--ion-color-medium-aquamarine);
  color: var(--ion-color-dark-green);
  transform: scale(1.05);
}
```

#### Currency Formatting Logic

```typescript
// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ET', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Parse currency input
const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^0-9]/g, '')) || 0;
};

// Handle currency input with auto-formatting
const handleSavingAmountInput = (event: any) => {
  const value = event.target.value;
  const numericValue = parseCurrency(value);
  formData.saving_amount = numericValue;
  savingAmountInput.value = formatCurrency(numericValue);
};
```

#### Validation Logic

```typescript
const validateField = (field: string) => {
  switch (field) {
    case 'name':
      errors.name = !formData.name.trim() ? 'Iqub name is required' : '';
      break;
    case 'members_count':
      if (!formData.members_count) {
        errors.members_count = 'Number of members is required';
      } else if (formData.members_count < 2) {
        errors.members_count = 'At least 2 members are required';
      } else if (formData.members_count > 50) {
        errors.members_count = 'Maximum 50 members allowed';
      } else {
        errors.members_count = '';
      }
      break;
    // ... other fields
  }
};
```

### 2. MyIqubsPage Component

#### Component Structure

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

// State
const searchQuery = ref('');
const selectedFilter = ref('all');
const isRefreshing = ref(false);

// Computed
const myIqubs = computed(() => store.getters['iqubs/iqubs']);
const filteredIqubs = computed(() => {
  let iqubs = myIqubs.value;
  
  // Apply search filter
  if (searchQuery.value) {
    iqubs = iqubs.filter(iqub => 
      iqub.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Apply status filter
  if (selectedFilter.value !== 'all') {
    iqubs = iqubs.filter(iqub => iqub.status === selectedFilter.value);
  }
  
  return iqubs;
});

// Methods
const refreshIqubs = async (event: any) => {
  await store.dispatch('iqubs/fetchMyIqubs');
  event.target.complete();
};
</script>
```

#### Premium Card Design

```css
/* Premium Iqub Card */
.iqub-card {
  background: var(--ion-color-dark-green);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.iqub-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(1, 64, 35, 0.3);
}

/* Progress Ring */
.progress-ring {
  width: 80px;
  height: 80px;
  position: relative;
}

.progress-ring-circle {
  stroke: var(--ion-color-medium-aquamarine);
  stroke-width: 8;
  fill: none;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.5s ease;
}
```

#### Skeleton Loader

```css
/* Skeleton Loader with Shimmer */
.skeleton-card {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f5f5f5 50%,
    #e0e0e0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
  height: 180px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 3. IqubDetailPage Component

#### Component Structure

```vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

// State
const activeTab = ref('overview');
const isModalOpen = ref(false);
const memberName = ref('');
const phoneNumber = ref('');
const nextLotteryDate = ref<string | undefined>(undefined);

// Computed
const iqubId = computed(() => Number(route.params.id));
const currentIqub = computed(() => store.getters['iqubs/getIqubById'](iqubId.value));
const completionPercentage = computed(() => {
  if (!currentIqub.value) return 0;
  return (currentIqub.value.current_members / currentIqub.value.members_count) * 100;
});

// Methods
const addMember = async () => {
  const e164Phone = formatPhoneToE164(phoneNumber.value);
  await store.dispatch('iqubs/addMemberToIqub', {
    iqubId: iqubId.value,
    phone: e164Phone,
    name: memberName.value
  });
};
</script>
```

#### Tabbed Interface Design

```css
/* Tab Bar */
.tab-bar {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 4px;
  margin: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  color: var(--ion-color-medium);
  font-weight: 600;
  transition: all 0.3s;
}

.tab-button.active {
  background: var(--ion-color-medium-aquamarine);
  color: var(--ion-color-dark-green);
  box-shadow: 0 2px 8px rgba(95, 217, 172, 0.3);
}
```

#### Bottom Sheet Modal

```css
/* Bottom Sheet Modal */
.bottom-sheet-modal {
  --height: auto;
  --border-radius: 24px 24px 0 0;
  --box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
}

.modal-handle {
  width: 40px;
  height: 4px;
  background: var(--ion-color-medium);
  border-radius: 2px;
  margin: 12px auto;
}

.modal-content {
  padding: 24px;
  animation: slideUpModal 0.3s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes slideUpModal {
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

## Data Models

### TypeScript Interfaces

```typescript
// Iqub Interface
interface Iqub {
  id: string;
  collector_id: string;
  name: string;
  saving_pattern: 1 | 2 | 3; // 1=Weekly, 2=Bi-weekly, 3=Monthly
  saving_amount: number;
  credit_pattern: 1 | 2 | 3;
  credit_amount: number;
  members_count: number;
  current_members: number;
  status: 'pending' | 'active' | 'completed';
  next_lottery_date: string | null;
  created_at: string;
  updated_at: string;
  hosted_lottery?: string; // e.g., "5/10"
  total_collected?: number;
}

// Member Interface
interface Member {
  id: string;
  name: string;
  phone: string;
  saving_rounds?: number;
  rounds_completed?: number;
  status: 'active' | 'inactive';
}

// Create Iqub Payload
interface CreateIqubPayload {
  name: string;
  saving_pattern: number;
  saving_amount: number;
  credit_pattern: number;
  credit_amount: number;
  members_count: number;
}

// Add Member Payload
interface AddMemberPayload {
  phone: string;
  name?: string;
}
```

### Vuex Store State

```typescript
// iqubs module state
interface IqubsState {
  iqubs: Iqub[];
  selectedIqub: Iqub | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

// Actions
const actions = {
  async createIqub({ commit }, payload: CreateIqubPayload) {
    commit('setStatus', 'loading');
    try {
      const response = await api.post('/api/createIqub', payload);
      commit('addIqub', response.data.iqub);
      commit('setStatus', 'success');
      return response.data.iqub;
    } catch (error) {
      commit('setError', error.message);
      commit('setStatus', 'error');
      throw error;
    }
  },
  
  async fetchMyIqubs({ commit }) {
    commit('setStatus', 'loading');
    try {
      const response = await api.get('/api/myIqubs');
      commit('setIqubs', response.data.data);
      commit('setStatus', 'success');
    } catch (error) {
      commit('setError', error.message);
      commit('setStatus', 'error');
    }
  },
  
  async fetchIqubDetails({ commit }, iqubId: string) {
    commit('setStatus', 'loading');
    try {
      const response = await api.get(`/api/iqubs/${iqubId}`);
      commit('setSelectedIqub', response.data.data);
      commit('setStatus', 'success');
    } catch (error) {
      commit('setError', error.message);
      commit('setStatus', 'error');
    }
  },
  
  async addMemberToIqub({ commit, dispatch }, { iqubId, phone, name }) {
    try {
      await api.post(`/api/iqubs/${iqubId}/members`, { phone, name });
      await dispatch('fetchIqubDetails', iqubId);
    } catch (error) {
      throw error;
    }
  },
  
  async initiateLottery({ commit, dispatch }, iqubId: string) {
    try {
      await api.post(`/api/iqubs/${iqubId}/lottery/initiate`);
      await dispatch('fetchIqubDetails', iqubId);
    } catch (error) {
      throw error;
    }
  },
  
  async setNextLotteryDate({ commit, dispatch }, { iqubId, nextLotteryDate }) {
    try {
      await api.put(`/api/iqubs/${iqubId}/next-lottery-date`, { date: nextLotteryDate });
      await dispatch('fetchIqubDetails', iqubId);
    } catch (error) {
      throw error;
    }
  }
};
```

## Error Handling

### Error Handling Strategy

```typescript
// Centralized error handler
class ErrorHandler {
  static handle(error: any, context: string) {
    console.error(`[${context}]`, error);
    
    // Extract error message
    const message = error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';
    
    // Show user-friendly toast
    this.showToast(message, 'danger');
    
    // Log to monitoring service (if available)
    this.logError(error, context);
    
    return message;
  }
  
  static showToast(message: string, color: string) {
    // Implementation using Ionic toast controller
  }
  
  static logError(error: any, context: string) {
    // Send to error monitoring service (e.g., Sentry)
  }
}

// Usage in components
try {
  await store.dispatch('iqubs/createIqub', formData);
} catch (error) {
  ErrorHandler.handle(error, 'CreateIqubPage');
}
```

### Validation Error Display

```typescript
// Handle backend validation errors
const handleValidationErrors = (error: any) => {
  if (error.response?.data?.errors) {
    const backendErrors = error.response.data.errors;
    Object.keys(backendErrors).forEach(field => {
      if (errors.hasOwnProperty(field)) {
        errors[field] = backendErrors[field][0];
      }
    });
  }
};
```

## Testing Strategy

### Unit Testing

```typescript
// CreateIqubPage.spec.ts
describe('CreateIqubPage', () => {
  it('should validate Iqub name is required', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.validateField('name');
    expect(wrapper.vm.errors.name).toBe('Iqub name is required');
  });
  
  it('should format currency with commas', () => {
    const wrapper = mount(CreateIqubPage);
    const formatted = wrapper.vm.formatCurrency(10000);
    expect(formatted).toBe('10,000');
  });
  
  it('should calculate total per round correctly', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.formData.saving_amount = 1000;
    wrapper.vm.formData.members_count = 10;
    expect(wrapper.vm.totalPerRound).toBe(10000);
  });
});
```

### Integration Testing

```typescript
// IqubAPI.spec.ts
describe('IqubAPI', () => {
  it('should create Iqub successfully', async () => {
    const payload = {
      name: 'Test Iqub',
      saving_pattern: 1,
      saving_amount: 1000,
      credit_pattern: 1,
      credit_amount: 10000,
      members_count: 10
    };
    
    const response = await IqubAPI.createIqub(payload);
    expect(response.name).toBe('Test Iqub');
    expect(response.status).toBe('pending');
  });
});
```

### E2E Testing

```typescript
// create-iqub.e2e.ts
describe('Create Iqub Flow', () => {
  it('should complete full wizard and create Iqub', () => {
    cy.visit('/collector/create-iqub');
    
    // Step 1
    cy.get('[data-test="iqub-name"]').type('Test Iqub');
    cy.get('[data-test="members-count"]').type('10');
    cy.get('[data-test="next-button"]').click();
    
    // Step 2
    cy.get('[data-test="pattern-weekly"]').click();
    cy.get('[data-test="saving-amount"]').type('1000');
    cy.get('[data-test="credit-amount"]').type('10000');
    cy.get('[data-test="next-button"]').click();
    
    // Step 3
    cy.get('[data-test="terms-checkbox"]').click();
    cy.get('[data-test="submit-button"]').click();
    
    // Verify success
    cy.get('[data-test="success-animation"]').should('be.visible');
    cy.url().should('include', '/collector/my-iqubs');
  });
});
```

## Performance Optimization

### Code Splitting

```typescript
// router/index.ts
const routes = [
  {
    path: '/collector/create-iqub',
    component: () => import('@/views/CreateIqubPage.vue') // Lazy load
  },
  {
    path: '/collector/my-iqubs',
    component: () => import('@/views/MyIqubsPage.vue')
  },
  {
    path: '/iqub/:id',
    component: () => import('@/views/IqubDetailPage.vue')
  }
];
```

### Virtual Scrolling

```vue
<!-- For large lists -->
<ion-virtual-scroll
  :items="filteredIqubs"
  approxItemHeight="180px"
>
  <template v-slot="{ item }">
    <iqub-card :iqub="item" />
  </template>
</ion-virtual-scroll>
```

### Image Optimization

```typescript
// Use WebP format with fallback
<picture>
  <source srcset="empty-state.webp" type="image/webp">
  <img src="empty-state.png" alt="No Iqubs">
</picture>
```

### Caching Strategy

```typescript
// Cache Iqubs data in localStorage
const cacheIqubs = (iqubs: Iqub[]) => {
  localStorage.setItem('cached_iqubs', JSON.stringify(iqubs));
  localStorage.setItem('cached_iqubs_timestamp', Date.now().toString());
};

const getCachedIqubs = (): Iqub[] | null => {
  const cached = localStorage.getItem('cached_iqubs');
  const timestamp = localStorage.getItem('cached_iqubs_timestamp');
  
  if (!cached || !timestamp) return null;
  
  // Cache valid for 5 minutes
  const age = Date.now() - parseInt(timestamp);
  if (age > 5 * 60 * 1000) return null;
  
  return JSON.parse(cached);
};
```

## Accessibility Considerations

### ARIA Labels

```vue
<!-- Icon-only buttons -->
<ion-button aria-label="Go back" @click="goBack">
  <ion-icon :icon="arrowBack"></ion-icon>
</ion-button>

<!-- Progress indicator -->
<div 
  role="progressbar" 
  :aria-valuenow="currentStep" 
  aria-valuemin="1" 
  aria-valuemax="3"
  aria-label="Form progress"
>
```

### Keyboard Navigation

```typescript
// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && canProceedToNext.value) {
    nextStep();
  } else if (event.key === 'Escape') {
    closeModal();
  }
};
```

### Screen Reader Announcements

```vue
<!-- Live region for dynamic updates -->
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  class="sr-only"
>
  {{ statusMessage }}
</div>
```

## Security Considerations

### Input Sanitization

```typescript
// Sanitize user input before sending to API
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
};
```

### Phone Number Validation

```typescript
// Strict E.164 validation
const validatePhoneFormat = (phone: string): boolean => {
  const e164Phone = formatPhoneToE164(phone);
  const ethiopianPhoneRegex = /^\+251[97]\d{8}$/;
  return ethiopianPhoneRegex.test(e164Phone);
};
```

### Token Management

```typescript
// Secure token storage
const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  delete api.defaults.headers.common['Authorization'];
};
```

## Deployment Considerations

### Environment Configuration

```typescript
// config/environment.ts
export const config = {
  apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
  environment: process.env.NODE_ENV || 'development',
  enableLogging: process.env.VUE_APP_ENABLE_LOGGING === 'true'
};
```

### Build Optimization

```javascript
// vue.config.js
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    }
  }
};
```

## Monitoring and Analytics

### Performance Monitoring

```typescript
// Track page load times
const trackPageLoad = (pageName: string) => {
  const loadTime = performance.now();
  analytics.track('page_load', {
    page: pageName,
    load_time: loadTime,
    timestamp: new Date().toISOString()
  });
};
```

### User Interaction Tracking

```typescript
// Track user actions
const trackUserAction = (action: string, metadata: any) => {
  analytics.track(action, {
    ...metadata,
    user_id: store.state.auth.user?.id,
    timestamp: new Date().toISOString()
  });
};

// Usage
trackUserAction('iqub_created', {
  iqub_name: formData.name,
  members_count: formData.members_count,
  saving_amount: formData.saving_amount
});
```

## Conclusion

This design document provides a comprehensive blueprint for implementing the Iqub management UI transformation. The architecture emphasizes:

- **Component reusability** through shared UI patterns
- **Performance** through code splitting and caching
- **Accessibility** through ARIA labels and keyboard navigation
- **Security** through input validation and token management
- **Maintainability** through TypeScript interfaces and clear separation of concerns

The implementation will follow Vue 3 Composition API best practices, Ionic Framework conventions, and the established Wujo UI/UX guidelines to deliver a premium FinTech experience.
