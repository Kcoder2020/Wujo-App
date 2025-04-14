<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img
            src="../assets/img/wujo-logo.png"
            alt="Wujo Logo"
            class="logo-image"
          />
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <swiper
        :spaceBetween="30"
        :pagination="{ clickable: true }"
        :modules="modules"
        class="mySwiper"
        @swiper="onSwiper"
      >
        <swiper-slide>
          <img
            src="../assets/img/welcome_banner.png"
            alt="Welcome to Wujo"
            class="slide-image"
          />
          <h2>Welcome to Wujo</h2>
          <p>
            An alternate financing app along with a multi-service ecommerce
            platform.
          </p>
        </swiper-slide>
        <swiper-slide>
          <img
            src="../assets/img/save_money_piggy.png"
            alt="Save Money"
            class="slide-image"
          />
          <h2>Save money</h2>
          <p>
            The first step is to create your Wujo account and upload your
            documents to get registered on our database.
          </p>
        </swiper-slide>
        <swiper-slide>
          <img
            src="../assets/img/rosca_products_credit_card.png"
            alt="Access Diverse RoSCA Products"
            class="slide-image"
          />
          <h2>Access Diverse RoSCA Products</h2>
          <p>
            Transform your savings into opportunities. Explore our comprehensive
            suite of RoSCA solutions designed for seamless Trade and investment
            through RoSCAs.
          </p>
        </swiper-slide>
        <swiper-slide>
          <img
            src="../assets/img/discover_wujo_after_credit.png"
            alt="Discover WUJO after getting your credit"
            class="slide-image"
          />
          <h2>Discover WUJO after getting your credit</h2>
          <p>
            An alternate financing app along with a multi-service ecommerce
            platform.
          </p>
        </swiper-slide>
      </swiper>

      <div class="navigation" v-if="!isLastSlide">
        <ion-button fill="clear" @click="skipOnboarding">Skip</ion-button>
        <ion-button @click="nextSlide">Next</ion-button>
      </div>

      <ion-button
        v-if="isLastSlide"
        expand="block"
        @click="getStarted"
        class="get-started-button"
        >Get Started</ion-button
      >
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { ref, computed } from "vue"; // Import ref and computed
import {
  Pagination,
  Navigation,
  Scrollbar,
  A11y,
  Swiper as SwiperType,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const router = useRouter();
const modules = [Pagination, Navigation, Scrollbar, A11y];
const swiperRef = ref<SwiperType | null>(null);

const skipOnboarding = () => {
  // Navigate to the sign-up page
  router.push("/signup"); // Replace '/signup' with your actual route for the sign-up page
};

const nextSlide = () => {
  // Programmatically advance to the next slide
  swiperRef.value?.slideNext();
};

const getStarted = () => {
  // Navigate to the home or main app page
  router.push("/home"); // Replace '/home' with your actual route
};

const onSwiper = (swiper: SwiperType) => {
  swiperRef.value = swiper;
};

const isLastSlide = computed(() => {
  if (swiperRef.value) {
    return swiperRef.value.isEnd;
  }
  return false;
});
</script>

<style scoped>
ion-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.slide-image {
  max-width: 80%;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #666;
}

.navigation {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.logo-image {
  max-height: 40px;
  /* Adjust the height as needed */
}

/* Style for the "Get Started" button on the last slide */
.get-started-button {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 80%;
  /* Adjust width as needed */
}
</style>
