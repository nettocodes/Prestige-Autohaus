<template>
  <div id="app">
    <AppHero />
    <div class="landing-page">
      <!-- Hero Section -->

      <!-- Brand Section -->
      <section class="brand-section">
        <div class="header-brand">
          <h2>Explore Our Premium Brands</h2>
          <a href="/" class="show-all-brands">Show All Brands →</a>
        </div>
        <div class="list-brand">
          <ul>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/audi.png" alt="Audi">
                  <p>Audi</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/bmw.png" alt="BMW">
                  <p>BMW</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/ferrari.png" alt="Ferrari">
                  <p>Ferrari</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/mercedes.png" alt="Mercedes Benz">
                  <p>Mercedes Benz</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/lamborghini.png" alt="Lamborghini">
                  <p>Lamborghini</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/">
                <div class="brand-card">
                  <img class="logo-brand" src="@/assets/images/logos/porsche.png" alt="Porsche">
                  <p>Porsche</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <!-- Dynamic Vehicle Carousel -->
      <section class="dynamic-carousel-section">
        <div class="dynamic-carousel-header">
          <h2>Explore All Vehicles</h2>
          <router-link to="/view" class="view-all-link">View All &rarr;</router-link>
        </div>

        <Splide :options="splideOptions" class="dynamic-carousel">
          <SplideSlide v-for="vehicle in filteredVehicles" :key="vehicle.id">
            <div class="vehicle-card">
              <div class="vehicle-image">
                <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
                  <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                    <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
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
              <div class="vehicle-info">
                <h3>{{ vehicle.marca || "Não informado" }}</h3>
                <p>{{ vehicle.modelo || "Não informado" }}</p>
                <div class="vehicle-details">
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/odometro.svg" alt="Quilometragem" class="info-icon" />
                    <p>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
                  </div>
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/fuel.svg" alt="Combustível" class="info-icon" />
                    <p>{{ vehicle.combustivel || "Não informado" }}</p>
                  </div>
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/transmission.svg" alt="Transmissão" class="info-icon" />
                    <p>{{ vehicle.transmissao || "Não informado" }}</p>
                  </div>
                </div>
                <div class="vehicle-bottom-item">
                  <p class="price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
                  <button class="details-btn" @click="viewDetails(vehicle.id)">View Details</button>
                </div>
              </div>
            </div>
          </SplideSlide>
        </Splide>
      </section>

    </div>
  </div>
</template>

<script>
import AppHero from "@/components/common/AppHero.vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import axios from "axios";
import "@/assets/LandingPage.css";

export default {
  name: "LandingPage",
  components: {
    AppHero,
    Splide,
    SplideSlide,
  },
  data() {
    return {
      filteredVehicles: [], // Veículos carregados dinamicamente
      splideOptions: {
        type: "loop",
        perPage: 3,
        gap: "1rem",
        pagination: false,
        autoplay: true,
        breakpoints: {
          768: { perPage: 1 },
          1024: { perPage: 2 },
        },
      },
    };
  },
  methods: {
    async fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        this.filteredVehicles = response.data;
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    },
    toggleFavorite(vehicle) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const index = favorites.findIndex((fav) => fav.id === vehicle.id);

      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(vehicle);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    },
    isFavorite(vehicleId) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      return favorites.some((fav) => fav.id === vehicleId);
    },
    viewDetails(vehicleId) {
      this.$router.push(`/details/${vehicleId}`);
    },
  },
  mounted() {
    this.fetchVehicles();
  },
};
</script>
