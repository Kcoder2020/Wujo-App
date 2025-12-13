# IqubBookPage Enhancement - Implementation Tasks

## 📋 Task Overview

This document outlines the complete implementation plan for transforming IqubBookPage.vue into a fully functional member payment management system with real backend integration.

---

## 🎯 Phase 1: Backend API Development

### Task 1: Create Payment Verification Data Models

- [ ] 1.1 Create PaymentVerification MongoDB schema
  - Define schema with fields: member_id, iqub_id, round_number, amount, receipt_urls, submission_date, status, member_notes, collector_id, decision_date, collector_notes, rejection_reason
  - Add validation rules: amount must be positive, receipt_urls array must not be empty, status enum validation
  - Create compound indexes on (iqub_id, member_id, status) for efficient querying
  - Add timestamps and proper references to Member and Iqub models
  - _Requirements: DR2, TR2_

- [ ] 1.2 Update Member model to support payment tracking
  - Ensure saving_rounds field exists and is properly indexed
  - Add methods for incrementing saving_rounds
  - Verify relationships with Iqub and User models
  - _Requirements: DR1, TR2_

- [ ] 1.3 Update PaymentRound model for verification status
  - Add verification_status field ('pending' | 'verified' | 'rejected' | null)
  - Add verification_date field
  - Add collector_notes field for approval/rejection notes
  - Create indexes for efficient status queries
  - _Requirements: DR3, TR2_

### Task 2: Implement Member Payment Details API

- [ ] 2.1 Create getMemberPaymentDetails controller function
  - Implement GET /api/members/:memberId/iqub/:iqubId endpoint
  - Verify collector authentication and Iqub ownership
  - Fetch member details with populated user information (name, phone, avatar)
  - Query payment history sorted by round_number descending
  - Query pending verification requests
  - Calculate payment statistics (total_paid, completion_percentage, current_round)
  - Format response according to MemberPaymentData interface
  - _Requirements: FR1, TR1, SR1_

- [ ] 2.2 Add route configuration for member payment endpoint
  - Register route in collector.routes.ts or create new member.routes.ts
  - Apply authenticateToken middleware
  - Apply requireRole('collector') middleware
  - Add parameter validation middleware for memberId and iqubId
  - _Requirements: TR1, SR1_

- [ ] 2.3 Create repository functions for payment data
  - Implement findMemberPaymentsByIqub function
  - Implement getMemberPaymentStats function
  - Implement getPendingVerificationRequests function
  - Add proper error handling and logging
  - _Requirements: TR1, TR4_

### Task 3: Implement Payment Verification Approval API

- [ ] 3.1 Create approvePaymentVerification controller function
  - Implement POST /api/payment-verifications/:requestId/approve endpoint
  - Verify collector authentication and Iqub ownership
  - Update PaymentVerification status to 'approved'
  - Update PaymentRound status to 'verified'
  - Increment member's saving_rounds count
  - Add verification amount to Iqub's total_collected
  - Add collector_id, decision_date, and optional notes
  - Return updated verification object
  - _Requirements: FR3, FR5, TR1, SR1_

- [ ] 3.2 Add route configuration for approval endpoint
  - Register route in verification.routes.ts or collector.routes.ts
  - Apply authenticateToken middleware
  - Apply requireRole('collector') middleware
  - Add request body validation for optional notes field
  - _Requirements: TR1, SR1_

- [ ] 3.3 Implement transaction handling for approval
  - Wrap approval logic in MongoDB transaction
  - Ensure atomic updates across PaymentVerification, PaymentRound, Member, and Iqub
  - Implement rollback on any failure
  - Add comprehensive error logging
  - _Requirements: FR5, TR4_

### Task 4: Implement Payment Verification Rejection API

- [ ] 4.1 Create rejectPaymentVerification controller function
  - Implement POST /api/payment-verifications/:requestId/reject endpoint
  - Verify collector authentication and Iqub ownership
  - Validate rejection reason is provided (required field)
  - Update PaymentVerification status to 'rejected'
  - Update PaymentRound verification_status to 'rejected'
  - Add collector_id, decision_date, rejection_reason, and optional notes
  - Return updated verification object
  - _Requirements: FR3, TR1, SR1_

