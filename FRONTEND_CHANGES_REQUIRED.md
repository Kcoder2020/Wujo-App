# Frontend Changes Required - Credit Round Integration

## Overview
Three API endpoints have been updated to support credit rounds. All three now return consistent data structures with new fields and changed values.

---

## 🔴 BREAKING CHANGES

### Changed Field Values
These fields now return different values - **your UI will show incorrect data until updated:**

| Field | Old Value | New Value | Impact |
|-------|-----------|-----------|--------|
| `stats.total_rounds` | 10 | 70 | Progress bars will show wrong max value |
| `stats.completion_percentage` | 10% | 1% | Progress will appear inflated |
| `iqub.total_rounds` | 10 | 70 | Total rounds display will be wrong |
| `payment_stats.completion_percentage` | 10% | 1% | Progress will appear inflated |

### New Fields Added
These fields are now available in responses:

- `current_credit_round` (object) - Credit round information
- `iqub.credit_round` (number) - Total credit rounds
- `iqub.saving_rounds_per_credit_round` (number) - Saving rounds per credit round

---

## 📋 Affected Endpoints

### 1. Member Iqub Details
**Endpoint:** `GET /api/member/iqub/:iqubId`
**Used by:** Member dashboard, member Iqub details page

### 2. Collector Member Details  
**Endpoint:** `GET /api/members/:memberId/iqub/:iqubId`
**Used by:** Collector viewing individual member details

### 3. Credit Round Status (NEW)
**Endpoint:** `GET /api/iqubs/:iqubId/credit-round-status`
**Used by:** Collector dashboard for credit round tracking

---

## 🔧 Required Changes

### Step 1: Update TypeScript Interfaces

**File:** `src/types/api.ts` (or wherever you define types)

```typescript
// Add this new interface
interface CreditRoundInfo {
  credit_round_number: number;
  saving_round_range: {
    start: number;
    end: number;
  };
  total_credit_rounds: number;
  saving_rounds_per_credit_round: number;
  member_progress: {
    completed_saving_rounds: number;
    required_saving_rounds: number;
    is_complete: boolean;
  };
}

// Update existing interfaces
interface MemberIqubDetailsResponse {
  iqub: {
    id: string;
    name: string;
    saving_amount: number;
    credit_amount: number;
    members_count: number;
    half_contributors: number;
    effective_members: number;
    current_members: number;
    status: 'pending' | 'active' | 'completed';
    next_lottery_date: string | null;
  };
  member: {
    id: string;
    name: string;
    phone: string;
    avatar: string | null;
    contribution_type: 'full' | 'half';
    join_date: string;
    saving_rounds: number;
    has_won: boolean;
  };
  current_credit_round: CreditRoundInfo;  // ← NEW
  stats: {
    total_saved: number;
    current_round: number;
    total_rounds: number;  // ← VALUE CHANGED (10 → 70)
    completion_percentage: number;  // ← VALUE CHANGED (10 → 1)
    lottery_position: number;
  };
  payment_history: Array<{
    round_number: number;
    amount: number;
    payment_method: 'manual' | 'chapa';
    status: 'success' | 'pending' | 'failed';
    paid_at: string;
    chapa_tx_ref: string | null;
  }>;
}

interface CollectorMemberDetailsResponse {
  member: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    avatar: string | null;
    contribution_type: 'full' | 'half';
    join_date: string;
    saving_rounds: number;  // ← NEW
    has_won: boolean;  // ← NEW
  };
  iqub: {
    id: string;
    name: string;
    total_rounds: number;  // ← VALUE CHANGED (10 → 70)
    credit_round: number;  // ← NEW
    saving_rounds_per_credit_round: number;  // ← NEW
  };
  current_credit_round: CreditRoundInfo;  // ← NEW
  payment_stats: {
    current_round: number;
    total_paid: number;  // ← VALUE CHANGED (now member's total, not all members)
    total_expected: number;
    completion_percentage: number;  // ← VALUE CHANGED (10 → 1)
  };
  payment_history: Array<{  // ← STRUCTURE CHANGED
    id: string;
    round_number: number;
    amount: number;  // ← VALUE CHANGED (member's payment, not round total)
    payment_date: string;
    payment_method: 'manual' | 'chapa';
    status: 'success' | 'pending' | 'failed';  // ← CHANGED (member's status)
    chapa_tx_ref: string | null;
    verification_id: string | null;
  }>;
  pending_verifications: Array<{
    id: string;
    member_id: string;
    iqub_id: string;
    round_number: number;
    amount: number;
    receipt_urls: string[];
    submission_date: string;
    status: string;
    member_notes: string;
  }>;
}

interface CreditRoundStatusResponse {
  success: boolean;
  data: {
    iqub: {
      id: string;
      name: string;
      total_credit_rounds: number;
      saving_rounds_per_credit_round: number;
    };
    current_credit_round: {
      credit_round_number: number;
      saving_round_range: {
        start: number;
        end: number;
      };
      total_saving_rounds: number;
      completion_percentage: number;
      is_complete: boolean;
      can_initiate_lottery: boolean;
    };
    members: Array<{
      member_id: string;
      user_id: {
        _id: string;
        name: string;
        phone: string;
      };
      name: string;
      phone: string;
      contribution_type: 'full' | 'half';
      saving_rounds: Array<{
        saving_round_number: number;
        status: 'not_started' | 'pending' | 'verified' | 'failed';
        amount: number;
        payment_date: string | null;
      }>;
      completed_count: number;
      required_count: number;
      is_complete: boolean;
    }>;
  };
}
```

