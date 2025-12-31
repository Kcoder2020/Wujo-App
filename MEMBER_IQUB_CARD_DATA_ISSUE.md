# Member Iqub Card Data Issue - Debugging Guide

## Problem
The `MemberIqubCard` component on the `MemberMyIqubsPage` is showing:
- Progress ring at 0%
- Total collected: 0 ETB
- Missing or incorrect data

## Root Cause Analysis

### Expected Data Structure
The `MemberIqubCard` component expects the following fields from each Iqub object:

```typescript
{
  id: string,
  name: string,
  status: "active" | "completed" | "pending",
  saving_amount: number | string,        // Amount per round
  total_collected: number | string,      // Total amount collected so far
  members_count: number,                 // Total members
  current_members: number,               // Current active members
  next_lottery_date: string | null
}
```

### How the Card Calculates Values

1. **Current Amount** (for progress ring):
   ```typescript
   currentAmount = total_collected || 0
   ```

2. **Target Amount** (for progress ring):
   ```typescript
   targetAmount = saving_amount * members_count
   ```

3. **Completion Percentage**:
   ```typescript
   completionPercentage = (currentAmount / targetAmount) * 100
   ```

## Debugging Steps Added

### 1. Backend API Response Logging
Added console log in `src/store/modules/member.ts`:
```typescript
// Log the raw data to see what we're getting
console.log("Raw joined Iqubs data:", iqubs);
```

### 2. Component Data Logging
Added console logs in `src/components/MemberIqubCard.vue`:
```typescript
onMounted(() => {
  console.log("MemberIqubCard received iqub data:", props.iqub);
  console.log("Saving amount:", props.iqub.saving_amount);
  console.log("Total collected:", props.iqub.total_collected);
  console.log("Members count:", props.iqub.members_count);
  console.log("Current members:", props.iqub.current_members);
});
```

## How to Debug

### Step 1: Check Browser Console
1. Open the app in browser
2. Navigate to Member My Iqubs page
3. Open browser console (F12)
4. Look for the console logs:
   - "Raw joined Iqubs data:" - Shows what API returns
   - "MemberIqubCard received iqub data:" - Shows what component receives

### Step 2: Verify API Response
Check if the API `/joinedIqubs` returns:
- ✅ `saving_amount` field (not `savingAmount`)
- ✅ `total_collected` field (not `totalCollected`)
- ✅ `members_count` field (not `membersCount`)
- ✅ Numeric values (not null or undefined)

### Step 3: Common Issues

#### Issue 1: Field Name Mismatch
**Problem:** API returns camelCase but component expects snake_case
**Solution:** Add data transformation in the store

#### Issue 2: Missing Fields
**Problem:** API doesn't return `total_collected` or `saving_amount`
**Solution:** Backend needs to include these fields in the response

#### Issue 3: Wrong Data Type
**Problem:** Fields are strings when they should be numbers
**Solution:** Parse strings to numbers in the component

#### Issue 4: Null/Undefined Values
**Problem:** Fields exist but are null or undefined
**Solution:** Add fallback values in computed properties

## Potential Solutions

### Solution 1: Add Data Transformation
If API returns different field names, transform in the store:

```typescript
const iqubs = Array.isArray(iqubsData) 
  ? iqubsData.map(iqub => ({
      ...iqub,
      saving_amount: iqub.savingAmount || iqub.saving_amount || 0,
      total_collected: iqub.totalCollected || iqub.total_collected || 0,
      members_count: iqub.membersCount || iqub.members_count || 0,
    }))
  : [];
```

### Solution 2: Update Backend
Ensure `/joinedIqubs` endpoint returns:
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Test Iqub",
      "saving_amount": 1000,
      "total_collected": 5000,
      "members_count": 10,
      "current_members": 10,
      "status": "active",
      "next_lottery_date": "2025-01-15"
    }
  ]
}
```

### Solution 3: Fix Component Calculations
Update `MemberIqubCard.vue` to handle missing data:

```typescript
const currentAmount = computed(() => {
  const total = props.iqub.total_collected || 0;
  return typeof total === "string" ? parseFloat(total) || 0 : total;
});

const savingAmount = computed(() => {
  const amount = props.iqub.saving_amount || 0;
  return typeof amount === "string" ? parseFloat(amount) || 0 : amount;
});

const membersCount = computed(() => {
  return props.iqub.members_count || props.iqub.current_members || 1;
});
```

## Next Steps

1. **Run the app** and check browser console for the debug logs
2. **Copy the console output** showing the raw API data
3. **Compare** the API response with expected structure
4. **Apply the appropriate solution** based on what you find

## Files Modified for Debugging
- ✅ `src/store/modules/member.ts` - Added API response logging
- ✅ `src/components/MemberIqubCard.vue` - Added component data logging

## Files to Check
- `src/views/memberViews/MemberMyIqubsPage.vue` - Page component
- `src/components/MemberIqubCard.vue` - Card component
- `src/store/modules/member.ts` - Data fetching
- Backend `/joinedIqubs` endpoint - API response structure

---

**Status:** 🔍 Debugging logs added - Ready to test
**Next:** Run app and check console output
**Date:** December 28, 2025
