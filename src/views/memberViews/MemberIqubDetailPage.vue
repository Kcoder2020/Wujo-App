<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Premium Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <ion-icon
            :icon="arrowBackOutline"
            class="back-icon"
            @click="goBack"
          ></ion-icon>
          <h1 class="hero-title">Iqub Details</h1>
          <div class="header-spacer"></div>
        </div>

        <div v-if="details" class="hero-content">
          <div class="progress-container">
            <SavingsProgressRing
              :percentage="details.stats.completion_percentage"
              :current="details.stats.total_saved"
              :target="details.iqub.saving_amount * details.stats.total_rounds"
              :size="140"
              theme="dark"
            />
          </div>

          <h2 class="iqub-name">{{ details.iqub.name }}</h2>

          <div class="lottery-countdown">
            <LotteryCountdown
              v-if="details.iqub.next_lottery_date"
              :target-date="details.iqub.next_lottery_date"
              :iqub-name="details.iqub.name"
            />
            <span v-else class="no-lottery">No lottery scheduled</span>
          </div>
        </div>

        <!-- Loading Skeleton for Hero -->
        <div v-else class="hero-skeleton">
          <div class="skeleton-ring"></div>
          <div class="skeleton-line title"></div>
          <div class="skeleton-line subtitle"></div>
        </div>
      </div>

      <!-- Pull to Refresh -->
      <template #fixed>
        <ion-refresher @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
      </template>

      <div class="page-content">
        <!-- Stats Grid -->
        <div class="stats-grid" v-if="details">
          <div class="stat-card">
            <span class="stat-label">Total Saved</span>
            <span class="stat-value">{{
              formatCurrency(details.stats.total_saved)
            }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Current Round</span>
            <span class="stat-value"
              >{{ details.stats.current_round }}/{{
                details.stats.total_rounds
              }}</span
            >
          </div>
          <div class="stat-card">
            <span class="stat-label">Position</span>
            <span class="stat-value"
              >#{{ details.stats.lottery_position }}</span
            >
          </div>
        </div>

        <!-- Credit Round Progress Card -->
        <div class="credit-round-card" v-if="details?.current_credit_round">
          <div class="card-header">
            <h4 class="card-title">Current Credit Round</h4>
            <span
              class="contribution-badge"
              :class="details.member.contribution_type"
            >
              {{
                details.member.contribution_type === "full" ? "Full" : "Half"
              }}
            </span>
          </div>
          <div class="credit-round-info">
            <div class="round-number">
              Round {{ details.current_credit_round.credit_round_number }} of
              {{ details.current_credit_round.total_credit_rounds }}
            </div>
            <div class="saving-rounds">
              Saving Rounds
              {{ details.current_credit_round.saving_round_range.start }}-{{
                details.current_credit_round.saving_round_range.end
              }}
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :class="{ complete: isCreditRoundComplete }"
                :style="{ width: creditRoundProgressPercentage + '%' }"
              ></div>
            </div>
            <span class="progress-text">
              {{
                details.current_credit_round.member_progress
                  .completed_saving_rounds
              }}
              of
              {{
                details.current_credit_round.member_progress
                  .required_saving_rounds
              }}
              rounds completed
            </span>
          </div>
          <div v-if="isCreditRoundComplete" class="completion-badge">
            <ion-icon
              :icon="checkmarkCircleOutline"
              class="check-icon"
            ></ion-icon>
            <span>Credit Round Complete!</span>
          </div>
        </div>

        <!-- Rounds Section -->
        <div class="rounds-section">
          <div class="section-header">
            <h3>Payment Rounds</h3>
            <div class="pagination-controls" v-if="totalPages > 1">
              <button
                class="page-btn"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                <ion-icon :icon="chevronBackOutline" />
              </button>
              <span class="page-info">{{ currentPage }}/{{ totalPages }}</span>
              <button
                class="page-btn"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                <ion-icon :icon="chevronForwardOutline" />
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="rounds-list">
            <div v-for="i in 3" :key="i" class="skeleton-round"></div>
          </div>

          <!-- Rounds List -->
          <div v-else-if="paginatedRounds.length" class="rounds-list">
            <RoundPaymentCard
              v-for="round in paginatedRounds"
              :key="round.round_number"
              :round="round"
              :disabled="isRoundDisabled(round)"
              @click="openPaymentModal(round)"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="empty-rounds">
            <p>No payment rounds found.</p>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <PaymentMethodModal
        :is-open="isPaymentModalOpen"
        :round="selectedRound"
        @close="closePaymentModal"
        @initiate-chapa="switchToChapaFlow"
        @open-manual-form="switchToManualForm"
        @view-receipt="openReceiptViewer"
      />

      <!-- Manual Payment Form Modal -->
      <ion-modal :is-open="isManualFormOpen" @didDismiss="closeManualForm">
        <ManualPaymentForm
          v-if="selectedRound"
          :round="selectedRound"
          :iqub-id="iqubId"
          :amount="selectedRound.amount"
          :loading="isSubmittingManual"
          @submit="handleManualSubmit"
          @cancel="closeManualForm"
        />
      </ion-modal>

      <!-- Chapa Payment Flow Modal -->
      <ion-modal :is-open="isChapaFlowOpen" @didDismiss="closeChapaFlow">
        <ChapaPaymentFlow
          v-if="selectedRound"
          :round="selectedRound"
          :iqub-id="iqubId"
          :iqub-name="details?.iqub.name || ''"
          :amount="selectedRound.amount"
          @success="handleChapaSuccess"
          @error="handleChapaError"
          @cancel="closeChapaFlow"
        />
      </ion-modal>

      <!-- Receipt Viewer -->
      <ReceiptViewerModal
        v-if="selectedRound && receiptPaymentInfo"
        :is-open="isReceiptViewerOpen"
        :receipt-urls="receiptUrls"
        :payment-info="receiptPaymentInfo"
        @close="closeReceiptViewer"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  toastController,
  loadingController,
} from "@ionic/vue";
import {
  arrowBackOutline,
  chevronBackOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import SavingsProgressRing from "@/components/SavingsProgressRing.vue";
import LotteryCountdown from "@/components/LotteryCountdown.vue";
import RoundPaymentCard from "@/components/RoundPaymentCard.vue";
import PaymentMethodModal from "@/components/PaymentMethodModal.vue";
import ManualPaymentForm from "@/components/ManualPaymentForm.vue";
import ChapaPaymentFlow from "@/components/ChapaPaymentFlow.vue";
import ReceiptViewerModal from "@/components/ReceiptViewerModal.vue";
import type { RoundPaymentDetails } from "@/types";

const props = defineProps<{
  iqubId: string;
}>();

const store = useStore();
const route = useRoute();
const router = useRouter();

// State
const currentPage = ref(1);
const isPaymentModalOpen = ref(false);
const isManualFormOpen = ref(false);
const isChapaFlowOpen = ref(false);
const isReceiptViewerOpen = ref(false);
const selectedRound = ref<RoundPaymentDetails | null>(null);
const isSubmittingManual = ref(false);

// Computed
const details = computed(() => store.getters["member/memberIqubDetails"]);
const status = computed(() => store.getters["member/memberIqubDetailsStatus"]);
const isLoading = computed(() => status.value === "loading");
const profile = computed(() => store.getters["member/profile"]);

// Rounds per page based on credit round structure
const roundsPerPage = computed(() => {
  if (!details.value?.current_credit_round) return 10;

  // Get saving_rounds_per_credit_round from backend
  let roundsPerCreditRound =
    details.value.current_credit_round.saving_rounds_per_credit_round;

  // WORKAROUND: Calculate if backend returns 0 (fresh Iqub issue)
  if (!roundsPerCreditRound || roundsPerCreditRound === 0) {
    const effectiveMembers =
      details.value.iqub.effective_members || details.value.iqub.members_count;
    roundsPerCreditRound = Math.ceil(effectiveMembers);
  }

  // Show one credit round worth of rounds per page
  return roundsPerCreditRound || 10;
});

// Pagination Logic
const allRounds = computed(() => {
  if (!details.value) return [];

  const { iqub, stats, payment_history, current_credit_round } = details.value;
  console.log("Member Iqub Details:", details.value);

  // Use server-determined total_rounds (source of truth)
  let totalRounds = stats.total_rounds;
  const currentRound = stats.current_round;
  const savingAmount = iqub.saving_amount;

  // WORKAROUND: Calculate total_rounds if backend returns 0 (fresh Iqub issue)
  if (!totalRounds || totalRounds === 0) {
    const effectiveMembers = iqub.effective_members || iqub.members_count;
    const savingRoundsPerCreditRound = Math.ceil(effectiveMembers);
    const totalCreditRounds = current_credit_round?.total_credit_rounds || 10;
    totalRounds = savingRoundsPerCreditRound * totalCreditRounds;
    console.warn(
      `Backend returned total_rounds=0. Calculated: ${totalRounds} (${savingRoundsPerCreditRound} rounds × ${totalCreditRounds} credit rounds)`
    );
  }

  const rounds: RoundPaymentDetails[] = [];
  const historyMap = new Map<number, RoundPaymentDetails>(
    payment_history.map((r: RoundPaymentDetails) => [r.round_number, r])
  );

  for (let i = 1; i <= totalRounds; i++) {
    const historyRound = historyMap.get(i);
    if (historyRound) {
      rounds.push(historyRound);
    } else {
      let status: RoundPaymentDetails["status"] = "upcoming";
      if (i === currentRound) {
        status = "due";
      } else if (i < currentRound) {
        status = "due";
      }

      rounds.push({
        round_number: i,
        amount: savingAmount,
        payment_method: null,
        status: status,
        paid_at: null,
        chapa_tx_ref: null,
      });
    }
  }

  return rounds.sort((a, b) => a.round_number - b.round_number);
});

const paginatedRounds = computed(() => {
  if (!allRounds.value.length) return [];

  const startIndex = (currentPage.value - 1) * roundsPerPage.value;
  const endIndex = startIndex + roundsPerPage.value;

  return allRounds.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(allRounds.value.length / roundsPerPage.value);
});

// Receipt Viewer Data
const receiptUrls = computed(() => selectedRound.value?.receipt_urls || []);
const receiptPaymentInfo = computed(() => {
  if (!selectedRound.value || !details.value) return null;
  return {
    memberName: details.value.member.name,
    roundNumber: selectedRound.value.round_number,
    amount: selectedRound.value.amount,
    date: selectedRound.value.paid_at || new Date().toISOString(),
  };
});

// Credit Round Computed Properties
const creditRoundProgressPercentage = computed(() => {
  if (!details.value?.current_credit_round) return 0;
  const { completed_saving_rounds, required_saving_rounds } =
    details.value.current_credit_round.member_progress;
  if (required_saving_rounds === 0) return 0;
  return Math.round((completed_saving_rounds / required_saving_rounds) * 100);
});

const isCreditRoundComplete = computed(() => {
  return (
    details.value?.current_credit_round?.member_progress.is_complete || false
  );
});

// Methods
const isRoundDisabled = (round: RoundPaymentDetails) => {
  if (["success", "pending", "pending_verification"].includes(round.status)) {
    return false;
  }

  const firstUnpaidRound = allRounds.value.find((r) =>
    ["due", "upcoming", "failed"].includes(r.status)
  );

  if (!firstUnpaidRound) return false;

  if (round.round_number === firstUnpaidRound.round_number) {
    return false;
  }

  return true;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const fetchDetails = async () => {
  if (!profile.value?.id) {
    await store.dispatch("member/fetchMemberProfile");
  }

  await store.dispatch("member/fetchMemberIqubDetails", {
    iqubId: props.iqubId,
  });
};

const handleRefresh = async (event: CustomEvent) => {
  await fetchDetails();
  (event.target as any)?.complete();
};

const goBack = () => {
  router.back();
};

// Pagination Controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Modal Handlers
const openPaymentModal = (round: RoundPaymentDetails) => {
  selectedRound.value = round;
  isPaymentModalOpen.value = true;
};

const closePaymentModal = () => {
  isPaymentModalOpen.value = false;
  // Don't clear selectedRound immediately to avoid UI flicker
  setTimeout(() => {
    if (!isManualFormOpen.value && !isChapaFlowOpen.value) {
      selectedRound.value = null;
    }
  }, 300);
};

const switchToChapaFlow = () => {
  isPaymentModalOpen.value = false;
  setTimeout(() => {
    isChapaFlowOpen.value = true;
  }, 100);
};

const switchToManualForm = () => {
  isPaymentModalOpen.value = false;
  setTimeout(() => {
    isManualFormOpen.value = true;
  }, 100);
};

const closeManualForm = () => {
  isManualFormOpen.value = false;
  selectedRound.value = null;
};

const closeChapaFlow = () => {
  isChapaFlowOpen.value = false;
  selectedRound.value = null;
};

const openReceiptViewer = () => {
  isPaymentModalOpen.value = false;
  setTimeout(() => {
    isReceiptViewerOpen.value = true;
  }, 100);
};

const closeReceiptViewer = () => {
  isReceiptViewerOpen.value = false;
  selectedRound.value = null;
};

// Payment Handlers
const handleManualSubmit = async (file: File) => {
  if (!selectedRound.value) return;

  isSubmittingManual.value = true;

  try {
    // 1. Upload Receipt
    const formData = new FormData();
    formData.append("file", file);

    // Assuming generic upload endpoint, adjust if needed
    // In a real app, we'd use a dedicated upload service
    // For now mocking the upload response or using existing service if available
    // Since we don't have the upload service code, I'll assume a direct API call
    // or use a placeholder URL for testing if upload fails

    // Simulating upload for now as I don't see upload service in context
    // In production, implement actual file upload here
    const receiptUrl = URL.createObjectURL(file);

    // 2. Submit Payment
    const result = await store.dispatch("member/submitManualPayment", {
      iqubId: props.iqubId,
      roundNumber: selectedRound.value.round_number,
      amount: selectedRound.value.amount,
      receipt_url: receiptUrl, // In real app, this would be the S3/Cloudinary URL
    });

    if (result.success) {
      const toast = await toastController.create({
        message: "Payment submitted for verification!",
        duration: 3000,
        color: "success",
        position: "top",
      });
      await toast.present();
      closeManualForm();
      fetchDetails(); // Refresh data
    } else {
      throw new Error(result.error);
    }
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.message || "Failed to submit payment",
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  } finally {
    isSubmittingManual.value = false;
  }
};

const handleChapaSuccess = () => {
  // This is called just before redirect, usually not much to do here
  // The actual success handling happens on return URL
  closeChapaFlow();
};

const handleChapaError = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    duration: 3000,
    color: "danger",
    position: "top",
  });
  await toast.present();
};

