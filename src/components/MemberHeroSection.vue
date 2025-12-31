<template>
  <div class="member-hero-section">
    <div class="hero-header">
      <ion-button fill="clear" class="back-button" @click="handleBack">
        <ion-icon :icon="arrowBack" />
      </ion-button>
      <ion-icon :icon="notificationsOutline" class="notification-icon" />
    </div>

    <div class="member-profile">
      <div class="member-avatar">
        <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
        <ion-icon v-else :icon="personCircle" />
      </div>
      <h1 class="member-name">{{ member.name }}</h1>
      <p class="member-phone">{{ member.phone }}</p>
      <div v-if="member.contributionType" class="contribution-badge">
        <ion-icon :icon="ribbonOutline" />
        <span
          >{{
            member.contributionType === "full" ? "Full" : "Half"
          }}
          Contributor</span
        >
      </div>
    </div>

    <!-- Credit Round Progress Card -->
    <div v-if="currentCreditRound" class="credit-round-card">
      <div class="credit-round-header">
        <h3 class="credit-round-title">Current Credit Round</h3>
        <div
          v-if="currentCreditRound.member_progress.is_complete"
          class="completion-badge"
        >
          <ion-icon :icon="checkmarkCircle" />
          <span>Complete</span>
        </div>
      </div>
      <div class="credit-round-info">
        <div class="info-item">
          <span class="info-label">Credit Round</span>
          <span class="info-value">
            {{ currentCreditRound.credit_round_number }} of
            {{ currentCreditRound.total_credit_rounds }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Saving Rounds</span>
          <span class="info-value">
            {{ currentCreditRound.saving_round_range.start }}-{{
              currentCreditRound.saving_round_range.end
            }}
          </span>
        </div>
      </div>
      <div class="credit-round-progress">
        <div class="progress-bar-container">
          <div
            class="progress-bar-fill"
            :style="{
              width: `${
                (currentCreditRound.member_progress.completed_saving_rounds /
                  currentCreditRound.member_progress.required_saving_rounds) *
                100
              }%`,
            }"
          />
        </div>
        <p class="progress-text">
          {{ currentCreditRound.member_progress.completed_saving_rounds }} of
          {{ currentCreditRound.member_progress.required_saving_rounds }} rounds
          completed
        </p>
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <p class="stat-label">Overall Progress</p>
        <p class="stat-value">
          {{ paymentStats.currentRound }}/{{ paymentStats.totalRounds }}
        </p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Completion</p>
        <div class="stat-value-with-ring">
          <ProgressRing
            :percentage="paymentStats.completionPercentage"
            :size="60"
            :stroke-width="6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { IonButton, IonIcon } from "@ionic/vue";
import {
  arrowBack,
  notificationsOutline,
  personCircle,
  ribbonOutline,
  checkmarkCircle,
} from "ionicons/icons";
import ProgressRing from "./ProgressRing.vue";

interface MemberHeroProps {
  member: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    joinDate: string;
    contributionType?: "full" | "half";
  };
  paymentStats: {
    currentRound: number;
    totalRounds: number;
    paidAmount: number;
    totalExpected: number;
    completionPercentage: number;
  };
  currentCreditRound?: {
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
  };
}

const props = defineProps<MemberHeroProps>();
const emit = defineEmits<{
  (e: "back"): void;
}>();

const handleBack = () => {
  emit("back");
};
</script>

<style scoped>
.member-hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px;
  border-radius: 0 0 24px 24px;
  color: white;
  position: relative;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  --color: white;
  --padding-start: 0;
  --padding-end: 0;
  font-size: 24px;
}

.notification-icon {
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.member-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar ion-icon {
  font-size: 60px;
  color: rgba(255, 255, 255, 0.7);
}

.member-name {
  font-size: var(--wujo-font-size-hero);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  margin: 0 0 4px 0;
  text-align: center;
}

.member-phone {
  font-size: var(--wujo-font-size-body);
  line-height: var(--wujo-line-height-normal);
  opacity: 0.9;
  margin: 0 0 8px 0;
}

.contribution-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: var(--wujo-font-size-caption);
  font-weight: var(--wujo-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contribution-badge ion-icon {
  font-size: 16px;
}

/* Credit Round Card */
.credit-round-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.credit-round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.credit-round-title {
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-semibold);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(95, 217, 172, 0.3);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: var(--wujo-font-size-caption);
  font-weight: var(--wujo-font-weight-semibold);
}

.completion-badge ion-icon {
  font-size: 16px;
}

.credit-round-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: var(--wujo-font-size-caption);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-bold);
}

.credit-round-progress {
  margin-top: 12px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5fd9ac, #8feccc);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--wujo-font-size-caption);
  opacity: 0.9;
  margin: 0;
  text-align: center;
}

.stats-container {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  flex: 1;
  text-align: center;
  min-width: 0;
}

.stat-label {
  font-size: var(--wujo-font-size-caption);
  line-height: var(--wujo-line-height-normal);
  opacity: 0.8;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: var(--wujo-font-size-card);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  margin: 0;
}

.stat-value-with-ring {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
}
</style>
