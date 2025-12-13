<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Hero Section with Dark Green Gradient (matches MyIqubsPage) -->
      <div class="hero-section">
        <div class="hero-header">
          <ion-icon
            :icon="arrowBackOutline"
            class="back-icon"
            @click="goBack"
          ></ion-icon>
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
        </div>
        <div class="hero-content">
          <ion-icon :icon="documentTextOutline" class="hero-icon"></ion-icon>
          <h1 class="hero-title">Iqub Book</h1>
          <div v-if="currentIqub" class="hero-card">
            <div class="hero-card-header">
              <ion-text class="iqub-name">{{ currentIqub.name }}</ion-text>
            </div>
            <div class="hero-card-stats">
              <div class="stat-item">
                <ion-text class="stat-label">Total Amount</ion-text>
                <ion-text class="stat-value"
                  >{{ formatCurrency(currentIqub.credit_amount) }} ETB</ion-text
                >
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <ion-text class="stat-label">Collected</ion-text>
                <ion-text class="stat-value"
                  >{{
                    formatCurrency(currentIqub.total_collected || 0)
                  }}
                  ETB</ion-text
                >
              </div>
            </div>
            <div class="hero-card-progress">
              <progress-ring
                :percentage="completionPercentage"
                :size="80"
                :stroke-width="8"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area for Iqub Details -->
      <div class="iqub-detail-content">
        <!-- Loading Indicator -->
        <div
          v-if="status === 'loading' || (status === 'idle' && !currentIqub)"
          class="loading-indicator"
        >
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading Iqub details...</ion-text>
        </div>

        <!-- Error Message -->
        <div v-else-if="status === 'error' && error" class="error-message">
          <p>Error loading Iqub details: {{ error }}</p>
          <ion-button @click="retryFetch">Retry</ion-button>
        </div>

        <!-- Iqub Details Content (Visible when status is success and currentIqub is available) -->
        <div v-else-if="currentIqub" class="iqub-data-container">
          <!-- Hero Card with Premium Dark Green Background -->

          <!-- Tabbed Interface -->
          <div class="tab-bar">
            <button
              class="tab-button"
              :class="{ active: activeTab === 'overview' }"
              @click="activeTab = 'overview'"
            >
              Overview
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'members' }"
              @click="activeTab = 'members'"
            >
              Members
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'payments' }"
              @click="activeTab = 'payments'"
            >
              Payments
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'lottery' }"
              @click="activeTab = 'lottery'"
            >
              Lottery
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-panel overview-tab">
              <!-- Statistics Cards -->
              <div class="statistics-grid">
                <div class="stat-card">
                  <ion-icon :icon="cashOutline" class="stat-icon"></ion-icon>
                  <ion-text class="stat-card-label">Total Iqub Amount</ion-text>
                  <ion-text class="stat-card-value"
                    >{{
                      formatCurrency(currentIqub.credit_amount)
                    }}
                    ETB</ion-text
                  >
                </div>

                <div class="stat-card">
                  <ion-icon :icon="walletOutline" class="stat-icon"></ion-icon>
                  <ion-text class="stat-card-label">Collected Amount</ion-text>
                  <ion-text class="stat-card-value"
                    >{{
                      formatCurrency(currentIqub.total_collected || 0)
                    }}
                    ETB</ion-text
                  >
                </div>

                <div class="stat-card">
                  <ion-icon
                    :icon="trendingUpOutline"
                    class="stat-icon"
                  ></ion-icon>
                  <ion-text class="stat-card-label">Remaining Amount</ion-text>
                  <ion-text class="stat-card-value"
                    >{{ formatCurrency(remainingAmount) }} ETB</ion-text
                  >
                </div>

                <div class="stat-card">
                  <ion-icon :icon="peopleOutline" class="stat-icon"></ion-icon>
                  <ion-text class="stat-card-label">Members</ion-text>
                  <ion-text class="stat-card-value"
                    >{{ currentIqub.current_members }}/{{
                      currentIqub.members_count
                    }}</ion-text
                  >
                </div>

                <div class="stat-card">
                  <ion-icon
                    :icon="checkmarkCircleOutline"
                    class="stat-icon"
                  ></ion-icon>
                  <ion-text class="stat-card-label">Status</ion-text>
                  <ion-text
                    class="stat-card-value status-badge"
                    :class="currentIqub.status || 'pending'"
                  >
                    {{
                      (currentIqub.status || "pending")
                        .charAt(0)
                        .toUpperCase() +
                      (currentIqub.status || "pending").slice(1)
                    }}
                  </ion-text>
                </div>

                <div class="stat-card">
                  <ion-icon
                    :icon="calendarOutline"
                    class="stat-icon"
                  ></ion-icon>
                  <ion-text class="stat-card-label">Saving Pattern</ion-text>
                  <ion-text class="stat-card-value">{{
                    getSavingPatternLabel(currentIqub.saving_pattern)
                  }}</ion-text>
                </div>
              </div>

              <!-- Recent Activity Timeline (if data available) -->
              <div
                v-if="
                  currentIqub.members_list &&
                  currentIqub.members_list.length > 0
                "
                class="recent-activity"
              >
                <ion-text class="section-title">Recent Activity</ion-text>
                <div class="activity-timeline">
                  <div class="activity-item">
                    <div class="activity-icon">
                      <ion-icon :icon="personAddOutline"></ion-icon>
                    </div>
                    <div class="activity-content">
                      <ion-text class="activity-title">Members Joined</ion-text>
                      <ion-text class="activity-description"
                        >{{ currentIqub.current_members }} members have joined
                        this Iqub</ion-text
                      >
                      <ion-text class="activity-time">{{
                        formatDate(currentIqub.created_at)
                      }}</ion-text>
                    </div>
                  </div>

                  <div
                    v-if="currentIqub.status === 'active'"
                    class="activity-item"
                  >
                    <div class="activity-icon success">
                      <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    </div>
                    <div class="activity-content">
                      <ion-text class="activity-title">Iqub Activated</ion-text>
                      <ion-text class="activity-description"
                        >Iqub is now active and collecting
                        contributions</ion-text
                      >
                      <ion-text class="activity-time">{{
                        formatDate(currentIqub.created_at)
                      }}</ion-text>
                    </div>
                  </div>

                  <div class="activity-item">
                    <div class="activity-icon">
                      <ion-icon :icon="addCircleOutline"></ion-icon>
                    </div>
                    <div class="activity-content">
                      <ion-text class="activity-title">Iqub Created</ion-text>
                      <ion-text class="activity-description"
                        >{{ currentIqub.name }} was created</ion-text
                      >
                      <ion-text class="activity-time">{{
                        formatDate(currentIqub.created_at)
                      }}</ion-text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Members Tab (Modern Design) -->
            <div
              v-else-if="activeTab === 'members'"
              class="tab-panel members-tab"
            >
              <!-- Members List with Cards -->
              <div
                v-if="
                  currentIqub.members_list &&
                  currentIqub.members_list.length > 0
                "
                class="members-modern-list"
              >
                <!-- Member Cards (Paginated) -->
                <div
                  v-for="member in paginatedMembers"
                  :key="member.id"
                  class="member-card"
                  @click="goToMemberDetails(member.id)"
                >
                  <div class="member-avatar">
                    <ion-icon :icon="personOutline"></ion-icon>
                  </div>
                  <div class="member-info">
                    <ion-text class="member-name">{{
                      member.name || "N/A"
                    }}</ion-text>
                    <ion-text class="member-phone">{{
                      member.phone || "N/A"
                    }}</ion-text>
                  </div>
                  <div class="member-badge">
                    <ion-text class="badge-value">{{
                      member.saving_rounds || 0
                    }}</ion-text>
                    <ion-text class="badge-label">Rounds</ion-text>
                  </div>
                </div>

                <!-- Pagination Controls (if needed) -->
                <div v-if="totalPages > 1" class="pagination-controls">
                  <ion-button
                    fill="clear"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                    class="pagination-button"
                  >
                    <ion-icon :icon="chevronBackOutline"></ion-icon>
                  </ion-button>
                  <ion-text class="pagination-text">
                    Page {{ currentPage }} of {{ totalPages }}
                  </ion-text>
                  <ion-button
                    fill="clear"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                    class="pagination-button"
                  >
                    <ion-icon :icon="chevronForwardOutline"></ion-icon>
                  </ion-button>
                </div>
              </div>

              <!-- Empty State for Members -->
              <div v-else class="empty-state-members">
                <ion-icon :icon="peopleOutline" class="empty-icon"></ion-icon>
                <ion-text class="empty-title">No Members Yet</ion-text>
                <ion-text class="empty-description">
                  Add members to start your Iqub
                </ion-text>
              </div>
            </div>

            <!-- Sticky Add Member Button (Outside tabs, always visible) -->
            <div
              v-if="canAddMembers && activeTab === 'members'"
              class="sticky-fab"
            >
              <ion-button
                expand="block"
                @click="openModal"
                :disabled="status === 'loading' || isAdding"
                class="fab-button"
              >
                <template #start>
                  <ion-icon :icon="personAddOutline"></ion-icon>
                </template>
                {{ isAdding ? "Adding..." : "Add Member" }}
              </ion-button>
            </div>

            <!-- Iqub Full Message (Sticky) -->
            <div
              v-if="!canAddMembers && activeTab === 'members'"
              class="sticky-fab"
            >
              <div class="iqub-full-message">
                <ion-icon
                  :icon="checkmarkCircleOutline"
                  class="full-icon"
                ></ion-icon>
                <ion-text class="full-text">
                  This Iqub is full ({{ currentIqub.members_count }} /
                  {{ currentIqub.members_count }} members)
                </ion-text>
              </div>
            </div>

            <!-- Payments Tab (Placeholder) -->
            <div
              v-else-if="activeTab === 'payments'"
              class="tab-panel payments-tab"
            >
              <div class="empty-state-tab">
                <ion-icon
                  :icon="documentTextOutline"
                  class="empty-icon"
                ></ion-icon>
                <ion-text class="empty-title">Payments Coming Soon</ion-text>
                <ion-text class="empty-description"
                  >Payment rounds and verification will be available
                  here</ion-text
                >
              </div>
            </div>

            <!-- Lottery Tab -->
            <div
              v-else-if="activeTab === 'lottery'"
              class="tab-panel lottery-tab"
            >
              <div class="lottery-content">
                <!-- Next Lottery Date Section -->
                <div class="lottery-section">
                  <ion-text class="section-title">Next Lottery Date</ion-text>
                  <div class="date-picker-container">
                    <ion-datetime
                      v-model="nextLotteryDate"
                      display-format="YYYY-MM-DD"
                      picker-format="YYYY-MM-DD"
                      :value="
                        currentIqub.next_lottery_date
                          ? currentIqub.next_lottery_date.split('T')[0]
                          : undefined
                      "
                      min="2024-01-01"
                      class="datetime-input"
                    ></ion-datetime>
                  </div>
                  <ion-button
                    expand="block"
                    @click="setNextLotteryDate"
                    :disabled="
                      isSettingDate || status === 'loading' || !nextLotteryDate
                    "
                    class="action-button secondary-action"
                  >
                    <template #start>
                      <ion-icon :icon="calendarOutline"></ion-icon>
                    </template>
                    {{ isSettingDate ? "Setting..." : "Set Next Lottery Date" }}
                  </ion-button>
                </div>

                <!-- Initiate Lottery Section -->
                <div class="lottery-section">
                  <ion-text class="section-title">Lottery Actions</ion-text>
                  <div class="lottery-info">
                    <ion-text class="info-text">
                      Current Status:
                      <span
                        class="status-badge"
                        :class="currentIqub.status || 'pending'"
                        >{{ currentIqub.status || "pending" }}</span
                      >
                    </ion-text>
                  </div>
                  <ion-button
                    expand="block"
                    class="action-button primary-action"
                    @click="startLottery"
                    :disabled="isInitiating || status === 'loading'"
                  >
                    <template #start>
                      <ion-icon :icon="trophyOutline"></ion-icon>
                    </template>
                    {{ isInitiating ? "Initiating..." : "Initiate Lottery" }}
                  </ion-button>
                </div>

                <!-- Lottery History (if available) -->
                <div v-if="currentIqub.hosted_lottery" class="lottery-section">
                  <ion-text class="section-title">Lottery History</ion-text>
                  <div class="lottery-history-card">
                    <ion-text class="history-label">Hosted Lotteries</ion-text>
                    <ion-text class="history-value">{{
                      currentIqub.hosted_lottery
                    }}</ion-text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Member Bottom Sheet Modal -->
      <ion-modal
        :is-open="isModalOpen"
        @willDismiss="closeModal"
        class="add-member-modal"
      >
        <div class="modal-wrapper">
          <!-- Modal Handle -->
          <div class="modal-handle"></div>

          <ion-text class="modal-title">
            <h2>Add Member</h2>
          </ion-text>

          <form @submit.prevent="addMember" class="modal-form">
            <!-- Name Input Field -->
            <div class="form-field">
              <ion-label class="field-label">Member Name</ion-label>
              <div
                class="input-wrapper modern-item"
                :class="{ 'item-has-focus': focusedField === 'name' }"
              >
                <ion-input
                  v-model="memberName"
                  type="text"
                  placeholder="Enter member name"
                  @ionFocus="focusedField = 'name'"
                  @ionBlur="focusedField = ''"
                ></ion-input>
              </div>
            </div>

            <!-- Phone Number Input Field with E.164 Validation -->
            <div class="form-field">
              <ion-label class="field-label">Phone Number</ion-label>
              <div class="phone-input-container">
                <div class="country-code-badge">+251</div>
                <div
                  class="input-wrapper modern-item phone-input"
                  :class="{
                    'item-has-focus': focusedField === 'phone',
                    'has-error': phoneError,
                    'is-valid': isPhoneValid,
                  }"
                >
                  <ion-input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="911110000"
                    @ionFocus="focusedField = 'phone'"
                    @ionBlur="focusedField = ''"
                    @ionInput="validatePhone"
                  ></ion-input>
                  <ion-icon
                    v-if="isPhoneValid"
                    :icon="checkmarkCircleOutline"
                    class="validation-icon valid"
                  ></ion-icon>
                </div>
              </div>

              <!-- Formatted Phone Preview -->
              <div
                v-if="isPhoneValid && formattedPhonePreview"
                class="phone-preview"
              >
                <ion-text>{{ formattedPhonePreview }}</ion-text>
              </div>

              <!-- Error Message -->
              <ion-text
                v-if="phoneError"
                color="danger"
                class="error-message"
                >{{ phoneError }}</ion-text
              >
            </div>

            <!-- Modal Buttons Row -->
            <div class="modal-buttons-row">
              <ion-button
                fill="outline"
                color="medium"
                @click="closeModal"
                class="cancel-button"
              >
                Cancel
              </ion-button>
              <ion-button
                type="submit"
                :disabled="
                  isAdding || !phoneNumber || !memberName || !isPhoneValid
                "
                class="add-button"
              >
                {{ isAdding ? "Adding..." : "Add" }}
              </ion-button>
            </div>
          </form>
        </div>
      </ion-modal>

      <!-- Toast for feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="3000"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonText,
  IonButton,
  IonModal,
  IonInput,
  IonSpinner,
  IonToast,
  IonDatetime,
  IonIcon,
  IonBadge,
  IonButtons,
  IonHeader, // Keep IonHeader for modal
  IonToolbar, // Keep IonToolbar for modal
  IonTitle, // Keep IonTitle for modal
  menuController, // Import menuController
  useIonRouter,
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";
import { Iqub, Member } from "@/types";
import { useRouter } from "vue-router";

