<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Logo at the top -->
      <div class="logo-container">
        <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
      </div>

      <!-- Swiper for slides -->
      <!-- Swiper content will be centered vertically within the available space -->
      <swiper
        ref="swiperRef"
        :pagination="{ clickable: true }"
        :modules="modules"
        @slideChange="onSlideChange"
        @swiper="onSwiperInitialized"
      >
        <swiper-slide>
          <!-- Illustration adjusted size and centered -->
          <div class="slide-content">
            <img
              :src="welcomeBanner"
              alt="Welcome to Wujo!"
              class="slide-image"
            />
            <!-- Text with updated styling and spacing -->
            <ion-text class="slide-title"><h2>Welcome to wujo</h2></ion-text>
            <ion-text class="slide-description"
              ><p>
                An alternate financing app along with a multi-service ecommerce
                platform
              </p></ion-text
            >
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-content">
            <img
              :src="saveMoneyPiggy"
              alt="Save Money Together"
              class="slide-image"
            />
            <ion-text class="slide-title"><h2>Save money</h2></ion-text>
            <ion-text class="slide-description"
              ><p>
                The first step is to create your Wujo account and upload your
                documents to get registered on our database
              </p></ion-text
            >
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-content">
            <img
              :src="roscaProductsCreditCard"
              alt="RoSCA Products"
              class="slide-image"
            />
            <ion-text class="slide-title"
              ><h2>Access Diverse RoSCA Products</h2></ion-text
            >
            <ion-text class="slide-description"
              ><p>
                Explore our comprehensive suite of RoSCA solutions designed for
                seamless Trade and investment through RoSCAs, Transform your
                savings into opportunities
              </p></ion-text
            >
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-content">
            <img
              :src="discoverWujoAfterCredit"
              alt="Discover Wujo"
              class="slide-image"
            />
            <ion-text class="slide-title"
              ><h2>Discover WUJO after getting your credit</h2></ion-text
            >
            <ion-text class="slide-description"
              ><p>
                An alternate financing app along with a multi-service ecommerce
                platform
              </p></ion-text
            >
          </div>
        </swiper-slide>
      </swiper>

      <!-- Fixed bottom buttons container -->
      <div
        class="onboarding-buttons-container"
        :class="{ 'centered-single-button': isLastSlide }"
      >
        <ion-button
          v-if="!isLastSlide"
          fill="clear"
          class="secondary-btn"
          @click="skip"
          >Skip</ion-button
        >
        <ion-button v-if="!isLastSlide" class="primary-btn" @click="next"
          >Next</ion-button
        >
        <ion-button v-else class="primary-btn" @click="getStarted"
          >Get Started</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  useIonRouter,
} from "@ionic/vue";
import { Swiper } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Import the actual Swiper core type for better type hinting
import type SwiperCore from "swiper"; // Use this type
import type { Swiper as SwiperType } from "swiper";
import { SwiperSlide } from "swiper/vue";
import { computed } from "vue";

// Import images - make sure these paths are correct
import wujoLogo from "@/assets/img/wujo-logo.png"; // Assuming this is the correct logo file
import welcomeBanner from "@/assets/img/welcome_banner.png";
import saveMoneyPiggy from "@/assets/img/save_money_piggy.png";
import roscaProductsCreditCard from "@/assets/img/rosca_products_credit_card.png";
import discoverWujoAfterCredit from "@/assets/img/discover_wujo_after_credit.png";

const router = useRouter();
const ionRouter = useIonRouter(); // 2. Get the IonRouter instance

const swiperRef = ref<SwiperType>();
const isLastSlide = ref(false);
// Use a new ref to store the *core Swiper instance*
const swiperInstance = ref<SwiperCore | null>(null);

// Method to store the Swiper instance when it's ready
const onSwiperInitialized = (swiper: SwiperCore) => {
  swiperInstance.value = swiper;
  // You can also check the initial slide state here if needed
  isLastSlide.value = swiper.activeIndex === 3;
};

// Swiper has 4 slides in the design, index 3 is the last one
const onSlideChange = (swiper: any) => {
  isLastSlide.value = swiper.activeIndex === 3;
};

const modules = [Pagination];

const next = () => {
  if (swiperInstance.value) {
    // Check if the instance is stored
    swiperInstance.value.slideNext();
  }
};

const skip = () => {
  // Navigate to signup page
  // router.push("/signup"); // Or maybe '/login' or a home page? Adjust as needed.
  ionRouter.push("/notifications", "forward", "none");
};

const getStarted = () => {
  // Navigate to signup page
  // router.push("/signup"); // Adjust to the correct first page after onboarding.
  ionRouter.push("/signup", "forward", "none");
};
</script>

