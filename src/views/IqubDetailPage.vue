<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Menu, Title, Notification) - Reused component/structure -->
      <!-- You might want to make this a separate component for reusability -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <!-- Assuming you have a menu -->
        <ion-text class="page-title">HI Collector</ion-text>
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <!-- Use a placeholder notification count or fetch from store -->
          <ion-badge color="danger" class="notification-badge">3</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar (Integrated Here) - Reused component -->
      <!-- Pass prop to indicate the active tab -->
      <!-- Design Page 11 shows My Iqub tab active -->
      <collector-tab-bar active-tab="my-iqubs"></collector-tab-bar>

      <!-- Main Content Area for Iqub Details -->
      <div class="iqub-detail-content">
        <!-- Loading Indicator -->
        <!-- Show loading if status is loading OR if we just mounted and currentIqub is null -->
        <div
          v-if="status === 'loading' || (status === 'idle' && !currentIqub)"
          class="loading-indicator"
        >
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading Iqub details...</ion-text>
        </div>

        <!-- Error Message -->
        <!-- Show error if status is error and there's an error message -->
        <div v-else-if="status === 'error' && error" class="error-message">
          <p>Error loading Iqub details: {{ error }}</p>
          <!-- Optional: Retry button -->
          <ion-button @click="retryFetch">Retry</ion-button>
        </div>

        <!-- Iqub Details Content (Visible when status is success and currentIqub is available) -->
        <div v-else-if="currentIqub" class="iqub-data-container">
          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-item">
              <ion-text class="summary-label">Total Iqub amount</ion-text>
              <!-- Assuming currentIqub.total_amount exists in the data fetched by fetchIqubDetails -->
              <ion-text class="summary-value">{{
                currentIqub.credit_amount || "N/A"
              }}</ion-text>
            </div>
            <div class="summary-item">
              <ion-text class="summary-label">So far Collected</ion-text>
              <!-- Assuming currentIqub.collected_amount exists -->
              <ion-text class="summary-value">{{
                currentIqub.total_collected || "N/A"
              }}</ion-text>
            </div>
          </div>

          <!-- Copy Iqub Link Button -->
          <ion-button
            fill="outline"
            size="small"
            class="copy-link-button"
            @click="copyIqubLink"
          >
            <ion-icon :icon="linkOutline"></ion-icon>
            Copy Iqub Link
          </ion-button>

          <!-- List Of Iqubers Heading -->
          <ion-text class="list-heading"><h2>List Of Iqubers</h2></ion-text>

          <!-- Members List -->
          <div
            v-if="
              currentIqub.members_list && currentIqub.members_list.length > 0
            "
            class="members-list-container"
          >
            <!-- List Header -->
            <div class="list-header">
              <div class="header-item">Members</div>
              <div class="header-item">Phone-Number</div>
              <!-- Assuming 'Saving Rounds' data is available per member on the member object -->
              <div class="header-item right-align">Saving Rounds</div>
            </div>

            <!-- List Items -->
            <!-- Assuming member object has name and phone. Need saving_rounds or rounds_completed -->
            <div
              v-for="member in currentIqub.members_list"
              :key="member.id"
              class="list-item"
              @click="() => goToMemberDetails(member.id)"
            >
              <div class="list-item-cell">{{ member.name || "N/A" }}</div>
              <div class="list-item-cell">{{ member.phone || "N/A" }}</div>
              <!-- Formatting as completed/total (assuming total is iqub members_count) -->
              <!-- Check if member has saving_rounds or rounds_completed -->
              <div class="list-item-cell right-align">
                {{
                  member.saving_rounds !== undefined
                    ? member.saving_rounds
                    : member.rounds_completed !== undefined
                    ? `${member.rounds_completed}/${currentIqub.saving_rounds}`
                    : "N/A"
                }}
              </div>
            </div>
            <ion-button
              expand="block"
              fill="outline"
              class="action-button secondary-action"
              @click="openModal"
              :disabled="status === 'loading'"
              >Add Member</ion-button
            >
          </div>
          <!-- Empty State for Members -->
          <div v-else class="empty-state">
            <ion-text>No members have joined this Iqub yet.</ion-text>
          </div>

          <!-- Action Buttons Section (Start Lottery, Set Date, Add Member) -->
          <div class="action-buttons-section">
            <ion-button
              expand="block"
              class="action-button primary-action"
              @click="startLottery"
              :disabled="isInitiating || status === 'loading'"
              >{{
                isInitiating ? "Initiating..." : "Start Lottery"
              }}</ion-button
            >

            <div class="date-picker-row">
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
              <ion-button
                @click="setNextLotteryDate"
                :disabled="
                  isSettingDate || status === 'loading' || !nextLotteryDate
                "
                class="action-button secondary-action"
              >
                {{ isSettingDate ? "Setting..." : "Set Next Lottery Date" }}
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Member Modal - Applying custom form styles -->
      <ion-modal :is-open="isModalOpen" @willDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Add Member</ion-title>
            <ion-buttons>
              <ion-button @click="closeModal"
                ><ion-icon :icon="closeOutline"></ion-icon
              ></ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form @submit.prevent="addMember" class="modal-form">
            <!-- Name Input Field (New) -->
            <div class="form-field">
              <ion-label class="field-label">Name</ion-label>
              <div class="input-wrapper">
                <ion-input
                  v-model="memberName"
                  type="text"
                  placeholder="Enter member name"
                ></ion-input>
              </div>
              <!-- Add error message display for name if needed -->
              <!-- <ion-text v-if="memberNameError" color="danger" class="error-message">{{ memberNameError }}</ion-text> -->
            </div>

            <!-- Phone Number Input Field (Existing, restyled) -->
            <div class="form-field">
              <ion-label class="field-label">Phone Number</ion-label>
              <div class="input-wrapper">
                <ion-input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                ></ion-input>
              </div>
              <ion-text
                v-if="phoneError"
                color="danger"
                class="error-message"
                >{{ phoneError }}</ion-text
              >
            </div>

            <!-- Modal Buttons Row -->
            <div class="modal-buttons-row">
              <ion-button fill="outline" color="medium" @click="closeModal"
                >Cancel</ion-button
              >
              <!-- Disable if adding, or if phone number is empty. Name might also be required? -->
              <ion-button
                type="submit"
                :disabled="isAdding || !phoneNumber || !memberName"
                >{{ isAdding ? "Adding..." : "Add" }}</ion-button
              >
            </div>
          </form>
        </ion-content>
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
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";
import { Iqub, Member } from "@/types";
import { useRouter } from "vue-router";

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  linkOutline,
  closeOutline,
} from "ionicons/icons";

