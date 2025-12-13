<template>
  <div class="discover-iqub-card">
    <div class="card-header">
      <h3 class="iqub-name">{{ iqub.name }}</h3>
      <span class="category-badge">{{ category }}</span>
    </div>

    <p class="iqub-description">{{ description }}</p>

    <div class="card-body">
      <div class="info-grid">
        <div class="info-item">
          <ion-icon :icon="cashOutline" />
          <div class="info-content">
            <span class="info-label">Total Amount</span>
            <span class="info-value">{{ formatCurrency(totalAmount) }}</span>
          </div>
        </div>

        <div class="info-item">
          <ion-icon :icon="walletOutline" />
          <div class="info-content">
            <span class="info-label">Per Round</span>
            <span class="info-value">{{ formatCurrency(savingAmount) }}</span>
          </div>
        </div>

        <div class="info-item">
          <ion-icon :icon="timeOutline" />
          <div class="info-content">
            <span class="info-label">Duration</span>
            <span class="info-value">{{ duration }} months</span>
          </div>
        </div>

        <div class="info-item">
          <ion-icon :icon="peopleOutline" />
          <div class="info-content">
            <span class="info-label">Members</span>
            <span class="info-value">{{ membersCount }}/{{ totalSpots }}</span>
          </div>
        </div>
      </div>

      <div class="spots-indicator">
        <div class="spots-bar">
          <div
            class="spots-filled"
            :style="{ width: spotsPercentage + '%' }"
          ></div>
        </div>
        <span class="spots-text">{{ spotsAvailable }} spots available</span>
      </div>

      <div class="collector-info">
        <ion-icon :icon="personCircleOutline" />
        <div class="collector-details">
          <span class="collector-name">{{ collectorName }}</span>
          <div class="collector-rating">
            <ion-icon
              v-for="star in 5"
              :key="star"
              :icon="star <= collectorRating ? starIcon : starOutlineIcon"
              :class="{ filled: star <= collectorRating }"
            />
            <span class="rating-value">({{ collectorRating.toFixed(1) }})</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <ion-button expand="block" class="join-button" @click="handleJoinClick">
        <template #start>
          <ion-icon :icon="addCircleOutline" />
        </template>
        Join Iqub
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonIcon, IonButton } from "@ionic/vue";
import {
  cashOutline,
  walletOutline,
  timeOutline,
  peopleOutline,
  personCircleOutline,
  addCircleOutline,
  star,
  starOutline,
} from "ionicons/icons";
import type { Iqub } from "@/types";

interface Props {
  iqub: Iqub & {
    description?: string;
    duration?: number;
    spotsAvailable?: number;
    totalSpots?: number;
    collectorName?: string;
    collectorRating?: number;
    category?: string;
    startDate?: string;
  };
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
// eslint-disable-next-line no-undef
const emit = defineEmits<{
  join: [iqubId: number | string];
}>();

const starIcon = star;
const starOutlineIcon = starOutline;

const description = computed(() => {
  return (
    props.iqub.description || "Join this Iqub to start your savings journey"
  );
});

const category = computed(() => {
  return props.iqub.category || "General";
});

const savingAmount = computed(() => {
  return typeof props.iqub.saving_amount === "string"
    ? parseFloat(props.iqub.saving_amount)
    : props.iqub.saving_amount;
});

const totalAmount = computed(() => {
  const members = props.iqub.totalSpots || props.iqub.members_count || 1;
  return savingAmount.value * members;
});

const duration = computed(() => {
  return props.iqub.duration || props.iqub.members_count || 12;
});

const membersCount = computed(() => {
  return props.iqub.current_members || props.iqub.joined_members || 0;
});

const totalSpots = computed(() => {
  return props.iqub.totalSpots || props.iqub.members_count || 10;
});

const spotsAvailable = computed(() => {
  return totalSpots.value - membersCount.value;
});

const spotsPercentage = computed(() => {
  if (totalSpots.value === 0) return 0;
  return (membersCount.value / totalSpots.value) * 100;
});

const collectorName = computed(() => {
  return props.iqub.collectorName || "Collector";
});

const collectorRating = computed(() => {
  return props.iqub.collectorRating || 4.5;
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const handleJoinClick = () => {
  emit("join", props.iqub.id);
};
</script>

<style scoped>
.discover-iqub-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin: 12px 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.discover-iqub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.iqub-name {
  font-size: 18px;
  font-weight: 700;
  color: #014023;
  margin: 0;
  flex: 1;
}

.category-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(95, 217, 172, 0.2);
  color: #014023;
}

.iqub-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-body {
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-item > ion-icon {
  font-size: 20px;
  color: #5fd9ac;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #014023;
  font-weight: 600;
}

.spots-indicator {
  margin-bottom: 16px;
}

.spots-bar {
  height: 6px;
  background: rgba(1, 64, 35, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.spots-filled {
  height: 100%;
  background: #5fd9ac;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.spots-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.collector-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(1, 64, 35, 0.05);
  border-radius: 12px;
}

.collector-info > ion-icon {
  font-size: 32px;
  color: #014023;
}

.collector-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.collector-name {
  font-size: 14px;
  color: #014023;
  font-weight: 600;
}

.collector-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.collector-rating ion-icon {
  font-size: 14px;
  color: #ddd;
}

.collector-rating ion-icon.filled {
  color: #ffb800;
}

.rating-value {
  font-size: 12px;
  color: #666;
  margin-left: 4px;
}

.card-footer {
  margin-top: 16px;
}

.join-button {
  --background: #5fd9ac;
  --color: #014023;
  --border-radius: 12px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  font-weight: 600;
  height: 48px;
  font-size: 16px;
}

.join-button:hover {
  --background: #4ec89b;
}

.join-button ion-icon {
  font-size: 20px;
}
</style>
