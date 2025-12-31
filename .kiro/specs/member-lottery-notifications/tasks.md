# Implementation Plan: Member Lottery Notifications

## Overview

This plan implements the member lottery notification system, allowing members to view lottery results with spin wheel animations. The implementation reuses existing components and extends the member Vuex store.

## Tasks

- [x] 1. Add TypeScript types for lottery notifications
  - Create interfaces for `MemberLotteryResult`, `LotteryParticipant`, `LotteryWinnerInfo`, `NotificationCount`
  - Add to `src/types/lottery.ts` or create `src/types/memberLottery.ts`
  - _Requirements: 2.2, 3.2_

- [x] 2. Extend member Vuex store with lottery notification state and actions
  - [x] 2.1 Add state properties for lottery notifications
    - Add `unviewedLotteryCount`, `unviewedLotteries`, `selectedLotteryDetails`
    - Add status and error state for lottery notifications
    - _Requirements: 1.1, 2.1_

  - [x] 2.2 Add mutations for lottery notification state
    - `setUnviewedLotteryCount`, `setUnviewedLotteries`, `setSelectedLotteryDetails`
    - `setLotteryNotificationsStatus`, `setLotteryNotificationsError`
    - `decrementUnviewedCount`, `removeLotteryFromUnviewed`
    - _Requirements: 4.2, 4.3_

  - [x] 2.3 Add action to fetch notification count
    - Call `GET /api/member/notifications/count`
    - Update `unviewedLotteryCount` state
    - Handle errors gracefully without blocking UI
    - _Requirements: 1.1, 1.4_

  - [x] 2.4 Add action to fetch unviewed lottery results
    - Call `GET /api/member/lottery/unviewed`
    - Update `unviewedLotteries` state
    - _Requirements: 2.1_

  - [x] 2.5 Add action to fetch lottery details
    - Call `GET /api/member/lottery/:lotteryId`
    - Update `selectedLotteryDetails` state
    - _Requirements: 3.1_

  - [x] 2.6 Add action to mark lottery as viewed
    - Call `POST /api/member/lottery/:lotteryId/viewed`
    - Update count and remove from unviewed list on success
    - Retry silently on failure (up to 3 times)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.7 Add getters for lottery notification state
    - `unviewedLotteryCount`, `unviewedLotteries`, `selectedLotteryDetails`
    - `lotteryNotificationsStatus`, `lotteryNotificationsError`
    - _Requirements: 1.2, 2.1_

- [x] 3. Update MemberDashboard with notification badge
  - [x] 3.1 Add notification badge to header icon
    - Display badge with count when `unviewedLotteryCount > 0`
    - Hide badge when count is 0
    - _Requirements: 1.2, 1.3, 5.1, 5.2_

  - [x] 3.2 Fetch notification count on dashboard mount
    - Call `fetchNotificationCount` action in `onMounted`
    - _Requirements: 1.1_

  - [x] 3.3 Add navigation to lottery notifications page
    - Navigate to `/member/lottery-notifications` on notification icon click
    - _Requirements: 5.3_

- [x] 4. Create LotteryNotificationCard component
  - Display Iqub name, credit round, credit amount, lottery date
  - Show winner indicator (trophy icon) if `is_winner` is true
  - Emit `select` event with lottery ID on click
  - _Requirements: 2.2, 2.3_

- [x] 5. Create LotteryNotificationsPage view
  - [x] 5.1 Create page structure with header and list
    - Add back button and page title
    - Fetch unviewed lotteries on mount
    - _Requirements: 2.1_

  - [x] 5.2 Implement loading state
    - Show skeleton cards while loading
    - _Requirements: 2.1_

  - [x] 5.3 Implement error state with retry
    - Show error message and retry button
    - _Requirements: 2.5_

  - [x] 5.4 Implement empty state
    - Show message when no unviewed lottery results
    - _Requirements: 2.4_

  - [x] 5.5 Implement lottery list with cards
    - Render `LotteryNotificationCard` for each lottery
    - Handle card selection to open modal
    - _Requirements: 2.1, 2.2_

- [x] 6. Create MemberLotteryModal component
  - [x] 6.1 Create modal structure with phases
    - Loading phase while fetching lottery details
    - Spinning phase with SpinWheel component
    - Winner phase with WinnerAnnouncement component
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 6.2 Build wheel segments from participants
    - Create segments from `participants` array
    - Pair half-contributors into single segments
    - Use `user_id` as segment ID for winner matching
    - _Requirements: 3.2, 3.5_

  - [x] 6.3 Implement spin animation to winner
    - Pass `winner.user_id` as winner ID to SpinWheel
    - Handle spin complete event
    - _Requirements: 3.3_

  - [x] 6.4 Show winner announcement with congratulation
    - Display special message if `is_winner` is true
    - Show credit amount and winner details
    - _Requirements: 3.4, 3.6_

  - [x] 6.5 Mark lottery as viewed after animation
    - Call `markLotteryAsViewed` action after winner announcement
    - Emit `viewed` event to parent
    - _Requirements: 4.1_

- [x] 7. Add route for lottery notifications page
  - Add route `/member/lottery-notifications` to router
  - Configure route guard for authenticated members
  - _Requirements: 5.3_

- [x] 8. Checkpoint - Ensure all components work together
  - Test full flow: dashboard badge → notifications page → select lottery → view animation → mark as viewed
  - Verify notification count updates correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 9. Write property tests for lottery notifications
  - [ ]* 9.1 Write property test for notification badge visibility
    - **Property 1: Notification Badge Visibility**
    - **Validates: Requirements 1.2, 1.3, 5.2**

  - [ ]* 9.2 Write property test for lottery list data completeness
    - **Property 2: Lottery List Data Completeness**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 9.3 Write property test for spin wheel segment generation
    - **Property 3: Spin Wheel Segment Generation**
    - **Validates: Requirements 3.2, 3.5**

  - [ ]* 9.4 Write property test for mark as viewed state update
    - **Property 5: Mark as Viewed State Update**
    - **Validates: Requirements 4.2, 4.3**

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Run all unit and property tests
  - Verify no TypeScript errors
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- The implementation reuses existing `SpinWheel` and `WinnerAnnouncement` components
