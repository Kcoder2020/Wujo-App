<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Premium Hero Section -->
      <div class="profile-hero">
        <div class="hero-header">
          <ion-icon
            :icon="menuOutline"
            class="menu-icon"
            @click="openMenu"
          ></ion-icon>
          <div class="notification-container">
            <ion-icon
              :icon="notificationsOutline"
              class="notification-icon"
              @click="goToNotifications"
            ></ion-icon>
            <ion-badge
              v-if="notificationCount > 0"
              color="danger"
              class="notification-badge"
              >{{ notificationCount }}</ion-badge
            >
          </div>
        </div>

        <div class="hero-content">
          <!-- Profile Avatar -->
          <div class="profile-avatar">
            <img
              :src="profileData.avatar_url || defaultAvatar"
              alt="Profile Picture"
              class="avatar-image"
            />
          </div>

          <!-- Member Name -->
          <h1 class="member-name">{{ profileData.name || "Member" }}</h1>

          <!-- Phone Number -->
          <p class="member-phone">{{ profileData.phone || "N/A" }}</p>

          <!-- Join Date -->
          <div class="join-date">
            <ion-icon :icon="calendarOutline" />
            <span
              >Member since {{ formatJoinDate(profileData.join_date) }}</span
            >
          </div>

          <!-- Edit Profile Button -->
          <ion-button
            expand="block"
            class="edit-profile-button"
            @click="openEditModal"
          >
            <template #start>
              <ion-icon :icon="createOutline" />
            </template>
            Edit Profile
          </ion-button>
        </div>
      </div>

      <!-- Member Tab Bar -->
      <member-tab-bar></member-tab-bar>

      <!-- Main Content Area -->
      <div class="profile-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <ion-spinner name="dots" color="primary" />
          <p>Loading profile...</p>
        </div>

        <!-- Content Sections -->
        <div v-else class="content-sections">
          <!-- Statistics Cards Section (Task 6.2) -->
          <div class="statistics-section">
            <h2 class="section-title">Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <ion-icon :icon="peopleOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ profileData.iqub_joined_count || 0 }}
                  </p>
                  <p class="stat-label">Iqubs Joined</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon trophy">
                  <ion-icon :icon="trophyOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ profileData.lotteries_won_count || 0 }}
                  </p>
                  <p class="stat-label">Lotteries Won</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon cash">
                  <ion-icon :icon="cashOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ formatCurrency(profileData.total_saved || 0) }}
                  </p>
                  <p class="stat-label">Total Saved</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <ion-icon :icon="checkmarkCircleOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">{{ profileData.active_iqubs || 0 }}</p>
                  <p class="stat-label">Active Iqubs</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements Section (Task 6.3) -->
          <div class="achievements-section">
            <h2 class="section-title">Achievements</h2>
            <div
              v-if="achievementsStatus === 'loading'"
              class="section-loading"
            >
              <ion-spinner name="dots" />
            </div>
            <div v-else-if="achievements.length > 0" class="achievements-grid">
              <achievement-badge
                v-for="achievement in achievements"
                :key="achievement.id"
                :achievement="achievement"
              />
            </div>
            <div v-else class="empty-state">
              <ion-icon :icon="ribbonOutline" />
              <p>No achievements yet. Keep saving to unlock badges!</p>
            </div>
          </div>

          <!-- Savings History Timeline (Task 6.4) -->
          <div class="savings-history-section">
            <h2 class="section-title">Savings History</h2>
            <div
              v-if="paymentHistoryStatus === 'loading'"
              class="section-loading"
            >
              <ion-spinner name="dots" />
            </div>
            <div v-else-if="paymentHistory.length > 0" class="timeline">
              <payment-history-item
                v-for="(payment, index) in paymentHistory"
                :key="payment.id"
                :payment="payment"
                :is-last="index === paymentHistory.length - 1"
                @view-receipt="handleViewReceipt"
              />
            </div>
            <div v-else class="empty-state">
              <ion-icon :icon="walletOutline" />
              <p>No payment history yet. Start saving to see your progress!</p>
            </div>
          </div>

          <!-- Lottery Wins Display (Task 6.5) -->
          <div class="lottery-wins-section">
            <h2 class="section-title">Lottery Wins</h2>
            <div v-if="lotteryWins.length > 0">
              <div class="total-winnings">
                <ion-icon :icon="trophyOutline" />
                <div class="winnings-info">
                  <p class="winnings-label">Total Winnings</p>
                  <p class="winnings-amount">
                    {{ formatCurrency(totalWinnings) }}
                  </p>
                </div>
              </div>
              <div class="wins-list">
                <div
                  v-for="win in lotteryWins"
                  :key="win.id"
                  class="win-item"
                  :class="{ recent: isRecentWin(win.date) }"
                >
                  <div class="win-icon">
                    <ion-icon :icon="trophyOutline" />
                  </div>
                  <div class="win-details">
                    <p class="win-iqub">{{ win.iqubName }}</p>
                    <p class="win-date">{{ formatDate(win.date) }}</p>
                  </div>
                  <p class="win-amount">{{ formatCurrency(win.amount) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <ion-icon :icon="trophyOutline" />
              <p>No lottery wins yet. Good luck in upcoming lotteries!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal (Task 6.6) -->
      <ion-modal :is-open="isEditModalOpen" @did-dismiss="closeEditModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit Profile</ion-title>
            <template #end>
              <ion-buttons>
                <ion-button @click="closeEditModal">Close</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form @submit.prevent="saveProfile">
            <!-- Avatar Upload -->
            <div class="form-group avatar-upload">
              <div class="current-avatar">
                <img :src="editForm.avatar_url || defaultAvatar" alt="Avatar" />
              </div>
              <ion-button fill="outline" size="small" @click="selectAvatar">
                <template #start>
                  <ion-icon :icon="cameraOutline" />
                </template>
                Change Photo
              </ion-button>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              />
            </div>

            <!-- Name Field -->
            <div class="form-group">
              <ion-label position="stacked">Name *</ion-label>
              <ion-input
                v-model="editForm.name"
                type="text"
                placeholder="Enter your name"
                :class="{ 'ion-invalid': errors.name }"
              />
              <ion-text v-if="errors.name" color="danger" class="error-text">
                {{ errors.name }}
              </ion-text>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <ion-label position="stacked">Phone *</ion-label>
              <ion-input
                v-model="editForm.phone"
                type="tel"
                placeholder="+251912345678"
                :class="{ 'ion-invalid': errors.phone }"
              />
              <ion-text v-if="errors.phone" color="danger" class="error-text">
                {{ errors.phone }}
              </ion-text>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                v-model="editForm.email"
                type="email"
                placeholder="your.email@example.com"
                :class="{ 'ion-invalid': errors.email }"
              />
              <ion-text v-if="errors.email" color="danger" class="error-text">
                {{ errors.email }}
              </ion-text>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <ion-button
                expand="block"
                type="submit"
                :disabled="isSaving"
                class="save-button"
              >
                <ion-spinner v-if="isSaving" name="dots" />
                <span v-else>Save Changes</span>
              </ion-button>
              <ion-button
                expand="block"
                fill="outline"
                @click="closeEditModal"
                :disabled="isSaving"
              >
                Cancel
              </ion-button>
            </div>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Receipt Viewer Modal -->
      <receipt-viewer-modal
        v-if="selectedReceipt"
        :is-open="isReceiptModalOpen"
        :receipt-urls="[selectedReceipt.url]"
        :payment-info="selectedReceipt.info"
        @close="closeReceiptModal"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonBadge,
  IonButton,
  IonSpinner,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
  IonInput,
  IonText,
  menuController,
  toastController,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref, onMounted, reactive } from "vue";

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  calendarOutline,
  createOutline,
  peopleOutline,
  trophyOutline,
  cashOutline,
  checkmarkCircleOutline,
  ribbonOutline,
  walletOutline,
  cameraOutline,
} from "ionicons/icons";

