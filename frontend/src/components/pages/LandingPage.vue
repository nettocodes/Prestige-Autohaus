<template>
  <div id="app">
    <AppHero />
    <div class="landing-page">
      <!-- Hero Section -->

      <section class="brand-section">
        <div class="brand-content">
          <header class="section-header">
            <span class="section-title">Explore Nossas Marcas Premium</span>
            <a href="/" class="cta-link" data-aos="fade-left" data-aos-delay="200">
              Mostrar Todas as Marcas →
            </a>
          </header>


          <div class="list-brand" data-aos="fade-up" data-aos-delay="400">
            <ul>
              <li
                v-for="(brand, index) in selectedBrands"
                :key="brand"
                :data-aos="index % 2 === 0 ? 'fade-up' : 'fade-down'"
                :data-aos-delay="100 * index"
              >
                <router-link
                  :to="{ path: '/view', query: { brand: brand } }"
                  class="brand-card-link"
                >
                  <div class="brand-card">
                    <img :src="getBrandImage(brand)" :alt="brand" class="logo-brand" />
                    <p>{{ brand }}</p>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Dynamic Vehicle Carousel -->
      <section class="custom-carousel-section">
        <header class="section-header">
          <span class="section-title">Explore Todos os Veículos</span>
          <router-link to="/view" class="cta-link">Ver Todos &rarr;</router-link>
        </header>

        <Splide
          v-if="filteredVehiclesForAll.length > 0"
          :options="splideOptionsVehicles"
          class="custom-carousel"
        >
          <SplideSlide v-for="vehicle in filteredVehiclesForAll" :key="vehicle.id" style="display: flex; justify-content: center;">
            <div class="custom-vehicle-card">
              <div class="custom-vehicle-image">
                <Splide :options="splideOptionsInner">
                  <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                    <img :src="`/api/uploads/${foto}`" alt="Foto do Veículo" loading="lazy"/>
                  </SplideSlide>
                </Splide>
              </div>
              <div class="custom-vehicle-info">
                <span class="vehicle-title">{{ vehicle.marca || "Não informado" }}</span>
                <span class="vehicle-subtitle">{{ vehicle.modelo || "Não informado" }}</span>
                <div class="custom-vehicle-details">
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/odometro.svg" alt="Quilometragem" />
                    <span>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</span>
                  </div>
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/fuel.svg" alt="Combustível" />
                    <span>{{ vehicle.combustivel || "Não informado" }}</span>
                  </div>
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/transmission.svg" alt="Transmissão" />
                    <span>{{ vehicle.transmissao || "Não informado" }}</span>
                  </div>
                </div>
                <div class="custom-vehicle-bottom-item">
                  <span class="custom-price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</span>
                  <button class="cta-btn" @click="viewDetails(vehicle.id)">Ver Detalhes</button>
                </div>
              </div>
            </div>
          </SplideSlide>
        </Splide>

      </section>

      <section class="highlight-section">
        <div class="highlight-content">
          <div class="highlight-image">
            <img
              src="@/assets/images/backgrounds/highlight.webp"
              alt="Destaque do carro"
              class="highlight-img"
            />
          </div>
          <div class="highlight-text">
            <span class="section-title">Um Preço Justo Pelo Seu Carro</span>
            <span class="highlight-subtitle">Venda Para Nós Hoje</span>
            <p>
              Estamos comprometidos em oferecer aos nossos clientes um serviço
              excepcional, preços competitivos e uma ampla gama de benefícios:
            </p>
            <ul>
              <li>Somos o maior provedor do Brasil, com mais patrulhas em mais lugares</li>
              <li>Você recebe assistência na estrada 24/7</li>
              <li>Consertamos 4 de cada 5 carros na estrada</li>
            </ul>
            <button class="cta-btn">Comece Agora &rarr;</button>
          </div>
        </div>
      </section>



      <section class="unique-brand-filter-carousel">
        <div class="unique-brand-content">
          <header class="section-header">
            <span class="section-title">Marcas Populares</span>
            <router-link to="/view" class="cta-link">Ver Todas &rarr;</router-link>
          </header>

          <!-- Tabs de Marcas -->
          <div class="unique-brand-tabs">
            <Splide :options="splideOptionsTabs" class="tabs-carousel">
              <SplideSlide v-for="brand in uniqueBrands" :key="brand" class="splide_list_tab">
                <button
                  @click="filterByBrandForBrands(brand)"
                  :class="{ 'active-tab': selectedBrand === brand }"
                  class="tab-button"
                >
                  {{ brand }}
                </button>
              </SplideSlide>
            </Splide>
          </div>

          <!-- Carousel de Veículos -->
          <Splide v-if="filteredVehiclesForBrands.length > 0" :options="splideOptionsBrands" class="unique-brand-carousel">
            <SplideSlide v-for="vehicle in filteredVehiclesForBrands" :key="vehicle.id">
              <div class="vehicle-card">
                <div class="vehicle-image">
                  <img :src="`/api/uploads/${vehicle.fotos[0]}`" alt="Foto do Veículo" loading="lazy"/>
                </div>
                <div class="vehicle-info">
                  <span class="vehicle-title">{{ vehicle.marca || "Não informado" }}</span>
                  <span class="vehicle-subtitle">{{ vehicle.modelo || "Não informado" }}</span>
                  <div class="vehicle-details-unique">
                    <div class="vehicle-detail-item">
                      <img src="@/assets/images/icons/odometro.svg" alt="Odômetro" />
                      <span>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</span>
                    </div>
                    <div class="vehicle-detail-item">
                      <img src="@/assets/images/icons/fuel.svg" alt="Combustível" />
                      <span>{{ vehicle.combustivel || "Não informado" }}</span>
                    </div>
                    <div class="vehicle-detail-item">
                      <img src="@/assets/images/icons/transmission.svg" alt="Transmissão" />
                      <span>{{ vehicle.transmissao || "Não informado" }}</span>
                    </div>
                  </div>
                  <div class="vehicle-bottom-item">
                    <span class="price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</span>
                    <button class="cta-btn" @click="viewDetails(vehicle.id)">
                      Ver Detalhes <img src="@/assets/images/icons/arrow.png" alt="">
                    </button>
                  </div>
                </div>
              </div>
            </SplideSlide>
          </Splide>
        </div>
      </section>


    </div>
    <AppFooter />
  </div>
