<template>
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
          <source srcset="https://prestige-autohaus-production.up.railway.app/assets/images/backgrounds/BMW-M3-small.webp" media="(max-width: 768px)" type="image/webp" />
          <source srcset="https://prestige-autohaus-production.up.railway.app/assets/images/backgrounds/BMW-M3-medium.webp" media="(max-width: 1200px)" type="image/webp" />
          <source srcset="https://prestige-autohaus-production.up.railway.app/assets/images/backgrounds/BMW-M3.webp" type="image/webp" />
          <img
            src="https://prestige-autohaus-production.up.railway.app/assets/images/backgrounds/BMW-M3.webp"
            alt="Carro destaque"
            class="hero-image"
            fetchpriority="high"
            loading="eager"
          />
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


<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');@import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap');.hero {display: flex;align-items: center;justify-content: center;background: linear-gradient(90deg, #6220fb, #1c1c1c);color: white;min-height: 70vh;width: 100%;padding: 2rem 1rem;box-sizing: border-box;overflow: hidden;}.hero-container {display: flex;flex-direction: row;align-items: center;justify-content: center;max-width: 1440px;width: 100%;}.hero-content {flex: 1;text-align: left;padding: 1rem;}.hero-content h1 {font-size: 4rem;font-family: "Racing Sans One", sans-serif;font-weight: 700;margin-bottom: 1rem;text-transform: uppercase;line-height: 1.1;}.hero-content p {font-size: 1.5rem;font-family: 'Poppins', sans-serif;font-weight: 400;margin-bottom: 2rem;line-height: 1.5;}.cta-buttons {display: flex;gap: 15px;}.btn-primary, .btn-secondary {padding: 0.8rem 1.5rem;font-size: 1rem;font-family: 'Poppins', sans-serif;font-weight: 600;border-radius: 30px;cursor: pointer;transition: all 0.3s ease;}.btn-primary {background-color: #fdd835;color: #4a148c;border: none;}.btn-primary:hover {background-color: #ffeb3b;transform: scale(1.05);}.btn-secondary {background-color: transparent;color: white;border: 2px solid white;}.btn-secondary:hover {background-color: white;color: #4a148c;transform: scale(1.05);}.hero-image-container {flex: 1;display: flex;justify-content: center;align-items: center;}.hero-image {max-width: 100%;height: auto;object-fit: cover;animation: none;opacity: 1;visibility: visible;transition: none;
}@media (max-width: 1024px) {.hero {flex-direction: column;text-align: center;padding: 3rem 1.5rem;}.hero-container {flex-direction: column;text-align: center;}.hero-content h1 {font-size: 3rem;}.hero-content p {font-size: 1.2rem;}.cta-buttons {gap: 10px;}.btn-primary, .btn-secondary {width: 100%;}.hero-image {max-width: 90%;margin-top: 1.5rem;}}@media (max-width: 768px) {.hero-content h1 {font-size: 2.5rem;}.hero-content p {font-size: 1rem;}.hero {padding: 2rem 1rem;height: 50vh;}.hero-image {max-width: 80%;}}@media (max-width: 480px) {.hero{height: 70vh;}.hero-content h1 {font-size: 2rem;}.hero-content p {font-size: 0.9rem;}.btn-primary, .btn-secondary {padding: 0.6rem 1.2rem;font-size: 0.75rem;}.hero-image {max-width: 75%;}.cta-buttons {gap: 8px;}}
</style>