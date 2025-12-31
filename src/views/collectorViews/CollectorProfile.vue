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

          <!-- Collector Name -->
          <h1 class="collector-name">{{ profileData.name || "Collector" }}</h1>

          <!-- Phone Number -->
          <p class="collector-phone">{{ profileData.phone || "N/A" }}</p>

          <!-- Join Date -->
          <div class="join-date">
            <ion-icon :icon="calendarOutline" />
            <span
              >Collector since
              {{ formatJoinDate(profileData.created_at) }}</span
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

      <!-- Collector Tab Bar -->
      <collector-tab-bar />

      <!-- Main Content Area -->
      <div class="profile-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <ion-spinner name="dots" color="primary" />
          <p>Loading profile...</p>
        </div>

        <!-- Content Sections -->
        <div v-else class="content-sections">
          <!-- Statistics Section -->
          <div class="statistics-section">
            <h2 class="section-title">Statistics</h2>
            <div class="stats-grid">
              <!-- Iqubs Created -->
              <div class="stat-card">
                <div class="stat-icon create">
                  <ion-icon :icon="addCircleOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ profileData.iqubs_created_count || 0 }}
                  </p>
                  <p class="stat-label">Iqubs Created</p>
                </div>
              </div>

              <!-- Total Members -->
              <div class="stat-card">
                <div class="stat-icon members">
                  <ion-icon :icon="peopleOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ profileData.total_members_count || 0 }}
                  </p>
                  <p class="stat-label">Total Members</p>
                </div>
              </div>

              <!-- Total Collections -->
              <div class="stat-card">
                <div class="stat-icon cash">
                  <ion-icon :icon="cashOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ formatCurrency(profileData.total_collected || 0) }}
                  </p>
                  <p class="stat-label">Total Collected</p>
                </div>
              </div>

              <!-- Completed Iqubs -->
              <div class="stat-card">
                <div class="stat-icon complete">
                  <ion-icon :icon="checkmarkCircleOutline" />
                </div>
                <div class="stat-info">
                  <p class="stat-value">
                    {{ profileData.completed_iqubs_count || 0 }}
                  </p>
                  <p class="stat-label">Completed Iqubs</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Created Iqubs Section -->
          <div class="created-iqubs-section">
            <h2 class="section-title">My Created Iqubs</h2>

            <div v-if="createdIqubs.length > 0" class="iqubs-list">
              <div
                v-for="iqub in createdIqubs"
                :key="iqub.id"
                class="iqub-card"
                @click="navigateToIqub(iqub.id)"
              >
                <div class="iqub-header">
                  <h3 class="iqub-name">{{ iqub.name }}</h3>
                  <ion-badge
                    :color="getIqubStatusColor(iqub.status)"
                    class="status-badge"
                  >
                    {{ iqub.status }}
                  </ion-badge>
                </div>

                <div class="iqub-details">
                  <div class="detail-item">
                    <ion-icon :icon="peopleOutline" />
                    <span>{{ iqub.members_count }} members</span>
                  </div>
                  <div class="detail-item">
                    <ion-icon :icon="cashOutline" />
                    <span
                      >{{
                        formatCurrency(iqub.contribution_amount || 0)
                      }}/round</span
                    >
                  </div>
                  <div class="detail-item">
                    <ion-icon :icon="calendarOutline" />
                    <span
                      >Round {{ iqub.current_round }}/{{
                        iqub.total_rounds
                      }}</span
                    >
                  </div>
                </div>

                <div class="iqub-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: getIqubProgress(iqub) + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text"
                    >{{ getIqubProgress(iqub) }}% complete</span
                  >
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <ion-icon :icon="walletOutline" />
              <p>No Iqubs created yet</p>
              <ion-button
                fill="outline"
                @click="router.push('/collector/create-iqub')"
              >
                Create Your First Iqub
              </ion-button>
            </div>
          </div>

          <!-- Settings & Logout Section -->
          <div class="settings-section">
            <h2 class="section-title">Settings</h2>

            <div class="settings-list">
              <!-- Account Settings -->
              <div class="setting-item" @click="openAccountSettings">
                <div class="setting-icon">
                  <ion-icon :icon="personOutline" />
                </div>
                <div class="setting-info">
                  <p class="setting-title">Account Settings</p>
                  <p class="setting-subtitle">
                    Manage your account preferences
                  </p>
                </div>
                <ion-icon :icon="chevronForwardOutline" class="setting-arrow" />
              </div>

              <!-- Security -->
              <div class="setting-item" @click="openSecuritySettings">
                <div class="setting-icon">
                  <ion-icon :icon="lockClosedOutline" />
                </div>
                <div class="setting-info">
                  <p class="setting-title">Security</p>
                  <p class="setting-subtitle">Password and authentication</p>
                </div>
                <ion-icon :icon="chevronForwardOutline" class="setting-arrow" />
              </div>

              <!-- Logout -->
              <div class="setting-item logout-item" @click="handleLogout">
                <div class="setting-icon logout">
                  <ion-icon :icon="logOutOutline" />
                </div>
                <div class="setting-info">
                  <p class="setting-title">Logout</p>
                  <p class="setting-subtitle">Sign out of your account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
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
  useIonRouter,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref, onMounted, reactive } from "vue";
