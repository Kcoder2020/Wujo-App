# Requirements Document

## Introduction

This feature implements a lottery notification system for members in the Wujo app. When a collector initiates a lottery for an Iqub, all participating members should be notified of the result when they return to the app. Members can view the spin wheel animation showing all participants and see who won the credit round.

## Glossary

- **Member**: A user who has joined one or more Iqubs as a participant
- **Lottery_Result**: The outcome of a lottery draw for a credit round, including winner and all participants
- **Notification_Badge**: A visual indicator showing the count of unviewed lottery results
- **Spin_Wheel**: An animated wheel component showing all lottery participants
- **Winner_Announcement**: A component displaying the lottery winner details
- **Viewed_Status**: A flag indicating whether a member has seen a specific lottery result

## Requirements

### Requirement 1: Notification Count on App Open

**User Story:** As a member, I want to see a notification badge when I have unviewed lottery results, so that I know there are new lottery outcomes to review.

#### Acceptance Criteria

1. WHEN the member opens the app or navigates to the member dashboard, THE System SHALL fetch the unviewed lottery count from the API
2. WHEN the unviewed count is greater than zero, THE System SHALL display a notification badge with the count
3. WHEN the unviewed count is zero, THE System SHALL hide the notification badge
4. IF the API call fails, THEN THE System SHALL gracefully handle the error without blocking the user experience

### Requirement 2: Unviewed Lottery Results List

**User Story:** As a member, I want to see a list of lottery results I haven't viewed yet, so that I can review each one.

#### Acceptance Criteria

1. WHEN a member clicks on the notification badge or navigates to lottery notifications, THE System SHALL fetch and display all unviewed lottery results
2. WHEN displaying lottery results, THE System SHALL show the Iqub name, credit round number, credit amount, and lottery date for each result
3. WHEN displaying lottery results, THE System SHALL indicate whether the member won that lottery
4. WHEN there are no unviewed lottery results, THE System SHALL display an appropriate empty state message
5. IF the API call fails, THEN THE System SHALL display an error message with a retry option

### Requirement 3: Lottery Result Spin Wheel View

**User Story:** As a member, I want to see the spin wheel animation when I select a lottery result, so that I can experience the lottery draw visually.

#### Acceptance Criteria

1. WHEN a member selects a lottery result from the list, THE System SHALL fetch the full lottery data including all participants
2. WHEN the lottery data is loaded, THE System SHALL display the spin wheel with all participants as segments
3. WHEN displaying the spin wheel, THE System SHALL animate the wheel to land on the winner's segment
4. WHEN the spin animation completes, THE System SHALL display the winner announcement with credit amount details
5. WHEN displaying participants, THE System SHALL show paired half-contributors as a single segment with both names
6. IF the member is the winner, THEN THE System SHALL display a special congratulatory message

### Requirement 4: Mark Lottery as Viewed

**User Story:** As a member, I want lottery results to be marked as viewed after I see them, so that I don't see the same notification repeatedly.

#### Acceptance Criteria

1. WHEN the spin wheel animation completes and winner is announced, THE System SHALL call the API to mark the lottery as viewed
2. WHEN a lottery is marked as viewed, THE System SHALL update the notification count
3. WHEN a lottery is marked as viewed, THE System SHALL remove it from the unviewed list
4. IF the mark-as-viewed API call fails, THEN THE System SHALL retry silently without blocking the user

### Requirement 5: Lottery Notification Integration

**User Story:** As a member, I want to access lottery notifications from the member dashboard, so that I can easily find new lottery results.

#### Acceptance Criteria

1. THE System SHALL display a notification icon in the member dashboard header
2. WHEN there are unviewed lottery results, THE System SHALL show a badge count on the notification icon
3. WHEN the member taps the notification icon, THE System SHALL navigate to the lottery notifications view
4. THE System SHALL reuse the existing SpinWheel and WinnerAnnouncement components from the collector lottery feature
