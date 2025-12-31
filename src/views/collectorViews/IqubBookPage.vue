<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Member Hero Section -->
      <MemberHeroSection
        v-if="transformedMemberData"
        :member="transformedMemberData.member"
        :payment-stats="transformedMemberData.paymentStats"
        @back="handleBack"
      />

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <div
          :class="['tab-button', { active: activeTab === 'history' }]"
          @click="handleTabChange('history')"
        >
          Payment History
        </div>
        <div
          :class="['tab-button', { active: activeTab === 'verifications' }]"
          @click="handleTabChange('verifications')"
        >
          Verifications
          <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="dots" color="medium-aquamarine" />
        <p>Loading payment details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <ion-icon :icon="alertCircleOutline" class="error-icon" />
        <p class="error-message">{{ error }}</p>
        <ion-button @click="fetchData" fill="outline">Retry</ion-button>
      </div>

      <!-- Content Area -->
      <div v-else class="content-area">
        <!-- Payment Detail View -->
        <div
          v-if="showPaymentDetail && selectedPaymentDetails"
          class="payment-detail-view"
        >
          <!-- Back Button -->
          <div class="detail-header">
            <ion-button fill="clear" @click="closePaymentDetail">
              <template #start>
                <ion-icon :icon="arrowBack" />
              </template>
              Back to History
            </ion-button>
          </div>

          <!-- Status Banner -->
          <div
            :class="[
              'status-banner',
              `status-${selectedPaymentDetails.status}`,
            ]"
          >
            <ion-icon
              :icon="
                selectedPaymentDetails.status === 'success'
                  ? checkmarkCircleOutline
                  : selectedPaymentDetails.status === 'pending'
                  ? timeOutline
                  : alertCircleOutline
              "
            />
            <span class="status-text">{{
              selectedPaymentDetails.status === "success"
                ? "Payment Successful"
                : selectedPaymentDetails.status === "pending"
                ? "Payment Pending"
                : "Payment Failed"
            }}</span>
          </div>

          <!-- Payment Information -->
          <div class="detail-section">
            <h3 class="section-title">Payment Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Round Number</span>
                <span class="value">{{
                  selectedPaymentDetails.roundNumber
                }}</span>
              </div>
              <div class="info-item">
                <span class="label">Amount</span>
                <span class="value"
                  >{{
                    new Intl.NumberFormat("en-ET").format(
                      selectedPaymentDetails.amount
                    )
                  }}
                  ETB</span
                >
              </div>
              <div class="info-item">
                <span class="label">Payment Method</span>
                <span class="value">{{
                  selectedPaymentDetails.paymentMethod === "manual"
                    ? "Manual Payment"
                    : selectedPaymentDetails.paymentMethod === "chapa"
                    ? "Chapa Payment"
                    : selectedPaymentDetails.paymentMethod
                }}</span>
              </div>
              <div class="info-item">
                <span class="label">Payment Date</span>
                <span class="value">{{
                  new Date(
                    selectedPaymentDetails.paymentDate
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }}</span>
              </div>
              <div
                v-if="selectedPaymentDetails.chapaTxRef"
                class="info-item full-width"
              >
                <span class="label">Transaction Reference</span>
                <span class="value tx-ref">{{
                  selectedPaymentDetails.chapaTxRef
                }}</span>
              </div>
            </div>
          </div>

          <!-- Receipt Section -->
          <div
            v-if="
              selectedPaymentDetails.receiptUrls &&
              selectedPaymentDetails.receiptUrls.length > 0
            "
            class="detail-section"
          >
            <h3 class="section-title">Payment Receipt</h3>
            <div class="receipt-gallery">
              <div
                v-for="(url, index) in selectedPaymentDetails.receiptUrls"
                :key="index"
                class="receipt-thumbnail-container"
                @click="
                  openReceiptViewer(selectedPaymentDetails.receiptUrls, {
                    roundNumber: selectedPaymentDetails.roundNumber,
                    amount: selectedPaymentDetails.amount,
                    date: selectedPaymentDetails.paymentDate,
                  })
                "
              >
                <img :src="url" alt="Receipt" class="receipt-thumbnail" />
                <div class="receipt-overlay">
                  <ion-icon :icon="expandOutline" />
                </div>
              </div>
            </div>
          </div>

          <!-- Member Information -->
          <div class="detail-section">
            <h3 class="section-title">Member Information</h3>
            <div class="member-info">
              <div class="member-avatar">
                <img
                  v-if="memberData?.member.avatar"
                  :src="memberData.member.avatar"
                  :alt="memberData.member.name"
                />
                <ion-icon v-else :icon="personCircleOutline" />
              </div>
              <div class="member-details">
                <p class="member-name">{{ memberData?.member.name }}</p>
                <p class="member-phone">{{ memberData?.member.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History Tab -->
        <div v-else-if="activeTab === 'history'" class="tab-content">
          <div v-if="paymentHistory.length > 0" class="cards-container">
            <PaymentHistoryCard
              v-for="payment in paymentHistory"
              :key="payment.id"
              :payment="payment"
              @card-click="handlePaymentCardClick"
              @receipt-click="
                (urls) =>
                  openReceiptViewer(urls, {
                    roundNumber: payment.roundNumber,
                    amount: payment.amount,
                    date: payment.paymentDate,
                  })
              "
            />
          </div>
          <div v-else class="empty-state">
            <ion-icon :icon="documentTextOutline" class="empty-icon" />
            <p>No payment history available</p>
          </div>
        </div>

        <!-- Verifications Tab -->
        <div v-else-if="activeTab === 'verifications'" class="tab-content">
          <div v-if="pendingVerifications.length > 0" class="cards-container">
            <VerificationRequestCard
              v-for="request in pendingVerifications"
              :key="request.id"
              :request="request"
              @approve="handleApproveClick"
              @reject="handleRejectClick"
              @receipt-click="
                (urls) =>
                  openReceiptViewer(urls, {
                    roundNumber: request.roundNumber,
                    amount: request.amount,
                    date: request.submissionDate,
                  })
              "
            />
          </div>
          <div v-else class="empty-state">
            <ion-icon :icon="checkmarkCircleOutline" class="empty-icon" />
            <p>No pending verifications</p>
          </div>
        </div>
      </div>

      <!-- Receipt Viewer Modal -->
      <ReceiptViewerModal
        :is-open="isReceiptModalOpen"
        :receipt-urls="selectedReceiptUrls"
        :payment-info="receiptPaymentInfo"
        @close="closeReceiptViewer"
      />

      <!-- Approval Dialog -->
      <ApprovalDialog
        :is-open="isApprovalDialogOpen"
        @confirm="confirmApproval"
        @cancel="closeApprovalDialog"
      />

      <!-- Rejection Dialog -->
      <RejectionDialog
        :is-open="isRejectionDialogOpen"
        @confirm="confirmRejection"
        @cancel="closeRejectionDialog"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  useIonRouter,
  IonPage,
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,
  toastController,
} from "@ionic/vue";
import {
  alertCircleOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  arrowBack,
  timeOutline,
  expandOutline,
  personCircleOutline,
} from "ionicons/icons";

// Import components
import MemberHeroSection from "@/components/MemberHeroSection.vue";
import PaymentHistoryCard from "@/components/PaymentHistoryCard.vue";
import VerificationRequestCard from "@/components/VerificationRequestCard.vue";
import ReceiptViewerModal from "@/components/ReceiptViewerModal.vue";
import ApprovalDialog from "@/components/ApprovalDialog.vue";
import RejectionDialog from "@/components/RejectionDialog.vue";

const route = useRoute();
const store = useStore();
const ionRouter = useIonRouter();

// Route params
const iqubId = computed(() => route.params.iqubId as string);
const memberId = computed(() => route.params.memberId as string);

// State
const activeTab = ref<"history" | "verifications">("history");
const isReceiptModalOpen = ref(false);
const selectedReceiptUrls = ref<string[]>([]);
const receiptPaymentInfo = ref({
  roundNumber: 0,
  amount: 0,
  date: "",
  memberName: "",
});
const isApprovalDialogOpen = ref(false);
const isRejectionDialogOpen = ref(false);
const selectedVerificationId = ref<string | null>(null);
const showPaymentDetail = ref(false);
const selectedPaymentDetails = ref<any>(null);

// Computed properties from store
const memberData = computed(() => store.getters["memberPayments/memberData"]);
const paymentHistory = computed(
  () => store.getters["memberPayments/paymentHistory"]
);
const pendingVerifications = computed(
  () => store.getters["memberPayments/pendingVerifications"]
);
const isLoading = computed(() => store.getters["memberPayments/isLoading"]);
const error = computed(() => store.getters["memberPayments/error"]);

const pendingCount = computed(() => pendingVerifications.value.length);

// Transform data for MemberHeroSection component
const transformedMemberData = computed(() => {
  if (!memberData.value) return null;

  return {
    member: {
      id: memberData.value.member.id,
      name: memberData.value.member.name,
      phone: memberData.value.member.phone,
      avatar: memberData.value.member.avatar,
      joinDate: memberData.value.member.join_date,
      contributionType: memberData.value.member.contribution_type,
    },
    paymentStats: {
      currentRound: memberData.value.payment_stats.current_round,
      totalRounds: memberData.value.iqub.total_rounds,
      paidAmount: memberData.value.payment_stats.total_paid,
      totalExpected: memberData.value.payment_stats.total_expected,
      completionPercentage:
        memberData.value.payment_stats.completion_percentage,
    },
    currentCreditRound: memberData.value.current_credit_round,
  };
});

// Methods
const fetchData = async () => {
  await store.dispatch("memberPayments/fetchMemberPaymentDetails", {
    memberId: memberId.value,
    iqubId: iqubId.value,
  });
};

const handleBack = () => {
  ionRouter.back();
};

const handleTabChange = (tab: "history" | "verifications") => {
  activeTab.value = tab;
  // Close payment detail view when switching tabs
  if (showPaymentDetail.value) {
    closePaymentDetail();
  }
};

const openReceiptViewer = (
  receiptUrls: string[],
  paymentData?: {
    roundNumber: number;
    amount: number;
    date: string;
  }
) => {
  selectedReceiptUrls.value = receiptUrls;
  receiptPaymentInfo.value = {
    roundNumber: paymentData?.roundNumber || 0,
    amount: paymentData?.amount || 0,
    date: paymentData?.date || new Date().toISOString(),
    memberName: memberData.value?.member.name || "Member",
  };
  isReceiptModalOpen.value = true;
};

const closeReceiptViewer = () => {
  isReceiptModalOpen.value = false;
  selectedReceiptUrls.value = [];
};

const handleApproveClick = (verificationId: string) => {
  selectedVerificationId.value = verificationId;
  isApprovalDialogOpen.value = true;
};

const handleRejectClick = (verificationId: string) => {
  selectedVerificationId.value = verificationId;
  isRejectionDialogOpen.value = true;
};

const confirmApproval = async (notes?: string) => {
  if (!selectedVerificationId.value) return;

  try {
    await store.dispatch("memberPayments/approveVerification", {
      verification_id: selectedVerificationId.value,
      notes,
    });

    isApprovalDialogOpen.value = false;
    selectedVerificationId.value = null;

    // Show success toast
    const toast = await toastController.create({
      message: "Payment approved successfully",
      duration: 3000,
      position: "top",
      color: "success",
      cssClass: "wujo-toast",
    });
    await toast.present();

    // Refresh data
    await fetchData();
  } catch (error) {
    console.error("Failed to approve verification:", error);

    // Show error toast
    const toast = await toastController.create({
      message: "Failed to approve payment. Please try again.",
      duration: 3000,
      position: "top",
      color: "danger",
      cssClass: "wujo-toast",
    });
    await toast.present();
  }
};

const confirmRejection = async (reason: string, notes?: string) => {
  if (!selectedVerificationId.value) return;

  try {
    await store.dispatch("memberPayments/rejectVerification", {
      verification_id: selectedVerificationId.value,
      reason,
      notes,
    });

    isRejectionDialogOpen.value = false;
    selectedVerificationId.value = null;

    // Show success toast
    const toast = await toastController.create({
      message: "Payment rejected",
      duration: 3000,
      position: "top",
      color: "warning",
      cssClass: "wujo-toast",
    });
    await toast.present();

    // Refresh data
    await fetchData();
  } catch (error) {
    console.error("Failed to reject verification:", error);

    // Show error toast
    const toast = await toastController.create({
      message: "Failed to reject payment. Please try again.",
      duration: 3000,
      position: "top",
      color: "danger",
      cssClass: "wujo-toast",
    });
    await toast.present();
  }
};

const closeApprovalDialog = () => {
  isApprovalDialogOpen.value = false;
  selectedVerificationId.value = null;
};

const closeRejectionDialog = () => {
  isRejectionDialogOpen.value = false;
  selectedVerificationId.value = null;
};

const handlePaymentCardClick = (payment: any) => {
  console.log("Payment clicked:", payment);

  // Create a plain object with all payment details
  selectedPaymentDetails.value = {
    id: payment.id,
    roundNumber: payment.roundNumber,
    amount: payment.amount,
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    status: payment.status,
    chapaTxRef: payment.chapaTxRef,
    verificationId: payment.verificationId,
    receiptUrls: payment.receiptUrls || [],
  };

  console.log("Selected payment details:", selectedPaymentDetails.value);

  showPaymentDetail.value = true;
};

const closePaymentDetail = () => {
  showPaymentDetail.value = false;
  selectedPaymentDetails.value = null;
};

// Lifecycle
onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
ion-content {
  --background: var(--ion-color-white-smoke, #f2f2f2);
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 4px;
  margin: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  color: var(--ion-color-medium, #6c757d);
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-button.active {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  color: var(--ion-color-dark-green, #014023);
  box-shadow: 0 2px 8px rgba(95, 217, 172, 0.3);
}

.tab-button .badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ion-color-danger, #dc3545);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.loading-container ion-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}

.loading-container p {
  color: var(--ion-color-medium, #6c757d);
  font-size: 16px;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  color: var(--ion-color-danger, #dc3545);
  margin-bottom: 16px;
}

.error-message {
  color: var(--ion-color-dark-green, #014023);
  font-size: 16px;
  margin-bottom: 24px;
}

/* Content Area */
.content-area {
  padding: 0 24px 24px;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
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

.cards-container {
  display: flex;
  flex-direction: column;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium, #6c757d);
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--ion-color-medium, #6c757d);
  font-size: 16px;
}

/* Payment Detail View */
.payment-detail-view {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.detail-header {
  padding: 16px 0;
}

.detail-header ion-button {
  --color: var(--ion-color-dark-green, #014023);
  font-weight: 600;
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border-radius: 16px;
  margin-bottom: 16px;
}

.status-banner ion-icon {
  font-size: 32px;
}

.status-success {
  background: linear-gradient(135deg, #2dd36f, #1fb35f);
}

.status-pending {
  background: linear-gradient(135deg, #ffa500, #ff8c00);
}

.status-failed {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

/* Detail Section */
.detail-section {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .label {
  font-size: 12px;
  color: var(--ion-color-medium, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
}

.info-item .value.tx-ref {
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
}

/* Receipt Gallery */
.receipt-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.receipt-thumbnail-container {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.receipt-thumbnail-container:hover {
  transform: scale(1.05);
}

.receipt-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.receipt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 64, 35, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.receipt-thumbnail-container:hover .receipt-overlay {
  opacity: 1;
}

.receipt-overlay ion-icon {
  font-size: 32px;
  color: white;
}

/* Member Info */
.member-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ion-color-light, #f4f5f8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar ion-icon {
  font-size: 48px;
  color: var(--ion-color-medium, #6c757d);
}

.member-details {
  flex: 1;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.member-phone {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
  margin: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
