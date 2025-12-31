<template>
  <ion-modal
    :is-open="isOpen"
    @willDismiss="handleDismiss"
    class="lottery-spin-modal"
    :can-dismiss="canDismiss"
  >
    <ion-content class="modal-content" :fullscreen="true">
      <!-- Header -->
      <div class="modal-header">
        <ion-button
          fill="clear"
          class="close-button"
          @click="handleClose"
          :disabled="!canDismiss"
        >
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
        <h2 class="modal-title">Lottery Draw</h2>
        <div class="header-spacer"></div>
      </div>

      <!-- Phase 1: Waiting for Server -->
      <div v-if="phase === 'waiting'" class="phase-container waiting-phase">
        <div class="waiting-content">
          <ion-spinner name="dots" class="waiting-spinner"></ion-spinner>
          <ion-text class="waiting-title">Drawing Winner</ion-text>
          <ion-text class="waiting-subtitle">
            Please wait while the server determines the winner...
          </ion-text>
          <div class="credit-round-badge">
            <ion-text>Credit Round {{ creditRoundNumber }}</ion-text>
          </div>
        </div>
      </div>

      <!-- Phase 2: Spin Animation -->
      <div
        v-else-if="phase === 'spinning'"
        class="phase-container spinning-phase"
      >
        <div class="credit-round-info">
          <ion-text class="round-label"
            >Credit Round {{ creditRoundNumber }}</ion-text
          >
        </div>
        <SpinWheel
          ref="spinWheelRef"
          :segments="wheelSegments"
          :winner-id="winnerId"
          :size="wheelSize"
          @spin-complete="handleSpinComplete"
          @spin-start="handleSpinStart"
        />
      </div>

      <!-- Phase 3: Winner Announcement -->
      <div
        v-else-if="phase === 'winner' && winner"
        class="phase-container winner-phase"
      >
        <WinnerAnnouncement :winner="winner" @done="handleWinnerDone" />
      </div>

      <!-- Error State -->
      <div v-else-if="phase === 'error'" class="phase-container error-phase">
        <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
        <ion-text class="error-title">Lottery Failed</ion-text>
        <ion-text class="error-message">{{ errorMessage }}</ion-text>
        <ion-button v-if="canRetry" @click="startLottery" class="retry-button">
          <template #start>
            <ion-icon :icon="refreshOutline"></ion-icon>
          </template>
          Try Again
        </ion-button>
        <ion-button fill="outline" @click="handleClose" class="cancel-button">
          Close
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
} from "@ionic/vue";
import {
  closeOutline,
  alertCircleOutline,
  refreshOutline,
} from "ionicons/icons";
import SpinWheel from "./SpinWheel.vue";
import WinnerAnnouncement from "./WinnerAnnouncement.vue";
import { LotteryWinner, WheelSegment } from "../types/lottery";
import { extractWinnerFromResponse } from "../utils/lotteryUtils";
import { useStore } from "vuex";

interface Props {
  isOpen: boolean;
  iqubId: string;
  creditRoundNumber: number;
  demoMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  demoMode: false,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "lotteryComplete", winner: LotteryWinner): void;
}>();

const store = useStore();

// Simple phase-based state machine
type Phase = "waiting" | "spinning" | "winner" | "error";
const phase = ref<Phase>("waiting");

// Data
const spinWheelRef = ref<InstanceType<typeof SpinWheel> | null>(null);
const winner = ref<LotteryWinner | null>(null);
const winnerId = ref("");
const wheelSegments = ref<WheelSegment[]>([]);
const errorMessage = ref("");
const canRetry = ref(false);
const isSpinning = ref(false);
const hasStarted = ref(false); // Guard to prevent re-initialization

// Computed
const canDismiss = computed(
  () => phase.value !== "spinning" || !isSpinning.value
);
const wheelSize = computed(() => Math.min(window.innerWidth - 60, 320));

// Start lottery when modal opens - only once per open
watch(
  () => props.isOpen,
  async (newValue, oldValue) => {
    if (newValue && !hasStarted.value) {
      hasStarted.value = true;
      await startLottery();
    } else if (!newValue) {
      // Modal closed - reset for next time
      hasStarted.value = false;
      resetState();
    }
  }
);

// Main lottery flow
async function startLottery() {
  phase.value = "waiting";
  errorMessage.value = "";
  canRetry.value = false;

  try {
    let response;
    let eligibleMembers: any[];

    if (props.demoMode) {
      // Demo mode: simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      eligibleMembers = [
        {
          member_id: "demo1",
          name: "Demo User 1",
          contribution_type: "full",
          has_won: false,
        },
        {
          member_id: "demo2",
          name: "Demo User 2",
          contribution_type: "full",
          has_won: false,
        },
        {
          member_id: "demo3",
          name: "Demo User 3",
          contribution_type: "full",
          has_won: false,
        },
        {
          member_id: "demo4",
          name: "Demo User 4",
          contribution_type: "half",
          has_won: false,
        },
        {
          member_id: "demo5",
          name: "Demo User 5",
          contribution_type: "half",
          has_won: false,
        },
      ];

      const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
      const demoWinner = eligibleMembers[randomIndex];

      response = {
        success: true,
        data: {
          lottery_id: "demo-lottery-" + Date.now(),
          winner: {
            member_id: demoWinner.member_id,
            name: demoWinner.name,
            credit_amount: 10000,
          },
          credit_round_number: props.creditRoundNumber,
          is_pair: false,
        },
      };
    } else {
      // Real mode: Call the API
      response = await store.dispatch("iqubs/initiateLottery", {
        iqubId: props.iqubId,
        creditRoundNumber: props.creditRoundNumber,
      });

      const currentIqub = store.getters["iqubs/getIqubById"](props.iqubId);
      eligibleMembers =
        currentIqub?.members_list?.filter(
          (m: any) => !m.has_won && m.contribution_type
        ) || [];
    }

    // Extract winner from response
    const winnerData = extractWinnerFromResponse(response);
    winner.value = winnerData;

    // Build wheel segments
    wheelSegments.value = buildWheelSegments(eligibleMembers);

    // Debug: Log the segments and winner ID
    console.log(
      "Built wheel segments:",
      wheelSegments.value.map((s) => ({
        id: s.id,
        label: s.label,
        memberIds: s.members.map((m) => m.id),
      }))
    );
    console.log("Winner data:", winnerData);

    // Set winner ID
    if (winnerData.is_pair && winnerData.pair_member) {
      winnerId.value = `pair_${winnerData.member_id}_${winnerData.pair_member.member_id}`;
    } else {
      winnerId.value = winnerData.member_id;
    }

    console.log("Winner ID for wheel:", winnerId.value);

    // Transition to spinning phase
    phase.value = "spinning";
    await nextTick();

    setTimeout(() => {
      if (spinWheelRef.value) {
        spinWheelRef.value.startSpin();
      } else {
        // Fallback: show winner directly if wheel ref not available
        phase.value = "winner";
      }
    }, 100);
  } catch (error: any) {
    console.error("Lottery failed:", error);
    handleError(error);
  }
}

