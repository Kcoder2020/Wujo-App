# Design Document

## Overview

This design document outlines the technical implementation approach for enhancing the CreateIqubPage custom pattern inputs and members section UI. The design focuses on applying Wujo's premium FinTech aesthetic through gradient backgrounds, smooth animations, and sophisticated component styling while simplifying the underlying data structure.

### Design Goals

1. **Premium Visual Design**: Apply Wujo brand colors with gradients, shadows, and sophisticated card patterns
2. **Data Structure Simplification**: Remove redundant fields and use single fields for all pattern values
3. **Smooth Animations**: Implement fluid transitions between UI states
4. **Consistent Styling**: Apply uniform premium styling across all input components
5. **Mobile Optimization**: Ensure touch-friendly interactions and responsive layouts

## Architecture

### Component Structure

```
CreateIqubPage.vue
├── Step 1: Basic Information
│   ├── Iqub Name Input
│   ├── Credit Amount Input
│   ├── Credit Pattern Selection
│   │   ├── Pattern Cards Grid (2x2)
│   │   │   ├── Daily Card
│   │   │   ├── Weekly Card
│   │   │   ├── Monthly Card
│   │   │   └── Custom Card (dashed border)
│   │   └── Premium Custom Input Container
│   │       ├── Custom Header (icon + title + back button)
│   │       ├── Premium Input Field (with suffix)
│   │       └── Pattern Preview Card
│   └── Iqub Duration Input
│
├── Step 2: Financial Details
│   ├── Saving Amount Input
│   ├── Saving Pattern Selection
│   │   ├── Pattern Cards Grid (2x2)
│   │   └── Premium Custom Input Container
│   └── Premium Members Section
│       ├── Section Header (label + toggle)
│       ├── Members Input Container
│       │   ├── Full Contributors Input Group
│       │   │   ├── Input Header (icon + title)
│       │   │   └── Premium Input Field
│       │   └── Half Contributors Input Group (conditional)
│       │       ├── Input Header (icon + title + badge)
│       │       ├── Premium Input Field
│       │       └── Helper Text Card
│       └── Effective Members Calculation Card
│           ├── Card Header (icon + title)
│           └── Calculation Display (formula)
│
└── Step 3: Review & Confirm
    ├── Summary Card (with pattern names)
    ├── Calculations Card
    └── Adjustable Rounds Card
```

### Data Structure Design

#### Simplified Form Data

```typescript
// BEFORE (with redundant fields)
const formData = reactive({
  credit_pattern: number | null,        // 1, 7, 30, or 999
  credit_pattern_custom: number | null, // ❌ REDUNDANT
  saving_pattern: number | null,        // 1, 7, 30, or 999
  saving_pattern_custom: number | null, // ❌ REDUNDANT
  // ... other fields
});

// AFTER (simplified)
const formData = reactive({
  credit_pattern: number | null,           // Stores actual days (1, 7, 30, or custom)
  credit_pattern_is_custom: boolean,       // UI state only
  saving_pattern: number | null,           // Stores actual days (1, 7, 30, or custom)
  saving_pattern_is_custom: boolean,       // UI state only
  members_count: number | null,
  half_contributors: number | null,
  include_half_contributors: boolean,
  // ... other fields
});
```

#### Data Flow

```typescript
// Pattern Selection Flow
1. User clicks "Daily" → credit_pattern = 1, credit_pattern_is_custom = false
2. User clicks "Weekly" → credit_pattern = 7, credit_pattern_is_custom = false
3. User clicks "Monthly" → credit_pattern = 30, credit_pattern_is_custom = false
4. User clicks "Custom" → credit_pattern_is_custom = true, credit_pattern = null
5. User enters "15" → credit_pattern = 15, credit_pattern_is_custom = true

// Backend Submission
{
  credit_pattern: 15,  // Always a number (days)
  saving_pattern: 30,  // Always a number (days)
  // No custom fields sent
}
```

## Components and Interfaces

### 1. Premium Custom Pattern Input Component

#### Visual Design Specification