---

### Step 2: Update Member Dashboard Component

**File:** `src/components/MemberDashboard.tsx` (or similar)

```typescript
// BEFORE
<div>
  <h3>Progress: {data.stats.completion_percentage}%</h3>
  <ProgressBar value={data.member.saving_rounds} max={data.stats.total_rounds} />
  <p>{data.member.saving_rounds} of {data.stats.total_rounds} rounds completed</p>
</div>

// AFTER - Add Credit Round Info
<div>
  {/* Current Credit Round Card */}
  <div className="credit-round-card">
    <h3>Current Credit Round: {data.current_credit_round.credit_round_number} of {data.current_credit_round.total_credit_rounds}</h3>
    <p>Saving Rounds: {data.current_credit_round.saving_round_range.start}-{data.current_credit_round.saving_round_range.end}</p>
    
    <ProgressBar 
      value={data.current_credit_round.member_progress.completed_saving_rounds} 
      max={data.current_credit_round.member_progress.required_saving_rounds}
    />
    <p>
      {data.current_credit_round.member_progress.completed_saving_rounds} of {data.current_credit_round.member_progress.required_saving_rounds} rounds in this credit round
    </p>
    
    {data.current_credit_round.member_progress.is_complete && (
      <div className="badge-success">✓ Credit Round Complete!</div>
    )}
  </div>

  {/* Overall Progress Card */}
  <div className="overall-progress-card">
    <h3>Overall Progress: {data.stats.completion_percentage}%</h3>
    <ProgressBar value={data.member.saving_rounds} max={data.stats.total_rounds} />
    <p>{data.member.saving_rounds} of {data.stats.total_rounds} total rounds completed</p>
  </div>

  {/* Next Payment Info */}
  <div className="next-payment-card">
    <h3>Next Payment</h3>
    <p>Round {data.stats.current_round}</p>
    <p>Amount: {data.iqub.saving_amount} ETB</p>
    <button>Pay Now</button>
  </div>
</div>
```

---

### Step 3: Update Collector Member Details Component

**File:** `src/components/CollectorMemberDetails.tsx` (or similar)