// Import Components
import MemberTabBar from "@/components/MemberTabBar.vue";
import AchievementBadge from "@/components/AchievementBadge.vue";
import PaymentHistoryItem from "@/components/PaymentHistoryItem.vue";
import ReceiptViewerModal from "@/components/ReceiptViewerModal.vue";

// Interfaces
interface LotteryWin {
  id: string;
  iqubName: string;
  amount: number;
  date: string;
}

const store = useStore();
const router = useRouter();

const notificationCount = ref(3);
const defaultAvatar =
  "https://ui-avatars.com/api/?name=Member&background=5FD9AC&color=014023&size=200";

// Edit Modal State
const isEditModalOpen = ref(false);
const isSaving = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);

// Receipt Modal State
const isReceiptModalOpen = ref(false);
const selectedReceipt = ref<{
  url: string;
  info: {
    roundNumber: number;
    amount: number;
    date: string;
    memberName: string;
  };
} | null>(null);

// Edit Form
const editForm = reactive({
  name: "",
  phone: "",
  email: "",
  avatar_url: "",
});

// Form Errors
const errors = reactive({
  name: "",
  phone: "",
  email: "",
});

// Computed Properties
const profileData = computed(() => {
  const profile = store.getters["member/profile"];
  return (
    profile || {
      name: "",
      phone: "",
      email: "",
      avatar_url: "",
      join_date: new Date().toISOString(),
      iqub_joined_count: 0,
      lotteries_won_count: 0,
      total_saved: 0,
      active_iqubs: 0,
    }
  );
});

