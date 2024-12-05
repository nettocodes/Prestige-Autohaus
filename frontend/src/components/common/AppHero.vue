<template>
  <section class="hero-carousel">
      <Splide :options="splideOptions" @move="onMoved">
          <SplideSlide
              v-for="(slide, index) in slides"
              :key="index"
              :class="{
                  'active-slide': activeSlideIndex === index,
                  [`slide-${index}`]: true,
              }"
          >
              <div
                  class="hero-item"
                  :style="{ backgroundImage: `url(${slide.image})` }"
              >
                  <div class="overlay"></div>
                  <div class="content">
                      <h1>{{ slide.title }}</h1>
                      <p>{{ slide.subtitle }}</p>
                      <div class="cta-buttons">
                          <router-link
                              :to="slide.primaryLink"
                              class="btn btn-primary"
                          >
                              Explore
                          </router-link>
                      </div>
                  </div>
              </div>
          </SplideSlide>
      </Splide>
  </section>
</template>

<script>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@/assets/AppHero.css";

export default {
  name: "AppHero",
  components: {
      Splide,
      SplideSlide,
  },
  data() {
      return {
          slides: [
              {
                  image: require("@/assets/images/backgrounds/lambo.jpg"),
                  title: "Unlock the Potential",
                  subtitle: "Business from your website",
                  primaryLink: "/add",
              },
              {
                  image: require("@/assets/images/backgrounds/bmw.jpg"),
                  title: "Reality is Just Perception",
                  subtitle: "See the world differently.",
                  primaryLink: "/favorites",
              },
              {
                  image: require("@/assets/images/backgrounds/porsche.jpg"),
                  title: "Move Your Inventory Faster",
                  subtitle: "Invest in the future of your business.",
                  primaryLink: "/add",
              },
          ],
          splideOptions: {
              type: "loop",
              autoplay: true,
              interval: 5000,
              pauseOnHover: false,
              arrows: true,
              pagination: true,
          },
          activeSlideIndex: 0, // Slide ativo inicial
      };
  },
  methods: {
      onMoved(newIndex) {
          this.activeSlideIndex = newIndex;
      },
  },
};
</script>