// Import Phone Validation Utilities
import {
  formatPhoneToE164,
  validatePhoneFormat,
  formatPhoneForDisplay,
} from "@/utils/phoneValidation";

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  linkOutline,
  closeOutline,
  cashOutline,
  walletOutline,
  trendingUpOutline,
  peopleOutline,
  checkmarkCircleOutline,
  calendarOutline,
  personAddOutline,
  addCircleOutline,
  documentTextOutline,
  trophyOutline,
  arrowBackOutline,
  personOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";

// Import CollectorTabBar and ProgressRing components
import CollectorTabBar from "@/components/CollectorTabBar.vue";
import ProgressRing from "@/components/ProgressRing.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const ionRouter = useIonRouter(); // 2. Get the IonRouter instance

// --- State & Getters from Vuex ---
// Handle both string (MongoDB ObjectId) and numeric IDs
const iqubId = computed(() => {
  const id = route.params.id;
  // Try to parse as number, but keep as string if it's not a valid number
  const numId = Number(id);
  return isNaN(numId) ? id : numId;
});

// Use selectedIqub directly - it's populated by fetchIqubDetails with full data including members_list
const currentIqub = computed<Iqub | null>(() => store.state.iqubs.selectedIqub);

// Use status and error from the store module state
const status = computed(() => store.getters["iqubs/status"]); // Or state.iqubs.status
const error = computed(() => store.getters["iqubs/error"]); // Or state.iqubs.error

