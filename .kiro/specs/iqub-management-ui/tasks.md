# Implementation Plan

## Overview

This implementation plan breaks down the Iqub Management UI transformation into discrete, actionable coding tasks. Each task builds incrementally on previous work and references specific requirements from the requirements document.

---

## Task List

- [x] 1. Transform CreateIqubPage.vue with Multi-Step Wizard
  - Implement hero section with dark green gradient background and aquamarine icon
  - Create three-step wizard structure (Basic Info, Financial Details, Review)
  - Add progress bar with aquamarine fill showing current step
  - Implement step navigation logic with validation
  - Wire up all form inputs with reactive state management
  - _Requirements: 1.1, 1.2, 1.3, 1.11_

- [x] 1.1 Implement Step 1: Basic Information
  - Create Iqub name input field with white smoke background and focus states
  - Add members count input with validation (2-50 range)
  - Implement real-time validation with error messages
  - Add estimated duration calculation display
  - Style inputs with modern-item class and aquamarine focus effects
  - _Requirements: 1.4, 1.5, 4.4, 4.5_

- [x] 1.2 Implement Step 2: Financial Details
  - Create pattern selection cards for saving pattern (Weekly, Bi-weekly, Monthly)
  - Implement saving amount input with Ethiopian Birr currency formatting
  - Add credit pattern selection cards with active state styling
  - Create credit amount input with auto-suggestion logic
  - Implement currency formatter and parser utilities
  - Add helper text with information icons
  - _Requirements: 1.6, 1.7, 1.8, 5.1, 5.2, 5.3_

- [x] 1.3 Implement Step 3: Review & Confirm
  - Create summary card displaying all entered information
  - Add calculations card showing total per round, duration, and total value
  - Implement currency formatting for all displayed amounts
  - Add terms and conditions checkbox
  - Style cards with white background and subtle shadows
  - _Requirements: 1.9, 1.10, 5.1_

- [x] 1.4 Implement Form Validation and Navigation
  - Create validateField function for individual field validation
  - Implement validateCurrentStep function for step-level validation
  - Add canProceedToNext computed property
  - Create nextStep and previousStep navigation functions
  - Implement handleSubmit function routing to appropriate action
  - Add watch for auto-suggesting credit amount
  - _Requirements: 1.11, 1.12_

- [x] 1.5 Integrate Create Iqub API
  - Implement createIqub async function calling Vuex action
  - Add POST request to /api/createIqub endpoint
  - Handle loading state with disabled button and spinner
  - Implement success animation with checkmark icon
  - Add error handling with alert dialog
  - Navigate to My Iqubs page on success after 2.5 seconds
  - _Requirements: 1.13, 1.14, 1.15, 6.3, 6.4, 6.5_

- [x] 1.6 Style CreateIqubPage with Wujo Brand Identity
  - Apply hero section gradient background
  - Style form container with rounded top and shadow
  - Implement modern input styles with focus states
  - Create pattern card styles with active state
  - Add navigation button styles (Previous, Next, Submit)
  - Implement success animation styles
  - Apply all animations with proper timing functions
  - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8, 7.1, 7.2, 7.3_

- [x] 2. Transform MyIqubsPage.vue with Premium Card Layout
  - Implement hero section with dark green gradient
  - Create search bar with white smoke background
  - Add filter chips for status filtering (All, Active, Pending, Completed)
  - Set up grid/list container for Iqub cards
  - Implement pull-to-refresh functionality
  - Add floating action button for creating new Iqub
  - _Requirements: 2.1, 2.8, 2.9, 2.10, 2.13_

- [x] 2.1 Implement Premium Iqub Cards
  - Create dark green card component with white text
  - Add Iqub name display with truncation
  - Implement progress ring component with aquamarine color
  - Display total collected amount with ETB formatting
  - Show hosted lottery count (e.g., "5/10")
  - Add card tap handler for navigation to detail page
  - Style cards with rounded corners, padding, and shadow
  - _Requirements: 2.4, 2.5, 2.6, 2.7, 5.1_