// Check for Chapa Return
const checkChapaReturn = async () => {
  const txRef = route.query.tx_ref as string;
  const status = route.query.status as string;

  if (txRef) {
    const loading = await loadingController.create({
      message: "Verifying payment...",
    });
    await loading.present();

    try {
      const result = await store.dispatch("member/checkPaymentStatus", {
        tx_ref: txRef,
      });

      if (result.success && result.status === "success") {
        const toast = await toastController.create({
          message: "Payment verified successfully!",
          duration: 3000,
          color: "success",
          position: "top",
        });
        await toast.present();
      } else {
        const toast = await toastController.create({
          message: "Payment verification failed or pending.",
          duration: 3000,
          color: "warning",
          position: "top",
        });
        await toast.present();
      }

      // Clear query params
      router.replace({ query: {} });

      // Refresh details
      await fetchDetails();
    } catch (error) {
      console.error("Verification error", error);
    } finally {
      await loading.dismiss();
    }
  }
};

onMounted(() => {
  fetchDetails();
  checkChapaReturn();
});

// Ensure current round is visible
watch(
  () => details.value,
  (newDetails) => {
    if (newDetails) {
      const currentRound = newDetails.stats.current_round;
      const perPage =
        newDetails.current_credit_round?.saving_rounds_per_credit_round || 10;
      const targetPage = Math.ceil(currentRound / perPage);
      if (targetPage > 0) {
        currentPage.value = targetPage;
      }
    }
  },
  { immediate: true }
);

