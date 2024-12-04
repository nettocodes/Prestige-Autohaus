<template>
    <div id="app">
  
      <div class="landing-page">
        <!-- Hero Section -->
        <AppHero />
  
        <!-- Features Section -->
        <section class="features-section">
          <h2>O que podemos oferecer</h2>
          <div class="features-grid">
            <div class="feature">
              <i class="fas fa-car"></i>
              <h3>Gestão Completa</h3>
              <p>Adicione, edite e visualize seus veículos com facilidade.</p>
            </div>
            <div class="feature">
              <i class="fas fa-heart"></i>
              <h3>Favoritos</h3>
              <p>Marque seus veículos favoritos para acessá-los rapidamente.</p>
            </div>
            <div class="feature">
              <i class="fas fa-chart-line"></i>
              <h3>Análise Rápida</h3>
              <p>Veja os detalhes dos veículos em uma interface clara e intuitiva.</p>
            </div>
            <div class="feature">
              <i class="fas fa-shield-alt"></i>
              <h3>Segurança</h3>
              <p>Todos os seus dados são armazenados de forma segura e privada.</p>
            </div>
          </div>
        </section>
      </div>
  
    </div>
  </template>
  
  <script>
  import AppHero from "@/components/common/AppHero.vue";
  import "@/assets/LandingPage.css";
  export default {
    name: "App",
    components: {
        AppHero,
    },
  };
  </script>
  
  