- [x] 2.2 Implement Progress Ring Component
  - Create SVG-based circular progress indicator
  - Calculate stroke-dashoffset based on completion percentage
  - Apply aquamarine stroke color
  - Add smooth transition animation
  - Display percentage text in center
  - Make component reusable with props
  - _Requirements: 2.6, 7.3_

- [x] 2.3 Implement Search and Filter Functionality
  - Create search input with real-time filtering
  - Implement filteredIqubs computed property
  - Add filter chips with active state styling
  - Apply aquamarine color to active filter
  - Update list reactively based on search and filter
  - _Requirements: 2.8, 2.9_

- [x] 2.4 Implement Loading and Empty States
  - Create skeleton loader component with shimmer animation
  - Display skeleton cards during data fetch
  - Implement empty state with illustration
  - Add encouraging message and Create Iqub CTA button
  - Style empty state with centered layout
  - _Requirements: 2.11, 6.1, 6.2_

- [x] 2.5 Integrate My Iqubs API
  - Implement fetchMyIqubs Vuex action
  - Add GET request to /api/myIqubs endpoint
  - Handle loading state with skeleton loaders
  - Implement error handling with retry button
  - Add pull-to-refresh handler
  - Cache Iqubs data in localStorage with timestamp
  - _Requirements: 2.2, 2.3, 2.10, 2.12, 6.1, 6.7_

- [x] 2.6 Style MyIqubsPage with Wujo Brand Identity
  - Apply hero section gradient
  - Style search bar with white smoke background and focus states
  - Implement filter chip styles with aquamarine active state
  - Apply premium card styles with dark green background
  - Add floating action button with aquamarine background
  - Implement all animations (card tap, shimmer, etc.)
  - Ensure smooth 60fps scrolling performance
  - _Requirements: 4.4, 4.5, 4.9, 7.1, 7.4, 7.9_

- [x] 3. Transform IqubDetailPage.vue with Tabbed Interface
  - Implement hero card with dark green background
  - Display Iqub name, total amount, and collected amount
  - Add progress ring showing completion percentage
  - Create tabbed interface with four tabs (Overview, Members, Payments, Lottery)
  - Implement tab switching logic with smooth transitions
  - Style active tab with aquamarine color
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3.1 Implement Overview Tab
  - Create statistics cards showing key metrics
  - Display total Iqub amount with ETB formatting
  - Show collected amount and remaining amount
  - Add member count and completion status
  - Implement recent activity timeline (if data available)
  - Style cards with white background and shadows
  - _Requirements: 3.2, 3.3, 5.1_

- [x] 3.2 Implement Members Tab
  - Create members list displaying all participants
  - Show member name, phone number, and contribution status
  - Add member cards with avatar placeholders
  - Implement Add Member button in thumb zone
  - Style member list with alternating row colors
  - Add empty state if no members exist
  - _Requirements: 3.6, 3.7_

- [x] 3.3 Implement Add Member Bottom Sheet Modal
  - Create bottom sheet modal component
  - Add modal handle for visual affordance
  - Implement name input field
  - Create phone input with E.164 validation
  - Add country code prefix badge (+251)
  - Display formatted phone preview in aquamarine
  - Show validation checkmark when phone is valid
  - Add Cancel and Add action buttons
  - _Requirements: 3.7, 3.8, 5.4, 5.5, 5.6, 5.7_

- [x] 3.4 Implement Ethiopian Phone Validation
  - Create formatPhoneToE164 utility function
  - Implement validatePhoneFormat function with regex
  - Handle multiple input formats (0911110000, 911110000, +251911110000)
  - Display real-time validation feedback
  - Show green checkmark for valid numbers
  - Display error message for invalid numbers
  - _Requirements: 5.5, 5.6, 5.7, 5.8_

