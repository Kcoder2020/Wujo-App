# Implementation Plan

- [x] 1. Simplify data structure by removing redundant custom pattern fields
  - Remove `credit_pattern_custom` and `saving_pattern_custom` from formData reactive object
  - Add `credit_pattern_is_custom` and `saving_pattern_is_custom` boolean flags for UI state tracking
  - Update formData to store actual days directly in `credit_pattern` and `saving_pattern` fields
  - Remove `credit_pattern_custom` and `saving_pattern_custom` from errors object
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.9, 1.10_

- [x] 2. Update pattern selection logic to use simplified data structure
  - [x] 2.1 Modify pattern card click handlers to set days directly in credit_pattern/saving_pattern
    - Update Daily card click to set `credit_pattern = 1` and `credit_pattern_is_custom = false`
    - Update Weekly card click to set `credit_pattern = 7` and `credit_pattern_is_custom = false`
    - Update Monthly card click to set `credit_pattern = 30` and `credit_pattern_is_custom = false`
    - Update Custom card click to set `credit_pattern_is_custom = true` and `credit_pattern = null`
    - Apply same logic for saving pattern cards
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [x] 2.2 Update computed properties to use simplified pattern fields
    - Modify `getCreditPatternDays` to return `formData.credit_pattern || 0`
    - Modify `getSavingPatternDays` to return `formData.saving_pattern || 0`
    - Remove logic that checks for pattern === 999
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [x] 2.3 Update getPatternName function to handle custom values
    - Return "Daily (1 day)" when pattern === 1
    - Return "Weekly (7 days)" when pattern === 7
    - Return "Monthly (30 days)" when pattern === 30
    - Return "Custom (X days)" when pattern is not 1, 7, or 30
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [x] 2.4 Update validation logic for pattern fields
    - Modify `validateField` for credit_pattern to check if value < 1
    - Modify `validateField` for saving_pattern to check if value < 1
    - Remove validation logic for credit_pattern_custom and saving_pattern_custom
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 2.5 Update canProceedToNext computed property
    - Remove checks for credit_pattern === 999 and credit_pattern_custom
    - Remove checks for saving_pattern === 999 and saving_pattern_custom
    - Simplify to check only if credit_pattern and saving_pattern exist
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

