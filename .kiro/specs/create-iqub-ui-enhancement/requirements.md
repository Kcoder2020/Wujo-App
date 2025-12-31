# Requirements Document

## Introduction

This specification defines the requirements for enhancing the CreateIqubPage custom pattern inputs and members section UI to align with Wujo's premium FinTech design principles. The enhancement focuses on elevating the visual design of custom pattern selection and member input components while simplifying the data structure by removing redundant fields.

## Glossary

- **System**: The Wujo mobile application CreateIqubPage component
- **Custom Pattern Input**: A UI component allowing users to specify custom day intervals for credit/saving patterns
- **Pattern Selection**: The interface for choosing between preset patterns (Daily, Weekly, Monthly) or custom intervals
- **Half Contributors**: Members who contribute half the standard amount (2 half contributors = 1 full member)
- **Premium UI**: High-quality interface following Wujo brand guidelines with gradient backgrounds, shadows, and smooth animations
- **Wujo Brand Colors**: Dark Green (#014023), Medium Aquamarine (#5FD9AC), White Smoke (#F2F2F2)
- **Data Structure Simplification**: Removing redundant fields (credit_pattern_custom, saving_pattern_custom) and using existing fields to store all pattern values

## Requirements

### Requirement 1: Data Structure Simplification

**User Story:** As a developer, I want to simplify the form data structure by removing redundant custom pattern fields, so that the codebase is cleaner and the backend receives consistent data types.

#### Acceptance Criteria

1. WHEN the form data structure is defined, THE System SHALL NOT include credit_pattern_custom field
2. WHEN the form data structure is defined, THE System SHALL NOT include saving_pattern_custom field
3. WHEN a user selects Daily pattern, THE System SHALL store the value 1 in credit_pattern or saving_pattern field
4. WHEN a user selects Weekly pattern, THE System SHALL store the value 7 in credit_pattern or saving_pattern field
5. WHEN a user selects Monthly pattern, THE System SHALL store the value 30 in credit_pattern or saving_pattern field
6. WHEN a user selects Custom pattern and enters a number, THE System SHALL store that number directly in credit_pattern or saving_pattern field
7. WHEN the form is submitted, THE System SHALL send credit_pattern as a number representing days
8. WHEN the form is submitted, THE System SHALL send saving_pattern as a number representing days
9. WHEN tracking UI state for custom selection, THE System SHALL use credit_pattern_is_custom boolean flag
10. WHEN tracking UI state for custom selection, THE System SHALL use saving_pattern_is_custom boolean flag

### Requirement 2: Premium Custom Pattern Input UI

**User Story:** As a collector, I want a beautiful and intuitive custom pattern input interface, so that specifying custom day intervals feels premium and aligned with the Wujo brand.

#### Acceptance Criteria

1. WHEN the custom pattern is selected, THE System SHALL display a premium container with gradient background from aquamarine (8% opacity) to dark green (3% opacity)
2. WHEN the custom input container is shown, THE System SHALL apply a 2px solid aquamarine border with 20px border radius
3. WHEN the custom input container appears, THE System SHALL animate with slideIn effect (300ms cubic-bezier)
4. WHEN the custom input container is displayed, THE System SHALL include a box shadow (0 4px 16px rgba(95, 217, 172, 0.15))
5. WHEN the custom input header is rendered, THE System SHALL display a calendar icon in aquamarine color (24px) next to the title
6. WHEN the custom input header is rendered, THE System SHALL display "Custom Credit Pattern" or "Custom Saving Pattern" in 18px SemiBold dark green text
7. WHEN the back button is displayed, THE System SHALL position it in the top right corner as a 40x40px circular button with aquamarine color
8. WHEN the number input field is rendered, THE System SHALL display it in a white card with 16px border radius and 2px transparent border
9. WHEN the input field receives focus, THE System SHALL apply aquamarine border, elevated shadow (0 4px 16px rgba(95, 217, 172, 0.25)), and translateY(-2px) transform
10. WHEN the input field has an error, THE System SHALL apply red border color
11. WHEN the input label is displayed, THE System SHALL show "Days between payouts" or "Days between contributions" in 14px SemiBold dark green
12. WHEN the input has a value, THE System SHALL display a suffix "days" in 14px Medium gray color with left border separator
13. WHEN a valid number is entered, THE System SHALL display a preview message "Payouts every X days" or "Contributions every X days" in aquamarine background card
14. WHEN the preview message is shown, THE System SHALL include an information icon (16px aquamarine) and 14px Medium dark green text
15. WHEN validation fails, THE System SHALL display error message below the input in 12px red text

### Requirement 3: Premium Members Section UI

**User Story:** As a collector, I want an enhanced members input section with premium styling for full and half contributors, so that member management feels sophisticated and aligned with Wujo's design principles.

#### Acceptance Criteria

1. WHEN the members section is rendered, THE System SHALL display it in a container with gradient background from dark green (2% opacity) to aquamarine (5% opacity)
2. WHEN the members container is displayed, THE System SHALL apply 24px padding, 20px border radius, and 1px aquamarine border (20% opacity)
3. WHEN the section header is rendered, THE System SHALL display "Members" label and toggle in a flex layout with space-between alignment
4. WHEN the toggle is displayed, THE System SHALL render it in a white card with 12px border radius and shadow (0 2px 8px rgba(0, 0, 0, 0.08))
5. WHEN the toggle label is shown, THE System SHALL display "Include half contributors" in 14px Medium dark green text
6. WHEN the toggle is active, THE System SHALL apply aquamarine background color
7. WHEN the full contributors input is rendered, THE System SHALL display a people icon (20px aquamarine) next to "Full Contributors" title (16px SemiBold)
8. WHEN the full contributors input field is shown, THE System SHALL render it in a white card with 16px border radius and 2px transparent border
9. WHEN the full contributors input receives focus, THE System SHALL apply aquamarine border, elevated shadow, and translateY(-2px) transform
10. WHEN the half contributors section is enabled, THE System SHALL display it with a 3px left border in aquamarine (30% opacity) and 16px left padding
11. WHEN the half contributors header is rendered, THE System SHALL display a people-circle icon (20px aquamarine 70% opacity) and "Half Contributors" title
12. WHEN the half contributors header is shown, THE System SHALL include a "Must be even" badge with orange background (10% opacity), orange text, 8px padding, and 8px border radius
13. WHEN the half contributors input is rendered, THE System SHALL apply the same premium styling as full contributors with aquamarine (70% opacity) focus color
14. WHEN half contributors validation fails, THE System SHALL display helper text in orange background card (10% opacity) with orange text
15. WHEN effective members calculation is shown, THE System SHALL display it in a dark green premium card with white text and aquamarine accents

### Requirement 4: Effective Members Calculation Card

**User Story:** As a collector, I want to see the effective members calculation in a premium dark card, so that I can clearly understand the total member count including half contributors.

#### Acceptance Criteria

1. WHEN effective members are calculated, THE System SHALL display a premium card with dark green background and white text
2. WHEN the calculation card is rendered, THE System SHALL apply 24px padding, 20px border radius, and shadow (0 8px 32px rgba(1, 64, 35, 0.2))
3. WHEN the card header is displayed, THE System SHALL show a calculator icon (24px aquamarine) next to "Effective Members" title (18px SemiBold white)
4. WHEN the calculation display is rendered, THE System SHALL show it in a container with white background (10% opacity) and 12px border radius
5. WHEN the formula is displayed, THE System SHALL show numbers in 24px Bold aquamarine color
6. WHEN the formula labels are shown, THE System SHALL display "full" and "half" in 14px Medium white (80% opacity)
7. WHEN the operator is displayed, THE System SHALL show "+" in 20px Bold white with 4px horizontal margin
8. WHEN the equals sign is shown, THE System SHALL display "=" in 20px Bold white with 8px horizontal margin
9. WHEN the result is displayed, THE System SHALL show the number in 32px Bold aquamarine
10. WHEN the result label is shown, THE System SHALL display "effective" in 16px SemiBold white

### Requirement 5: Input Field Enhancements

**User Story:** As a collector, I want all input fields in the custom pattern and members sections to have consistent premium styling, so that the interface feels cohesive and high-quality.

#### Acceptance Criteria

1. WHEN any input field is rendered, THE System SHALL apply white background, 16px border radius, and 2px transparent border
2. WHEN any input field receives focus, THE System SHALL transition border color to aquamarine over 300ms cubic-bezier(0.4, 0, 0.2, 1)
3. WHEN any input field is focused, THE System SHALL apply box shadow (0 4px 16px rgba(95, 217, 172, 0.25))
4. WHEN any input field is focused, THE System SHALL apply translateY(-2px) transform
5. WHEN any input field has an error, THE System SHALL apply red border color and remove aquamarine styling
6. WHEN input labels are displayed, THE System SHALL use 14px SemiBold dark green text
7. WHEN input values are displayed, THE System SHALL use 18px SemiBold dark green text
8. WHEN input placeholders are shown, THE System SHALL use 18px Regular gray text
9. WHEN input suffixes are displayed, THE System SHALL show them in 14px Medium gray with left border separator
10. WHEN helper text is shown, THE System SHALL display it in 12px Medium with appropriate color (gray for info, orange for warnings, red for errors)

### Requirement 6: Animation and Transitions

**User Story:** As a user, I want smooth animations when switching between pattern selection and custom input, so that the interface feels fluid and responsive.

#### Acceptance Criteria

1. WHEN custom pattern is selected, THE System SHALL hide pattern cards with fadeOut animation (200ms)
2. WHEN custom input container appears, THE System SHALL animate with slideIn from top (300ms cubic-bezier(0.4, 0, 0.2, 1))
3. WHEN back button is clicked, THE System SHALL hide custom container with fadeOut (200ms)
4. WHEN pattern cards reappear, THE System SHALL animate with fadeIn (300ms)
5. WHEN half contributors toggle is activated, THE System SHALL slide in the half contributors section (300ms)
6. WHEN half contributors toggle is deactivated, THE System SHALL slide out the section (300ms)
7. WHEN effective members card appears, THE System SHALL animate with slideUp (300ms)
8. WHEN input fields receive focus, THE System SHALL transition all properties over 300ms
9. WHEN input fields lose focus, THE System SHALL transition back over 300ms
10. WHEN validation errors appear, THE System SHALL fade in error messages (200ms)

### Requirement 7: Responsive Layout

**User Story:** As a mobile user, I want the custom pattern and members sections to adapt to different screen sizes, so that the interface remains usable on all devices.

#### Acceptance Criteria

1. WHEN the screen width is less than 768px, THE System SHALL display pattern cards in 2x2 grid layout
2. WHEN the screen width is 768px or more, THE System SHALL maintain 2x2 grid layout for consistency
3. WHEN the custom input is displayed, THE System SHALL use full width with 24px horizontal padding
4. WHEN the members section is rendered, THE System SHALL stack full and half contributor inputs vertically
5. WHEN the effective members card is shown, THE System SHALL center the formula display
6. WHEN the calculation formula is displayed, THE System SHALL wrap elements if screen width is insufficient
7. WHEN input fields are rendered, THE System SHALL ensure minimum touch target of 48x48px
8. WHEN the back button is displayed, THE System SHALL maintain 40x40px size on all screen sizes
9. WHEN helper text is shown, THE System SHALL wrap text if it exceeds container width
10. WHEN the page is viewed on tablet or desktop, THE System SHALL maintain mobile-first design without expanding unnecessarily

### Requirement 8: Validation and Error Handling

**User Story:** As a collector, I want clear validation feedback for custom pattern and member inputs, so that I understand what values are acceptable.

#### Acceptance Criteria

1. WHEN custom pattern input is empty, THE System SHALL display error "Please select a credit pattern" or "Please select a saving pattern"
2. WHEN custom pattern value is less than 1, THE System SHALL display error "Pattern must be at least 1 day"
3. WHEN custom pattern value is valid, THE System SHALL clear error message
4. WHEN full contributors input is empty, THE System SHALL display error "Number of members is required"
5. WHEN full contributors value is less than 1, THE System SHALL display error "At least 1 member is required"
6. WHEN full contributors value exceeds 50, THE System SHALL display error "Maximum 50 members allowed"
7. WHEN half contributors input is empty and toggle is on, THE System SHALL display error "Please enter number of half contributors"
8. WHEN half contributors value is odd, THE System SHALL display error "Half contributors must be an even number"
9. WHEN half contributors value is even, THE System SHALL clear error and show effective members calculation
10. WHEN validation passes, THE System SHALL enable the Next button to proceed to next step

### Requirement 9: Accessibility Enhancements

**User Story:** As a user with accessibility needs, I want the custom pattern and members sections to be fully accessible, so that I can use the interface effectively with assistive technologies.

#### Acceptance Criteria

1. WHEN the custom input container is rendered, THE System SHALL include aria-label "Custom pattern input section"
2. WHEN the back button is displayed, THE System SHALL include aria-label "Back to pattern selection"
3. WHEN the number input is rendered, THE System SHALL include aria-label describing the input purpose
4. WHEN validation errors occur, THE System SHALL announce errors to screen readers using aria-live="polite"
5. WHEN the toggle is rendered, THE System SHALL include aria-label "Include half contributors toggle"
6. WHEN input fields receive focus, THE System SHALL ensure visible focus indicator with aquamarine border
7. WHEN helper text is displayed, THE System SHALL associate it with input using aria-describedby
8. WHEN the effective members card is shown, THE System SHALL include aria-label describing the calculation
9. WHEN color is used to convey information, THE System SHALL also use icons or text labels
10. WHEN interactive elements are rendered, THE System SHALL ensure keyboard navigation works correctly

### Requirement 10: Pattern Name Display

**User Story:** As a collector, I want to see clear pattern names in the review section, so that I can verify my selections before creating the Iqub.

#### Acceptance Criteria

1. WHEN credit_pattern value is 1, THE System SHALL display "Daily (1 day)"
2. WHEN credit_pattern value is 7, THE System SHALL display "Weekly (7 days)"
3. WHEN credit_pattern value is 30, THE System SHALL display "Monthly (30 days)"
4. WHEN credit_pattern value is custom (not 1, 7, or 30), THE System SHALL display "Custom (X days)" where X is the actual value
5. WHEN saving_pattern value is 1, THE System SHALL display "Daily (1 day)"
6. WHEN saving_pattern value is 7, THE System SHALL display "Weekly (7 days)"
7. WHEN saving_pattern value is 30, THE System SHALL display "Monthly (30 days)"
8. WHEN saving_pattern value is custom (not 1, 7, or 30), THE System SHALL display "Custom (X days)" where X is the actual value
9. WHEN members are displayed in review, THE System SHALL show "X full + Y half = Z effective" if half contributors are included
10. WHEN members are displayed in review, THE System SHALL show "X full" if half contributors are not included