- [x] 3.5 Integrate Add Member API
  - Implement addMemberToIqub Vuex action
  - Add POST request to /api/iqubs/:iqubId/members endpoint
  - Send E.164 formatted phone number
  - Handle loading state with disabled button
  - Close modal on success and refresh members list
  - Display success toast with aquamarine background
  - Handle errors with specific error messages
  - _Requirements: 3.9, 3.10, 6.3, 6.4, 6.5_

- [x] 3.6 Implement Lottery Tab
  - Create next lottery date picker component
  - Add Set Next Lottery Date button
  - Implement Initiate Lottery button in thumb zone
  - Display current lottery status
  - Show lottery history if available
  - Style buttons with aquamarine primary color
  - _Requirements: 3.11, 3.12, 3.13, 3.14_

- [x] 3.7 Integrate Lottery APIs
  - Implement initiateLottery Vuex action
  - Add POST request to /api/iqubs/:iqubId/lottery/initiate endpoint
  - Implement setNextLotteryDate Vuex action
  - Add PUT request to /api/iqubs/:iqubId/next-lottery-date endpoint
  - Handle loading states for both actions
  - Display success animations on completion
  - Handle errors with specific messages
  - Refresh Iqub details after successful actions
  - _Requirements: 3.11, 3.12, 3.13, 3.14, 3.15, 6.3, 6.4_

- [x] 3.8 Implement Payments Tab
  - Display payment rounds list
  - Show round number, status, and amount
  - Add verification status indicators
  - Implement payment verification UI (if collector)
  - Style with status-based color coding
  - _Requirements: 3.4_

- [x] 3.9 Style IqubDetailPage with Wujo Brand Identity
  - Apply hero card dark green background with white text
  - Style tabbed interface with aquamarine active state
  - Implement bottom sheet modal styles with slide-up animation
  - Apply input field styles with focus states
  - Style action buttons with thumb-zone placement
  - Add all micro-interactions and animations
  - Ensure smooth tab transitions
  - _Requirements: 4.1, 4.4, 4.5, 7.4, 7.5, 7.7, 7.8_

- [ ] 4. Implement Shared Utilities and Helpers
  - Create currency formatting utilities (formatCurrency, parseCurrency)
  - Implement phone formatting utilities (formatPhoneToE164, validatePhoneFormat)
  - Add date formatting utilities for Ethiopian locale
  - Create error handler utility class
  - Implement toast notification helper
  - Add analytics tracking utilities
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 6.9_

- [ ] 5. Implement Vuex Store Actions and Mutations
  - Create iqubs module with state, getters, actions, mutations
  - Implement createIqub action
  - Add fetchMyIqubs action
  - Implement fetchIqubDetails action
  - Create addMemberToIqub action
  - Add initiateLottery action
  - Implement setNextLotteryDate action
  - Add error handling in all actions
  - Implement optimistic updates where appropriate
  - _Requirements: 1.13, 2.2, 3.1, 3.9, 3.11, 3.13_

- [ ] 6. Implement API Service Layer
  - Create api.ts service file with axios instance
  - Configure base URL and default headers
  - Implement request interceptor for auth token
  - Add response interceptor for error handling
  - Create IqubAPI class with all methods
  - Implement retry logic for failed requests
  - Add request/response logging in development
  - _Requirements: 1.13, 2.2, 3.1, 3.9, 3.11, 3.13_

- [ ] 7. Implement Loading States and Skeletons
  - Create skeleton loader component with shimmer animation
  - Implement loading spinners with aquamarine color
  - Add loading states to all async actions
  - Create skeleton card for Iqub list
  - Implement skeleton for detail page
  - Add loading overlay for modal actions
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Implement Error Handling and Toasts
  - Create centralized ErrorHandler class
  - Implement toast notification system
  - Add field-specific error display
  - Create error alert dialog component
  - Implement retry functionality
  - Add network error detection
  - Display user-friendly error messages
  - _Requirements: 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 9. Implement Animations and Micro-interactions
  - Create fadeInDown animation for hero sections
  - Implement slideUp animation for cards
  - Add slideIn animation for wizard steps
  - Create scaleIn animation for success icons
  - Implement button press animations (scale, opacity)
  - Add progress bar width transition
  - Create modal slide-up animation
  - Implement pull-to-refresh animation
  - Add card tap feedback animation
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

