# Requirements Document

## Introduction

This specification defines the requirements for transforming the Wujo app's Iqub management pages (Create Iqub, My Iqubs, and Iqub Detail) into premium FinTech experiences following the Wujo UI/UX design guidelines. The transformation will apply the established brand identity (dark green, medium aquamarine, white smoke color palette) and implement mobile-first design principles while integrating with the fully functional backend APIs.

## Glossary

- **System**: The Wujo mobile application frontend
- **Collector**: A user with the role of "collector" who creates and manages Iqubs
- **Member**: A user with the role of "member" who joins and participates in Iqubs
- **Iqub**: A traditional Ethiopian savings group (ROSCA - Rotating Savings and Credit Association)
- **Lottery**: The process of randomly selecting which member receives the pooled funds in a given round
- **Round**: A single cycle of contributions and payout in an Iqub
- **E.164 Format**: International phone number format (+251XXXXXXXXX for Ethiopia)
- **ETB**: Ethiopian Birr currency
- **Wujo Brand Identity**: Dark green (#014023), medium aquamarine (#5FD9AC), white smoke (#F2F2F2)
- **Thumb Zone**: The bottom 30% of the mobile screen easily reachable by thumb
- **Multi-step Wizard**: A form broken into sequential steps with progress indication
- **Premium Card**: A dark green card with white text, rounded corners, and shadow effects
- **Backend API**: The fully functional Node.js/Express/MongoDB API running on localhost:3000

## Requirements

### Requirement 1: Create Iqub Page Transformation

**User Story:** As a collector, I want to create a new Iqub through an intuitive multi-step wizard with premium UI, so that I can easily set up savings groups with clear visual feedback and validation.

#### Acceptance Criteria

1. WHEN the collector navigates to the Create Iqub page, THE System SHALL display a hero section with dark green gradient background, aquamarine icon, and white text title
2. WHEN the collector views the form, THE System SHALL present a multi-step wizard with three distinct steps: Basic Information, Financial Details, and Review & Confirm
3. WHEN the collector is on any step, THE System SHALL display a progress bar showing current step position with aquamarine fill color
4. WHEN the collector enters the Iqub name in Step 1, THE System SHALL validate the name is not empty and display real-time validation feedback
5. WHEN the collector enters the number of members in Step 1, THE System SHALL validate the count is between 2 and 50 members and display an estimated duration calculation
6. WHEN the collector selects a saving pattern in Step 2, THE System SHALL display three clickable pattern cards (Weekly, Bi-weekly, Monthly) with aquamarine active state
7. WHEN the collector enters saving amount in Step 2, THE System SHALL format the input as Ethiopian Birr currency with comma separators
8. WHEN the collector enters credit amount in Step 2, THE System SHALL auto-suggest a value equal to saving amount multiplied by members count
9. WHEN the collector reaches Step 3, THE System SHALL display a comprehensive summary card showing all entered information with formatted currency values
10. WHEN the collector reaches Step 3, THE System SHALL display calculated values including total per round, estimated duration, and total Iqub value
11. WHEN the collector attempts to proceed to the next step, THE System SHALL validate all required fields for the current step before allowing navigation
12. WHEN the collector clicks Previous button, THE System SHALL navigate to the previous step without losing entered data
13. WHEN the collector submits the form in Step 3, THE System SHALL send a POST request to /api/createIqub with all form data
14. WHEN the API returns success, THE System SHALL display a success animation with checkmark icon and navigate to My Iqubs page after 2.5 seconds
15. WHEN the API returns an error, THE System SHALL display an alert dialog with the error message and allow the collector to retry

### Requirement 2: My Iqubs Page Enhancement

**User Story:** As a collector, I want to view all my created Iqubs in a premium card-based layout with search and filter capabilities, so that I can quickly find and access specific Iqubs.

#### Acceptance Criteria

1. WHEN the collector navigates to My Iqubs page, THE System SHALL display a hero section with dark green gradient background and page title
2. WHEN the page loads, THE System SHALL fetch Iqubs data from GET /api/myIqubs endpoint
3. WHILE the data is loading, THE System SHALL display skeleton loaders with shimmer effect in card layout
4. WHEN the data loads successfully, THE System SHALL display each Iqub as a premium dark green card with white text
5. WHEN displaying each Iqub card, THE System SHALL show Iqub name, total collected amount in ETB, hosted lottery count, and completion progress ring
6. WHEN the collector views the progress ring, THE System SHALL display it in aquamarine color with percentage of completed rounds
7. WHEN the collector taps on an Iqub card, THE System SHALL navigate to the Iqub Detail page with slide-in animation
8. WHEN the collector uses the search field, THE System SHALL filter Iqubs by name in real-time
9. WHEN the collector selects a filter option, THE System SHALL filter Iqubs by status (active, pending, completed)
10. WHEN the collector pulls down on the list, THE System SHALL refresh the Iqubs data from the API
11. WHEN no Iqubs exist, THE System SHALL display an empty state with illustration, encouraging message, and Create Iqub button
12. WHEN the API returns an error, THE System SHALL display an error message with retry button
13. WHEN the collector taps the floating action button, THE System SHALL navigate to Create Iqub page
14. WHEN displaying currency amounts, THE System SHALL format all values with comma separators and ETB suffix
15. WHEN the collector scrolls the list, THE System SHALL maintain smooth 60fps performance

### Requirement 3: Iqub Detail Page Enhancement

**User Story:** As a collector, I want to view comprehensive Iqub details with tabbed interface and member management capabilities, so that I can effectively manage my Iqub and its members.

#### Acceptance Criteria

1. WHEN the collector navigates to Iqub Detail page, THE System SHALL fetch detailed Iqub data from GET /api/iqubs/:iqubId endpoint
2. WHEN the page loads, THE System SHALL display a premium hero card with dark green background showing Iqub name and key statistics
3. WHEN displaying statistics, THE System SHALL show total Iqub amount, collected amount, and completion percentage with aquamarine progress ring
4. WHEN the collector views the page, THE System SHALL display a tabbed interface with four tabs: Overview, Members, Payments, and Lottery
5. WHEN the collector taps a tab, THE System SHALL switch content with smooth transition animation and highlight active tab in aquamarine
6. WHEN viewing the Members tab, THE System SHALL display a list of all members with name, phone number, and contribution status
7. WHEN the collector taps Add Member button, THE System SHALL open a bottom sheet modal with Ethiopian phone validation
8. WHEN the collector enters a phone number in the modal, THE System SHALL validate E.164 format (+251XXXXXXXXX) in real-time
9. WHEN the collector submits the Add Member form, THE System SHALL send POST request to /api/iqubs/:iqubId/members with phone number
10. WHEN a member is added successfully, THE System SHALL close the modal, refresh the members list, and display success toast
11. WHEN the collector taps Initiate Lottery button, THE System SHALL send POST request to /api/iqubs/:iqubId/lottery/initiate
12. WHEN lottery is initiated successfully, THE System SHALL display success animation and update the Iqub status
13. WHEN the collector selects a date in the date picker, THE System SHALL enable the Set Next Lottery Date button
14. WHEN the collector sets next lottery date, THE System SHALL send PUT request to /api/iqubs/:iqubId/next-lottery-date with ISO date
15. WHEN any action fails, THE System SHALL display an error toast with specific error message from API response

### Requirement 4: Mobile-First Design Implementation

**User Story:** As a mobile user, I want all Iqub management pages optimized for one-handed use with thumb-zone placement, so that I can comfortably interact with the app.

#### Acceptance Criteria

1. WHEN any primary action button is displayed, THE System SHALL position it in the bottom 30% of the screen within thumb-zone reach
2. WHEN displaying touch targets, THE System SHALL ensure minimum size of 48x48 pixels for all interactive elements
3. WHEN the user taps any button, THE System SHALL provide immediate visual feedback with scale animation
4. WHEN displaying forms, THE System SHALL use white smoke (#F2F2F2) background for input fields with 16px border radius
5. WHEN an input field receives focus, THE System SHALL apply aquamarine border, white background, and subtle shadow with smooth transition
6. WHEN displaying text, THE System SHALL use the typography scale: 36px hero titles, 24px section headers, 16px body text
7. WHEN spacing elements, THE System SHALL use 8px base unit with multiples (8px, 16px, 24px, 32px)
8. WHEN animating transitions, THE System SHALL use cubic-bezier(0.4, 0, 0.2, 1) timing function with 300ms duration
9. WHEN the user scrolls any page, THE System SHALL maintain smooth 60fps performance without jank
10. WHEN displaying on different screen sizes, THE System SHALL adapt layout responsively while maintaining design integrity

### Requirement 5: Ethiopian Currency and Phone Formatting

**User Story:** As an Ethiopian user, I want all currency displayed in ETB with proper formatting and phone numbers validated in Ethiopian format, so that the app feels localized and familiar.

#### Acceptance Criteria

1. WHEN displaying any currency amount, THE System SHALL format it with comma separators (e.g., 10,000 ETB)
2. WHEN the user enters a currency amount, THE System SHALL automatically format the input with commas as they type
3. WHEN parsing currency input, THE System SHALL remove all non-numeric characters before sending to API
4. WHEN displaying phone number input, THE System SHALL show country code +251 in a dark green prefix badge
5. WHEN the user enters a phone number, THE System SHALL accept formats: 0911110000, 911110000, or +251911110000
6. WHEN validating phone numbers, THE System SHALL convert all formats to E.164 (+251911110000) before API submission
7. WHEN the phone number is valid, THE System SHALL display a green checkmark icon and formatted preview in aquamarine
8. WHEN the phone number is invalid, THE System SHALL display red border and helpful error message
9. WHEN displaying member phone numbers, THE System SHALL show them in E.164 format
10. WHEN calculating totals, THE System SHALL ensure precision by using integer arithmetic (amounts in cents)

### Requirement 6: Loading States and Error Handling

**User Story:** As a user, I want clear feedback during loading and helpful error messages when things go wrong, so that I understand what's happening and how to proceed.

#### Acceptance Criteria

1. WHEN any API request is in progress, THE System SHALL display a loading indicator with aquamarine spinner
2. WHEN loading list data, THE System SHALL display skeleton loaders matching the final content layout
3. WHEN a form is submitting, THE System SHALL disable the submit button and show "Creating..." or "Adding..." text
4. WHEN an API request succeeds, THE System SHALL display a success toast with aquamarine background for 3 seconds
5. WHEN an API request fails with validation errors, THE System SHALL display field-specific error messages below each field
6. WHEN an API request fails with server error, THE System SHALL display an alert dialog with error message and retry option
7. WHEN network connection is lost, THE System SHALL display a warning toast and allow offline viewing of cached data
8. WHEN the user retries a failed action, THE System SHALL clear previous error messages before attempting
9. WHEN displaying error messages, THE System SHALL use friendly, actionable language (e.g., "Please enter a valid phone number")
10. WHEN multiple errors occur, THE System SHALL prioritize showing the most critical error first

### Requirement 7: Animation and Micro-interactions

**User Story:** As a user, I want smooth animations and delightful micro-interactions throughout the Iqub management pages, so that the app feels premium and responsive.

#### Acceptance Criteria

1. WHEN a page loads, THE System SHALL animate content with fadeInDown for hero sections and slideUp for cards
2. WHEN the user navigates between wizard steps, THE System SHALL animate content with slideIn effect (300ms duration)
3. WHEN the progress bar updates, THE System SHALL animate the width change with smooth transition
4. WHEN a card is tapped, THE System SHALL apply scale(0.98) transform for 100ms before navigation
5. WHEN a button is pressed, THE System SHALL apply opacity 0.9 and scale(0.98) for active state
6. WHEN the success animation plays, THE System SHALL scale in the checkmark icon with bounce effect
7. WHEN a modal opens, THE System SHALL slide up from bottom with deceleration curve
8. WHEN a modal closes, THE System SHALL slide down with acceleration curve
9. WHEN the user pulls to refresh, THE System SHALL display aquamarine spinner with smooth rotation
10. WHEN hovering over interactive elements (desktop), THE System SHALL apply subtle scale and shadow effects

### Requirement 8: Accessibility and Performance

**User Story:** As a user with accessibility needs, I want the Iqub management pages to be accessible and performant, so that I can use the app effectively regardless of my abilities.

#### Acceptance Criteria

1. WHEN displaying text on dark green background, THE System SHALL ensure color contrast ratio of at least 12.6:1 (AAA level)
2. WHEN displaying aquamarine on dark green, THE System SHALL ensure color contrast ratio of at least 4.8:1 (AA level)
3. WHEN an icon-only button is rendered, THE System SHALL include aria-label attribute for screen readers
4. WHEN form validation fails, THE System SHALL announce errors to screen readers
5. WHEN using semantic HTML, THE System SHALL use proper elements (button, input, label) instead of divs
6. WHEN images are displayed, THE System SHALL include descriptive alt text
7. WHEN the page loads, THE System SHALL achieve First Contentful Paint within 1.5 seconds
8. WHEN animating elements, THE System SHALL use GPU-accelerated properties (transform, opacity)
9. WHEN rendering lists, THE System SHALL implement virtual scrolling for lists exceeding 50 items
10. WHEN bundling code, THE System SHALL lazy load routes and code-split large components to minimize initial bundle size
