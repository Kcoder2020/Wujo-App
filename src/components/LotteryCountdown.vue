<template>
  <div class="lottery-countdown">
    <div class="countdown-ring" :class="stateClass">
      <svg viewBox="0 0 100 100" class="countdown-svg">
        <circle
          class="countdown-bg"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(1, 64, 35, 0.1)"
          stroke-width="6"
        />
        <circle
          class="countdown-progress"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="progressColor"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="countdownOffset"
        />
      </svg>
      <div class="countdown-content">
        <ion-icon :icon="trophyOutline" :class="{ pulse: isToday }" />
        <span class="countdown-label">{{ countdownLabel }}</span>
      </div>
    </div>

    <div class="countdown-time" v-if="!isToday">
      <div class="time-unit">
        <span class="time-value">{{ days }}</span>
        <span class="time-label">Days</span>
      </div>
      <div class="time-separator">:</div>
      <div class="time-unit">
        <span class="time-value">{{ hours }}</span>
        <span class="time-label">Hours</span>
      </div>
      <div class="time-separator">:</div>
      <div class="time-unit">
        <span class="time-value">{{ minutes }}</span>
        <span class="time-label">Min</span>
      </div>
    </div>
    <div v-else class="lottery-today-message">
      <p>🎉 Lottery happening today!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { IonIcon } from "@ionic/vue";
import { trophyOutline } from "ionicons/icons";

interface Props {
  targetDate: string;
  iqubName?: string;
}

const props = defineProps<Props>();

const now = ref(new Date());
let intervalId: number | null = null;

const targetDateTime = computed(() => new Date(props.targetDate));

const timeRemaining = computed(() => {
  const diff = targetDateTime.value.getTime() - now.value.getTime();
  return Math.max(0, diff);
});

const days = computed(() =>
  Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24))
);
const hours = computed(() =>
  Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
);
const minutes = computed(() =>
  Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60))
);

const isToday = computed(() => {
  const target = targetDateTime.value;
  const current = now.value;
  return (
    target.getDate() === current.getDate() &&
    target.getMonth() === current.getMonth() &&
    target.getFullYear() === current.getFullYear()
  );
});

const isWarning = computed(() => {
  const hoursRemaining = timeRemaining.value / (1000 * 60 * 60);
  return hoursRemaining < 24 && hoursRemaining > 0 && !isToday.value;
});

const stateClass = computed(() => {
  if (isToday.value) return "state-today";
  if (isWarning.value) return "state-warning";
  return "state-normal";
});

const progressColor = computed(() => {
  if (isToday.value) return "#FFD700"; // Gold
  if (isWarning.value) return "#FFA500"; // Orange
  return "#5FD9AC"; // Aquamarine
});

const countdownLabel = computed(() => {
  if (isToday.value) return "Today!";
  return "Next Lottery";
});

const circumference = computed(() => 2 * Math.PI * 45);

const countdownOffset = computed(() => {
  // Calculate progress based on time elapsed
  const totalDuration = 30 * 24 * 60 * 60 * 1000; // Assume 30 days cycle
  const elapsed = totalDuration - timeRemaining.value;
  const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
  return circumference.value * (1 - progress);
});

const updateCountdown = () => {
  now.value = new Date();
};

onMounted(() => {
  // Update every minute
  intervalId = window.setInterval(updateCountdown, 60000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.lottery-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.countdown-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.countdown-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.countdown-progress {
  transition: stroke-dashoffset 1s ease-out, stroke 0.3s ease;
}

.countdown-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.countdown-content ion-icon {
  font-size: 32px;
  color: #5fd9ac;
  transition: color 0.3s ease;
}

.state-today .countdown-content ion-icon {
  color: #ffd700;
}

.state-warning .countdown-content ion-icon {
  color: #ffa500;
}

.countdown-content ion-icon.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.countdown-label {
  font-size: 10px;
  font-weight: 600;
  color: #666;
  text-align: center;
}

.countdown-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.time-value {
  font-size: 24px;
  font-weight: 700;
  color: #014023;
  line-height: 1;
}

.time-label {
  font-size: 10px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  margin-top: 4px;
}

.time-separator {
  font-size: 24px;
  font-weight: 700;
  color: #014023;
  padding: 0 4px;
}

.lottery-today-message {
  text-align: center;
}

.lottery-today-message p {
  font-size: 16px;
  font-weight: 600;
  color: #ffd700;
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
