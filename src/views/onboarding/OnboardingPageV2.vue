<template>
  <ion-page class="onboarding-page">
    <ion-content :fullscreen="true" :scroll-y="false">
      <!-- Background with floating particles -->
      <div class="background-container">
        <div class="gradient-bg"></div>
        <div class="floating-particles">
          <div
            v-for="i in 12"
            :key="i"
            class="particle"
            :style="getParticleStyle(i)"
          ></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="onboarding-content">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo-glow"></div>
          <div class="logo-container">
            <img :src="wujoLogo" alt="Wujo Logo" class="logo-icon" />
          </div>
        </div>

        <!-- Slides Container -->
        <div class="slides-wrapper">
          <transition :name="slideDirection" mode="out-in">
            <div :key="currentSlide" class="slide">
              <!-- Slide 1: Welcome -->
              <div v-if="currentSlide === 0" class="slide-content">
                <div class="illustration welcome-illustration">
                  <WelcomeIllustration />
                </div>
                <h2 class="slide-title">Welcome to Wujo</h2>
                <p class="slide-description">
                  Ethiopia's trusted digital savings platform. Join thousands
                  building wealth together through traditional Iqub, modernized.
                </p>
              </div>

              <!-- Slide 2: Save Together -->
              <div v-else-if="currentSlide === 1" class="slide-content">
                <div class="illustration savings-illustration">
                  <SavingsIllustration />
                </div>
                <h2 class="slide-title">Save Together</h2>
                <p class="slide-description">
                  Pool your savings with trusted community members. Watch your
                  contributions grow through the power of collective saving.
                </p>
              </div>

              <!-- Slide 3: Track Progress -->
              <div v-else-if="currentSlide === 2" class="slide-content">
                <div class="illustration progress-illustration">
                  <ProgressIllustration />
                </div>
                <h2 class="slide-title">Track Your Progress</h2>
                <p class="slide-description">
                  Real-time insights into your savings journey. See your
                  contributions, upcoming rounds, and lottery status at a
                  glance.
                </p>
              </div>

              <!-- Slide 4: Get Credit -->
              <div v-else class="slide-content">
                <div class="illustration credit-illustration">
                  <CreditIllustration />
                </div>
                <h2 class="slide-title">Access Your Credit</h2>
                <p class="slide-description">
                  Win the lottery and receive your lump sum credit. Use it for
                  business, education, or achieving your dreams.
                </p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Progress Indicators -->
        <div class="progress-indicators">
          <div
            v-for="(_, index) in slides"
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            v-if="currentSlide < slides.length - 1"
            class="btn-secondary"
            @click="skip"
          >
            Skip
          </button>
          <button
            v-if="currentSlide < slides.length - 1"
            class="btn-primary"
            @click="next"
          >
            Next
            <ion-icon :icon="arrowForward" class="btn-icon"></ion-icon>
          </button>
          <button v-else class="btn-primary btn-full" @click="getStarted">
            Get Started
            <ion-icon :icon="sparkles" class="btn-icon"></ion-icon>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonPage, IonContent, IonIcon, useIonRouter } from "@ionic/vue";
import { arrowForward, sparkles } from "ionicons/icons";

// Import logo
import wujoLogo from "@/assets/img/icon2.svg";

// Import illustration components
import WelcomeIllustration from "@/components/onboarding/WelcomeIllustration.vue";
import SavingsIllustration from "@/components/onboarding/SavingsIllustration.vue";
import ProgressIllustration from "@/components/onboarding/ProgressIllustration.vue";
import CreditIllustration from "@/components/onboarding/CreditIllustration.vue";

const ionRouter = useIonRouter();

const currentSlide = ref(0);
const slideDirection = ref("slide-left");

const slides = [
  { id: 0, title: "Welcome" },
  { id: 1, title: "Save" },
  { id: 2, title: "Track" },
  { id: 3, title: "Credit" },
];

// Generate random particle styles
const getParticleStyle = (index: number) => {
  const sizes = [4, 6, 8, 5, 7, 4, 6, 8, 5, 7, 4, 6];
  const delays = [0, 2, 4, 1, 3, 5, 0.5, 2.5, 4.5, 1.5, 3.5, 5.5];
  const durations = [15, 20, 18, 22, 16, 19, 21, 17, 23, 14, 20, 18];
  const lefts = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 90];

  return {
    width: `${sizes[index - 1]}px`,
    height: `${sizes[index - 1]}px`,
    left: `${lefts[index - 1]}%`,
    animationDelay: `${delays[index - 1]}s`,
    animationDuration: `${durations[index - 1]}s`,
  };
};

const next = () => {
  if (currentSlide.value < slides.length - 1) {
    slideDirection.value = "slide-left";
    currentSlide.value++;
  }
};

const goToSlide = (index: number) => {
  slideDirection.value =
    index > currentSlide.value ? "slide-left" : "slide-right";
  currentSlide.value = index;
};

const skip = () => {
  ionRouter.push("/signup");
};

const getStarted = () => {
  ionRouter.push("/signup");
};
</script>

<style scoped>
/* ===== Base Styles ===== */
.onboarding-page {
  --background: transparent;
}

ion-content {
  --background: transparent;
}

/* ===== Background ===== */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #014023 0%, #012d19 40%, #011a0f 100%);
}

/* ===== Floating Particles ===== */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -20px;
  background: radial-gradient(
    circle,
    rgba(95, 217, 172, 0.6) 0%,
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
    opacity: 0.8;
    transform: translateY(-10vh) scale(1);
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-110vh) scale(0.5);
    opacity: 0;
  }
}

/* ===== Main Content ===== */
.onboarding-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 24px;
  padding-top: calc(40px + var(--ion-safe-area-top, 0px));
  padding-bottom: calc(32px + var(--ion-safe-area-bottom, 0px));
}

/* ===== Logo Section ===== */
.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
}

.logo-glow {
  position: absolute;
  width: 100px;
  height: 100px;
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
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.logo-container {
  width: 60px;
  height: 60px;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 100%;
  height: 100%;
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ===== Slides ===== */
.slides-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide {
  width: 100%;
}

.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.illustration {
  width: 100%;
  max-width: 280px;
  height: 240px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slide-description {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  max-width: 320px;
}

/* ===== Slide Transitions ===== */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

/* ===== Progress Indicators ===== */
.progress-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 32px 0;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 32px;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  box-shadow: 0 0 12px rgba(95, 217, 172, 0.5);
}

.indicator:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
}

/* ===== Action Buttons ===== */
.action-buttons {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  height: 56px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  color: var(--ion-color-dark-green, #014023);
  box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.25);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.btn-secondary:active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.98);
}

.btn-full {
  flex: none;
  width: 100%;
}

.btn-icon {
  font-size: 20px;
}

/* ===== Responsive ===== */
@media (max-height: 667px) {
  .logo-section {
    margin-bottom: 16px;
  }

  .illustration {
    height: 180px;
    margin-bottom: 24px;
  }

  .slide-title {
    font-size: 24px;
  }

  .slide-description {
    font-size: 14px;
  }

  .progress-indicators {
    margin: 24px 0;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .logo-glow,
  .logo-icon {
    animation: none;
  }

  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: opacity 0.2s ease;
  }

  .slide-left-enter-from,
  .slide-left-leave-to,
  .slide-right-enter-from,
  .slide-right-leave-to {
    transform: none;
  }
}
</style>