```css
/* Premium Custom Container */
.premium-custom-container {
  /* Gradient Background */
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.08) 0%,    /* Aquamarine 8% */
    rgba(1, 64, 35, 0.03) 100%       /* Dark Green 3% */
  );
  
  /* Border & Radius */
  border: 2px solid var(--ion-color-medium-aquamarine);
  border-radius: 20px;
  
  /* Spacing */
  padding: 24px;
  margin-top: 16px;
  
  /* Shadow */
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.15);
  
  /* Animation */
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Header Design

```css
/* Custom Header */
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.custom-title-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.back-button {
  --color: var(--ion-color-medium-aquamarine);
  --padding-start: 8px;
  --padding-end: 8px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
```

#### Input Field Design

```css
/* Premium Input */
.premium-input {
  --background: white;
  --border-radius: 16px;
  --padding-start: 0;
  --inner-padding-end: 0;
  
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus State */
.premium-input.item-has-focus {
  --background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.25);
  transform: translateY(-2px);
}

/* Error State */
.premium-input.item-has-error {
  border-color: var(--ion-color-danger);
}

/* Input Content Layout */
.input-content {
  flex: 1;
  padding: 20px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
  display: block;
}

.custom-number-input {
  --padding-start: 0;
  --padding-end: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

/* Input Suffix */
.input-suffix {
  padding: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.suffix-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
}
```

#### Pattern Preview Design

```css
/* Pattern Preview */
.pattern-preview {
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ion-color-dark-green);
  font-weight: 500;
}

.preview-icon {
  font-size: 16px;
  color: var(--ion-color-medium-aquamarine);
}
```

#### Component Logic

```typescript
// Custom Pattern State Management
const formData = reactive({
  credit_pattern: null as number | null,
  credit_pattern_is_custom: false,
  saving_pattern: null as number | null,
  saving_pattern_is_custom: false,
});

// Handle Pattern Card Click
const selectCreditPattern = (days: number) => {
  formData.credit_pattern = days;
  formData.credit_pattern_is_custom = false;
};

// Handle Custom Card Click
const selectCustomCreditPattern = () => {
  formData.credit_pattern_is_custom = true;
  formData.credit_pattern = null;
};

// Handle Back to Selection
const backToCreditPatternSelection = () => {
  formData.credit_pattern_is_custom = false;
  formData.credit_pattern = null;
};

// Get Pattern Days (unified)
const getCreditPatternDays = computed(() => {
  return formData.credit_pattern || 0;
});

// Get Pattern Name for Display
const getPatternName = (pattern: number | null): string => {
  if (pattern === 1) return "Daily (1 day)";
  if (pattern === 7) return "Weekly (7 days)";
  if (pattern === 30) return "Monthly (30 days)";
  if (pattern && pattern !== 1 && pattern !== 7 && pattern !== 30) {
    return `Custom (${pattern} days)`;
  }
  return "";
};
```

### 2. Premium Members Section Component

#### Visual Design Specification

```css
/* Premium Members Section */
.members-section {
  background: linear-gradient(
    135deg,
    rgba(1, 64, 35, 0.02) 0%,      /* Dark Green 2% */
    rgba(95, 217, 172, 0.05) 100%   /* Aquamarine 5% */
  );
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(95, 217, 172, 0.2);
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Premium Toggle */
.premium-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.toggle-label {
  font-size: 14px;
  color: var(--ion-color-dark-green);
  font-weight: 500;
}

.wujo-toggle {
  --handle-background: white;
  --handle-background-checked: white;
  --background: rgba(0, 0, 0, 0.1);
  --background-checked: var(--ion-color-medium-aquamarine);
}
```

#### Member Input Groups

```css
/* Members Input Container */
.members-input-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Member Input Group */
.member-input-group {
  position: relative;
}

/* Input Header */
.input-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.input-icon {
  font-size: 20px;
  color: var(--ion-color-medium-aquamarine);
}

.half-icon {
  color: rgba(95, 217, 172, 0.7);
}

.input-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  flex: 1;
}

/* Badge */
.input-badge {
  background: rgba(255, 165, 0, 0.1);
  color: #FFA500;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Premium Member Input */
.premium-member-input {
  --background: white;
  --border-radius: 16px;
  --padding-start: 0;
  --inner-padding-end: 0;
  
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-member-input.item-has-focus {
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.25);
  transform: translateY(-2px);
}

.premium-member-input.item-has-error {
  border-color: var(--ion-color-danger);
}

/* Half Input Specific */
.half-input.item-has-focus {
  border-color: rgba(95, 217, 172, 0.7);
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.15);
}

/* Member Number Input */
.member-number-input {
  --padding-start: 20px;
  --padding-end: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  flex: 1;
}

/* Half Section */
.half-section {
  position: relative;
  padding-left: 16px;
  border-left: 3px solid rgba(95, 217, 172, 0.3);
}

/* Half Helper */
.half-helper {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(255, 165, 0, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #FFA500;
  display: flex;
  align-items: center;
  gap: 6px;
}
```

#### Effective Members Calculation Card

```css
/* Effective Members Card */
.effective-members-card {
  margin-top: 24px;
  background: var(--ion-color-dark-green);
  color: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

/* Calculation Display */
.calculation-display {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.calculation-formula {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Formula Elements */
.number {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine);
}

.label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.operator {
  font-size: 20px;
  color: white;
  font-weight: bold;
  margin: 0 4px;
}

.equals {
  font-size: 20px;
  color: white;
  font-weight: bold;
  margin: 0 8px;
}

.result {
  font-size: 32px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine);
}

.result-label {
  font-size: 16px;
  color: white;
  font-weight: 600;
}
```

#### Component Logic

```typescript
// Members Section State
const formData = reactive({
  members_count: null as number | null,
  half_contributors: null as number | null,
  include_half_contributors: false,
});

// Effective Members Calculation
const effectiveMembers = computed(() => {
  const full = formData.members_count || 0;
  const half = formData.include_half_contributors 
    ? (formData.half_contributors || 0) / 2 
    : 0;
  return full + half;
});

// Validation
const validateHalfContributors = () => {
  if (!formData.include_half_contributors) {
    errors.half_contributors = "";
    return;
  }
  
  if (!formData.half_contributors) {
    errors.half_contributors = "Please enter number of half contributors";
  } else if (formData.half_contributors % 2 !== 0) {
    errors.half_contributors = "Half contributors must be an even number";
  } else {
    errors.half_contributors = "";
  }
};
```

## Data Models

### TypeScript Interfaces

```typescript
// Form Data Interface
interface CreateIqubFormData {
  name: string;
  credit_amount: number | null;
  credit_pattern: number | null;           // Days (1, 7, 30, or custom)
  credit_pattern_is_custom: boolean;       // UI state only
  iqub_duration: number | null;
  saving_amount: number | null;
  saving_pattern: number | null;           // Days (1, 7, 30, or custom)
  saving_pattern_is_custom: boolean;       // UI state only
  members_count: number | null;
  half_contributors: number | null;
  include_half_contributors: boolean;
  credit_round: number | null;
  saving_round: number | null;
}

// Backend Payload Interface
interface CreateIqubPayload {
  name: string;
  credit_amount: number;
  credit_pattern: number;        // Always days
  iqub_duration: number;
  saving_amount: number;
  saving_pattern: number;        // Always days
  members_count: number;
  half_contributors: number;     // 0 if not used
  credit_round: number;
  saving_round: number;
}

// Error State Interface
interface FormErrors {
  name: string;
  credit_amount: string;
  credit_pattern: string;
  iqub_duration: string;
  saving_amount: string;
  saving_pattern: string;
  members_count: string;
  half_contributors: string;
}
```

## Error Handling

### Validation Logic

```typescript
// Unified Pattern Validation
const validatePattern = (field: 'credit_pattern' | 'saving_pattern') => {
  const value = formData[field];
  
  if (!value) {
    errors[field] = `Please select a ${field.replace('_', ' ')}`;
  } else if (value < 1) {
    errors[field] = "Pattern must be at least 1 day";
  } else {
    errors[field] = "";
  }
};

// Members Validation
const validateMembers = () => {
  // Full contributors
  if (!formData.members_count) {
    errors.members_count = "Number of members is required";
  } else if (formData.members_count < 1) {
    errors.members_count = "At least 1 member is required";
  } else if (formData.members_count > 50) {
    errors.members_count = "Maximum 50 members allowed";
  } else {
    errors.members_count = "";
  }
  
  // Half contributors
  if (formData.include_half_contributors) {
    if (!formData.half_contributors) {
      errors.half_contributors = "Please enter number of half contributors";
    } else if (formData.half_contributors % 2 !== 0) {
      errors.half_contributors = "Half contributors must be an even number";
    } else {
      errors.half_contributors = "";
    }
  } else {
    errors.half_contributors = "";
  }
};
```

## Testing Strategy

### Unit Tests

```typescript
describe('Custom Pattern Input', () => {
  it('should store days directly in credit_pattern', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.selectCreditPattern(15);
    expect(wrapper.vm.formData.credit_pattern).toBe(15);
    expect(wrapper.vm.formData.credit_pattern_is_custom).toBe(false);
  });
  
  it('should display correct pattern name for custom value', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.formData.credit_pattern = 15;
    expect(wrapper.vm.getPatternName(15)).toBe('Custom (15 days)');
  });
});

describe('Members Section', () => {
  it('should calculate effective members correctly', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.formData.members_count = 10;
    wrapper.vm.formData.include_half_contributors = true;
    wrapper.vm.formData.half_contributors = 4;
    expect(wrapper.vm.effectiveMembers).toBe(12);
  });
  
  it('should validate half contributors must be even', () => {
    const wrapper = mount(CreateIqubPage);
    wrapper.vm.formData.include_half_contributors = true;
    wrapper.vm.formData.half_contributors = 3;
    wrapper.vm.validateHalfContributors();
    expect(wrapper.vm.errors.half_contributors).toBe('Half contributors must be an even number');
  });
});
```

## Performance Optimization

### Animation Performance

```typescript
// Use GPU-accelerated properties
.premium-custom-container {
  will-change: transform, opacity;
}