```typescript
// BEFORE
<div>
  <h2>{data.member.name}</h2>
  <p>Progress: {data.payment_stats.completion_percentage}%</p>
  <p>{data.member.saving_rounds} of {data.iqub.total_rounds} rounds</p>
  
  <h3>Payment History</h3>
  {data.payment_history.map(payment => (
    <div key={payment.round_number}>
      Round {payment.round_number}: {payment.amount} ETB - {payment.status}
    </div>
  ))}
</div>

// AFTER - Add Credit Round Info and Fix Payment Display
<div>
  <h2>{data.member.name}</h2>
  <p>Contribution Type: {data.member.contribution_type === 'full' ? 'Full' : 'Half'}</p>
  
  {/* Current Credit Round */}
  <div className="credit-round-section">
    <h3>Current Credit Round: {data.current_credit_round.credit_round_number} of {data.current_credit_round.total_credit_rounds}</h3>
    <p>Saving Rounds: {data.current_credit_round.saving_round_range.start}-{data.current_credit_round.saving_round_range.end}</p>
    
    <ProgressBar 
      value={data.current_credit_round.member_progress.completed_saving_rounds}
      max={data.current_credit_round.member_progress.required_saving_rounds}
    />
    <p>
      {data.current_credit_round.member_progress.completed_saving_rounds}/{data.current_credit_round.member_progress.required_saving_rounds} rounds completed
    </p>
    
    {data.current_credit_round.member_progress.is_complete ? (
      <span className="badge-success">✓ Complete</span>
    ) : (
      <span className="badge-warning">In Progress</span>
    )}
  </div>

  {/* Overall Progress */}
  <div className="overall-progress-section">
    <h3>Overall Progress</h3>
    <p>{data.payment_stats.completion_percentage}% Complete</p>
    <p>{data.member.saving_rounds} of {data.iqub.total_rounds} total rounds</p>
    <p>Total Paid: {data.payment_stats.total_paid} ETB</p>
  </div>

  {/* Payment History - Now shows only this member's payments */}
  <div className="payment-history-section">
    <h3>Payment History</h3>
    {data.payment_history.length === 0 ? (
      <p>No payments yet</p>
    ) : (
      data.payment_history.map(payment => (
        <div key={payment.id} className="payment-item">
          <span>Round {payment.round_number}</span>
          <span>{payment.amount} ETB</span>
          <span className={`status-${payment.status}`}>
            {payment.status === 'success' ? '✓ Paid' : 
             payment.status === 'pending' ? '⏳ Pending' : 
             '❌ Failed'}
          </span>
          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
        </div>
      ))
    )}
  </div>

  {/* Pending Verifications */}
  {data.pending_verifications.length > 0 && (
    <div className="pending-verifications-section">
      <h3>Pending Verifications</h3>
      {data.pending_verifications.map(verification => (
        <div key={verification.id} className="verification-item">
          <p>Round {verification.round_number}: {verification.amount} ETB</p>
          <p>Submitted: {new Date(verification.submission_date).toLocaleDateString()}</p>
          <button onClick={() => handleVerify(verification.id)}>Verify</button>
          <button onClick={() => handleReject(verification.id)}>Reject</button>
        </div>
      ))}
    </div>
  )}
</div>
```

---

### Step 4: Add Credit Round Status Component (NEW)

**File:** `src/components/CollectorCreditRoundStatus.tsx` (new file)

