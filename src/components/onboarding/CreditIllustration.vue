<template>
  <div class="credit-illustration">
    <!-- Main credit card -->
    <div class="card-container">
      <div class="credit-card">
        <!-- Card shine effect -->
        <div class="card-shine"></div>

        <!-- Card content -->
        <div class="card-header">
          <div class="card-logo">
            <svg viewBox="0 0 40 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#ffd700" opacity="0.8" />
              <circle cx="24" cy="12" r="10" fill="#ffa500" opacity="0.8" />
            </svg>
          </div>
          <div class="card-chip">
            <svg viewBox="0 0 36 28" fill="none">
              <rect x="2" y="2" width="32" height="24" rx="4" fill="#ffd700" />
              <line
                x1="2"
                y1="10"
                x2="34"
                y2="10"
                stroke="#014023"
                stroke-width="1"
              />
              <line
                x1="2"
                y1="18"
                x2="34"
                y2="18"
                stroke="#014023"
                stroke-width="1"
              />
              <line
                x1="12"
                y1="2"
                x2="12"
                y2="26"
                stroke="#014023"
                stroke-width="1"
              />
              <line
                x1="24"
                y1="2"
                x2="24"
                y2="26"
                stroke="#014023"
                stroke-width="1"
              />
            </svg>
          </div>
        </div>

        <div class="card-number">
          <span>****</span>
          <span>****</span>
          <span>****</span>
          <span>5678</span>
        </div>

        <div class="card-footer">
          <div class="card-holder">
            <span class="label">CARD HOLDER</span>
            <span class="value">WUJO MEMBER</span>
          </div>
          <div class="card-expiry">
            <span class="label">CREDIT</span>
            <span class="value amount">ETB 50,000</span>
          </div>
        </div>

        <!-- Wujo branding -->
        <div class="card-brand">WUJO</div>
      </div>
    </div>

    <!-- Celebration particles -->
    <div class="celebration">
      <div
        v-for="i in 20"
        :key="i"
        class="confetti"
        :style="getConfettiStyle(i)"
      ></div>
    </div>

    <!-- Success badge -->
    <div class="success-badge">
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#5fd9ac" />
        <path
          d="M12 20 L17 25 L28 14"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="check-mark"
        />
      </svg>
    </div>

    <!-- Floating money icons -->
    <div class="money-icon money-1">💰</div>
    <div class="money-icon money-2">💵</div>
    <div class="money-icon money-3">🎉</div>

    <!-- Glow rings -->
    <div class="glow-ring ring-1"></div>
    <div class="glow-ring ring-2"></div>
  </div>
</template>

<script setup lang="ts">
const getConfettiStyle = (index: number) => {
  const colors = ["#5fd9ac", "#ffd700", "#ffa500", "#4bc99a", "#ffffff"];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  const size = 4 + Math.random() * 6;

  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[index % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};
</script>

<style scoped>
.credit-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card container */
.card-container {
  perspective: 1000px;
  animation: cardFloat 4s ease-in-out infinite;
}

@keyframes cardFloat {
  0%,
  100% {
    transform: translateY(0) rotateX(5deg) rotateY(-5deg);
  }

  50% {
    transform: translateY(-10px) rotateX(-5deg) rotateY(5deg);
  }
}

/* Credit card */
.credit-card {
  width: 240px;
  height: 150px;
  background: linear-gradient(135deg, #014023 0%, #012d19 50%, #01351d 100%);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(95, 217, 172, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
}

/* Card shine effect */
.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 60%
  );
  animation: cardShine 3s ease-in-out infinite;
}

@keyframes cardShine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-logo svg {
  width: 50px;
  height: 30px;
}

.card-chip svg {
  width: 36px;
  height: 28px;
}

/* Card number */
.card-number {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.card-number span {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
  font-family: monospace;
}

/* Card footer */
.card-footer {
  display: flex;
  justify-content: space-between;
}

.card-holder,
.card-expiry {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.value {
  font-size: 11px;
  color: white;
  font-weight: 600;
}

.value.amount {
  color: #5fd9ac;
  font-size: 13px;
  font-weight: 700;
}

/* Card brand */
.card-brand {
  position: absolute;
  bottom: 15px;
  right: 20px;
  font-size: 16px;
  font-weight: 800;
  color: rgba(95, 217, 172, 0.3);
  letter-spacing: 3px;
}

/* Celebration confetti */
.celebration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall linear infinite;
  opacity: 0;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(300px) rotate(720deg);
    opacity: 0;
  }
}

/* Success badge */
.success-badge {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 50px;
  height: 50px;
  animation: badgeBounce 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(95, 217, 172, 0.4));
}

@keyframes badgeBounce {
  0%,
  100% {
    transform: scale(1) rotate(-10deg);
  }

  50% {
    transform: scale(1.1) rotate(10deg);
  }
}

.check-mark {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawCheck 0.5s ease-out 0.5s forwards;
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

/* Money icons */
.money-icon {
  position: absolute;
  font-size: 24px;
  animation: moneyFloat 3s ease-in-out infinite;
}

.money-1 {
  top: 5%;
  left: 15%;
  animation-delay: 0s;
}

.money-2 {
  bottom: 15%;
  left: 10%;
  animation-delay: 1s;
  font-size: 20px;
}

.money-3 {
  bottom: 20%;
  right: 10%;
  animation-delay: 2s;
  font-size: 28px;
}

@keyframes moneyFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }

  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

/* Glow rings */
.glow-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(95, 217, 172, 0.2);
  animation: ringExpand 3s ease-out infinite;
}

.ring-1 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-2 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 1s;
}

@keyframes ringExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.8;
  }

  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card-container,
  .card-shine,
  .confetti,
  .success-badge,
  .check-mark,
  .money-icon,
  .glow-ring {
    animation: none;
  }

  .check-mark {
    stroke-dashoffset: 0;
  }

  .confetti {
    display: none;
  }
}
</style>
