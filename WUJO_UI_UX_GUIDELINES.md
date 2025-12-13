# Wujo App - UI/UX Design Guidelines

## 🎨 Brand Identity

### Design Philosophy
**"Trustworthy Futuristic FinTech"**

Wujo combines the trust and stability of traditional Ethiopian savings practices (Iqub/ROSCA) with modern, futuristic digital banking aesthetics. The design should feel like a premium neobank app, not a utility tool.

---

## 🎨 Color Palette

### Primary Colors

#### 1. Dark Green - The Authority (Trust)
- **Variable:** `--ion-color-dark-green`
- **Hex:** `#014023`
- **RGB:** `1, 64, 35`
- **Usage:**
  - Headers and navigation bars
  - Primary typography
  - Premium card backgrounds
  - Trust indicators
  - Financial data displays

#### 2. Medium Aquamarine - The Energy (Future)
- **Variable:** `--ion-color-medium-aquamarine`
- **Hex:** `#5FD9AC`
- **RGB:** `95, 217, 172`
- **Usage:**
  - Primary CTAs (Call-to-Action buttons)
  - Progress indicators and rings
  - Active states
  - Success messages
  - Interactive elements
  - Highlights and accents

#### 3. White Smoke - The Foundation (Canvas)
- **Variable:** `--ion-color-white-smoke`
- **Hex:** `#F2F2F2`
- **RGB:** `242, 242, 242`
- **Usage:**
  - App backgrounds
  - Card backgrounds (secondary)
  - Input field backgrounds
  - Reduces eye strain vs pure white

### Supporting Colors

- **White:** `#FFFFFF` - Text on dark backgrounds, card highlights
- **Success:** Medium Aquamarine (`#5FD9AC`)
- **Warning:** `#FFA500` - Pending states, caution messages
- **Danger:** `#DC3545` - Errors, destructive actions
- **Medium Gray:** `#6C757D` - Secondary text, disabled states

---

## 📱 Mobile-First Design Principles

### 1. The Thumb Zone
**Rule:** Place all primary actions in the bottom 30% of the screen.

**Why:** Most users hold phones with one hand. The thumb naturally reaches the bottom third of the screen.

**Implementation:**
- Primary CTAs: Bottom 30%
- Secondary actions: Middle 40%
- Information display: Top 30%

**Examples:**
- "Sign In" button at bottom
- "Create Iqub" button at bottom
- "Confirm Payment" at bottom
- Navigation tabs at bottom

### 2. Touch Target Sizes
- **Minimum:** 44x44 pixels (iOS standard)
- **Recommended:** 48x48 pixels (Material Design)
- **Wujo Standard:** 56px height for primary buttons

### 3. Spacing & Rhythm
- **Base unit:** 8px
- **Small gap:** 8px
- **Medium gap:** 16px
- **Large gap:** 24px
- **XL gap:** 32px

### 4. Typography Scale
- **Hero Title:** 36px, Bold (Login/Signup headers)
- **Page Title:** 28px, Bold
- **Section Header:** 24px, SemiBold
- **Card Title:** 18px, SemiBold
- **Body Text:** 16px, Regular
- **Secondary Text:** 14px, Medium
- **Caption:** 12px, Regular

---

## 🎴 Component Patterns

### Premium Cards
```css
background: var(--ion-color-dark-green);
color: white;
border-radius: 20px;
box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
padding: 24px;
```

**Usage:** Iqub information cards, financial summaries, featured content

### Input Fields
```css
background: var(--ion-color-white-smoke);
border: 2px solid transparent;
border-radius: 16px;
padding: 20px;
min-height: 64px;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Focus State:**
```css
background: white;
border-color: var(--ion-color-medium-aquamarine);
box-shadow: 0 0 0 4px rgba(95, 217, 172, 0.15);
transform: translateY(-2px);
```

### Primary Buttons (CTAs)
```css
background: var(--ion-color-medium-aquamarine);
color: var(--ion-color-dark-green);
border-radius: 16px;
height: 56px;
font-weight: 700;
box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
```

**Active State:**
```css
transform: scale(0.98);
opacity: 0.9;
```

### Secondary Buttons
```css
background: transparent;
border: 2px solid var(--ion-color-dark-green);
color: var(--ion-color-dark-green);
border-radius: 16px;
height: 56px;
font-weight: 600;
```

---

## 🎭 Animation Guidelines

### Timing Functions
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)` - Most transitions
- **Deceleration:** `cubic-bezier(0, 0, 0.2, 1)` - Elements entering
- **Acceleration:** `cubic-bezier(0.4, 0, 1, 1)` - Elements exiting
- **Sharp:** `cubic-bezier(0.4, 0, 0.6, 1)` - Quick interactions

