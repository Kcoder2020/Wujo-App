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
                  >{{ formatCurrency(totalIqubAmount) }} ETB</ion-text
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
                    >{{ formatCurrency(totalIqubAmount) }} ETB</ion-text
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
                      currentIqub.members_count + currentIqub.half_contributors
                    }}</ion-text
                  >
                </div>
                <div v-if="currentIqub.effective_members" class="stat-card">
                  <ion-icon
                    :icon="peopleCircleOutline"
                    class="stat-icon"
                  ></ion-icon>
                  <ion-text class="stat-card-label">Effective Members</ion-text>
                  <ion-text class="stat-card-value">
                    {{ currentIqub.effective_members }}
                  </ion-text>
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

                <div v-if="currentIqub.credit_round" class="stat-card">
                  <ion-icon :icon="layersOutline" class="stat-icon"></ion-icon>
                  <ion-text class="stat-card-label">Credit Rounds</ion-text>
                  <ion-text class="stat-card-value">
                    {{ currentIqub.completed_credit_rounds || 0 }}/{{
                      currentIqub.credit_round
                    }}
                  </ion-text>
                </div>

                <div
                  v-if="currentIqub.saving_rounds_per_credit_round"
                  class="stat-card"
                >
                  <ion-icon
                    :icon="checkmarkDoneOutline"
                    class="stat-icon"
                  ></ion-icon>
                  <ion-text class="stat-card-label">Saving Rounds</ion-text>
                  <ion-text class="stat-card-value">
                    {{ currentIqub.completed_saving_rounds || 0 }}/{{
                      totalSavingRounds
                    }}
                  </ion-text>
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

            <!-- Payments Tab -->
            <div
              v-else-if="activeTab === 'payments'"
              class="tab-panel payments-tab"
            >
              <!-- Loading State -->
              <div
                v-if="creditRoundStatusLoading"
                class="payments-loading-state"
              >
                <ion-spinner name="dots" class="loading-spinner"></ion-spinner>
                <ion-text class="loading-text"
                  >Loading payment status...</ion-text
                >
                <!-- Skeleton Cards -->
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
              </div>

              <!-- Error State -->
              <div
                v-else-if="creditRoundStatusError"
                class="payments-error-state"
              >
                <ion-icon
                  :icon="alertCircleOutline"
                  class="error-icon"
                ></ion-icon>
                <ion-text class="error-title">Failed to Load Payments</ion-text>
                <ion-text class="error-message">{{
                  creditRoundStatusError
                }}</ion-text>
                <ion-button @click="refreshPaymentStatus" class="retry-button">
                  <template #start>
                    <ion-icon :icon="refreshOutline"></ion-icon>
                  </template>
                  Retry
                </ion-button>
              </div>

              <!-- Empty State -->
              <div
                v-else-if="
                  !creditRoundStatus ||
                  !creditRoundStatus.members ||
                  creditRoundStatus.members.length === 0
                "
                class="payments-empty-state"
              >
                <ion-icon
                  :icon="documentTextOutline"
                  class="empty-icon"
                ></ion-icon>
                <ion-text class="empty-title">No Payment Data</ion-text>
                <ion-text class="empty-description"
                  >Add members to start tracking payments</ion-text
                >
                <ion-button
                  @click="activeTab = 'members'"
                  class="empty-action-button"
                >
                  <template #start>
                    <ion-icon :icon="personAddOutline"></ion-icon>
                  </template>
                  Go to Members
                </ion-button>
              </div>

              <!-- Content State -->
              <div v-else class="payments-content">
                <!-- Refresh Button -->
                <ion-button
                  fill="clear"
                  @click="refreshPaymentStatus"
                  class="refresh-button"
                  :disabled="isRefreshing"
                >
                  <ion-icon
                    :icon="
                      isRefreshing ? checkmarkCircleOutline : refreshOutline
                    "
                    :class="[
                      'refresh-icon',
                      {
                        spinning: isRefreshing,
                        'refresh-success-icon': showRefreshSuccess,
                      },
                    ]"
                  ></ion-icon>
                </ion-button>

                <!-- Premium Header Card -->
                <div class="credit-round-header">
                  <div class="header-content">
                    <div class="header-info">
                      <ion-text class="round-title">
                        Credit Round
                        {{
                          creditRoundStatus.current_credit_round
                            .credit_round_number
                        }}
                        of {{ creditRoundStatus.iqub.total_credit_rounds }}
                      </ion-text>
                      <ion-text class="round-subtitle">
                        Saving Rounds
                        {{
                          creditRoundStatus.current_credit_round
                            .saving_round_range.start
                        }}-{{
                          creditRoundStatus.current_credit_round
                            .saving_round_range.end
                        }}
                      </ion-text>
                    </div>
                    <div class="progress-container">
                      <progress-ring
                        :percentage="
                          creditRoundStatus.current_credit_round
                            .completion_percentage
                        "
                        :size="120"
                        :stroke-width="10"
                      />
                      <!-- <ion-text class="progress-percentage">
                        {{
                          creditRoundStatus.current_credit_round
                            .completion_percentage
                        }}%
                      </ion-text> -->
                      <ion-icon
                        v-if="
                          creditRoundStatus.current_credit_round.is_complete
                        "
                        :icon="checkmarkCircleOutline"
                        class="complete-icon"
                      ></ion-icon>
                    </div>
                  </div>
                </div>

                <!-- Status Legend -->
                <div class="status-legend">
                  <ion-text class="legend-title">Payment Status</ion-text>
                  <div class="legend-items">
                    <div class="legend-item">
                      <ion-icon
                        :icon="checkmarkCircleOutline"
                        class="legend-icon verified"
                      ></ion-icon>
                      <ion-text class="legend-label">Verified</ion-text>
                    </div>
                    <div class="legend-item">
                      <ion-icon
                        :icon="timeOutline"
                        class="legend-icon pending"
                      ></ion-icon>
                      <ion-text class="legend-label">Pending</ion-text>
                    </div>
                    <div class="legend-item">
                      <ion-icon
                        :icon="ellipseOutline"
                        class="legend-icon not-started"
                      ></ion-icon>
                      <ion-text class="legend-label">Not Paid</ion-text>
                    </div>
                    <div class="legend-item">
                      <ion-icon
                        :icon="closeCircleOutline"
                        class="legend-icon failed"
                      ></ion-icon>
                      <ion-text class="legend-label">Failed</ion-text>
                    </div>
                  </div>
                </div>

                <!-- Member Payment Cards -->
                <div class="member-payment-grid">
                  <div
                    v-for="(member, index) in sortedMembers"
                    :key="member.member_id"
                    class="member-payment-card"
                    :style="{ animationDelay: `${index * 100}ms` }"
                  >
                    <div class="member-header">
                      <div class="member-avatar">
                        <ion-icon
                          :icon="personOutline"
                          class="member-avatar-icon"
                        ></ion-icon>
                      </div>
                      <div class="member-info">
                        <ion-text class="member-name">{{
                          member.name
                        }}</ion-text>
                        <ion-text class="member-phone">{{
                          member.phone
                        }}</ion-text>
                      </div>
                      <div
                        class="contribution-badge"
                        :class="member.contribution_type"
                      >
                        {{
                          member.contribution_type === "full" ? "Full" : "Half"
                        }}
                      </div>
                    </div>
                    <div class="saving-rounds-row">
                      <div
                        v-for="round in member.saving_rounds"
                        :key="round.saving_round_number"
                        class="round-indicator"
                      >
                        <ion-text class="round-number"
                          >R{{ round.saving_round_number }}</ion-text
                        >
                        <ion-icon
                          :icon="getStatusIcon(round.status)"
                          :class="[
                            'round-status-icon',
                            getStatusClass(round.status),
                          ]"
                        ></ion-icon>
                      </div>
                    </div>
                    <ion-text class="completion-count">
                      {{ member.completed_count }} /
                      {{ member.required_count }} completed
                    </ion-text>
                  </div>
                </div>

                <!-- Sticky Initiate Lottery Button -->
                <div
                  v-if="
                    creditRoundStatus.current_credit_round.can_initiate_lottery
                  "
                  class="sticky-action-button"
                >
                  <ion-button
                    expand="block"
                    @click="initiateLottery"
                    :disabled="
                      !creditRoundStatus.current_credit_round
                        .can_initiate_lottery || isInitiatingLottery
                    "
                    class="initiate-lottery-button"
                  >
                    <template #start>
                      <ion-icon
                        :icon="trophyOutline"
                        class="button-icon"
                      ></ion-icon>
                    </template>
                    <span v-if="isInitiatingLottery" class="button-loading">
                      <ion-spinner name="dots"></ion-spinner>
                      Initiating...
                    </span>
                    <span v-else>Initiate Lottery</span>
                  </ion-button>
                  <div
                    v-if="
                      !creditRoundStatus.current_credit_round
                        .can_initiate_lottery
                    "
                    class="button-tooltip"
                  >
                    All payments must be verified first
                  </div>
                </div>
              </div>
            </div>

            <!-- Lottery Tab -->
            <div
              v-else-if="activeTab === 'lottery'"
              class="tab-panel lottery-tab"
            >
              <div class="lottery-content">
                <!-- Demo Mode Toggle -->
                <div class="demo-mode-toggle">
                  <ion-toggle
                    v-model="lotteryDemoMode"
                    @ionChange="handleDemoModeChange"
                  ></ion-toggle>
                  <ion-text class="demo-label"
                    >Demo Mode {{ lotteryDemoMode ? "ON" : "OFF" }}</ion-text
                  >
                </div>

                <!-- Loading State -->
                <div
                  v-if="lotteryLoading && !lotteryDemoMode"
                  class="lottery-loading-state"
                >
                  <ion-spinner
                    name="dots"
                    class="loading-spinner"
                  ></ion-spinner>
                  <ion-text class="loading-text"
                    >Loading lottery data...</ion-text
                  >
                  <!-- Skeleton Cards -->
                  <div class="skeleton-card lottery-skeleton"></div>
                  <div class="skeleton-card lottery-skeleton"></div>
                </div>

                <!-- Error State -->
                <div
                  v-else-if="lotteryError && !lotteryDemoMode"
                  class="lottery-error-state"
                >
                  <ion-icon
                    :icon="alertCircleOutline"
                    class="error-icon"
                  ></ion-icon>
                  <ion-text class="error-title"
                    >Failed to Load Lottery Data</ion-text
                  >
                  <ion-text class="error-message">{{ lotteryError }}</ion-text>
                  <ion-button @click="refreshLotteryData" class="retry-button">
                    <template #start>
                      <ion-icon :icon="refreshOutline"></ion-icon>
                    </template>
                    Retry
                  </ion-button>
                </div>

                <!-- Content State -->
                <div v-else class="lottery-cards-container">
                  <!-- Demo Mode Banner -->
                  <div v-if="lotteryDemoMode" class="demo-banner">
                    <ion-icon :icon="flashOutline" class="demo-icon"></ion-icon>
                    <span>Demo Mode - Using mock data for testing</span>
                  </div>

                  <!-- All Credit Rounds Section -->
                  <div
                    v-if="!lotteryDemoMode && allCreditRounds.length > 0"
                    class="all-credit-rounds-section"
                  >
                    <ion-text class="section-title">Credit Rounds</ion-text>
                    <div
                      v-for="creditRound in allCreditRounds"
                      :key="creditRound.credit_round_number"
                      class="credit-round-card-wrapper"
                    >
                      <CreditRoundCard
                        :credit-round="{
                          credit_round_number: creditRound.credit_round_number,
                          saving_round_range: creditRound.saving_round_range,
                          completion_percentage:
                            creditRound.completion_percentage,
                          is_complete: creditRound.is_complete,
                          can_initiate_lottery:
                            creditRound.can_initiate_lottery,
                          lottery_completed: creditRound.lottery_initiated,
                          winner: creditRound.lottery_winner
                            ? {
                                member_id: creditRound.lottery_winner.winner_id,
                                name: creditRound.lottery_winner.winner_name,
                                credit_amount:
                                  creditRound.lottery_winner.credit_amount,
                                is_pair: creditRound.lottery_winner.is_pair,
                                pair_member: creditRound.lottery_winner
                                  .pair_winner_id
                                  ? {
                                      member_id:
                                        creditRound.lottery_winner
                                          .pair_winner_id,
                                      name:
                                        creditRound.lottery_winner
                                          .pair_winner_name || '',
                                    }
                                  : undefined,
                              }
                            : undefined,
                          lottery_date:
                            creditRound.lottery_winner?.lottery_date,
                        }"
                        @initiate-lottery="openLotteryModal"
                      />
                    </div>
                  </div>

                  <!-- Demo Mode: Single Credit Round Card -->
                  <CreditRoundCard
                    v-else-if="displayCreditRoundInfo"
                    :credit-round="displayCreditRoundInfo"
                    @initiate-lottery="openLotteryModal"
                  />

                  <!-- Lottery History Section (only show in demo mode or as fallback) -->
                  <div
                    v-if="lotteryDemoMode && displayLotteryHistory.length > 0"
                    class="lottery-history-section"
                  >
                    <ion-text class="section-title">Lottery History</ion-text>
                    <div
                      v-for="record in displayLotteryHistory"
                      :key="record.id"
                      class="lottery-history-card"
                    >
                      <div class="history-header">
                        <span class="history-round"
                          >Credit Round {{ record.credit_round_number }}</span
                        >
                        <span class="history-date">{{
                          formatLotteryDate(record.initiated_at)
                        }}</span>
                      </div>
                      <div class="history-winner">
                        <ion-icon
                          :icon="trophyOutline"
                          class="trophy-icon"
                        ></ion-icon>
                        <span class="winner-name">
                          {{
                            record.is_pair
                              ? `${record.winner_name} & ${record.pair_member_name}`
                              : record.winner_name
                          }}
                        </span>
                        <span class="winner-amount"
                          >{{ formatCurrency(record.credit_amount) }} ETB</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Empty History State -->
                  <div
                    v-else-if="
                      !displayCreditRoundInfo && allCreditRounds.length === 0
                    "
                    class="lottery-empty-state"
                  >
                    <ion-icon
                      :icon="trophyOutline"
                      class="empty-icon"
                    ></ion-icon>
                    <ion-text class="empty-title">No Lottery Data</ion-text>
                    <ion-text class="empty-description">
                      Complete saving rounds to enable lottery
                    </ion-text>
                  </div>
                </div>

                <!-- Legacy: Next Lottery Date Section -->
                <div class="lottery-section legacy-section">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lottery Spin Modal - MOVED OUTSIDE of conditional rendering to prevent remounting -->
      <LotterySpinModal
        :is-open="isLotteryModalOpen"
        :iqub-id="String(iqubId)"
        :credit-round-number="selectedCreditRoundNumber"
        :demo-mode="lotteryDemoMode"
        @close="closeLotteryModal"
        @lottery-complete="handleLotteryComplete"
      />

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

            <!-- Contribution Type Selection -->
            <div class="form-field">
              <ion-label class="field-label">Contribution Type</ion-label>
              <div class="contribution-type-toggle">
                <button
                  type="button"
                  class="toggle-option"
                  :class="{ active: contributionType === 'full' }"
                  @click="contributionType = 'full'"
                >
                  Full
                </button>
                <button
                  type="button"
                  class="toggle-option"
                  :class="{ active: contributionType === 'half' }"
                  @click="contributionType = 'half'"
                >
                  Half
                </button>
              </div>
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
  IonToggle, // For demo mode toggle
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
  timeOutline,
  ellipseOutline,
  closeCircleOutline,
  alertCircleOutline,
  refreshOutline,
  layersOutline,
  checkmarkDoneOutline,
  peopleCircleOutline,
  flashOutline,
} from "ionicons/icons";

