# Wujo Client Development Plan

## 🎯 Mission
Complete the Wujo mobile app development, integrate with the backend server, and beautify the UI/UX for production readiness.

---

## 📊 Current Status

### ✅ Completed
- Vue 3 + TypeScript + Ionic + Capacitor setup
- 11 views/pages implemented
- 7 reusable components
- 3 Vuex store modules (auth, iqubs, member)
- Router with role-based guards
- API service with Axios
- TypeScript type definitions

### ⚠️ Issues Found
1. **Duplicate route** in `router/index.ts` (iqub-detail defined twice)
2. **API Base URL** points to production (`https://app.wujo.app/api/`) instead of local dev server
3. **Missing features** from user journey specs
4. **UI/UX** needs beautification

---

## 🔧 Phase 1: Critical Fixes (IMMEDIATE)

### Task 1.1: Fix Router Configuration ✅
**File:** `src/router/index.ts`
**Issue:** Duplicate `iqub-detail` route (lines 127 & 157)
**Action:** Remove duplicate, keep the one with both roles

### Task 1.2: Update API Base URL ✅
**File:** `src/services/apiService.ts`
**Current:** `https://app.wujo.app/api/`
**Update to:** `http://localhost:3000/api`
**Reason:** Connect to local development server

### Task 1.3: Test Authentication Flow
**Steps:**
1. Test signup (collector & member)
2. Test login
3. Test logout
4. Test profile fetch
5. Verify token storage

### Task 1.4: Verify Store Integration
**Check:**
- Auth module response handling
- Iqubs module API calls
- Member module API calls
- Error handling in all modules

---

## 🚀 Phase 2: Complete Functionality

### Task 2.1: Implement Missing Features

#### From User Journey #7 (Initiate Lottery)
**File:** `src/views/IqubDetailPage.vue`
- [ ] Add "Initiate Lottery" button
- [ ] Implement precondition checks
- [ ] Connect to `iqubs/initiateLottery` action
- [ ] Show success/error feedback

#### From User Journey #9 (View Lottery Winner)
**File:** `src/views/IqubDetailPage.vue`
- [ ] Fetch lottery winner on page load
- [ ] Display winner information
- [ ] Handle "no winner" state
- [ ] Show loading state

#### From User Journey #11 (Set Next Lottery Date)
**File:** `src/views/IqubDetailPage.vue`
- [ ] Add date picker UI
- [ ] Implement future date validation
- [ ] Connect to `iqubs/setNextLotteryDate` action
- [ ] Update display reactively

#### Payment Round Features
**File:** `src/views/PaymentVerificationPage.vue`
- [ ] Fetch payment rounds
- [ ] Display round details
- [ ] Implement verify/reject actions
- [ ] Show verification status

### Task 2.2: Improve Error Handling
**All Store Modules:**
- [ ] Add user-friendly error messages
- [ ] Implement retry logic for network errors
- [ ] Add offline detection
- [ ] Show toast notifications for errors

### Task 2.3: Add Loading States
**All Pages:**
- [ ] Add skeleton loaders
- [ ] Implement loading spinners
- [ ] Disable buttons during API calls
- [ ] Show progress indicators

### Task 2.4: Implement Network Service
**File:** `src/services/networkService.ts`
- [ ] Add connection status monitoring
- [ ] Implement offline queue
- [ ] Add retry mechanism
- [ ] Show offline banner

---

## 🎨 Phase 3: UI/UX Enhancement

### Wujo Brand Identity Guidelines

**Role:** Lead UI/UX Designer & Frontend Engineer (Vue 3/Ionic/TypeScript)

**Objective:** Refactor the Wujo App UI to achieve a "Trustworthy Futuristic" aesthetic using the specific Wujo Brand Identity. The goal is a top-tier, industry-standard FinTech interface that prioritizes mobile ergonomics.

#### 1. Brand Identity & Color Strategy (Strict Adherence):

