# Requirements Document

## Introduction

This specification defines the requirements for updating the Member Iqub Detail Page to support the new credit round system. The backend API has been updated to provide credit round information, and the frontend must be updated to display this information accurately to members.

## Glossary

- **Credit_Round**: A grouping of multiple saving rounds. When all members complete a credit round, a lottery is held.
- **Saving_Round**: An individual payment period where members contribute their saving amount.
- **Effective_Members**: Calculated value: members_count + (half_contributors / 2)
- **Member_Progress**: The member's completion status within the current credit round
- **System**: The Member Iqub Detail Page and associated components
- **API_Response**: The response from GET /api/member/iqub/:iqubId endpoint

## Requirements

### Requirement 1: Display Current Credit Round Information

**User Story:** As a member, I want to see which credit round I'm currently in, so that I understand my progress within the Iqub cycle.

#### Acceptance Criteria

1. WHEN the member views their Iqub details, THE System SHALL display the current credit round number
2. WHEN the member views their Iqub details, THE System SHALL display the total number of credit rounds
3. WHEN the member views their Iqub details, THE System SHALL display the saving round range for the current credit round (e.g., "Rounds 1-7")
4. THE System SHALL format the credit round display as "Credit Round X of Y"
5. THE System SHALL display the number of saving rounds per credit round

### Requirement 2: Display Member Progress Within Credit Round

**User Story:** As a member, I want to see my progress within the current credit round, so that I know how many more payments I need to make before the next lottery.

#### Acceptance Criteria

1. WHEN the member views their Iqub details, THE System SHALL display the number of completed saving rounds in the current credit round
2. WHEN the member views their Iqub details, THE System SHALL display the number of required saving rounds in the current credit round
3. THE System SHALL display a progress indicator showing completion within the current credit round
4. WHEN the member completes all saving rounds in a credit round, THE System SHALL indicate the credit round is complete
5. THE System SHALL format the progress display as "X of Y rounds completed"

### Requirement 3: Display Correct Total Rounds

**User Story:** As a member, I want to see the correct total number of saving rounds in the entire Iqub, so that I understand the full commitment.

#### Acceptance Criteria

1. WHEN the API returns stats.total_rounds, THE System SHALL display this value as the total saving rounds
2. THE System SHALL calculate total rounds as: total_credit_rounds × saving_rounds_per_credit_round
3. WHEN displaying overall progress, THE System SHALL use the correct total_rounds value (not effective_members)
4. THE System SHALL display total rounds in the format "X of Y rounds"

### Requirement 4: Display Correct Completion Percentage

**User Story:** As a member, I want to see my accurate completion percentage across all saving rounds, so that I can track my overall progress.

#### Acceptance Criteria

1. WHEN the API returns stats.completion_percentage, THE System SHALL display this value
2. THE System SHALL calculate completion percentage as: (completed_saving_rounds / total_saving_rounds) × 100
3. THE System SHALL display the percentage with appropriate visual indicators (progress bars, rings, etc.)
4. THE System SHALL round the percentage to whole numbers for display
5. WHEN the member has completed 0 rounds, THE System SHALL display 0%

### Requirement 5: Update TypeScript Interfaces

**User Story:** As a developer, I want updated TypeScript interfaces that match the new API response, so that I have type safety and autocomplete.

#### Acceptance Criteria

1. THE System SHALL add a current_credit_round interface to MemberIqubDetails
2. THE current_credit_round interface SHALL include credit_round_number field
3. THE current_credit_round interface SHALL include saving_round_range object with start and end fields
4. THE current_credit_round interface SHALL include total_credit_rounds field
5. THE current_credit_round interface SHALL include saving_rounds_per_credit_round field
6. THE current_credit_round interface SHALL include member_progress object
7. THE member_progress object SHALL include completed_saving_rounds field
8. THE member_progress object SHALL include required_saving_rounds field
9. THE member_progress object SHALL include is_complete boolean field
10. THE iqub interface SHALL include half_contributors field
11. THE iqub interface SHALL include effective_members field
12. THE member interface SHALL include contribution_type field with values "full" or "half"

### Requirement 6: Update Progress Ring Component

**User Story:** As a member, I want the progress ring to show my overall Iqub progress accurately, so that I can quickly see how far I've come.

#### Acceptance Criteria

1. WHEN displaying the progress ring, THE System SHALL use stats.completion_percentage from the API
2. WHEN displaying current amount, THE System SHALL use stats.total_saved
3. WHEN displaying target amount, THE System SHALL calculate as: saving_amount × total_rounds
4. THE System SHALL update the progress ring when new payment data is received
5. THE System SHALL animate the progress ring transition smoothly

### Requirement 7: Display Credit Round Progress Card

**User Story:** As a member, I want a dedicated card showing my current credit round progress, so that I can focus on my immediate payment goals.

