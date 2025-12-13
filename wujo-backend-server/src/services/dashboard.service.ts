import * as iqubRepository from '../repositories/iqub.repository';
import * as memberRepository from '../repositories/member.repository';
import * as lotteryRepository from '../repositories/lottery.repository';

/**
 * Get collector dashboard data
 */
export const getCollectorDashboard = async (collectorId: string): Promise<any> => {
  // Get all Iqubs created by collector
  const iqubs = await iqubRepository.findIqubsByCollectorId(collectorId);

  // Calculate total collected amount across all Iqubs
  const totalCollected = iqubs.reduce((sum, iqub) => {
    return sum + (iqub.total_collected || 0);
  }, 0);

  // Count total members across all Iqubs
  let totalMembers = 0;
  for (const iqub of iqubs) {
    const memberCount = await memberRepository.countMembersByIqubId(iqub._id.toString());
    totalMembers += memberCount;
  }

  // Count active Iqubs (status = 'active')
  const activeIqubs = iqubs.filter((iqub) => iqub.status === 'active').length;

  // Count total lotteries hosted
  const totalLotteries = await lotteryRepository.countLotteriesByCollector(collectorId);

  // Get recent activities (last 10)
  const recentActivities = await lotteryRepository.getRecentActivitiesByCollector(
    collectorId,
    10
  );

  return {
    summary: {
      total_collected: totalCollected,
      total_members: totalMembers,
      active_iqubs: activeIqubs,
      total_iqubs: iqubs.length,
      total_lotteries: totalLotteries,
    },
    recent_activities: recentActivities,
    iqubs: iqubs.map((iqub) => ({
      id: iqub._id,
      name: iqub.name,
      status: iqub.status,
      members_count: iqub.current_members,
      total_collected: iqub.total_collected || 0,
    })),
  };
};
