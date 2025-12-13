# IqubBookPage Enhancement - Design Document

## Overview

This design document outlines the technical architecture and implementation approach for transforming the IqubBookPage.vue from a mock data display into a fully functional member payment management system. The design follows Wujo UI/UX guidelines, implements mobile-first principles, and integrates with new backend APIs for payment verification.

### Design Goals

1. **Premium FinTech Aesthetic**: Apply Wujo brand identity consistently
2. **Mobile-First Experience**: Optimize for one-handed use with thumb-zone placement
3. **Real-Time Data Integration**: Connect to functional backend payment APIs
4. **Performance Excellence**: Achieve smooth 60fps animations and fast load times
5. **Intuitive Verification Workflow**: Streamline payment approval/rejection process

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    IqubBookPage.vue                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Member Hero Section Component             │  │
│  │  (Avatar, Name, Stats, Progress Ring)             │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Tab Navigation Component                  │  │
│  │  [Payment History] | [Verifications]             │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Content Area (Scrollable)                 │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  PaymentHistoryCard (v-for)                 │  │  │
│  │  │  - Round number, date, amount               │  │  │
│  │  │  - Status indicator, receipt icon           │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  VerificationRequestCard (v-for)            │  │  │
│  │  │  - Request details, receipt preview         │  │  │
│  │  │  - Approve/Reject buttons                   │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Receipt Viewer Modal                      │  │
│  │  (Full-screen, zoom/pan, navigation)              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Vuex Store (memberPayments)                │
│  State: memberData, paymentHistory, verifications       │
│  Actions: fetch, approve, reject                        │
│  Mutations: update states                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  API Service Layer                      │
│  - getMemberPaymentDetails()                            │
│  - approveVerification()                                │
│  - rejectVerification()                                 │
│  - getReceiptImage()                                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend API Endpoints                  │
│  GET  /api/members/:memberId/iqub/:iqubId              │
│  POST /api/payment-verifications/:requestId/approve    │
│  POST /api/payment-verifications/:requestId/reject     │
│  GET  /api/receipts/:receiptId                         │
└─────────────────────────────────────────────────────────┘
```


### Component Hierarchy

```
IqubBookPage.vue
├── MemberHeroSection.vue
│   ├── Avatar Component
│   ├── Member Info Display
│   ├── Progress Ring Component
│   └── Stats Cards
├── TabNavigation Component
│   ├── Payment History Tab
│   └── Verifications Tab
├── Payment History Tab Content
│   ├── PaymentHistoryCard.vue (v-for)
│   │   ├── Round Info
│   │   ├── Payment Status Indicator
│   │   ├── Receipt Icon (clickable)
│   │   └── Payment Details
│   └── Pagination Controls
├── Verifications Tab Content
│   ├── VerificationRequestCard.vue (v-for)
│   │   ├── Request Header
│   │   ├── Receipt Preview (clickable)
│   │   ├── Member Notes Display
│   │   └── Action Buttons (Approve/Reject)
│   └── Empty State Component
├── ReceiptViewerModal.vue
│   ├── Image Viewer (zoom/pan)
│   ├── Navigation Dots
│   ├── Payment Info Overlay
│   └── Download Button
├── ApprovalDialog.vue
│   ├── Confirmation Message
│   ├── Notes Input (optional)
│   └── Confirm/Cancel Buttons
└── RejectionDialog.vue
    ├── Rejection Reason Input (required)
    ├── Notes Input (optional)
    └── Confirm/Cancel Buttons
```

## Components and Interfaces

### 1. IqubBookPage Main Component

#### Route Configuration

```typescript
// router/index.ts
{
  path: '/collector/iqub/:iqubId/member/:memberId',
  name: 'IqubBookPage',
  component: () => import('@/views/IqubBookPage.vue'),
  meta: {
    requiresAuth: true,
    requiresRole: 'collector'
  }
}
```

#### Component Structure

```typescript
// IqubBookPage.vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useIonRouter } from '@ionic/vue';

// Route params
const route = useRoute();
const iqubId = computed(() => route.params.iqubId as string);
const memberId = computed(() => route.params.memberId as string);

// State
const activeTab = ref<'history' | 'verifications'>('history');
const isReceiptModalOpen = ref(false);
const selectedReceipt = ref<string[]>([]);
const isApprovalDialogOpen = ref(false);
const isRejectionDialogOpen = ref(false);
const selectedVerificationId = ref<string | null>(null);