// Watch for route changes (e.g. returning from payment)
watch(
  () => route.query,
  () => {
    checkChapaReturn();
  }
);
</script>

<style scoped>
ion-content {
  --background: #f2f2f2;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px 24px 48px;
  border-radius: 0 0 32px 32px;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.back-icon {
  font-size: 28px;
  color: white;
}

.hero-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-spacer {
  width: 28px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeInDown 0.5s ease-out;
}

.progress-container {
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  padding: 4px;
}

.iqub-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #5fd9ac;
}

.lottery-countdown {
  margin-top: 8px;
}

.no-lottery {
  font-size: 14px;
  opacity: 0.8;
}

/* Stats Grid */
.page-content {
  padding: 0 20px 20px;
  margin-top: -32px;
  position: relative;
  z-index: 10;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 16px 12px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #014023;
}

/* Credit Round Card */
.credit-round-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.3s ease-in;
}

.credit-round-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.credit-round-card .card-title {
  font-size: 16px;
  font-weight: 700;
  color: #014023;
  margin: 0;
}

.contribution-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contribution-badge.full {
  background: rgba(95, 217, 172, 0.15);
  color: #5fd9ac;
}

.contribution-badge.half {
  background: rgba(95, 217, 172, 0.08);
  color: rgba(95, 217, 172, 0.8);
}

.credit-round-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.round-number {
  font-size: 18px;
  font-weight: 700;
  color: #014023;
}

.saving-rounds {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.progress-bar-container {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5fd9ac 0%, #014023 100%);
  border-radius: 8px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill.complete {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.progress-text {
  font-size: 13px;
  color: #666;
  font-weight: 500;
  display: block;
  text-align: center;
}

.completion-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  color: #10b981;
  font-weight: 600;
  font-size: 14px;
}

.completion-badge .check-icon {
  font-size: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Rounds Section */
.rounds-section {
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  min-height: 300px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #014023;
  margin: 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9f9f9;
  padding: 4px;
  border-radius: 12px;
}

.page-btn {
  background: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #014023;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  box-shadow: none;
}

.page-info {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.empty-rounds {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

/* Skeletons */
.hero-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.skeleton-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 1.5s infinite;
}

.skeleton-line {
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-line.title {
  width: 150px;
  height: 24px;
}

.skeleton-line.subtitle {
  width: 100px;
}

.skeleton-round {
  height: 80px;
  background: #f9f9f9;
  border-radius: 16px;
  margin-bottom: 12px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 0.6;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
