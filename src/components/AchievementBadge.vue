<template>
  <div class="achievement-badge" :class="{ earned: achievement.earned }">
    <!-- Icon Container -->
    <div class="badge-icon" :class="iconClass">
      <ion-icon :icon="iconMap[achievement.icon] || ribbonOutline"></ion-icon>
      <div v-if="achievement.earned" class="earned-glow"></div>
    </div>

    <!-- Badge Content -->
    <div class="badge-content">
      <div class="badge-header">
        <h4 class="badge-title">{{ achievement.title }}</h4>
        <ion-icon
          v-if="achievement.earned"
          :icon="checkmarkCircle"
          class="earned-check"
        ></ion-icon>
      </div>
      <p class="badge-description">{{ achievement.description }}</p>

      <!-- Progress Bar (for unearned achievements) -->
      <div
        v-if="!achievement.earned && achievement.progress !== undefined"
        class="progress-container"
      >
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${achievement.progress}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ achievement.progress }}%</span>
      </div>

      <!-- Earned Date -->
      <p
        v-if="achievement.earned && achievement.earnedDate"
        class="earned-date"
      >
        <ion-icon :icon="calendarOutline"></ion-icon>
        Earned {{ formatDate(achievement.earnedDate) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  ribbonOutline,
  flameOutline,
  trophyOutline,
  starOutline,
  medalOutline,
  checkmarkCircle,
  calendarOutline,
} from "ionicons/icons";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  earnedDate?: string | null;
}

const props = defineProps<{
  achievement: Achievement;
}>();

const iconMap: Record<string, string> = {
  ribbon: ribbonOutline,
  flame: flameOutline,
  trophy: trophyOutline,
  star: starOutline,
  medal: medalOutline,
};

const iconClass = computed(() => {
  return `icon-${props.achievement.icon}`;
});

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
.achievement-badge {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0.7;
}

.achievement-badge.earned {
  opacity: 1;
  border-left: 4px solid var(--ion-color-medium-aquamarine, #5fd9ac);
}

.achievement-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Badge Icon */
.badge-icon {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
}

.earned .badge-icon {
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
}

.badge-icon ion-icon {
  font-size: 26px;
  color: white;
}

.badge-icon.icon-trophy {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
}

.badge-icon.icon-flame {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
}

.badge-icon.icon-star {
  background: linear-gradient(135deg, #6c8eff 0%, #5a7de8 100%);
}

.badge-icon.icon-medal {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

.earned-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 18px;
  background: inherit;
  opacity: 0.3;
  filter: blur(8px);
  z-index: -1;
}

/* Badge Content */
.badge-content {
  flex: 1;
  min-width: 0;
}

.badge-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.badge-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0;
}

.earned-check {
  font-size: 18px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.badge-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

/* Progress Bar */
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  min-width: 36px;
}

/* Earned Date */
.earned-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
  margin: 0;
}

.earned-date ion-icon {
  font-size: 14px;
}
</style>