// Import CollectorTabBar and ProgressRing components
import CollectorTabBar from "@/components/CollectorTabBar.vue";
import ProgressRing from "@/components/ProgressRing.vue";
import CreditRoundCard from "@/components/CreditRoundCard.vue";
import LotterySpinModal from "@/components/LotterySpinModal.vue";
import {
  CreditRoundInfo,
  EligibleMember,
  LotteryWinner,
  LotteryRecord,
} from "@/types/lottery";
import { CreditRoundMember } from "@/types/creditRound";

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
const contributionType = ref<"full" | "half">("full"); // Default to full

// Pagination state
const currentPage = ref(1);
const membersPerPage = 10;

// Toast State
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref<"success" | "danger" | "warning">("success");

// Payments Tab State
const isRefreshing = ref(false);
const showRefreshSuccess = ref(false);
const isInitiatingLottery = ref(false);

// Lottery Tab State
const isLotteryModalOpen = ref(false);
const selectedCreditRoundNumber = ref(1); // Track which credit round is being initiated
const lotteryLoading = ref(false);
const lotteryError = ref<string | null>(null);
const lotteryDemoMode = ref(true); // Demo mode ON by default for testing

// Mock data for demo mode
const mockCreditRoundInfo: CreditRoundInfo = {
  credit_round_number: 2,
  saving_round_range: { start: 4, end: 6 },
  completion_percentage: 100,
  is_complete: true,
  can_initiate_lottery: true,
  lottery_completed: false,
  winner: undefined,
  lottery_date: undefined,
};