// --- Local Component State ---
const activeTab = ref("overview"); // Tab state
const isModalOpen = ref(false);
const phoneNumber = ref("");
const memberName = ref("");
const phoneError = ref("");
const isPhoneValid = ref(false);
const formattedPhonePreview = ref("");
const focusedField = ref("");
const isAdding = ref(false);
const isInitiating = ref(false);
const isSettingDate = ref(false);
const nextLotteryDate = ref<string | undefined>(undefined);

// Pagination state
const currentPage = ref(1);
const membersPerPage = 10;

// Toast State
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref<"success" | "danger" | "warning">("success");

// --- Computed Properties ---
const completionPercentage = computed(() => {
  if (!currentIqub.value) return 0;
  const collected =
    typeof currentIqub.value.total_collected === "string"
      ? parseFloat(currentIqub.value.total_collected)
      : currentIqub.value.total_collected || 0;
  const total =
    typeof currentIqub.value.credit_amount === "string"
      ? parseFloat(currentIqub.value.credit_amount)
      : currentIqub.value.credit_amount || 1;
  return Math.round((collected / total) * 100);
});

const remainingAmount = computed(() => {
  if (!currentIqub.value) return 0;
  const total =
    typeof currentIqub.value.credit_amount === "string"
      ? parseFloat(currentIqub.value.credit_amount)
      : currentIqub.value.credit_amount || 0;
  const collected =
    typeof currentIqub.value.total_collected === "string"
      ? parseFloat(currentIqub.value.total_collected)
      : currentIqub.value.total_collected || 0;
  return total - collected;
});

