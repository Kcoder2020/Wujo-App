# CreateIqubPage UI Enhancement Spec

## Overview

This spec defines the requirements, design, and implementation plan for enhancing the CreateIqubPage custom pattern inputs and members section UI to align with Wujo's premium FinTech design principles.

## Status

✅ **COMPLETE - Ready for Implementation**

- **Requirements**: ✅ Complete
- **Design**: ✅ Complete  
- **Tasks**: ✅ Complete

## Quick Links

- [Requirements Document](./requirements.md) - User stories and acceptance criteria
- [Design Document](./design.md) - Technical architecture and implementation approach
- [Implementation Tasks](./tasks.md) - Step-by-step coding tasks

## Summary

### What's Being Enhanced

1. **Data Structure Simplification**
   - Remove redundant `credit_pattern_custom` and `saving_pattern_custom` fields
   - Store all pattern values (preset and custom) directly in `credit_pattern` and `saving_pattern`
   - Use boolean flags (`credit_pattern_is_custom`, `saving_pattern_is_custom`) for UI state only

2. **Premium Custom Pattern Input UI**
   - Gradient background (aquamarine to dark green)
   - Premium card styling with shadows and borders
   - Icon + title header with elegant back button
   - Input field with "days" suffix
   - Live preview: "Payouts every X days"
   - Smooth slideIn animation

3. **Premium Members Section UI**
   - Gradient container background
   - Premium toggle in white card
   - Full contributors input with people icon
   - Half contributors input with badge and left border
   - Helper text in orange card
   - Consistent premium styling across all inputs

4. **Effective Members Calculation Card**
   - Dark green premium card with white text
   - Calculator icon and title
   - Formula display: "10 full + 4 half = 12 effective"
   - Aquamarine numbers, white labels
   - Responsive layout

### Key Design Principles Applied

- **Wujo Brand Colors**: Dark Green (#014023), Medium Aquamarine (#5FD9AC), White Smoke (#F2F2F2)
- **Premium Card Patterns**: Gradients, shadows, rounded corners (20px)
- **Smooth Animations**: 300ms cubic-bezier transitions
- **Mobile-First**: Touch-friendly (48x48px targets), thumb-zone placement
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Implementation Approach

The implementation is broken down into 10 main tasks:

1. **Simplify data structure** - Remove redundant fields
2. **Update pattern selection logic** - Use simplified data structure
3. **Implement premium custom pattern input UI** - Gradient container, header, input, preview
4. **Implement premium members section UI** - Container, toggle, full/half inputs
5. **Implement effective members calculation card** - Dark green card with formula
6. **Add required icons** - Import people, calculator icons
7. **Update review section** - Display correct pattern names
8. **Implement animations** - slideIn, fadeOut, transitions
9. **Implement accessibility** - ARIA labels, live regions
10. **Verify and test** - Comprehensive testing of all features

### Getting Started

To begin implementing this spec:

1. Open the [tasks.md](./tasks.md) file in your IDE
2. Click "Start task" next to task 1 to begin
3. Follow the implementation plan step by step
4. Each task includes specific requirements references

### Expected Outcome

After implementation, the CreateIqubPage will have:

- ✅ Cleaner data structure (no redundant fields)
- ✅ Premium custom pattern input with beautiful UI
- ✅ Enhanced members section with full/half contributors
- ✅ Dark green calculation card showing effective members
- ✅ Smooth animations and transitions
- ✅ Full accessibility support
- ✅ Consistent Wujo brand styling throughout

### Testing Checklist

- [ ] Data structure simplified (no custom fields in formData)
- [ ] Custom pattern input displays with gradient background
- [ ] Pattern preview shows "Payouts every X days"
- [ ] Members section has premium toggle and styling
- [ ] Half contributors section appears/disappears with toggle
- [ ] Effective members card displays correct calculation
- [ ] All animations are smooth (300ms)
- [ ] Pattern names display correctly in review section
- [ ] ARIA labels present on all interactive elements
- [ ] No TypeScript or Vue template errors

## Related Specs

- [Iqub Management UI](../iqub-management-ui/) - Original CreateIqubPage implementation
- [Wujo UI/UX Guidelines](../../../WUJO_UI_UX_GUIDELINES.md) - Design system reference

## Notes

- This spec focuses specifically on UI enhancements for custom pattern inputs and members section
- The underlying functionality and API integration remain unchanged
- All changes are visual/UX improvements aligned with Wujo brand guidelines
- Implementation should take approximately 4-6 hours for an experienced developer

---

**Created**: December 21, 2024  
**Status**: Ready for Implementation  
**Priority**: High (UI/UX Enhancement)

