<template>
  <div class="savings-illustration">
    <!-- Piggy bank body -->
    <div class="piggy-container">
      <svg
        class="piggy-bank"
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Shadow -->
        <ellipse cx="100" cy="150" rx="60" ry="8" fill="rgba(0,0,0,0.2)" />

        <!-- Back leg -->
        <rect x="130" y="115" width="16" height="30" rx="8" fill="#4bc99a" />

        <!-- Front leg -->
        <rect x="60" y="115" width="16" height="30" rx="8" fill="#4bc99a" />

        <!-- Body -->
        <ellipse cx="100" cy="85" rx="70" ry="55" fill="#5fd9ac" />

        <!-- Body highlight -->
        <ellipse
          cx="85"
          cy="70"
          rx="40"
          ry="30"
          fill="rgba(255,255,255,0.15)"
        />

        <!-- Snout -->
        <ellipse cx="165" cy="90" rx="18" ry="14" fill="#4bc99a" />

        <!-- Nostrils -->
        <circle cx="162" cy="87" r="3" fill="#014023" />
        <circle cx="168" cy="87" r="3" fill="#014023" />

        <!-- Eye -->
        <circle cx="145" cy="65" r="8" fill="white" />
        <circle cx="147" cy="65" r="4" fill="#014023" />
        <circle cx="148" cy="63" r="1.5" fill="white" />

        <!-- Ear -->
        <path d="M130 35 Q140 20 150 35 Q145 45 135 45 Z" fill="#4bc99a" />
        <path d="M133 38 Q140 28 147 38" fill="#3ab889" />

        <!-- Coin slot -->
        <rect x="85" y="28" width="30" height="6" rx="3" fill="#014023" />

        <!-- Tail -->
        <path
          d="M30 80 Q15 75 20 65 Q25 55 35 60"
          stroke="#4bc99a"
          stroke-width="6"
          stroke-linecap="round"
          fill="none"
        />
      </svg>

      <!-- Coin dropping animation -->
      <div class="coin-drop">
        <svg
          class="dropping-coin"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15" cy="15" r="13" fill="#ffd700" />
          <circle cx="15" cy="15" r="10" fill="#ffc107" />
          <text
            x="15"
            y="20"
            text-anchor="middle"
            fill="#014023"
            font-size="12"
            font-weight="bold"
          >
            Br
          </text>
        </svg>
      </div>
    </div>

    <!-- Progress ring -->
    <div class="progress-ring-container">
      <svg class="progress-ring" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="6"
          fill="none"
        />
        <circle
          class="progress-circle"
          cx="40"
          cy="40"
          r="35"
          stroke="#5fd9ac"
          stroke-width="6"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="220"
          stroke-dashoffset="66"
        />
      </svg>
      <div class="progress-text">70%</div>
    </div>

    <!-- Floating coins around -->
    <div class="float-coin float-coin-1">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#ffd700" />
        <circle cx="12" cy="12" r="7" fill="#ffc107" />
      </svg>
    </div>

    <div class="float-coin float-coin-2">
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" fill="#5fd9ac" />
        <circle cx="10" cy="10" r="5" fill="#4bc99a" />
      </svg>
    </div>

    <div class="float-coin float-coin-3">
      <svg viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" fill="#ffd700" />
        <circle cx="9" cy="9" r="4" fill="#ffc107" />
      </svg>
    </div>

    <!-- Sparkle effects -->
    <div class="sparkle s1">✦</div>
    <div class="sparkle s2">✦</div>
  </div>
</template>

<script setup lang="ts">
// Pure visual component
</script>

<style scoped>
.savings-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piggy-container {
  position: relative;
  animation: piggyBounce 2s ease-in-out infinite;
}

@keyframes piggyBounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.piggy-bank {
  width: 180px;
  height: 144px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
}

/* Coin dropping animation */
.coin-drop {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

.dropping-coin {
  width: 30px;
  height: 30px;
  animation: coinDrop 2s ease-in infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

@keyframes coinDrop {
  0% {
    transform: translateY(-20px) rotateY(0deg);
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  60% {
    transform: translateY(25px) rotateY(360deg);
    opacity: 1;
  }

  80%,
  100% {
    transform: translateY(25px) rotateY(360deg);
    opacity: 0;
  }
}

/* Progress ring */
.progress-ring-container {
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle {
  animation: progressFill 3s ease-out infinite;
}

@keyframes progressFill {
  0% {
    stroke-dashoffset: 220;
  }

  50%,
  100% {
    stroke-dashoffset: 66;
  }
}

.progress-text {
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  color: #5fd9ac;
  text-shadow: 0 0 8px rgba(95, 217, 172, 0.5);
}

/* Floating coins */
.float-coin {
  position: absolute;
  animation: floatAround 4s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.float-coin-1 {
  width: 24px;
  height: 24px;
  top: 15%;
  right: 20%;
  animation-delay: 0s;
}

.float-coin-2 {
  width: 20px;
  height: 20px;
  top: 25%;
  left: 10%;
  animation-delay: 1s;
}

.float-coin-3 {
  width: 18px;
  height: 18px;
  bottom: 30%;
  left: 15%;
  animation-delay: 2s;
}

@keyframes floatAround {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-10px) rotate(10deg);
  }

  75% {
    transform: translateY(5px) rotate(-10deg);
  }
}

/* Sparkles */
.sparkle {
  position: absolute;
  color: #ffd700;
  font-size: 14px;
  animation: sparkle 2s ease-in-out infinite;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
}

.s1 {
  top: 10%;
  left: 30%;
  animation-delay: 0s;
}

.s2 {
  top: 20%;
  right: 25%;
  animation-delay: 1s;
  font-size: 12px;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .piggy-container,
  .dropping-coin,
  .progress-circle,
  .float-coin,
  .sparkle {
    animation: none;
  }

  .dropping-coin {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
