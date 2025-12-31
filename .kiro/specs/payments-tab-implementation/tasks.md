# Implementation Plan

## Task 1: Add TypeScript Interfaces for Credit Round Data

**Status:** ✅ complete

**Description:** Create TypeScript interfaces for credit round status API response data.

**Sub-tasks:**
- Create or update `src/types/creditRound.ts` file
- Define `CreditRoundStatus` interface matching API response structure
- Define `CreditRoundMember` interface for member payment data
- Define `SavingRoundStatus` interface for individual saving round status
- Export all interfaces from `src/types/index.ts`

**Requirements:** 1.1, 1.2, 1.3, 1.4

---

## Task 2: Extend Vuex Store Module for Credit Round Status

**Status:** ✅ complete

**Description:** Add state, mutations, actions, and getters to the iqubs Vuex module for managing credit round status data.

**Sub-tasks:**
- Add `creditRoundStatus`, `creditRoundStatusLoading`, and `creditRoundStatusError` to state
- Create `setCreditRoundStatus`, `setCreditRoundStatusLoading`, `setCreditRoundStatusError`, and `clearCreditRoundStatus` mutations
- Create `fetchCreditRoundStatus` action that calls `/api/collector/iqubs/:iqubId/credit-round-status` endpoint
- Add getters for `creditRoundStatus`, `creditRoundStatusLoading`, and `creditRoundStatusError`
- Handle authentication token and error responses

**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9

---

## Task 3: Implement Premium Header Card Component

**Status:** ✅ complete

**Description:** Create the premium header card showing credit round number, saving round range, and progress visualization.

**Sub-tasks:**
- Add header card container with dark green gradient background
- Display "Credit Round X of Y" title (24px SemiBold white)
- Display "Saving Rounds X-Y" subtitle (16px Medium white 80% opacity)
- Integrate ProgressRing component (120px diameter, 8px stroke, aquamarine color)
- Display completion percentage in center (32px Bold aquamarine)
- Display "Complete" label below percentage (14px Medium white 80% opacity)
- Add checkmark icon when completion is 100%
- Apply slideUp animation (300ms cubic-bezier)
- Add box shadow and border radius styling

**Requirements:** 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10

---

## Task 4: Implement Status Legend Component

**Status:** ✅ complete

**Description:** Create the status legend showing payment status indicators and their meanings.

**Sub-tasks:**
- Add legend container with white background and border radius
- Display "Status Legend" title (14px SemiBold dark green)
- Create legend items in horizontal flex layout with wrap
- Add "Verified" item with green checkmark icon
- Add "Pending" item with yellow clock icon
- Add "Not Paid" item with gray circle icon
- Add "Failed" item with red X icon
- Apply fadeIn animation (200ms)
- Style legend labels (12px Medium)

**Requirements:** 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10

---

## Task 5: Implement Member Payment Card Component

**Status:** ✅ complete

**Description:** Create member payment cards showing individual member payment status across saving rounds.

**Sub-tasks:**
- Add member card container with white background and shadow
- Create member header with avatar, name, phone, and contribution badge
- Display member avatar with person icon (48px circle, aquamarine background)
- Display member name (16px SemiBold dark green)
- Display member phone (14px Regular gray)
- Add contribution type badge ("Full" or "Half") with appropriate styling
- Create saving rounds row with horizontal flex layout
- Display round indicators with round number and status icon
- Add status icons: checkmark (verified), clock (pending), circle (not_started), X (failed)
- Display completion count "X/Y complete" (14px Medium gray)
- Apply staggered fadeIn animation (each card 100ms delay)

**Requirements:** 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15

---


## Task 6: Implement Sticky Initiate Lottery Button

**Status:** ✅ complete

**Description:** Create the sticky action button for initiating lottery when all payments are verified.