// Check if we can add more members
const canAddMembers = computed(() => {
  if (!currentIqub.value) return false;
  const currentMembers = currentIqub.value.current_members || 0;
  const maxMembers = currentIqub.value.members_count || 0;
  return currentMembers < maxMembers;
});

// Pagination computed properties
const paginatedMembers = computed(() => {
  if (!currentIqub.value?.members_list) return [];
  const start = (currentPage.value - 1) * membersPerPage;
  const end = start + membersPerPage;
  return currentIqub.value.members_list.slice(start, end);
});

const totalPages = computed(() => {
  if (!currentIqub.value?.members_list) return 1;
  return Math.ceil(currentIqub.value.members_list.length / membersPerPage);
});

// --- Fetch Data on Mount and route param change ---
onMounted(() => {
  console.log("IqubDetailPage mounted with ID:", iqubId.value);
  console.log("Current Iqub is --- ", currentIqub.value);

  // Guard against invalid IDs
  if (!iqubId.value || iqubId.value === "undefined") {
    console.error("Invalid Iqub ID on mount:", iqubId.value);
    return;
  }

  // Always fetch full Iqub details (with members_list) when the page loads
  // This ensures we have complete data including members, even if coming from the list
  console.log("Fetching full Iqub details with members for ID:", iqubId.value);
  store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
});