// Import CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

// --- State & Getters from Vuex ---
const iqubId = computed(() => Number(route.params.id));

// Use the selectedIqub getter/state populated by fetchIqubDetails
const currentIqub = computed<Iqub | null>(() =>
  store.getters["iqubs/getIqubById"](iqubId.value)
); // Assuming getter exists or use state.iqubs.selectedIqub

// Use status and error from the store module state
const status = computed(() => store.getters["iqubs/status"]); // Or state.iqubs.status
const error = computed(() => store.getters["iqubs/error"]); // Or state.iqubs.error

// --- Local Component State ---
const isModalOpen = ref(false);
const phoneNumber = ref("");
const memberName = ref(""); // <--- ADD THIS NEW REF
const phoneError = ref("");
const isAdding = ref(false);
const isInitiating = ref(false);
const isSettingDate = ref(false);
// Initialize nextLotteryDate based on fetched data or undefined
const nextLotteryDate = ref<string | undefined>(undefined);

// Toast State
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref<"success" | "danger" | "warning">("success");

// --- Fetch Data on Mount and route param change ---
onMounted(() => {
  console.log("Current Iqub is --- ", currentIqub.value);
  // Fetch iqub details when the component mounts IF:
  // 1. We have an iqubId
  // 2. The status is idle or error (meaning no successful fetch or a previous fetch failed)
  // 3. OR if we have loaded data, but it's for a DIFFERENT iqub (e.g., navigating between detail pages)
  // if (
  //   iqubId.value &&
  //   (status.value === "idle" ||
  //     status.value === "error" ||
  //     (currentIqub.value && currentIqub.value.id !== iqubId.value))
  // ) {
  //   store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
  // }
});

