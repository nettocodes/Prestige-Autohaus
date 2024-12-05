<template>
  <div id="app">
    <AppHero />
    <div class="landing-page">
      <!-- Hero Section -->

      <!-- Brand Section -->
      <section class="brand-section">
        <div class="brand-content">
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
        </div>
      </section>

      <!-- Dynamic Vehicle Carousel -->
      <section class="custom-carousel-section">
        <div class="custom-carousel-header">
          <h2>Explore All Vehicles</h2>
          <router-link to="/view" class="custom-view-all-link">View All &rarr;</router-link>
        </div>

        <Splide :options="splideOptionsVehicles" class="custom-carousel">
          <SplideSlide v-for="vehicle in filteredVehicles" :key="vehicle.id">
            <div class="custom-vehicle-card">
              <div class="custom-vehicle-image">
                <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
                  <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                    <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
                  </SplideSlide>
                </Splide>
              </div>
              <div class="custom-vehicle-info">
                <button
                  class="custom-favorite-btn"
                  @click="toggleFavorite(vehicle)"
                  :class="{ active: isFavorite(vehicle.id) }"
                >
                  ❤
                </button>
                <h3>{{ vehicle.marca || "Não informado" }}</h3>
                <p>{{ vehicle.modelo || "Não informado" }}</p>
                <div class="custom-vehicle-details">
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/odometro.svg" alt="Quilometragem" class="custom-info-icon" />
                    <p>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
                  </div>
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/fuel.svg" alt="Combustível" class="custom-info-icon" />
                    <p>{{ vehicle.combustivel || "Não informado" }}</p>
                  </div>
                  <div class="custom-vehicle-detail-item">
                    <img src="@/assets/images/icons/transmission.svg" alt="Transmissão" class="custom-info-icon" />
                    <p>{{ vehicle.transmissao || "Não informado" }}</p>
                  </div>
                </div>
                <div class="custom-vehicle-bottom-item">
                  <p class="custom-price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
                  <button class="custom-details-btn" @click="viewDetails(vehicle.id)">View Details</button>
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

      <section class="unique-brand-filter-carousel">
        <div class="unique-brand-content">
          <div class="unique-brand-filter-header">
            <h2>Popular Makes</h2>
            <router-link to="/view" class="unique-view-all-link">View All &rarr;</router-link>
          </div>

          <!-- Tabs de Marcas -->
          <div class="unique-brand-tabs">
            <button
              v-for="brand in uniqueBrands"
              :key="brand"
              @click="filterByBrand(brand)"
              :class="{ 'unique-active-tab': selectedBrand === brand }"
              class="unique-brand-tab"
            >
              {{ brand }}
            </button>
          </div>

          <!-- Carousel de Veículos -->
          <Splide :options="splideOptionsBrands" class="unique-brand-carousel">
            <SplideSlide v-for="vehicle in filteredVehicles" :key="vehicle.id">
              <div class="unique-brand-vehicle-card">
                <div class="unique-brand-vehicle-image">
                  <img :src="`http://localhost:5000/uploads/${vehicle.fotos[0]}`" alt="Vehicle photo" />
                </div>
                <div class="unique-brand-vehicle-info">
                  <h3 class="unique-brand-title">{{ vehicle.marca || "Não informado" }}</h3>
                  <p class="unique-brand-model">{{ vehicle.modelo || "Não informado" }}</p>
                  <div class="unique-vehicle-details">
                    <div class="unique-vehicle-brand-item">
                      <img src="@/assets/images/icons/odometro.svg" alt="Odometer" />
                      <p>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
                    </div>
                    <div class="unique-vehicle-brand-item">
                      <img src="@/assets/images/icons/fuel.svg" alt="Fuel" />
                      <p>{{ vehicle.combustivel || "Não informado" }}</p>
                    </div>
                    <div class="unique-vehicle-brand-item">
                      <img src="@/assets/images/icons/transmission.svg" alt="Transmission" />
                      <p>{{ vehicle.transmissao || "Não informado" }}</p>
                    </div>
                  </div>
                  <div class="unique-vehicle-brand-bottom">
                    <p class="unique-brand-price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
                    <button class="unique-details-btn" @click="viewDetails(vehicle.id)">
                      View Details <img src="@/assets/images/icons/arrow.png" alt="">
                    </button>
                  </div>
                </div>
              </div>
            </SplideSlide>
          </Splide>
        </div>
      </section>
      <section class="browse-by-type-section">
        <h2 class="browse-by-type-title">Browse by Type</h2>
        <div class="browse-by-type-container">
          <button
            v-for="type in carBodyTypes"
            :key="type.name"
            class="browse-by-type-button"
            @click="filterByCarBody(type.value)"
          >
            <img :src="type.icon" :alt="type.name" class="browse-by-type-icon" />
            <span>{{ type.name }}</span>
          </button>
        </div>
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
      filteredVehicles: [], // Veículos filtrados dinamicamente
      selectedBrand: "", // Marca selecionada para filtro
      uniqueBrands: [], // Lista de marcas únicas
      carBodyTypes: [
        { name: "SUV", value: "SUV", icon: require("@/assets/images/icons/suv.png") },
        { name: "Sedan", value: "Sedan", icon: require("@/assets/images/icons/sedan.png") },
        { name: "Hatchback", value: "Hatchback", icon: require("@/assets/images/icons/hatchback.png") },
        { name: "Coupe", value: "Coupe", icon: require("@/assets/images/icons/coupe.png") },
        { name: "Hybrid", value: "Hybrid", icon: require("@/assets/images/icons/hybrid.png") },
        { name: "Convertible", value: "Convertible", icon: require("@/assets/images/icons/convertible.png") },
        { name: "Van", value: "Van", icon: require("@/assets/images/icons/van.png") },
        { name: "Truck", value: "Truck", icon: require("@/assets/images/icons/truck.png") },
        { name: "Electric", value: "Electric", icon: require("@/assets/images/icons/electric.png") },
      ],
      favorites: JSON.parse(localStorage.getItem("favorites")) || [], // Lista de favoritos
      splideOptionsVehicles: {
        type: "loop",
        perPage: 4,
        gap: ".5rem",
        pagination: false,
        autoplay: true,
        breakpoints: {
          768: { perPage: 1 },
          1024: { perPage: 2 },
          1400: { perPage: 3 },
        },
      },
      splideOptionsBrands: {
        type: "loop",
        perPage: 3,
        gap: "1rem",
        pagination: true,
        autoplay: false,
        breakpoints: {
          768: { perPage: 1 },
          1024: { perPage: 2 },
        },
      },
    };
  },
  methods: {
    // Busca todos os veículos do backend
    async fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        this.vehicles = response.data;

        // Gerar lista única de marcas
        this.uniqueBrands = [...new Set(this.vehicles.map((vehicle) => vehicle.marca))];

        // Inicialmente mostrar todos os veículos
        this.filteredVehicles = [...this.vehicles];
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    },

    // Filtro por tipo de carroceria
    filterByCarBody(carBody) {
      this.filteredVehicles = this.vehicles.filter((vehicle) => vehicle.carroceria === carBody);
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

    // Filtra veículos por marca
    filterByBrand(brand) {
      this.selectedBrand = brand;
      if (brand) {
        this.filteredVehicles = this.vehicles.filter((vehicle) => vehicle.marca === brand);
      } else {
        this.filteredVehicles = [...this.vehicles]; // Reseta o filtro
      }
    },

    // Exibe detalhes do veículo
    viewDetails(vehicleId) {
      this.$router.push(`/details/${vehicleId}`);
    },
  },
  mounted() {
    this.fetchVehicles(); // Busca veículos ao montar o componente

    // Configuração do vídeo em destaque
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
      console.error("Play button or video element não encontrado!");
    }
  },
};
</script>
