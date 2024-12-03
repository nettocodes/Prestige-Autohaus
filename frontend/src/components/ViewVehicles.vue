<template>
    <div>
      <!-- Header -->
      <header class="header">
        <nav class="navbar">
          <h1>Vehicle Management System</h1>
          <ul class="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Comprar</a></li>
            <li><a href="#">Vender</a></li>
            <li><a href="#">Serviços</a></li>
          </ul>
        </nav>
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Digite marca ou modelo do carro" @input="applyFilters" />
        </div>
      </header>
  
      <!-- Layout Principal -->
      <div class="main-container">
        <!-- Filtros -->
        <aside class="filters">
          <h3>Filtros</h3>
  
          <!-- Marcas -->
          <h4>Marcas</h4>
          <div>
            <button v-for="marca in uniqueBrands" :key="marca" @click="filterByBrand(marca)">
              {{ marca }}
            </button>
          </div>
  
          <!-- Faixa de Preço -->
          <h4>Faixa de Preço</h4>
          <input type="number" v-model="priceFilter.min" placeholder="Mínimo" @input="applyFilters" />
          <input type="number" v-model="priceFilter.max" placeholder="Máximo" @input="applyFilters" />
  
          <!-- Quilometragem -->
          <h4>Quilometragem</h4>
          <input type="number" v-model="kmFilter.max" placeholder="Máximo (km)" @input="applyFilters" />
  
          <!-- Opcionais -->
          <h4>Opcionais</h4>
          <div v-for="opcional in opcionaisDisponiveis" :key="opcional">
            <label>
              <input type="checkbox" :value="opcional" v-model="filters.opcionais" @change="applyFilters" />
              {{ opcional }}
            </label>
          </div>
        </aside>
  
        <!-- Grid de Veículos -->
        <main class="vehicle-grid">
          <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
            <div class="vehicle-image">
              <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
                <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                  <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
                </SplideSlide>
              </Splide>
            </div>
            <div class="vehicle-info">
              <h3>{{ vehicle.marca || "Não informado" }} {{ vehicle.modelo || "Não informado" }}</h3>
              <p class="price">R$ {{ vehicle.preco ? new Intl.NumberFormat().format(vehicle.preco) : "Não informado" }}</p>
              <p>
                <strong>Ano:</strong> {{ vehicle.ano || "Não informado" }} |
                <strong>Quilometragem:</strong>
                {{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}
              </p>
              <p><strong>Cor:</strong> {{ vehicle.cor || "Não informado" }}</p>
              <p><strong>Combustível:</strong> {{ vehicle.combustivel || "Não informado" }}</p>
              <p><strong>Transmissão:</strong> {{ vehicle.transmissao || "Não informado" }}</p>
              <p><strong>Opcionais:</strong> {{ vehicle.opcionais.length > 0 ? vehicle.opcionais.join(", ") : "Nenhum" }}</p>
              <p><strong>Descrição:</strong> {{ vehicle.descricao || "Sem descrição disponível" }}</p>
              <button class="btn">Ver parcelas</button>
            </div>
          </div>
        </main>
      </div>
  
      <!-- Footer -->
      <footer class="footer">
        <p>© 2024 WebMotors Clone - Todos os direitos reservados</p>
      </footer>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import "@splidejs/vue-splide/css";
  import { Splide, SplideSlide } from "@splidejs/vue-splide";
  
  export default {
    components: {
      Splide,
      SplideSlide,
    },
    data() {
      return {
        vehicles: [],
        filteredVehicles: [],
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
          max: null,
        },
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
          this.filteredVehicles = this.vehicles; // Inicialmente, exibir todos
          this.uniqueBrands = [...new Set(this.vehicles.map((v) => v.marca))]; // Obter marcas únicas
        } catch (err) {
          alert("Erro ao buscar veículos.");
        }
      },
      applyFilters() {
        this.filteredVehicles = this.vehicles.filter((vehicle) => {
          // Filtro de pesquisa por marca e modelo
          const searchMatch = `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(this.searchQuery.toLowerCase());
  
          // Filtro de preço
          const priceMatch =
            (!this.priceFilter.min || vehicle.preco >= this.priceFilter.min) &&
            (!this.priceFilter.max || vehicle.preco <= this.priceFilter.max);
  
          // Filtro de quilometragem
          const kmMatch = !this.kmFilter.max || vehicle.quilometragem <= this.kmFilter.max;
  
          // Filtro de opcionais
          const opcionaisMatch =
            this.filters.opcionais.length === 0 ||
            this.filters.opcionais.every((opcional) => vehicle.opcionais.includes(opcional));
  
          return searchMatch && priceMatch && kmMatch && opcionaisMatch;
        });
      },
      filterByBrand(brand) {
        this.filteredVehicles = this.vehicles.filter((vehicle) => vehicle.marca === brand);
      },
    },
    created() {
      this.fetchVehicles();
    },
  };
  </script>
  