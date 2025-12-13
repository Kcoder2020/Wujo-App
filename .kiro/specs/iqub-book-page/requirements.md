# IqubBookPage Enhancement - Requirements Document

## Introduction

This document outlines the requirements for transforming the IqubBookPage.vue from a mock data display into a fully functional member payment management system. The page will allow collectors to view comprehensive member payment history, manage payment verification requests, and track payment rounds for individual members within an Iqub.

## Glossary

- **System**: The Wujo Iqub Management Application
- **Collector**: The user who creates and manages an Iqub
- **Member**: A participant in an Iqub who makes regular payments
- **Payment Round**: A scheduled payment cycle in the Iqub
- **Payment Verification**: The process of confirming a member's manual payment submission
- **Receipt**: Proof of payment uploaded by a member (image/document)
- **E.164 Format**: International phone number format (+251XXXXXXXXX)
- **Manual Payment**: Payment made outside the app that requires collector verification

---

## Requirements

### Requirement 1: Member Payment Detail Display

**User Story:** As a collector, I want to view comprehensive payment information for a specific member, so that I can track their payment history and current status.

#### Acceptance Criteria

1. WHEN the collector clicks on a member from the IqubDetailPage members list, THE System SHALL navigate to the IqubBookPage with the member's ID and Iqub ID as route parameters

2. WHEN the IqubBookPage loads, THE System SHALL fetch member payment details from the backend API endpoint GET /api/members/:memberId/iqub/:iqubId

3. THE System SHALL display the member's basic information including name, phone number, join date, and avatar in a hero section with dark green gradient background

4. THE System SHALL display payment statistics including current payment round, total rounds, total contributions made, and payment completion percentage

5. THE System SHALL show the member's position in the lottery queue if applicable

### Requirement 2: Payment History Timeline

**User Story:** As a collector, I want to see a chronological list of all payment rounds for a member, so that I can understand their payment behavior and identify any issues.

#### Acceptance Criteria

1. THE System SHALL display all payment rounds for the member in reverse chronological order (newest first)

2. WHEN displaying each payment round, THE System SHALL show the round number, payment date, amount, payment method, and verification status

3. THE System SHALL use color-coded status indicators: green for verified payments, orange for pending verification, red for overdue payments, and grey for upcoming payments

4. WHEN a payment has an uploaded receipt, THE System SHALL display a receipt icon that is clickable

5. THE System SHALL implement pagination showing 10 payment rounds per page with smooth scroll animations

### Requirement 3: Payment Verification Management

**User Story:** As a collector, I want to review and approve or reject manual payment verification requests from members, so that I can maintain accurate payment records.

#### Acceptance Criteria

1. THE System SHALL display pending payment verification requests in a dedicated section with orange left border highlighting

2. WHEN displaying a verification request, THE System SHALL show the round number, claimed amount, submission date, member notes, and receipt preview

3. THE System SHALL provide approve and reject action buttons in the thumb zone (bottom 30% of screen) following mobile-first design principles

4. WHEN the collector clicks approve, THE System SHALL display a confirmation dialog with an optional notes field

5. WHEN the collector clicks reject, THE System SHALL display a dialog requiring a rejection reason

6. WHEN a verification decision is submitted, THE System SHALL call the appropriate API endpoint (POST /api/payment-verifications/:requestId/approve or /api/payment-verifications/:requestId/reject)

7. WHEN verification is approved, THE System SHALL update the member's payment status, increment their current round, and recalculate Iqub totals

8. WHEN verification is rejected, THE System SHALL maintain the member's current payment status and log the rejection reason

### Requirement 4: Receipt Viewing System

**User Story:** As a collector, I want to view payment receipts in detail, so that I can verify the authenticity of manual payment claims.

#### Acceptance Criteria

1. WHEN the collector clicks on a receipt indicator, THE System SHALL open a full-screen modal displaying the receipt image

2. THE System SHALL support zoom and pan functionality for detailed receipt inspection

3. WHEN multiple receipt images exist for a payment, THE System SHALL provide navigation dots to switch between images

4. THE System SHALL display payment metadata (round number, amount, date, member name) as an overlay at the bottom of the receipt viewer

5. THE System SHALL provide a download button to save the receipt image locally

6. THE System SHALL support JPEG, PNG, and PDF file formats for receipts

### Requirement 5: Payment Status Management

**User Story:** As a collector, I want the system to automatically update payment statuses and Iqub totals when I approve verifications, so that all data remains accurate and synchronized.

#### Acceptance Criteria

1. WHEN a payment verification is approved, THE System SHALL update the member's payment record status to "verified"

2. WHEN a payment is verified, THE System SHALL increment the member's saving_rounds count by 1

3. WHEN a payment is verified, THE System SHALL add the payment amount to the Iqub's total_collected amount

