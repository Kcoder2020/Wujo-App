# Payments Tab Implementation - Spec Overview

## Feature Name
**Credit Round Payment Tracking & Verification**

## Description
Implement a comprehensive Payments tab in the IqubDetailPage that allows collectors to track member payment status across credit rounds, view completion progress, and initiate lotteries when rounds are complete.

## Problem Statement
Currently, the Payments tab in IqubDetailPage shows only a "Coming Soon" placeholder. Collectors have no visibility into:
- Which members have paid for current credit rounds
- Payment verification status per saving round
- Overall credit round completion progress
- When they can initiate the lottery

The backend now provides two powerful APIs (`/credit-round-status` and `/credit-rounds-summary`) that expose detailed payment tracking data, but the frontend has no UI to display this information.

## Goals
1. **Primary Goal**: Enable collectors to track and verify member payments for the current credit round
2. **Secondary Goal**: Provide historical view of all credit rounds
3. **Tertiary Goal**: Streamline the lottery initiation process based on payment completion

## Success Criteria
- Collectors can see real-time payment status for all members in the current credit round
- Visual indicators clearly show verified, pending, failed, and not-started payments
- "Initiate Lottery" button is enabled only when all payments are verified
- UI matches Wujo's premium design aesthetic (dark green + aquamarine)
- Mobile-first responsive design with smooth animations

## Scope
### In Scope
- Current credit round payment tracking UI
- Member-by-member payment status grid
- Progress visualization (percentage + progress ring)
- Status legend and indicators
- Initiate Lottery button with conditional enabling
- Vuex store actions for API integration
- Loading states and error handling
- Manual refresh functionality

### Out of Scope (Future Phases)
- Auto-refresh/polling every 30-60 seconds
- Credit rounds history timeline view
- Payment verification actions (approve/reject)
- Push notifications when round completes
- Payment filtering and search
- Export payment reports

## Related Documents
- **API Documentation**: `/API_CREDIT_ROUND_ENDPOINTS.md`
- **Design Guidelines**: `/WUJO_UI_UX_GUIDELINES.md`
- **Current Component**: `/src/views/collectorViews/IqubDetailPage.vue`
- **Store Module**: `/src/store/modules/iqubs.ts`

## Timeline
- **Requirements**: 1 session
- **Design**: 1 session
- **Implementation**: 2-3 sessions
- **Testing**: 1 session

## Stakeholders
- **Primary Users**: Iqub Collectors
- **Secondary Users**: Iqub Members (indirect - they see payment status reflected)
- **Technical Owner**: Frontend Team
- **Backend Dependencies**: Credit Round APIs (already implemented)
