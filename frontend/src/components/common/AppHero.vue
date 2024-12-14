<template>
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
              <!-- Título e Subtítulo -->
              <h1>{{ slide.title }}</h1>
              <p>{{ slide.subtitle }}</p>
              <!-- Botões -->
              <div class="cta-buttons">
                <button @click="redirectToCars" class="btn-primary">Explorar veículos</button>
                <button @click="redirectToContact" class="btn-secondary">Entre em contato</button>
              </div>
            </div>
            <!-- Imagem do Carro -->
            <div class="hero-image-container">
              <img :src="slide.image" alt="Carro destaque" class="hero-image" />
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
  