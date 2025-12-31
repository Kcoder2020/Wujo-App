<template>
  <ion-page>
    <ion-content :fullscreen="true" class="profile-content">
      <!-- Premium Hero Section -->
      <div class="profile-hero">
        <div class="hero-background">
          <div class="hero-gradient"></div>
          <div class="floating-particles">
            <div
              v-for="i in 8"
              :key="i"
              class="particle"
              :style="getParticleStyle(i)"
            ></div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="hero-header">
          <button class="header-btn" @click="openMenu">
            <ion-icon :icon="menuOutline"></ion-icon>
          </button>
          <div class="notification-container">
            <button class="header-btn" @click="goToNotifications">
              <ion-icon :icon="notificationsOutline"></ion-icon>
            </button>
            <span v-if="notificationCount > 0" class="notification-badge">
              {{ notificationCount > 9 ? "9+" : notificationCount }}
            </span>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="hero-content">
          <!-- Avatar with Glow -->
          <div class="avatar-section">
            <div class="avatar-glow"></div>
            <div class="avatar-ring"></div>
            <div class="avatar-container">
              <img
                :src="profileData.avatar_url || defaultAvatar"
                alt="Profile"
                class="avatar-image"
              />
            </div>
            <button class="edit-avatar-btn" @click="openEditModal">
              <ion-icon :icon="cameraOutline"></ion-icon>
            </button>
          </div>

          <!-- Member Info -->
          <h1 class="member-name">{{ profileData.name || "Member" }}</h1>
          <p class="member-phone">{{ formatPhone(profileData.phone) }}</p>

          <!-- Member Since Badge -->
          <div class="member-since">
            <ion-icon :icon="calendarOutline"></ion-icon>
            <span
              >Member since {{ formatJoinDate(profileData.join_date) }}</span
            >
          </div>

          <!-- Edit Profile Button -->
          <button class="edit-profile-btn" @click="openEditModal">
            <ion-icon :icon="createOutline"></ion-icon>
            <span>Edit Profile</span>
          </button>
        </div>

        <!-- Wave Decoration -->
        <svg class="hero-wave" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path
            d="M0,40 C80,10 160,30 240,20 C320,10 360,25 400,15 L400,40 L0,40 Z"
            fill="var(--ion-color-white-smoke, #f5f5f5)"
          />
        </svg>
      </div>

      <!-- Tab Bar -->
      <member-tab-bar></member-tab-bar>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
          </div>
          <p class="loading-text">Loading your profile...</p>
        </div>

        <!-- Content Sections -->
        <div v-else class="sections-container">
          <!-- Quick Stats Grid -->
          <section class="stats-section">
            <h2 class="section-title">
              <ion-icon :icon="statsChartOutline"></ion-icon>
              Your Statistics
            </h2>
            <div class="stats-grid">
              <div
                v-for="(stat, index) in statsCards"
                :key="stat.label"
                class="stat-card"
                :class="stat.colorClass"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="stat-icon-container">
                  <ion-icon :icon="stat.icon"></ion-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-value">{{ stat.value }}</p>
                  <p class="stat-label">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Achievements Section -->
          <section class="achievements-section">
            <div class="section-header">
              <h2 class="section-title">
                <ion-icon :icon="ribbonOutline"></ion-icon>
                Achievements
              </h2>
              <span class="badge-count">
                {{ earnedCount }}/{{ achievements.length }}
              </span>
            </div>

            <div
              v-if="achievementsStatus === 'loading'"
              class="section-loading"
            >
              <ion-spinner name="dots"></ion-spinner>
            </div>

            <div v-else-if="achievements.length > 0" class="achievements-list">
              <achievement-badge
                v-for="achievement in achievements"
                :key="achievement.id"
                :achievement="achievement"
              />
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">
                <ion-icon :icon="ribbonOutline"></ion-icon>
              </div>
              <p class="empty-title">No achievements yet</p>
              <p class="empty-description">
                Keep saving to unlock badges and rewards!
              </p>
            </div>
          </section>

          <!-- Payment History Section -->
          <section class="history-section">
            <div class="section-header">
              <h2 class="section-title">
                <ion-icon :icon="walletOutline"></ion-icon>
                Savings History
              </h2>
              <span v-if="paymentHistory.length > 0" class="history-count">
                {{ paymentHistory.length }} payments
              </span>
            </div>

            <div
              v-if="paymentHistoryStatus === 'loading'"
              class="section-loading"
            >
              <ion-spinner name="dots"></ion-spinner>
            </div>

            <div v-else-if="paymentHistory.length > 0" class="history-timeline">
              <payment-history-item
                v-for="(payment, index) in paymentHistory"
                :key="payment.id"
                :payment="payment"
                :is-last="index === paymentHistory.length - 1"
                @view-receipt="handleViewReceipt"
              />
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">
                <ion-icon :icon="walletOutline"></ion-icon>
              </div>
              <p class="empty-title">No payment history</p>
              <p class="empty-description">
                Start saving to see your progress here!
              </p>
            </div>
          </section>

          <!-- Lottery Wins Section -->
          <section v-if="hasLotteryWins" class="lottery-section">
            <div class="section-header">
              <h2 class="section-title">
                <ion-icon :icon="trophyOutline"></ion-icon>
                Lottery Wins
              </h2>
            </div>

            <!-- Total Winnings Card -->
            <div class="total-winnings-card">
              <div class="winnings-icon">
                <ion-icon :icon="trophyOutline"></ion-icon>
              </div>
              <div class="winnings-info">
                <p class="winnings-label">Total Winnings</p>
                <p class="winnings-amount">
                  {{ formatCurrency(totalWinnings) }}
                </p>
              </div>
              <div class="winnings-confetti">🎉</div>
            </div>

            <!-- Wins List -->
            <div class="wins-list">
              <div
                v-for="win in lotteryWins"
                :key="win.id"
                class="win-card"
                :class="{ recent: isRecentWin(win.date) }"
              >
                <div class="win-trophy">
                  <ion-icon :icon="trophyOutline"></ion-icon>
                </div>
                <div class="win-details">
                  <p class="win-iqub">{{ win.iqubName }}</p>
                  <p class="win-date">{{ formatDate(win.date) }}</p>
                </div>
                <p class="win-amount">{{ formatCurrency(win.amount) }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <ion-modal :is-open="isEditModalOpen" @did-dismiss="closeEditModal">
        <ion-header>
          <ion-toolbar class="modal-toolbar">
            <ion-title>Edit Profile</ion-title>
            <template #end>
              <ion-buttons>
                <ion-button @click="closeEditModal" fill="clear">
                  <ion-icon :icon="closeOutline"></ion-icon>
                </ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>

        <ion-content class="modal-content">
          <form @submit.prevent="saveProfile" class="edit-form">
            <!-- Avatar Upload -->
            <div class="avatar-upload-section">
              <div class="upload-avatar-container">
                <img
                  :src="editForm.avatar_url || defaultAvatar"
                  alt="Avatar"
                  class="upload-avatar"
                />
                <button type="button" class="upload-btn" @click="selectAvatar">
                  <ion-icon :icon="cameraOutline"></ion-icon>
                </button>
              </div>
              <p class="upload-hint">Tap to change photo</p>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              />
            </div>

            <!-- Form Fields -->
            <div class="form-fields">
              <!-- Name -->
              <div class="form-group">
                <label class="form-label">
                  <ion-icon :icon="personOutline"></ion-icon>
                  Full Name
                </label>
                <div class="input-wrapper" :class="{ error: errors.name }">
                  <ion-input
                    v-model="editForm.name"
                    type="text"
                    placeholder="Enter your name"
                  ></ion-input>
                </div>
                <p v-if="errors.name" class="error-message">
                  {{ errors.name }}
                </p>
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label class="form-label">
                  <ion-icon :icon="callOutline"></ion-icon>
                  Phone Number
                </label>
                <div class="input-wrapper" :class="{ error: errors.phone }">
                  <ion-input
                    v-model="editForm.phone"
                    type="tel"
                    placeholder="+251912345678"
                  ></ion-input>
                </div>
                <p v-if="errors.phone" class="error-message">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label class="form-label">
                  <ion-icon :icon="mailOutline"></ion-icon>
                  Email (Optional)
                </label>
                <div class="input-wrapper" :class="{ error: errors.email }">
                  <ion-input
                    v-model="editForm.email"
                    type="email"
                    placeholder="your.email@example.com"
                  ></ion-input>
                </div>
                <p v-if="errors.email" class="error-message">
                  {{ errors.email }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="isSaving">
                <ion-spinner v-if="isSaving" name="crescent"></ion-spinner>
                <template v-else>
                  <ion-icon :icon="checkmarkOutline"></ion-icon>
                  <span>Save Changes</span>
                </template>
              </button>
              <button
                type="button"
                class="cancel-btn"
                @click="closeEditModal"
                :disabled="isSaving"
              >
                Cancel
              </button>
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
import { computed, ref, onMounted, reactive } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonSpinner,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonInput,
  menuController,
  toastController,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  menuOutline,
  notificationsOutline,
  calendarOutline,
  createOutline,
  cameraOutline,
  peopleOutline,
  trophyOutline,
  cashOutline,
  checkmarkCircleOutline,
  ribbonOutline,
  walletOutline,
  statsChartOutline,
  closeOutline,
  personOutline,
  callOutline,
  mailOutline,
  checkmarkOutline,
} from "ionicons/icons";

// Components
import MemberTabBar from "@/components/MemberTabBar.vue";
import AchievementBadge from "@/components/AchievementBadge.vue";
import PaymentHistoryItem from "@/components/PaymentHistoryItem.vue";
import ReceiptViewerModal from "@/components/ReceiptViewerModal.vue";

// Types
interface LotteryWin {
  id: string;
  iqubName: string;
  amount: number;
  date: string;
}

const store = useStore();
const router = useRouter();

// State
const isEditModalOpen = ref(false);
const isSaving = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);
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

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Member&background=5FD9AC&color=014023&size=200&bold=true";

