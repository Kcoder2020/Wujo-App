# CreateIqubPage - Visual Flow Guide

## 🎨 **Step-by-Step Visual Flow**

---

### **Step 1: Basic Info**

```
┌─────────────────────────────────────────┐
│         Basic Information               │
├─────────────────────────────────────────┤
│                                         │
│  Iqub Name                              │
│  [Nimani Family Iqub____________]      │
│                                         │
│  Credit Amount (ETB)                    │
│  [10,000_____________________]          │
│  ℹ️ Total amount each member receives   │
│                                         │
│  Credit Pattern                         │
│  ┌──────┐ ┌──────┐                     │
│  │Daily │ │Weekly│                     │
│  │1 day │ │7 days│                     │
│  └──────┘ └──────┘                     │
│  ┌──────┐ ┌────────┐                   │
│  │Month │ │ Custom │ ← Dashed border  │
│  │30 day│ │Specify │                   │
│  └──────┘ └────────┘                   │
│                                         │
│  When Custom selected:                 │
│  ┌─────────────────────────────────┐   │
│  │ ← Back to selection             │   │
│  │                                 │   │
│  │ Custom Days                     │   │
│  │ [15_________________________]   │   │
│  │ ℹ️ Enter number of days         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Iqub Duration (Days)                   │
│  [360_____________________]             │
│                                         │
│  ℹ️ Estimated Duration: ~12 months      │
│                                         │
│              [Next →]                   │
└─────────────────────────────────────────┘
```

---

### **Step 2: Financial**

```
┌─────────────────────────────────────────┐
│         Financial Details               │
├─────────────────────────────────────────┤
│                                         │
│  Saving Amount (ETB)                    │
│  [1,000_____________________]           │
│  ℹ️ Amount each member contributes      │
│                                         │
│  Saving Pattern                         │
│  ┌──────┐ ┌──────┐                     │
│  │Daily │ │Weekly│                     │
│  │1 day │ │7 days│                     │
│  └──────┘ └──────┘                     │
│  ┌──────┐ ┌────────┐                   │
│  │Month │ │ Custom │                   │
│  │30 day│ │Specify │                   │
│  └──────┘ └────────┘                   │
│                                         │
│  Members                                │
│  ☐ Include half contributors  [Toggle] │
│                                         │
│  Full Contributors                      │
│  [10_________________________]          │
│                                         │
│  When toggle ON:                        │
│  Half Contributors                      │
│  [4__________________________]          │
│  ℹ️ 2 half contributors = 1 full member │
│                                         │
│  💡 Effective Members                   │
│  10 full + 4 half = 12 effective       │
│                                         │
│         [← Previous]  [Next →]          │
└─────────────────────────────────────────┘
```

---

### **Step 3: Review & Confirm**

```
┌─────────────────────────────────────────┐
│         Review & Confirm                │
├─────────────────────────────────────────┤
│                                         │
│  📋 Iqub Details                        │
│  ┌─────────────────────────────────┐   │
│  │ Name: Nimani Family Iqub        │   │
│  │ Credit Amount: 10,000 ETB       │   │
│  │ Credit Pattern: Weekly (7 days) │   │
│  │ Iqub Duration: 360 days         │   │
│  │ Saving Amount: 1,000 ETB        │   │
│  │ Saving Pattern: Monthly (30 d)  │   │
│  │ Members: 10 full + 4 half       │   │
│  │          = 12 effective          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 Calculations                        │
│  ┌─────────────────────────────────┐   │
│  │ Total per Round: 12,000 ETB     │   │
│  │ Total Iqub Value: 120,000 ETB   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💡 Review & Adjust                     │
│  ┌─────────────────────────────────┐   │
│  │ These values are calculated     │   │
│  │ automatically. You can adjust.  │   │
│  │                                 │   │
│  │ Credit Rounds                   │   │
│  │ Number of payout rounds         │   │
│  │              [−] 12 [+]         │   │
│  │                                 │   │
│  │ Saving Rounds                   │   │
│  │ Number of contribution rounds   │   │
│  │              [−] 12 [+]         │   │
│  └─────────────────────────────────┘   │
│  ↑ Highlighted with gradient background│
│                                         │
│  ☑ I agree to terms and conditions     │
│                                         │
│         [← Previous]  [Create Iqub]     │
└─────────────────────────────────────────┘
```

---

## 🎨 **Color Coding:**

### **Pattern Cards:**
- **Default**: Light gray background (#F2F2F2)
- **Active**: Aquamarine background (#5FD9AC)
- **Custom**: Dashed aquamarine border

### **Adjustable Card:**
- **Background**: Gradient (aquamarine to light green)
- **Border**: Solid aquamarine (2px)
- **Buttons**: Aquamarine color
- **Numbers**: Large, bold, dark green

### **Info Cards:**
- **Background**: Light aquamarine (10% opacity)
- **Icon**: Aquamarine
- **Text**: Dark green

---

## 📱 **Mobile Layout:**

### **Pattern Cards Grid:**
```
┌──────┐ ┌──────┐
│Daily │ │Weekly│
└──────┘ └──────┘
┌──────┐ ┌──────┐
│Month │ │Custom│
└──────┘ └──────┘
```
2x2 grid for better mobile experience

### **Adjustable Controls:**
```
Credit Rounds              [−] 12 [+]
Number of payout rounds
```
Buttons on the right, labels on the left

---

## 🔄 **User Flow:**

```
Start
  ↓
Step 1: Basic Info
  ├─ Enter name
  ├─ Enter credit amount
  ├─ Select credit pattern
  │   ├─ Daily/Weekly/Monthly → Continue
  │   └─ Custom → Enter days → Continue
  └─ Enter duration
  ↓
[Next] button enabled when all filled
  ↓
Step 2: Financial
  ├─ Enter saving amount
  ├─ Select saving pattern
  │   ├─ Daily/Weekly/Monthly → Continue
  │   └─ Custom → Enter days → Continue
  ├─ Enter full contributors
  └─ Optional: Toggle half contributors
      └─ Enter half contributors (even number)
  ↓
[Next] button enabled when all valid
  ↓
Step 3: Review
  ├─ Review all details
  ├─ See auto-calculated rounds
  ├─ Adjust credit_round if needed
  ├─ Adjust saving_round if needed
  └─ Accept terms
  ↓
[Create Iqub] button enabled
  ↓
Submit to backend
  ↓
Success animation
  ↓
Navigate to My Iqubs
```

---

## ✨ **Interactive Elements:**

### **Pattern Cards:**
- **Hover**: Slight scale up
- **Click**: Scale down (0.98)
- **Active**: Scale up (1.05) + aquamarine background

### **Custom Input:**
- **Show**: Slide in animation
- **Hide**: Fade out when returning to cards

### **Toggle:**
- **ON**: Aquamarine color
- **OFF**: Gray color
- **Smooth**: Transition animation

### **Adjust Buttons:**
- **Click**: Immediate value change
- **Visual**: Button press animation
- **Number**: Smooth transition

---

## 🎯 **Key Visual Indicators:**

1. **Custom Pattern Available**: Dashed border on Custom card
2. **Half Contributors Option**: Toggle switch prominently placed
3. **Effective Members**: Info card with formula
4. **Adjustable Values**: Gradient background + border
5. **Required Fields**: Red error messages below inputs
6. **Helper Texts**: Gray text with info icon

---

**This visual guide helps understand the complete user experience!** 🎨
