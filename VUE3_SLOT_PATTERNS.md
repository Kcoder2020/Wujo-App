# Vue 3 Slot Patterns - Critical Reference

## 🚨 Common Runtime Error

**Error Message:**
```
Error: Codegen node is missing for element/if/for node. 
Apply appropriate transforms first.
```

**Cause:** Nesting `<template #slot-name>` inside `<template v-if/v-else>`

---

## ✅ Pattern 1: Basic Slot Migration (Vue 2 → Vue 3)

### ❌ Vue 2 (Deprecated)
```vue
<ion-button>
  <ion-icon :icon="checkmark" slot="end"></ion-icon>
</ion-button>

<ion-toolbar>
  <ion-buttons slot="start">
    <ion-button>Back</ion-button>
  </ion-buttons>
</ion-toolbar>
```

### ✅ Vue 3 (Correct)
```vue
<ion-button>
  <template #end>
    <ion-icon :icon="checkmark"></ion-icon>
  </template>
</ion-button>

<ion-toolbar>
  <template #start>
    <ion-buttons>
      <ion-button>Back</ion-button>
    </ion-buttons>
  </template>
</ion-toolbar>
```

**Rule:** Use `<template #slot-name>` instead of `slot="slot-name"`

---

## ✅ Pattern 2: Conditional Content in Slots

### ❌ WRONG (Causes Codegen Error)
```vue
<ion-button>
  <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
  <template v-else>
    <template #start>
      <ion-icon :icon="logIn"></ion-icon>
    </template>
    Sign In
  </template>
</ion-button>
```

**Problem:** `<template #start>` is nested inside `<template v-else>`

### ✅ CORRECT (Solution 1: Move Conditional Inside Slot)
```vue
<ion-button>
  <template #start>
    <ion-icon v-if="!isLoading" :icon="logIn"></ion-icon>
  </template>
  <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
  <span v-else>Sign In</span>
</ion-button>
```

**Solution:** Move the conditional (`v-if`) inside the slot template

### ✅ CORRECT (Solution 2: Separate Conditionals)
```vue
<ion-button>
  <template #start>
    <ion-icon v-show="!isLoading" :icon="logIn"></ion-icon>
  </template>
  <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
  <template v-if="!isLoading">Sign In</template>
</ion-button>
```

**Solution:** Use `v-show` or separate the conditionals

---

## ✅ Pattern 3: Multiple Slots with Conditionals

### ❌ WRONG
```vue
<ion-item>
  <ion-input v-model="value" />
  <template v-if="showIcon">
    <ion-icon :icon="checkmark" slot="end"></ion-icon>
  </template>
</ion-item>
```

### ✅ CORRECT
```vue
<ion-item>
  <ion-input v-model="value" />
  <template #end>
    <ion-icon v-if="showIcon" :icon="checkmark"></ion-icon>
  </template>
</ion-item>
```

**Rule:** Conditionals go INSIDE the slot template, not outside

---

## ✅ Pattern 4: Password Toggle Button

### ❌ WRONG
```vue
<ion-item>
  <ion-input :type="showPassword ? 'text' : 'password'" />
  <ion-button slot="end" @click="togglePassword">
    <ion-icon :icon="showPassword ? eyeOff : eye"></ion-icon>
  </ion-button>
</ion-item>
```

### ✅ CORRECT
```vue
<ion-item>
  <ion-input :type="showPassword ? 'text' : 'password'" />
  <template #end>
    <ion-button fill="clear" @click="togglePassword">
      <ion-icon :icon="showPassword ? eyeOff : eye"></ion-icon>
    </ion-button>
  </template>
</ion-item>
```

---

## ✅ Pattern 5: Button with Icon and Loading State

### ❌ WRONG (Causes Codegen Error)
```vue
<ion-button type="submit" :disabled="isLoading">
  <ion-spinner v-if="isLoading" />
  <template v-else>
    <template #start>
      <ion-icon :icon="personAdd"></ion-icon>
    </template>
    Create Account
  </template>
</ion-button>
```

### ✅ CORRECT
```vue
<ion-button type="submit" :disabled="isLoading">
  <template #start>
    <ion-icon v-if="!isLoading" :icon="personAdd"></ion-icon>
  </template>
  <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
  <span v-else>Create Account</span>
</ion-button>
```

**Key Points:**
1. Slot template (`#start`) is always present
2. Icon inside slot has the conditional (`v-if="!isLoading"`)
3. Spinner and text are in default slot with their own conditionals

---

## 🎯 Quick Rules Summary

### DO ✅
1. Use `<template #slot-name>` for all named slots
2. Put conditionals (v-if, v-else, v-show) INSIDE slot templates
3. Keep slot templates as direct children of the component
4. Use `v-show` if you need to toggle slot content frequently

### DON'T ❌
1. Use `slot="name"` attribute (Vue 2 syntax)
2. Nest `<template #slot>` inside `<template v-if/v-else>`
3. Wrap slot templates with conditional templates
4. Mix Vue 2 and Vue 3 slot syntax

---

## 🔍 Debugging Tips

### If you see: "Codegen node is missing..."
1. Search for `<template v-if` or `<template v-else`
2. Check if there's a `<template #` inside it
3. Move the conditional inside the slot template
4. Or use separate conditionals for each element

### Quick Test
```vue
<!-- ❌ BAD: Nested templates -->
<template v-if="condition">
  <template #slot-name>
    <ion-icon />
  </template>
</template>

<!-- ✅ GOOD: Conditional inside slot -->
<template #slot-name>
  <ion-icon v-if="condition" />
</template>
```

---

## 📚 Real-World Examples from Wujo App

### LoginPage.vue - Sign In Button
```vue
<ion-button
  expand="block"
  type="submit"
  class="primary-signin-button"
  :disabled="isLoggingIn || !isFormValid"
>
  <template #start>
    <ion-icon v-if="!isLoggingIn" :icon="logIn"></ion-icon>
  </template>
  <ion-spinner v-if="isLoggingIn" name="crescent"></ion-spinner>
  <span v-else>Sign In</span>
</ion-button>
```

### SignupPage.vue - Create Account Button
```vue
<ion-button
  expand="block"
  type="submit"
  class="primary-signup-button"
  :disabled="isSigningUp"
>
  <template #start>
    <ion-icon v-if="!isSigningUp" :icon="personAdd"></ion-icon>
  </template>
  <ion-spinner v-if="isSigningUp" name="crescent"></ion-spinner>
  <span v-else>Create Account</span>
</ion-button>
```

### LoginPage.vue - Password Toggle
```vue
<ion-item>
  <ion-label position="stacked">Password</ion-label>
  <ion-input
    v-model="password"
    :type="showPassword ? 'text' : 'password'"
  ></ion-input>
  <template #end>
    <ion-button fill="clear" @click="toggleShowPassword">
      <ion-icon :icon="showPassword ? eyeOff : eye"></ion-icon>
    </ion-button>
  </template>
</ion-item>
```

---

## 🚀 Migration Checklist

When migrating Vue 2 → Vue 3 or fixing slot errors:

- [ ] Replace all `slot="name"` with `<template #name>`
- [ ] Check for nested `<template #slot>` inside `<template v-if/v-else>`
- [ ] Move conditionals inside slot templates
- [ ] Test all buttons with loading states
- [ ] Test all items with end/start slots
- [ ] Verify no runtime "codegen" errors
- [ ] Check browser console for warnings

---

**Last Updated:** December 13, 2024  
**Status:** Critical Reference - Use for all Vue 3 slot implementations  
**Applies to:** Ionic Vue 3 + TypeScript projects