### Duration Standards
- **Micro:** 100ms - Hover states, ripples
- **Fast:** 200ms - Button presses, toggles
- **Standard:** 300ms - Most transitions
- **Slow:** 500ms - Page transitions, modals
- **Very Slow:** 800ms - Complex animations

### Key Animations

#### Fade In Down (Hero Elements)
```css
@keyframes fadeInDown {
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

#### Slide Up (Cards, Modals)
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Scale In (Success Icons)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 📊 Data Visualization

### Progress Rings (ROSCA Cycles)
- **Color:** Medium Aquamarine (`#5FD9AC`)
- **Background:** Dark Green with opacity
- **Stroke Width:** 8px
- **Size:** 120px diameter (cards), 80px (compact)

### Progress Bars
- **Height:** 4px (thin), 8px (standard)
- **Color:** Medium Aquamarine
- **Background:** `rgba(1, 64, 35, 0.1)`
- **Border Radius:** 2px

### Skeleton Loaders
- **Style:** Shimmer effect
- **Base Color:** `#E0E0E0`
- **Shimmer Color:** `#F5F5F5`
- **Animation:** 1.5s linear infinite

---

## 🎯 Ethiopian Phone Number Validation

### E.164 Format
Ethiopian phone numbers must be in E.164 international format:
- **Format:** `+251XXXXXXXXX`
- **Country Code:** `+251`
- **Length:** 12 characters total (including +)
- **Valid Prefixes:** `+2519` (mobile) or `+2517` (mobile)

### Validation Logic
```typescript
const formatPhoneToE164 = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  
  // Case 1: Already starts with 251
  if (cleaned.startsWith("251")) {
    return `+${cleaned}`;
  }
  
  // Case 2: 10 digits starting with 09 or 07
  if (cleaned.length === 10 && (cleaned.startsWith("09") || cleaned.startsWith("07"))) {
    return `+251${cleaned.substring(1)}`;
  }
  
  // Case 3: 9 digits starting with 9 or 7
  if (cleaned.length === 9 && (cleaned.startsWith("9") || cleaned.startsWith("7"))) {
    return `+251${cleaned}`;
  }
  
  return `+251${cleaned}`;
};

const validatePhoneFormat = (phone: string): boolean => {
  const e164Phone = formatPhoneToE164(phone);
  const ethiopianPhoneRegex = /^\+251[97]\d{8}$/;
  return ethiopianPhoneRegex.test(e164Phone);
};
```

### UI Display
- **Input Placeholder:** `911110000`
- **Country Selector:** Flag icon + `+251` in dark green background
- **Preview:** Show formatted E.164 below input in aquamarine
- **Validation Icon:** Green checkmark when valid

---

## 🎪 Modal & Bottom Sheet Patterns

### Bottom Sheet (Preferred for Mobile)
```typescript
const modal = await modalController.create({
  component: AddMemberModal,
  breakpoints: [0, 0.5, 0.75, 1],
  initialBreakpoint: 0.75,
  cssClass: 'wujo-bottom-sheet'
});
```

**Usage:**
- Add Member
- Set Lottery Date
- Quick Actions
- Filters

### Full Modal
**Usage:**
- Create Iqub (multi-step)
- Profile Edit
- Settings
- Complex forms

---

## ✅ Form Validation Patterns

### Real-Time Validation
- **On Input:** Check format, show errors immediately
- **On Blur:** Validate completeness
- **On Submit:** Final validation

### Visual Feedback
- **Valid:** Green checkmark icon, aquamarine preview text
- **Invalid:** Red border, error message below field
- **Focus:** Aquamarine border, shadow glow
- **Disabled:** 40% opacity, no interaction