// Watch the route param for changes
watch(
  () => route.params.id,
  (newId) => {
    // Guard against undefined or empty ID
    if (!newId || newId === "undefined") {
      console.log("Route param ID is invalid:", newId);
      return;
    }

    // Handle both string and number IDs
    const numId = Number(newId);
    const newIqubId = isNaN(numId) ? newId : numId;

    // Additional check to ensure we have a valid ID
    if (!newIqubId || newIqubId === "undefined") {
      console.log("Computed ID is invalid:", newIqubId);
      return;
    }

    // If the ID is valid and different from the currently loaded one, fetch
    if (currentIqub.value?.id !== newIqubId) {
      console.log("Route changed, fetching Iqub details for ID:", newIqubId);
      // Reset local state related to the previous Iqub if necessary (e.g., modal open state)
      closeModal(); // Close modal if open
      // Clear date picker value if needed before new data loads
      nextLotteryDate.value = undefined;

      store.dispatch("iqubs/fetchIqubDetails", newIqubId);
    }
  }
);

// Watch currentIqub to initialize nextLotteryDate and handle successful fetch state
watch(
  currentIqub,
  (newValue) => {
    if (newValue && newValue.next_lottery_date) {
      // Ensure date is in 'YYYY-MM-DD' format for ion-datetime value
      // Safely split if next_lottery_date is a string
      nextLotteryDate.value =
        typeof newValue.next_lottery_date === "string"
          ? newValue.next_lottery_date.split("T")[0]
          : undefined;
    } else {
      nextLotteryDate.value = undefined; // Clear if no date set or currentIqub is null
    }
    // If the status becomes 'success' and currentIqub is loaded, you might want to hide specific loading indicators
    // (though the template handles this via v-if)
  },
  { immediate: true } // Run immediately if currentIqub is already loaded on mount
);

// Optional: Method to retry fetching if an error occurs
const retryFetch = () => {
  if (iqubId.value) {
    store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
  }
};

// --- Event Handlers for Top Bar ---
const goBack = () => {
  ionRouter.back();
};

const goToNotifications = () => {
  ionRouter.push("/notifications");
};

// --- Phone Validation Logic ---
const validatePhone = () => {
  if (!phoneNumber.value) {
    phoneError.value = "";
    isPhoneValid.value = false;
    formattedPhonePreview.value = "";
    return;
  }

  const isValid = validatePhoneFormat(phoneNumber.value);
  isPhoneValid.value = isValid;

  if (isValid) {
    phoneError.value = "";
    const e164Phone = formatPhoneToE164(phoneNumber.value);
    formattedPhonePreview.value = formatPhoneForDisplay(e164Phone);
  } else {
    phoneError.value = "Please enter a valid Ethiopian phone number";
    formattedPhonePreview.value = "";
  }
};

// --- Modal Logic ---
const openModal = () => {
  isModalOpen.value = true;
  phoneNumber.value = "";
  memberName.value = "";
  phoneError.value = "";
  isPhoneValid.value = false;
  formattedPhonePreview.value = "";
};

const closeModal = () => {
  isModalOpen.value = false;
  phoneNumber.value = "";
  memberName.value = "";
  phoneError.value = "";
  isPhoneValid.value = false;
  formattedPhonePreview.value = "";
};

