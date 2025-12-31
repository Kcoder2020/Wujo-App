<template>
  <div class="progress-illustration">
    <!-- Chart container -->
    <div class="chart-container">
      <!-- Glass card background -->
      <div class="glass-card">
        <!-- Chart bars -->
        <div class="chart-bars">
          <div class="bar-wrapper" v-for="(bar, index) in bars" :key="index">
            <div
              class="bar"
              :style="{
                height: bar.height + '%',
                animationDelay: index * 0.1 + 's',
              }"
              :class="{ highlighted: bar.highlighted }"
            ></div>
            <span class="bar-label">{{ bar.label }}</span>
          </div>
        </div>

        <!-- Trend line -->
        <svg class="trend-line" viewBox="0 0 200 80" preserveAspectRatio="none">
          <path
            class="trend-path"
            d="M0 70 Q30 60 50 50 T100 35 T150 20 T200 10"
            stroke="#5fd9ac"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
          />
          <circle class="trend-dot" cx="200" cy="10" r="6" fill="#5fd9ac" />
        </svg>

        <!-- Stats overlay -->
        <div class="stats-badge">
          <span class="stats-arrow">↑</span>
          <span class="stats-value">24%</span>
        </div>
      </div>
    </div>

    <!-- Floating stat cards -->
    <div class="stat-card stat-card-1">
      <div class="stat-icon">📊</div>
      <div class="stat-info">
        <span class="stat-label">Saved</span>
        <span class="stat-amount">ETB 5,400</span>
      </div>
    </div>

    <div class="stat-card stat-card-2">
      <div class="stat-icon">🎯</div>
      <div class="stat-info">
        <span class="stat-label">Round</span>
        <span class="stat-amount">4 of 12</span>
      </div>
    </div>

    <!-- Animated circles -->
    <div class="circle-pulse circle-1"></div>
    <div class="circle-pulse circle-2"></div>

    <!-- Data points floating -->
    <div class="data-point dp-1">+500</div>
    <div class="data-point dp-2">+750</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const bars = ref([
  { height: 40, label: "J", highlighted: false },
  { height: 55, label: "F", highlighted: false },
  { height: 45, label: "M", highlighted: false },
  { height: 70, label: "A", highlighted: false },
  { height: 60, label: "M", highlighted: false },
  { height: 85, label: "J", highlighted: true },
]);
</script>

<style scoped>
.progress-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glass card */
.chart-container {
  position: relative;
  animation: floatChart 4s ease-in-out infinite;
}

@keyframes floatChart {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

.glass-card {
  width: 220px;
  height: 140px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* Chart bars */
.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 80px;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 100%;
  max-width: 20px;
  background: linear-gradient(180deg, #5fd9ac 0%, #3ab889 100%);
  border-radius: 4px 4px 0 0;
  animation: growBar 1s ease-out forwards;
  transform-origin: bottom;
  transform: scaleY(0);
  box-shadow: 0 -2px 8px rgba(95, 217, 172, 0.3);
}

.bar.highlighted {
  background: linear-gradient(180deg, #ffd700 0%, #ffc107 100%);
  box-shadow: 0 -2px 12px rgba(255, 215, 0, 0.4);
}

@keyframes growBar {
  to {
    transform: scaleY(1);
  }
}

.bar-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

/* Trend line */
.trend-line {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  height: 80px;
  z-index: 1;
}

.trend-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawLine 2s ease-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.trend-dot {
  animation: pulseDot 2s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(95, 217, 172, 0.8));
}

@keyframes pulseDot {
  0%,
  100% {
    r: 6;
    opacity: 1;
  }

  50% {
    r: 8;
    opacity: 0.8;
  }
}

/* Stats badge */
.stats-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #5fd9ac 0%, #4bc99a 100%);
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.4);
  animation: badgePop 0.5s ease-out 1s forwards;
  transform: scale(0);
}

@keyframes badgePop {
  0% {
    transform: scale(0);
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.stats-arrow {
  color: #014023;
  font-weight: bold;
}

.stats-value {
  color: #014023;
  font-size: 12px;
  font-weight: 700;
}

/* Floating stat cards */
.stat-card {
  position: absolute;
  background: rgba(1, 64, 35, 0.9);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(95, 217, 172, 0.2);
}

.stat-card-1 {
  top: 5%;
  left: 5%;
  animation: floatCard 3s ease-in-out infinite;
}

.stat-card-2 {
  bottom: 10%;
  right: 0%;
  animation: floatCard 3s ease-in-out infinite 1.5s;
}

@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.stat-icon {
  font-size: 20px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.stat-amount {
  font-size: 14px;
  font-weight: 700;
  color: #5fd9ac;
}

/* Circle pulses */
.circle-pulse {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(95, 217, 172, 0.3);
  animation: circlePulse 3s ease-out infinite;
}

.circle-1 {
  width: 60px;
  height: 60px;
  top: 0;
  right: 15%;
}

.circle-2 {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 10%;
  animation-delay: 1.5s;
}

@keyframes circlePulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Data points */
.data-point {
  position: absolute;
  font-size: 12px;
  font-weight: 700;
  color: #5fd9ac;
  animation: floatData 3s ease-in-out infinite;
  text-shadow: 0 0 8px rgba(95, 217, 172, 0.5);
}

.dp-1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.dp-2 {
  bottom: 25%;
  left: 5%;
  animation-delay: 1.5s;
}

@keyframes floatData {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .chart-container,
  .bar,
  .trend-path,
  .trend-dot,
  .stats-badge,
  .stat-card,
  .circle-pulse,
  .data-point {
    animation: none;
  }

  .bar {
    transform: scaleY(1);
  }

  .trend-path {
    stroke-dashoffset: 0;
  }

  .stats-badge {
    transform: scale(1);
  }
}
</style>
