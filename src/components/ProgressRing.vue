<template>
  <div class="progress-ring-container">
    <svg :width="size" :height="size" class="progress-ring">
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-ring-bg"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-ring-circle"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
      />
    </svg>
    <div class="progress-text">
      <span class="percentage">{{ Math.round(percentage) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { computed } from "vue";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
  strokeWidth: 8,
});

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const strokeDashoffset = computed(() => {
  const progress = Math.min(Math.max(props.percentage, 0), 100);
  return circumference.value - (progress / 100) * circumference.value;
});
</script>

<style scoped>
.progress-ring-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
}

.progress-ring-circle {
  fill: none;
  stroke: var(--ion-color-medium-aquamarine, #5fd9ac);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  font-size: 16px;
  font-weight: 700;
  color: white;
}
</style>