function buildWheelSegments(members: any[]): WheelSegment[] {
  const colors = [
    "#014023",
    "#026b3a",
    "#038c4c",
    "#04ad5e",
    "#05ce70",
    "#06ef82",
    "#2ecc71",
    "#27ae60",
    "#1abc9c",
    "#16a085",
  ];
  const segments: WheelSegment[] = [];
  const halfContributors: any[] = [];

  // Helper to get member ID (handles both 'member_id' and 'id' fields)
  const getMemberId = (member: any): string => {
    return String(member.member_id || member.id || member._id);
  };

  members.forEach((member, index) => {
    const memberId = getMemberId(member);
    if (member.contribution_type === "half") {
      halfContributors.push({ ...member, _normalized_id: memberId });
    } else {
      segments.push({
        id: memberId,
        label: member.name,
        color: colors[index % colors.length],
        isPair: false,
        members: [{ id: memberId, name: member.name }],
      });
    }
  });

  for (let i = 0; i < halfContributors.length; i += 2) {
    if (i + 1 < halfContributors.length) {
      const m1 = halfContributors[i],
        m2 = halfContributors[i + 1];
      const m1Id = m1._normalized_id;
      const m2Id = m2._normalized_id;
      segments.push({
        id: `pair_${m1Id}_${m2Id}`,
        label: `${m1.name.split(" ")[0]} & ${m2.name.split(" ")[0]}`,
        color: colors[segments.length % colors.length],
        isPair: true,
        members: [
          { id: m1Id, name: m1.name },
          { id: m2Id, name: m2.name },
        ],
      });
    } else {
      const m = halfContributors[i];
      const mId = m._normalized_id;
      segments.push({
        id: mId,
        label: m.name,
        color: colors[segments.length % colors.length],
        isPair: false,
        members: [{ id: mId, name: m.name }],
      });
    }
  }
  return segments;
}

function handleError(error: any) {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Failed to initiate lottery";
  const errorCode = error.response?.data?.error_code;
  errorMessage.value = message;
  canRetry.value = ![
    "LOTTERY_ALREADY_INITIATED",
    "NO_ELIGIBLE_MEMBERS",
    "LOTTERY_NOT_ELIGIBLE",
  ].includes(errorCode);
  phase.value = "error";
}

function handleSpinStart() {
  isSpinning.value = true;
}

function handleSpinComplete() {
  isSpinning.value = false;
  setTimeout(() => {
    phase.value = "winner";
  }, 500);
}

function handleWinnerDone() {
  if (winner.value) {
    emit("lotteryComplete", winner.value);
  }
  handleClose();
}

function handleClose() {
  if (canDismiss.value) {
    emit("close");
  }
}
function handleDismiss() {
  if (canDismiss.value) {
    emit("close");
  }
}

function resetState() {
  phase.value = "waiting";
  winner.value = null;
  winnerId.value = "";
  wheelSegments.value = [];
  errorMessage.value = "";
  canRetry.value = false;
  isSpinning.value = false;
}
</script>

<style scoped>
.lottery-spin-modal {
  --background: var(--ion-color-dark-green, #014023);
}
.modal-content {
  --background: linear-gradient(
    180deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012a17 100%
  );
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
}
.close-button {
  --color: white;
  --padding-start: 8px;
  --padding-end: 8px;
}
.close-button ion-icon {
  font-size: 24px;
}
.modal-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.header-spacer {
  width: 40px;
}
.phase-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
  padding: 24px;
}
.waiting-phase .waiting-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.waiting-spinner {
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}
.waiting-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}
.waiting-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 280px;
}
.credit-round-badge {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.credit-round-badge ion-text {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 16px;
  font-weight: 600;
}
.spinning-phase {
  padding: 24px;
}
.credit-round-info {
  margin-bottom: 24px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.round-label {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 16px;
  font-weight: 600;
}
.winner-phase {
  padding: 0;
  height: calc(100% - 60px);
}
.error-phase {
  text-align: center;
}
.error-icon {
  font-size: 64px;
  color: var(--ion-color-danger, #eb445a);
  margin-bottom: 16px;
}
.error-title {
  display: block;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}
.error-message {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 300px;
}
.retry-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 25px;
  margin-bottom: 12px;
  min-width: 160px;
}
.cancel-button {
  --color: white;
  --border-color: rgba(255, 255, 255, 0.3);
  --border-radius: 25px;
  min-width: 160px;
}
</style>
