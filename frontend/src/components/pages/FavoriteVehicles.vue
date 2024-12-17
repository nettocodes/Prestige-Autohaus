<template>
  <div class="vehicle-container">
    <div class="content-vehicles-favorites">
      <!-- Título Principal -->
      <h2 class="vehicle-title">Veículos Favoritos</h2>
      <div class="action-prompt">
        <h3>Seu próximo carro está à sua espera</h3>
        <p>
          Os melhores veículos que você selecionou estão aqui. Não perca tempo para agendar um <strong>test drive</strong> exclusivo e garantir o carro dos seus sonhos.
        </p>
        <a
          :href="`https://wa.me/47997486918?text=${encodeURIComponent(`Olá, estou interessado em agendar um test drive para os veículos que selecionei.`)}`"
          target="_blank"
          class="whatsapp-btn"
        >
          Agendar Test Drive
        </a>
      </div>


      <!-- Caso não existam favoritos -->
      <div v-if="favorites.length === 0" class="no-favorites">
        <p>Você ainda não adicionou veículos aos favoritos.</p>
      </div>

      <!-- Lista de Veículos Favoritos -->
      <div v-else class="vehicle-grid">
        <div v-for="vehicle in favorites" :key="vehicle.id" class="vehicle-card">
          <!-- Imagem do veículo com carrossel -->
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Vehicle photo" />
              </SplideSlide>
            </Splide>
            <button
              class="favorite-btn"
              @click="toggleFavorite(vehicle)"
              :class="{ active: isFavorite(vehicle.id) }"
            >
              ❤
            </button>
          </div>

          <!-- Informação do veículo -->
          <div class="vehicle-info">
            <h3>{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
            <p class="description">{{ vehicle.carroceria }} - {{ vehicle.combustivel }}</p>
            <p class="price">R$ {{ new Intl.NumberFormat().format(vehicle.preco) }}</p>
            <p class="details">{{ vehicle.ano }} | {{ vehicle.quilometragem.toLocaleString() }} Km</p>
            <button class="btn view-details-btn" @click="viewDetails(vehicle.id)">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import AppFooter from "@/components/common/AppFooter.vue";
import "@/assets/VehicleFavorites.css";
import axios from "axios";

export default {
  name: "FavoriteVehicles",
  components: {
    Splide,
    AppFooter,
    SplideSlide,
  },
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem("favorites")) || [],
    };
  },
  methods: {
    async toggleFavorite(vehicle) {
      const index = this.favorites.findIndex((fav) => fav.id === vehicle.id);
      if (index > -1) {
        this.favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      } else {
        this.favorites.push(vehicle);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }

      // Registra o favorito
      try {
        await axios.post("/api/statistics/favorites", { vehicleId: vehicle.id });
        console.log("Favorito registrado com sucesso");
      } catch (error) {
        console.error("Erro ao registrar favorito:", error);
      }
    },
    isFavorite(id) {
      return this.favorites.some((fav) => fav.id === id);
    },
    getSessionId() {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    },
    async viewDetails(vehicleId) {
      try {
        const sessionId = this.getSessionId();
        await axios.post("/api/statistics/views", {
          vehicleId,
          sessionId,
        });
        this.$router.push({ path: `/details/${vehicleId}` });
      } catch (error) {
        console.error("Erro ao registrar visualização:", error);
      }
    },
  },
};
</script>