// Watch the route param for changes
watch(
  () => route.params.id,
  (newId) => {
    // Removed oldId as it's not strictly needed for this logic
    const newIqubId = Number(newId);

    // If the ID is valid and different from the currently loaded one, fetch
    if (newIqubId && currentIqub.value?.id !== newIqubId) {
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

// --- Event Handlers for Top Bar (Reused) ---
const openMenu = () => {
  console.log("Open menu clicked"); /* Implement menu logic */
};
const goToNotifications = () => {
  console.log("Notifications icon clicked"); /* Navigate */
};

// --- Modal Logic ---
const openModal = () => {
  isModalOpen.value = true;
  phoneNumber.value = ""; // Clear previous phone
  memberName.value = ""; // <--- CLEAR NEW NAME FIELD ON OPEN
  phoneError.value = ""; // Clear previous errors
  // Clear other errors like memberNameError if you add it
  // memberNameError.value = "";
  // Clear store errors if they exist and are relevant
  // store.commit('iqubs/setAddMemberError', null);
};

const closeModal = () => {
  isModalOpen.value = false;
  phoneNumber.value = "";
  memberName.value = ""; // <--- CLEAR NAME FIELD ON CLOSE
  phoneError.value = "";
  // Clear other errors
  // memberNameError.value = "";
  // Clear store errors
  // store.commit('iqubs/setAddMemberError', null);
};

const addMember = async () => {
  phoneError.value = ""; // Clear local error
  // memberNameError.value = ""; // Clear local error for name
  // Clear store error if you have one
  // store.commit('iqubs/setAddMemberError', null);

  // Basic validation for phone and name
  if (!phoneNumber.value || !memberName.value) {
    // <--- ADD CHECK FOR memberName
    if (!phoneNumber.value && !memberName.value) {
      // More specific error message
      phoneError.value = "Phone number and Name are required"; // Or show separately
    } else if (!phoneNumber.value) {
      phoneError.value = "Phone number is required";
    } else if (!memberName.value) {
      // memberNameError.value = "Member Name is required"; // If using separate error
      phoneError.value = "Member Name is required"; // Or combine into phoneError for simplicity
    }
    return;
  }

  isAdding.value = true;
  try {
    // Dispatch the action, including the memberName in the payload
    // ASSUMING your addMemberToIqub action accepts 'name'
    // await store.dispatch("iqubs/addMemberToIqub", {
    //   iqubId: iqubId.value,
    //   phone: phoneNumber.value,
    //   name: memberName.value, // <--- INCLUDE memberName IN PAYLOAD
    // });

    closeModal();
    showToastMessage("Member added successfully!", "success");

    // ... (keep existing error/success check based on store state and toast logic) ...
    // const addErrorFromStore = computed(
    //   () => store.state.iqubs.addMemberError
    // ).value; // Assuming this exists
    // if (addErrorFromStore) {
    //   phoneError.value = addErrorFromStore; // Or route to memberNameError if separate
    //   showToastMessage(addErrorFromStore, "danger");
    //   // Reset main error/status if this error is only for the modal
    //   // store.commit('iqubs/setError', null);
    //   // store.commit('iqubs/setStatus', 'success');
    // } else {
    //   closeModal();
    //   showToastMessage("Member added successfully!", "success");
    //   // No need to manually fetch here, action should have done it
    //   // await store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
    // }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to add member.";
    phoneError.value = errorMessage; // Or route to memberNameError if separate
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
  if (currentIqub.value?.iqub_id) {
    try {
      await navigator.clipboard.writeText(currentIqub.value.iqub_id);
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
const goToMemberDetails = (memberId: string | number) => {
  console.log("Go to Member Details collector/iqub-book/1:", memberId);
  // router.push(`/collector/members/${memberId}`); // Example route
  router.push(`/collector/iqub-book`);
};
</script>

<style scoped>
/* ... (your existing styles) ... */

/* Ensure these styles are included or sourced from your global theme */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
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

/* --- Summary Section --- */
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
}
/* Primary action */
.action-button.primary-action {
  --background: var(--ion-color-wujo-primary);
  --background-activated: var(--ion-color-wujo-primary);
  color: white;
}
/* Secondary actions */
.action-button.secondary-action {
  --background: white;
  --color: var(--ion-color-wujo-primary);
  --border-color: var(--ion-color-wujo-primary);
  --border-width: 1px;
}
.action-button.secondary-action ion-activated {
  --background: rgba(0, 106, 82, 0.1);
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

/* --- Modal Styles (Add Member) --- */

/*Style the ion-modal itself for centering if default isn't sufficient */
/* Ionic modals usually center by default, but you can add styles here */
/* Example: */
ion-modal::part(content) {
  --max-width: 400px; /*Optional: Limit the modal's max width*/
  --max-height: 80vh; /*Optional: Limit max height */
  --width: 90%;
  --height: 300px;
  --presenting-element-height: 100%;
  padding: 5px;
}

ion-modal ion-header {
  /* Reused: box-shadow: none; */
}

ion-modal ion-toolbar {
  /* Reused: --background: var(--ion-color-wujo-light-grey); color: var(--ion-color-wujo-dark-grey); */
  /* Ensure alignment properties */
  display: flex; /* Make toolbar a flex container */
  align-items: center; /* Vertically center title and buttons */
  justify-content: space-between; /* Distribute space between title and buttons */
  padding-inline: 16px; /* Standard Ionic padding */
}

ion-modal ion-title {
  /* Reused: text-align: center; padding-inline: 0; */
  flex-grow: 1; /* Allow title to take space */
  text-align: center; /* Center the text */
  padding: 0 10px; /* Add horizontal padding to prevent overlap with buttons */
}

/* Ensure ion-buttons at the start/end are positioned correctly */
ion-modal ion-buttons {
  /* Ensure flex properties if needed */
  display: flex;
  align-items: center;
}
ion-modal ion-buttons[slot="start"] {
  order: 1; /* Ensure start button is first */
}
ion-modal ion-buttons[slot="end"] {
  order: 3; /* Ensure end button is last */
  margin-left: auto; /* Push to the right */
}
ion-modal ion-buttons[slot="end"] ion-button {
  /* Style close button */
  --color: var(--ion-color-wujo-dark-grey); /* Dark grey icon color */
}

ion-modal ion-content {
  /* Reused: --background: var(--ion-color-wujo-light-grey); */
}

.modal-form {
  /* Reused: Padding is applied by ion-content ion-padding */
}

/* Reusing form field styles from login/signup */
.modal-form .form-field {
  margin-bottom: 10px;
  margin-top: 10px;
}
/* ... (Reused styles for .field-label, .input-wrapper, ion-input, .error-message within modal) ... */

.modal-buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 15px; /* Add gap between buttons */
  margin-top: 30px;
}

.modal-buttons-row ion-button {
  flex: 1; /* Equal width */
  --border-radius: 12px;
  font-weight: bold;
  height: 50px;
  text-transform: capitalize; /* Capitalize text */
}

/* Style for the Cancel button (Outline, Grey) */
.modal-buttons-row ion-button[color="medium"] {
  --background: white;
  --color: var(--ion-color-wujo-text-grey);
  --border-color: var(--ion-color-wujo-grey);
  --border-width: 1px;
}

/* Style for the Add button (Primary Green) */
/* Target the default button if no color is explicitly set, or use a specific class */
/* Assuming the default color is the primary one unless 'color' prop is used */
.modal-buttons-row ion-button:not([color]) {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(--ion-color-wujo-primary);
  color: white;
}
/* If you set a specific color="primary" on the Add button: */
/* .modal-buttons-row ion-button[color="primary"] { */
/*      --background: var(--ion-color-wujo-primary); */
/*      --background-activated: var(--ion-color-wujo-primary); */
/*      color: white; */
/* } */
</style>