const mockEligibleMembers: EligibleMember[] = [
  {
    member_id: "m1",
    name: "Abebe Kebede",
    contribution_type: "full",
    has_won: false,
  },
  {
    member_id: "m2",
    name: "Sara Tesfaye",
    contribution_type: "full",
    has_won: false,
  },
  {
    member_id: "m3",
    name: "Dawit Haile",
    contribution_type: "full",
    has_won: false,
  },
  {
    member_id: "m4",
    name: "Meron Alemu",
    contribution_type: "full",
    has_won: false,
  },
  {
    member_id: "m5",
    name: "Yonas Bekele",
    contribution_type: "half",
    has_won: false,
  },
  {
    member_id: "m6",
    name: "Hana Girma",
    contribution_type: "half",
    has_won: false,
  },
  {
    member_id: "m7",
    name: "Kidist Tadesse",
    contribution_type: "half",
    has_won: false,
  },
  {
    member_id: "m8",
    name: "Solomon Desta",
    contribution_type: "half",
    has_won: false,
  },
];

const mockLotteryHistory: LotteryRecord[] = [
  {
    id: "lot1",
    iqub_id: "iqub123",
    credit_round_number: 1,
    winner_member_id: "m1",
    winner_name: "Abebe Kebede",
    credit_amount: 10000,
    is_pair: false,
    initiated_at: "2025-01-15T10:30:00Z",
  },
];