// Vuex store
const store = useStore();

// Computed properties
const memberData = computed(() => 
  store.getters['memberPayments/memberData']
);
const paymentHistory = computed(() => 
  store.getters['memberPayments/paymentHistory']
);
const pendingVerifications = computed(() => 
  store.getters['memberPayments/pendingVerifications']
);
const isLoading = computed(() => 
  store.getters['memberPayments/isLoading']
);
const error = computed(() => 
  store.getters['memberPayments/error']
);

// Lifecycle
onMounted(async () => {
  await fetchMemberPaymentData();
});

// Methods
const fetchMemberPaymentData = async () => {
  await store.dispatch('memberPayments/fetchMemberPaymentDetails', {
    memberId: memberId.value,
    iqubId: iqubId.value
  });
};

const openReceiptViewer = (receiptUrls: string[]) => {
  selectedReceipt.value = receiptUrls;
  isReceiptModalOpen.value = true;
};

const handleApproveClick = (verificationId: string) => {
  selectedVerificationId.value = verificationId;
  isApprovalDialogOpen.value = true;
};

const handleRejectClick = (verificationId: string) => {
  selectedVerificationId.value = verificationId;
  isRejectionDialogOpen.value = true;
};

const confirmApproval = async (notes?: string) => {
  if (!selectedVerificationId.value) return;
  
  await store.dispatch('memberPayments/approveVerification', {
    verificationId: selectedVerificationId.value,
    notes
  });
  
  isApprovalDialogOpen.value = false;
  selectedVerificationId.value = null;
  
  // Refresh data
  await fetchMemberPaymentData();
};

const confirmRejection = async (reason: string, notes?: string) => {
  if (!selectedVerificationId.value) return;
  
  await store.dispatch('memberPayments/rejectVerification', {
    verificationId: selectedVerificationId.value,
    reason,
    notes
  });
  
  isRejectionDialogOpen.value = false;
  selectedVerificationId.value = null;
  
  // Refresh data
  await fetchMemberPaymentData();
};
</script>
```


### 2. MemberHeroSection Component

#### TypeScript Interface

```typescript
// components/MemberHeroSection.vue
interface MemberHeroProps {
  member: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    joinDate: string;
  };
  paymentStats: {
    currentRound: number;
    totalRounds: number;
    paidAmount: number;
    totalExpected: number;
    completionPercentage: number;
  };
}
```

#### Styling Specifications

```css
/* Hero Section */
.member-hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px;
  border-radius: 0 0 24px 24px;
  color: white;
  position: relative;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  --color: white;
  --padding-start: 0;
  --padding-end: 0;
}

.notification-icon {
  font-size: 24px;
  color: white;
}

.member-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
}

.member-name {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}

.member-phone {
  font-size: 16px;
  opacity: 0.9;
}

.stats-container {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
}
```

### 3. PaymentHistoryCard Component

#### TypeScript Interface

```typescript
// components/PaymentHistoryCard.vue
interface PaymentHistoryCardProps {
  payment: {
    id: string;
    roundNumber: number;
    amount: number;
    paymentDate: string;
    dueDate: string;
    paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash' | 'manual';
    status: 'paid' | 'pending' | 'overdue' | 'verified';
    verificationStatus?: 'pending' | 'verified' | 'rejected' | null;
    receiptUrls?: string[];
    collectorNotes?: string;
  };
  onReceiptClick?: (receiptUrls: string[]) => void;
}
```

#### Component Implementation

```vue
<template>
  <div class="payment-history-card" @click="handleCardClick">
    <div class="card-header">
      <div class="round-info">
        <h3 class="round-title">Round {{ payment.roundNumber }}</h3>
        <p class="payment-date">{{ formatDate(payment.paymentDate) }}</p>
      </div>
      <div class="status-indicator">
        <ion-icon 
          :icon="getStatusIcon(payment.status)" 
          :class="getStatusClass(payment.status)"
        />
      </div>
    </div>
    
    <div class="card-body">
      <div class="payment-info">
        <span class="label">Amount:</span>
        <span class="value">{{ formatCurrency(payment.amount) }} ETB</span>
      </div>
      <div class="payment-info">
        <span class="label">Method:</span>
        <span class="value">{{ formatPaymentMethod(payment.paymentMethod) }}</span>
      </div>
      <div class="payment-info">
        <span class="label">Status:</span>
        <span class="value" :class="getStatusClass(payment.status)">
          {{ formatStatus(payment.status) }}
        </span>
      </div>
    </div>
    
    <div v-if="payment.receiptUrls && payment.receiptUrls.length > 0" class="card-footer">
      <ion-button 
        fill="clear" 
        size="small" 
        @click.stop="handleReceiptClick"
      >
        <ion-icon :icon="documentTextOutline" slot="start" />
        View Receipt
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkmarkCircle, timeOutline, alertCircle, lockClosed } from 'ionicons/icons';

