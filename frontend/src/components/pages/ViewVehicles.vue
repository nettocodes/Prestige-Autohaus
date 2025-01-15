<template>
  <div>
    <div class="main-container">
      <button 
        class="toggle-filter-btn" 
        @click="toggleFilters" 
        v-if="isSmallScreen"
      >
        {{ 'Filtros' }}
      </button>
      <aside
        class="filter-container"
        :style="{ top: `${headerHeight}px` }"
        v-if="!checkSmallScreen || showFilters"
      >
        <div v-if="checkSmallScreen" class="filter-toggle-btn-container">
          <button class="filter-toggle-btn" @click="showFilters = !showFilters">
            {{ showFilters ? "Fechar Filtros" : "Abrir Filtros" }}
          </button>
        </div>
        <div class="filter-container-inner">
          <h4 class="filter-subtitle">Marcas</h4>
          <div class="splide-brand-filter">
            <Splide
              :options="{
                type: 'loop',
                gap: '0.25rem', // Menor espaçamento entre os itens
                pagination: false,
                arrows: false,
                drag: true,
                perPage: 8, // Quantidade inicial de itens visíveis
                breakpoints: {
                  1024: { perPage: 8, gap: '0.2rem' }, // Ajuste para telas menores
                  768: { perPage: 8, gap: '0.15rem' },
                  480: { perPage: 8, gap: '0.1rem' },
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


          <h4 class="filter-subtitle">Selecione a Marca</h4>
          <select v-model="selectedMarca" @change="applyFilters" class="filter-select">
            <option value="" disabled>Selecione uma marca</option>
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
          <div class="filter-content-clear">
            <button class="filter-btn-clear" @click="clearFilters">Limpar Filtros</button>
          </div>
        </div>
      </aside>



      <div class="vehicles-container">
        <div class="vehicle-count">
          <span>Veículos encontrados: {{ filteredVehicles.length }}</span>
        </div>
        <div class="vehicle-grid">
        
        <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000, }">
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
      headerHeight: 0,
      vehicles: [],
      filteredVehicles: [],
      showFilters: false, // Controla a visibilidade dos filtros
      isSmallScreen: false, // Detecta se a tela é <= 768px
      favorites: JSON.parse(localStorage.getItem("favorites")) || [],
      searchQuery: "",
      uniqueBrands: [],
      selectedMarca: "",
      opcionaisDisponiveis: [ 'Airbag', 'Alarme', 'Ar condicionado', 'Ar quente', 'Banco com regulagem de altura', 'Bancos dianteiros com aquecimento', 'Bancos em couro', 'Capota marítima', 'CD e mp3 player', 'CD player', 'Computador de bordo', 'Controle automático de velocidade', 'Controle de tração', 'Desembaçador traseiro', 'Direção hidráulica', 'Disqueteira', 'DVD player', 'Encosto de cabeça traseiro', 'Farol de xenônio', 'Freio abs', 'GPS', 'Limpador traseiro', 'Protetor de caçamba', 'Rádio', 'Rádio e toca fitas', 'Retrovisor fotocrômico', 'Retrovisores elétricos', 'Rodas de liga leve', 'Sensor de chuva', 'Sensor de estacionamento', 'Teto solar', 'Tração 4x4', 'Travas elétricas', 'Vidros elétricos', 'Volante com regulagem de altura' ],
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
  computed: {
    checkSmallScreen() {
      return window.innerWidth <= 768;
    },
  },

  methods: {
    updateHeaderHeight() {
      const header = document.querySelector(".app-header");
      this.headerHeight = header ? header.offsetHeight : 0;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 768;
      if (!this.isSmallScreen) {
        this.showFilters = true; // Garante que os filtros apareçam em telas maiores
      }
    },
    async fetchVehicles() {
      try {
        const response = await axios.get("/api/vehicles");
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
        const response = await axios.post("/api/statistics/favorites", { vehicleId: vehicle.id });
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
      // Define a marca selecionada no Splide
      this.filteredVehicles = this.vehicles.filter((vehicle) => vehicle.marca === brand);
      this.selectedMarca = ""; // Reseta o select de marcas
    },
    applyFilters() {
      console.log("Aplicando filtros com os seguintes valores:", {
        priceFilter: this.priceFilter,
        kmFilter: this.kmFilter,
        conditionFilter: this.conditionFilter,
        portasFilter: this.portasFilter,
        tractionFilter: this.tractionFilter,
        transmissionFilter: this.transmissionFilter,
        carBodyFilter: this.carBodyFilter,
        opcionaisFilter: this.filters.opcionais,
      });

      this.filteredVehicles = this.vehicles.filter((vehicle) => {
        const searchMatch = `${vehicle.marca} ${vehicle.modelo}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const priceMatch =
          (!this.priceFilter.min || vehicle.preco >= this.priceFilter.min) &&
          (!this.priceFilter.max || vehicle.preco <= this.priceFilter.max);
        const kmMatch = !this.kmFilter.maxRange || this.matchKilometragem(vehicle.quilometragem);
        const conditionMatch = !this.conditionFilter || vehicle.condicao === this.conditionFilter;
        const portasMatch = !this.portasFilter || vehicle.portas === parseInt(this.portasFilter);
        const tractionMatch = !this.tractionFilter || vehicle.driveType === this.tractionFilter;
        const transmissionMatch =
          !this.transmissionFilter || vehicle.transmissao === this.transmissionFilter;
        const carBodyMatch = !this.carBodyFilter || vehicle.carroceria === this.carBodyFilter;
        const colorMatch =
          !this.colorFilter || vehicle.cor.toLowerCase().includes(this.colorFilter.toLowerCase());

        // Verifica se opcionais está definido e converte para string antes de aplicar o split
        const vehicleOpcionais = String(vehicle.opcionais || "")
          .split(",")
          .map((opcional) => opcional.trim().toLowerCase());
        const selectedOpcionais = this.filters.opcionais.map((opcional) =>
          opcional.trim().toLowerCase()
        );

        // Verifica se todos os opcionais selecionados estão presentes no veículo
        const opcionaisMatch =
          selectedOpcionais.length === 0 || // Nenhum filtro de opcionais selecionado
          selectedOpcionais.every((opcional) => vehicleOpcionais.includes(opcional));

        console.log("Verificando veículo:", {
          id: vehicle.id,
          marca: vehicle.marca,
          opcionais: vehicleOpcionais,
          selectedOpcionais,
          opcionaisMatch,
        });

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

      console.log("Veículos filtrados:", this.filteredVehicles);
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
        await axios.post("/api/statistics/views", {
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
      this.selectedMarca = ""; // Reseta a seleção de marca
      this.priceFilter = { min: null, max: null }; // Reseta os preços
      this.kmFilter.maxRange = ""; // Reseta a quilometragem
      this.conditionFilter = ""; // Reseta a condição
      this.portasFilter = ""; // Reseta as portas
      this.tractionFilter = ""; // Reseta a tração
      this.transmissionFilter = ""; // Reseta a transmissão
      this.carBodyFilter = ""; // Reseta a carroceria
      this.colorFilter = ""; // Reseta a cor
      this.filters.opcionais = []; // Reseta os opcionais
      this.searchQuery = ""; // Reseta a pesquisa
      this.filteredVehicles = [...this.vehicles]; // Reseta os veículos filtrados
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
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
    this.updateHeaderHeight();
    window.addEventListener("resize", this.updateHeaderHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    window.removeEventListener("resize", this.updateHeaderHeight);
  },
  created() {
    this.fetchVehicles();
  },
};
</script>
