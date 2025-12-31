<template>
  <div class="winner-announcement" role="dialog" aria-labelledby="winner-title">
    <!-- Confetti Canvas -->
    <canvas
      ref="confettiCanvas"
      class="confetti-canvas"
      aria-hidden="true"
    ></canvas>

    <!-- Winner Content -->
    <div class="winner-content">
      <!-- Trophy Icon -->
      <div class="trophy-container">
        <ion-icon :icon="trophyOutline" class="trophy-icon"></ion-icon>
      </div>

      <!-- Congratulations Text -->
      <h1 class="congrats-text">Congratulations!</h1>

      <!-- Winner Name(s) -->
      <h2 id="winner-title" class="winner-name">
        <template v-if="winner.is_pair && winner.pair_member">
          {{ winner.name }} & {{ winner.pair_member.name }}
        </template>
        <template v-else>
          {{ winner.name }}
        </template>
      </h2>

      <!-- Credit Round Badge -->
      <div v-if="winner.credit_round_number" class="credit-round-badge">
        Credit Round {{ winner.credit_round_number }}
      </div>

      <!-- Credit Amount -->
      <div class="credit-amount-container">
        <span class="credit-label">Won</span>
        <span class="credit-amount"
          >{{ formatAmount(totalCreditAmount) }} ETB</span
        >
        <span v-if="winner.is_pair && winner.pair_member" class="split-note">
          ({{ formatAmount(winner.credit_amount) }} ETB each)
        </span>
      </div>

      <!-- Pair Winner Details -->
      <div v-if="winner.is_pair && winner.pair_member" class="pair-details">
        <div class="pair-member">
          <ion-icon :icon="personOutline" class="pair-icon"></ion-icon>
          <span class="pair-name">{{ winner.name }}</span>
          <span class="pair-amount"
            >{{ formatAmount(winner.credit_amount) }} ETB</span
          >
        </div>
        <div class="pair-divider">+</div>
        <div class="pair-member">
          <ion-icon :icon="personOutline" class="pair-icon"></ion-icon>
          <span class="pair-name">{{ winner.pair_member.name }}</span>
          <span class="pair-amount"
            >{{
              formatAmount(
                winner.pair_member.credit_amount || winner.credit_amount
              )
            }}
            ETB</span
          >
        </div>
      </div>

      <!-- Done Button -->
      <ion-button expand="block" class="done-button" @click="handleDone">
        Done
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { trophyOutline, personOutline } from "ionicons/icons";
import { LotteryWinner } from "../types/lottery";

interface Props {
  winner: LotteryWinner;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "done"): void;
}>();

const confettiCanvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

// Computed
const totalCreditAmount = computed(() => {
  if (props.winner.is_pair && props.winner.pair_member) {
    const pairAmount =
      props.winner.pair_member.credit_amount || props.winner.credit_amount;
    return props.winner.credit_amount + pairAmount;
  }
  return props.winner.credit_amount;
});

// Confetti configuration
const confettiColors = [
  "#014023", // Dark green
  "#016630", // Medium dark green
  "#5fd9ac", // Medium aquamarine
  "#FFD700", // Gold
  "#FFFFFF", // White
];

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

let confettiPieces: ConfettiPiece[] = [];

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

function handleDone() {
  emit("done");
}

function createConfetti() {
  const canvas = confettiCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create confetti pieces
  confettiPieces = [];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
    });
  }

  animateConfetti();
}

function animateConfetti() {
  const canvas = confettiCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((piece) => {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);
    ctx.restore();

    // Update position
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    // Reset if off screen
    if (piece.y > canvas.height) {
      piece.y = -piece.size;
      piece.x = Math.random() * canvas.width;
    }
  });

  animationFrameId = requestAnimationFrame(animateConfetti);
}

onMounted(() => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReducedMotion) {
    createConfetti();
  }
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.winner-announcement {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
  background: linear-gradient(
    180deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012a17 100%
  );
  overflow: hidden;
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.winner-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trophy-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(95, 217, 172, 0.4);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(95, 217, 172, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(95, 217, 172, 0.6);
  }
}

.trophy-icon {
  font-size: 48px;
  color: white;
}

.congrats-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.winner-name {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 24px 0;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.credit-amount-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.credit-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.credit-amount {
  font-size: 36px;
  font-weight: 800;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  text-shadow: 0 2px 8px rgba(95, 217, 172, 0.4);
}

.split-note {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.credit-round-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(95, 217, 172, 0.2);
  border: 1px solid rgba(95, 217, 172, 0.4);
  border-radius: 20px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.pair-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
}

.pair-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pair-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.pair-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.pair-amount {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.pair-divider {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.done-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-hover: #4bc99a;
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 30px;
  --padding-start: 48px;
  --padding-end: 48px;
  font-weight: 700;
  font-size: 18px;
  min-width: 200px;
  height: 56px;
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.4);
}

.done-button:hover {
  transform: scale(1.02);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .winner-content {
    animation: none;
  }

  .trophy-container {
    animation: none;
  }

  .done-button:hover {
    transform: none;
  }
}
</style>