const props = defineProps<PaymentHistoryCardProps>();

const getStatusIcon = (status: string) => {
  const icons = {
    verified: lockClosed,
    paid: checkmarkCircle,
    pending: timeOutline,
    overdue: alertCircle
  };
  return icons[status] || timeOutline;
};

const getStatusClass = (status: string) => {
  return `status-${status}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET').format(amount);
};

const formatPaymentMethod = (method: string) => {
  const methods = {
    mobile_money: 'Mobile Money',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash Payment',
    manual: 'Manual Payment'
  };
  return methods[method] || method;
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const handleReceiptClick = () => {
  if (props.onReceiptClick && props.payment.receiptUrls) {
    props.onReceiptClick(props.payment.receiptUrls);
  }
};
</script>
```

#### Styling

```css
.payment-history-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.payment-history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.round-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px 0;
}

.payment-date {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0;
}

.status-indicator ion-icon {
  font-size: 32px;
}

.status-verified {
  color: var(--ion-color-medium-aquamarine);
}

.status-paid {
  color: var(--ion-color-success);
}

.status-pending {
  color: var(--ion-color-warning);
}

.status-overdue {
  color: var(--ion-color-danger);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.payment-info .label {
  color: var(--ion-color-medium);
}

.payment-info .value {
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-light);
}
```


### 4. VerificationRequestCard Component

#### TypeScript Interface

```typescript
// components/VerificationRequestCard.vue
interface VerificationRequestCardProps {
  request: {
    id: string;
    roundNumber: number;
    amount: number;
    submissionDate: string;
    receiptUrls: string[];
    memberNotes?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onReceiptClick: (receiptUrls: string[]) => void;
}
```

#### Component Implementation

```vue
<template>
  <div class="verification-request-card">
    <div class="card-header">
      <div class="alert-badge">
        <ion-icon :icon="alertCircleOutline" />
        <span>Pending Verification</span>
      </div>
    </div>
    
    <div class="card-body">
      <div class="request-info">
        <h3 class="round-title">Round {{ request.roundNumber }}</h3>
        <p class="submission-date">
          Submitted: {{ formatDate(request.submissionDate) }}
        </p>
      </div>
      
      <div class="amount-display">
        <span class="label">Claimed Amount:</span>
        <span class="amount">{{ formatCurrency(request.amount) }} ETB</span>
      </div>
      
      <div v-if="request.memberNotes" class="member-notes">
        <span class="label">Member Notes:</span>
        <p class="notes-text">{{ request.memberNotes }}</p>
      </div>
      
      <div class="receipt-preview" @click="handleReceiptClick">
        <img 
          v-if="request.receiptUrls[0]" 
          :src="request.receiptUrls[0]" 
          alt="Receipt preview"
          class="receipt-thumbnail"
        />
        <div class="receipt-overlay">
          <ion-icon :icon="expandOutline" />
          <span>View Receipt</span>
        </div>
      </div>
    </div>
    
    <div class="card-actions">
      <ion-button 
        expand="block" 
        class="approve-button"
        @click="handleApprove"
      >
        <ion-icon :icon="checkmarkCircle" slot="start" />
        Approve
      </ion-button>
      <ion-button 
        expand="block" 
        fill="outline" 
        class="reject-button"
        @click="handleReject"
      >
        <ion-icon :icon="closeCircle" slot="start" />
        Reject
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  alertCircleOutline, 
  checkmarkCircle, 
  closeCircle, 
  expandOutline 
} from 'ionicons/icons';

const props = defineProps<VerificationRequestCardProps>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET').format(amount);
};

const handleReceiptClick = () => {
  props.onReceiptClick(props.request.receiptUrls);
};

const handleApprove = () => {
  props.onApprove(props.request.id);
};

const handleReject = () => {
  props.onReject(props.request.id);
};
</script>
```

#### Styling

```css
.verification-request-card {
  background: white;
  border-radius: 16px;
  border-left: 4px solid var(--ion-color-warning);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.alert-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ion-color-warning);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.alert-badge ion-icon {
  font-size: 20px;
}

.round-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px 0;
}

.submission-date {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0 0 16px 0;
}

.amount-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--ion-color-white-smoke);
  border-radius: 8px;
  margin-bottom: 16px;
}

.amount-display .label {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.amount-display .amount {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-dark-green);
}

.member-notes {
  margin-bottom: 16px;
}

.member-notes .label {
  font-size: 14px;
  color: var(--ion-color-medium);
  display: block;
  margin-bottom: 4px;
}

.notes-text {
  font-size: 14px;
  color: var(--ion-color-dark-green);
  padding: 8px;
  background: var(--ion-color-white-smoke);
  border-radius: 8px;
  margin: 0;
}

.receipt-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 16px;
}

.receipt-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.receipt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 64, 35, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.receipt-preview:hover .receipt-overlay {
  opacity: 1;
}

.receipt-overlay ion-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.approve-button {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

.reject-button {
  --border-color: var(--ion-color-danger);
  --color: var(--ion-color-danger);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}
```


### 5. ReceiptViewerModal Component

#### TypeScript Interface

```typescript
// components/ReceiptViewerModal.vue
interface ReceiptViewerModalProps {
  isOpen: boolean;
  receiptUrls: string[];
  paymentInfo: {
    roundNumber: number;
    amount: number;
    date: string;
    memberName: string;
  };
  onClose: () => void;
}
```

#### Component Implementation

```vue
<template>
  <ion-modal 
    :is-open="isOpen" 
    @didDismiss="handleClose"
    class="receipt-viewer-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Payment Receipt</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleClose">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="receipt-viewer-container">
        <!-- Image Viewer with Zoom/Pan -->
        <div class="image-viewer" ref="imageViewerRef">
          <img 
            :src="currentReceiptUrl" 
            alt="Receipt"
            class="receipt-image"
            @load="handleImageLoad"
          />
        </div>
        
        <!-- Navigation Dots (if multiple images) -->
        <div v-if="receiptUrls.length > 1" class="navigation-dots">
          <span 
            v-for="(url, index) in receiptUrls" 
            :key="index"
            :class="['dot', { active: currentIndex === index }]"
            @click="currentIndex = index"
          />
        </div>
        
        <!-- Payment Info Overlay -->
        <div class="payment-info-overlay">
          <div class="info-row">
            <span class="label">Member:</span>
            <span class="value">{{ paymentInfo.memberName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Round:</span>
            <span class="value">{{ paymentInfo.roundNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">Amount:</span>
            <span class="value">{{ formatCurrency(paymentInfo.amount) }} ETB</span>
          </div>
          <div class="info-row">
            <span class="label">Date:</span>
            <span class="value">{{ formatDate(paymentInfo.date) }}</span>
          </div>
        </div>
        
        <!-- Download Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="downloadReceipt">
            <ion-icon :icon="downloadOutline" />
          </ion-fab-button>
        </ion-fab>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { closeOutline, downloadOutline } from 'ionicons/icons';

const props = defineProps<ReceiptViewerModalProps>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentIndex = ref(0);
const imageViewerRef = ref<HTMLElement | null>(null);

const currentReceiptUrl = computed(() => {
  return props.receiptUrls[currentIndex.value] || '';
});

const handleClose = () => {
  emit('close');
};

const handleImageLoad = () => {
  // Initialize zoom/pan functionality here
  // Can use libraries like panzoom or implement custom
};

const downloadReceipt = async () => {
  try {
    const response = await fetch(currentReceiptUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-round-${props.paymentInfo.roundNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download receipt:', error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET').format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
</script>
```

#### Styling

```css
.receipt-viewer-modal {
  --width: 100%;
  --height: 100%;
}

.receipt-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
}

.image-viewer {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.receipt-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.navigation-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: var(--ion-color-medium-aquamarine);
  width: 24px;
  border-radius: 4px;
}

.payment-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(1, 64, 35, 0.95) 0%,
    rgba(1, 64, 35, 0.8) 50%,
    transparent 100%
  );
  padding: 24px;
  color: white;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  opacity: 0.8;
}

.info-row .value {
  font-weight: 600;
}
```

## Data Models

### TypeScript Interfaces

```typescript
// types/memberPayments.ts

export interface MemberPaymentData {
  member: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    avatar?: string;
    join_date: string;
  };
  iqub: {
    id: string;
    name: string;
    total_rounds: number;
  };
  payment_stats: {
    current_round: number;
    total_paid: number;
    total_expected: number;
    completion_percentage: number;
    lottery_position?: number;
  };
  payment_history: PaymentRecord[];
  pending_verifications: VerificationRequest[];
}

export interface PaymentRecord {
  id: string;
  round_number: number;
  amount: number;
  payment_date: string;
  due_date: string;
  payment_method: 'mobile_money' | 'bank_transfer' | 'cash' | 'manual';
  status: 'paid' | 'pending' | 'overdue' | 'verified';
  verification_status?: 'pending' | 'verified' | 'rejected' | null;
  receipt_urls?: string[];
  verification_date?: string;
  collector_notes?: string;
}

export interface VerificationRequest {
  id: string;
  member_id: string;
  iqub_id: string;
  round_number: number;
  amount: number;
  receipt_urls: string[];
  submission_date: string;
  status: 'pending' | 'approved' | 'rejected';
  member_notes?: string;
  collector_id?: string;
  decision_date?: string;
  collector_notes?: string;
  rejection_reason?: string;
}

export interface ApprovalPayload {
  verification_id: string;
  notes?: string;
}

export interface RejectionPayload {
  verification_id: string;
  reason: string;
  notes?: string;
}
```


## Backend API Design

### 1. Get Member Payment Details Endpoint

```typescript
// GET /api/members/:memberId/iqub/:iqubId
// controllers/member.controller.ts

export const getMemberPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { memberId, iqubId } = req.params;
    const collectorId = req.user.id;
    
    // Verify collector owns the Iqub
    const iqub = await Iqub.findById(iqubId);
    if (!iqub || iqub.collector_id.toString() !== collectorId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to Iqub'
      });
    }
    
    // Get member details
    const member = await Member.findById(memberId)
      .populate('user_id', 'name phone avatar');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    // Get payment history
    const paymentHistory = await PaymentRound.find({
      iqub_id: iqubId,
      member_id: memberId
    }).sort({ round_number: -1 });
    
    // Get pending verification requests
    const pendingVerifications = await PaymentVerification.find({
      iqub_id: iqubId,
      member_id: memberId,
      status: 'pending'
    }).sort({ submission_date: -1 });
    
    // Calculate payment stats
    const totalPaid = paymentHistory
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpected = iqub.saving_amount * iqub.members_count;
    const completionPercentage = (member.saving_rounds / iqub.members_count) * 100;
    
    const response = {
      member: {
        id: member._id,
        user_id: member.user_id._id,
        name: member.user_id.name,
        phone: member.user_id.phone,
        avatar: member.user_id.avatar,
        join_date: member.join_date
      },
      iqub: {
        id: iqub._id,
        name: iqub.name,
        total_rounds: iqub.members_count
      },
      payment_stats: {
        current_round: member.saving_rounds + 1,
        total_paid: totalPaid,
        total_expected: totalExpected,
        completion_percentage: completionPercentage
      },
      payment_history: paymentHistory,
      pending_verifications: pendingVerifications
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching member payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member payment details'
    });
  }
};
```

### 2. Approve Payment Verification Endpoint

```typescript
// POST /api/payment-verifications/:requestId/approve
// controllers/verification.controller.ts

export const approvePaymentVerification = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { notes } = req.body;
    const collectorId = req.user.id;
    
    // Get verification request
    const verification = await PaymentVerification.findById(requestId);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }
    
    // Verify collector owns the Iqub
    const iqub = await Iqub.findById(verification.iqub_id);
    if (!iqub || iqub.collector_id.toString() !== collectorId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    
    // Update verification status
    verification.status = 'approved';
    verification.collector_id = collectorId;
    verification.decision_date = new Date();
    verification.collector_notes = notes;
    await verification.save();
    
    // Update payment round status
    const paymentRound = await PaymentRound.findOne({
      iqub_id: verification.iqub_id,
      member_id: verification.member_id,
      round_number: verification.round_number
    });
    
    if (paymentRound) {
      paymentRound.status = 'verified';
      paymentRound.verification_status = 'verified';
      paymentRound.verification_date = new Date();
      await paymentRound.save();
    }
    
    // Update member's saving rounds
    const member = await Member.findById(verification.member_id);
    if (member) {
      member.saving_rounds += 1;
      await member.save();
    }
    
    // Update Iqub total collected
    iqub.total_collected = (iqub.total_collected || 0) + verification.amount;
    await iqub.save();
    
    // Send notification to member (implement notification service)
    // await notificationService.sendApprovalNotification(member, verification);
    
    res.status(200).json({
      success: true,
      message: 'Payment verification approved successfully',
      data: verification
    });
  } catch (error) {
    console.error('Error approving payment verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment verification'
    });
  }
};
```

### 3. Reject Payment Verification Endpoint

```typescript
// POST /api/payment-verifications/:requestId/reject
// controllers/verification.controller.ts

export const rejectPaymentVerification = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { reason, notes } = req.body;
    const collectorId = req.user.id;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    // Get verification request
    const verification = await PaymentVerification.findById(requestId);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }
    
    // Verify collector owns the Iqub
    const iqub = await Iqub.findById(verification.iqub_id);
    if (!iqub || iqub.collector_id.toString() !== collectorId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    
    // Update verification status
    verification.status = 'rejected';
    verification.collector_id = collectorId;
    verification.decision_date = new Date();
    verification.rejection_reason = reason;
    verification.collector_notes = notes;
    await verification.save();
    
    // Update payment round status
    const paymentRound = await PaymentRound.findOne({
      iqub_id: verification.iqub_id,
      member_id: verification.member_id,
      round_number: verification.round_number
    });
    
    if (paymentRound) {
      paymentRound.verification_status = 'rejected';
      await paymentRound.save();
    }
    
    // Send notification to member (implement notification service)
    // await notificationService.sendRejectionNotification(member, verification);
    
    res.status(200).json({
      success: true,
      message: 'Payment verification rejected',
      data: verification
    });
  } catch (error) {
    console.error('Error rejecting payment verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment verification'
    });
  }
};
```

### 4. Database Schema Definitions

```typescript
// models/PaymentVerification.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentVerification extends Document {
  _id: mongoose.Types.ObjectId;
  member_id: mongoose.Types.ObjectId;
  iqub_id: mongoose.Types.ObjectId;
  round_number: number;
  amount: number;
  receipt_urls: string[];
  submission_date: Date;
  status: 'pending' | 'approved' | 'rejected';
  member_notes?: string;
  collector_id?: mongoose.Types.ObjectId;
  decision_date?: Date;
  collector_notes?: string;
  rejection_reason?: string;
  created_at: Date;
}

const PaymentVerificationSchema = new Schema<IPaymentVerification>({
  member_id: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  iqub_id: {
    type: Schema.Types.ObjectId,
    ref: 'Iqub',
    required: true,
    index: true
  },
  round_number: {
    type: Number,
    required: true,
    min: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  receipt_urls: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one receipt is required'
    }
  },
  submission_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  member_notes: String,
  collector_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  decision_date: Date,
  collector_notes: String,
  rejection_reason: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
PaymentVerificationSchema.index({ 
  iqub_id: 1, 
  member_id: 1, 
  status: 1 
});

export const PaymentVerification = mongoose.model<IPaymentVerification>(
  'PaymentVerification',
  PaymentVerificationSchema
);
```


## Frontend State Management

### Vuex Module: memberPayments

```typescript
// store/modules/memberPayments.ts

import { Module } from 'vuex';
import { 
  MemberPaymentData, 
  PaymentRecord, 
  VerificationRequest,
  ApprovalPayload,
  RejectionPayload
} from '@/types/memberPayments';
import api from '@/services/api';

interface MemberPaymentsState {
  memberData: MemberPaymentData | null;
  isLoading: boolean;
  error: string | null;
}

const memberPaymentsModule: Module<MemberPaymentsState, any> = {
  namespaced: true,
  
  state: {
    memberData: null,
    isLoading: false,
    error: null
  },
  
  getters: {
    memberData: (state) => state.memberData,
    paymentHistory: (state) => state.memberData?.payment_history || [],
    pendingVerifications: (state) => state.memberData?.pending_verifications || [],
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    
    completionPercentage: (state) => {
      return state.memberData?.payment_stats.completion_percentage || 0;
    },
    
    currentRound: (state) => {
      return state.memberData?.payment_stats.current_round || 0;
    },
    
    totalPaid: (state) => {
      return state.memberData?.payment_stats.total_paid || 0;
    }
  },
  
  mutations: {
    SET_LOADING(state, isLoading: boolean) {
      state.isLoading = isLoading;
    },
    
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
    
    SET_MEMBER_DATA(state, data: MemberPaymentData) {
      state.memberData = data;
    },
    
    UPDATE_VERIFICATION_STATUS(state, { verificationId, status }) {
      if (!state.memberData) return;
      
      const verification = state.memberData.pending_verifications.find(
        v => v.id === verificationId
      );
      
      if (verification) {
        verification.status = status;
      }
    },
    
    REMOVE_VERIFICATION(state, verificationId: string) {
      if (!state.memberData) return;
      
      state.memberData.pending_verifications = 
        state.memberData.pending_verifications.filter(
          v => v.id !== verificationId
        );
    },
    
    UPDATE_PAYMENT_RECORD(state, { roundNumber, updates }) {
      if (!state.memberData) return;
      
      const payment = state.memberData.payment_history.find(
        p => p.round_number === roundNumber
      );
      
      if (payment) {
        Object.assign(payment, updates);
      }
    }
  },
  
  actions: {
    async fetchMemberPaymentDetails({ commit }, { memberId, iqubId }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.get(
          `/api/members/${memberId}/iqub/${iqubId}`
        );
        
        commit('SET_MEMBER_DATA', response.data.data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 
          'Failed to fetch member payment details';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async approveVerification({ commit, dispatch }, payload: ApprovalPayload) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Optimistic update
        commit('UPDATE_VERIFICATION_STATUS', {
          verificationId: payload.verification_id,
          status: 'approved'
        });
        
        const response = await api.post(
          `/api/payment-verifications/${payload.verification_id}/approve`,
          { notes: payload.notes }
        );
        
        // Remove from pending list
        commit('REMOVE_VERIFICATION', payload.verification_id);
        
        // Show success toast
        // dispatch('ui/showToast', {
        //   message: 'Payment verification approved successfully',
        //   color: 'success'
        // }, { root: true });
        
        return response.data;
      } catch (error: any) {
        // Revert optimistic update
        commit('UPDATE_VERIFICATION_STATUS', {
          verificationId: payload.verification_id,
          status: 'pending'
        });
        
        const errorMessage = error.response?.data?.message || 
          'Failed to approve payment verification';
        commit('SET_ERROR', errorMessage);
        
        // Show error toast
        // dispatch('ui/showToast', {
        //   message: errorMessage,
        //   color: 'danger'
        // }, { root: true });
        
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async rejectVerification({ commit, dispatch }, payload: RejectionPayload) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Optimistic update
        commit('UPDATE_VERIFICATION_STATUS', {
          verificationId: payload.verification_id,
          status: 'rejected'
        });
        
        const response = await api.post(
          `/api/payment-verifications/${payload.verification_id}/reject`,
          { 
            reason: payload.reason,
            notes: payload.notes 
          }
        );
        
        // Remove from pending list
        commit('REMOVE_VERIFICATION', payload.verification_id);
        
        // Show success toast
        // dispatch('ui/showToast', {
        //   message: 'Payment verification rejected',
        //   color: 'warning'
        // }, { root: true });
        
        return response.data;
      } catch (error: any) {
        // Revert optimistic update
        commit('UPDATE_VERIFICATION_STATUS', {
          verificationId: payload.verification_id,
          status: 'pending'
        });
        
        const errorMessage = error.response?.data?.message || 
          'Failed to reject payment verification';
        commit('SET_ERROR', errorMessage);
        
        // Show error toast
        // dispatch('ui/showToast', {
        //   message: errorMessage,
        //   color: 'danger'
        // }, { root: true });
        
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};

export default memberPaymentsModule;
```

## Error Handling Strategy

### Centralized Error Handler

```typescript
// utils/errorHandler.ts

import { toastController } from '@ionic/vue';

export class ErrorHandler {
  static async handle(error: any, context: string) {
    console.error(`[${context}]`, error);
    
    // Extract error message
    const message = error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';
    
    // Show user-friendly toast
    await this.showToast(message, 'danger');
    
    // Log to monitoring service (if available)
    this.logError(error, context);
    
    return message;
  }
  
  static async showToast(message: string, color: string) {
    const toast = await toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }
  
  static logError(error: any, context: string) {
    // Send to error monitoring service (e.g., Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: { context }
    //   });
    // }
  }
}
```

## Performance Optimization

### 1. Image Lazy Loading

```typescript
// composables/useLazyImage.ts

import { ref, onMounted, onUnmounted } from 'vue';

export function useLazyImage(imageUrl: string) {
  const isLoaded = ref(false);
  const imageSrc = ref('');
  const observer = ref<IntersectionObserver | null>(null);
  
  const loadImage = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imageSrc.value = imageUrl;
        isLoaded.value = true;
        if (observer.value) {
          observer.value.disconnect();
        }
      }
    });
  };
  
  onMounted(() => {
    observer.value = new IntersectionObserver(loadImage, {
      rootMargin: '50px'
    });
  });
  
  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
  });
  
  return {
    imageSrc,
    isLoaded,
    observer
  };
}
```

### 2. Virtual Scrolling for Payment History

```vue
<!-- Use Ionic's ion-virtual-scroll for large lists -->
<ion-virtual-scroll
  :items="paymentHistory"
  approxItemHeight="120px"
>
  <template v-slot="{ item }">
    <payment-history-card :payment="item" />
  </template>
</ion-virtual-scroll>
```

### 3. API Response Caching

```typescript
// services/cacheService.ts

class CacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  
  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
```

## Testing Strategy

### Unit Tests

```typescript
// tests/unit/PaymentHistoryCard.spec.ts

import { mount } from '@vue/test-utils';
import PaymentHistoryCard from '@/components/PaymentHistoryCard.vue';

describe('PaymentHistoryCard', () => {
  const mockPayment = {
    id: '1',
    roundNumber: 3,
    amount: 1000,
    paymentDate: '2024-12-13',
    dueDate: '2024-12-10',
    paymentMethod: 'mobile_money',
    status: 'verified',
    receiptUrls: ['https://example.com/receipt.jpg']
  };
  
  it('should display payment information correctly', () => {
    const wrapper = mount(PaymentHistoryCard, {
      props: { payment: mockPayment }
    });
    
    expect(wrapper.text()).toContain('Round 3');
    expect(wrapper.text()).toContain('1,000 ETB');
    expect(wrapper.text()).toContain('Mobile Money');
  });
  
  it('should emit receipt click event', async () => {
    const wrapper = mount(PaymentHistoryCard, {
      props: { payment: mockPayment }
    });
    
    await wrapper.find('.receipt-button').trigger('click');
    
    expect(wrapper.emitted('receiptClick')).toBeTruthy();
    expect(wrapper.emitted('receiptClick')[0]).toEqual([
      mockPayment.receiptUrls
    ]);
  });
  
  it('should display correct status icon', () => {
    const wrapper = mount(PaymentHistoryCard, {
      props: { payment: mockPayment }
    });
    
    const statusIcon = wrapper.find('.status-verified');
    expect(statusIcon.exists()).toBe(true);
  });
});
```

## Conclusion

This design document provides a comprehensive blueprint for implementing the IqubBookPage enhancement. The architecture emphasizes:

- **Component reusability** through well-defined interfaces
- **Performance** through lazy loading and caching
- **User experience** through Wujo brand compliance and mobile-first design
- **Maintainability** through TypeScript and clear separation of concerns
- **Security** through proper authentication and authorization

The implementation will follow Vue 3 Composition API best practices, Ionic Framework conventions, and the established Wujo UI/UX guidelines to deliver a premium FinTech experience for payment management.

---

**Document Version:** 1.0  
**Last Updated:** December 13, 2024  
**Status:** Ready for Implementation Phase
