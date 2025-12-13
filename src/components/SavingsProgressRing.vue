<template>
  <div class="savings-progress-ring">
    <svg :width="size" :height="size" class="progress-svg">
      <!-- Background circle -->
      <circle
        class="progress-bg"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        stroke="rgba(1, 64, 35, 0.1)"
      />
      <!-- Progress circle -->
      <circle
        class="progress-bar"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        stroke="#5FD9AC"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="progress-content">
      <span class="percentage">{{ Math.round(percentage) }}%</span>
      <span class="amount">{{ formatCurrency(current) }}</span>
      <span class="target">of {{ formatCurrency(target) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  percentage: number;
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(), {
  size: 120,
  strokeWidth: 8,
});

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => {
  const progress = Math.min(Math.max(props.percentage, 0), 100);
  return circumference.value - (progress / 100) * circumference.value;
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>

<style scoped>
.savings-progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-bar {
  transition: stroke-dashoffset 1s ease-out;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.percentage {
  font-size: 24px;
  font-weight: 700;
  color: #014023;
  line-height: 1;
  margin-bottom: 4px;
}

.amount {
  font-size: 12px;
  font-weight: 600;
  color: #014023;
  line-height: 1.2;
}

.target {
  font-size: 10px;
  font-weight: 400;
  color: #666;
  line-height: 1.2;
}
</style>
