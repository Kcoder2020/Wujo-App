# Wujo Platform Overview - System Design Specification

## 1. Project Summary

Wujo is a mobile-first platform designed to manage Rotating Savings and Credit Associations (ROSCAs), locally known as "Iqubs". It facilitates the organization, participation, and financial tracking within these community-based savings groups. The platform aims to provide a seamless and trustworthy digital experience for managing ROSCA activities.

## 2. Platform Goals

*   **Digitize ROSCA Management:** Provide a digital alternative to traditional, often manual, ROSCA management methods.
*   **Improve Transparency:** Offer clear visibility into contributions, member lists, lottery schedules (if applicable), and payout status.
*   **Enhance Accessibility:** Allow users to manage their ROSCA participation anytime, anywhere via a mobile app.
*   **Streamline Operations:** Simplify tasks for ROSCA organizers ("Collectors") such as member management and contribution tracking.
*   **Provide Secure Environment:** Ensure user data and financial information are handled securely.

## 3. User Types

The platform primarily serves two distinct user roles:

1.  **Collector:**
    *   Organizes and manages one or more Iqubs (ROSCAs).
    *   Invites and approves members.
    *   Sets Iqub rules (contribution amount, frequency, etc.).
    *   Tracks contributions and manages payouts/lotteries.
    *   Views overall Iqub statistics.
2.  **Member (Iquber):**
    *   Joins one or more Iqubs.
    *   Views Iqub details and their contribution status.
    *   Makes contributions (potentially tracked via the platform).
    *   Receives payouts based on the Iqub's rules/lottery.

## 4. Core Concepts

*   **ROSCA (Rotating Savings and Credit Association) / Iqub:** A group where members contribute a fixed sum regularly. The total collected amount (the "pot") is allocated to one member at each interval (e.g., weekly, monthly) in rotation or via lottery until all members have received the pot.
*   **Contribution:** The regular fixed payment made by each member.
*   **Pot/Payout:** The total sum collected during one interval, given to a designated member.
*   **Round:** One full cycle of the ROSCA where every member has received the pot once.

## 5. Agent Instructions

*   **Primary Objective:** Build the Wujo mobile application frontend based on these specifications.
*   **Target Users:** Keep the distinct needs and permissions of "Collectors" and "Members" in mind during development.
*   **Core Functionality:** Focus on enabling users to sign up, log in, view relevant Iqub information based on their role, and perform actions like creating Iqubs (Collectors) or joining Iqubs (Members).
*   **Reference:** Use the subsequent specification documents for detailed architecture, data models, APIs, and flows.
