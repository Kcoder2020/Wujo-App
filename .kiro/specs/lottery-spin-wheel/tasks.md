# Implementation Plan: Lottery Spin Wheel

## Overview

This implementation plan transforms the Lottery tab into an engaging spin wheel experience. The tasks are organized to build incrementally, starting with the core components and progressing to the full integration.

## Tasks

- [x] 1. Create TypeScript interfaces and types
  - [x] 1.1 Create lottery types in `src/types/lottery.ts`
    - Define `LotteryWinner`, `CreditRoundInfo`, `WheelSegment`, `LotteryRecord`, `LotteryResult` interfaces
    - Define API response types for single and pair winners
    - Export types from `src/types/index.ts`
    - _Requirements: 4.3, 4.5, 7.1, 7.2_

  - [ ]* 1.2 Write property test for winner data extraction
    - **Property 3: Winner Data Extraction**
    - **Validates: Requirements 4.3, 4.5**

- [x] 2. Create wheel segment generation utility
  - [x] 2.1 Create `src/utils/lotteryUtils.ts` with segment generation function
    - Implement `generateWheelSegments(members: EligibleMember[]): WheelSegment[]`
    - Handle full contributors as individual segments
    - Pair half contributors into single segments
    - Assign alternating dark green colors
    - _Requirements: 3.2, 3.3_

  - [ ]* 2.2 Write property test for wheel segment generation
    - **Property 2: Wheel Segments Match Eligible Members**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 2.3 Create rotation calculation function
    - Implement `calculateWinningRotation(segments: WheelSegment[], winnerId: string): number`
    - Calculate base rotation to position winner at top
    - Add random extra spins (2-4 full rotations)
    - Add small random offset for natural feel
    - _Requirements: 5.1_

  - [ ]* 2.4 Write property test for rotation calculation
    - **Property 4: Rotation Calculation Lands on Winner**
    - **Validates: Requirements 5.1**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create SpinWheel component
  - [x] 4.1 Create `src/components/SpinWheel.vue` base structure
    - Create SVG-based wheel with dynamic segments
    - Add pointer indicator at top
    - Use Wujo brand colors (dark green segments, aquamarine accents)
    - Make wheel responsive with proper sizing
    - _Requirements: 3.2, 3.4, 3.5_

  - [x] 4.2 Implement spin animation
    - Add CSS transform-based rotation animation
    - Use cubic-bezier easing for realistic deceleration
    - Duration 3-5 seconds
    - Add winning segment highlight on completion
    - Support reduced motion preference
    - _Requirements: 3.6, 5.2, 5.3, 5.4, 5.5, 8.3, 8.4_

  - [x] 4.3 Add accessibility features
    - Add keyboard support (Enter to spin)
    - Add aria-labels for screen readers
    - Announce winner after animation
    - Ensure color contrast meets WCAG standards
    - _Requirements: 8.1, 8.2, 8.5_

- [x] 5. Create WinnerAnnouncement component
  - [x] 5.1 Create `src/components/WinnerAnnouncement.vue`
    - Display winner name prominently (large typography)
    - Show credit amount won
    - Handle pair winners (display both names)
    - Add "Done" button to close
    - _Requirements: 6.2, 6.3, 6.5_

  - [x] 5.2 Add celebration animation
    - Implement confetti effect using canvas or CSS
    - Trigger on component mount
    - Use Wujo brand colors for confetti
    - _Requirements: 6.4_

  - [ ]* 5.3 Write property test for winner announcement content
    - **Property 5: Winner Announcement Content**
    - **Validates: Requirements 6.2, 6.3**

- [x] 6. Create LotterySpinModal component
  - [x] 6.1 Create `src/components/LotterySpinModal.vue`
    - Full-screen modal using Ionic modal
    - Integrate SpinWheel component
    - Integrate WinnerAnnouncement component
    - Handle modal open/close states
    - _Requirements: 3.1, 6.1_

  - [x] 6.2 Implement lottery API integration
    - Call `POST /api/iqubs/:iqubId/lottery/initiate` on spin start
    - Handle loading state during API call
    - Parse winner from API response (single or pair)
    - Trigger spin animation with winner data
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [x] 6.3 Implement error handling
    - Display error toast on API failure
    - Show retry button for recoverable errors
    - Handle specific error codes appropriately
    - _Requirements: 4.4_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create CreditRoundCard component
  - [x] 8.1 Create `src/components/CreditRoundCard.vue`
    - Premium dark green card design following Wujo UI guidelines
    - Display credit round number and saving round range
    - Show completion percentage with progress indicator
    - Display lottery eligibility status
    - _Requirements: 1.1, 1.2, 2.4_

  - [x] 8.2 Implement conditional button states
    - Show "Initiate Lottery" button when eligible
    - Disable button with tooltip when not eligible
    - Show "Completed" status with winner info when lottery done
    - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3_

  - [x] 8.3 Display lottery winner information
    - Show winner name and credit amount for completed lotteries
    - Handle pair winners (display both names)
    - Show lottery date
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ]* 8.4 Write property test for credit round card state rendering
    - **Property 1: Credit Round Card State Rendering**
    - **Validates: Requirements 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**

- [x] 9. Update Vuex store for lottery
  - [x] 9.1 Add lottery state and mutations to `src/store/modules/iqubs.ts`
    - Add `lotteryHistory`, `lotteryHistoryStatus`, `lotteryHistoryError` state
    - Add `currentLotteryResult`, `isInitiatingLottery` state
    - Add mutations for setting lottery data
    - _Requirements: 4.1, 7.3_

  - [x] 9.2 Add lottery actions
    - Implement `initiateLottery(iqubId, creditRoundNumber)` action
    - Implement `fetchLotteryHistory(iqubId)` action
    - Handle API responses and errors
    - _Requirements: 4.1, 4.2, 4.4, 7.3_

  - [x] 9.3 Add lottery getters
    - Add `lotteryHistory`, `lotteryHistoryStatus`, `lotteryHistoryError` getters
    - Add `currentLotteryResult`, `isInitiatingLottery` getters
    - _Requirements: 7.3_

- [x] 10. Integrate into IqubDetailPage
  - [x] 10.1 Update Lottery tab in `src/views/collectorViews/IqubDetailPage.vue`
    - Replace current lottery content with CreditRoundCard components
    - Add loading skeleton for credit round cards
    - Add error state with retry button
    - _Requirements: 1.1, 1.5, 1.6_

  - [x] 10.2 Integrate LotterySpinModal
    - Add modal component to template
    - Connect "Initiate Lottery" button to open modal
    - Pass eligible members to modal
    - Handle lottery completion callback
    - _Requirements: 3.1, 6.6_

  - [x] 10.3 Implement lottery history display
    - Fetch lottery history on tab activation
    - Display completed lotteries in chronological order
    - Refresh after lottery completion
    - _Requirements: 7.3, 6.6_

  - [ ]* 10.4 Write property test for lottery history rendering
    - **Property 6: Lottery History Rendering**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Polish and accessibility review
  - [ ] 12.1 Add loading states and transitions
    - Add smooth transitions between states
    - Add skeleton loaders for all loading states
    - Ensure animations respect reduced motion preference
    - _Requirements: 1.5, 8.4_

  - [ ] 12.2 Final accessibility audit
    - Verify keyboard navigation works throughout
    - Test with screen reader
    - Verify color contrast ratios
    - _Requirements: 8.1, 8.2, 8.5_

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