- [x] 3. Implement premium custom pattern input UI
  - [x] 3.1 Create premium custom container with gradient background
    - Add `.premium-custom-container` class with gradient from aquamarine (8%) to dark green (3%)
    - Apply 2px solid aquamarine border with 20px border radius
    - Add 24px padding and 16px top margin
    - Apply box shadow `0 4px 16px rgba(95, 217, 172, 0.15)`
    - Add slideIn animation with 300ms cubic-bezier timing
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 Implement custom header with icon, title, and back button
    - Create `.custom-header` with flexbox layout (space-between)
    - Add `.custom-title` with calendar icon (24px aquamarine) and title text (18px SemiBold dark green)
    - Implement `.back-button` as 40x40px circular button in top right with aquamarine color
    - Add 20px bottom margin to header
    - _Requirements: 2.5, 2.6, 2.7_

  - [x] 3.3 Create premium input field with label and suffix
    - Implement `.premium-input` with white background, 16px border radius, 2px transparent border
    - Add `.input-content` wrapper with 20px padding containing label and input
    - Style `.input-label` as 14px SemiBold dark green with 8px bottom margin
    - Style `.custom-number-input` as 18px SemiBold dark green
    - Add `.input-suffix` with "days" text (14px Medium gray) and left border separator
    - _Requirements: 2.8, 2.9, 2.11, 2.12_

  - [x] 3.4 Implement focus and error states for premium input
    - Add focus state with aquamarine border, elevated shadow, and translateY(-2px)
    - Add error state with red border color
    - Apply 300ms cubic-bezier transition to all properties
    - _Requirements: 2.10, 2.15, 5.2, 5.3, 5.4, 5.5_

  - [x] 3.5 Create pattern preview card with live feedback
    - Implement `.pattern-preview` with aquamarine background (10% opacity) and 12px border radius
    - Add information icon (16px aquamarine) and preview text (14px Medium dark green)
    - Display "Payouts every X days" or "Contributions every X days" based on input value
    - Show preview only when valid number is entered
    - _Requirements: 2.13, 2.14_

  - [x] 3.6 Update template to conditionally render custom input
    - Show pattern cards grid when `!formData.credit_pattern_is_custom`
    - Show premium custom container when `formData.credit_pattern_is_custom`
    - Apply same logic for saving pattern section
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Implement premium members section UI
  - [x] 4.1 Create members section container with gradient background
    - Add `.members-section` class with gradient from dark green (2%) to aquamarine (5%)
    - Apply 24px padding, 20px border radius, and 1px aquamarine border (20% opacity)
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Implement section header with label and premium toggle
    - Create `.section-header` with flexbox layout (space-between)
    - Add "Members" label (form-label class)
    - Implement `.premium-toggle` in white card with 12px border radius and shadow
    - Style toggle label as 14px Medium dark green
    - Apply aquamarine color when toggle is active
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [x] 4.3 Create full contributors input group with icon and title
    - Implement `.member-input-group` container
    - Add `.input-header` with people icon (20px aquamarine) and "Full Contributors" title (16px SemiBold)
    - Create `.premium-member-input` with white background, 16px border radius, 2px transparent border
    - Style `.member-number-input` as 18px SemiBold dark green with 20px left padding
    - Add input suffix "members" (14px Medium gray) with left border separator
    - _Requirements: 3.7, 3.8, 3.9_

  - [x] 4.4 Implement focus and error states for member inputs
    - Add focus state with aquamarine border, elevated shadow, and translateY(-2px)
    - Add error state with red border color
    - Apply 300ms cubic-bezier transition
    - _Requirements: 3.9, 3.13_

  - [x] 4.5 Create half contributors input group with badge and helper text
    - Implement `.half-section` with 3px left border (aquamarine 30% opacity) and 16px left padding
    - Add input header with people-circle icon (20px aquamarine 70% opacity) and title
    - Create "Must be even" badge with orange background (10% opacity), orange text, 8px padding
    - Implement premium input field with same styling as full contributors
    - Add `.half-helper` text card with orange background (10% opacity) and orange text
    - Display "2 half contributors = 1 full member" message
    - _Requirements: 3.10, 3.11, 3.12, 3.13, 3.14_

  - [x] 4.6 Update template to conditionally render half contributors section
    - Show half contributors input group only when `formData.include_half_contributors` is true
    - Apply slideIn animation (300ms) when section appears
    - Apply slideOut animation (300ms) when section disappears
    - _Requirements: 3.10, 6.5, 6.6_

- [x] 5. Implement effective members calculation card
  - [x] 5.1 Create premium dark green calculation card
    - Add `.effective-members-card` with dark green background and white text
    - Apply 24px padding, 20px border radius, and shadow `0 8px 32px rgba(1, 64, 35, 0.2)`
    - Add 24px top margin
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Implement card header with calculator icon and title
    - Create `.card-header` with flexbox layout and 12px gap
    - Add calculator icon (24px aquamarine)
    - Display "Effective Members" title (18px SemiBold white)
    - Add 16px bottom margin
    - _Requirements: 4.3_

  - [x] 5.3 Create calculation display with formula layout
    - Implement `.calculation-display` with white background (10% opacity) and 12px border radius
    - Add `.calculation-formula` with flexbox layout, centered, 8px gap, and wrap
    - Add 16px padding
    - _Requirements: 4.4_

  - [x] 5.4 Style formula elements with proper typography
    - Style `.number` as 24px Bold aquamarine for full and half counts
    - Style `.label` as 14px Medium white (80% opacity) for "full" and "half"
    - Style `.operator` as 20px Bold white for "+" with 4px horizontal margin
    - Style `.equals` as 20px Bold white for "=" with 8px horizontal margin
    - Style `.result` as 32px Bold aquamarine for effective members count
    - Style `.result-label` as 16px SemiBold white for "effective"
    - _Requirements: 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

  - [x] 5.5 Update template to conditionally render calculation card
    - Show effective members card only when `effectiveMembers > 0`
    - Display formula: "X full + Y half = Z effective" when half contributors are included
    - Display formula: "X full = X effective" when half contributors are not included
    - Apply slideUp animation (300ms) when card appears
    - _Requirements: 4.1, 6.7_

