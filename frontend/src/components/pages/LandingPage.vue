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
      <section class="highlight-section">
        <div class="highlight-content">
          <!-- Vídeo com botão de play -->
          <div class="highlight-image">
            <video id="highlight-video" poster="assets/images/car-highlight.jpg" preload="none" class="video" muted autoplay>
              <source src="@/assets/videos/back.webm" type="video/webm" />
              Seu navegador não suporta vídeos.
            </video>
          </div>
          <!-- Texto lateral -->
          <div class="highlight-text">
            <h2>Get A Fair Price For Your Car</h2>
            <p>Sell To Us Today</p>
            <p>
              We are committed to providing our customers with exceptional service, competitive pricing, and a wide range of benefits:
            </p>
            <ul>
              <li>✔ We are the UK's largest provider, with more patrols in more places</li>
              <li>✔ You get 24/7 roadside assistance</li>
              <li>✔ We fix 4 out of 5 cars at the roadside</li>
            </ul>
            <button class="cta-button">Get Started &rarr;</button>
          </div>
        </div>
      </section>

      <section class="brand-filter-carousel">
        <div class="brand-filter-header">
          <h2>Popular Makes</h2>
          <router-link to="/view" class="view-all-link">View All &rarr;</router-link>
        </div>
        
        <div class="brand-tabs">
          <button 
            v-for="brand in uniqueBrands" 
            :key="brand" 
            @click="filterByBrand(brand)" 
            :class="{ active: selectedBrand === brand }"
          >
            {{ brand }}
          </button>
        </div>

        <Splide :options="splideOptions" class="brand-carousel">
          <SplideSlide v-for="vehicle in filteredVehicles" :key="vehicle.id">
            <div class="brand-vehicle-card">
              <div class="brand-vehicle-image">
                <img :src="`http://localhost:5000/uploads/${vehicle.fotos[0]}`" alt="Vehicle photo" />
              </div>
              <div class="brand-vehicle-info">
                <h3>{{ vehicle.marca || "Não informado" }}</h3>
                <p>{{ vehicle.modelo || "Não informado" }}</p>
                <div class="vehicle-details">
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/odometro.svg" alt="Odometer" />
                    <p>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
                  </div>
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/fuel.svg" alt="Fuel" />
                    <p>{{ vehicle.combustivel || "Não informado" }}</p>
                  </div>
                  <div class="vehicle-detail-item">
                    <img src="@/assets/images/icons/transmission.svg" alt="Transmission" />
                    <p>{{ vehicle.transmissao || "Não informado" }}</p>
                  </div>
                </div>
                <p class="brand-price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
                <button class="details-btn" @click="viewDetails(vehicle.id)">View Details</button>
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
      vehicles: [], // Todos os veículos
      filteredVehicles: [], // Veículos filtrados pela marca
      selectedBrand: "", // Marca selecionada
      uniqueBrands: [], // Lista de marcas únicas
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
        this.vehicles = response.data;

        // Extraindo marcas únicas
        this.uniqueBrands = [...new Set(this.vehicles.map(vehicle => vehicle.marca))];

        // Define a primeira marca como padrão e filtra os veículos
        if (this.uniqueBrands.length > 0) {
          this.selectedBrand = this.uniqueBrands[0];
          this.filterByBrand(this.selectedBrand);
        }
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
    filterByBrand(brand) {
      this.selectedBrand = brand;
      this.filteredVehicles = this.vehicles.filter(vehicle => vehicle.marca === brand);
    },
    viewDetails(vehicleId) {
      this.$router.push(`/details/${vehicleId}`);
    },
  },
  mounted() {
    this.fetchVehicles();
    const playButton = document.getElementById("play-button");
    const video = document.getElementById("highlight-video");

    if (playButton && video) {
      playButton.addEventListener("click", function () {
        if (video.paused) {
          video.play();
          playButton.style.display = "none"; // Esconde o botão de play quando o vídeo começa
        }
      });
    } else {
      console.error("Play button or video element not found!");
    }
  },
};
</script>