.premium-input.item-has-focus {
  will-change: transform, box-shadow;
}

// Debounce input validation
const debouncedValidate = debounce((field: string) => {
  validateField(field);
}, 300);
```

### Conditional Rendering

```vue
<!-- Only render custom input when needed -->
<div v-if="formData.credit_pattern_is_custom" class="premium-custom-container">
  <!-- Custom input content -->
</div>

<!-- Only render half contributors when enabled -->
<div v-if="formData.include_half_contributors" class="half-section">
  <!-- Half contributors content -->
</div>
```

## Accessibility Considerations

### ARIA Labels

```vue
<!-- Custom input container -->
<div 
  class="premium-custom-container"
  role="region"
  aria-label="Custom pattern input section"
>
  <!-- Back button -->
  <ion-button
    aria-label="Back to pattern selection"
    @click="backToCreditPatternSelection"
  >
    <ion-icon :icon="arrowBack"></ion-icon>
  </ion-button>
  
  <!-- Input field -->
  <ion-input
    aria-label="Enter number of days between payouts"
    aria-describedby="pattern-helper"
  ></ion-input>
  
  <!-- Helper text -->
  <div id="pattern-helper" class="pattern-preview">
    Payouts every {{ formData.credit_pattern }} days
  </div>
</div>

<!-- Toggle -->
<ion-toggle
  v-model="formData.include_half_contributors"
  aria-label="Include half contributors toggle"