- [x] 6. Add required icons to imports
  - Import `peopleOutline` icon from ionicons for full contributors
  - Import `peopleCircleOutline` icon from ionicons for half contributors
  - Import `calculatorOutline` icon from ionicons for effective members card
  - _Requirements: 3.7, 3.11, 4.3_

- [x] 7. Update review section to display correct pattern names
  - [x] 7.1 Modify credit pattern display in summary card
    - Update to call `getPatternName(formData.credit_pattern)` without second parameter
    - Display "Daily (1 day)", "Weekly (7 days)", "Monthly (30 days)", or "Custom (X days)"
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 7.2 Modify saving pattern display in summary card
    - Update to call `getPatternName(formData.saving_pattern)` without second parameter
    - Display "Daily (1 day)", "Weekly (7 days)", "Monthly (30 days)", or "Custom (X days)"
    - _Requirements: 10.5, 10.6, 10.7, 10.8_

  - [x] 7.3 Update members display in summary card
    - Display "X full + Y half = Z effective" when half contributors are included
    - Display "X full" when half contributors are not included
    - _Requirements: 10.9, 10.10_

- [x] 8. Implement animations and transitions
  - [x] 8.1 Add slideIn animation for custom input container
    - Create `@keyframes slideIn` with translateY(-20px) to translateY(0) and opacity 0 to 1
    - Apply animation with 300ms cubic-bezier(0.4, 0, 0.2, 1) timing
    - _Requirements: 2.3, 6.2_

  - [x] 8.2 Add fadeOut animation for pattern cards
    - Apply opacity transition (200ms) when hiding pattern cards
    - _Requirements: 6.1_

  - [x] 8.3 Add fadeIn animation for pattern cards
    - Apply opacity transition (300ms) when showing pattern cards
    - _Requirements: 6.4_

  - [x] 8.4 Add slideIn animation for half contributors section
    - Apply max-height and opacity transition (300ms) when toggle is activated
    - _Requirements: 6.5_

  - [x] 8.5 Add slideOut animation for half contributors section
    - Apply max-height and opacity transition (300ms) when toggle is deactivated
    - _Requirements: 6.6_

  - [x] 8.6 Add slideUp animation for effective members card
    - Apply translateY(30px) to translateY(0) and opacity 0 to 1 transition (300ms)
    - _Requirements: 6.7_

  - [x] 8.7 Add focus transitions for all input fields
    - Apply 300ms cubic-bezier transition to border-color, box-shadow, and transform
    - _Requirements: 6.8, 6.9_

  - [x] 8.8 Add fadeIn animation for validation errors
    - Apply opacity transition (200ms) when error messages appear
    - _Requirements: 6.10_