* **The Foundation (Canvas):** Use `var(--ion-color-white-smoke)` (#F2F2F2) for app backgrounds. It is softer than white and reduces eye strain.
* **The Authority (Trust):** Use `var(--ion-color-dark-green)` (#014023) for Headers, Typography, and Primary "Credit-Card" style containers. This deep green conveys financial stability.
* **The Energy (Future):** Use `var(--ion-color-medium-aquamarine)` (#5FD9AC) for Primary Buttons (CTAs), Progress Rings, Active States, and Success indicators. This color pops against the dark green, creating a modern, "electric" feel.

**Component Style:**
* **Cards:** Use `#014023` (Dark Green) backgrounds for main Iqub info cards with white text to create a "Premium Card" feel.
* **Text:** Use `#014023` for headings on light backgrounds. Use `#ffffff` for text inside dark cards.

#### 2. Mobile-First UX Guidelines:

* **The Thumb Zone:** Place all primary actions (Create Iqub, Initiate Lottery, Confirm Payment) in the bottom 30% of the screen.
* **Bottom Sheet Navigation:** Use `<ion-modal>` with `breakpoints` (sheet modal style) for forms like "Add Member" or "Set Date". Do not use full-page redirects for small tasks.
* **Data Visualization:** Visualize ROSCA cycles using **Circular Progress Rings** colored in `medium-aquamarine` against dark cards. Use linear skeleton loaders (shimmer) for loading states.
* **Haptics:** Implement Ionic Haptics on all button taps.

#### 3. Execution Instructions:

Generate the **Vue 3 (Script Setup) + TypeScript** code using Ionic components (`<ion-card>`, `<ion-item>`, etc.).

**Important:** Override default Ionic styling to match the Wujo Palette variables provided below.

**Variables to use:**
* `--ion-color-dark-green: #014023;`
* `--ion-color-medium-aquamarine: #5FD9AC;`
* `--ion-color-white-smoke: #F2F2F2;`

### Task 3.1: Beautify Authentication Pages

#### LoginPage.vue ✅
- [x] Modern gradient background with dark green
- [x] Smooth animations (fadeIn, slideUp, scaleIn)
- [x] Premium form styling with Wujo colors
- [x] Ethiopian phone validation (E.164 format)
- [x] Thumb-zone optimized button placement
- [x] Real-time validation feedback
- [x] Password strength indicator
- [x] Biometric login placeholder
- [x] **Vue 3 slot syntax migration** - Fixed deprecated `slot="name"` attributes to `<template #name>` syntax

#### SignupPage.vue ✅
- [x] Ethiopian phone validation (E.164 format) with vee-validate
- [x] Real-time input validation feedback
- [x] Password strength visualization
- [x] **Wujo UI/UX Guidelines Applied** - Matches LoginPage design
- [x] Hero section with dark green gradient background
- [x] Premium card-style form container with rounded top
- [x] Premium gender selection cards (replaced radio buttons)
- [x] Premium role selection cards (replaced select dropdown)
- [x] Aquamarine primary button with shadow
- [x] Smooth animations (fadeInDown, slideUp, scaleIn)
- [x] Success overlay animation with checkmark
- [x] Thumb-zone optimized layout (buttons in bottom 30%)
- [x] **Vue 3 slot syntax** - All slots use `<template #name>` syntax
- [x] Back button in header
- [x] Terms and conditions section

#### OnboardingPage.vue
- [ ] Better slide transitions
- [ ] Modern illustrations
- [ ] Improved typography
- [ ] Better CTA buttons

### Task 3.2: Beautify Dashboard Pages

#### CollectorDashboard.vue ✅
- [x] **Wujo Brand Identity Applied** - Premium FinTech design
- [x] Premium hero header with dark green gradient
- [x] Personalized greeting with user name
- [x] Dark green summary cards with white text
- [x] Circular progress rings for data visualization
- [x] Aquamarine accents for trends and CTAs
- [x] Quick action buttons (Create Iqub, Add Member, Host Lottery, Reports)
- [x] Recent activity feed with skeleton loaders
- [x] Performance chart with period selector
- [x] Smooth animations (fadeInDown, slideUp, scaleIn)
- [x] Floating refresh FAB
- [x] Responsive design (mobile-first)
- [x] Thumb-zone optimized
- [x] Data integration ready (Vuex store)
- [x] Loading states and error handling

#### MemberDashboard.vue
- [ ] Personalized greeting
- [ ] Savings progress visualization
- [ ] Upcoming lottery countdown
- [ ] Quick stats cards

### Task 3.3: Beautify Iqub Pages

#### MyIqubsPage.vue
- [ ] Modern list/grid view
- [ ] Better Iqub cards
- [ ] Add filters/search
- [ ] Empty state design
- [ ] Pull-to-refresh

#### IqubDetailPage.vue
- [ ] Tabbed interface
- [ ] Member avatars
- [ ] Progress circles
- [ ] Timeline view
- [ ] Action buttons

#### CreateIqubPage.vue
- [ ] Step-by-step wizard
- [ ] Better form layout
- [ ] Input helpers
- [ ] Preview before submit
- [ ] Success animation

### Task 3.4: Beautify Profile Pages

#### CollectorProfile.vue
- [ ] Profile header with avatar
- [ ] Stats overview
- [ ] Settings sections
- [ ] Edit profile modal

#### MemberProfilePage.vue
- [ ] Achievement badges
- [ ] Savings history
- [ ] Lottery wins display
- [ ] Account settings

### Task 3.5: Improve Navigation

#### CollectorTabBar.vue
- [ ] Active state animations
- [ ] Badge notifications
- [ ] Better icons
- [ ] Smooth transitions

#### MemberTabBar.vue
- [ ] Active state animations
- [ ] Badge notifications
- [ ] Better icons
- [ ] Smooth transitions

#### SideMenu.vue
- [ ] User profile section
- [ ] Better menu items
- [ ] Logout confirmation
- [ ] App version display

### Task 3.6: Add Micro-interactions
- [ ] Button press animations
- [ ] Card hover effects
- [ ] Smooth page transitions
- [ ] Loading animations
- [ ] Success/error animations

### Task 3.7: Improve Typography
- [ ] Consistent font sizes
- [ ] Better heading hierarchy
- [ ] Improved readability
- [ ] Custom font integration (optional)

### Task 3.8: Color Scheme Enhancement
- [ ] Define primary/secondary colors
- [ ] Add gradient backgrounds
- [ ] Improve contrast
- [ ] Dark mode support (optional)

### Task 3.9: Add Empty States
- [ ] No Iqubs created
- [ ] No members added
- [ ] No payment rounds
- [ ] No notifications
- [ ] Network error state

### Task 3.10: Add Illustrations
- [ ] Empty state illustrations
- [ ] Success state illustrations
- [ ] Error state illustrations
- [ ] Onboarding illustrations

---

## 🧪 Phase 4: Testing & Optimization

### Task 4.1: End-to-End Testing
- [ ] Complete user flow testing
- [ ] Role-based access testing
- [ ] API integration testing
- [ ] Error scenario testing

### Task 4.2: Performance Optimization
- [ ] Lazy load routes
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Add caching strategies

### Task 4.3: Mobile Testing
- [ ] Test on Android
- [ ] Test on iOS
- [ ] Test different screen sizes
- [ ] Test offline functionality

### Task 4.4: Accessibility
- [ ] Add ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast check

---

## 📱 Phase 5: Native Features (Optional)

### Task 5.1: Push Notifications
- [ ] Setup FCM/APNS
- [ ] Implement notification handling
- [ ] Add notification preferences
- [ ] Test notification delivery

### Task 5.2: Biometric Authentication
- [ ] Implement fingerprint/face ID
- [ ] Add security settings
- [ ] Test on devices

### Task 5.3: Camera Integration
- [ ] Profile picture upload
- [ ] Document scanning (if needed)

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Update API base URL to production
- [ ] Remove console.logs
- [ ] Test all features
- [ ] Check error handling
- [ ] Verify security measures

### Build
- [ ] Build for Android
- [ ] Build for iOS
- [ ] Test builds on devices
- [ ] Generate signed APK/IPA

### Post-Deployment
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Track analytics
- [ ] Plan updates

---

## 📝 Notes

### API Integration
- Backend running at: `http://localhost:3000`
- All 16 endpoints implemented ✅
- Response structure matches client expectations ✅
- Authentication working ✅

### Vue 3 Migration Pattern ✅
**IMPORTANT:** All components must use Vue 3 slot syntax

#### Pattern 1: Basic Slot Migration
❌ **Deprecated (Vue 2):**
```vue
<ion-icon :icon="checkmark" slot="end"></ion-icon>
<ion-buttons slot="start">...</ion-buttons>
```

✅ **Correct (Vue 3):**
```vue
<template #end>
  <ion-icon :icon="checkmark"></ion-icon>
</template>
<template #start>
  <ion-buttons>...</ion-buttons>
</template>
```

#### Pattern 2: Conditional Content in Slots
❌ **WRONG (Causes runtime codegen error):**
```vue
<ion-button>
  <ion-spinner v-if="isLoading" />
  <template v-else>
    <template #start>
      <ion-icon :icon="logIn"></ion-icon>
    </template>
    Sign In
  </template>
</ion-button>
```

✅ **CORRECT:**
```vue
<ion-button>
  <template #start>
    <ion-icon v-if="!isLoading" :icon="logIn"></ion-icon>
  </template>
  <ion-spinner v-if="isLoading" />
  <span v-else>Sign In</span>
</ion-button>
```

**Why:** 
- Vue 3 reserves `slot` attribute for native Web Components only
- Vue components (like Ionic) must use `<template>` syntax
- NEVER nest `<template #slot>` inside `<template v-if/v-else>`
- Move conditionals inside the slot template, not outside

**Applied to:**
- ✅ LoginPage.vue (6 fixes: 5 slot migrations + 1 nested template fix)
- ✅ SignupPage.vue (1 nested template fix)
- ✅ CollectorDashboard.vue (2 slot migrations: View All button + FAB)
- 🔄 Check all other components

### Known Issues
1. ✅ Duplicate route in router - FIXED
2. ✅ API URL needs update for dev - FIXED
3. ✅ Vue 3 deprecated slot syntax - FIXED in LoginPage
4. 🔄 SignupPage needs Wujo UI/UX design
5. Some user journey features incomplete

### Priority Order
1. **Fix critical issues** (Phase 1)
2. **Complete functionality** (Phase 2)
3. **Beautify UI/UX** (Phase 3)
4. **Test & optimize** (Phase 4)
5. **Add native features** (Phase 5 - optional)

---

## 🎯 Success Criteria

### Functionality
- ✅ All user journeys working
- ✅ All API endpoints integrated
- ✅ Error handling complete
- ✅ Loading states implemented

### UI/UX
- ✅ Modern, beautiful design
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Consistent styling

### Performance
- ✅ Fast load times
- ✅ Smooth transitions
- ✅ Optimized bundle size
- ✅ Works offline (basic)

### Quality
- ✅ No console errors
- ✅ Proper error handling
- ✅ Accessible
- ✅ Tested on devices

---

**Last Updated:** December 2024
**Status:** Phase 1 - Critical Fixes
**Next:** Fix router and API URL, then test authentication