```typescript
import React, { useState, useEffect } from 'react';
import { CreditRoundStatusResponse } from '../types/api';

interface Props {
  iqubId: string;
  token: string;
}

export const CollectorCreditRoundStatus: React.FC<Props> = ({ iqubId, token }) => {
  const [data, setData] = useState<CreditRoundStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/iqubs/${iqubId}/credit-round-status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [iqubId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>No data</div>;

  const { current_credit_round, members, iqub } = data.data;

  return (
    <div className="credit-round-status">
      {/* Header */}
      <div className="header">
        <h2>{iqub.name}</h2>
        <h3>Credit Round {current_credit_round.credit_round_number} of {iqub.total_credit_rounds}</h3>
        <p>Saving Rounds {current_credit_round.saving_round_range.start}-{current_credit_round.saving_round_range.end}</p>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${current_credit_round.completion_percentage}%` }}
          />
        </div>
        <p>{current_credit_round.completion_percentage}% Complete</p>
      </div>

      {/* Lottery Button */}
      <button
        onClick={handleInitiateLottery}
        disabled={!current_credit_round.can_initiate_lottery}
        className={current_credit_round.can_initiate_lottery ? 'btn-primary' : 'btn-disabled'}
      >
        {current_credit_round.can_initiate_lottery 
          ? 'Initiate Lottery' 
          : 'Waiting for All Payments'}
      </button>

      {/* Members Table */}
      <table className="members-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Type</th>
            {Array.from(
              { length: current_credit_round.total_saving_rounds },
              (_, i) => current_credit_round.saving_round_range.start + i
            ).map(roundNum => (
              <th key={roundNum}>Round {roundNum}</th>
            ))}
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.member_id}>
              <td>
                <div>{member.name}</div>
                <div className="phone">{member.phone}</div>
              </td>
              <td>{member.contribution_type === 'full' ? 'Full' : 'Half'}</td>
              {member.saving_rounds.map(round => (
                <td key={round.saving_round_number}>
                  <StatusBadge status={round.status} amount={round.amount} />
                </td>
              ))}
              <td>
                {member.completed_count}/{member.required_count}
                {member.is_complete && ' ✓'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string; amount: number }> = ({ status, amount }) => {
  const icons = {
    verified: '✓',
    pending: '⏳',
    failed: '❌',
    not_started: '⚪'
  };

  const colors = {
    verified: 'green',
    pending: 'yellow',
    failed: 'red',
    not_started: 'gray'
  };

  return (
    <span 
      className={`status-badge status-${colors[status]}`}
      title={`${status} - ${amount} ETB`}
    >
      {icons[status]}
    </span>
  );
};
```

---

### Step 5: Update API Service Functions

**File:** `src/services/api.ts` (or similar)

```typescript
// Update existing function
export async function getMemberIqubDetails(
  iqubId: string,
  token: string
): Promise<MemberIqubDetailsResponse> {
  const response = await fetch(
    `${API_URL}/api/member/iqub/${iqubId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

// Update existing function
export async function getCollectorMemberDetails(
  memberId: string,
  iqubId: string,
  token: string
): Promise<CollectorMemberDetailsResponse> {
  const response = await fetch(
    `${API_URL}/api/members/${memberId}/iqub/${iqubId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

// Add new function
export async function getCreditRoundStatus(
  iqubId: string,
  token: string
): Promise<CreditRoundStatusResponse> {
  const response = await fetch(
    `${API_URL}/api/iqubs/${iqubId}/credit-round-status`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}
```

---

## 🎨 CSS Styles

**File:** `src/styles/creditRound.css` (new file)

```css
/* Credit Round Card */
.credit-round-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.credit-round-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status-green {
  background-color: #d4edda;
  color: #155724;
}

.status-yellow {
  background-color: #fff3cd;
  color: #856404;
}

.status-red {
  background-color: #f8d7da;
  color: #721c24;
}

.status-gray {
  background-color: #e9ecef;
  color: #6c757d;
}

/* Badge Success */
.badge-success {
  display: inline-block;
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.badge-warning {
  display: inline-block;
  padding: 6px 12px;
  background-color: #ffc107;
  color: #333;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

/* Members Table */
.members-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.members-table th,
.members-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.members-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.phone {
  font-size: 12px;
  color: #666;
}

/* Buttons */
.btn-primary {
  background-color: #4caf50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px 0;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-disabled {
  background-color: #ccc;
  color: #666;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: not-allowed;
  font-size: 16px;
  margin: 20px 0;
}
```

---

## ✅ Testing Checklist

After making changes:

- [ ] Update TypeScript interfaces
- [ ] Update Member Dashboard component
- [ ] Update Collector Member Details component
- [ ] Add Credit Round Status component
- [ ] Update API service functions
- [ ] Add CSS styles
- [ ] Test member viewing their own Iqub
- [ ] Test collector viewing member details
- [ ] Test collector viewing credit round status
- [ ] Verify progress bars show correct values
- [ ] Verify completion percentages are accurate
- [ ] Test lottery button enable/disable logic
- [ ] Test on mobile devices

---

## 🚨 Common Issues & Solutions

### Issue: Progress shows 100% when it should be 1%
**Solution:** You're still using old `total_rounds` value. Update to use new value from API.

### Issue: Payment history shows wrong amounts
**Solution:** Collector member details endpoint now returns member's payments only. Update display logic.

### Issue: Can't find `current_credit_round` field
**Solution:** Make sure you're using the updated API response. Check TypeScript interfaces.

### Issue: Lottery button not enabling
**Solution:** Check `current_credit_round.can_initiate_lottery` field, not just completion percentage.

---S

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API responses match new structure
3. Ensure TypeScript interfaces are updated
4. Check that you're using correct field names

---

**All changes are backward compatible at the API level, but UI will show incorrect data until frontend is updated!**