- [x] 9. Implement accessibility enhancements
  - [x] 9.1 Add ARIA labels to custom input container
    - Add `role="region"` and `aria-label="Custom pattern input section"` to premium-custom-container
    - _Requirements: 9.1_

  - [x] 9.2 Add ARIA label to back button
    - Add `aria-label="Back to pattern selection"` to back button
    - _Requirements: 9.2_

  - [x] 9.3 Add ARIA labels to number inputs
    - Add `aria-label="Enter number of days between payouts"` to credit pattern input
    - Add `aria-label="Enter number of days between contributions"` to saving pattern input
    - Add `aria-label="Enter number of full contributors"` to full contributors input
    - Add `aria-label="Enter number of half contributors"` to half contributors input
    - _Requirements: 9.3_

  - [x] 9.4 Add ARIA live regions for validation errors
    - Add `aria-live="polite"` to error message containers
    - Ensure errors are announced to screen readers when they appear
    - _Requirements: 9.4_

  - [x] 9.5 Add ARIA label to toggle
    - Add `aria-label="Include half contributors toggle"` to ion-toggle
    - _Requirements: 9.5_

  - [x] 9.6 Ensure visible focus indicators
    - Verify aquamarine border is visible on all focused inputs
    - Test keyboard navigation through all interactive elements
    - _Requirements: 9.6_

  - [x] 9.7 Associate helper text with inputs
    - Add `aria-describedby` to inputs referencing helper text IDs
    - _Requirements: 9.7_

  - [x] 9.8 Add ARIA label to effective members card
    - Add `aria-label="Effective members calculation"` to calculation card
    - _Requirements: 9.8_

- [ ] 10. Verify and test implementation
  - [ ] 10.1 Test data structure simplification
    - Verify credit_pattern_custom and saving_pattern_custom are removed from formData
    - Verify pattern values are stored directly in credit_pattern and saving_pattern
    - Verify backend receives correct number values for patterns
    - _Requirements: 1.1, 1.2, 1.7, 1.8_

  - [ ] 10.2 Test custom pattern input UI
    - Verify gradient background and border styling
    - Verify slideIn animation when custom is selected
    - Verify back button returns to pattern cards
    - Verify input focus states and error states
    - Verify pattern preview displays correctly
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15_

  - [ ] 10.3 Test members section UI
    - Verify gradient background and border styling
    - Verify toggle styling and functionality
    - Verify full contributors input styling and focus states
    - Verify half contributors section appears/disappears with toggle
    - Verify "Must be even" badge displays correctly
    - Verify helper text styling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14_

  - [ ] 10.4 Test effective members calculation card
    - Verify dark green background and white text
    - Verify calculator icon and title styling
    - Verify formula display with correct typography
    - Verify calculation is accurate (full + half/2)
    - Verify card appears only when effective members > 0
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

  - [ ] 10.5 Test pattern name display in review section
    - Verify "Daily (1 day)" displays for pattern = 1
    - Verify "Weekly (7 days)" displays for pattern = 7
    - Verify "Monthly (30 days)" displays for pattern = 30
    - Verify "Custom (X days)" displays for custom values
    - Verify members display shows correct format
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

  - [ ] 10.6 Test animations and transitions
    - Verify slideIn animation for custom input
    - Verify fadeOut/fadeIn for pattern cards
    - Verify slideIn/slideOut for half contributors section
    - Verify slideUp for effective members card
    - Verify smooth focus transitions (300ms)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

  - [ ] 10.7 Test validation logic
    - Verify custom pattern validation (must be >= 1)
    - Verify full contributors validation (1-50 range)
    - Verify half contributors validation (must be even)
    - Verify error messages display correctly
    - Verify canProceedToNext works with simplified data structure
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

  - [ ] 10.8 Test accessibility features
    - Verify ARIA labels are present on all interactive elements
    - Verify screen reader announces errors
    - Verify keyboard navigation works correctly
    - Verify focus indicators are visible
    - Verify color contrast meets WCAG standards
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

  - [ ] 10.9 Test responsive layout
    - Verify pattern cards display in 2x2 grid on mobile
    - Verify custom input uses full width with proper padding
    - Verify members section stacks vertically
    - Verify formula wraps on small screens
    - Verify touch targets are at least 48x48px
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [ ] 10.10 Run diagnostics to verify no errors
    - Run getDiagnostics on CreateIqubPage.vue
    - Verify no TypeScript errors
    - Verify no Vue template errors
    - Verify no ESLint warnings

