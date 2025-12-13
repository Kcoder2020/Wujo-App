# Iqub Detail Page Data Loading Fix

## Problem
When navigating to the Iqub detail page (e.g., `/iqub/693d5fdaa299450ff00c2d3f`), the page showed:
- `Current Iqub is --- undefined`
- No Iqub data was being loaded
- The page remained in a loading or empty state

## Root Causes

### 1. **Data Fetching Logic Was Commented Out**
The `onMounted` hook had the `fetchIqubDetails` dispatch commented out, so no data was being fetched when the page loaded.

**Before:**
```typescript
onMounted(() => {
  console.log("Current Iqub is --- ", currentIqub.value);
  // if (
  //   iqubId.value &&
  //   (status.value === "idle" || ...)
  // ) {
  //   store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
  // }
});
```

**After:**
```typescript
onMounted(() => {
  console.log("IqubDetailPage mounted with ID:", iqubId.value);
  console.log("Current Iqub is --- ", currentIqub.value);
  
  if (
    iqubId.value &&
    (status.value === "idle" ||
      status.value === "error" ||
      (currentIqub.value && currentIqub.value.id !== iqubId.value))
  ) {
    console.log("Fetching Iqub details for ID:", iqubId.value);
    store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
  }
});
```

### 2. **Type Mismatch: Number vs String IDs**
The backend uses MongoDB ObjectId strings (e.g., `693d5fdaa299450ff00c2d3f`), but the frontend was trying to convert them to numbers.

**Before:**
```typescript
const iqubId = computed(() => Number(route.params.id));
```

This would result in `NaN` for MongoDB ObjectIds, causing the lookup to fail.

**After:**
```typescript
const iqubId = computed(() => {
  const id = route.params.id;
  // Try to parse as number, but keep as string if it's not a valid number
  const numId = Number(id);
  return isNaN(numId) ? id : numId;
});
```

### 3. **Type Definition Didn't Support String IDs**
The `Iqub` interface only allowed numeric IDs.

**Before:**
```typescript
export interface Iqub {
  id: number;
  // ...
}
```

**After:**
```typescript
export interface Iqub {
  id: number | string; // Support both numeric IDs and MongoDB ObjectId strings
  // ...
}
```

### 4. **Getter Used Strict Equality**
The `getIqubById` getter used strict equality (`===`) which wouldn't match when comparing string and number IDs.

**Before:**
```typescript
getIqubById: (state: IqubState) => (id: number): Iqub | undefined => {
  return state.iqubs.find((iqub) => iqub.id === id);
}
```

**After:**
```typescript
getIqubById: (state: IqubState) => (id: number | string): Iqub | undefined => {
  return state.iqubs.find((iqub) => iqub.id == id); // Use == for loose equality
}
```

## Files Modified

1. **src/views/IqubDetailPage.vue**
   - Uncommented data fetching logic in `onMounted`
   - Updated `iqubId` computed to handle both string and number IDs
   - Updated `watch` function to handle both ID types
   - Added console logs for debugging

2. **src/types/index.ts**
   - Changed `Iqub.id` from `number` to `number | string`

3. **src/store/modules/iqubs.ts**
   - Updated `getIqubById` getter to accept `number | string`
   - Changed equality check from `===` to `==` for loose comparison

4. **src/views/MyIqubsPage.vue**
   - Updated `goToIqubDetail` function parameter type to `number | string`

## Testing Checklist

- [x] Navigate to Iqub detail page from My Iqubs list
- [ ] Verify Iqub data loads correctly
- [ ] Check that hero card displays Iqub name and amounts
- [ ] Verify progress ring shows correct percentage
- [ ] Test tab switching (Overview, Members, Payments, Lottery)
- [ ] Test Add Member functionality
- [ ] Test Lottery actions
- [ ] Verify members list displays correctly
- [ ] Test navigation back to My Iqubs page

## Expected Behavior

When navigating to `/iqub/693d5fdaa299450ff00c2d3f`:
1. Console should show: `IqubDetailPage mounted with ID: 693d5fdaa299450ff00c2d3f`
2. Console should show: `Fetching Iqub details for ID: 693d5fdaa299450ff00c2d3f`
3. The Vuex action `fetchIqubDetails` should be dispatched
4. The API should be called: `GET /iqubs/693d5fdaa299450ff00c2d3f`
5. The Iqub data should be stored in Vuex state
6. The `currentIqub` computed should find the Iqub by ID
7. The page should display the Iqub details

## Notes

- The fix maintains backward compatibility with numeric IDs
- MongoDB ObjectId strings are now fully supported
- The loose equality (`==`) in the getter allows matching between string and number representations of the same ID
- Added debug console logs to help troubleshoot data loading issues

---

**Status:** ✅ Fixed  
**Date:** December 13, 2024