<style scoped>
/* Define CSS variables for consistent colors */
:root {
  /* Wujo Brand Primary Color */
  --ion-color-wujo-primary: #014023;
  --ion-color-wujo-primary-rgb: 1, 64, 35;
  /* Wujo White Smoke Background */
  --ion-color-wujo-light-grey: #f2f2f2;
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  /* Remove top/bottom padding from ion-content itself */
  --padding-top: 0;
  --padding-bottom: 0;
  /* Ensure ion-content is a flex container for its direct children */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Space out logo, swiper, and buttons */
}

/* Styling for the logo container */
.logo-container {
  display: flex;
  justify-content: center;
  padding-top: 60px; /* Space above logo */
  margin-bottom: 60px; /* Space between logo and swiper */
}

.wujo-logo {
  width: 120px; /* Adjust size as needed */
  height: auto;
}

/* Swiper container styling */
/* Flex child settings for Swiper to take remaining vertical space */
swiper {
  flex-grow: 1; /* Allow swiper to fill space between logo and buttons */
  display: flex; /* Make swiper a flex container to help center slides */
  flex-direction: column; /* Swiper's internal structure might need this */
  justify-content: center; /* Vertically center the slide content if swiper is taller */
}

/* Swiper slide styling */
swiper-slide {
  /* Keep flex properties to center content horizontally */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Vertically center content within the slide */
  text-align: center;
  padding: 0 20px; /* Add horizontal padding */
  height: auto !important; /* Let swiper determine slide height */
  /* Remove specific bottom padding here, controlled by .slide-content margin/padding */
}

/* Inner container for slide content (image + text) to manage spacing */
.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Add padding-bottom here to create space between content and pagination */
  padding-bottom: 80px; /* Space below text before pagination */
}

.slide-image {
  width: 100%;
  /* Reduced max-width significantly */
  max-width: 250px; /* Visual estimation from design */
  height: auto;
  object-fit: contain;
  /* Explicit margin bottom for space after image */
  margin-bottom: 30px;
  /* Optional: add max-height if images are still too large */
  max-height: 30vh; /* Example: limit height to 30% of viewport height */
}

.slide-title h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0; /* Remove default margin */
  margin-bottom: 10px; /* Space between title and description */
  color: var(--ion-color-wujo-primary); /* Apply green color */
  text-align: center;
}

.slide-description p {
  font-size: 16px;
  color: #555; /* Existing grey color seems fine */
  margin: 0;
  padding: 0 20px; /* Add horizontal padding to description */
  line-height: 1.4; /* Improve readability */
  margin-top: 10px; /* Space between title and description */
  text-align: center;
}

/* Swiper Pagination Styling */
/* Target the pagination dots container */
swiper :deep(.swiper-pagination) {
  /* Adjust vertical position to be below the slide content */
  bottom: 40px !important; /* Position from the bottom of the swiper container */
  text-align: center; /* Ensure dots are centered */
}

swiper :deep(.swiper-pagination-bullet) {
  /* Change inactive dot color */
  background: #ccc; /* A lighter grey for inactive */
  opacity: 1; /* Ensure inactive dots are clearly visible */
  width: 8px; /* Adjust size if needed */
  height: 8px; /* Adjust size if needed */
  margin: 0 5px; /* Adjust spacing between dots */
}

swiper :deep(.swiper-pagination-bullet-active) {
  /* Change active dot color to green */
  --background: var(
    --ion-color-wujo-primary
  ); /* Apply green color, !important might be needed */
}

/* Button Container Styling */
.onboarding-buttons-container {
  /* Position fixed to the viewport bottom */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px; /* Padding around the buttons */
  background: var(--ion-color-wujo-light-grey); /* Match background */
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  z-index: 10; /* Ensure buttons are above other content */
}

.onboarding-buttons-container.centered-single-button {
  justify-content: center; /* Center items horizontally when this class is present */
}

/* Button Styling - Apply green accent */
.primary-btn {
  flex: 1;
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(
    --ion-color-wujo-primary
  ); /* Green background on tap */
  --border-radius: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  height: 50px;
  /* Match design width distribution */
  max-width: 50%; /* Let buttons take up to half the container width */
}

.secondary-btn {
  flex: 1;
  --border-radius: 12px;
  font-weight: bold;
  --color: var(--ion-color-wujo-primary); /* Green text color */
  text-transform: capitalize;
  height: 50px;
  /* Match design width distribution */
  max-width: 50%; /* Let buttons take up to half the container width */
}
</style>
