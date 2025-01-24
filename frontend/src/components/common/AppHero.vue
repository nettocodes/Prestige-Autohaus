<template>
  <link rel="preload" as="image" href="/assets/images/backgrounds/BMW-M3.webp" type="image/webp" />

  <section class="hero">
    <div class="hero-container">
      <!-- Conteúdo de texto -->
      <div class="hero-content">
        <h1 class="hero-title" data-aos="fade-right">{{ slide.title }}</h1>
        <p class="hero-subtitle" data-aos="fade-right" data-aos-delay="200">{{ slide.subtitle }}</p>
        <div class="cta-buttons" data-aos="fade-up" data-aos-delay="400">
          <button @click="redirectToCars" class="btn-primary">Explorar veículos</button>
          <button @click="redirectToContact" class="btn-secondary">Entre em contato</button>
        </div>
      </div>

      <!-- Imagem principal -->
      <div class="hero-image-container">
        <picture>
          <source srcset="@/assets/images/backgrounds/BMW-M3-small.webp" media="(max-width: 768px)" type="image/webp" />
          <source srcset="@/assets/images/backgrounds/BMW-M3-medium.webp" media="(max-width: 1200px)" type="image/webp" />
          <source srcset="@/assets/images/backgrounds/BMW-M3.webp" type="image/webp" />
          <img :src="slide.image" alt="Carro destaque" class="hero-image" fetchpriority="high" />
        </picture>

      </div>
    </div>
  </section>
</template>

<script>
import "@/assets/AppHero.css";
export default {
  name: "AppHero",
  data() {
    return {
      slide: {
        image: require("@/assets/images/backgrounds/BMW-M3.webp"),
        title: "Encontre o carro dos seus sonhos",
        subtitle: "Qualidade, confiança e as melhores condições do mercado",
      },
    };
  },
  methods: {
    redirectToCars() {
      this.$router.push("/view");
    },
    redirectToContact() {
      this.$router.push("/contato");
    },
  },
};
</script>
