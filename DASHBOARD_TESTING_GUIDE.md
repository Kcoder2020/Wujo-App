# Collector Dashboard Testing Guide

## Quick Start

### 1. Start the Development Server
```bash
npm run serve
```

### 2. Login as Collector
- Navigate to login page
- Use collector credentials
- Should redirect to `/collector/dashboard`

---

## Test Scenarios

### Scenario 1: Initial Load ✅

**Steps:**
1. Navigate to `/collector/dashboard`
2. Observe loading spinner
3. Wait for data to load

**Expected Results:**
- ✅ Loading spinner appears
- ✅ Dashboard loads with real data
- ✅ Overview cards show correct numbers
- ✅ Recent activities display (up to 15 items)
- ✅ Chart displays with 3-month data by default

**API Call:**
```
GET /api/collector/dashboard
Authorization: Bearer <token>
```

---

### Scenario 2: Overview Cards ✅

**Test Each Card:**

#### Total Collected Card
- ✅ Shows sum of all collected amounts
- ✅ Displays in ETB format (e.g., "520,000")
- ✅ Progress ring shows percentage
- ✅ Trend indicator shows "+12%"
- ✅ Clickable (navigates to reports - not implemented)

#### Total Members Card
- ✅ Shows count of all unique members
- ✅ Displays as number (e.g., "45")
- ✅ Shows "Active" subtitle
- ✅ Trend indicator shows "+3"
- ✅ Clickable (navigates to members - not implemented)

#### Total Iqubs Card
- ✅ Shows count of ALL Iqubs (not just active)
- ✅ Label says "Total Iqubs" (not "Active Iqubs")
- ✅ Subtitle says "All"
- ✅ Clickable (navigates to My Iqubs)

#### Hosted Lotteries Card
- ✅ Shows sum of completed credit rounds
- ✅ Displays as number (e.g., "12")
- ✅ Shows "Completed" subtitle
- ✅ Clickable (navigates to lottery history - not implemented)

---

### Scenario 3: Recent Activities ✅

**Test Activity Feed:**
- ✅ Shows up to 15 recent activities
- ✅ Activities from last 30 days
- ✅ Sorted by timestamp (newest first)
- ✅ Each activity shows:
  - Icon (lottery/payment/member/iqub_created)
  - Title
  - Description
  - Relative time (e.g., "2h ago", "Yesterday")
- ✅ Activities are NOT clickable (future feature)
- ✅ No "View All" button (future feature)

**Activity Types:**
- 🏆 Lottery: Trophy icon, aquamarine background
- 💰 Payment: Cash icon, dark green background
- 👤 Member: Person icon, aquamarine background
- 📋 Iqub Created: Document icon, aquamarine background

**Empty State:**
- ✅ Shows when no activities
- ✅ Displays empty icon and message

---

### Scenario 4: Monthly Collections Chart ✅

**Default View (3 Months):**
- ✅ Chart displays with 3 months of data
- ✅ Line chart with gradient fill
- ✅ Two lines: Collected (solid) and Target (dashed)
- ✅ Wujo colors (aquamarine and dark green)
- ✅ Interactive tooltips with ETB formatting
- ✅ Legend shows "Collected" and "Target"
- ✅ X-axis shows month abbreviations (Oct, Nov, Dec)
- ✅ Y-axis shows amounts in compact format (150K, 180K, etc.)

**Period Selector:**
- ✅ Three options: 1M, 3M, 6M
- ✅ Default selected: 3M
- ✅ Clicking changes chart data
- ✅ Makes API call for new period
- ✅ Chart updates smoothly

**API Calls:**
```
GET /api/collector/dashboard/collections?period=1month
GET /api/collector/dashboard/collections?period=3months
GET /api/collector/dashboard/collections?period=6months
```

**Empty State:**
- ✅ Shows when no collection data
- ✅ Displays empty icon and message

---

### Scenario 5: Quick Actions ✅

**Test Buttons:**

#### Create Iqub
- ✅ Button displays with add icon
- ✅ Navigates to `/collector/create-iqub`
- ✅ Works correctly

#### View Reports
- ✅ Button displays with document icon
- ✅ Logs message (not implemented yet)
- ✅ Does not navigate (future feature)

**Removed Actions:**
- ❌ Add Member (removed - Iqub-specific)
- ❌ Host Lottery (removed - Iqub-specific)

---

### Scenario 6: Primary Action Button ✅

**Test Button:**
- ✅ Says "Create New Iqub" (not "Host Lottery Now")
- ✅ Has add circle icon (not sparkles)
- ✅ Aquamarine background
- ✅ Navigates to `/collector/create-iqub`
- ✅ Works correctly

---

### Scenario 7: Refresh Functionality ✅

**Test Floating Refresh Button:**
- ✅ Button visible in bottom-right corner
- ✅ Dark green background
- ✅ Refresh icon
- ✅ Clicking triggers refresh
- ✅ Button disabled during refresh
- ✅ Success toast appears
- ✅ All data updates

**API Call:**
```
GET /api/collector/dashboard
```

**Expected Behavior:**
- ✅ Loading state NOT shown (background refresh)
- ✅ Data updates seamlessly
- ✅ Toast notification confirms success
- ✅ Chart and cards update

---

### Scenario 8: Loading States ✅

**Test Loading:**
1. Clear cache or use slow network
2. Navigate to dashboard
3. Observe loading state

**Expected Results:**
- ✅ Spinner appears in main content area
- ✅ Message says "Loading dashboard..."
- ✅ Hero section still visible
- ✅ No error messages
- ✅ Smooth transition to content

