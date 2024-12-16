<template>
  <div class="statistics-panel">
    <h1 class="statistics-title">Painel de Estatísticas</h1>

    <!-- Visão Geral -->
    <div class="statistics-section">
      <h2 class="section-title">Visão Geral</h2>
      <div class="overview-grid">
        <div class="stat-card">
          <h3>Total de Acessos</h3>
          <p>{{ totalAccesses }}</p>
        </div>
        <div class="stat-card">
          <h3>Veículos Favoritados</h3>
          <p>{{ totalFavorites }}</p>
        </div>
        <div class="stat-card">
          <h3>Cliques em Contato</h3>
          <p>{{ totalContactClicks }}</p>
        </div>
      </div>
    </div>

    <!-- Carros Mais Visualizados -->
    <div class="statistics-section">
      <h2 class="section-title-stats">Carros Mais Visualizados</h2>
      <div class="vehicle-grid-stats">
        <div class="vehicle-card-stats" v-for="car in mostViewedCars" :key="car.id">
          <div class="vehicle-image-stats">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in car.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Foto do veículo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-details-stats">
            <div class="car-name-sats">
              <h3 class="car-brand-stas">{{ car.marca }}</h3>
              <h3 class="car-model-stats">{{ car.modelo }}</h3>
            </div>
            <p><strong>{{ car.views }}</strong> visualizações</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Carros Mais Favoritados -->
    <div class="statistics-section">
      <h2 class="section-title-stats">Carros Mais Favoritados</h2>
      <div class="vehicle-grid-stats">
        <div class="vehicle-card-stats" v-for="car in mostFavoritedCars" :key="car.id">
          <div class="vehicle-image-stats">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in car.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Foto do veículo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-details-stats">
            <div class="car-name-sats">
              <h3 class="car-brand-stas">{{ car.marca }}</h3>
              <h3 class="car-model-stats">{{ car.modelo }}</h3>
            </div>
            <p><strong>{{ car.favorites }}</strong> favoritos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rankings de Interações -->
    <div class="statistics-section">
      <h2 class="section-title-stats">Rankings de Interações</h2>
      <div class="vehicle-grid-stats">
        <div class="vehicle-card-stats" v-for="car in interactionRankings" :key="car.id">
          <div class="vehicle-image-stats">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in car.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Foto do veículo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-details-stats">
            <div class="car-name-sats">
              <h3 class="car-brand-stas">{{ car.marca }}</h3>
              <h3 class="car-model-stats">{{ car.modelo }}</h3>
            </div>
            <p><strong>{{ car.interactions }}</strong> interações</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

export default {
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      totalAccesses: 0,
      totalFavorites: 0,
      totalContactClicks: 0,
      mostViewedCars: [],
      mostFavoritedCars: [],
      interactionRankings: [],
    };
  },
  methods: {
    async fetchStatistics() {
      try {
        const accessesResponse = await axios.get("/api/statistics/accesses");
        const favoritesResponse = await axios.get("/api/statistics/favorites");
        const contactClicksResponse = await axios.get("/api/statistics/contact-clicks");
        const mostViewedResponse = await axios.get("/api/statistics/most-viewed");
        const mostFavoritedResponse = await axios.get("/api/statistics/most-favorited");
        const interactionResponse = await axios.get("/api/statistics/interactions");

        // Tratamento para garantir que fotos sempre seja um array
        this.mostViewedCars = mostViewedResponse.data.map((car) => ({
          ...car,
          fotos: Array.isArray(car.fotos) ? car.fotos : [],
        }));

        this.mostFavoritedCars = mostFavoritedResponse.data.map((car) => ({
          ...car,
          fotos: Array.isArray(car.fotos) ? car.fotos : [],
        }));

        this.interactionRankings = interactionResponse.data.map((car) => ({
          ...car,
          fotos: Array.isArray(car.fotos) ? car.fotos : [],
        }));

        this.totalAccesses = accessesResponse.data.total || 0;
        this.totalFavorites = favoritesResponse.data.total || 0;
        this.totalContactClicks = contactClicksResponse.data.total || 0;
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    },
  },
  mounted() {
    this.fetchStatistics();
  },
};
</script>
<style scoped>
.statistics-panel {
  padding: 20px;
  background: #f3f4f6;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statistics-section {
  margin-bottom: 3rem;
}

.statistics-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #2d3748;
}

.section-title-stats {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.overview-grid {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.vehicle-grid-stats {
  display: flex;
  gap: 20px;
  justify-items: center;
}

.vehicle-card-stats {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 320px;
  display: flex;
  flex-direction: column;
}

.car-name-sats{
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}
.car-brand-stas{
  font-weight: bold;
}
.car-model-stats{
  font-weight: 300;
}

.vehicle-card-stats:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.vehicle-image-stats img {
  width: 100%;
  object-fit: contain;
  border-bottom: 1px solid #e2e8f0;
}

.vehicle-details-stats {
  padding: 15px;
  text-align: center;
  flex: 1;
}


.vehicle-details-stats p {
  font-size: 1rem;
  color: #4a5568;
  margin: 5px 0;
}

.vehicle-details-stats strong {
  color: #2b6cb0;
  font-size: 1.2rem;
}

.vehicle-grid-stats > .vehicle-card-stats {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