// Edit Form
const editForm = reactive({
  name: "",
  phone: "",
  email: "",
  avatar_url: "",
});

const errors = reactive({
  name: "",
  phone: "",
  email: "",
});

// Computed
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
const isLoading = computed(() => store.getters["member/status"] === "loading");
const notificationCount = computed(
  () => store.getters["member/unviewedLotteryCount"] || 0
);

const earnedCount = computed(() => {
  return achievements.value.filter((a: any) => a.earned).length;
});

// Stats Cards
const statsCards = computed(() => [
  {
    icon: peopleOutline,
    value: profileData.value.iqub_joined_count || 0,
    label: "Iqubs Joined",
    colorClass: "stat-primary",
  },
  {
    icon: trophyOutline,
    value: profileData.value.lotteries_won_count || 0,
    label: "Lotteries Won",
    colorClass: "stat-gold",
  },
  {
    icon: cashOutline,
    value: formatCurrency(profileData.value.total_saved || 0),
    label: "Total Saved",
    colorClass: "stat-green",
  },
  {
    icon: checkmarkCircleOutline,
    value: profileData.value.active_iqubs || 0,
    label: "Active Iqubs",
    colorClass: "stat-blue",
  },
]);

// Lottery Wins (mock for now - can be connected to API)
const lotteryWins = computed((): LotteryWin[] => []);
const hasLotteryWins = computed(() => lotteryWins.value.length > 0);
const totalWinnings = computed(() =>
  lotteryWins.value.reduce((sum, win) => sum + win.amount, 0)
);