</template>
<script>
import AppHero from "@/components/common/AppHero.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import axios from "axios";

export default {
  name: "LandingPage",
  components: {
    AppHero,
    AppFooter,
    Splide,
    SplideSlide,
  },
  data() {
    return {
      vehicles: [],
      filteredVehiclesForBrands: [],
      selectedBrands: ["audi", "bmw", "ferrari", "lamborghini", "porsche"],
      filteredVehiclesForAll: [], // Veículos filtrados para o carrossel geral
      selectedBrand: "", // Marca selecionada para filtro no carrossel de marcas
      uniqueBrands: [], // Lista de marcas únicas
      favorites: JSON.parse(localStorage.getItem("favorites")) || [], // Lista de favoritos
      splideOptionsVehicles: {
        type: "loop",
        perPage: 3,
        gap: ".5rem",
        pagination: false,
        focus: "center",
        autoplay: true,
        interval: 4000,
        lazyLoad: "nearby",
        trimSpace: false,
        arrows: true,
        breakpoints: {
          1024: { perPage: 2, gap: "0.5rem" },
          768: { perPage: 2, gap: "0.5rem" },
        },
      },
      splideOptionsBrands: {
        type: "loop",
        perPage: 4,
        gap: ".5rem",
        pagination: false,
        focus: "center",
        autoplay: true,
        lazyLoad: "nearby",
        trimSpace: true,
        arrows: true,
        breakpoints: {
          1200: { perPage: 3, gap: "0.5rem" },
          768: { perPage: 2, gap: "0.5rem" },
          480: { perPage: 2, gap: "0.5rem" },
        },
      },

      splideOptionsInner: {
        type: "loop",
        autoplay: true,
        interval: 3000,
        arrows: false,
        focus: "center",
      },
      splideOptionsTabs: {
        type: "carousel",
        perPage: 5, // Número de itens visíveis por página
        gap: "0rem", // Espaçamento entre os itens
        pagination: false, // Remove a paginação
        arrows: false, // Remove as setas de navegação
        autoplay: false, // Evita rotação automática
        breakpoints: {
          1200: { perPage: 4},
          1024: { perPage: 3},
          768: { perPage: 2},
          480: { perPage: 1},
        },
      },
      

    };

  },
  methods: {
    getBrandImage(brand) {
      return require(`@/assets/images/logos/${brand.toLowerCase().replace(/\s+/g, '-')}.webp`);
    },
    async fetchVehicles() {
      try {
        const response = await axios.get("/api/vehicles");

        // Verificar se a resposta é válida
        if (Array.isArray(response.data)) {
          this.vehicles = response.data;

          // Inicializa veículos filtrados
          this.filteredVehiclesForBrands = [...this.vehicles];
          this.filteredVehiclesForAll = [...this.vehicles];

          // Lista única de marcas
          this.uniqueBrands = [...new Set(this.vehicles.map((vehicle) => vehicle.marca))];
        } else {
          console.error("Resposta inesperada da API:", response.data);
          this.vehicles = [];
        }
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        this.vehicles = []; // Garante que não quebre a aplicação
      }
    },


    // Filtro para o carrossel de marcas
    filterByBrandForBrands(brand) {
      this.selectedBrand = brand;
      if (brand) {
        this.filteredVehiclesForBrands = this.vehicles.filter((vehicle) => vehicle.marca === brand);
      } else {
        this.filteredVehiclesForBrands = [...this.vehicles]; // Reseta o filtro
      }
    },

    // Reset para o carrossel geral
    resetFiltersForAll() {
      this.filteredVehiclesForAll = [...this.vehicles];
    },

    // Alterna o estado de favorito
    toggleFavorite(vehicle) {
      const index = this.favorites.findIndex((fav) => fav.id === vehicle.id);

      if (index > -1) {
        this.favorites.splice(index, 1); // Remove dos favoritos
      } else {
        this.favorites.push(vehicle); // Adiciona aos favoritos
      }

      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },

    // Verifica se o veículo está nos favoritos
    isFavorite(vehicleId) {
      return this.favorites.some((fav) => fav.id === vehicleId);
    },

    // Exibe detalhes do veículo
    viewDetails(vehicleId) {
      this.$router.push(`/details/${vehicleId}`);
    },
  },
  mounted() {
    this.fetchVehicles();

    // Forçar atualização do Splide após o DOM estar pronto
    this.$nextTick(() => {
      const splides = document.querySelectorAll(".splide");
      splides.forEach((splideElement) => {
        const splideInstance = new Splide(splideElement);
        splideInstance.mount();
      });
    });
  },

  
};
</script>
<style>
.splide__pagination{display: none !important;}:root {--font-primary: "DM Sans", sans-serif;}.landing-page {text-align: center;}.section-header {display: flex;justify-content: space-between;align-items: center;margin-bottom: 2rem;}.section-title {font-size: 2rem;font-weight: bold;text-align: center;color: var(--primary-color);visibility: visible;opacity: 1;transition: none;}.cta-link {font-size: 1.1rem;font-weight: 600;color: var(--secondary-color);text-decoration: none;transition: color 0.3s ease, transform 0.2s ease;}.cta-link:hover {color: var(--hover-color);transform: translateX(5px);}.brand-section {padding: 3rem 1.5rem;background: var(--background-light);border-radius: 0 0 8px 8px;box-shadow: 0 8px 20px var(--shadow-color);}.brand-content {max-width: 1440px;margin: 0 auto;width: 100%;}.list-brand ul {display: grid;grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap: 1.5rem;list-style: none;padding: 0;margin: 0;}.brand-card {background: linear-gradient(145deg, #ffffff, #f3f3f3);border: 1px solid var(--border-color);border-radius: 16px;box-shadow: 0 6px 15px var(--shadow-color);padding: 1.2rem;text-align: center;transition: transform 0.3s ease, box-shadow 0.3s ease;}.brand-card:hover {transform: translateY(-8px);box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);background: linear-gradient(145deg, #ffffff, var(--secondary-color));}.logo-brand {width: 100%;max-width: 100px;height: auto;transition: transform 0.3s ease;}.brand-card:hover .logo-brand {transform: scale(1.1);}.brand-card p {font-size: 1rem;font-weight: 600;color: var(--text-secondary);margin: 0;text-align: center;}.brand-card-link {text-decoration: none;}@media (max-width: 1024px) {.list-brand ul {grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));gap: 1rem;}.brand-card {padding: 1rem;}.logo-brand {max-width: 80px;}}@media (max-width: 768px) {.list-brand ul {grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));}.brand-card {padding: 0.8rem;}.brand-card p {font-size: 0.75rem;}.logo-brand {max-width: 60px;}}@media (max-width: 480px) {.brand-section {padding: 2rem 1rem;}.list-brand ul {grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));gap: 0.5rem;}.brand-card {padding: 0.5rem;}.brand-card p {display: none;}.logo-brand {max-width: 40px;margin-bottom: 0;}}.custom-carousel-section {margin: 2rem auto;padding: 0 1rem;max-width: 1440px;}.custom-carousel {margin: 0 auto;overflow: hidden;width: 100%;position: relative;}.custom-carousel::before, .custom-carousel::after {content: "";position: absolute;top: 0;bottom: 0;width: 50px;pointer-events: none;z-index: 2;}.custom-carousel::before {left: 0;background: linear-gradient(to right, rgba(27, 27, 27, 0.3), transparent);}.custom-carousel::after {right: 0;background: linear-gradient(to left, rgba(27, 27, 27, 0.3), transparent);}.custom-vehicle-card {width: 100%;max-width: 280px;height: 420px;background: var(--background-light);border-radius: 12px;box-shadow: 0 4px 10px var(--shadow-color);overflow: hidden;text-align: left;margin: 1rem auto;display: flex;flex-direction: column;justify-content: space-between;transition: transform 0.3s ease, box-shadow 0.3s ease;}.custom-vehicle-card:hover {transform: translateY(-8px);box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);}.custom-vehicle-image {width: 100%;height: 60%;overflow: hidden;position: relative;}.custom-vehicle-image img {width: 100%;height: 100%;object-fit: cover;transition: transform 0.3s ease;}.custom-vehicle-card:hover .custom-vehicle-image img {transform: scale(1.05);}.custom-vehicle-info {flex: 1;padding: 1rem;display: flex;flex-direction: column;justify-content: space-between;}.vehicle-title {font-size: 1.3rem;font-weight: 600;color: var(--primary-color);}.vehicle-subtitle {font-size: 1rem;color: var(--text-secondary);}.custom-vehicle-details {display: flex;flex-direction: column;justify-content: space-between;gap: 0.5rem;border-top: 1px solid var(--border-color);padding-top: 1rem;}.custom-vehicle-detail-item {display: flex;align-items: center;text-align: center;gap: 0.3rem;}.custom-vehicle-detail-item img {width: 24px;height: 24px;}.custom-price {font-weight: bold;font-size: 1.2rem;color: var(--primary-color);}.custom-vehicle-bottom-item {display: flex;flex-direction: column;justify-content: space-between;align-items: center;margin: 1rem 0;}.cta-btn {padding: 0;font-size: 1rem;font-weight: 600;color: #fff;background-color: var(--primary-color);border: none;border-radius: 8px;cursor: pointer;transition: background-color 0.3s ease;}.cta-btn:hover {background-color: var(--hover-color);}@media (max-width: 1280px) {.custom-vehicle-card {max-width: 260px;}.custom-vehicle-image {height: 55%;}}@media (max-width: 1024px) {.custom-vehicle-card {max-width: 240px;}.custom-vehicle-image {height: 50%;}}@media (max-width: 768px) {.custom-vehicle-card {max-width: 200px;}.custom-vehicle-image {height: 50%;}}@media (max-width: 480px) {.custom-vehicle-card {max-width: 180px;}.custom-vehicle-image {height: 45%;}.vehicle-title {font-size: 1rem;}.vehicle-subtitle {font-size: 0.85rem;}.custom-price {font-size: 1rem;}.cta-btn {font-size: 0.9rem;}}.highlight-section {padding: 3rem 1.5rem;background-color: var(--background-light);display: flex;justify-content: center;align-items: center;}.highlight-content {display: flex;flex-wrap: wrap;justify-content: space-between;align-items: center;gap: 2rem;padding: 1rem;border-radius: 16px;box-shadow: 0 8px 20px var(--shadow-color);max-width: 1440px;}.highlight-image {flex: 1;max-width: 50%;position: relative;}.highlight-image img {width: 100%;height: auto;border-radius: 16px;box-shadow: 0 4px 10px var(--shadow-color);transition: transform 0.3s ease, box-shadow 0.3s ease;object-fit: cover;cursor: pointer;}.highlight-image img:hover {transform: scale(1.05);box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);}.highlight-text {flex: 1;max-width: 50%;text-align: left;}.highlight-text .section-title {font-size: 2.8rem;font-weight: 700;color: var(--primary-color);margin-bottom: 1rem;}.highlight-text .highlight-subtitle {font-size: 1.8rem;font-weight: 600;color: var(--secondary-color);margin-bottom: 1.5rem;}.highlight-text p {font-size: 1.1rem;margin: 1rem 0;line-height: 1.6;color: var(--text-secondary);}.highlight-text ul {list-style: none;padding: 0;margin: 1rem 0;}.highlight-text ul li {font-size: 1rem;color: var(--text-contrast);margin: 0.5rem 0;display: flex;align-items: center;gap: 0.5rem;}.highlight-text ul li::before {content: "✔";color: var(--secondary-color);font-size: 1.2rem;font-weight: bold;}.cta-btn {background: var(--secondary-color);color: var(--primary-color);border: none;padding: 0.8rem 2rem;border-radius: 8px;font-size: 1rem;font-weight: 600;cursor: pointer;transition: background 0.3s ease, transform 0.2s ease;}.cta-btn:hover {background: var(--hover-color);transform: scale(1.05);}@media (max-width: 1024px) {.highlight-text {padding: 2rem;}.highlight-text .section-title {font-size: 2.4rem;}.highlight-text .highlight-subtitle {font-size: 1.6rem;}.highlight-text p {font-size: 1rem;}}@media (max-width: 768px) {.highlight-content {flex-direction: column;text-align: center;}.highlight-image, .highlight-text {max-width: 100%;padding: 1.5rem;}.highlight-text .section-title {font-size: 2.2rem;}.highlight-text .highlight-subtitle {font-size: 1.4rem;}}@media (max-width: 480px) {.highlight-text .section-title {font-size: 1.8rem;}.highlight-text .highlight-subtitle {font-size: 1.2rem;}.highlight-text p {font-size: 0.9rem;}.cta-btn {font-size: 0.9rem;padding: 0.8rem 1.5rem;}.highlight-image, .highlight-text {padding: 0;}.highlight-text ul li {font-size: 0.85rem;}}.unique-brand-filter-carousel {padding: 3rem 1.5rem;border-radius: 12px;box-shadow: 0 8px 20px var(--shadow-color);}.unique-brand-content {max-width: 1440px;margin: 0 auto;display: flex;flex-direction: column;gap: 2rem;}.section-header {display: flex;justify-content: space-between;align-items: center;margin-bottom: 1.5rem;}.cta-link {font-size: 1.1rem;font-weight: 600;color: var(--secondary-color);text-decoration: none;transition: color 0.3s ease, transform 0.2s ease;}.cta-link:hover {color: var(--hover-color);transform: translateX(5px);}.unique-brand-tabs {display: flex;gap: 1rem;overflow-x: auto;padding-bottom: 0.5rem;border-bottom: 1px solid var(--border-color);}.tabs-carousel .splide__list {display: flex;gap: 1rem;}.tabs-carousel .splide__slide {flex: 0 0 calc((100% / 5) - 1rem);}.splide_list_tab {flex: 0 0 auto;}.tab-button {background-color: transparent;color: var(--text-secondary);font-size: 1rem;font-weight: bold;padding: 0;border: none;cursor: pointer;white-space: nowrap;transition: color 0.3s ease, border-color 0.3s ease;}.tab-button.active-tab {color: var(--primary-color);border-bottom: 2px solid var(--secondary-color);}.tab-button:hover {color: var(--hover-color);}.unique-brand-carousel {display: flex;gap: 1rem;overflow-x: auto;}.vehicle-card {display: flex;flex-direction: column;justify-content: space-between;background-color: var(--background-light);border-radius: 12px;box-shadow: 0 4px 10px var(--shadow-color);overflow: hidden;transition: transform 0.3s ease, box-shadow 0.3s ease;width: 100%;max-width: 300px;height: 400px;margin: 0 auto;}.vehicle-card:hover {transform: translateY(-5px);box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);}.vehicle-image {width: 100%;height: 60%;overflow: hidden;}.vehicle-image img {width: 100%;object-fit: cover;transition: transform 0.3s ease;}.vehicle-card:hover .vehicle-image img {transform: scale(1.05);}.vehicle-info {padding: 1rem;display: flex;flex-direction: column;justify-content: space-between;gap: 0.5rem;flex-grow: 1;}.vehicle-title {font-size: 1.2rem;font-weight: 700;color: var(--primary-color);text-align: center;}.vehicle-subtitle {font-size: 1rem;color: var(--text-secondary);text-align: center;}.vehicle-details-unique {display: flex;justify-content: space-between;gap: 0.5rem;margin-top: 0.5rem;}.vehicle-detail-item {display: flex;flex-direction: column;align-items: center;gap: 0.5rem;}.vehicle-detail-item img {width: 24px;height: 24px;}.price {font-size: 1.2rem;font-weight: bold;color: var(--secondary-color);text-align: center;}.cta-btn {display: flex;justify-content: center;align-items: center;gap: 0.5rem;font-size: 1rem;font-weight: bold;color: var(--secondary-color);background: none;border: none;cursor: pointer;transition: color 0.3s ease;}.cta-btn:hover {color: var(--hover-color);text-decoration: underline;}.cta-btn img {width: 12px;filter: invert(100%);}@media (max-width: 1024px) {.section-title {font-size: 2rem;}.cta-link {font-size: 1rem;}.vehicle-card {max-width: 260px;}.vehicle-title {font-size: 1rem;}.price {font-size: 1rem;}.cta-btn {font-size: 0.9rem;}.tab-button {font-size: 0.9rem;padding: 0.4rem 0.8rem;}}@media (max-width: 768px) {.section-title {font-size: 1.8rem;}.cta-link {font-size: 0.9rem;}.vehicle-card {max-width: 220px;}.vehicle-title {font-size: 0.95rem;}.price {font-size: 0.9rem;}.cta-btn {font-size: 0.9rem;}}@media (max-width: 480px) {.section-title {font-size: 1.5rem;}.cta-link {font-size: 0.85rem;}.tab-button {font-size: 0.8rem;padding: 0.3rem 0.6rem;}.vehicle-card {max-width: 180px;}.vehicle-title {font-size: 0.85rem;}.price {font-size: 0.85rem;}.cta-btn {font-size: 0.8rem;}}
</style>