- [ ] 4.2 Add route configuration for rejection endpoint
  - Register route in verification.routes.ts or collector.routes.ts
  - Apply authenticateToken middleware
  - Apply requireRole('collector') middleware
  - Add request body validation requiring reason field
  - _Requirements: TR1, SR1_

- [ ] 4.3 Add validation middleware for rejection payload
  - Create validateRejection middleware
  - Ensure reason field is present and non-empty
  - Validate notes field if provided
  - Return appropriate error messages for validation failures
  - _Requirements: TR1, TR4_

---

## 🎨 Phase 2: Frontend Component Development

### Task 5: Create MemberHeroSection Component

- [ ] 5.1 Build MemberHeroSection.vue component
  - Create component file with TypeScript setup
  - Define MemberHeroProps interface
  - Implement dark green gradient background (135deg, #014023 0%, #012d19 50%, rgba(95, 217, 172, 0.1) 100%)
  - Display member avatar (80px diameter) with white border
  - Show member name (32px bold white text) and phone number
  - Add back button navigation to IqubDetailPage
  - Include notification icon in header
  - _Requirements: UX3, UX1_

- [ ] 5.2 Add payment statistics cards
  - Create semi-transparent white stat cards with backdrop-filter blur
  - Display current round (e.g., "Round 3/12")
  - Display payment completion percentage (e.g., "85% Paid")
  - Use 12px spacing between cards
  - Implement responsive layout for mobile
  - _Requirements: FR1, UX3_

- [ ] 5.3 Integrate ProgressRing component for completion percentage
  - Reuse existing ProgressRing component from IqubDetailPage
  - Configure with aquamarine color (#5FD9AC)
  - Set size to 60px for hero section
  - Display percentage in center
  - Add smooth animation on value change
  - _Requirements: UX3, UX1_

### Task 6: Create PaymentHistoryCard Component

- [ ] 6.1 Build PaymentHistoryCard.vue component
  - Create component file with TypeScript setup
  - Define PaymentHistoryCardProps interface
  - Implement white card with 16px border radius
  - Add subtle shadow (0 2px 8px rgba(0, 0, 0, 0.08))
  - Display round number, payment date, and amount
  - Show payment method and status
  - Add hover effect (translateY(-2px) and enhanced shadow)
  - _Requirements: FR2, UX4_

- [ ] 6.2 Implement status indicators with color coding
  - Add status icon based on payment status (verified, paid, pending, overdue)
  - Use color coding: green for verified, aquamarine for paid, orange for pending, red for overdue
  - Display status text with appropriate styling
  - Implement smooth color transitions
  - _Requirements: FR2, UX4_

- [ ] 6.3 Add receipt availability indicator
  - Show "View Receipt" button when receiptUrls exist
  - Use document icon from ionicons
  - Implement click handler to emit receiptClick event
  - Add click.stop to prevent card click propagation
  - Style button with clear fill and small size
  - _Requirements: FR2, FR4_

### Task 7: Create VerificationRequestCard Component

- [ ] 7.1 Build VerificationRequestCard.vue component
  - Create component file with TypeScript setup
  - Define VerificationRequestCardProps interface
  - Implement white card with orange left border (4px width)
  - Add "Pending Verification" alert badge with warning icon
  - Display round number and submission date
  - Show claimed amount in highlighted box
  - Display member notes if provided
  - _Requirements: FR3, UX5_

- [ ] 7.2 Implement receipt preview section
  - Display receipt thumbnail (200px height, full width)
  - Add overlay with "View Receipt" text and expand icon
  - Implement hover effect showing overlay
  - Add click handler to open receipt viewer modal
  - Support multiple receipt images with first image as preview
  - _Requirements: FR3, FR4, UX5_

- [ ] 7.3 Add approve and reject action buttons
  - Create approve button with aquamarine background and dark green text
  - Create reject button with white background, red border, and red text
  - Place buttons in thumb zone (bottom of card)
  - Set button height to 48px with 12px gap between them
  - Add icons (checkmark for approve, close for reject)
  - Implement click handlers emitting onApprove and onReject events
  - _Requirements: FR3, UX5, UX2_

### Task 8: Create ReceiptViewerModal Component

- [ ] 8.1 Build ReceiptViewerModal.vue component
  - Create full-screen modal component
  - Define ReceiptViewerModalProps interface
  - Implement dark overlay background (rgba(0, 0, 0, 0.9))
  - Add modal header with title and close button
  - Display receipt image with max-width and max-height constraints
  - Implement image loading state
  - _Requirements: FR4, UX5_

- [ ] 8.2 Implement zoom and pan functionality
  - Add pinch-to-zoom support for touch devices
  - Implement mouse wheel zoom for desktop
  - Add pan/drag functionality when zoomed
  - Set cursor to zoom-in when not zoomed, grab when zoomed
  - Implement smooth zoom transitions
  - Consider using panzoom library or custom implementation
  - _Requirements: FR4_

- [ ] 8.3 Add navigation for multiple receipts
  - Display navigation dots when multiple receipt images exist
  - Highlight active dot with aquamarine color
  - Implement click handlers to switch between images
  - Add swipe gestures for mobile navigation
  - Show current image index (e.g., "1 of 3")
  - _Requirements: FR4_

- [ ] 8.4 Create payment info overlay
  - Display payment metadata at bottom of modal
  - Show member name, round number, amount, and date
  - Use dark green gradient background with transparency
  - Style text in white with proper contrast
  - Add download button as floating action button
  - Implement download functionality using blob and anchor element
  - _Requirements: FR4_

### Task 9: Create Approval and Rejection Dialog Components

- [ ] 9.1 Build ApprovalDialog.vue component
  - Create modal dialog component
  - Display confirmation message "Approve this payment verification?"
  - Add optional notes input field (textarea)
  - Include confirm button (aquamarine) and cancel button (outline)
  - Emit confirm event with notes value
  - Emit cancel event to close dialog
  - _Requirements: FR3, UX5_

- [ ] 9.2 Build RejectionDialog.vue component
  - Create modal dialog component
  - Display warning message "Reject this payment verification?"
  - Add required rejection reason input field (textarea)
  - Add optional notes input field (textarea)
  - Validate reason field is not empty before allowing submission
  - Include confirm button (red) and cancel button (outline)
  - Emit confirm event with reason and notes values
  - Emit cancel event to close dialog
  - _Requirements: FR3, UX5_

---

## 🔧 Phase 3: Main Page Implementation

### Task 10: Transform IqubBookPage.vue

- [ ] 10.1 Update route configuration
  - Change route path to /collector/iqub/:iqubId/member/:memberId
  - Add route name 'IqubBookPage'
  - Add meta fields: requiresAuth: true, requiresRole: 'collector'
  - Update navigation from IqubDetailPage to pass both iqubId and memberId
  - _Requirements: TR1, SR1_

- [ ] 10.2 Implement main page structure
  - Remove mock data and old UI components
  - Add MemberHeroSection component
  - Implement tab navigation (Payment History | Verifications)
  - Add content area with conditional rendering based on active tab
  - Include loading spinner during data fetch
  - Add error state display with retry button
  - _Requirements: FR1, FR2, FR3, UX1_

- [ ] 10.3 Integrate PaymentHistoryCard components
  - Use v-for to render payment history cards
  - Pass payment data as props to each card
  - Implement receiptClick handler to open ReceiptViewerModal
  - Add pagination controls (10 items per page)
  - Implement smooth scroll animations
  - Add empty state when no payment history exists
  - _Requirements: FR2, UX4_

- [ ] 10.4 Integrate VerificationRequestCard components
  - Use v-for to render verification request cards
  - Pass verification data as props to each card
  - Implement onApprove handler to open ApprovalDialog
  - Implement onReject handler to open RejectionDialog
  - Implement onReceiptClick handler to open ReceiptViewerModal
  - Add empty state when no pending verifications exist
  - _Requirements: FR3, UX5_

- [ ] 10.5 Implement modal management
  - Add state for ReceiptViewerModal (isOpen, selectedReceipts, paymentInfo)
  - Add state for ApprovalDialog (isOpen, selectedVerificationId)
  - Add state for RejectionDialog (isOpen, selectedVerificationId)
  - Implement open/close handlers for each modal
  - Pass appropriate data to modals as props
  - Handle modal dismiss events
  - _Requirements: FR3, FR4_

- [ ] 10.6 Connect to Vuex store
  - Import memberPayments store module
  - Use computed properties for memberData, paymentHistory, pendingVerifications
  - Dispatch fetchMemberPaymentDetails on component mount
  - Implement approval confirmation handler calling store action
  - Implement rejection confirmation handler calling store action
  - Handle loading and error states from store
  - Refresh data after successful approval/rejection
  - _Requirements: TR3, TR1_

---

## 📊 Phase 4: State Management Implementation

### Task 11: Create Vuex memberPayments Module

- [ ] 11.1 Create memberPayments store module file
  - Create store/modules/memberPayments.ts
  - Define MemberPaymentsState interface
  - Initialize state with memberData, isLoading, error fields
  - Set namespaced: true for module isolation
  - _Requirements: TR3_

- [ ] 11.2 Implement state getters
  - Create memberData getter returning full member payment data
  - Create paymentHistory getter returning payment_history array
  - Create pendingVerifications getter returning pending_verifications array
  - Create isLoading getter for loading state
  - Create error getter for error messages
  - Add computed getters: completionPercentage, currentRound, totalPaid
  - _Requirements: TR3_

- [ ] 11.3 Implement state mutations
  - Create SET_LOADING mutation
  - Create SET_ERROR mutation
  - Create SET_MEMBER_DATA mutation
  - Create UPDATE_VERIFICATION_STATUS mutation for optimistic updates
  - Create REMOVE_VERIFICATION mutation
  - Create UPDATE_PAYMENT_RECORD mutation
  - _Requirements: TR3_

- [ ] 11.4 Implement fetchMemberPaymentDetails action
  - Call GET /api/members/:memberId/iqub/:iqubId endpoint
  - Set loading state before API call
  - Commit SET_MEMBER_DATA with response data
  - Handle errors and commit SET_ERROR
  - Clear loading state in finally block
  - _Requirements: TR3, TR1_

- [ ] 11.5 Implement approveVerification action
  - Implement optimistic update before API call
  - Call POST /api/payment-verifications/:requestId/approve endpoint
  - Pass notes in request body
  - Remove verification from pending list on success
  - Revert optimistic update on error
  - Show success/error toast notifications
  - _Requirements: TR3, TR1, TR4_

- [ ] 11.6 Implement rejectVerification action
  - Implement optimistic update before API call
  - Call POST /api/payment-verifications/:requestId/reject endpoint
  - Pass reason and notes in request body
  - Remove verification from pending list on success
  - Revert optimistic update on error
  - Show success/error toast notifications
  - _Requirements: TR3, TR1, TR4_

- [ ] 11.7 Register memberPayments module in root store
  - Import memberPayments module in store/index.ts
  - Register module in modules object
  - Ensure proper TypeScript typing for root state
  - _Requirements: TR3_

---

## 🔌 Phase 5: API Service Layer

### Task 12: Create API Service Functions

- [ ] 12.1 Create memberPaymentService
  - Create services/memberPaymentService.ts file
  - Implement getMemberPaymentDetails function
  - Add proper TypeScript return types
  - Include error handling with try-catch
  - Add request timeout configuration
  - _Requirements: TR1, TR4_

- [ ] 12.2 Create verificationService
  - Create services/verificationService.ts file
  - Implement approveVerification function
  - Implement rejectVerification function
  - Add proper TypeScript parameter and return types
  - Include error handling and retry logic
  - _Requirements: TR1, TR4_

- [ ] 12.3 Add request/response interceptors
  - Configure axios interceptors for authentication tokens
  - Add request logging for debugging
  - Add response error handling
  - Implement token refresh logic if needed
  - Add request timeout handling
  - _Requirements: TR1, SR1, TR4_

---

## 🎨 Phase 6: Styling and Animations

### Task 13: Implement Wujo Brand Styling

- [ ] 13.1 Apply color palette throughout components
  - Use dark green (#014023) for hero section and premium elements
  - Use aquamarine (#5FD9AC) for CTAs and active states
  - Use white smoke (#F2F2F2) for page background
  - Use appropriate colors for status indicators
  - Ensure proper contrast ratios for accessibility
  - _Requirements: UX1_

- [ ] 13.2 Implement spacing and typography
  - Follow 8px spacing grid system
  - Apply typography scale (32px hero, 20px titles, 16px body, 14px secondary)
  - Use proper font weights (bold for titles, semibold for headers, regular for body)
  - Ensure minimum 16px font size for readability
  - _Requirements: UX1, UX2_

- [ ] 13.3 Add smooth animations and transitions
  - Implement 300ms standard timing for most transitions
  - Add hover effects on cards (translateY, shadow)
  - Add button press animations (scale 0.98)
  - Implement modal slide-up animation
  - Add fade-in animations for content loading
  - Use cubic-bezier(0.4, 0, 0.2, 1) timing function
  - _Requirements: UX1_

---

## ✅ Phase 7: Testing and Quality Assurance

### Task 14: Implement Testing

- [ ]* 14.1 Write unit tests for components
  - Test PaymentHistoryCard rendering and interactions
  - Test VerificationRequestCard button clicks
  - Test ReceiptViewerModal navigation and zoom
  - Test MemberHeroSection data display
  - Test dialog components validation
  - _Requirements: TR4_

- [ ]* 14.2 Write integration tests for Vuex store
  - Test fetchMemberPaymentDetails action
  - Test approveVerification action with optimistic updates
  - Test rejectVerification action with error handling
  - Test state mutations
  - Test computed getters
  - _Requirements: TR3, TR4_

- [ ]* 14.3 Write E2E tests for complete workflows
  - Test navigation from IqubDetailPage to IqubBookPage
  - Test payment history viewing
  - Test receipt viewing with zoom/pan
  - Test payment verification approval flow
  - Test payment verification rejection flow
  - Test error handling and retry mechanisms
  - _Requirements: FR1, FR2, FR3, FR4, FR5_

---

## 🚀 Phase 8: Integration and Deployment

### Task 15: Final Integration

- [ ] 15.1 Update IqubDetailPage navigation
  - Add click handler to member cards in Members tab
  - Navigate to IqubBookPage with iqubId and memberId params
  - Pass member name for breadcrumb/title
  - Test navigation flow
  - _Requirements: FR1_

- [ ] 15.2 Test complete user flow
  - Test collector login and Iqub selection
  - Test member list display
  - Test navigation to IqubBookPage
  - Test payment history viewing
  - Test verification approval/rejection
  - Test receipt viewing
  - Verify data updates across pages
  - _Requirements: All functional requirements_

- [ ] 15.3 Performance optimization
  - Implement lazy loading for receipt images
  - Add virtual scrolling for long payment histories
  - Optimize API response caching
  - Minimize bundle size with code splitting
  - Test performance on 3G connection
  - Ensure 60fps animations on mobile
  - _Requirements: TR3_

- [ ] 15.4 Security audit
  - Verify authentication on all endpoints
  - Test authorization (collector can only access their Iqubs)
  - Validate input sanitization
  - Test HTTPS encryption
  - Verify sensitive data masking in logs
  - Test file upload security (virus scanning, size limits)
  - _Requirements: SR1, SR2_

---

## 📊 Success Metrics & Validation

### Functional Validation
- [ ] Member payment data displays correctly from API
- [ ] Payment verification workflow completes successfully
- [ ] Receipt upload and viewing works smoothly
- [ ] Approval/rejection updates system state correctly
- [ ] Payment history shows accurate chronological data
- [ ] All error scenarios are handled gracefully

### Performance Validation
- [ ] Page loads within 2 seconds on 3G connection
- [ ] Smooth 60fps animations on mobile devices
- [ ] Image loading optimized with progressive enhancement
- [ ] Virtual scrolling handles 100+ payment records
- [ ] API responses cached appropriately
- [ ] Bundle size impact minimized

### UX Validation
- [ ] Follows Wujo brand guidelines consistently
- [ ] Mobile-first design works on all screen sizes
- [ ] Touch targets meet accessibility standards (44x44px minimum)
- [ ] Navigation flow is intuitive and clear
- [ ] Error messages are helpful and actionable
- [ ] Loading states provide appropriate feedback

### Security Validation
- [ ] Authentication and authorization working correctly
- [ ] Sensitive payment data properly protected
- [ ] File uploads validated and secured
- [ ] API endpoints properly rate limited
- [ ] Audit logging captures all verification actions
- [ ] Data privacy requirements met

---

**Total Estimated Time:** 12-15 days  
**Team Size:** 2-3 developers (1 backend, 1-2 frontend)  
**Priority:** High - Core collector functionality  
**Dependencies:** Existing authentication system, Iqub management APIs, Member model

**Next Steps:**
1. Review and approve task breakdown
2. Setup development environment
3. Begin Phase 1: Backend API Development
4. Parallel development of frontend components (Phase 2)
5. Integration and testing (Phases 3-7)
6. Final deployment (Phase 8)
