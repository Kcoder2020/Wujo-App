<template>
  <div class="discover-iqub-card-skeleton">
    <div class="skeleton-header">
      <div class="skeleton-title shimmer"></div>
      <div class="skeleton-badge shimmer"></div>
    </div>

    <div class="skeleton-body">
      <div class="skeleton-description shimmer"></div>
      <div class="skeleton-description-short shimmer"></div>

      <div class="skeleton-info-grid">
        <div class="skeleton-info-item">
          <div class="skeleton-icon shimmer"></div>
          <div class="skeleton-text shimmer"></div>
        </div>
        <div class="skeleton-info-item">
          <div class="skeleton-icon shimmer"></div>
          <div class="skeleton-text shimmer"></div>
        </div>
        <div class="skeleton-info-item">
          <div class="skeleton-icon shimmer"></div>
          <div class="skeleton-text shimmer"></div>
        </div>
        <div class="skeleton-info-item">
          <div class="skeleton-icon shimmer"></div>
          <div class="skeleton-text shimmer"></div>
        </div>
      </div>

      <div class="skeleton-collector">
        <div class="skeleton-avatar shimmer"></div>
        <div class="skeleton-collector-info">
          <div class="skeleton-collector-name shimmer"></div>
          <div class="skeleton-rating shimmer"></div>
        </div>
      </div>
    </div>

    <div class="skeleton-footer">
      <div class="skeleton-button shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton loader
</script>

<style scoped>
.discover-iqub-card-skeleton {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-title {
  width: 60%;
  height: 24px;
  border-radius: 8px;
}

.skeleton-badge {
  width: 80px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-body {
  margin-bottom: 16px;
}

.skeleton-description {
  width: 100%;
  height: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.skeleton-description-short {
  width: 70%;
  height: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.skeleton-text {
  flex: 1;
  height: 16px;
  border-radius: 8px;
}

.skeleton-collector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-collector-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-collector-name {
  width: 120px;
  height: 16px;
  border-radius: 8px;
}

.skeleton-rating {
  width: 80px;
  height: 14px;
  border-radius: 8px;
}

.skeleton-footer {
  display: flex;
  justify-content: center;
}

.skeleton-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
}

/* Shimmer animation */
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
