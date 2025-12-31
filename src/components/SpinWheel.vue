<template>
  <div
    class="spin-wheel-container"
    role="application"
    aria-label="Lottery spin wheel"
  >
    <!-- Pointer indicator at top -->
    <div class="wheel-pointer" aria-hidden="true">
      <svg width="30" height="40" viewBox="0 0 30 40">
        <polygon
          points="15,40 0,0 30,0"
          fill="var(--ion-color-medium-aquamarine, #5fd9ac)"
        />
      </svg>
    </div>

    <!-- SVG Wheel -->
    <svg
      ref="wheelRef"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="spin-wheel"
      :style="wheelStyle"
      :aria-label="ariaLabel"
    >
      <!-- Wheel segments -->
      <g :transform="`translate(${center}, ${center})`">
        <g
          v-for="(segment, index) in segments"
          :key="segment.id"
          class="wheel-segment"
          :class="{
            'winner-segment': isWinnerSegment(segment) && showWinnerHighlight,
          }"
        >
          <path
            :d="getSegmentPath(index)"
            :fill="segment.color"
            :stroke="
              isWinnerSegment(segment) && showWinnerHighlight
                ? 'var(--ion-color-medium-aquamarine)'
                : '#fff'
            "
            :stroke-width="
              isWinnerSegment(segment) && showWinnerHighlight ? 4 : 1
            "
            class="segment-path"
          />
          <!-- Segment label -->
          <text
            :transform="getTextTransform(index)"
            text-anchor="middle"
            dominant-baseline="middle"
            class="segment-label"
            :font-size="labelFontSize"
            fill="#fff"
          >
            {{ truncateLabel(segment.label) }}
          </text>
        </g>
      </g>

      <!-- Center circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="centerRadius"
        fill="var(--ion-color-dark-green, #014023)"
        stroke="var(--ion-color-medium-aquamarine, #5fd9ac)"
        stroke-width="3"
      />
      <text
        :x="center"
        :y="center"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#fff"
        font-size="14"
        font-weight="bold"
      >
        SPIN
      </text>
    </svg>

    <!-- Spin button (keyboard accessible) -->
    <button
      v-if="!isSpinning && !hasSpun"
      class="spin-button"
      @click="startSpin"
      @keydown.enter="startSpin"
      :disabled="isSpinning"
      aria-label="Press Enter or click to spin the wheel"
    >
      Spin to Win!
    </button>

    <!-- Screen reader announcement -->
    <div
      v-if="winnerAnnouncement"
      class="sr-only"
      role="alert"
      aria-live="assertive"
    >
      {{ winnerAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { WheelSegment } from "../types/lottery";
import { calculateWinningRotation } from "../utils/lotteryUtils";

interface Props {
  segments: WheelSegment[];
  winnerId: string;
  size?: number;
  spinDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  spinDuration: 4000,
});

const emit = defineEmits<{
  (e: "spinComplete"): void;
  (e: "spinStart"): void;
}>();

// Log when component mounts
onMounted(() => {
  console.log("SpinWheel MOUNTED with segments:", props.segments.length);
});

// Refs
const wheelRef = ref<SVGSVGElement | null>(null);
const currentRotation = ref(0);
const isSpinning = ref(false);
const hasSpun = ref(false);
const showWinnerHighlight = ref(false);
const winnerAnnouncement = ref("");

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Computed
const center = computed(() => props.size / 2);
const radius = computed(() => props.size / 2 - 10);
const centerRadius = computed(() => props.size / 10);
const segmentAngle = computed(() =>
  props.segments.length > 0 ? 360 / props.segments.length : 0
);
const labelFontSize = computed(() =>
  Math.max(10, Math.min(14, props.size / 25))
);

const wheelStyle = computed(() => ({
  transform: `rotate(${currentRotation.value}deg)`,
  transition: isSpinning.value
    ? `transform ${props.spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
    : "none",
  willChange: isSpinning.value ? "transform" : "auto",
}));

const ariaLabel = computed(() => {
  if (props.segments.length === 0) return "Empty lottery wheel";
  return `Lottery wheel with ${props.segments.length} segments: ${props.segments
    .map((s) => s.label)
    .join(", ")}`;
});

// Methods
function getSegmentPath(index: number): string {
  const startAngle = (index * segmentAngle.value - 90) * (Math.PI / 180);
  const endAngle = ((index + 1) * segmentAngle.value - 90) * (Math.PI / 180);

  const x1 = Math.cos(startAngle) * radius.value;
  const y1 = Math.sin(startAngle) * radius.value;
  const x2 = Math.cos(endAngle) * radius.value;
  const y2 = Math.sin(endAngle) * radius.value;

  const largeArcFlag = segmentAngle.value > 180 ? 1 : 0;

  return `M 0 0 L ${x1} ${y1} A ${radius.value} ${radius.value} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

function getTextTransform(index: number): string {
  const angle = (index + 0.5) * segmentAngle.value - 90;
  const textRadius = radius.value * 0.65;
  const x = Math.cos(angle * (Math.PI / 180)) * textRadius;
  const y = Math.sin(angle * (Math.PI / 180)) * textRadius;
  return `translate(${x}, ${y}) rotate(${angle + 90})`;
}

function truncateLabel(label: string): string {
  const maxLength = 12;
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 2) + "..";
}

function isWinnerSegment(segment: WheelSegment): boolean {
  return (
    segment.id === props.winnerId ||
    segment.members.some((m) => m.id === props.winnerId)
  );
}

function getWinnerName(): string {
  const winnerSegment = props.segments.find((s) => isWinnerSegment(s));
  return winnerSegment?.label || "Unknown";
}

async function startSpin() {
  if (isSpinning.value || hasSpun.value || props.segments.length === 0) return;

  emit("spinStart");
  isSpinning.value = true;
  showWinnerHighlight.value = false;

  // Handle reduced motion preference
  if (prefersReducedMotion) {
    // Skip animation, show result immediately
    hasSpun.value = true;
    isSpinning.value = false;
    showWinnerHighlight.value = true;
    announceWinner();
    emit("spinComplete");
    return;
  }

  // Calculate winning rotation
  const targetRotation = calculateWinningRotation(
    props.segments,
    props.winnerId
  );
  currentRotation.value = targetRotation;

  // Wait for animation to complete
  setTimeout(() => {
    isSpinning.value = false;
    hasSpun.value = true;
    showWinnerHighlight.value = true;
    announceWinner();
    emit("spinComplete");
  }, props.spinDuration);
}

function announceWinner() {
  const winnerName = getWinnerName();
  winnerAnnouncement.value = `The winner is ${winnerName}!`;
}

// Reset function for external use
function reset() {
  currentRotation.value = 0;
  isSpinning.value = false;
  hasSpun.value = false;
  showWinnerHighlight.value = false;
  winnerAnnouncement.value = "";
}

// Expose methods for parent component
defineExpose({ startSpin, reset });

// Watch for winnerId changes to reset state
watch(
  () => props.winnerId,
  () => {
    if (!isSpinning.value) {
      hasSpun.value = false;
      showWinnerHighlight.value = false;
    }
  }
);
</script>

<style scoped>
.spin-wheel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.wheel-pointer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.spin-wheel {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.wheel-segment {
  cursor: pointer;
}

.segment-path {
  transition: stroke-width 0.3s ease, stroke 0.3s ease;
}

.winner-segment .segment-path {
  filter: brightness(1.2);
  animation: winner-glow 1s ease-in-out infinite alternate;
}

@keyframes winner-glow {
  from {
    filter: brightness(1.1)
      drop-shadow(0 0 8px var(--ion-color-medium-aquamarine));
  }
  to {
    filter: brightness(1.3)
      drop-shadow(0 0 16px var(--ion-color-medium-aquamarine));
  }
}

.segment-label {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.spin-button {
  margin-top: 20px;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023),
    var(--ion-color-medium-aquamarine, #5fd9ac)
  );
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.spin-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.spin-button:active:not(:disabled) {
  transform: scale(0.98);
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin-button:focus {
  outline: 3px solid var(--ion-color-medium-aquamarine);
  outline-offset: 2px;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spin-wheel {
    transition: none !important;
  }

  .winner-segment .segment-path {
    animation: none;
    filter: brightness(1.2);
  }

  .spin-button {
    transition: none;
  }
}
</style>