**Sub-tasks:**
- Add sticky button container fixed at bottom (above tab bar)
- Style button with aquamarine background, 56px height, 16px border radius
- Display "Initiate Lottery" text (18px Bold dark green)
- Add trophy icon (24px) before text
- Enable button only when `can_initiate_lottery` is true
- Disable button when completion percentage is less than 100%
- Apply disabled styling (50% opacity, gray background)
- Add tooltip "All payments must be verified first" for disabled state
- Implement `initiateLottery` handler that dispatches Vuex action
- Show loading spinner and "Initiating..." text during API call
- Show success toast and navigate to lottery tab on success
- Show error toast with retry option on failure
- Apply slideUp animation (300ms)
- Apply scale(0.98) transform on press

**Requirements:** 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15

---

## Task 7: Implement Manual Refresh Functionality

**Status:** ✅ complete

**Description:** Add a refresh button to manually reload payment status data.

**Sub-tasks:**
- Add refresh button in top right corner of Payments tab
- Display circular refresh icon (24px aquamarine)
- Implement `refreshPaymentStatus` handler that dispatches fetchCreditRoundStatus
- Rotate refresh icon 360 degrees during refresh (500ms)
- Show green checkmark animation on success
- Show error toast on failure
- Disable refresh button during refresh
- Apply scale(0.95) transform on press
- Add aria-label "Refresh payment status"
- Ensure 48x48px touch target

**Requirements:** 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10

---

## Task 8: Implement Loading State

**Status:** ✅ complete

**Description:** Create loading state UI with spinner and skeleton cards.

**Sub-tasks:**
- Add loading state container with centered layout
- Display spinner (aquamarine color)
- Display "Loading payment status..." text (16px Medium gray)
- Create 3 skeleton cards with gray background and pulse animation
- Apply fadeIn animation (200ms)
- Show loading state when `creditRoundStatusLoading` is true
- Hide loading state when data is loaded or error occurs

**Requirements:** 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10

---

## Task 9: Implement Error State

**Status:** ✅ complete

**Description:** Create error state UI with error message and retry button.

**Sub-tasks:**
- Add error state container with centered layout
- Display alert icon (64px red)
- Display "Failed to Load Payment Status" title (20px SemiBold dark green)
- Display error message from store (14px Regular gray)
- Add "Retry" button with aquamarine background
- Implement retry handler that dispatches fetchCreditRoundStatus
- Apply fadeIn animation (300ms)
- Add aria-live="polite" for screen reader announcement
- Show error state when `creditRoundStatusError` is not null

**Requirements:** 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10

---

## Task 10: Implement Empty State

**Status:** ✅ complete

**Description:** Create empty state UI when no credit rounds are available.

**Sub-tasks:**
- Add empty state container with centered layout
- Display document icon (80px aquamarine 30% opacity)
- Display "No Credit Rounds Yet" title (20px SemiBold dark green)
- Display descriptive text "Credit rounds will appear here once members start making payments" (14px Regular gray)
- Add "Go to Members" button with aquamarine background
- Implement button handler that switches to Members tab
- Apply fadeIn animation (300ms)
- Add aria-label "No credit rounds available"
- Show empty state when creditRoundStatus is null and not loading/error

**Requirements:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10

---

## Task 11: Implement Tab Activation Logic

**Status:** ✅ complete

**Description:** Add logic to fetch credit round status when Payments tab is activated.

**Sub-tasks:**
- Add watcher for `activeTab` value
- Dispatch `fetchCreditRoundStatus` when tab changes to 'payments'
- Pass current `iqubId` to the action
- Add cleanup logic in `onUnmounted` to clear credit round status
- Ensure fetch only happens if iqubId is valid

**Requirements:** 1.1, 1.10

---

## Task 12: Add Required Icons

**Status:** ✅ complete

**Description:** Import all required Ionicons for the Payments tab.