4. WHEN a payment is verified, THE System SHALL update the member's current payment round to the next round

5. WHEN a payment is rejected, THE System SHALL maintain all existing values and only update the verification request status

---

## UI/UX Requirements

### UX Requirement 1: Wujo Brand Compliance

**User Story:** As a user, I want the IqubBookPage to follow Wujo's premium FinTech design language, so that the experience feels consistent and trustworthy.

#### Acceptance Criteria

1. THE System SHALL use dark green (#014023) for the hero section background with gradient effect

2. THE System SHALL use aquamarine (#5FD9AC) for all primary action buttons (approve, submit)

3. THE System SHALL use white smoke (#F2F2F2) for the page background

4. THE System SHALL follow the 8px spacing grid system for all layout elements

5. THE System SHALL implement smooth animations with 300ms standard timing for all transitions

### UX Requirement 2: Mobile-First Design

**User Story:** As a mobile user, I want the interface optimized for one-handed use, so that I can easily manage payments on my phone.

#### Acceptance Criteria

1. THE System SHALL place primary action buttons (approve, reject) in the bottom 30% of the screen (thumb zone)

2. THE System SHALL use minimum 56px height for all primary buttons

3. THE System SHALL implement touch-friendly card interactions with minimum 44x44px touch targets

4. THE System SHALL ensure all text is readable with minimum 16px font size

5. THE System SHALL support swipe gestures for navigating between payment rounds

### UX Requirement 3: Hero Section Design

**User Story:** As a collector, I want to see key member information at a glance, so that I can quickly understand their payment status.

#### Acceptance Criteria

1. THE System SHALL display a dark green gradient background (135deg, #014023 0%, #012d19 50%, rgba(95, 217, 172, 0.1) 100%)

2. THE System SHALL show the member's avatar (80px diameter) and name prominently in white text (32px bold)

3. THE System SHALL display key statistics in semi-transparent white cards: current round (e.g., "Round 3/12") and payment completion percentage (e.g., "85% Paid")

4. THE System SHALL include a back button to navigate to IqubDetailPage

5. THE System SHALL include a notification icon for collector alerts

### UX Requirement 4: Payment Timeline Design

**User Story:** As a collector, I want a visually clear payment history, so that I can quickly scan through payment records.

#### Acceptance Criteria

1. THE System SHALL use white cards with 16px border radius and subtle shadow (0 2px 8px rgba(0, 0, 0, 0.08))

2. THE System SHALL implement color-coded status indicators: green dot for verified, orange dot for pending, red dot for overdue

3. THE System SHALL display payment dates in clear format (e.g., "Dec 13, 2024")

4. THE System SHALL show receipt availability with a clickable icon

5. THE System SHALL implement smooth scroll animations when loading more payment rounds

### UX Requirement 5: Verification Interface Design

**User Story:** As a collector, I want an intuitive verification workflow, so that I can quickly process payment requests.

#### Acceptance Criteria

1. THE System SHALL highlight pending verification requests with orange left border (4px width)

2. THE System SHALL display approve button with aquamarine background and dark green text

3. THE System SHALL display reject button with white background, red border, and red text

4. THE System SHALL show receipt preview as a thumbnail (120px x 120px) that expands on click

5. THE System SHALL display confirmation dialogs with clear messaging before submitting decisions

---

## Technical Requirements

### TR Requirement 1: Backend API Development

**User Story:** As a developer, I want robust backend APIs for member payment data, so that the frontend can display accurate information.

#### Acceptance Criteria

1. THE System SHALL implement GET /api/members/:memberId/iqub/:iqubId endpoint to fetch member payment details

2. THE System SHALL implement POST /api/payment-verifications/:requestId/approve endpoint to approve payment verifications

3. THE System SHALL implement POST /api/payment-verifications/:requestId/reject endpoint to reject payment verifications

4. THE System SHALL implement GET /api/receipts/:receiptId endpoint to retrieve receipt images

5. THE System SHALL implement POST /api/receipts/upload endpoint for receipt image uploads

6. THE System SHALL include proper authentication middleware requiring collector role for verification actions

7. THE System SHALL validate all input data including phone numbers in E.164 format

### TR Requirement 2: Data Models and Database Schema

**User Story:** As a developer, I want well-defined data models, so that payment data is structured consistently.

#### Acceptance Criteria

1. THE System SHALL create a MemberPayment schema with fields: memberId, iqubId, roundNumber, amount, date, status, receiptUrls, verificationStatus, collectorNotes

2. THE System SHALL create a PaymentVerification schema with fields: requestId, memberId, iqubId, roundNumber, amount, receiptUrls, submissionDate, status, collectorId, decisionDate, notes

3. THE System SHALL create indexes on memberId and iqubId for efficient querying

4. THE System SHALL implement validation rules for payment amounts (positive numbers) and dates (valid date format)

5. THE System SHALL establish proper relationships between Member, Iqub, and Payment models

### TR Requirement 3: Frontend State Management

**User Story:** As a developer, I want centralized state management for payment data, so that the UI remains synchronized.

#### Acceptance Criteria

1. THE System SHALL create a memberPayments Vuex module with state for member payment data

2. THE System SHALL implement actions: fetchMemberPaymentDetails, approvePaymentVerification, rejectPaymentVerification

3. THE System SHALL implement mutations to update payment statuses locally for optimistic UI updates

4. THE System SHALL implement getters for computed statistics (completion percentage, total paid, etc.)

5. THE System SHALL handle loading states (idle, loading, success, error) for all async operations

### TR Requirement 4: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages and feedback, so that I understand what's happening and can take corrective action.

#### Acceptance Criteria

1. THE System SHALL display user-friendly error messages using Ionic toast notifications

2. THE System SHALL implement retry mechanisms for failed API calls with exponential backoff

3. THE System SHALL handle network connectivity issues gracefully with offline indicators

4. THE System SHALL provide loading spinners (aquamarine color) during API calls

5. THE System SHALL show success animations (scale + fade) when verification decisions are submitted successfully

6. THE System SHALL log all errors to the console for debugging purposes

---

## Security Requirements

### SR Requirement 1: Authentication and Authorization

**User Story:** As a system administrator, I want secure access controls, so that only authorized collectors can manage member payments.

#### Acceptance Criteria

1. THE System SHALL verify collector authentication using JWT tokens for all API requests

2. THE System SHALL validate that the collector owns the Iqub before allowing payment verification actions

3. THE System SHALL protect sensitive payment information with HTTPS encryption

4. THE System SHALL implement session management with automatic token refresh

5. THE System SHALL audit all payment approval and rejection actions with timestamps and collector IDs

### SR Requirement 2: Data Privacy and Security

**User Story:** As a member, I want my financial information protected, so that my privacy is maintained.

#### Acceptance Criteria

1. THE System SHALL encrypt all sensitive data transmission using TLS 1.3

2. THE System SHALL mask phone numbers in logs (show only last 4 digits)

3. THE System SHALL implement data access logging for compliance purposes

4. THE System SHALL follow GDPR-like privacy principles for data handling

5. THE System SHALL secure receipt image storage with access control and encryption at rest

6. THE System SHALL implement virus scanning for all uploaded receipt files

---

## Data Requirements

### DR Requirement 1: Member Payment Data Structure

**Fields Required:**
- member_id: ObjectId (reference to Member)
- iqub_id: ObjectId (reference to Iqub)
- user_info: { name, phone, avatar, join_date }
- current_round: number
- total_rounds: number
- payment_history: Array of payment records
- total_contributions: number
- outstanding_amounts: number
- payment_completion_percentage: number
- pending_verifications: Array of verification requests

### DR Requirement 2: Payment Verification Request Structure

**Fields Required:**
- request_id: ObjectId
- member_id: ObjectId
- iqub_id: ObjectId
- round_number: number
- amount: number
- receipt_urls: Array of strings
- submission_date: Date
- status: 'pending' | 'approved' | 'rejected'
- member_notes: string (optional)
- collector_id: ObjectId
- decision_date: Date (optional)
- collector_notes: string (optional)
- rejection_reason: string (optional)

### DR Requirement 3: Payment History Record Structure

**Fields Required:**
- payment_id: ObjectId
- round_number: number
- amount: number
- payment_date: Date
- due_date: Date
- payment_method: 'mobile_money' | 'bank_transfer' | 'cash' | 'manual'
- status: 'paid' | 'pending' | 'overdue' | 'verified'
- verification_status: 'pending' | 'verified' | 'rejected' | null
- receipt_urls: Array of strings
- verification_date: Date (optional)
- collector_notes: string (optional)

---

## Success Criteria

### Functional Success
- ✅ Member payment data displays correctly from real API
- ✅ Payment verification workflow completes successfully
- ✅ Receipt viewing works smoothly with zoom/pan
- ✅ Payment approvals update system state correctly
- ✅ Member payment status reflects accurately across the app

### Performance Success
- ✅ Page loads within 2 seconds on 3G connection
- ✅ Smooth 60fps animations on mobile devices
- ✅ Responsive design works on all screen sizes (320px - 1920px)
- ✅ Efficient data loading with pagination

### User Experience Success
- ✅ Intuitive navigation flow from IqubDetailPage
- ✅ Clear payment status indicators
- ✅ Easy approval/rejection process
- ✅ Helpful error messages
- ✅ Consistent Wujo branding throughout

---

**Document Version:** 1.0  
**Last Updated:** December 13, 2024  
**Status:** Ready for Design Phase
