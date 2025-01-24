<template>
  <div id="app">
    <AppHero />
    <div class="landing-page">
      <!-- Hero Section -->

      <section class="brand-section">
        <div class="brand-content">
          <header class="section-header" data-aos="fade-down">
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
          <SplideSlide v-for="vehicle in filteredVehiclesForAll" :key="vehicle.id">
            <div class="custom-vehicle-card">
              <div class="custom-vehicle-image">
                <Splide :options="splideOptionsInner">
                  <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                    <img :src="`/api/uploads/${foto}`" alt="Foto do Veículo" />
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
            <video
              id="highlight-video"
              poster="assets/images/car-highlight.jpg"
              preload="none"
              class="video"
              muted
              autoplay
            >
              <source src="@/assets/videos/back.webm" type="video/webm" />
              Seu navegador não suporta vídeos.
            </video>
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
              <SplideSlide v-for="brand in uniqueBrands" :key="brand">
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
                  <img :src="`/api/uploads/${vehicle.fotos[0]}`" alt="Foto do Veículo" />
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
import AOS from "aos";
import "@/assets/LandingPage.css";

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
        perPage: 4,
        gap: ".5rem",
        pagination: false,
        focus: "center",
        autoplay: false,
        lazyLoad: "nearby",
        trimSpace: false,
        breakpoints: {
          768: { perPage: 2 },
          480: { perPage: 2 },
        },
      },
      splideOptionsBrands: {
        type: "loop",
        perPage: 3,
        gap: "1rem", // Espaço entre slides
        pagination: false,
        focus: "center",
        autoplay: true,
        lazyLoad: "nearby",
        trimSpace: true,
        arrows: true, // Garante setas de navegação
        breakpoints: {
          1024: { perPage: 3, gap: "0.5rem" }, // Tablets
          768: { perPage: 1, gap: "0.5rem" }, // Telas menores
        },
      },

      splideOptionsInner: {
        type: "loop",
        autoplay: true,
        interval: 3000,
        focus: "center",
      },
      splideOptionsTabs: {
        type: "carousel",
        perPage: 8, // Exibe o máximo possível por página
        gap: "0rem", // Espaçamento entre os itens
        pagination: false, // Remove os indicadores de página
        arrows: false, // Exibe setas de navegação
        autoplay: false, // Evita rotação automática
        breakpoints: {
          1200: { perPage: 6 }, // Em telas menores, exibe menos tabs
          1024: { perPage: 5 },
          768: { perPage: 3 },
          480: { perPage: 2 },
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
    AOS.init({
      duration: 1000, // Duração das animações
      once: true, // Animação ocorre apenas uma vez
    });
    this.fetchVehicles(); 
  },
  
};
</script>
