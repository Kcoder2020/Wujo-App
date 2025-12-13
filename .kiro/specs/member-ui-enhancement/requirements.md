# Member UI Enhancement - Requirements Document

## Introduction
This document outlines the requirements for transforming all member-related pages and components to match the premium Wujo brand identity, similar to the collector dashboard transformation. The goal is to create a cohesive, modern, and member-focused experience that leverages existing backend APIs while maintaining the same high-quality design standards established in the collector interface.

## Glossary
- **Member**: A user who participates in Iqubs by joining and making payments
- **Iqub**: A traditional Ethiopian savings group (ROSCA - Rotating Savings and Credit Association)
- **Lottery**: The process of selecting which member receives the collected funds in a given round
- **Wujo Brand Identity**: The design system using dark green (#014023), aquamarine (#5FD9AC), and white smoke (#F2F2F2)
- **Member Dashboard**: The main landing page for members showing their savings overview
- **IqubBook**: Member's view of all joined Iqubs
- **Discover Page**: Interface for finding and joining new Iqubs

---

## Requirements

### Requirement 1: Member Dashboard Transformation

**User Story:** As a member, I want a premium dashboard that shows my savings progress and recent activity, so that I can quickly understand my financial status.

#### Acceptance Criteria

1. WHEN the member dashboard loads, THE System SHALL display a premium hero section with dark green gradient background
2. WHEN the member is authenticated, THE System SHALL display a personalized greeting with the member's name from the auth store
3. THE System SHALL display summary cards showing total savings, active Iqubs count, lottery position, and completed Iqubs
4. THE System SHALL display circular progress rings on summary cards to visualize savings completion percentage
5. THE System SHALL display a recent activity feed showing payments made, lottery wins, and Iqub joins with relative timestamps
6. THE System SHALL provide quick action buttons for "Discover Iqubs", "Make Payment", and "View Profile" in the thumb zone
7. WHEN the member pulls down on the dashboard, THE System SHALL refresh all dashboard data from the backend API
8. THE System SHALL display skeleton loaders while dashboard data is being fetched
9. THE System SHALL display aquamarine accents for CTAs and progress indicators following Wujo brand guidelines

### Requirement 2: IqubBook Page Enhancement

**User Story:** As a member, I want to see my joined Iqubs in a modern card-based layout with clear progress visualization, so that I can track my savings in each Iqub.

#### Acceptance Criteria

1. THE System SHALL display joined Iqubs as modern cards instead of a table-style list
2. WHEN displaying each Iqub card, THE System SHALL show the Iqub name, savings progress, next lottery date, and status badge
3. THE System SHALL display a circular progress ring on each card showing the completion percentage with aquamarine color
4. THE System SHALL display status badges with color coding (green for active, blue for completed, orange for pending)
5. WHEN the member has no joined Iqubs, THE System SHALL display an empty state with an encouraging message and "Discover Iqubs" CTA
6. WHEN the member pulls down on the page, THE System SHALL refresh the joined Iqubs list from the backend API
7. THE System SHALL animate card entrance with staggered timing for a premium feel
8. WHEN a member clicks on an Iqub card, THE System SHALL navigate to the Iqub detail page

### Requirement 3: Discover Page Modernization

**User Story:** As a member, I want to discover and join new Iqubs through an intuitive interface with search and filters, so that I can find Iqubs that match my savings goals.

#### Acceptance Criteria

1. THE System SHALL display a search bar with real-time filtering capability for Iqub discovery
2. THE System SHALL provide filter options for amount range, duration, and category
3. THE System SHALL display available Iqubs as modern cards showing key information (amount, duration, members count, collector name)
4. WHEN a member clicks "Join Iqub", THE System SHALL display a confirmation dialog with Iqub details and terms
5. WHEN a member confirms joining, THE System SHALL call the backend API and display success feedback
6. THE System SHALL display skeleton loaders while fetching available Iqubs
7. WHEN no Iqubs match the search criteria, THE System SHALL display an empty search results state
8. THE System SHALL implement pagination for large result sets

### Requirement 4: Profile Page Enhancement

**User Story:** As a member, I want a comprehensive profile page showing my achievements and savings history, so that I can track my progress and manage my account.

#### Acceptance Criteria

1. THE System SHALL display a profile hero section with member avatar, name, and join date
2. THE System SHALL display member statistics including Iqubs joined, lotteries won, total saved, and active Iqubs
3. THE System SHALL display achievement badges for milestones reached
4. THE System SHALL display a savings history timeline showing all payments made
5. THE System SHALL display lottery wins with celebration animations
6. THE System SHALL provide an "Edit Profile" button that opens a modal for updating member information
7. WHEN the member updates their profile, THE System SHALL validate inputs and call the backend API
8. THE System SHALL display success feedback after profile updates

### Requirement 5: Component Architecture Enhancement

**User Story:** As a developer, I want reusable member-specific components following Wujo design guidelines, so that the UI is consistent and maintainable.

#### Acceptance Criteria

1. THE System SHALL provide a MemberIqubCard component for displaying Iqub information in a premium card format
2. THE System SHALL provide a SavingsProgressRing component for visualizing savings completion with aquamarine color
3. THE System SHALL provide a LotteryCountdown component for displaying time until next lottery
4. THE System SHALL provide an AchievementBadge component for displaying member milestones
5. THE System SHALL provide a PaymentHistoryItem component for timeline display of payment history
6. THE System SHALL ensure all components use Wujo color variables (dark green, aquamarine, white smoke)
7. THE System SHALL implement smooth animations (300ms cubic-bezier timing) for all interactive elements

### Requirement 6: Backend API Integration

**User Story:** As a member, I want real-time data from the backend displayed on all pages, so that I always see accurate and up-to-date information.

#### Acceptance Criteria

1. THE System SHALL integrate the member dashboard API endpoint to fetch dashboard summary data
2. THE System SHALL integrate the joined Iqubs API endpoint to fetch member's Iqub list
3. THE System SHALL integrate the discover Iqubs API endpoint with search and filter parameters
4. THE System SHALL integrate the member profile API endpoint for fetching and updating profile data
5. THE System SHALL integrate the join Iqub API endpoint for joining new Iqubs
6. THE System SHALL handle authentication tokens properly for all API calls
7. THE System SHALL implement error handling with user-friendly messages for all API failures
8. THE System SHALL implement retry logic for network errors
9. THE System SHALL display loading states during all API calls

### Requirement 7: Mobile-First UX Compliance

**User Story:** As a mobile user, I want all member pages optimized for mobile devices with thumb-zone placement, so that I can easily interact with the app one-handed.

#### Acceptance Criteria

1. THE System SHALL place all primary action buttons in the bottom 30% of the screen (thumb zone)
2. THE System SHALL ensure all buttons have a minimum height of 56px for easy tapping
3. THE System SHALL implement touch-friendly interactions with proper touch target sizes
4. THE System SHALL support swipe gestures for pull-to-refresh functionality
5. THE System SHALL ensure text sizes are readable with a minimum of 16px for body text
6. THE System SHALL implement responsive design that adapts to different screen sizes
7. THE System SHALL optimize animations for 60fps performance on mobile devices

### Requirement 8: Wujo Brand Identity Compliance

**User Story:** As a user, I want all member pages to follow the Wujo brand identity consistently, so that the app feels cohesive and professional.

#### Acceptance Criteria

1. THE System SHALL use dark green (#014023) for headers, premium cards, and primary text
2. THE System SHALL use aquamarine (#5FD9AC) for CTAs, progress indicators, and active states
3. THE System SHALL use white smoke (#F2F2F2) for page backgrounds
4. THE System SHALL follow the 8px spacing grid system for all layouts
5. THE System SHALL implement 300ms smooth animations with cubic-bezier timing functions
6. THE System SHALL use premium shadows (0 8px 32px rgba(1, 64, 35, 0.2)) for cards
7. THE System SHALL use consistent typography scale across all pages
8. THE System SHALL implement member-specific design language with savings-focused visualizations

### Requirement 9: Performance and Quality

**User Story:** As a user, I want fast page loads and smooth interactions, so that the app feels responsive and professional.

#### Acceptance Criteria

1. THE System SHALL load pages in under 2 seconds on 3G networks
2. THE System SHALL maintain 60fps animations on all interactions
3. THE System SHALL implement efficient data loading with pagination for large lists
4. THE System SHALL optimize images and assets for fast loading
5. THE System SHALL minimize bundle size impact from new components
6. THE System SHALL implement proper error boundaries to prevent crashes
7. THE System SHALL ensure zero compilation errors in TypeScript
8. THE System SHALL follow Vue 3 best practices with script setup syntax

---

**Document Version:** 1.0  
**Last Updated:** December 13, 2024  
**Status:** Approved - Ready for Design Phase
