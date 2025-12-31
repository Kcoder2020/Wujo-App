<template>
  <div
    class="lottery-notification-card"
    @click="handleSelect"
    role="button"
    tabindex="0"
    @keydown.enter="handleSelect"
    :aria-label="`Lottery result for ${lottery.iqub_name}, Credit Round ${lottery.credit_round_number}`"
  >
    <div class="card-content">
      <div class="card-icon-wrapper" :class="{ winner: lottery.is_winner }">
        <ion-icon
          :icon="lottery.is_winner ? trophyOutline : ticketOutline"
          class="card-icon"
        ></ion-icon>
      </div>

      <div class="card-details">
        <h3 class="iqub-name">{{ lottery.iqub_name }}</h3>
        <p class="credit-round">
          Credit Round {{ lottery.credit_round_number }}
        </p>
        <p class="credit-amount">{{ formatCurrency(lottery.credit_amount) }}</p>
      </div>

      <div class="card-meta">
        <span class="lottery-date">{{ formatDate(lottery.lottery_date) }}</span>
        <ion-icon :icon="chevronForwardOutline" class="chevron-icon"></ion-icon>
      </div>
    </div>

    <div v-if="lottery.is_winner" class="winner-badge">
      <ion-icon :icon="trophyOutline" class="badge-icon"></ion-icon>
      <span>You Won!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import {
  trophyOutline,
  ticketOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import type { MemberLotteryResult } from "@/types/lottery";

interface Props {
  lottery: MemberLotteryResult;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "select", lotteryId: string): void;
}>();

const handleSelect = () => {
  emit("select", props.lottery.lottery_id);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<style scoped>
.lottery-notification-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.lottery-notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.lottery-notification-card:active {
  transform: scale(0.98);
}

.lottery-notification-card:focus {
  outline: 2px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  outline-offset: 2px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(1, 64, 35, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-wrapper.winner {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
}

.card-icon {
  font-size: 24px;
  color: var(--ion-color-dark-green, #014023);
}

.card-icon-wrapper.winner .card-icon {
  color: white;
}

.card-details {
  flex: 1;
  min-width: 0;
}

.iqub-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.credit-round {
  font-size: 13px;
  color: #666;
  margin: 0 0 2px 0;
}

.credit-amount {
  font-size: 15px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin: 0;
}

.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.lottery-date {
  font-size: 12px;
  color: #999;
}

.chevron-icon {
  font-size: 20px;
  color: #ccc;
}

.winner-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: white;
  padding: 4px 12px 4px 8px;
  border-radius: 0 16px 0 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-icon {
  font-size: 12px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .lottery-notification-card {
    transition: none;
  }

  .lottery-notification-card:hover {
    transform: none;
  }
}
</style>
