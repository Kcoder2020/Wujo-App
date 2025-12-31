# Requirements Document

## Introduction

This feature transforms the Lottery tab in the Collector's Iqub Detail Page from a simple date picker and button interface into an engaging, premium lottery experience. The new design displays credit rounds as interactive cards, shows lottery eligibility status, and features an animated spin wheel for winner selection. When a lottery is initiated, the system calls the backend API, receives the winner, and displays an animated spin wheel that lands on the winner before showing a celebration animation.

## Glossary

- **Lottery_System**: The complete lottery feature including credit round cards, eligibility checks, spin wheel animation, and winner announcement
- **Credit_Round_Card**: A premium card component displaying credit round information, lottery eligibility status, and action buttons
- **Spin_Wheel**: An animated wheel component that displays eligible members and spins to reveal the lottery winner
- **Lottery_API**: The backend endpoint `POST /api/iqubs/:iqubId/lottery/initiate` that determines the winner
- **Eligibility_Status**: Boolean flag `can_initiate_lottery` from the credit round status API indicating if lottery can be initiated
- **Winner_Announcement**: The celebration modal/overlay shown after the spin wheel lands on the winner
- **Half_Contributor_Pair**: Two half contributors paired together who share a single lottery slot and split the credit amount

## Requirements

### Requirement 1: Credit Round Cards Display

**User Story:** As a collector, I want to see credit rounds displayed as premium cards in the Lottery tab, so that I can easily understand the lottery status for each credit round.

#### Acceptance Criteria

1. WHEN the Lottery tab is selected, THE Lottery_System SHALL display credit round information as premium dark green cards following Wujo UI guidelines
2. WHEN credit round data is available, THE Credit_Round_Card SHALL display the credit round number, saving round range, completion percentage, and lottery eligibility status
3. WHEN a credit round is complete but lottery not yet initiated, THE Credit_Round_Card SHALL display an "Initiate Lottery" button in medium aquamarine color
4. WHEN a credit round has already had its lottery initiated, THE Credit_Round_Card SHALL display the winner information and "Completed" status
5. WHEN credit round data is loading, THE Lottery_System SHALL display skeleton loaders matching the card layout
6. IF credit round data fails to load, THEN THE Lottery_System SHALL display an error state with retry button

### Requirement 2: Lottery Eligibility Validation

**User Story:** As a collector, I want to see clear visual feedback about lottery eligibility, so that I understand when I can initiate a lottery.

#### Acceptance Criteria

1. WHEN `can_initiate_lottery` is false, THE Credit_Round_Card SHALL display the "Initiate Lottery" button in disabled state with reduced opacity
2. WHEN `can_initiate_lottery` is false, THE Credit_Round_Card SHALL display a tooltip or message explaining why lottery cannot be initiated (e.g., "All payments must be verified first")
3. WHEN `can_initiate_lottery` is true, THE Credit_Round_Card SHALL display the "Initiate Lottery" button in active state with full opacity and hover effects
4. WHEN the completion percentage is less than 100%, THE Credit_Round_Card SHALL display a progress indicator showing current completion status

### Requirement 3: Spin Wheel Component

**User Story:** As a collector, I want to see an animated spin wheel when initiating a lottery, so that the winner selection feels exciting and transparent.

#### Acceptance Criteria

1. WHEN the "Initiate Lottery" button is clicked, THE Lottery_System SHALL display a full-screen modal with the Spin_Wheel component
2. THE Spin_Wheel SHALL display all eligible members as segments on the wheel, with each segment showing the member's name
3. WHEN half contributors are paired, THE Spin_Wheel SHALL display the pair as a single segment with both names
4. THE Spin_Wheel SHALL use Wujo brand colors (dark green segments with medium aquamarine accents)
5. THE Spin_Wheel SHALL have a pointer/indicator at the top showing which segment will be selected
6. WHEN the wheel is spinning, THE Spin_Wheel SHALL animate with realistic deceleration physics (fast start, gradual slowdown)

### Requirement 4: Lottery API Integration

**User Story:** As a collector, I want the lottery winner to be determined by the server, so that the selection is fair and verifiable.

#### Acceptance Criteria

1. WHEN the "Initiate Lottery" button is clicked, THE Lottery_System SHALL call `POST /api/iqubs/:iqubId/lottery/initiate` API
2. WHILE the API request is in progress, THE Lottery_System SHALL display a loading state on the button
3. WHEN the API returns successfully, THE Lottery_System SHALL receive the winner information including member ID, name, and credit amount
4. IF the API returns an error, THEN THE Lottery_System SHALL display an error toast with the error message and allow retry
5. WHEN the API returns a half contributor pair as winner, THE Lottery_System SHALL receive both member IDs and the split credit amount

### Requirement 5: Spin Wheel Animation to Winner

**User Story:** As a collector, I want the spin wheel to animate and land on the actual winner returned by the API, so that the experience feels authentic.

#### Acceptance Criteria

1. WHEN the API returns the winner, THE Spin_Wheel SHALL calculate the rotation needed to land on the winner's segment
2. THE Spin_Wheel SHALL animate spinning for 3-5 seconds with easing deceleration before landing on the winner
3. THE Spin_Wheel SHALL add random extra rotations (2-4 full spins) before the final landing position for dramatic effect
4. WHEN the wheel stops, THE Spin_Wheel SHALL highlight the winning segment with a glow effect
5. THE Spin_Wheel animation SHALL use CSS transforms for smooth 60fps performance

### Requirement 6: Winner Announcement

**User Story:** As a collector, I want to see a celebration when the winner is announced, so that the lottery feels like a special event.

#### Acceptance Criteria

1. WHEN the Spin_Wheel stops on the winner, THE Winner_Announcement SHALL display after a 500ms delay
2. THE Winner_Announcement SHALL show the winner's name prominently with large typography
3. THE Winner_Announcement SHALL display the credit amount won (full amount or half amount for paired winners)
4. THE Winner_Announcement SHALL include a celebration animation (confetti or similar effect)
5. THE Winner_Announcement SHALL have a "Done" button to close the modal and return to the Lottery tab
6. WHEN the modal is closed, THE Lottery_System SHALL refresh the credit round status to show updated lottery history

### Requirement 7: Lottery History Display

**User Story:** As a collector, I want to see the history of past lottery winners, so that I can track who has won in each credit round.

#### Acceptance Criteria

1. WHEN a credit round has a completed lottery, THE Credit_Round_Card SHALL display the winner's name and credit amount
2. WHEN the winner was a half contributor pair, THE Credit_Round_Card SHALL display both names and the split amount
3. THE Lottery_System SHALL display completed credit rounds in chronological order (most recent first or by round number)
4. WHEN viewing lottery history, THE Credit_Round_Card SHALL display the date the lottery was initiated

### Requirement 8: Accessibility and Performance

**User Story:** As a user, I want the lottery feature to be accessible and performant, so that everyone can use it smoothly.

#### Acceptance Criteria

1. THE Spin_Wheel SHALL be keyboard accessible with Enter key to initiate spin
2. THE Spin_Wheel SHALL announce the winner via screen reader after animation completes
3. THE Spin_Wheel animation SHALL use `will-change` and GPU-accelerated properties for smooth performance
4. THE Lottery_System SHALL work on devices with reduced motion preferences by showing instant results without animation
5. THE Spin_Wheel segments SHALL have sufficient color contrast for readability (minimum 4.5:1 ratio)