import { useNotifications } from "@/composables";

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  calendarOutline,
  createOutline,
  addCircleOutline,
  peopleOutline,
  cashOutline,
  checkmarkCircleOutline,
  walletOutline,
  cameraOutline,
  personOutline,
  lockClosedOutline,
  logOutOutline,
  chevronForwardOutline,
} from "ionicons/icons";

// Import Components
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const router = useRouter();
const ionRouter = useIonRouter();
const { unreadCount } = useNotifications();

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Collector&background=5FD9AC&color=014023&size=200";

// Edit Modal State
const isEditModalOpen = ref(false);
const isSaving = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);

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

// Interfaces
interface Iqub {
  id: string | number;
  name: string;
  status: string;
  members_count: number;
  contribution_amount: number;
  current_round: number;
  total_rounds: number;
}

// Computed Properties
const profileData = computed(() => {
  // Use auth/getUser as source of truth
  const user = store.getters["auth/getUser"];

  // Map user data to profile structure with defaults
  // This prevents "undefined" errors
  return {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    avatar_url: user?.avatar_url || "",
    created_at: user?.created_at || new Date().toISOString(),
    // These would ideally come from a collector module or API
    // For now, we default to 0 or derive if possible
    iqubs_created_count: user?.iqubs_created_count || 0,
    total_members_count: user?.total_members_count || 0,
    total_collected: user?.total_collected || 0,
    completed_iqubs_count: user?.completed_iqubs_count || 0,
  };
});

// Mock or fetch created Iqubs
const createdIqubs = computed<Iqub[]>(() => {
  // If we had a collector module: store.getters["collector/createdIqubs"]
  // For now, return empty array or mock data to prevent errors
  return [];
});

const notificationCount = computed(() => unreadCount.value);

const isLoading = computed(() => {
  return store.getters["auth/getAuthStatus"] === "loading";
});

// Lifecycle Hooks
onMounted(async () => {
  // Ensure user data is fresh
  if (!store.getters["auth/getUser"]) {
    await store.dispatch("auth/fetchUser");
  }
});

// Event Handlers
const openMenu = () => {
  menuController.open("app-menu");
};

const goToNotifications = () => {
  router.push("/notifications");
};

const navigateToIqub = (id: string | number) => {
  router.push(`/collector/iqub/${id}`);
};

const openAccountSettings = () => {
  // Placeholder for settings navigation
  console.log("Open account settings");
};

const openSecuritySettings = () => {
  // Placeholder for security settings
  console.log("Open security settings");
};

const handleLogout = async () => {
  await store.dispatch("auth/logout");
  ionRouter.push("/login", "root", "replace");
};

// Format Helpers
const formatJoinDate = (dateString: string | undefined): string => {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "Recently";
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getIqubStatusColor = (status: string): string => {
  if (!status) return "medium";
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    case "pending":
      return "warning";
    default:
      return "medium";
  }
};

const getIqubProgress = (iqub: {
  current_round: number;
  total_rounds: number;
}): number => {
  if (!iqub || !iqub.total_rounds) return 0;
  return Math.round((iqub.current_round / iqub.total_rounds) * 100);
};

// Edit Profile Modal Functions
const openEditModal = () => {
  editForm.name = profileData.value.name;
  editForm.phone = profileData.value.phone;
  editForm.email = profileData.value.email;
  editForm.avatar_url = profileData.value.avatar_url;

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
    // Simulate API call or use store action
    // await store.dispatch("auth/updateProfile", editForm);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay

    const toast = await toastController.create({
      message: "Profile updated successfully!",
      duration: 2000,
      color: "success",
      position: "top",
    });
    await toast.present();
    closeEditModal();
  } catch (error) {
    console.error("Error saving profile:", error);
    const toast = await toastController.create({
      message: "Failed to update profile",
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  } finally {
    isSaving.value = false;
  }
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

/* Premium Hero Section */
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
  border: 3px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collector-name {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.collector-phone {
  font-size: 16px;
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

.edit-profile-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-activated: #4bc99a;
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  height: 56px;
  font-weight: 700;
  font-size: 16px;
  text-transform: none;
  width: 100%;
  max-width: 300px;
}

/* Main Content */
.profile-content {
  padding: 16px;
  padding-bottom: 100px;
  /* Account for tab bar */
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 24px 0 16px 0;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-icon.create {
  background: rgba(95, 217, 172, 0.1);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.stat-icon.members {
  background: rgba(1, 64, 35, 0.1);
  color: var(--ion-color-dark-green, #014023);
}

.stat-icon.cash {
  background: rgba(255, 165, 0, 0.1);
  color: #ffa500;
}

.stat-icon.complete {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.stat-info {
  overflow: hidden;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Created Iqubs List */
.iqubs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.iqub-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}

.iqub-card:active {
  transform: scale(0.98);
}

.iqub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.iqub-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0;
}

.iqub-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  border-radius: 3px;
}

.progress-text {
  font-size: 10px;
  color: #999;
  display: block;
  text-align: right;
}

/* Settings List */
.settings-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  margin-right: 16px;
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.setting-subtitle {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.setting-arrow {
  color: #ccc;
  font-size: 20px;
}

.logout-item .setting-icon {
  background: rgba(220, 53, 69, 0.1);
  color: var(--ion-color-danger, #eb445a);
}

.logout-item .setting-title {
  color: var(--ion-color-danger, #eb445a);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state ion-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.current-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--ion-color-medium-aquamarine, #5fd9ac);
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  font-weight: 700;
}
</style>