// Lifecycle
onMounted(async () => {
  await Promise.all([
    store.dispatch("member/fetchMemberProfile"),
    store.dispatch("member/fetchAchievements"),
    store.dispatch("member/fetchPaymentHistory"),
    store.dispatch("member/fetchNotificationCount"),
  ]);
});

// Particle Animation
const getParticleStyle = (index: number) => {
  const sizes = [4, 6, 5, 7, 4, 6, 5, 8];
  const delays = [0, 1.5, 3, 0.5, 2, 4, 1, 2.5];
  const durations = [12, 15, 14, 16, 13, 17, 14, 15];
  const lefts = [10, 25, 40, 55, 70, 85, 15, 75];

  return {
    width: `${sizes[index - 1]}px`,
    height: `${sizes[index - 1]}px`,
    left: `${lefts[index - 1]}%`,
    animationDelay: `${delays[index - 1]}s`,
    animationDuration: `${durations[index - 1]}s`,
  };
};

// Formatters
const formatPhone = (phone: string | undefined): string => {
  if (!phone) return "N/A";
  return phone;
};

const formatJoinDate = (dateString: string | undefined): string => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
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
  return daysSince <= 7;
};

// Actions
const openMenu = () => menuController.open("app-menu");
const goToNotifications = () => router.push("/member/lottery-notifications");