></ion-toggle>

<!-- Error announcements -->
<div 
  role="alert" 
  aria-live="polite"
  v-if="errors.half_contributors"
>
  {{ errors.half_contributors }}
</div>
```

## Deployment Considerations

### Browser Compatibility

```css
/* Fallback for older browsers */
.premium-custom-container {
  background: rgba(95, 217, 172, 0.08);
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.08) 0%,
    rgba(1, 64, 35, 0.03) 100%
  );
}

/* Autoprefixer will handle vendor prefixes */
.premium-input.item-has-focus {
  transform: translateY(-2px);
  -webkit-transform: translateY(-2px);
  -moz-transform: translateY(-2px);
}
```

### Performance Monitoring

```typescript
// Track custom pattern usage
const trackCustomPatternUsage = () => {
  analytics.track('custom_pattern_selected', {
    pattern_type: 'credit',
    days: formData.credit_pattern,
    timestamp: new Date().toISOString()
  });
};

// Track half contributors usage
const trackHalfContributorsUsage = () => {
  analytics.track('half_contributors_enabled', {
    full_count: formData.members_count,
    half_count: formData.half_contributors,
    effective_members: effectiveMembers.value,
    timestamp: new Date().toISOString()
  });
};
```

## Conclusion

This design document provides a comprehensive blueprint for implementing the CreateIqubPage UI enhancements. The implementation focuses on:

- **Data Simplification**: Removing redundant fields and using single fields for all pattern values
- **Premium Visual Design**: Applying Wujo brand colors with gradients, shadows, and sophisticated styling
- **Smooth Animations**: Implementing fluid transitions between UI states
- **Consistent Patterns**: Applying uniform premium styling across all components
- **Mobile Optimization**: Ensuring touch-friendly interactions and responsive layouts
- **Accessibility**: Including ARIA labels and keyboard navigation support

The implementation will follow Vue 3 Composition API best practices and Wujo UI/UX guidelines to deliver a premium FinTech experience.