// --- Computed Properties ---
// Total Iqub Amount = credit_amount × effective_members
const totalIqubAmount = computed(() => {
  if (!currentIqub.value) return 0;
  const creditAmount =
    typeof currentIqub.value.credit_amount === "string"
      ? parseFloat(currentIqub.value.credit_amount)
      : currentIqub.value.credit_amount || 0;
  const effectiveMembers =
    currentIqub.value.effective_members || currentIqub.value.members_count || 1;
  return creditAmount * effectiveMembers;
});

// Completion Percentage = (total_collected / total_amount) × 100
const completionPercentage = computed(() => {
  if (!currentIqub.value) return 0;
  const collected =
    typeof currentIqub.value.total_collected === "string"
      ? parseFloat(currentIqub.value.total_collected)
      : currentIqub.value.total_collected || 0;
  const total = totalIqubAmount.value || 1;
  return Math.round((collected / total) * 100);
});

// Remaining Amount = total_amount - total_collected
const remainingAmount = computed(() => {
  if (!currentIqub.value) return 0;
  const total = totalIqubAmount.value;
  const collected =
    typeof currentIqub.value.total_collected === "string"
      ? parseFloat(currentIqub.value.total_collected)
      : currentIqub.value.total_collected || 0;
  return total - collected;
});

