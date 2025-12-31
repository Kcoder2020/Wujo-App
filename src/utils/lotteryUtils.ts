import { EligibleMember, WheelSegment } from "../types/lottery";

// Wujo brand colors for wheel segments
const DARK_GREEN_PRIMARY = "#014023";
const DARK_GREEN_SECONDARY = "#016630";

/**
 * Generates wheel segments from eligible members.
 * Full contributors get individual segments.
 * Half contributors are paired into single segments.
 *
 * @param members - Array of eligible members
 * @returns Array of wheel segments
 */
export function generateWheelSegments(
  members: EligibleMember[]
): WheelSegment[] {
  const segments: WheelSegment[] = [];

  // Filter out members who have already won
  const eligibleMembers = members.filter((m) => !m.has_won);

  // Separate full and half contributors
  const fullContributors = eligibleMembers.filter(
    (m) => m.contribution_type === "full"
  );
  const halfContributors = eligibleMembers.filter(
    (m) => m.contribution_type === "half"
  );

  // Add full contributors as individual segments
  fullContributors.forEach((member) => {
    segments.push({
      id: member.member_id,
      label: member.name,
      color:
        segments.length % 2 === 0 ? DARK_GREEN_PRIMARY : DARK_GREEN_SECONDARY,
      isPair: false,
      members: [{ id: member.member_id, name: member.name }],
    });
  });

  // Pair half contributors and add as single segments
  for (let i = 0; i < halfContributors.length; i += 2) {
    if (i + 1 < halfContributors.length) {
      const pair = [halfContributors[i], halfContributors[i + 1]];
      segments.push({
        id: `pair_${pair[0].member_id}_${pair[1].member_id}`,
        label: `${pair[0].name} & ${pair[1].name}`,
        color:
          segments.length % 2 === 0 ? DARK_GREEN_PRIMARY : DARK_GREEN_SECONDARY,
        isPair: true,
        members: pair.map((m) => ({ id: m.member_id, name: m.name })),
      });
    }
  }

  return segments;
}

/**
 * Calculates the rotation needed to land on the winner's segment.
 * Adds random extra spins for dramatic effect.
 *
 * @param segments - Array of wheel segments
 * @param winnerId - The ID of the winning member or pair segment
 * @returns Rotation angle in degrees
 */
export function calculateWinningRotation(
  segments: WheelSegment[],
  winnerId: string
): number {
  if (segments.length === 0) {
    throw new Error("No segments provided");
  }

  const segmentAngle = 360 / segments.length;

  // Find the winner's segment index - try multiple matching strategies
  let winnerIndex = segments.findIndex(
    (s) => s.id === winnerId || s.members.some((m) => m.id === winnerId)
  );

  // If not found, try string comparison (in case of type mismatch)
  if (winnerIndex === -1) {
    winnerIndex = segments.findIndex(
      (s) =>
        String(s.id) === String(winnerId) ||
        s.members.some((m) => String(m.id) === String(winnerId))
    );
  }

  if (winnerIndex === -1) {
    console.error("Winner not found in segments");
    console.error("Winner ID:", winnerId);
    console.error(
      "Segment IDs:",
      segments.map((s) => ({ id: s.id, members: s.members.map((m) => m.id) }))
    );
    throw new Error("Winner not found in segments");
  }

  // Calculate base rotation to center winner at top (pointer position)
  // The wheel rotates clockwise, so we need negative rotation to bring segment to top
  const baseRotation = -(winnerIndex * segmentAngle) - segmentAngle / 2;

  // Add random extra spins (2-4 full rotations) for dramatic effect
  const extraSpins = (Math.floor(Math.random() * 3) + 2) * 360;

  // Add small random offset within segment for natural feel (±30% of segment)
  const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);

  return baseRotation + extraSpins + randomOffset;
}

/**
 * Extracts winner data from API response (handles both single and pair winners)
 *
 * API Response formats:
 * Single winner: { success: true, data: { lottery_id, winner: { member_id, name, credit_amount }, credit_round_number, is_pair: false } }
 * Pair winners: { success: true, data: { lottery_id, winners: [...], credit_round_number, is_pair: true } }
 *
 * @param response - The API response object (response.data from axios, which is { success, data: {...} })
 * @returns Normalized winner data
 */
export function extractWinnerFromResponse(response: any): {
  member_id: string;
  name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_member?: { member_id: string; name: string; credit_amount?: number };
  lottery_id?: string;
  credit_round_number?: number;
} {
  // The response is already response.data from axios
  // So the structure is: { success: true, data: { lottery_id, winner/winners, ... } }
  const apiData = response.data || response;

  console.log("extractWinnerFromResponse received:", response);
  console.log("apiData:", apiData);

  // Handle pair winner response
  if (apiData?.is_pair && apiData?.winners && Array.isArray(apiData.winners)) {
    const [winner1, winner2] = apiData.winners;
    return {
      member_id: winner1.member_id,
      name: winner1.name,
      credit_amount: winner1.credit_amount,
      is_pair: true,
      pair_member: {
        member_id: winner2.member_id,
        name: winner2.name,
        credit_amount: winner2.credit_amount,
      },
      lottery_id: apiData.lottery_id,
      credit_round_number: apiData.credit_round_number,
    };
  }

  // Handle single winner response
  if (apiData?.winner) {
    return {
      member_id: apiData.winner.member_id,
      name: apiData.winner.name,
      credit_amount: apiData.winner.credit_amount,
      is_pair: apiData.is_pair === true ? true : false,
      lottery_id: apiData.lottery_id,
      credit_round_number: apiData.credit_round_number,
    };
  }

  // Fallback: try to extract from response directly (in case structure is different)
  if (response?.winner) {
    return {
      member_id: response.winner.member_id,
      name: response.winner.name,
      credit_amount: response.winner.credit_amount,
      is_pair: response.is_pair === true ? true : false,
      lottery_id: response.lottery_id,
      credit_round_number: response.credit_round_number,
    };
  }

  console.error("Invalid API response format:", response);
  throw new Error("Invalid API response format");
}

/**
 * Formats credit amount for display
 *
 * @param amount - The credit amount
 * @returns Formatted string with ETB currency
 */
export function formatCreditAmount(amount: number): string {
  return `${amount.toLocaleString()} ETB`;
}
