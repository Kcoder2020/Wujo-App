<template>
  <ion-page>
    <ion-content>
      <swiper
        ref="swiperRef"
        :pagination="{ clickable: true }"
        :modules="modules"
        @slideChange="onSlideChange"
      >
        <swiper-slide>
          <img :src="welcomeBanner" alt="Welcome to Wujo!" />
          <ion-text><h2>Welcome to Wujo</h2></ion-text>
          <ion-text><p>Your financial goals, our shared journey.</p></ion-text>
        </swiper-slide>
        <swiper-slide>
          <img :src="saveMoneyPiggy" alt="Save Money Together" />
          <ion-text><h2>Save Money Together</h2></ion-text>
          <ion-text
            ><p>Achieve your targets with collaborative savings.</p></ion-text
          >
        </swiper-slide>
        <swiper-slide>
          <img :src="roscaProductsCreditCard" alt="RoSCA Products" />
          <ion-text><h2>RoSCA Products</h2></ion-text>
          <ion-text
            ><p>Explore innovative and rewarding financial tools.</p></ion-text
          >
        </swiper-slide>
        <swiper-slide>
          <img :src="discoverWujoAfterCredit" alt="Discover Wujo" />
          <ion-text><h2>Discover Wujo</h2></ion-text>
          <ion-text
            ><p>Unlock a new way to manage and grow your finances.</p></ion-text
          >
        </swiper-slide>
      </swiper>

      <div class="buttons">
        <ion-button v-if="!isLastSlide" fill="clear" @click="skip"
          >Skip</ion-button
        >
        <ion-button v-if="!isLastSlide" @click="next">Next</ion-button>
        <ion-button v-else @click="getStarted">Get Started</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonContent, IonButton, IonText } from "@ionic/vue";
import { Swiper } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import type { Swiper as SwiperType } from "swiper";
import { SwiperSlide } from "swiper/vue";
import { computed } from "vue";
import welcomeBanner from "@/assets/img/welcome_banner.png";
import saveMoneyPiggy from "@/assets/img/save_money_piggy.png";
import roscaProductsCreditCard from "@/assets/img/rosca_products_credit_card.png";
import discoverWujoAfterCredit from "@/assets/img/discover_wujo_after_credit.png";

const router = useRouter();
const swiperRef = ref<SwiperType>();
const isLastSlide = ref(false);

const modules = [Pagination];

const next = () => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideNext();
  }
};

const skip = () => {
  router.push("/signup");
};

const getStarted = () => {
  router.push("/signup");
};

const onSlideChange = (swiper: any) => {
  isLastSlide.value = swiper.activeIndex === 3; // Assuming 4 slides
};
</script>

<style scoped>
ion-content {
  --background: var(--ion-color-light);
}

swiper-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  font-size: 1.2em;
}

img {
  max-width: 80%;
  height: auto;
  margin-bottom: 20px;
}

.buttons {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
}

.buttons ion-button {
  width: auto;
}
</style>