#### Acceptance Criteria

1. THE System SHALL display a credit round progress card in the stats section
2. THE card SHALL show the current credit round number and total credit rounds
3. THE card SHALL show the saving round range for the current credit round
4. THE card SHALL show a progress bar for the current credit round
5. THE card SHALL show completed vs required saving rounds
6. WHEN the credit round is complete, THE card SHALL display a completion indicator
7. THE card SHALL use Wujo design colors (dark green #014023, aquamarine #5FD9AC)

### Requirement 8: Update Payment Round Generation Logic

**User Story:** As a member, I want to see all my payment rounds correctly generated based on the total saving rounds, so that I can plan my payments.

#### Acceptance Criteria

1. WHEN generating payment rounds, THE System SHALL use stats.total_rounds from the API
2. THE System SHALL generate rounds from 1 to stats.total_rounds
3. WHEN a round exists in payment_history, THE System SHALL use the history data
4. WHEN a round does not exist in payment_history, THE System SHALL generate a placeholder round
5. THE System SHALL mark rounds less than current_round as "due" if not paid
6. THE System SHALL mark rounds equal to current_round as "due"
7. THE System SHALL mark rounds greater than current_round as "upcoming"

### Requirement 9: Handle Half Contributors Display

**User Story:** As a member, I want to see if I'm a full or half contributor, so that I understand my payment obligations.

#### Acceptance Criteria

1. WHEN the member is a half contributor, THE System SHALL display "Half Contributor" badge
2. WHEN the member is a full contributor, THE System SHALL display "Full Contributor" badge
3. THE System SHALL use member.contribution_type from the API response
4. THE badge SHALL use appropriate styling to differentiate contribution types
5. THE System SHALL display the correct saving amount based on contribution type

### Requirement 10: Maintain Backward Compatibility

**User Story:** As a developer, I want the system to handle both old and new API responses gracefully, so that the app doesn't break during deployment.

#### Acceptance Criteria

1. WHEN current_credit_round is not present in API response, THE System SHALL use fallback calculations
2. WHEN stats.total_rounds is missing, THE System SHALL calculate from available data
3. THE System SHALL log warnings when using fallback values
4. THE System SHALL not crash when optional fields are missing
5. THE System SHALL provide sensible defaults for missing credit round data

### Requirement 11: Update Store Module

**User Story:** As a developer, I want the Vuex store to properly handle the new API response structure, so that components receive correct data.

#### Acceptance Criteria

1. THE store SHALL update the MemberIqubDetails state with current_credit_round data
2. THE store SHALL preserve all existing fields in the state
3. THE store SHALL handle API errors gracefully
4. THE store SHALL provide getters for credit round information
5. THE store SHALL maintain the existing fetchMemberIqubDetails action signature

### Requirement 12: Responsive Design

**User Story:** As a member using a mobile device, I want the credit round information to display properly on my screen, so that I can view all details comfortably.

#### Acceptance Criteria

1. THE System SHALL display credit round cards in a responsive grid layout
2. WHEN the screen width is less than 768px, THE System SHALL stack cards vertically
3. THE System SHALL ensure text remains readable at all screen sizes
4. THE System SHALL ensure progress indicators scale appropriately
5. THE System SHALL maintain Wujo design guidelines on all screen sizes

### Requirement 13: Loading and Error States

**User Story:** As a member, I want to see appropriate loading and error states, so that I understand what's happening when data is being fetched.

#### Acceptance Criteria

1. WHEN fetching Iqub details, THE System SHALL display skeleton loaders for credit round cards
2. WHEN an API error occurs, THE System SHALL display an error message
3. WHEN retrying after an error, THE System SHALL show a loading indicator
4. THE System SHALL provide a retry button when errors occur
5. THE System SHALL clear error states when new data is successfully loaded

### Requirement 14: Pull-to-Refresh Support

**User Story:** As a member, I want to pull down to refresh my Iqub details, so that I can see the latest payment status.

#### Acceptance Criteria

1. WHEN the member pulls down on the page, THE System SHALL trigger a refresh
2. THE System SHALL fetch fresh data from the API during refresh
3. THE System SHALL update all displayed information with fresh data
4. THE System SHALL complete the refresh animation when data is loaded
5. THE System SHALL handle refresh errors gracefully

### Requirement 15: Accessibility

**User Story:** As a member using assistive technology, I want the credit round information to be accessible, so that I can understand my Iqub status.

#### Acceptance Criteria

1. THE System SHALL provide ARIA labels for progress indicators
2. THE System SHALL ensure sufficient color contrast for all text
3. THE System SHALL provide text alternatives for visual indicators
4. THE System SHALL support keyboard navigation for interactive elements
5. THE System SHALL announce dynamic content changes to screen readers
