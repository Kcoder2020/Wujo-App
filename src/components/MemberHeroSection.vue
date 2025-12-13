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
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <p class="stat-label">Current Round</p>
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
import { arrowBack, notificationsOutline, personCircle } from "ionicons/icons";
import ProgressRing from "./ProgressRing.vue";

interface MemberHeroProps {
  member: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    joinDate: string;
  };
  paymentStats: {
    currentRound: number;
    totalRounds: number;
    paidAmount: number;
    totalExpected: number;
    completionPercentage: number;
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
  margin: 0;
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