// Total Saving Rounds = saving_rounds_per_credit_round × credit_round
const totalSavingRounds = computed(() => {
  if (!currentIqub.value) return 0;
  const perCreditRound = currentIqub.value.saving_rounds_per_credit_round || 0;
  const creditRounds = currentIqub.value.credit_round || 0;
  return perCreditRound * creditRounds;
});

// Credit Round Progress = (completed_credit_rounds / credit_round) × 100
const creditRoundProgress = computed(() => {
  if (!currentIqub.value || !currentIqub.value.credit_round) return 0;
  const completed = currentIqub.value.completed_credit_rounds || 0;
  const total = currentIqub.value.credit_round;
  return Math.round((completed / total) * 100);
});

// Saving Round Progress = (completed_saving_rounds / total_saving_rounds) × 100
const savingRoundProgress = computed(() => {
  if (!currentIqub.value) return 0;
  const completed = currentIqub.value.completed_saving_rounds || 0;
  const total = totalSavingRounds.value || 1;
  return Math.round((completed / total) * 100);
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

// Payments Tab Computed Properties
const creditRoundStatus = computed(
  () => store.getters["iqubs/creditRoundStatus"]
);
const creditRoundStatusLoading = computed(
  () => store.getters["iqubs/creditRoundStatusLoading"]
);
const creditRoundStatusError = computed(
  () => store.getters["iqubs/creditRoundStatusError"]
);

const sortedMembers = computed(() => {
  if (!creditRoundStatus.value?.members) return [];
  // Sort members: incomplete first, then by name
  return [...creditRoundStatus.value.members].sort((a, b) => {
    if (a.is_complete !== b.is_complete) {
      return a.is_complete ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });
});

// Lottery Tab Computed Properties
const lotteryHistory = computed<LotteryRecord[]>(
  () => store.getters["iqubs/lotteryHistory"] || []
);

// New: Get all lottery credit rounds from the new endpoint
const lotteryCreditRounds = computed(
  () => store.getters["iqubs/lotteryCreditRounds"]
);

const currentCreditRoundInfo = computed<CreditRoundInfo | null>(() => {
  // First try to get from the new lottery credit rounds endpoint
  if (lotteryCreditRounds.value?.credit_rounds?.length > 0) {
    // Find the first credit round that can initiate lottery, or the first incomplete one
    const eligibleRound = lotteryCreditRounds.value.credit_rounds.find(
      (cr: any) => cr.can_initiate_lottery
    );
    const incompleteRound = lotteryCreditRounds.value.credit_rounds.find(
      (cr: any) => !cr.is_complete
    );
    const cr =
      eligibleRound ||
      incompleteRound ||
      lotteryCreditRounds.value.credit_rounds[0];

    return {
      credit_round_number: cr.credit_round_number,
      saving_round_range: cr.saving_round_range,
      completion_percentage: cr.completion_percentage,
      is_complete: cr.is_complete,
      can_initiate_lottery: cr.can_initiate_lottery,
      lottery_completed: cr.lottery_initiated,
      winner: cr.lottery_winner
        ? {
            member_id: cr.lottery_winner.winner_id,
            name: cr.lottery_winner.winner_name,
            credit_amount: cr.lottery_winner.credit_amount,
            is_pair: cr.lottery_winner.is_pair,
            pair_member: cr.lottery_winner.pair_winner_id
              ? {
                  member_id: cr.lottery_winner.pair_winner_id,
                  name: cr.lottery_winner.pair_winner_name || "",
                }
              : undefined,
          }
        : undefined,
      lottery_date: cr.lottery_winner?.lottery_date,
    };
  }

  // Fallback to old credit round status endpoint
  if (!creditRoundStatus.value?.current_credit_round) return null;
  const cr = creditRoundStatus.value.current_credit_round;
  return {
    credit_round_number: cr.credit_round_number,
    saving_round_range: cr.saving_round_range,
    completion_percentage: cr.completion_percentage,
    is_complete: cr.is_complete,
    can_initiate_lottery: cr.can_initiate_lottery,
    lottery_completed: false, // Will be updated from lottery history
    winner: undefined,
    lottery_date: undefined,
  };
});

// Get all credit rounds for display (new feature)
const allCreditRounds = computed(() => {
  if (!lotteryCreditRounds.value?.credit_rounds) return [];
  return lotteryCreditRounds.value.credit_rounds;
});

const currentCreditRoundNumber = computed(() => {
  if (lotteryCreditRounds.value?.credit_rounds?.length > 0) {
    const eligibleRound = lotteryCreditRounds.value.credit_rounds.find(
      (cr: any) => cr.can_initiate_lottery
    );
    if (eligibleRound) return eligibleRound.credit_round_number;
  }
  return (
    creditRoundStatus.value?.current_credit_round?.credit_round_number || 1
  );
});

const eligibleMembers = computed<EligibleMember[]>(() => {
  // First try to get from the new lottery credit rounds endpoint
  if (lotteryCreditRounds.value?.credit_rounds?.length > 0) {
    // Find the credit round matching the selected credit round number
    const selectedRound = lotteryCreditRounds.value.credit_rounds.find(
      (cr: any) => cr.credit_round_number === selectedCreditRoundNumber.value
    );
    if (selectedRound?.members) {
      return selectedRound.members
        .filter((m: any) => m.is_complete)
        .map((m: any) => ({
          member_id: m.member_id,
          name: m.name,
          contribution_type: m.contribution_type,
          has_won: false, // Will be updated from lottery history
        }));
    }
  }

  // Fallback to old credit round status endpoint
  if (!creditRoundStatus.value?.members) return [];
  return creditRoundStatus.value.members
    .filter((m: CreditRoundMember) => m.is_complete)
    .map((m: CreditRoundMember) => ({
      member_id: m.member_id,
      name: m.name,
      contribution_type: m.contribution_type,
      has_won: false, // Will be updated from lottery history
    }));
});

// Display computed properties (switch between real and mock data based on demo mode)
const displayCreditRoundInfo = computed<CreditRoundInfo | null>(() => {
  if (lotteryDemoMode.value) {
    return mockCreditRoundInfo;
  }
  return currentCreditRoundInfo.value;
});

const displayLotteryHistory = computed<LotteryRecord[]>(() => {
  if (lotteryDemoMode.value) {
    return mockLotteryHistory;
  }

  // Derive lottery history from the new credit rounds endpoint
  if (lotteryCreditRounds.value?.credit_rounds?.length > 0) {
    return lotteryCreditRounds.value.credit_rounds
      .filter((cr: any) => cr.lottery_initiated && cr.lottery_winner)
      .map((cr: any) => ({
        id: cr.lottery_winner.lottery_id,
        iqub_id: lotteryCreditRounds.value.iqub.id,
        credit_round_number: cr.credit_round_number,
        winner_member_id: cr.lottery_winner.winner_id,
        winner_name: cr.lottery_winner.winner_name,
        credit_amount: cr.lottery_winner.credit_amount,
        is_pair: cr.lottery_winner.is_pair,
        pair_member_id: cr.lottery_winner.pair_winner_id,
        pair_member_name: cr.lottery_winner.pair_winner_name,
        initiated_at: cr.lottery_winner.lottery_date,
      }));
  }

  return lotteryHistory.value;
});

const displayEligibleMembers = computed<EligibleMember[]>(() => {
  if (lotteryDemoMode.value) {
    return mockEligibleMembers;
  }
  return eligibleMembers.value;
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

// Watch for tab changes to fetch lottery data when lottery tab is selected
watch(
  () => activeTab.value,
  (newTab) => {
    // Don't refresh if lottery modal is open to prevent component remounting
    if (newTab === "lottery" && iqubId.value && !isLotteryModalOpen.value) {
      refreshLotteryData();
    }
  }
);

// Watch for tab activation to fetch credit round status
watch(
  () => activeTab.value,
  (newTab) => {
    if (newTab === "payments" && iqubId.value) {
      // Fetch credit round status when Payments tab is activated
      store.dispatch("iqubs/fetchCreditRoundStatus", iqubId.value);
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
  contributionType.value = "full"; // Reset to default
};

const closeModal = () => {
  isModalOpen.value = false;
  phoneNumber.value = "";
  memberName.value = "";
  phoneError.value = "";
  isPhoneValid.value = false;
  formattedPhonePreview.value = "";
  contributionType.value = "full"; // Reset to default
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
      contributionType: contributionType.value,
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
    const creditRoundNum =
      creditRoundStatus.value?.current_credit_round?.credit_round_number || 1;
    await store.dispatch("iqubs/initiateLottery", {
      iqubId: iqubId.value,
      creditRoundNumber: creditRoundNum,
    });

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

// --- Payments Tab Functions ---
const refreshPaymentStatus = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  showRefreshSuccess.value = false;

  try {
    await store.dispatch("iqubs/fetchCreditRoundStatus", iqubId.value);

    // Show success feedback
    showRefreshSuccess.value = true;
    setTimeout(() => {
      showRefreshSuccess.value = false;
    }, 2000);
  } catch (error: any) {
    console.error("Failed to refresh payment status:", error);
    showToastMessage("Failed to refresh payment status", "danger");
  } finally {
    isRefreshing.value = false;
  }
};

const initiateLottery = async () => {
  if (
    !creditRoundStatus.value?.current_credit_round.can_initiate_lottery ||
    isInitiatingLottery.value
  )
    return;

  isInitiatingLottery.value = true;

  try {
    await store.dispatch("iqubs/initiateLottery", {
      iqubId: iqubId.value,
      creditRoundNumber:
        creditRoundStatus.value.current_credit_round.credit_round_number,
    });

    // Show success toast
    showToastMessage("Lottery initiated successfully!", "success");

    // Navigate to lottery tab
    setTimeout(() => {
      activeTab.value = "lottery";
    }, 1000);
  } catch (error: any) {
    console.error("Failed to initiate lottery:", error);
    showToastMessage(error.message || "Failed to initiate lottery", "danger");
  } finally {
    isInitiatingLottery.value = false;
  }
};

// --- Lottery Tab Functions ---
const openLotteryModal = (creditRoundNumber?: number) => {
  // Use the passed credit round number, or fall back to the display credit round info
  selectedCreditRoundNumber.value =
    creditRoundNumber || displayCreditRoundInfo.value?.credit_round_number || 1;
  isLotteryModalOpen.value = true;
};

const closeLotteryModal = async () => {
  isLotteryModalOpen.value = false;
  // Refresh data after modal closes to get updated lottery status
  await refreshLotteryData();
  // Also refresh iqub details
  if (iqubId.value) {
    store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
  }
};

const handleLotteryComplete = async (winner: LotteryWinner) => {
  showToastMessage(
    `Congratulations to ${winner.name}! They won ${winner.credit_amount} ETB`,
    "success"
  );
  // Note: Data refresh happens in closeLotteryModal which is called after this
};

const refreshLotteryData = async () => {
  lotteryLoading.value = true;
  lotteryError.value = null;

  try {
    // Use the new lottery credit rounds endpoint that returns ALL credit rounds
    await store.dispatch("iqubs/fetchLotteryCreditRounds", iqubId.value);
  } catch (error: any) {
    console.error("Failed to refresh lottery data:", error);
    lotteryError.value = error.message || "Failed to load lottery data";
  } finally {
    lotteryLoading.value = false;
  }
};

const formatLotteryDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleDemoModeChange = () => {
  console.log("Demo mode:", lotteryDemoMode.value);
  if (!lotteryDemoMode.value) {
    // Switching to real data mode, refresh data
    refreshLotteryData();
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return checkmarkCircleOutline;
    case "pending":
      return timeOutline;
    case "not_started":
      return ellipseOutline;
    case "failed":
      return closeCircleOutline;
    default:
      return ellipseOutline;
  }
};

const getStatusClass = (status: string) => {
  return status.replace("_", "-");
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
    7: "Weekly",
    14: "Bi-weekly",
    28: "Monthly",
  };
  return patterns[numPattern] || `${numPattern} days`;
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

/* Contribution Type Toggle */
.contribution-type-toggle {
  display: flex;
  gap: 12px;
  background: var(--ion-color-white-smoke, #f2f2f2);
  padding: 4px;
  border-radius: 16px;
}

.toggle-option {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--ion-color-wujo-text-grey);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-option.active {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  color: var(--ion-color-dark-green, #014023);
  box-shadow: 0 2px 8px rgba(95, 217, 172, 0.3);
}

.toggle-option:hover:not(.active) {
  background: rgba(95, 217, 172, 0.1);
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

/* --- Payments Tab Styles --- */

/* Loading State */
.payments-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: fadeIn 0.2s ease-in;
}

.loading-spinner {
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}

/* Skeleton Cards */
.skeleton-card {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  height: 120px;
  margin-bottom: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Error State */
.payments-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.payments-error-state .error-icon {
  font-size: 64px;
  color: var(--ion-color-danger);
  margin-bottom: 16px;
}

.payments-error-state .error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
  display: block;
}

.payments-error-state .error-message {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  display: block;
}

.retry-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

/* Empty State */
.payments-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.payments-empty-state .empty-icon {
  font-size: 80px;
  color: rgba(95, 217, 172, 0.3);
  margin-bottom: 16px;
}

.payments-empty-state .empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
  display: block;
}

.payments-empty-state .empty-description {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  display: block;
}

.empty-action-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

/* Content State */
.payments-content {
  position: relative;
  padding-bottom: 100px; /* Space for sticky button */
}

/* Refresh Button */
.refresh-button {
  position: absolute;
  top: 16px;
  right: 16px;
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  --padding-start: 8px;
  --padding-end: 8px;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  transition: transform 0.1s ease;
  z-index: 10;
}

.refresh-button:active {
  transform: scale(0.95);
}

.refresh-icon {
  font-size: 24px;
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 0.5s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.refresh-success-icon {
  color: #10b981;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Premium Header Card */
.credit-round-header {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    rgba(1, 64, 35, 0.9) 100%
  );
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  margin-bottom: 16px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-info {
  flex: 1;
}

.round-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  display: block;
}

.round-subtitle {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.progress-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-percentage {
  position: absolute;
  font-size: 32px;
  font-weight: bold;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.complete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

/* Status Legend */
.status-legend {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.2s ease-in;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 12px;
  display: block;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-icon {
  font-size: 16px;
}

.legend-icon.verified {
  color: #10b981; /* Green */
}

.legend-icon.pending {
  color: #ffa500; /* Orange */
}

.legend-icon.not-started {
  color: #9ca3af; /* Gray */
}

.legend-icon.failed {
  color: #dc3545; /* Red */
}

.legend-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
}

/* Member Payment Grid */
.member-payment-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Member Payment Card */
.member-payment-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.3s ease-in;
  animation-fill-mode: both;
}

/* Staggered animation */
.member-payment-card:nth-child(1) {
  animation-delay: 0ms;
}
.member-payment-card:nth-child(2) {
  animation-delay: 100ms;
}
.member-payment-card:nth-child(3) {
  animation-delay: 200ms;
}
.member-payment-card:nth-child(4) {
  animation-delay: 300ms;
}
.member-payment-card:nth-child(5) {
  animation-delay: 400ms;
}

.member-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.member-payment-card .member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-avatar-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.member-payment-card .member-info {
  flex: 1;
  min-width: 0;
}

.member-payment-card .member-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 4px;
  display: block;
}

.member-payment-card .member-phone {
  font-size: 14px;
  color: var(--ion-color-medium);
  display: block;
}

.contribution-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.contribution-badge.full {
  background: rgba(95, 217, 172, 0.1);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.contribution-badge.half {
  background: rgba(95, 217, 172, 0.05);
  color: rgba(95, 217, 172, 0.7);
}

.saving-rounds-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.round-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background: var(--ion-color-white-smoke, #f2f2f2);
  min-width: 60px;
}

.round-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  display: block;
}

.round-status-icon {
  font-size: 20px;
}

.round-status-icon.verified {
  color: #10b981;
}

.round-status-icon.pending {
  color: #ffa500;
}

.round-status-icon.not-started {
  color: #9ca3af;
}

.round-status-icon.failed {
  color: #dc3545;
}

.completion-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  text-align: right;
  display: block;
}

/* Sticky Action Button */
.sticky-action-button {
  position: fixed;
  bottom: 80px; /* Above tab bar */
  left: 16px;
  right: 16px;
  z-index: 100;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.initiate-lottery-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green);
  --border-radius: 16px;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  transition: all 0.1s ease;
}

.initiate-lottery-button:active {
  transform: scale(0.98);
}

.initiate-lottery-button.button-disabled {
  --background: #e5e7eb;
  --color: #9ca3af;
  opacity: 0.5;
  box-shadow: none;
}

.button-icon {
  font-size: 24px;
  margin-right: 8px;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tooltip for disabled state */
.button-tooltip {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.sticky-action-button:hover .button-tooltip {
  opacity: 1;
}

/* --- Lottery Tab Styles --- */
.lottery-loading-state,
.lottery-error-state,
.lottery-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.lottery-loading-state .loading-spinner {
  --color: var(--ion-color-dark-green, #014023);
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.lottery-loading-state .loading-text {
  color: var(--ion-color-wujo-text-grey, #555);
  font-size: 16px;
}

.lottery-skeleton {
  height: 180px;
  margin-top: 16px;
  border-radius: 16px;
}

.lottery-error-state .error-icon {
  font-size: 64px;
  color: var(--ion-color-danger, #eb445a);
  margin-bottom: 16px;
}

.lottery-error-state .error-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-wujo-dark-grey, #333);
  margin-bottom: 8px;
}

.lottery-error-state .error-message {
  color: var(--ion-color-wujo-text-grey, #555);
  margin-bottom: 24px;
}

.lottery-empty-state .empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 16px;
}

.lottery-empty-state .empty-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-wujo-dark-grey, #333);
  margin-bottom: 8px;
}

.lottery-empty-state .empty-description {
  color: var(--ion-color-wujo-text-grey, #555);
}

.lottery-cards-container {
  padding: 16px;
}

.lottery-history-section {
  margin-top: 24px;
}

.lottery-history-section .section-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-wujo-dark-grey, #333);
  margin-bottom: 16px;
}

.lottery-history-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-round {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
}

.history-date {
  font-size: 12px;
  color: var(--ion-color-wujo-text-grey, #555);
}

.history-winner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-winner .trophy-icon {
  font-size: 20px;
  color: #ffd700;
}

.history-winner .winner-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey, #333);
}

.history-winner .winner-amount {
  font-size: 15px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.legacy-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--ion-color-wujo-grey, #dcdcdc);
}

/* --- Demo Mode Styles --- */
.demo-mode-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px dashed rgba(255, 193, 7, 0.5);
}

.demo-mode-toggle ion-toggle {
  --background: rgba(0, 0, 0, 0.1);
  --background-checked: var(--ion-color-warning, #ffc107);
  --handle-background: white;
  --handle-background-checked: white;
}

.demo-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-warning-shade, #e0a800);
}

.demo-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.15) 0%,
    rgba(255, 152, 0, 0.15) 100%
  );
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.demo-banner .demo-icon {
  font-size: 20px;
  color: var(--ion-color-warning, #ffc107);
}

.demo-banner span {
  font-size: 13px;
  font-weight: 500;
  color: var(--ion-color-warning-shade, #e0a800);
}

/* --- All Credit Rounds Section (Lottery Tab) --- */
.all-credit-rounds-section {
  margin-bottom: 24px;
}

.all-credit-rounds-section .section-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-wujo-dark-grey, #333);
  margin-bottom: 16px;
}

.credit-round-card-wrapper {
  margin-bottom: 16px;
}

.credit-round-card-wrapper:last-child {
  margin-bottom: 0;
}
</style>
