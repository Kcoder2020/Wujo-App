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
          @click="activeTab = 'history'"
        >
          Payment History
        </div>
        <div
          :class="['tab-button', { active: activeTab === 'verifications' }]"
          @click="activeTab = 'verifications'"
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
        <!-- Payment History Tab -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <div v-if="paymentHistory.length > 0" class="cards-container">
            <PaymentHistoryCard
              v-for="payment in paymentHistory"
              :key="payment.id"
              :payment="payment"
              @receipt-click="openReceiptViewer"
            />
          </div>
          <div v-else class="empty-state">
            <ion-icon :icon="documentTextOutline" class="empty-icon" />
            <p>No payment history available</p>
          </div>
        </div>

        <!-- Verifications Tab -->
        <div v-if="activeTab === 'verifications'" class="tab-content">
          <div v-if="pendingVerifications.length > 0" class="cards-container">
            <VerificationRequestCard
              v-for="request in pendingVerifications"
              :key="request.id"
              :request="request"
              @approve="handleApproveClick"
              @reject="handleRejectClick"
              @receipt-click="openReceiptViewer"
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
} from "@ionic/vue";
import {
  alertCircleOutline,
  documentTextOutline,
  checkmarkCircleOutline,
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
    },
    paymentStats: {
      currentRound: memberData.value.payment_stats.current_round,
      totalRounds: memberData.value.iqub.total_rounds,
      paidAmount: memberData.value.payment_stats.total_paid,
      totalExpected: memberData.value.payment_stats.total_expected,
      completionPercentage:
        memberData.value.payment_stats.completion_percentage,
    },
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

const openReceiptViewer = (receiptUrls: string[]) => {
  selectedReceiptUrls.value = receiptUrls;
  receiptPaymentInfo.value = {
    roundNumber: 1, // Will be updated with actual data
    amount: 1000,
    date: new Date().toISOString(),
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

    // Refresh data
    await fetchData();
  } catch (error) {
    console.error("Failed to approve verification:", error);
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

    // Refresh data
    await fetchData();
  } catch (error) {
    console.error("Failed to reject verification:", error);
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
</style>