---

### Scenario 9: Error States ✅

**Test Error Handling:**

#### Network Error
1. Disconnect internet
2. Navigate to dashboard or refresh
3. Observe error state

**Expected Results:**
- ✅ Error icon appears (red alert circle)
- ✅ Title says "Failed to Load Dashboard"
- ✅ Error message displays
- ✅ Retry button appears
- ✅ Clicking retry attempts to reload

#### Authentication Error
1. Remove or invalidate token
2. Navigate to dashboard
3. Observe error

**Expected Results:**
- ✅ Error message about authentication
- ✅ Retry button available
- ✅ Can manually navigate to login

#### API Error
1. Backend returns error response
2. Observe error state

**Expected Results:**
- ✅ Error message from API displayed
- ✅ Retry button works
- ✅ User can recover

---

### Scenario 10: Responsive Design ✅

**Test Different Screen Sizes:**

#### Mobile (< 768px)
- ✅ Cards in 2-column grid
- ✅ Quick actions in 2-column grid
- ✅ Chart responsive
- ✅ Activities stack vertically
- ✅ All content readable

#### Tablet (768px - 1024px)
- ✅ Cards in 4-column grid
- ✅ Quick actions in 4-column grid
- ✅ Chart larger
- ✅ Better spacing

#### Desktop (> 1024px)
- ✅ Same as tablet
- ✅ Maximum width maintained
- ✅ Centered layout

---

## Edge Cases

### Empty Dashboard (New Collector)
**Scenario:** Collector with no Iqubs

**Expected Data:**
```json
{
  "overview": {
    "total_collected": 0,
    "total_members": 0,
    "total_iqubs": 0,
    "hosted_lotteries": 0
  },
  "recent_activities": [],
  "monthly_collections": {
    "period": "3months",
    "data": []
  }
}
```

**Expected UI:**
- ✅ All cards show "0"
- ✅ Progress ring at 0%
- ✅ "No recent activity" message
- ✅ "No collection data available" for chart
- ✅ Quick actions still work

---

### Single Iqub
**Scenario:** Collector with one Iqub

**Expected:**
- ✅ Stats reflect single Iqub
- ✅ Activities show Iqub creation
- ✅ Chart shows collections
- ✅ Everything works normally

---

### Multiple Iqubs
**Scenario:** Collector with 3+ Iqubs

**Expected:**
- ✅ Stats aggregate across all Iqubs
- ✅ Activities mixed from all Iqubs
- ✅ Chart shows total collections
- ✅ Everything works normally

---

### Large Numbers
**Scenario:** Very large amounts (millions)

**Expected:**
- ✅ Numbers formatted correctly (1,000,000)
- ✅ Chart Y-axis uses compact notation (1M)
- ✅ No overflow issues
- ✅ Tooltips show full amounts

---

### Many Activities
**Scenario:** More than 15 activities

**Expected:**
- ✅ Only top 15 shown
- ✅ Sorted by timestamp
- ✅ No pagination (future feature)
- ✅ Scrollable if needed

---

## Performance Testing

### Load Time
- ✅ Initial load < 2 seconds
- ✅ Refresh < 1 second
- ✅ Period change < 1 second
- ✅ Smooth animations

### Memory Usage
- ✅ No memory leaks
- ✅ Chart destroys properly
- ✅ Store data cleaned up

### Network
- ✅ Single API call on load
- ✅ Minimal data transfer
- ✅ Proper caching

---

## Browser Compatibility

### Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Browsers
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Android Firefox

---

## Accessibility

### Keyboard Navigation
- ✅ Tab through all interactive elements
- ✅ Enter/Space activates buttons
- ✅ Focus indicators visible

### Screen Readers
- ✅ All content readable
- ✅ Icons have labels
- ✅ Loading states announced
- ✅ Error messages announced

### Color Contrast
- ✅ Text readable on backgrounds
- ✅ Icons visible
- ✅ Chart colors distinguishable

---

## Common Issues & Solutions

### Issue: Dashboard shows 0 for everything
**Solution:** Check if API is returning data correctly

### Issue: Chart not displaying
**Solution:** Check if monthly_collections.data has items

### Issue: Activities not showing
**Solution:** Check if recent_activities array has items

### Issue: Loading forever
**Solution:** Check network tab for API errors

### Issue: Error state stuck
**Solution:** Check console for error messages, verify token

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_collected": 520000,
      "total_members": 45,
      "total_iqubs": 3,
      "hosted_lotteries": 12
    },
    "recent_activities": [
      {
        "id": 1,
        "type": "lottery",
        "title": "Lottery Winner Announced",
        "description": "Abebe Kebede won the lottery for Damay Iqub",
        "timestamp": "2025-12-29T10:30:00Z"
      }
    ],
    "monthly_collections": {
      "period": "3months",
      "data": [
        { "month": "Oct", "amount": 150000, "target": 200000 },
        { "month": "Nov", "amount": 180000, "target": 200000 },
        { "month": "Dec", "amount": 190000, "target": 200000 }
      ]
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## Checklist

### Before Testing
- [ ] Backend API is running
- [ ] Database has test data
- [ ] Collector account exists
- [ ] Token is valid

### During Testing
- [ ] Test all scenarios above
- [ ] Check console for errors
- [ ] Verify API calls in Network tab
- [ ] Test on different devices
- [ ] Test with different data sets

### After Testing
- [ ] Document any bugs found
- [ ] Verify all features work
- [ ] Check performance metrics
- [ ] Confirm user experience

---

**Happy Testing! 🎉**
