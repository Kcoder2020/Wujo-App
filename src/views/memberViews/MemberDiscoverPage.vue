<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <ion-text class="page-title">Discover Iqubs</ion-text>
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <ion-badge color="danger" class="notification-badge">{{
            notificationCount
          }}</ion-badge>
        </div>
      </div>

      <member-tab-bar></member-tab-bar>

      <div class="page-content">
        <!-- Search Bar -->
        <div class="search-section">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search Iqubs..."
            :debounce="300"
            @ionInput="handleSearch"
            class="custom-searchbar"
          />
        </div>

        <!-- Filter Chips -->
        <div class="filter-section">
          <ion-chip
            v-for="category in categories"
            :key="category"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
            class="filter-chip"
          >
            {{ category }}
          </ion-chip>
        </div>

        <!-- Skeleton Loaders -->
        <div v-if="isLoading" class="iqubs-grid">
          <discover-iqub-card-skeleton v-for="i in 3" :key="`skeleton-${i}`" />
        </div>

        <!-- Network Error State -->
        <div
          v-else-if="error && isNetworkError"
          class="error-container network-error"
        >
          <ion-icon :icon="cloudOfflineOutline" class="error-icon" />
          <h3 class="error-title">Connection Lost</h3>
          <p class="error-text">
            Unable to connect to the server. Please check your internet
            connection and try again.
          </p>
          <ion-button @click="loadAvailableIqubs" class="retry-button">
            <template #start>
              <ion-icon :icon="refreshOutline" />
            </template>
            Retry
          </ion-button>
        </div>

        <!-- General Error State -->
        <div v-else-if="error" class="error-container">
          <ion-icon :icon="alertCircleOutline" class="error-icon" />
          <h3 class="error-title">Something Went Wrong</h3>
          <p class="error-text">{{ error }}</p>
          <ion-button
            @click="loadAvailableIqubs"
            fill="outline"
            class="retry-button"
          >
            <template #start>
              <ion-icon :icon="refreshOutline" />
            </template>
            Try Again
          </ion-button>
        </div>

        <!-- Empty Search Results State -->
        <div
          v-else-if="
            filteredIqubs.length === 0 &&
            (searchQuery || selectedCategory !== 'All')
          "
          class="empty-container search-empty"
        >
          <ion-icon :icon="searchOutline" class="empty-icon" />
          <h3 class="empty-title">No Results Found</h3>
          <p class="empty-text">
            We couldn't find any Iqubs matching your search criteria.
          </p>
          <p class="empty-suggestion">
            Try adjusting your filters or search terms
          </p>
          <ion-button @click="clearFilters" fill="clear" class="clear-button">
            Clear Filters
          </ion-button>
        </div>

        <!-- No Iqubs Available State -->
        <div
          v-else-if="filteredIqubs.length === 0"
          class="empty-container no-iqubs"
        >
          <ion-icon :icon="walletOutline" class="empty-icon encouraging" />
          <h3 class="empty-title">No Iqubs Available Yet</h3>
          <p class="empty-text">
            There are currently no Iqubs available to join. New opportunities
            are added regularly!
          </p>
          <p class="empty-encouragement">
            💡 Check back soon or create your own Iqub to get started
          </p>
          <ion-button
            @click="loadAvailableIqubs"
            fill="outline"
            class="refresh-button"
          >
            <template #start>
              <ion-icon :icon="refreshOutline" />
            </template>
            Refresh
          </ion-button>
        </div>

        <!-- Iqub Cards -->
        <div v-else class="iqubs-grid">
          <discover-iqub-card
            v-for="iqub in filteredIqubs"
            :key="iqub.id"
            :iqub="iqub"
            @join="handleJoinClick"
          />
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="pagination && pagination.totalPages > 1 && !isLoading && !error"
          class="pagination-container"
        >
          <div class="pagination-info">
            <span class="page-text"
              >Page {{ pagination.currentPage }} of
              {{ pagination.totalPages }}</span
            >
            <span class="items-text"
              >{{ pagination.totalItems }} Iqubs found</span
            >
          </div>

          <div class="pagination-controls">
            <ion-button
              :disabled="pagination.currentPage === 1"
              @click="goToPreviousPage"
              fill="outline"
              class="pagination-btn"
            >
              <template #icon-only>
                <ion-icon :icon="chevronBackOutline" />
              </template>
            </ion-button>

            <div class="page-numbers">
              <button
                v-for="page in getPageNumbers()"
                :key="page"
                :class="[
                  'page-number',
                  {
                    active: page === pagination.currentPage,
                    ellipsis: page === '...',
                  },
                ]"
                @click="page !== '...' && goToPage(page as number)"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
            </div>

            <ion-button
              :disabled="pagination.currentPage === pagination.totalPages"
              @click="goToNextPage"
              fill="outline"
              class="pagination-btn"
            >
              <template #icon-only>
                <ion-icon :icon="chevronForwardOutline" />
              </template>
            </ion-button>
          </div>
        </div>
      </div>

      <!-- Join Iqub Dialog -->
      <join-iqub-dialog
        :is-open="showJoinDialog"
        :iqub="selectedIqub"
        :loading="isJoining"
        @confirm="handleJoinConfirm"
        @cancel="handleJoinCancel"
        @dismiss="handleJoinCancel"
        ref="joinDialogRef"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonText,
  IonBadge,
  IonSearchbar,
  IonChip,
  IonButton,
  toastController,
} from "@ionic/vue";
import {
  menuOutline,
  notificationsOutline,
  searchOutline,
  alertCircleOutline,
  cloudOfflineOutline,
  refreshOutline,
  walletOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";
import DiscoverIqubCard from "@/components/DiscoverIqubCard.vue";
import DiscoverIqubCardSkeleton from "@/components/DiscoverIqubCardSkeleton.vue";
import JoinIqubDialog from "@/components/JoinIqubDialog.vue";

const store = useStore();
const router = useRouter();

const notificationCount = ref(3);
const searchQuery = ref("");
const selectedCategory = ref("All");
const showJoinDialog = ref(false);
const selectedIqub = ref<any>(null);
const isJoining = ref(false);
const joinDialogRef = ref<any>(null);
const currentPage = ref(1);
const itemsPerPage = ref(20);

const categories = ["All", "In-Kind", "Invest", "General"];

const availableIqubs = computed(() => store.getters["member/availableIqubs"]);
const pagination = computed(
  () => store.getters["member/availableIqubsPagination"]
);
const isLoading = computed(
  () => store.getters["member/availableIqubsStatus"] === "loading"
);
const error = computed(() => {
  const status = store.getters["member/availableIqubsStatus"];
  return status === "error" ? store.getters["member/error"] : null;
});

const isNetworkError = computed(() => {
  const errorMsg = error.value?.toLowerCase() || "";
  return (
    errorMsg.includes("network") ||
    errorMsg.includes("connection") ||
    errorMsg.includes("offline") ||
    errorMsg.includes("fetch")
  );
});

const filteredIqubs = computed(() => {
  let iqubs = availableIqubs.value || [];

  // Filter by category
  if (selectedCategory.value !== "All") {
    iqubs = iqubs.filter(
      (iqub: any) => iqub.category === selectedCategory.value
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    iqubs = iqubs.filter(
      (iqub: any) =>
        iqub.name?.toLowerCase().includes(query) ||
        iqub.description?.toLowerCase().includes(query)
    );
  }

  return iqubs;
});

const loadAvailableIqubs = async (page: number = currentPage.value) => {
  try {
    await store.dispatch("member/fetchAvailableIqubs", {
      search: searchQuery.value,
      category:
        selectedCategory.value !== "All" ? selectedCategory.value : undefined,
      page: page,
      limit: itemsPerPage.value,
    });
  } catch (err) {
    console.error("Failed to load available Iqubs:", err);
  }
};

const handleSearch = () => {
  currentPage.value = 1; // Reset to first page on search
  loadAvailableIqubs(1);
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  currentPage.value = 1; // Reset to first page on filter change
  loadAvailableIqubs(1);
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "All";
  currentPage.value = 1;
  loadAvailableIqubs(1);
};

const goToPage = (page: number) => {
  if (page < 1 || (pagination.value && page > pagination.value.totalPages)) {
    return;
  }
  currentPage.value = page;
  loadAvailableIqubs(page);

  // Scroll to top of page
  const content = document.querySelector("ion-content");
  if (content) {
    content.scrollToTop(300);
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const goToNextPage = () => {
  if (pagination.value && currentPage.value < pagination.value.totalPages) {
    goToPage(currentPage.value + 1);
  }
};

const getPageNumbers = (): (number | string)[] => {
  if (!pagination.value) return [];

  const { currentPage, totalPages } = pagination.value;
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show ellipsis for large page counts
    if (currentPage <= 3) {
      // Near start
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Middle
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};

const handleJoinClick = (iqubId: string | number) => {
  const iqub = availableIqubs.value.find((i: any) => i.id === iqubId);
  if (iqub) {
    selectedIqub.value = iqub;
    showJoinDialog.value = true;
  }
};

const handleJoinConfirm = async (iqubId: string | number) => {
  isJoining.value = true;

  try {
    const result = await store.dispatch("member/joinIqub", iqubId);

    if (result.success) {
      // Show success animation
      if (joinDialogRef.value) {
        joinDialogRef.value.showSuccessAnimation();
      }

      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Close dialog
      showJoinDialog.value = false;
      isJoining.value = false;

      // Show success toast
      const toast = await toastController.create({
        message: `Successfully joined ${selectedIqub.value?.name}!`,
        duration: 3000,
        color: "success",
        position: "top",
      });
      await toast.present();

      // Navigate to IqubBook page
      router.push("/member/my-iqubs");
    } else {
      // Show error toast
      isJoining.value = false;
      const toast = await toastController.create({
        message: result.error || "Failed to join Iqub. Please try again.",
        duration: 3000,
        color: "danger",
        position: "top",
      });
      await toast.present();
    }
  } catch (err: any) {
    isJoining.value = false;
    console.error("Error joining Iqub:", err);

    const toast = await toastController.create({
      message: err.message || "An error occurred. Please try again.",
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }
};

const handleJoinCancel = () => {
  showJoinDialog.value = false;
  selectedIqub.value = null;
};

const openMenu = () => {
  console.log("Open menu clicked");
};

const goToNotifications = () => {
  console.log("Notifications icon clicked");
};

onMounted(() => {
  loadAvailableIqubs();
});
</script>

<style scoped>
ion-content {
  --background: #f2f2f2;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #014023;
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
  font-size: var(--wujo-font-size-card);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: white;
  flex-grow: 1;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
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

.page-content {
  padding: 16px;
  background: #f2f2f2;
  min-height: 100%;
}

/* Search Section */
.search-section {
  margin-bottom: 16px;
}

.custom-searchbar {
  --background: white;
  --border-radius: 12px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --icon-color: #5fd9ac;
  --placeholder-color: #999;
  --color: #014023;
  padding: 0;
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}

.filter-section::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  --background: white;
  --color: #014023;
  font-weight: 600;
  font-size: 14px;
  height: 36px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.filter-chip.active {
  --background: #5fd9ac;
  --color: #014023;
  border-color: #5fd9ac;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  text-align: center;
  background: white;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 72px;
  color: #eb445a;
  margin-bottom: 8px;
}

.network-error .error-icon {
  color: #ffa500;
}

.error-title {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
  margin: 0;
}

.error-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  max-width: 320px;
  line-height: 1.6;
}

.retry-button {
  margin-top: 8px;
  --background: #5fd9ac;
  --color: #014023;
  --border-radius: 12px;
  height: var(--wujo-button-height);
  font-weight: 600;
}

.retry-button::part(native) {
  padding: 0 32px;
}

/* Empty State */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  text-align: center;
  background: white;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 72px;
  color: #ccc;
  margin-bottom: 8px;
}

.empty-icon.encouraging {
  color: #5fd9ac;
}

.empty-title {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
  margin: 0;
}

.empty-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  max-width: 320px;
  line-height: 1.6;
}

.empty-suggestion {
  font-size: 13px;
  color: #999;
  margin: 0;
  font-style: italic;
}

.empty-encouragement {
  font-size: 14px;
  color: #5fd9ac;
  margin: 8px 0 0 0;
  font-weight: 600;
  line-height: 1.5;
}

.clear-button {
  margin-top: 8px;
  --color: #5fd9ac;
  font-weight: 600;
}

.refresh-button {
  margin-top: 8px;
  --border-color: #5fd9ac;
  --color: #5fd9ac;
  --border-radius: 12px;
  height: var(--wujo-button-height);
  font-weight: 600;
}

/* Iqubs Grid */
.iqubs-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeIn 0.3s ease-out;
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

/* Pagination */
.pagination-container {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.3s ease-out;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.page-text {
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-semibold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
}

.items-text {
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pagination-btn {
  --border-radius: 12px;
  --border-color: #5fd9ac;
  --color: #014023;
  --padding-start: 12px;
  --padding-end: 12px;
  height: var(--wujo-button-height-sm);
  width: var(--wujo-button-height-sm);
  margin: 0;
}

.pagination-btn::part(native) {
  padding: 0;
}

.pagination-btn[disabled] {
  --border-color: #e0e0e0;
  --color: #999;
  opacity: 0.5;
}

.page-numbers {
  display: flex;
  gap: 6px;
  align-items: center;
}

.page-number {
  min-width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid transparent;
  background: #f2f2f2;
  color: #014023;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.page-number:hover:not(.active):not(.ellipsis):not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.page-number.active {
  background: #5fd9ac;
  color: #014023;
  border-color: #5fd9ac;
  font-weight: 700;
}

.page-number.ellipsis {
  background: transparent;
  cursor: default;
  border: none;
  color: #999;
}

.page-number:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Mobile responsive pagination */
@media (max-width: 480px) {
  .pagination-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .page-numbers {
    gap: 4px;
  }

  .page-number {
    min-width: 36px;
    height: 36px;
    font-size: 13px;
    padding: 0 6px;
  }

  .pagination-btn {
    height: 40px;
    width: 40px;
  }
}
</style>