- [ ] 10. Implement Accessibility Features
  - Add ARIA labels to all icon-only buttons
  - Implement keyboard navigation for wizard steps
  - Add screen reader announcements for dynamic updates
  - Ensure proper focus management in modals
  - Add role attributes to custom components
  - Implement skip links for navigation
  - Test with screen reader (VoiceOver/TalkBack)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 11. Optimize Performance
  - Implement code splitting for route components
  - Add virtual scrolling for large Iqub lists
  - Implement caching strategy with localStorage
  - Optimize images (use WebP with fallback)
  - Add lazy loading for images
  - Minimize bundle size with tree shaking
  - Implement debouncing for search input
  - Use GPU-accelerated CSS properties
  - _Requirements: 8.7, 8.8, 8.9, 8.10, 4.9_

- [ ] 12. Add TypeScript Interfaces and Types
  - Create Iqub interface
  - Add Member interface
  - Implement CreateIqubPayload interface
  - Create AddMemberPayload interface
  - Add IqubsState interface for Vuex
  - Implement API response types
  - Add error types
  - Create utility function types
  - _Requirements: All (type safety)_

- [ ] 13. Implement Responsive Design
  - Test all pages on different screen sizes (320px - 768px)
  - Adjust card layouts for small screens
  - Ensure touch targets meet minimum size (48x48px)
  - Test thumb-zone placement on various devices
  - Adjust font sizes for readability
  - Test landscape orientation
  - Ensure modals work on all screen sizes
  - _Requirements: 4.1, 4.2, 4.10_

- [ ] 14. Integration Testing and Bug Fixes
  - Test Create Iqub flow end-to-end
  - Verify My Iqubs list displays correctly
  - Test Iqub Detail page with all tabs
  - Verify Add Member functionality
  - Test Lottery initiation and date setting
  - Check all error scenarios
  - Verify loading states work correctly
  - Test offline behavior
  - Fix any discovered bugs
  - _Requirements: All_

- [ ] 15. Final Polish and Documentation
  - Review all animations for smoothness
  - Verify color consistency across pages
  - Check spacing and alignment
  - Test on real devices (iOS and Android)
  - Add code comments for complex logic
  - Update component documentation
  - Create user guide for new features
  - Perform final accessibility audit
  - _Requirements: All_

---

## Implementation Notes

### Execution Order
Tasks should be executed in numerical order as each builds on previous work. However, tasks 4, 5, and 6 (utilities, store, API) can be worked on in parallel with UI tasks.

### Testing Approach
- Write unit tests for utility functions (task 4)
- Add integration tests for Vuex actions (task 5)
- Implement E2E tests for complete flows (task 14)

### Dependencies
- Tasks 1.5, 2.5, 3.5, 3.7 depend on tasks 5 and 6 (store and API)
- Task 9 (animations) can be implemented alongside UI tasks
- Task 10 (accessibility) should be done after UI is complete
- Task 11 (performance) should be done after core functionality works

### API Integration
All API endpoints are fully functional on the backend. Use the CLIENT_INTEGRATION_GUIDE.md for endpoint details and response structures.

### Design Reference
Refer to WUJO_UI_UX_GUIDELINES.md for all color values, spacing, typography, and animation specifications.

### Code Style
- Use Vue 3 Composition API with `<script setup>`
- Follow TypeScript best practices
- Use Ionic components where possible
- Apply Wujo CSS variables consistently
- Keep components focused and reusable

---

**Total Tasks:** 15 main tasks with 45+ sub-tasks
**Estimated Effort:** 3-4 weeks for full implementation
**Priority:** High - Core collector functionality