const achievements = computed(() => store.getters["member/achievements"] || []);
const paymentHistory = computed(
  () => store.getters["member/paymentHistory"] || []
);

const achievementsStatus = computed(
  () => store.getters["member/achievementsStatus"]
);
const paymentHistoryStatus = computed(
  () => store.getters["member/paymentHistoryStatus"]
);

const isLoading = computed(() => {
  return store.getters["member/status"] === "loading";
});

// Lottery Wins (derived from payment history or separate data)
const lotteryWins = computed((): LotteryWin[] => {
  // For now, we'll mock this data. In production, this would come from the API
  // You can add a separate API endpoint for lottery wins if needed
  return [];
});

const totalWinnings = computed(() => {
  return lotteryWins.value.reduce((sum, win) => sum + win.amount, 0);
});

// Lifecycle Hooks
onMounted(async () => {
  // Fetch all profile-related data (Task 6.7)
  await Promise.all([
    store.dispatch("member/fetchMemberProfile"),
    store.dispatch("member/fetchAchievements"),
    store.dispatch("member/fetchPaymentHistory"),
  ]);
});

// Event Handlers
const openMenu = () => {
  menuController.open("app-menu");
};

const goToNotifications = () => {
  router.push("/notifications");
};

// Format Helpers
const formatJoinDate = (dateString: string | undefined): string => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const isRecentWin = (dateString: string): boolean => {
  const winDate = new Date(dateString);
  const daysSince = (Date.now() - winDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince <= 7; // Recent if within last 7 days
};

// Edit Profile Modal Functions (Task 6.6)
const openEditModal = () => {
  // Populate form with current profile data
  editForm.name = profileData.value.name || "";
  editForm.phone = profileData.value.phone || "";
  editForm.email = profileData.value.email || "";
  editForm.avatar_url = profileData.value.avatar_url || "";

  // Clear errors
  errors.name = "";
  errors.phone = "";
  errors.email = "";

  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const selectAvatar = () => {
  avatarInput.value?.click();
};

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // In production, you would upload this to a server
    // For now, we'll create a local URL
    const reader = new FileReader();
    reader.onload = (e) => {
      editForm.avatar_url = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const validateForm = (): boolean => {
  let isValid = true;

  // Reset errors
  errors.name = "";
  errors.phone = "";
  errors.email = "";

  // Validate name
  if (!editForm.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  // Validate phone
  if (!editForm.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  } else if (!/^\+?[0-9]{10,15}$/.test(editForm.phone.replace(/\s/g, ""))) {
    errors.phone = "Please enter a valid phone number";
    isValid = false;
  }

  // Validate email (optional but must be valid if provided)
  if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  return isValid;
};

const saveProfile = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;

  try {
    const result = await store.dispatch("member/updateMemberProfile", {
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email,
      avatar_url: editForm.avatar_url,
    });

    if (result.success) {
      // Show success toast
      const toast = await toastController.create({
        message: "Profile updated successfully!",
        duration: 2000,
        color: "success",
        position: "top",
      });
      await toast.present();

      closeEditModal();
    } else {
      // Show error toast
      const toast = await toastController.create({
        message: result.error || "Failed to update profile",
        duration: 3000,
        color: "danger",
        position: "top",
      });
      await toast.present();
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    const toast = await toastController.create({
      message: "An error occurred while saving your profile",
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  } finally {
    isSaving.value = false;
  }
};

// Receipt Viewer
const handleViewReceipt = (url: string) => {
  // Find the payment from history to get full details
  const payment = paymentHistory.value.find((p: any) => p.receiptUrl === url);

  if (payment) {
    selectedReceipt.value = {
      url: url,
      info: {
        roundNumber: 1, // You might want to add this to the Payment interface
        amount: payment.amount,
        date: payment.date,
        memberName: profileData.value.name || "Member",
      },
    };
    isReceiptModalOpen.value = true;
  }
};

const closeReceiptModal = () => {
  isReceiptModalOpen.value = false;
  selectedReceipt.value = null;
};
</script>

<style scoped>
/* Wujo Color Variables */
:root {
  --wujo-dark-green: #014023;
  --wujo-aquamarine: #5fd9ac;
  --wujo-white-smoke: #f2f2f2;
  --wujo-text-grey: #666;
  --wujo-border: #e0e0e0;
}

ion-content {
  --background: var(--wujo-white-smoke);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

/* Premium Hero Section (Task 6.1) */
.profile-hero {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px;
  border-radius: 0 0 24px 24px;
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

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.menu-icon,
.notification-icon {
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.notification-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--wujo-aquamarine);
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: var(--wujo-font-size-hero);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  color: white;
  margin: 0 0 8px 0;
}

.member-phone {
  font-size: var(--wujo-font-size-body);
  line-height: var(--wujo-line-height-normal);
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px 0;
}

.join-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 20px;
}

.join-date ion-icon {
  font-size: 18px;
}

.edit-profile-button {
  --background: var(--wujo-aquamarine);
  --background-activated: #4bc99a;
  --color: var(--wujo-dark-green);
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  height: 56px;
  font-weight: 700;
  font-size: 16px;
  text-transform: none;
  width: 100%;
  max-width: 300px;
  margin-top: 8px;
}

/* Member Tab Bar */
member-tab-bar {
  display: block;
  margin-bottom: 16px;
}

/* Main Content Area */
.profile-content {
  padding: 0 20px 80px 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-state p {
  color: var(--wujo-text-grey);
  font-size: 14px;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

/* Section Titles */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--wujo-dark-green);
  margin: 0 0 16px 0;
}

/* Statistics Cards Section (Task 6.2) */
.statistics-section {
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  animation: scaleIn 0.3s ease-out;
  animation-fill-mode: both;
}

.stat-card:nth-child(1) {
  animation-delay: 0s;
}
.stat-card:nth-child(2) {
  animation-delay: 0.1s;
}
.stat-card:nth-child(3) {
  animation-delay: 0.2s;
}
.stat-card:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--wujo-aquamarine) 0%, #4bc99a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.trophy {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.stat-icon.cash {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
}

.stat-icon ion-icon {
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--wujo-dark-green);
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 12px;
  color: var(--wujo-text-grey);
  margin: 0;
  line-height: 1.3;
}

/* Achievements Section (Task 6.3) */
.achievements-section {
  margin-bottom: 8px;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Savings History Section (Task 6.4) */
.savings-history-section {
  margin-bottom: 8px;
}

.timeline {
  display: flex;
  flex-direction: column;
}

/* Lottery Wins Section (Task 6.5) */
.lottery-wins-section {
  margin-bottom: 8px;
}

.total-winnings {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

.total-winnings ion-icon {
  font-size: 40px;
  color: white;
}

.winnings-info {
  flex: 1;
}

.winnings-label {
  font-size: 14px;
  color: rgba(1, 64, 35, 0.8);
  margin: 0 0 4px 0;
  font-weight: 600;
}

.winnings-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--wujo-dark-green);
  margin: 0;
}

.wins-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.win-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.win-item.recent {
  animation: celebration 0.6s ease-out;
  border: 2px solid var(--wujo-aquamarine);
}

@keyframes celebration {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05) rotate(2deg);
  }
  75% {
    transform: scale(1.05) rotate(-2deg);
  }
}

.win-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.win-icon ion-icon {
  font-size: 24px;
  color: white;
}

.win-details {
  flex: 1;
  min-width: 0;
}

.win-iqub {
  font-size: 16px;
  font-weight: 700;
  color: var(--wujo-dark-green);
  margin: 0 0 4px 0;
}

.win-date {
  font-size: 13px;
  color: var(--wujo-text-grey);
  margin: 0;
}

.win-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--wujo-aquamarine);
  margin: 0;
}

/* Section Loading State */
.section-loading {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-state ion-icon {
  font-size: 64px;
  color: var(--wujo-border);
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: var(--wujo-text-grey);
  margin: 0;
  line-height: 1.5;
}

/* Edit Profile Modal (Task 6.6) */
.form-group {
  margin-bottom: 24px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--wujo-white-smoke);
  border-radius: 12px;
}

.current-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--wujo-aquamarine);
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

ion-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--wujo-dark-green);
  margin-bottom: 8px;
}

ion-input {
  --background: white;
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  border: 1px solid var(--wujo-border);
  border-radius: 12px;
  margin-top: 8px;
}

ion-input.ion-invalid {
  border-color: #ff4444;
}

.error-text {
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

.save-button {
  --background: var(--wujo-aquamarine);
  --background-activated: #4bc99a;
  --color: var(--wujo-dark-green);
  --border-radius: 12px;
  height: 56px;
  font-weight: 700;
}

.save-button ion-spinner {
  --color: var(--wujo-dark-green);
}
</style>
