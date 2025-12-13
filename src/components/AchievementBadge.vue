<template>
  <div class="achievement-badge" :class="{ earned: achievement.earned }">
    <div class="badge-icon">
      <ion-icon :icon="badgeIcon" />
    </div>
    <div class="badge-info">
      <h4 class="badge-title">{{ achievement.title }}</h4>
      <p class="badge-description">{{ achievement.description }}</p>
      <div
        v-if="!achievement.earned && achievement.progress !== undefined"
        class="badge-progress"
      >
        <div
          class="progress-bar"
          :style="{ width: achievement.progress + '%' }"
        ></div>
      </div>
    </div>
    <div v-if="achievement.earned" class="badge-checkmark">
      <ion-icon :icon="checkmarkCircle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  checkmarkCircle,
  ribbonOutline,
  starOutline,
  trophyOutline,
  cashOutline,
  calendarOutline,
} from "ionicons/icons";

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number; // 0-100
}

interface Props {
  achievement: Achievement;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();

const badgeIcon = computed(() => {
  const iconMap: Record<string, any> = {
    ribbon: ribbonOutline,
    star: starOutline,
    trophy: trophyOutline,
    cash: cashOutline,
    calendar: calendarOutline,
  };

  return iconMap[props.achievement.icon] || ribbonOutline;
});
</script>

<style scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0.5;
  filter: grayscale(100%);
}

.achievement-badge.earned {
  opacity: 1;
  filter: grayscale(0%);
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.badge-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5fd9ac 0%, #4bc99a 100%);
  border-radius: 12px;
}

.achievement-badge:not(.earned) .badge-icon {
  background: #e0e0e0;
}

.badge-icon ion-icon {
  font-size: 28px;
  color: white;
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-title {
  font-size: 16px;
  font-weight: 700;
  color: #014023;
  margin: 0 0 4px 0;
}

.badge-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.badge-progress {
  width: 100%;
  height: 6px;
  background: rgba(1, 64, 35, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #5fd9ac;
  border-radius: 3px;
  transition: width 0.5s ease-out;
}

.badge-checkmark {
  flex-shrink: 0;
}

.badge-checkmark ion-icon {
  font-size: 32px;
  color: #5fd9ac;
}
</style>
