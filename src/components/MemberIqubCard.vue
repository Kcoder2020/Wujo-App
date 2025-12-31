<template>
  <div class="member-iqub-card" @click="handleCardClick">
    <div class="card-header">
      <h3 class="iqub-name">{{ iqub.name }}</h3>
      <span class="status-badge" :class="statusClass">{{ statusText }}</span>
    </div>

    <div class="card-body">
      <div class="progress-section">
        <SavingsProgressRing
          :percentage="completionPercentage"
          :current="currentAmount"
          :target="targetAmount"
          :size="100"
        />
      </div>

      <div class="info-section">
        <div class="info-item">
          <ion-icon :icon="calendarOutline" />
          <span>{{ nextLotteryText }}</span>
        </div>
        <div class="info-item">
          <ion-icon :icon="peopleOutline" />
          <span
            >{{ iqub.members_count || iqub.current_members || 0 }} Members</span
          >
        </div>
        <div class="info-item">
          <ion-icon :icon="cashOutline" />
          <span>{{ formatCurrency(savingAmount) }}/round</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <ion-button expand="block" @click.stop="viewDetails"
        >View Details</ion-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IonIcon, IonButton } from "@ionic/vue";
import { calendarOutline, peopleOutline, cashOutline } from "ionicons/icons";
import SavingsProgressRing from "./SavingsProgressRing.vue";
import type { Iqub } from "@/types";

interface Props {
  iqub: Iqub;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
const router = useRouter();

// Log the iqub data to debug
onMounted(() => {
  console.log("MemberIqubCard received iqub data:", props.iqub);
  console.log("Saving amount:", props.iqub.saving_amount);
  console.log("Total collected:", props.iqub.total_collected);
  console.log("Members count:", props.iqub.members_count);
  console.log("Current members:", props.iqub.current_members);
});

const statusClass = computed(() => {
  const status = props.iqub.status?.toLowerCase() || "active";
  return `status-${status}`;
});

const statusText = computed(() => {
  const status = props.iqub.status?.toLowerCase() || "active";
  return status.charAt(0).toUpperCase() + status.slice(1);
});

const savingAmount = computed(() => {
  return typeof props.iqub.saving_amount === "string"
    ? parseFloat(props.iqub.saving_amount)
    : props.iqub.saving_amount;
});

const currentAmount = computed(() => {
  // First try to use total_collected if available
  if (
    props.iqub.total_collected !== undefined &&
    props.iqub.total_collected !== null
  ) {
    const total =
      typeof props.iqub.total_collected === "string"
        ? parseFloat(props.iqub.total_collected)
        : props.iqub.total_collected || 0;
    return total;
  }

  // If not available, calculate from saving_rounds (e.g., "1/9" means 1 round completed)
  if (props.iqub.saving_rounds) {
    const rounds = props.iqub.saving_rounds.toString().split("/");
    if (rounds.length === 2) {
      const completedRounds = parseInt(rounds[0]) || 0;
      const membersCount =
        props.iqub.members_count || props.iqub.current_members || 1;
      // Total collected = completed rounds * saving amount per round * number of members
      return completedRounds * savingAmount.value * membersCount;
    }
  }

  return 0;
});

const targetAmount = computed(() => {
  const membersCount =
    props.iqub.members_count || props.iqub.current_members || 1;

  // If we have saving_rounds, use total rounds from there
  if (props.iqub.saving_rounds) {
    const rounds = props.iqub.saving_rounds.toString().split("/");
    if (rounds.length === 2) {
      const totalRounds = parseInt(rounds[1]) || 1;
      return savingAmount.value * membersCount * totalRounds;
    }
  }

  // Otherwise use a simple calculation
  return savingAmount.value * membersCount;
});

const completionPercentage = computed(() => {
  if (targetAmount.value === 0) return 0;
  return Math.min((currentAmount.value / targetAmount.value) * 100, 100);
});

const nextLotteryText = computed(() => {
  if (!props.iqub.next_lottery_date) {
    return "No lottery scheduled";
  }
  return `Next: ${formatDate(props.iqub.next_lottery_date)}`;
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const handleCardClick = () => {
  viewDetails();
};

const viewDetails = () => {
  router.push(`/member/iqub/${props.iqub.id}`);
};
</script>

<style scoped>
.member-iqub-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin: 12px 0;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function),
    box-shadow var(--wujo-transition-fast) var(--wujo-timing-function);
  cursor: pointer;
}

.member-iqub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.iqub-name {
  font-size: var(--wujo-font-size-card);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
  margin: 0;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--wujo-font-size-caption);
  font-weight: var(--wujo-font-weight-semibold);
  line-height: var(--wujo-line-height-normal);
  text-transform: capitalize;
}

.status-badge.status-active {
  background: #5fd9ac;
  color: #014023;
}

.status-badge.status-completed {
  background: #4285f4;
  color: white;
}

.status-badge.status-pending {
  background: #ffa500;
  color: white;
}

.card-body {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.progress-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--wujo-font-size-body);
  line-height: var(--wujo-line-height-normal);
  color: #666;
}

.info-item ion-icon {
  font-size: 18px;
  color: #5fd9ac;
}

.card-footer {
  margin-top: 16px;
}

.card-footer ion-button {
  --background: #5fd9ac;
  --color: #014023;
  --border-radius: 12px;
  font-weight: 600;
  height: 44px;
}
</style>