**Sub-tasks:**
- Import `trophyOutline` for initiate lottery button
- Import `refreshOutline` for refresh button
- Import `checkmarkCircleOutline` for verified status
- Import `timeOutline` for pending status
- Import `ellipseOutline` for not_started status
- Import `closeCircleOutline` for failed status
- Import `alertCircleOutline` for error state
- Import `personOutline` for member avatar

**Requirements:** 3.10, 3.11, 3.12, 3.13, 4.6, 4.7, 4.8, 4.9, 5.4, 6.2, 9.2

---

## Task 13: Implement Responsive Layout

**Status:** ✅ complete

**Description:** Ensure the Payments tab adapts to different screen sizes.

**Sub-tasks:**
- Display member cards in single column on all screen sizes
- Use full width with 16px horizontal padding for header card
- Maintain 120px diameter for progress ring on all screens
- Ensure minimum 48x48px touch targets for interactive elements
- Maintain 56px height for sticky button on all screens
- Wrap status legend items if screen width is insufficient
- Wrap saving round indicators if they exceed card width
- Keep sticky button fixed at bottom when scrolling
- Test on mobile, tablet, and desktop viewports

**Requirements:** 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10

---

## Task 14: Implement Accessibility Enhancements

**Status:** ✅ complete

**Description:** Add ARIA labels and accessibility features to the Payments tab.

**Sub-tasks:**
- Add aria-label "Current credit round status" to header card
- Add aria-label "Completion progress: X percent" to progress ring
- Add role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax to progress ring
- Add aria-label "Member: [name], [X] of [Y] payments complete" to member cards
- Add aria-label describing status to status icons
- Add aria-label "Initiate lottery for credit round X" to lottery button
- Add aria-disabled="true" to disabled lottery button
- Add aria-label "Refresh payment status" to refresh button
- Add aria-live="polite" to error messages
- Ensure visible focus indicators with aquamarine border on all interactive elements
- Test keyboard navigation through all interactive elements

**Requirements:** 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10

---

## Task 15: Implement Animations and Transitions

**Status:** ✅ complete

**Description:** Add smooth animations for all UI state changes.

**Sub-tasks:**
- Add slideUp animation for header card (300ms cubic-bezier(0.4, 0, 0.2, 1))
- Add staggered fadeIn animation for member cards (each 100ms delay)
- Add fadeIn animation for status legend (200ms)
- Add slideUp animation for sticky button (300ms)
- Add 360-degree rotation for refresh icon (500ms)
- Add scale(0.98) transform for button press (100ms)
- Add fadeOut (200ms) then fadeIn (300ms) transition for loading to content
- Add fadeIn animation for error state (300ms)
- Add fadeIn animation for empty state (300ms)
- Add smooth transition for progress ring percentage (500ms)

**Requirements:** 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10

---

## Task 16: Update IqubDetailPage Template

**Status:** ✅ complete

**Description:** Replace the "Coming Soon" placeholder in the Payments tab with the new implementation.

**Sub-tasks:**
- Remove existing placeholder content from Payments tab section
- Add conditional rendering for loading, error, empty, and content states
- Add header card component
- Add status legend component
- Add member payment cards list
- Add sticky initiate lottery button
- Add refresh button
- Ensure proper v-if/v-else-if/v-else structure for state management

**Requirements:** All requirements

---

## Task 17: Test and Verify Implementation

**Status:** ✅ complete

**Description:** Test all functionality and verify requirements are met.

**Sub-tasks:**
- Test credit round status fetch on tab activation
- Test loading state display during fetch
- Test error state display on fetch failure
- Test empty state display when no data
- Test header card displays correct credit round info
- Test progress ring shows correct percentage
- Test status legend displays all status types
- Test member cards display correct payment status
- Test status icons match payment status
- Test initiate lottery button enables/disables correctly
- Test lottery initiation success and error flows
- Test refresh functionality
- Test responsive layout on different screen sizes
- Test accessibility with screen reader
- Test keyboard navigation
- Test all animations and transitions
- Run diagnostics to verify no errors

**Requirements:** All requirements

---