const addMember = async () => {
  phoneError.value = "";

  // Validate inputs
  if (!phoneNumber.value || !memberName.value) {
    if (!phoneNumber.value && !memberName.value) {
      phoneError.value = "Phone number and Name are required";
    } else if (!phoneNumber.value) {
      phoneError.value = "Phone number is required";
    } else if (!memberName.value) {
      phoneError.value = "Member Name is required";
    }
    return;
  }

  // Validate phone format
  if (!isPhoneValid.value) {
    phoneError.value = "Please enter a valid Ethiopian phone number";
    return;
  }

  // Check if Iqub is full
  if (!canAddMembers.value) {
    phoneError.value = "This Iqub is full. Cannot add more members.";
    showToastMessage("This Iqub is full. Cannot add more members.", "warning");
    return;
  }

  isAdding.value = true;
  try {
    // Format phone to E.164 before sending to API
    const e164Phone = formatPhoneToE164(phoneNumber.value);

    console.log("Adding member to Iqub:", {
      iqubId: iqubId.value,
      phone: e164Phone,
      name: memberName.value,
    });

    await store.dispatch("iqubs/addMemberToIqub", {
      iqubId: iqubId.value,
      phone: e164Phone,
      name: memberName.value,
    });

    // Check if there was an error in the store after the action
    const storeError = store.state.iqubs.error;
    if (storeError && store.state.iqubs.status === "error") {
      phoneError.value = storeError;
      showToastMessage(storeError, "danger");
      // Reset error in store
      store.commit("iqubs/setError", null);
      store.commit("iqubs/setStatus", "success");
    } else {
      // Success! Close modal and show success message
      closeModal();
      showToastMessage(
        `${memberName.value} has been added successfully!`,
        "success"
      );

      // Refetch Iqub details to get updated member list
      console.log("Refetching Iqub details after adding member");
      await store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
    }
  } catch (error: any) {
    console.error("Error adding member:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to add member.";
    phoneError.value = errorMessage;
    showToastMessage(errorMessage, "danger");
  } finally {
    isAdding.value = false;
  }
};

// --- Lottery Actions ---
const startLottery = async () => {
  isInitiating.value = true;
  showToast.value = false; // Hide previous toasts

  try {
    // The initiateLottery action in the store should handle the API call
    // and dispatch fetchIqubDetails on success
    await store.dispatch("iqubs/initiateLottery", iqubId.value);

    // Check store status/error after action
    const mainErrorAfterAction = computed(() => store.state.iqubs.error).value;
    if (mainErrorAfterAction && store.state.iqubs.status === "error") {
      showToastMessage(mainErrorAfterAction, "danger");
      // Reset main error/status if appropriate
      // store.commit('iqubs/setError', null);
      // store.commit('iqubs/setStatus', 'success');
    } else {
      showToastMessage("Lottery initiated successfully.", "success");
      // No need to manually fetch here, action should have done it
      // await store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to initiate lottery.";
    showToastMessage(errorMessage, "danger");
  } finally {
    isInitiating.value = false;
  }
};

const setNextLotteryDate = async () => {
  if (!nextLotteryDate.value) {
    showToastMessage("Please select a date.", "danger");
    return;
  }
  isSettingDate.value = true;
  showToast.value = false; // Hide previous toasts

  try {
    // The setNextLotteryDate action in the store should handle the API call
    // and dispatch fetchIqubDetails on success
    await store.dispatch("iqubs/setNextLotteryDate", {
      iqubId: iqubId.value,
      // Ensure date is formatted correctly for the API if needed (e.g., ISO string)
      nextLotteryDate: nextLotteryDate.value + "T00:00:00Z", // Example: Convert to start of day ISO
    });

    // Check store status/error after action
    const mainErrorAfterAction = computed(() => store.state.iqubs.error).value;
    if (mainErrorAfterAction && store.state.iqubs.status === "error") {
      showToastMessage(mainErrorAfterAction, "danger");
      // Reset main error/status if appropriate
      // store.commit('iqubs/setError', null);
      // store.commit('iqubs/setStatus', 'success');
    } else {
      showToastMessage("Next lottery date set successfully.", "success");
      // No need to manually fetch here, action should have done it
      // await store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to set next lottery date.";
    showToastMessage(errorMessage, "danger");
  } finally {
    isSettingDate.value = false;
  }
};

// --- Utility for Toast ---
const showToastMessage = (
  message: string,
  color: "success" | "danger" | "warning"
) => {
  toastMessage.value = message;
  toastColor.value = color;
  showToast.value = true;
};

// --- Optional: Copy Link ---
const copyIqubLink = async () => {
  if (currentIqub.value?.id) {
    try {
      await navigator.clipboard.writeText(currentIqub.value.id.toString());
      showToastMessage("Iqub ID copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy: ", err);
      showToastMessage("Failed to copy Iqub ID.", "danger");
    }
  } else {
    showToastMessage("Iqub ID not available.", "warning");
  }
};

// --- Optional: Navigate to Member Details ---
const goToMemberDetails = (memberId: number) => {
  const iqubIdValue = iqubId.value;
  console.log(`Navigate to member ${memberId} in iqub ${iqubIdValue}`);
  ionRouter.push(`/collector/iqub/${iqubIdValue}/member/${memberId}`);
};

// --- Helper Functions ---
const formatCurrency = (amount: number | string | undefined): string => {
  const numAmount =
    typeof amount === "string" ? parseFloat(amount) : amount || 0;
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

const getSavingPatternLabel = (pattern: number | string): string => {
  const numPattern = typeof pattern === "string" ? parseInt(pattern) : pattern;
  const patterns: { [key: number]: string } = {
    1: "Weekly",
    2: "Bi-weekly",
    3: "Monthly",
  };
  return patterns[numPattern] || "Unknown";
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
/* ... (your existing styles) ... */

/* Ensure these styles are included or sourced from your global theme */
:root {
  --ion-color-wujo-primary: #014023; /* Wujo Dark Green */
  --ion-color-wujo-light-grey: #f2f2f2; /* Wujo White Smoke */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block;
}

/* --- Hero Section Styles (matches MyIqubsPage) --- */
.hero-section {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 20px 24px 10px;
  position: relative;
  animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-icon,
.hero-header .notification-icon {
  font-size: 28px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-icon:hover,
.hero-header .notification-icon:hover {
  transform: scale(1.1);
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-icon {
  font-size: 48px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.hero-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  color: white;
}

/* --- Top Bar Styles (Reused) --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--ion-color-wujo-primary);
  color: white;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.menu-icon,
.notification-icon {
  font-size: 24px;
  color: white;
  cursor: pointer;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
  flex-grow: 1;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notification-container {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  padding: 3px 5px;
  border-radius: 10px;
  --background: var(--ion-color-danger, #eb445a);
  color: white;
  z-index: 1;
}

/* --- Collector Tab Bar Styles (Reference) --- */
collector-tab-bar {
  display: block;
  margin-bottom: 20px;
}

/* --- Main Iqub Detail Content Area --- */
.iqub-detail-content {
  padding: 0 20px;
  padding-bottom: 40px;
}

/* Container for Iqub data (summary, lists, buttons) */
.iqub-data-container {
  /* No specific styles needed unless you want a background or border around everything */
}

/* --- Loading, Error, Empty States --- */
.loading-indicator,
.error-message,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
  width: 100%;
}
.error-message p,
.empty-state ion-text {
  color: var(--ion-color-wujo-text-grey);
  margin-top: 10px;
}
.loading-indicator ion-spinner {
  width: 30px;
  height: 30px;
  --color: var(--ion-color-wujo-primary);
}

/* --- Hero Card with Premium Dark Green Background --- */
.hero-card {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  animation: fadeInDown 0.5s ease-out;
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

.hero-card-header {
  margin-bottom: 20px;
}

.hero-card .iqub-name {
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: block;
}

.hero-card-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
  display: block;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: white;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.hero-card-progress {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* --- Tabbed Interface --- */
.tab-bar {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 4px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  color: var(--ion-color-medium);
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-button.active {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  color: var(--ion-color-dark-green, #014023);
  box-shadow: 0 2px 8px rgba(95, 217, 172, 0.3);
}

.tab-button:hover {
  background: rgba(95, 217, 172, 0.1);
}

/* --- Tab Content --- */
.tab-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tab-panel {
  padding: 16px 0;
}

/* --- Overview Tab Styles --- */
.overview-tab .statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-card .stat-icon {
  font-size: 32px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 12px;
}

.stat-card-label {
  font-size: 13px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 8px;
  display: block;
}

.stat-card-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  display: block;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: rgba(45, 211, 111, 0.15);
  color: var(--ion-color-success, #2dd36f);
}

.status-badge.pending {
  background: rgba(255, 196, 9, 0.15);
  color: var(--ion-color-warning, #ffc409);
}

.status-badge.completed {
  background: rgba(95, 217, 172, 0.15);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

/* --- Recent Activity Timeline --- */
.recent-activity {
  margin-top: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 16px;
  display: block;
}

.activity-timeline {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-item:first-child {
  padding-top: 0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon ion-icon {
  font-size: 20px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.activity-icon.success {
  background: rgba(45, 211, 111, 0.15);
}

.activity-icon.success ion-icon {
  color: var(--ion-color-success, #2dd36f);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
  display: block;
}

.activity-description {
  font-size: 13px;
  color: var(--ion-color-wujo-text-grey);
  display: block;
}

.activity-time {
  font-size: 12px;
  color: var(--ion-color-medium);
  display: block;
}

/* --- Summary Section (Legacy) --- */
.summary-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 100px;
}
.summary-label {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 5px;
}
.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
}

/* --- Copy Link Button --- */
.copy-link-button {
  --background: white;
  --color: var(--ion-color-wujo-text-grey);
  --border-color: var(--ion-color-wujo-grey);
  --border-radius: 8px;
  --border-width: 1px;
  font-size: 13px;
  font-weight: normal;
  text-transform: capitalize;
  height: 36px;
  margin: 0 auto 20px auto;
  display: block;
}
.copy-link-button ion-icon {
  font-size: 18px;
  margin-right: 5px;
}

/* --- List Heading --- */
.list-heading {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 15px;
  text-align: center;
}

/* --- Members List Container (Reused/Adapted) --- */
.members-list-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 10px;
}
/* --- List Header (Reused/Adapted) --- */
.list-header {
  display: flex;
  background: var(--ion-color-wujo-primary);
  color: white;
  padding: 12px 15px;
  font-size: 13px;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.header-item {
  flex: 1;
  min-width: 0;
  word-break: break-word;
}
.list-header .header-item:nth-child(1) {
  flex: 2;
}
.list-header .header-item:nth-child(2) {
  flex: 2;
}
.list-header .header-item:nth-child(3) {
  flex: 1.5;
}

/* --- List Items (Reused/Adapted) --- */
.list-item {
  display: flex;
  padding: 12px 15px;
  background: white;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
.list-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.list-item:hover,
.list-item:active {
  background-color: var(--ion-color-wujo-light-grey);
}

.list-item-cell {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  font-size: 14px;
  color: var(--ion-color-wujo-dark-grey);
  display: flex;
  align-items: center;
}
.list-item .list-item-cell:nth-child(1) {
  flex: 2;
}
.list-item .list-item-cell:nth-child(2) {
  flex: 2;
}
.list-item .list-item-cell:nth-child(3) {
  flex: 1.5;
}

/* Right-align text in specific columns */
.right-align {
  text-align: right;
  justify-content: flex-end;
}

/* --- Members Tab Styles (Modern Design) --- */
.members-modern-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 100px; /* Space for sticky button */
}

.member-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-avatar ion-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.member-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
  display: block;
}

.member-phone {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
  display: block;
}

.member-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.badge-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  display: block;
}

.badge-label {
  font-size: 11px;
  color: var(--ion-color-wujo-text-grey);
  display: block;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.pagination-button {
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.pagination-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
}

/* Empty State for Members */
.empty-state-members {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 100px; /* Space for sticky button */
}

.empty-state-members .empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state-members .empty-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 8px;
  display: block;
}

.empty-state-members .empty-description {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
  display: block;
}

/* Sticky FAB (Add Member Button) */
.sticky-fab {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fab-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 16px;
  --box-shadow: 0 4px 12px rgba(95, 217, 172, 0.3);
  height: 56px;
  font-weight: bold;
  font-size: 16px;
}

/* Iqub Full Message (in sticky position) */
.sticky-fab .iqub-full-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(45, 211, 111, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(45, 211, 111, 0.3);
  margin: 0;
}

.sticky-fab .full-icon {
  font-size: 24px;
  color: white;
}

.sticky-fab .full-text {
  font-size: 15px;
  font-weight: 600;
  color: white;
}

/* --- Empty State for Tabs --- */
.empty-state-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 8px;
  display: block;
}

.empty-description {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
  display: block;
}

/* --- Lottery Tab Styles --- */
.lottery-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lottery-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.lottery-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 16px;
}

.date-picker-container {
  margin-bottom: 16px;
}

.datetime-input {
  width: 100%;
  border: 2px solid var(--ion-color-wujo-grey);
  border-radius: 12px;
  padding: 12px;
  background: var(--ion-color-white-smoke, #f2f2f2);
  transition: all 0.3s;
}

.datetime-input:focus {
  border-color: var(--ion-color-medium-aquamarine, #5fd9ac);
  background: white;
}

.lottery-info {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 8px;
}

.info-text {
  font-size: 14px;
  color: var(--ion-color-wujo-dark-grey);
}

.lottery-history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
}

.history-label {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
}

.history-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

/* --- Action Buttons Section --- */
.action-buttons-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Common style for all action buttons */
.action-button {
  font-weight: bold;
  text-transform: capitalize;
  height: 50px;
  --border-radius: 12px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  transition: all 0.3s;
}

.action-button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Primary action */
.action-button.primary-action {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-activated: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
}

/* Secondary actions */
.action-button.secondary-action {
  --background: white;
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  --border-color: var(--ion-color-medium-aquamarine, #5fd9ac);
  --border-width: 2px;
}

.action-button.secondary-action:hover {
  --background: rgba(95, 217, 172, 0.1);
}

/* Styling for the Date Picker row */
.date-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}
.datetime-input {
  flex-grow: 1;
  border: 1px solid var(--ion-color-wujo-grey);
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
  --placeholder-color: #999;
  --color: #333;
}
.date-picker-row .action-button {
  flex-shrink: 0;
  height: 45px;
  font-size: 14px;
  --padding-start: 15px;
  --padding-end: 15px;
}

/* --- Add Member Modal Styles --- */
.add-member-modal {
  --width: 100%;
  --height: auto;
  --border-radius: 24px 24px 0 0;
  --box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
  align-items: flex-end;
}

.add-member-modal::part(backdrop) {
  background: rgba(0, 0, 0, 0.4);
}

.add-member-modal::part(content) {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
  background: white;
}

.modal-wrapper {
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUpModal 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-handle {
  width: 40px;
  height: 4px;
  background: var(--ion-color-medium, #92949c);
  border-radius: 2px;
  margin: 0 auto 20px auto;
}

@keyframes slideUpModal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  display: block;
  text-align: center;
  margin-bottom: 24px;
}

.modal-title h2 {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin: 0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-form .form-field {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 8px;
}

.input-wrapper {
  background: var(--ion-color-white-smoke, #f2f2f2);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.input-wrapper.item-has-focus {
  background: white;
  border-color: var(--ion-color-medium-aquamarine, #5fd9ac);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.15);
  transform: translateY(-2px);
}

.input-wrapper ion-input {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  font-size: 16px;
}

/* Phone Input Specific Styles */
.phone-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.country-code-badge {
  background: var(--ion-color-dark-green, #014023);
  color: white;
  padding: 14px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  min-width: 70px;
  text-align: center;
}

.phone-input {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.phone-input.has-error {
  border-color: var(--ion-color-danger, #eb445a);
  background: rgba(235, 68, 90, 0.05);
}

.phone-input.is-valid {
  border-color: var(--ion-color-success, #2dd36f);
}

.validation-icon {
  position: absolute;
  right: 16px;
  font-size: 24px;
  pointer-events: none;
}

.validation-icon.valid {
  color: var(--ion-color-success, #2dd36f);
}

.phone-preview {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 8px;
  text-align: center;
}

.phone-preview ion-text {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 14px;
  font-weight: 600;
}

.error-message {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--ion-color-danger, #eb445a);
}

.modal-buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}

.modal-buttons-row ion-button {
  flex: 1;
  --border-radius: 12px;
  font-weight: bold;
  height: 50px;
  text-transform: capitalize;
}

.cancel-button {
  --background: white;
  --color: var(--ion-color-wujo-text-grey);
  --border-color: var(--ion-color-wujo-grey);
  --border-width: 1px;
}

.add-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-activated: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
}
</style>
