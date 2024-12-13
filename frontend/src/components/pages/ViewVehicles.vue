<template>
  <div>
    <div class="main-container">
      <!-- Filtros -->
      <aside class="filter-container">
        <div class="row-container">
          <div class="splide-brand-container">
  
            <h4 class="filter-subtitle">Marcas</h4>
            <div class="splide-brand-filter">
              <Splide
                :options="{
                  type: 'carousel', // Tipo de carrossel
                  gap: '0rem', // Espaçamento entre os slides
                  pagination: false, // Remove a paginação
                  arrows: false, // Remove as setas
                  perPage: 6, // Exibe 6 slides visíveis por padrão
                  fixedHeight: '80px', // Altura padrão para os slides
                  breakpoints: {
                    768: {
                      perPage: 1, // Apenas 1 slide visível em telas menores
                      direction: 'ttb', // Direção vertical para telas <= 768px
                      fixedHeight: '50px', // Ajusta a altura dos slides para telas menores
                      height: '100%', // Garante que ocupe toda a altura disponível
                      gap: '.5rem', // Remove o espaçamento entre os slides
                    },
                    480: {
                      perPage: 1, // Apenas 1 slide visível em telas menores
                      direction: 'ttb', // Direção vertical para telas <= 768px
                      fixedHeight: '40px', // Ajusta a altura dos slides para telas menores
                      height: '100%', // Garante que ocupe toda a altura disponível
                      gap: '0rem', // Remove o espaçamento entre os slides
                    },
                  },
                }"
                class="brand-splide"
              >
                <SplideSlide v-for="marca in uniqueBrands" :key="marca">
                  <div class="brand-filter-splide" @click="filterByBrand(marca)">
                    <img :src="getBrandImage(marca)" :alt="marca" class="brand-logo" />
                  </div>
                </SplideSlide>
              </Splide>
    
            </div>
          </div>

          <div class="filter-container-inner">
            <h4 class="filter-subtitle">Selecione a Marca</h4>
            <select v-model="selectedMarca" @change="applyFilters" class="filter-select">
              <option value="" disabled selected>Selecione uma marca</option>
              <option v-for="marca in uniqueBrands" :key="marca" :value="marca">{{ marca }}</option>
            </select>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Faixa de Preço</h4>
              <div class="filter-range-group">
                <input
                  type="number"
                  v-model="priceFilter.min"
                  placeholder="Mínimo"
                  @input="applyFilters"
                  class="filter-input"
                />
                <input
                  type="number"
                  v-model="priceFilter.max"
                  placeholder="Máximo"
                  @input="applyFilters"
                  class="filter-input"
                />
              </div>
            </div>
            <div class="filter-content">
              <h4 class="filter-subtitle">Quilometragem</h4>
              <select v-model="kmFilter.maxRange" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="0">0km</option>
                <option value="0-10">0-10mil km</option>
                <option value="10-50">10-50mil km</option>
                <option value="50-100">50-100mil km</option>
                <option value="100-200">100-200mil km</option>
                <option value="200+">200+ mil km</option>
              </select>
            </div>
  
            <div class="filter-content">   
              <h4 class="filter-subtitle">Condição</h4>
              <select v-model="conditionFilter" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="Novo">Novo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Portas</h4>
              <select v-model="portasFilter" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="2">2 Portas</option>
                <option value="4">4 Portas</option>
              </select>
            </div>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Tração</h4>
              <select v-model="tractionFilter" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="4x2">4x2</option>
                <option value="4x4">4x4</option>
                <option value="AWD">AWD</option>
              </select>
            </div>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Transmissão</h4>
              <select v-model="transmissionFilter" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Carroceria</h4>
              <select v-model="carBodyFilter" @change="applyFilters" class="filter-select">
                <option value="">Todas</option>
                <option value="Hatch">Hatch</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
  
            <div class="filter-content">
              <h4 class="filter-subtitle">Opcionais</h4>
              <div v-for="opcional in opcionaisDisponiveis" :key="opcional" class="filter-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    :value="opcional"
                    v-model="filters.opcionais"
                    @change="applyFilters"
                    class="filter-checkbox"
                  />
                  {{ opcional }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <button class="filter-btn-clear" @click="clearFilters">Limpar</button>
      </aside>

      <!-- Grade de Veículos -->
      <div class="vehicle-grid">
        <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000, }">
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
            <h4>{{ vehicle.modelo || "Não informado" }}</h4>
            <p class="price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
            <div class="vehicle-info-details">
              <p>{{ vehicle.ano || "Não informado" }}</p>
              <p>{{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
              <p>{{ vehicle.transmissao || "Não informado" }}</p>
            </div>

            <button class="btn" @click="viewDetails(vehicle.id)">Ver Detalhes</button>
            
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import "@/assets/VehicleStyles.css";
import axios from "axios";
import "@splidejs/vue-splide/css";
import { Splide, SplideSlide } from "@splidejs/vue-splide";

export default {
  name: "ViewVehicles",
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      vehicles: [],
      filteredVehicles: [],
      favorites: JSON.parse(localStorage.getItem("favorites")) || [],
      searchQuery: "",
      uniqueBrands: [],
      opcionaisDisponiveis: ["Banco de couro", "Teto solar", "Câmera de ré", "Ar-condicionado"],
      filters: {
        opcionais: [],
      },
      priceFilter: {
        min: null,
        max: null,
      },
      kmFilter: {
        maxRange: "",
      },
      conditionFilter: "",
      portasFilter: "",
      tractionFilter: "",
      transmissionFilter: "",
      carBodyFilter: "",
      colorFilter: "",
    };
  },
  methods: {
    async fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        this.vehicles = response.data.map((vehicle) => ({
          ...vehicle,
          quilometragem: vehicle.quilometragem || 0,
          preco: vehicle.preco || 0,
          opcionais: vehicle.opcionais || [],
          fotos: vehicle.fotos || [],
        }));
        this.uniqueBrands = [...new Set(this.vehicles.map((v) => v.marca))];
        this.applyInitialFilter();
      } catch (err) {
        console.error("Erro ao buscar veículos:", err);
        alert("Erro ao buscar veículos.");
      }
    },
    matchKilometragem(quilometragem) {
      if (this.kmFilter.maxRange === "0") {
        return quilometragem === 0;
      } else if (this.kmFilter.maxRange === "0-10") {
        return quilometragem > 0 && quilometragem <= 10000;
      } else if (this.kmFilter.maxRange === "10-50") {
        return quilometragem > 10000 && quilometragem <= 50000;
      } else if (this.kmFilter.maxRange === "50-100") {
        return quilometragem > 50000 && quilometragem <= 100000;
      } else if (this.kmFilter.maxRange === "100-200") {
        return quilometragem > 100000 && quilometragem <= 200000;
      } else if (this.kmFilter.maxRange === "200+") {
        return quilometragem > 200000;
      }
      return true;
    },
    getSessionId() {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    },
    async toggleFavorite(vehicle) {
      try {
        const response = await axios.post("http://localhost:5000/api/statistics/favorites", { vehicleId: vehicle.id });
        console.log(response.data.message);

        const index = this.favorites.findIndex((fav) => fav.id === vehicle.id);
        if (index > -1) {
          this.favorites.splice(index, 1);
        } else {
          this.favorites.push(vehicle);
        }

        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      } catch (err) {
        console.error("Erro ao registrar favorito:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    isFavorite(id) {
      return this.favorites.some((fav) => fav.id === id);
    },
    filterByBrand(brand) {
      this.filteredVehicles = this.vehicles.filter((vehicle) => vehicle.marca === brand);
    },
    applyFilters() {
      this.filteredVehicles = this.vehicles.filter((vehicle) => {
        const searchMatch = `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(this.searchQuery.toLowerCase());
        const priceMatch =
          (!this.priceFilter.min || vehicle.preco >= this.priceFilter.min) &&
          (!this.priceFilter.max || vehicle.preco <= this.priceFilter.max);
        const kmMatch = !this.kmFilter.maxRange || this.matchKilometragem(vehicle.quilometragem);
        const conditionMatch = !this.conditionFilter || vehicle.condicao === this.conditionFilter;
        const portasMatch = !this.portasFilter || vehicle.portas === parseInt(this.portasFilter);
        const tractionMatch = !this.tractionFilter || vehicle.driveType === this.tractionFilter;
        const transmissionMatch = !this.transmissionFilter || vehicle.transmissao === this.transmissionFilter;
        const carBodyMatch = !this.carBodyFilter || vehicle.carroceria === this.carBodyFilter;
        const colorMatch = !this.colorFilter || vehicle.cor.toLowerCase().includes(this.colorFilter.toLowerCase());
        const opcionaisMatch =
          this.filters.opcionais.length === 0 ||
          this.filters.opcionais.every((opcional) => vehicle.opcionais.includes(opcional));
        return (
          searchMatch &&
          priceMatch &&
          kmMatch &&
          conditionMatch &&
          portasMatch &&
          tractionMatch &&
          transmissionMatch &&
          carBodyMatch &&
          colorMatch &&
          opcionaisMatch
        );
      });
    },
    applyInitialFilter() {
      const brand = this.$route.query.brand;
      if (brand) {
        this.filterByBrand(brand);
      } else {
        this.filteredVehicles = [...this.vehicles];
      }
    },
    async viewDetails(vehicleId) {
      try {
        const sessionId = this.getSessionId();
        await axios.post("http://localhost:5000/api/statistics/views", {
          vehicleId,
          sessionId,
        });
        this.$router.push({ path: `/details/${vehicleId}` });
      } catch (error) {
        console.error("Erro ao registrar visualização:", error);
      }
    },
    getBrandImage(brand) {
      const normalizedBrand = brand.toLowerCase().replace(/\s+/g, "-");
      try {
        return require(`@/assets/images/logos/${normalizedBrand}.webp`);
      } catch {
        return "/src/assets/images/logos/default.webp";
      }
    },
    clearFilters() {
      this.selectedMarca = "";
      this.priceFilter.min = null;
      this.priceFilter.max = null;
      this.kmFilter.max = null;
      this.conditionFilter = "";
      this.portasFilter = "";
      this.tractionFilter = "";
      this.transmissionFilter = "";
      this.carBodyFilter = "";
      this.colorFilter = "";
      this.filters.opcionais = [];
      this.applyFilters();
    },
  },
  watch: {
    vehicles() {
      this.$nextTick(() => {
        const splides = document.querySelectorAll(".splide");
        splides.forEach((splide) => {
          const instance = splide.splide;
          if (instance) {
            instance.refresh();
          }
        });
      });
    },
  },
  created() {
    this.fetchVehicles();
  },
};
</script>