### Error Messages
- **Style:** 12px, red color, below field
- **Tone:** Helpful, not accusatory
- **Examples:**
  - ✅ "Please enter a valid Ethiopian phone number"
  - ❌ "Invalid phone"

---

## 🎨 Page Layout Patterns

### Authentication Pages (Login/Signup)
```
┌─────────────────────┐
│   Hero Section      │ ← Dark green gradient
│   Logo + Title      │ ← White text
│                     │
├─────────────────────┤
│                     │
│   Form Container    │ ← White card, rounded top
│   (Inputs)          │ ← White smoke backgrounds
│                     │
│   [Primary CTA]     │ ← Aquamarine, bottom 30%
│                     │
│   Secondary Links   │
└─────────────────────┘
```

### Dashboard Pages
```
┌─────────────────────┐
│   Header            │ ← Dark green
│   Welcome + Stats   │
├─────────────────────┤
│                     │
│   Premium Cards     │ ← Dark green cards
│   (Iqub Info)       │ ← White text
│                     │
│   Action Cards      │ ← White cards
│                     │
├─────────────────────┤
│   [Primary CTA]     │ ← Aquamarine, bottom
│   Tab Bar           │ ← Navigation
└─────────────────────┘
```

### Detail Pages
```
┌─────────────────────┐
│   Header + Back     │ ← Dark green
├─────────────────────┤
│   Hero Card         │ ← Dark green premium card
│   (Main Info)       │
├─────────────────────┤
│   Tabs/Segments     │
│                     │
│   Content Area      │ ← Scrollable
│                     │
│                     │
├─────────────────────┤
│   [Action Button]   │ ← Aquamarine, fixed bottom
└─────────────────────┘
```

---

## 🎯 Accessibility Guidelines

### Color Contrast
- **Dark Green on White:** 12.6:1 (AAA)
- **Aquamarine on Dark Green:** 4.8:1 (AA)
- **White on Dark Green:** 16.2:1 (AAA)

### Touch Targets
- **Minimum:** 44x44px
- **Recommended:** 48x48px
- **Wujo Standard:** 56px height

### Screen Reader Support
- Add `aria-label` to icon-only buttons
- Use semantic HTML (`<button>`, `<input>`)
- Provide error announcements

---

## 🚀 Performance Guidelines

### Image Optimization
- **Logo:** SVG preferred, or PNG at 2x resolution
- **Icons:** Use Ionicons (vector)
- **Photos:** WebP format, lazy load

### Animation Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly

### Bundle Size
- Lazy load routes
- Code split large components
- Tree-shake unused Ionic components

---

## 📝 Code Style

### Vue 3 Script Setup
```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { IonButton, IonCard } from "@ionic/vue";

const isLoading = ref(false);
const formData = ref({ name: "", phone: "" });

const isValid = computed(() => {
  return formData.value.name && formData.value.phone;
});
</script>
```

### CSS Variables
```css
/* Always use Wujo variables */
color: var(--ion-color-dark-green);
background: var(--ion-color-medium-aquamarine);
background: var(--ion-color-white-smoke);
```

### Naming Conventions
- **Components:** PascalCase (`LoginPage.vue`)
- **Variables:** camelCase (`isLoading`)
- **CSS Classes:** kebab-case (`primary-button`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)

---

## 🎉 Success Patterns

### Success Messages
- **Color:** Medium Aquamarine
- **Icon:** Checkmark circle
- **Animation:** Scale in + fade in
- **Duration:** 3 seconds (toast)

### Loading States
- **Spinner:** Aquamarine color
- **Skeleton:** Shimmer effect
- **Overlay:** Dark green with 95% opacity

### Empty States
- **Illustration:** Simple, friendly
- **Message:** Encouraging, actionable
- **CTA:** Aquamarine button

---

## 📚 Resources

### Design Tools
- **Figma:** [Wujo Design System](#)
- **Icons:** Ionicons
- **Fonts:** System fonts (San Francisco, Roboto)

### Code Examples
- **LoginPage.vue:** Ethiopian phone validation, premium UI
- **SignupPage.vue:** Multi-step form, real-time validation
- **variables.css:** Wujo color palette

### References
- [Ionic Design System](https://ionicframework.com/docs/theming/basics)
- [Material Design](https://material.io/design)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** Active - Use for all new UI development

