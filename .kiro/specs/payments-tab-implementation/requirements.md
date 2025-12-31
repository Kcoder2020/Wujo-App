# Requirements Document

## Introduction

This specification defines the requirements for implementing the Payments tab in the IqubDetailPage component. The feature will enable collectors to track member payment status for the current credit round, view completion progress, and initiate lotteries when all payments are verified. The implementation leverages two existing backend APIs that provide detailed payment tracking data.

## Glossary

- **System**: The Wujo mobile application IqubDetailPage Payments tab
- **Credit Round**: A cycle of saving rounds after which a lottery is conducted to distribute collected funds
- **Saving Round**: An individual payment period within a credit round
- **Payment Status**: The verification state of a member's payment (not_started, pending, verified, failed)
- **Completion Percentage**: The percentage of verified payments across all members and saving rounds in the current credit round
- **Effective Members**: Total member count including full contributors and half contributors (2 half = 1 full)
- **Lottery Initiation**: The action of starting the lottery process when all payments are verified
- **Wujo Brand Colors**: Dark Green (#014023), Medium Aquamarine (#5FD9AC), White Smoke (#F2F2F2)

## Requirements

### Requirement 1: Credit Round Status Data Fetching

**User Story:** As a collector, I want the system to automatically fetch current credit round payment status when I open the Payments tab, so that I can see up-to-date payment information.

#### Acceptance Criteria

1. WHEN the Payments tab is activated, THE System SHALL dispatch fetchCreditRoundStatus action with the current iqubId
2. WHEN the fetch action is dispatched, THE System SHALL set loading state to true
3. WHEN the API request is in progress, THE System SHALL display a loading indicator
4. WHEN the API returns success, THE System SHALL store the credit round data in Vuex state
5. WHEN the API returns success, THE System SHALL set loading state to false
6. WHEN the API returns an error, THE System SHALL store the error message in Vuex state
7. WHEN an error occurs, THE System SHALL display an error message to the user
8. WHEN an error occurs, THE System SHALL provide a retry button
9. WHEN the retry button is clicked, THE System SHALL re-dispatch the fetch action
10. WHEN the component unmounts, THE System SHALL clear the credit round status data from state

### Requirement 2: Header Card with Progress Visualization

**User Story:** As a collector, I want to see a premium header card showing the current credit round number, saving round range, and completion progress, so that I can quickly understand the overall status.

#### Acceptance Criteria

1. WHEN credit round data is loaded, THE System SHALL display a premium header card with dark green gradient background
2. WHEN the header card is rendered, THE System SHALL apply 24px padding, 20px border radius, and shadow (0 8px 32px rgba(1, 64, 35, 0.2))
3. WHEN the header is displayed, THE System SHALL show "Credit Round X of Y" in 24px SemiBold white text
4. WHEN the header is displayed, THE System SHALL show "Saving Rounds X-Y" in 16px Medium white (80% opacity) text
5. WHEN the progress ring is rendered, THE System SHALL display it at 120px diameter with 8px stroke width
6. WHEN the progress ring is displayed, THE System SHALL use aquamarine color for the progress arc
7. WHEN the progress ring is displayed, THE System SHALL show completion percentage in the center (32px Bold aquamarine)
8. WHEN the progress ring is displayed, THE System SHALL show "Complete" label below percentage (14px Medium white 80% opacity)
9. WHEN completion is 100%, THE System SHALL display a checkmark icon next to the percentage
10. WHEN the header card appears, THE System SHALL animate with slideUp effect (300ms cubic-bezier)

### Requirement 3: Member Payment Grid Display

**User Story:** As a collector, I want to see a grid of member cards showing each member's payment status across saving rounds, so that I can track individual payment progress.

#### Acceptance Criteria

1. WHEN members data is loaded, THE System SHALL display member cards in a vertical list layout
2. WHEN a member card is rendered, THE System SHALL apply white background, 16px border radius, and shadow (0 2px 8px rgba(0, 0, 0, 0.08))
3. WHEN a member card is displayed, THE System SHALL show member name in 16px SemiBold dark green text
4. WHEN a member card is displayed, THE System SHALL show member phone in 14px Regular gray text
5. WHEN a member card is displayed, THE System SHALL show contribution type badge ("Full" or "Half") with appropriate styling
6. WHEN contribution type is "full", THE System SHALL display badge with aquamarine background (10% opacity) and aquamarine text
7. WHEN contribution type is "half", THE System SHALL display badge with aquamarine background (5% opacity) and aquamarine text (70% opacity)
8. WHEN saving rounds are displayed, THE System SHALL show them in a horizontal flex layout with 8px gap
9. WHEN a saving round is displayed, THE System SHALL show round number and status indicator
10. WHEN a saving round status is "verified", THE System SHALL display green checkmark icon
11. WHEN a saving round status is "pending", THE System SHALL display yellow clock icon
12. WHEN a saving round status is "not_started", THE System SHALL display gray circle icon
13. WHEN a saving round status is "failed", THE System SHALL display red X icon
14. WHEN a member card is displayed, THE System SHALL show completion count "X/Y complete" in 14px Medium gray
15. WHEN all member cards appear, THE System SHALL animate with staggered fadeIn effect (each card 100ms delay)

### Requirement 4: Status Legend Display

**User Story:** As a collector, I want to see a legend explaining the payment status indicators, so that I can understand what each icon means.

#### Acceptance Criteria

1. WHEN the Payments tab is displayed, THE System SHALL show a status legend below the header card
2. WHEN the legend is rendered, THE System SHALL apply white background, 16px border radius, and 16px padding
3. WHEN the legend is displayed, THE System SHALL show "Status Legend" title in 14px SemiBold dark green
4. WHEN the legend items are displayed, THE System SHALL show them in a horizontal flex layout with wrap
5. WHEN a legend item is rendered, THE System SHALL display status icon and label with 12px gap
6. WHEN "Verified" status is shown, THE System SHALL display green checkmark icon and "Verified" text in 12px Medium
7. WHEN "Pending" status is shown, THE System SHALL display yellow clock icon and "Pending" text in 12px Medium
8. WHEN "Not Paid" status is shown, THE System SHALL display gray circle icon and "Not Paid" text in 12px Medium
9. WHEN "Failed" status is shown, THE System SHALL display red X icon and "Failed" text in 12px Medium
10. WHEN the legend appears, THE System SHALL animate with fadeIn effect (200ms)

### Requirement 5: Initiate Lottery Button

**User Story:** As a collector, I want a sticky action button to initiate the lottery when all payments are verified, so that I can proceed to the next credit round.

#### Acceptance Criteria

1. WHEN the Payments tab is displayed, THE System SHALL show a sticky button at the bottom of the screen
2. WHEN the button is rendered, THE System SHALL apply aquamarine background, 56px height, and 16px border radius
3. WHEN the button is displayed, THE System SHALL show "Initiate Lottery" text in 18px Bold dark green
4. WHEN the button is displayed, THE System SHALL show trophy icon (24px) before the text
5. WHEN completion percentage is 100%, THE System SHALL enable the button
6. WHEN completion percentage is less than 100%, THE System SHALL disable the button
7. WHEN the button is disabled, THE System SHALL apply 50% opacity and gray background
8. WHEN the button is disabled, THE System SHALL show tooltip "All payments must be verified first"
9. WHEN the button is clicked, THE System SHALL dispatch initiateLottery action
10. WHEN lottery initiation is in progress, THE System SHALL show loading spinner and "Initiating..." text
11. WHEN lottery initiation succeeds, THE System SHALL show success toast and navigate to lottery tab
12. WHEN lottery initiation fails, THE System SHALL show error toast with retry option
13. WHEN the button is in the bottom 30% of the screen, THE System SHALL ensure it's in the thumb zone
14. WHEN the button appears, THE System SHALL animate with slideUp effect (300ms)
15. WHEN the button is pressed, THE System SHALL apply scale(0.98) transform

### Requirement 6: Manual Refresh Functionality

**User Story:** As a collector, I want to manually refresh the payment status data, so that I can see the latest updates without leaving the tab.

#### Acceptance Criteria

1. WHEN the Payments tab is displayed, THE System SHALL show a refresh button in the top right corner
2. WHEN the refresh button is rendered, THE System SHALL display a circular refresh icon (24px aquamarine)
3. WHEN the refresh button is clicked, THE System SHALL dispatch fetchCreditRoundStatus action
4. WHEN refresh is in progress, THE System SHALL rotate the refresh icon 360 degrees (500ms)
5. WHEN refresh succeeds, THE System SHALL show brief success feedback (green checkmark animation)
6. WHEN refresh fails, THE System SHALL show error toast
7. WHEN refresh is in progress, THE System SHALL disable the refresh button
8. WHEN the refresh button is pressed, THE System SHALL apply scale(0.95) transform
9. WHEN the refresh button is rendered, THE System SHALL include aria-label "Refresh payment status"
10. WHEN the refresh button is displayed, THE System SHALL ensure 48x48px touch target

### Requirement 7: Empty State Display

**User Story:** As a collector, I want to see a helpful empty state when there are no credit rounds yet, so that I understand why the Payments tab is empty.

#### Acceptance Criteria

1. WHEN no credit round data is available, THE System SHALL display an empty state
2. WHEN the empty state is rendered, THE System SHALL show a document icon (80px aquamarine 30% opacity)
3. WHEN the empty state is displayed, THE System SHALL show "No Credit Rounds Yet" title in 20px SemiBold dark green
4. WHEN the empty state is displayed, THE System SHALL show descriptive text "Credit rounds will appear here once members start making payments" in 14px Regular gray
5. WHEN the empty state is displayed, THE System SHALL center all content vertically and horizontally
6. WHEN the empty state appears, THE System SHALL animate with fadeIn effect (300ms)
7. WHEN the empty state is displayed, THE System SHALL apply 40px padding
8. WHEN the empty state is rendered, THE System SHALL include aria-label "No credit rounds available"
9. WHEN the empty state is displayed, THE System SHALL show a "Go to Members" button to add members
10. WHEN the "Go to Members" button is clicked, THE System SHALL switch to the Members tab

### Requirement 8: Loading State Display

**User Story:** As a collector, I want to see a loading indicator while payment data is being fetched, so that I know the system is working.

#### Acceptance Criteria

1. WHEN credit round data is being fetched, THE System SHALL display a loading indicator
2. WHEN the loading indicator is rendered, THE System SHALL show a spinner (aquamarine color)
3. WHEN the loading indicator is displayed, THE System SHALL show "Loading payment status..." text in 16px Medium gray
4. WHEN the loading indicator is displayed, THE System SHALL center it vertically and horizontally
5. WHEN the loading indicator is rendered, THE System SHALL apply shimmer effect to skeleton cards
6. WHEN skeleton cards are displayed, THE System SHALL show 3 placeholder member cards
7. WHEN skeleton cards are rendered, THE System SHALL apply gray background (10% opacity) and 16px border radius
8. WHEN skeleton cards are displayed, THE System SHALL animate with pulse effect (1.5s infinite)
9. WHEN the loading indicator appears, THE System SHALL animate with fadeIn effect (200ms)
10. WHEN data finishes loading, THE System SHALL fade out loading indicator (200ms) before showing content

### Requirement 9: Error State Display

**User Story:** As a collector, I want to see a clear error message when payment data fails to load, so that I can understand what went wrong and retry.

#### Acceptance Criteria

1. WHEN credit round data fetch fails, THE System SHALL display an error state
2. WHEN the error state is rendered, THE System SHALL show an alert icon (64px red)
3. WHEN the error state is displayed, THE System SHALL show "Failed to Load Payment Status" title in 20px SemiBold dark green
4. WHEN the error state is displayed, THE System SHALL show the error message in 14px Regular gray
5. WHEN the error state is displayed, THE System SHALL show a "Retry" button with aquamarine background
6. WHEN the "Retry" button is clicked, THE System SHALL dispatch fetchCreditRoundStatus action
7. WHEN the error state is displayed, THE System SHALL center all content vertically and horizontally
8. WHEN the error state appears, THE System SHALL animate with fadeIn effect (300ms)
9. WHEN the error state is rendered, THE System SHALL include aria-live="polite" for screen reader announcement
10. WHEN the error state is displayed, THE System SHALL apply 40px padding

### Requirement 10: Responsive Layout

**User Story:** As a mobile user, I want the Payments tab to adapt to different screen sizes, so that the interface remains usable on all devices.

#### Acceptance Criteria

1. WHEN the screen width is less than 768px, THE System SHALL display member cards in a single column
2. WHEN the screen width is 768px or more, THE System SHALL display member cards in a single column (mobile-first)
3. WHEN the header card is displayed, THE System SHALL use full width with 16px horizontal padding
4. WHEN the progress ring is displayed, THE System SHALL maintain 120px diameter on all screen sizes
5. WHEN member cards are rendered, THE System SHALL ensure minimum touch target of 48x48px for interactive elements
6. WHEN the sticky button is displayed, THE System SHALL maintain 56px height on all screen sizes
7. WHEN the status legend is displayed, THE System SHALL wrap legend items if screen width is insufficient
8. WHEN saving round indicators are displayed, THE System SHALL wrap to next line if they exceed card width
9. WHEN the page is viewed on tablet or desktop, THE System SHALL maintain mobile-first design without expanding unnecessarily
10. WHEN the page is scrolled, THE System SHALL keep the sticky button fixed at the bottom

### Requirement 11: Accessibility Enhancements

**User Story:** As a user with accessibility needs, I want the Payments tab to be fully accessible, so that I can use the interface effectively with assistive technologies.

#### Acceptance Criteria

1. WHEN the header card is rendered, THE System SHALL include aria-label "Current credit round status"
2. WHEN the progress ring is displayed, THE System SHALL include aria-label "Completion progress: X percent"
3. WHEN member cards are rendered, THE System SHALL include aria-label "Member: [name], [X] of [Y] payments complete"
4. WHEN status icons are displayed, THE System SHALL include aria-label describing the status
5. WHEN the initiate lottery button is rendered, THE System SHALL include aria-label "Initiate lottery for credit round X"
6. WHEN the button is disabled, THE System SHALL include aria-disabled="true"
7. WHEN the refresh button is rendered, THE System SHALL include aria-label "Refresh payment status"
8. WHEN error messages are displayed, THE System SHALL announce them to screen readers using aria-live="polite"
9. WHEN interactive elements receive focus, THE System SHALL ensure visible focus indicator with aquamarine border
10. WHEN color is used to convey information, THE System SHALL also use icons or text labels

### Requirement 12: Animation and Transitions

**User Story:** As a user, I want smooth animations when the Payments tab loads and updates, so that the interface feels fluid and responsive.

#### Acceptance Criteria

1. WHEN the header card appears, THE System SHALL animate with slideUp from bottom (300ms cubic-bezier(0.4, 0, 0.2, 1))
2. WHEN member cards appear, THE System SHALL animate with staggered fadeIn (each card 100ms delay)
3. WHEN the status legend appears, THE System SHALL animate with fadeIn (200ms)
4. WHEN the sticky button appears, THE System SHALL animate with slideUp (300ms)
5. WHEN the refresh button is clicked, THE System SHALL rotate 360 degrees (500ms)
6. WHEN the button is pressed, THE System SHALL apply scale(0.98) transform (100ms)
7. WHEN loading state transitions to content, THE System SHALL fade out loading (200ms) then fade in content (300ms)
8. WHEN error state appears, THE System SHALL animate with fadeIn (300ms)
9. WHEN empty state appears, THE System SHALL animate with fadeIn (300ms)
10. WHEN data updates, THE System SHALL apply smooth transition to progress ring percentage (500ms)