// Edit Modal
const openEditModal = () => {
  editForm.name = profileData.value.name || "";
  editForm.phone = profileData.value.phone || "";
  editForm.email = profileData.value.email || "";
  editForm.avatar_url = profileData.value.avatar_url || "";
  errors.name = "";
  errors.phone = "";
  errors.email = "";
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const selectAvatar = () => avatarInput.value?.click();

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editForm.avatar_url = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const validateForm = (): boolean => {
  let isValid = true;
  errors.name = "";
  errors.phone = "";
  errors.email = "";

  if (!editForm.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!editForm.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  } else if (!/^\+?[0-9]{10,15}$/.test(editForm.phone.replace(/\s/g, ""))) {
    errors.phone = "Please enter a valid phone number";
    isValid = false;
  }

  if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  return isValid;
};

const saveProfile = async () => {
  if (!validateForm()) return;

  isSaving.value = true;
  try {
    const result = await store.dispatch("member/updateMemberProfile", {
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email || undefined,
      avatar_url: editForm.avatar_url || undefined,
    });

    if (result.success) {
      const toast = await toastController.create({
        message: "Profile updated successfully!",
        duration: 2000,
        color: "success",
        position: "top",
      });
      await toast.present();
      closeEditModal();
    } else {
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
      message: "An error occurred while saving",
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  } finally {
    isSaving.value = false;
  }
};

// Receipt Modal
const handleViewReceipt = (url: string) => {
  const payment = paymentHistory.value.find((p: any) => p.receiptUrl === url);
  if (payment) {
    selectedReceipt.value = {
      url,
      info: {
        roundNumber: 1,
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
/* ===== Base Styles ===== */
.profile-content {
  --background: var(--ion-color-white-smoke, #f5f5f5);
}

/* ===== Hero Section ===== */
.profile-hero {
  position: relative;
  padding-bottom: 30px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 30px;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012d19 50%,
    #011a0f 100%
  );
}

/* Floating Particles */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -10px;
  background: radial-gradient(
    circle,
    rgba(95, 217, 172, 0.5) 0%,
    rgba(95, 217, 172, 0) 70%
  );
  border-radius: 50%;
  animation: floatUp linear infinite;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
    transform: translateY(-5vh) scale(1);
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) scale(0.5);
    opacity: 0;
  }
}

/* Header Actions */
.hero-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  padding-top: calc(16px + var(--ion-safe-area-top, 0px));
}

.header-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.2);
}

.header-btn ion-icon {
  font-size: 22px;
  color: white;
}

.notification-container {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.5);
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
}

/* Avatar Section */
.avatar-section {
  position: relative;
  margin-bottom: 20px;
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle,
    rgba(95, 217, 172, 0.3) 0%,
    rgba(95, 217, 172, 0) 70%
  );
  border-radius: 50%;
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.avatar-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.4);
  transition: all 0.3s ease;
}

.edit-avatar-btn:active {
  transform: scale(0.9);
}

