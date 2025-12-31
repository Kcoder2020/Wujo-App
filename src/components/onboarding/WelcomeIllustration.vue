<template>
  <div class="welcome-illustration">
    <!-- Outer glow ring -->
    <div class="glow-ring"></div>

    <!-- Main circle with logo -->
    <div class="main-circle">
      <div class="inner-glow"></div>
      <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
    </div>

    <!-- Floating coins -->
    <div class="coin coin-1">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#5fd9ac" />
        <circle cx="20" cy="20" r="14" fill="#4bc99a" />
        <text
          x="20"
          y="26"
          text-anchor="middle"
          fill="#014023"
          font-size="16"
          font-weight="bold"
        >
          Br
        </text>
      </svg>
    </div>

    <div class="coin coin-2">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#5fd9ac" />
        <circle cx="16" cy="16" r="10" fill="#4bc99a" />
        <text
          x="16"
          y="21"
          text-anchor="middle"
          fill="#014023"
          font-size="12"
          font-weight="bold"
        >
          $
        </text>
      </svg>
    </div>

    <div class="coin coin-3">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="#5fd9ac" />
        <circle cx="18" cy="18" r="12" fill="#4bc99a" />
        <text
          x="18"
          y="24"
          text-anchor="middle"
          fill="#014023"
          font-size="14"
          font-weight="bold"
        >
          €
        </text>
      </svg>
    </div>

    <!-- Orbiting dots -->
    <div class="orbit">
      <div class="orbit-dot dot-1"></div>
      <div class="orbit-dot dot-2"></div>
      <div class="orbit-dot dot-3"></div>
    </div>

    <!-- Sparkles -->
    <div class="sparkle sparkle-1">✦</div>
    <div class="sparkle sparkle-2">✦</div>
    <div class="sparkle sparkle-3">✦</div>
  </div>
</template>

<script setup lang="ts">
import wujoLogo from "@/assets/img/icon2.svg";
</script>

<style scoped>
.welcome-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glow ring */
.glow-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid rgba(95, 217, 172, 0.3);
  animation: pulseRing 3s ease-in-out infinite;
}

@keyframes pulseRing {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Main circle */
.main-circle {
  position: relative;
  width: 120px;
  height: 120px;
  background: linear-gradient(
    135deg,
    rgba(1, 64, 35, 0.9) 0%,
    rgba(1, 45, 25, 0.95) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(95, 217, 172, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  animation: floatMain 4s ease-in-out infinite;
}

@keyframes floatMain {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.inner-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(95, 217, 172, 0.2) 0%,
    transparent 50%
  );
}

.wujo-logo {
  width: 70px;
  height: 70px;
  z-index: 1;
  border-radius: 16px;
  object-fit: contain;
}

/* Floating coins */
.coin {
  position: absolute;
  animation: floatCoin 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.coin-1 {
  width: 40px;
  height: 40px;
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.coin-2 {
  width: 32px;
  height: 32px;
  bottom: 20%;
  left: 10%;
  animation-delay: 0.5s;
}

.coin-3 {
  width: 36px;
  height: 36px;
  top: 30%;
  left: 5%;
  animation-delay: 1s;
}

@keyframes floatCoin {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-8px) rotate(5deg);
  }

  75% {
    transform: translateY(4px) rotate(-5deg);
  }
}

/* Orbiting dots */
.orbit {
  position: absolute;
  width: 180px;
  height: 180px;
  animation: orbitRotate 12s linear infinite;
}

@keyframes orbitRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.orbit-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #5fd9ac;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(95, 217, 172, 0.6);
}

.dot-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.dot-2 {
  bottom: 15%;
  left: 10%;
}

.dot-3 {
  bottom: 15%;
  right: 10%;
}

/* Sparkles */
.sparkle {
  position: absolute;
  color: #5fd9ac;
  font-size: 16px;
  animation: sparkleAnim 2s ease-in-out infinite;
  text-shadow: 0 0 8px rgba(95, 217, 172, 0.8);
}

.sparkle-1 {
  top: 5%;
  left: 25%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 15%;
  right: 20%;
  animation-delay: 0.7s;
  font-size: 12px;
}

.sparkle-3 {
  bottom: 25%;
  right: 15%;
  animation-delay: 1.4s;
  font-size: 14px;
}

@keyframes sparkleAnim {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glow-ring,
  .main-circle,
  .coin,
  .orbit,
  .sparkle {
    animation: none;
  }
}
</style>