.edit-avatar-btn ion-icon {
  font-size: 18px;
  color: var(--ion-color-dark-green, #014023);
}

/* Member Info */
.member-name {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.member-phone {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px 0;
}

.member-since {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-bottom: 20px;
}

.member-since ion-icon {
  font-size: 16px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.member-since span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* Edit Profile Button */
.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  border: none;
  border-radius: 16px;
  color: var(--ion-color-dark-green, #014023);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(95, 217, 172, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.edit-profile-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.3);
}

.edit-profile-btn ion-icon {
  font-size: 20px;
}

/* Hero Wave */
.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  z-index: 1;
}

/* ===== Main Content ===== */
.main-content {
  padding: 0 20px 100px;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
}

.loading-text {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* Sections Container */
.sections-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Styles */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 16px 0;
}

.section-title ion-icon {
  font-size: 22px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.badge-count,
.history-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  background: rgba(95, 217, 172, 0.15);
  padding: 4px 12px;
  border-radius: 12px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: scaleIn 0.4s ease-out backwards;
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

.stat-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-container ion-icon {
  font-size: 24px;
  color: white;
}

.stat-primary .stat-icon-container {
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
}

.stat-gold .stat-icon-container {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
}

.stat-green .stat-icon-container {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
}

.stat-blue .stat-icon-container {
  background: linear-gradient(135deg, #2196f3 0%, #1e88e5 100%);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin: 0;
}

/* Achievements List */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* History Timeline */
.history-timeline {
  display: flex;
  flex-direction: column;
}

/* Section Loading */
.section-loading {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--ion-color-white-smoke, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon ion-icon {
  font-size: 36px;
  color: #ccc;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #888;
  margin: 0;
  text-align: center;
}

/* Lottery Section */
.total-winnings-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3);
  position: relative;
  overflow: hidden;
}

.winnings-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.winnings-icon ion-icon {
  font-size: 32px;
  color: white;
}

.winnings-info {
  flex: 1;
}

.winnings-label {
  font-size: 13px;
  color: rgba(1, 64, 35, 0.7);
  margin: 0 0 4px 0;
  font-weight: 600;
}

.winnings-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0;
}

.winnings-confetti {
  font-size: 32px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.wins-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.win-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.win-card.recent {
  border: 2px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  animation: celebratePulse 0.6s ease-out;
}

@keyframes celebratePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.win-trophy {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.win-trophy ion-icon {
  font-size: 24px;
  color: white;
}

.win-details {
  flex: 1;
  min-width: 0;
}

.win-iqub {
  font-size: 15px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.win-date {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.win-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin: 0;
}

/* ===== Edit Modal ===== */
.modal-toolbar {
  --background: var(--ion-color-dark-green, #014023);
  --color: white;
}

.modal-content {
  --background: var(--ion-color-white-smoke, #f5f5f5);
}

.edit-form {
  padding: 24px 20px;
}

/* Avatar Upload */
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.upload-avatar-container {
  position: relative;
  margin-bottom: 12px;
}

.upload-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--ion-color-medium-aquamarine, #5fd9ac);
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.4);
}

.upload-btn ion-icon {
  font-size: 18px;
  color: var(--ion-color-dark-green, #014023);
}

.upload-hint {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin-bottom: 8px;
}

.form-label ion-icon {
  font-size: 18px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.input-wrapper {
  background: white;
  border-radius: 14px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: var(--ion-color-medium-aquamarine, #5fd9ac);
  box-shadow: 0 0 0 4px rgba(95, 217, 172, 0.15);
}

.input-wrapper.error {
  border-color: #ef4444;
}

.input-wrapper ion-input {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  font-size: 16px;
}

.error-message {
  font-size: 12px;
  color: #ef4444;
  margin: 6px 0 0 4px;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  border: none;
  border-radius: 14px;
  color: var(--ion-color-dark-green, #014023);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  transition: all 0.3s ease;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-btn:not(:disabled):active {
  transform: scale(0.98);
}

.save-btn ion-icon {
  font-size: 20px;
}

.cancel-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  color: #666;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:not(:disabled):hover {
  background: #f5f5f5;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Responsive ===== */
@media (max-height: 667px) {
  .avatar-container {
    width: 80px;
    height: 80px;
  }

  .member-name {
    font-size: 24px;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .avatar-glow,
  .avatar-ring,
  .winnings-confetti {
    animation: none;
  }

  .stat-card,
  .sections-container {
    animation: none;
  }
}
</style>
